// Guestbook rules shared by the Worker (authoritative) and the website (instant feedback only).
// Pure TypeScript, no Cloudflare or DOM APIs, so it's unit-tested from the root project.

export const LIMITS = {
  nicknameMax: 24,
  messageMax: 280,
  /** Your replies can be a bit longer than visitor messages. */
  replyMax: 1000,
  maxLinks: 2,
  /** Paint canvas size. Drawings must be a PNG of exactly this size. */
  drawingWidth: 360,
  drawingHeight: 240,
  /** Decoded PNG bytes. A doodle at this size is usually 5–40 KB. */
  drawingMaxBytes: 150_000,
  pageSizeDefault: 10,
  pageSizeMax: 20,
} as const;

export type ErrorCode = "nickname" | "message" | "links" | "drawing" | "captcha" | "rate" | "busy" | "invalid" | "origin" | "auth" | "reply" | "not_found";

// Invisible/format characters that can spoof text direction or hide content (Trojan-source style),
// plus C0/C1 control characters. Newlines are handled separately.
const INVISIBLE = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F​-‏‪-‮⁠-⁤⁦-⁩﻿]/g;

export const charCount = (s: string) => [...s].length;

export function cleanNickname(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const s = raw.normalize("NFC").replace(/\r?\n|\r/g, " ").replace(INVISIBLE, "").replace(/\s+/g, " ").trim();
  const n = charCount(s);
  return n >= 1 && n <= LIMITS.nicknameMax ? s : null;
}

export function cleanMessage(raw: unknown, max: number = LIMITS.messageMax): string | null {
  if (typeof raw !== "string") return null;
  const s = raw
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(INVISIBLE, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const n = charCount(s);
  return n >= 1 && n <= max ? s : null;
}

export const cleanReply = (raw: unknown) => cleanMessage(raw, LIMITS.replyMax);

/**
 * Visitor mailbox keys: 32 random bytes as hex. A visitor's browser keeps it and uses it to read
 * their own messages + your replies. The server only stores its SHA-256.
 */
export const isVisitorToken = (v: unknown): v is string => typeof v === "string" && /^[a-f0-9]{64}$/.test(v);

export const countLinks = (s: string) => (s.match(/https?:\/\/|www\./gi) ?? []).length;

export type EntryInput =
  | { ok: true; nickname: string; message: string }
  | { ok: false; error: ErrorCode };

export function validateEntry(body: { nickname?: unknown; message?: unknown }): EntryInput {
  const nickname = cleanNickname(body.nickname);
  if (!nickname) return { ok: false, error: "nickname" };
  const message = cleanMessage(body.message);
  if (!message) return { ok: false, error: "message" };
  if (countLinks(message) > LIMITS.maxLinks) return { ok: false, error: "links" };
  return { ok: true, nickname, message };
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * Checks the bytes really are a PNG of the expected size: signature, IHDR as the first chunk,
 * exact dimensions, an IEND chunk at the very end, and the size limit. We never decode pixels;
 * browsers only ever display it through <img>, served as image/png with nosniff.
 */
export function validatePng(bytes: Uint8Array): boolean {
  if (bytes.length < 57 || bytes.length > LIMITS.drawingMaxBytes) return false;
  if (!PNG_SIGNATURE.every((b, i) => bytes[i] === b)) return false;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ihdrLength = view.getUint32(8);
  const ihdrType = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]);
  if (ihdrLength !== 13 || ihdrType !== "IHDR") return false;
  if (view.getUint32(16) !== LIMITS.drawingWidth || view.getUint32(20) !== LIMITS.drawingHeight) return false;
  const tail = String.fromCharCode(...bytes.slice(bytes.length - 8, bytes.length - 4));
  return tail === "IEND";
}

const DATA_URL_PREFIX = "data:image/png;base64,";

/** Decodes a PNG data URL into validated bytes, or null if anything is off. */
export function decodeDrawing(dataUrl: unknown): Uint8Array | null {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith(DATA_URL_PREFIX)) return null;
  const b64 = dataUrl.slice(DATA_URL_PREFIX.length);
  // Base64 is ~4/3 the size of the bytes; reject oversized input before decoding it.
  if (b64.length > Math.ceil((LIMITS.drawingMaxBytes * 4) / 3) + 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(b64)) return null;
  let bin: string;
  try { bin = atob(b64); } catch { return null; }
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return validatePng(bytes) ? bytes : null;
}

/** Parses ?before=&limit= into safe integers. */
export function parsePage(params: URLSearchParams): { before: number | null; limit: number } {
  const before = Number(params.get("before"));
  const limit = Number(params.get("limit") ?? LIMITS.pageSizeDefault);
  return {
    before: Number.isSafeInteger(before) && before > 0 ? before : null,
    limit: Number.isInteger(limit) ? Math.min(Math.max(limit, 1), LIMITS.pageSizeMax) : LIMITS.pageSizeDefault,
  };
}
