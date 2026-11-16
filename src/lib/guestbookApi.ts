// Client for the guestbook Worker (guestbook-api/). Configured at build time:
//   VITE_GUESTBOOK_API        e.g. https://guestbook.<you>.workers.dev
//   VITE_TURNSTILE_SITE_KEY   public Turnstile site key (safe to ship to browsers)
// When either is missing the guestbook shows an honest "not connected yet" state.
//
// Messages are private. A visitor's browser keeps a random "mailbox key" (localStorage) that lets
// it read its own messages and the owner's replies. The owner's Inbox password is typed in by the
// owner and kept in sessionStorage (or localStorage if "remember this device" is ticked). It is
// never part of the site's code.
import type { ErrorCode } from "../../guestbook-api/src/rules";

export const API_BASE = (import.meta.env.VITE_GUESTBOOK_API ?? "").replace(/\/+$/, "");
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";
export const guestbookConfigured = Boolean(API_BASE && TURNSTILE_SITE_KEY);

export interface Entry {
  id: number; nickname: string; message: string; createdAt: number; hasDrawing: boolean;
  reply: string | null; repliedAt: number | null;
}
export interface Page { entries: Entry[]; nextCursor: number | null }

/** Error codes the UI knows how to explain (server codes + "network"/"generic"). */
export type GuestbookError = Exclude<ErrorCode, "invalid" | "origin" | "not_found"> | "network" | "generic";

export class GuestbookRequestError extends Error {
  constructor(public code: GuestbookError, public status = 0) { super(code); }
}

const KNOWN = new Set<GuestbookError>(["nickname", "message", "links", "drawing", "captcha", "rate", "busy", "auth", "reply"]);

async function raw(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_BASE}${path}`, init);
  } catch {
    throw new GuestbookRequestError("network");
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await raw(path, init);
  const data = await res.json().catch(() => null) as (T & { error?: string }) | null;
  if (!res.ok || !data) {
    const code = data?.error as GuestbookError | undefined;
    throw new GuestbookRequestError(code && KNOWN.has(code) ? code : "generic", res.status);
  }
  return data;
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

// ---------- visitor mailbox key ----------
const VISITOR_KEY = "guestbook-key";
export function getVisitorToken(): string | null {
  try { return localStorage.getItem(VISITOR_KEY); } catch { return null; }
}
export function forgetVisitorToken() {
  try { localStorage.removeItem(VISITOR_KEY); } catch { /* nothing to forget */ }
}

export async function postEntry(body: { nickname: string; message: string; drawing: string | null; turnstileToken: string; website: string }) {
  const data = await request<{ entry: Entry; visitorToken: string }>("/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, visitorToken: getVisitorToken() ?? undefined }),
  });
  try { localStorage.setItem(VISITOR_KEY, data.visitorToken); } catch { /* replies only visible this session */ }
  return data.entry;
}

export async function fetchMine(): Promise<Entry[]> {
  const token = getVisitorToken();
  if (!token) return [];
  return (await request<{ entries: Entry[] }>("/mine", { headers: auth(token) })).entries;
}

/** Drawings are private, so they're fetched with a key and shown through a blob: URL. */
export async function fetchDrawing(id: number, token: string): Promise<string> {
  const res = await raw(`/entries/${id}/drawing`, { headers: auth(token) });
  if (!res.ok) throw new GuestbookRequestError("generic", res.status);
  return URL.createObjectURL(await res.blob());
}

// ---------- owner inbox ----------
const ADMIN_KEY = "inbox-pass";
export function getAdminToken(): string | null {
  try { return sessionStorage.getItem(ADMIN_KEY) ?? localStorage.getItem(ADMIN_KEY); } catch { return null; }
}
export function saveAdminToken(token: string, remember: boolean) {
  try { (remember ? localStorage : sessionStorage).setItem(ADMIN_KEY, token); } catch { /* memory only */ }
}
export function clearAdminToken() {
  try { sessionStorage.removeItem(ADMIN_KEY); localStorage.removeItem(ADMIN_KEY); } catch { /* fine */ }
}

export const adminCheck = (token: string) => request<{ ok: true }>("/admin/check", { headers: auth(token) });

export function adminList(token: string, before?: number | null) {
  const q = new URLSearchParams({ limit: "20" });
  if (before) q.set("before", String(before));
  return request<Page>(`/admin/entries?${q}`, { headers: auth(token) });
}

export async function adminReply(token: string, id: number, reply: string | null) {
  return (await request<{ entry: Entry }>(`/admin/entries/${id}/reply`, {
    method: "PUT",
    headers: { ...auth(token), "Content-Type": "application/json" },
    body: JSON.stringify({ reply }),
  })).entry;
}

export const adminDelete = (token: string, id: number) =>
  request<{ ok: true }>(`/admin/entries/${id}`, { method: "DELETE", headers: auth(token) });
