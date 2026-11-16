// Guestbook API: a Cloudflare Worker + D1 (SQLite). Runs entirely on the Workers Free plan.
// Messages are PRIVATE: only the site owner can read all of them; each visitor can read their own
// messages (and the owner's replies) with the random mailbox key their browser received.
//
// Visitors
//   POST /entries                 { nickname, message, drawing?, turnstileToken, website, visitorToken? }
//                                 → { entry, visitorToken }
//   GET  /mine                    Authorization: Bearer <visitorToken> → your messages + replies
//   GET  /entries/:id/drawing     Bearer <visitorToken of the author> or the admin token
// Owner (Authorization: Bearer <ADMIN_TOKEN>)
//   GET    /admin/check
//   GET    /admin/entries?before=<id>&limit=<n>
//   PUT    /admin/entries/:id/reply   { reply: string | null }   (null removes the reply)
//   DELETE /admin/entries/:id
//   GET  /health
import {
  LIMITS, cleanReply, decodeDrawing, isVisitorToken, parsePage, validateEntry, type ErrorCode,
} from "./rules";

export interface Env {
  DB: D1Database;
  /** Comma-separated list of origins allowed to call the API from a browser. */
  ALLOWED_ORIGINS: string;
  /** Max new entries per UTC day across everyone (protects the free-tier write quota). */
  DAILY_ENTRY_LIMIT?: string;
  /** Secret: Turnstile secret key. */
  TURNSTILE_SECRET: string;
  /** Secret: random string mixed into IP hashes so they can't be reversed. */
  IP_HASH_SALT: string;
  /** Secret: your Inbox password. Must be ≥32 characters (generate one, see README). */
  ADMIN_TOKEN?: string;
}

const MAX_BODY_BYTES = 260_000;
const RATE_WINDOWS = [
  { ms: 10 * 60_000, max: 3 },        // 3 entries per 10 minutes per visitor
  { ms: 24 * 60 * 60_000, max: 15 },  // 15 per day per visitor
];

const STATUS: Record<ErrorCode, number> = {
  nickname: 400, message: 400, links: 400, drawing: 400, invalid: 400, reply: 400,
  captcha: 403, origin: 403, auth: 401, not_found: 404, rate: 429, busy: 503,
};

function allowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  const list = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  return list.includes(origin) ? origin : null;
}

function corsHeaders(origin: string | null): Record<string, string> {
  return origin
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      }
    : { Vary: "Origin" };
}

function json(data: unknown, status: number, origin: string | null, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      ...corsHeaders(origin),
      ...extra,
    },
  });
}

const fail = (code: ErrorCode, origin: string | null) => json({ error: code }, STATUS[code], origin);

const digest = (text: string) => crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const sha256 = async (text: string) => hex(await digest(text));

const bearer = (request: Request) => request.headers.get("Authorization")?.match(/^Bearer\s+(\S+)$/)?.[1] ?? null;

/** Constant-time check of the admin password (hashing first makes both sides equal length). */
async function isAdmin(request: Request, env: Env): Promise<boolean> {
  const given = bearer(request);
  const secret = env.ADMIN_TOKEN;
  if (!given || !secret || secret.length < 32) return false; // a short/missing secret disables the Inbox
  const [a, b] = await Promise.all([digest(given), digest(secret)]);
  return crypto.subtle.timingSafeEqual(a, b);
}

function newVisitorToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(token: unknown, ip: string, env: Env): Promise<boolean> {
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

interface Row { id: number; nickname: string; message: string; created_at: number; has_drawing: number; reply: string | null; replied_at: number | null }
const COLUMNS = "id, nickname, message, created_at, drawing IS NOT NULL AS has_drawing, reply, replied_at";
const toEntry = (r: Row) => ({
  id: r.id, nickname: r.nickname, message: r.message, createdAt: r.created_at, hasDrawing: r.has_drawing === 1,
  reply: r.reply, repliedAt: r.replied_at,
});

async function createEntry(request: Request, env: Env, origin: string | null) {
  // Browsers always send Origin on cross-site POSTs; anything else isn't our website.
  if (!origin) return fail("origin", null);
  if (!request.headers.get("Content-Type")?.startsWith("application/json")) return fail("invalid", origin);
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY_BYTES) return fail("drawing", origin);

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return fail("drawing", origin);
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail("invalid", origin);
    body = parsed as Record<string, unknown>;
  } catch {
    return fail("invalid", origin);
  }

  // Honeypot: a hidden field humans never fill in.
  if (typeof body.website === "string" && body.website.length > 0) return fail("invalid", origin);

  const input = validateEntry(body);
  if (!input.ok) return fail(input.error, origin);

  let drawing: Uint8Array | null = null;
  if (body.drawing !== undefined && body.drawing !== null) {
    drawing = decodeDrawing(body.drawing);
    if (!drawing) return fail("drawing", origin);
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  if (!(await verifyTurnstile(body.turnstileToken, ip, env))) return fail("captcha", origin);

  const now = Date.now();
  const ipHash = await sha256(`${env.IP_HASH_SALT}:${ip}`);
  const dayStart = now - (now % 86_400_000);
  const dailyLimit = Number(env.DAILY_ENTRY_LIMIT ?? 300);

  // One round trip for all three counters (each uses an index, so they read very few rows).
  const [w1, w2, day] = await env.DB.batch<{ n: number }>([
    env.DB.prepare("SELECT COUNT(*) AS n FROM entries WHERE ip_hash = ?1 AND created_at > ?2").bind(ipHash, now - RATE_WINDOWS[0].ms),
    env.DB.prepare("SELECT COUNT(*) AS n FROM entries WHERE ip_hash = ?1 AND created_at > ?2").bind(ipHash, now - RATE_WINDOWS[1].ms),
    env.DB.prepare("SELECT COUNT(*) AS n FROM entries WHERE created_at >= ?1").bind(dayStart),
  ]);
  if (w1.results[0].n >= RATE_WINDOWS[0].max || w2.results[0].n >= RATE_WINDOWS[1].max) {
    return json({ error: "rate" }, 429, origin, { "Retry-After": "600" });
  }
  if (day.results[0].n >= dailyLimit) return fail("busy", origin);

  // Returning visitors reuse their mailbox key so all their messages stay together.
  const visitorToken = isVisitorToken(body.visitorToken) ? body.visitorToken : newVisitorToken();
  const row = await env.DB.prepare(
    "INSERT INTO entries (nickname, message, drawing, ip_hash, visitor_hash, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6) RETURNING id"
  ).bind(input.nickname, input.message, drawing, ipHash, await sha256(visitorToken), now).first<{ id: number }>();

  return json({
    entry: { id: row!.id, nickname: input.nickname, message: input.message, createdAt: now, hasDrawing: !!drawing, reply: null, repliedAt: null },
    visitorToken,
  }, 201, origin);
}

