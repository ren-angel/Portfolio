import { describe, expect, it } from "vitest";
import { deflateSync } from "node:zlib";
import { LIMITS, cleanMessage, cleanNickname, cleanReply, decodeDrawing, isVisitorToken, parsePage, validateEntry, validatePng } from "../guestbook-api/src/rules";

function crc32(buf: Uint8Array) {
  let c, crc = 0xffffffff;
  for (const b of buf) { c = (crc ^ b) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; }
  return (crc ^ 0xffffffff) >>> 0;
}
function png(w: number, h: number) {
  const chunk = (type: string, data: Uint8Array) => {
    const out = new Uint8Array(12 + data.length);
    const v = new DataView(out.buffer);
    v.setUint32(0, data.length);
    out.set(new TextEncoder().encode(type), 4);
    out.set(data, 8);
    v.setUint32(8 + data.length, crc32(out.slice(4, 8 + data.length)));
    return out;
  };
  const ihdr = new Uint8Array(13);
  new DataView(ihdr.buffer).setUint32(0, w);
  new DataView(ihdr.buffer).setUint32(4, h);
  ihdr.set([8, 2, 0, 0, 0], 8);
  const raw = new Uint8Array((w * 3 + 1) * h).fill(255);
  const parts = [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", new Uint8Array())];
  const all = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) { all.set(p, o); o += p.length; }
  return all;
}
const toDataUrl = (b: Uint8Array) => "data:image/png;base64," + Buffer.from(b).toString("base64");

describe("guestbook text rules", () => {
  it("trims, collapses whitespace and enforces nickname length", () => {
    expect(cleanNickname("  Ren \n chan ")).toBe("Ren chan");
    expect(cleanNickname("   ")).toBeNull();
    expect(cleanNickname("x".repeat(LIMITS.nicknameMax))).not.toBeNull();
    expect(cleanNickname("x".repeat(LIMITS.nicknameMax + 1))).toBeNull();
    expect(cleanNickname(42)).toBeNull();
  });
  it("counts emoji as single characters", () => {
    expect(cleanNickname("🐱".repeat(LIMITS.nicknameMax))).not.toBeNull();
  });
  it("strips direction overrides, zero-width and control characters", () => {
    expect(cleanNickname("a‮b​c\u0007")).toBe("abc");
    expect(cleanMessage("hi⁦there﻿")).toBe("hithere");
  });
  it("normalizes newlines and enforces message length", () => {
    expect(cleanMessage("a\r\n\r\n\r\n\r\nb")).toBe("a\n\nb");
    expect(cleanMessage("x".repeat(LIMITS.messageMax + 1))).toBeNull();
    expect(cleanMessage("")).toBeNull();
  });
  it("keeps HTML as plain text (rendering escapes it)", () => {
    expect(cleanMessage("<img src=x onerror=alert(1)>")).toBe("<img src=x onerror=alert(1)>");
  });
  it("validates whole entries and limits links", () => {
    expect(validateEntry({ nickname: "Ren", message: "hi ♡" })).toEqual({ ok: true, nickname: "Ren", message: "hi ♡" });
    expect(validateEntry({ nickname: "", message: "hi" })).toEqual({ ok: false, error: "nickname" });
    expect(validateEntry({ nickname: "Ren", message: " " })).toEqual({ ok: false, error: "message" });
    expect(validateEntry({ nickname: "Ren", message: "http://a https://b www.c" })).toEqual({ ok: false, error: "links" });
  });
});

describe("guestbook drawings", () => {
  it("accepts a PNG of the exact canvas size", () => {
    const ok = png(LIMITS.drawingWidth, LIMITS.drawingHeight);
    expect(validatePng(ok)).toBe(true);
    expect(decodeDrawing(toDataUrl(ok))).toEqual(ok);
  });
  it("rejects wrong sizes, non-PNGs, truncation and bad data URLs", () => {
    expect(validatePng(png(100, 100))).toBe(false);
    const truncated = png(LIMITS.drawingWidth, LIMITS.drawingHeight).slice(0, -12);
    expect(validatePng(truncated)).toBe(false);
    expect(decodeDrawing("data:image/svg+xml;base64,PHN2Zz4=")).toBeNull();
    expect(decodeDrawing("data:image/png;base64,!!!")).toBeNull();
    expect(decodeDrawing(toDataUrl(new TextEncoder().encode("<html>not a png</html>".repeat(5))))).toBeNull();
    expect(decodeDrawing(12)).toBeNull();
  });
  it("rejects oversized drawings before decoding", () => {
    expect(decodeDrawing("data:image/png;base64," + "A".repeat(LIMITS.drawingMaxBytes * 2))).toBeNull();
  });
});

describe("pagination params", () => {
  it("clamps and sanitizes", () => {
    expect(parsePage(new URLSearchParams(""))).toEqual({ before: null, limit: LIMITS.pageSizeDefault });
    expect(parsePage(new URLSearchParams("before=12&limit=5"))).toEqual({ before: 12, limit: 5 });
    expect(parsePage(new URLSearchParams("before=-3&limit=999"))).toEqual({ before: null, limit: LIMITS.pageSizeMax });
    expect(parsePage(new URLSearchParams("before=abc&limit=1.5"))).toEqual({ before: null, limit: LIMITS.pageSizeDefault });
  });
});

describe("private mailbox", () => {
  it("replies get the same cleaning with a longer limit", () => {
    expect(cleanReply("  thanks!\u202E  ")).toBe("thanks!");
    expect(cleanReply("x".repeat(LIMITS.replyMax))).not.toBeNull();
    expect(cleanReply("x".repeat(LIMITS.replyMax + 1))).toBeNull();
    expect(cleanReply("   ")).toBeNull();
    expect(cleanReply(null)).toBeNull();
  });
  it("only accepts well-formed mailbox keys", () => {
    expect(isVisitorToken("a".repeat(64))).toBe(true);
    expect(isVisitorToken("A".repeat(64))).toBe(false);
    expect(isVisitorToken("a".repeat(63))).toBe(false);
    expect(isVisitorToken("' OR 1=1 --")).toBe(false);
    expect(isVisitorToken(undefined)).toBe(false);
  });
});