async function listMine(request: Request, env: Env, origin: string | null) {
  const token = bearer(request);
  if (!isVisitorToken(token)) return fail("auth", origin);
  const { results } = await env.DB.prepare(`SELECT ${COLUMNS} FROM entries WHERE visitor_hash = ?1 ORDER BY id DESC LIMIT 50`)
    .bind(await sha256(token)).all<Row>();
  return json({ entries: results.map(toEntry) }, 200, origin);
}

async function getDrawing(request: Request, id: number, env: Env, origin: string | null) {
  const row = await env.DB.prepare("SELECT drawing, visitor_hash FROM entries WHERE id = ?1")
    .bind(id).first<{ drawing: ArrayBuffer | number[] | null; visitor_hash: string | null }>();
  const token = bearer(request);
  const allowed = (await isAdmin(request, env)) ||
    (isVisitorToken(token) && row?.visitor_hash != null && row.visitor_hash === (await sha256(token)));
  // Same answer for "missing" and "not yours", so ids can't be probed.
  if (!allowed || !row?.drawing) return fail("not_found", origin);
  const bytes = row.drawing instanceof ArrayBuffer ? new Uint8Array(row.drawing) : new Uint8Array(row.drawing);
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/png",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cache-Control": "private, max-age=3600",
      ...corsHeaders(origin),
    },
  });
}

async function adminList(url: URL, env: Env, origin: string | null) {
  const { before, limit } = parsePage(url.searchParams);
  const sql = `SELECT ${COLUMNS} FROM entries ${before ? "WHERE id < ?1" : ""} ORDER BY id DESC LIMIT ${before ? "?2" : "?1"}`;
  const stmt = before ? env.DB.prepare(sql).bind(before, limit + 1) : env.DB.prepare(sql).bind(limit + 1);
  const { results } = await stmt.all<Row>();
  const page = results.slice(0, limit);
  return json({ entries: page.map(toEntry), nextCursor: results.length > limit ? page.at(-1)!.id : null }, 200, origin);
}

async function adminReply(request: Request, id: number, env: Env, origin: string | null) {
  let body: { reply?: unknown };
  try { body = await request.json(); } catch { return fail("invalid", origin); }
  const reply = body.reply === null ? null : cleanReply(body.reply);
  if (body.reply !== null && !reply) return fail("reply", origin);
  const row = await env.DB.prepare(`UPDATE entries SET reply = ?1, replied_at = ?2 WHERE id = ?3 RETURNING ${COLUMNS}`)
    .bind(reply, reply ? Date.now() : null, id).first<Row>();
  return row ? json({ entry: toEntry(row) }, 200, origin) : fail("not_found", origin);
}

async function adminDelete(id: number, env: Env, origin: string | null) {
  const { meta } = await env.DB.prepare("DELETE FROM entries WHERE id = ?1").bind(id).run();
  return meta.changes ? json({ ok: true }, 200, origin) : fail("not_found", origin);
}

export async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = allowedOrigin(request, env);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = request.method;

  if (method === "OPTIONS") {
    return new Response(null, { status: origin ? 204 : 403, headers: corsHeaders(origin) });
  }
  if (path === "/health" && method === "GET") return json({ ok: true }, 200, origin);
  if (path === "/entries" && method === "POST") return createEntry(request, env, origin);
  if (path === "/mine" && method === "GET") return listMine(request, env, origin);

  const drawing = path.match(/^\/entries\/(\d{1,12})\/drawing$/);
  if (drawing && method === "GET") return getDrawing(request, Number(drawing[1]), env, origin);

  if (path.startsWith("/admin/")) {
    if (!(await isAdmin(request, env))) return fail("auth", origin);
    if (path === "/admin/check" && method === "GET") return json({ ok: true, replyMax: LIMITS.replyMax }, 200, origin);
    if (path === "/admin/entries" && method === "GET") return adminList(url, env, origin);
    const reply = path.match(/^\/admin\/entries\/(\d{1,12})\/reply$/);
    if (reply && method === "PUT") return adminReply(request, Number(reply[1]), env, origin);
    const one = path.match(/^\/admin\/entries\/(\d{1,12})$/);
    if (one && method === "DELETE") return adminDelete(Number(one[1]), env, origin);
  }
  return fail("not_found", origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await handle(request, env);
    } catch (err) {
      console.error(err);
      return json({ error: "server" }, 500, allowedOrigin(request, env));
    }
  },
} satisfies ExportedHandler<Env>;
