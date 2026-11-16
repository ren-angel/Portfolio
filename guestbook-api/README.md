# Guestbook API

A small Cloudflare Worker + D1 (SQLite) API behind the portfolio's guestbook. It runs on the
**Workers Free plan**: no credit card, and going over a free limit returns errors instead of charging.

```
website (GitHub Pages) ──fetch──▶ Worker (workers.dev) ──▶ D1 database
            └── Turnstile widget ──token──▶ Worker ──verify──▶ Cloudflare Turnstile
```

**Messages are private.** Only you can read them all, in the website's hidden **Inbox** (`…/#inbox`).
Each visitor's browser gets a random *mailbox key* when they first post, and that key lets it see
their own messages and your replies (the Guestbook icon shows a badge when you've replied).

| Endpoint | Who | What it does |
|---|---|---|
| `POST /entries` | anyone (captcha) | `{ nickname, message, drawing?, turnstileToken, website, visitorToken? }` → `{ entry, visitorToken }` |
| `GET /mine` | visitor key | that visitor's messages + your replies |
| `GET /entries/:id/drawing` | author's key or you | the PNG (404 for everyone else) |
| `GET /admin/check` | you | checks the Inbox password |
| `GET /admin/entries?before=&limit=` | you | all messages, newest first, paged |
| `PUT /admin/entries/:id/reply` | you | `{ reply: "text" }` to reply or edit, `{ reply: null }` to remove |
| `DELETE /admin/entries/:id` | you | delete a message |
| `GET /health` | anyone | `{ ok: true }` |

**Protections:** server-side validation (shared rules in `src/rules.ts`), Turnstile captcha, a honeypot
field, rate limits per salted IP hash (3 per 10 min, 15 per day), a global daily cap (`DAILY_ENTRY_LIMIT`),
a CORS + Origin allowlist, body-size limits, and PNG checks (signature, exact 360×240 size, ≤150 KB).
Text is stored as plain text and the site renders it escaped. Drawings are served as `image/png` with
`nosniff` and a locked-down CSP. IPs are never stored, only `sha256(salt + ip)`. Mailbox keys are
stored only as SHA-256 hashes. The Inbox password is compared in constant time, and anything
shorter than 32 characters disables the Inbox entirely.

## One-time setup (≈15 minutes)

1. **Create a free Cloudflare account**: <https://dash.cloudflare.com/sign-up>. No card needed.
2. **Install and log in**
   ```bash
   cd guestbook-api
   npm install
   npx wrangler login
   ```
3. **Create the database** and paste the printed `database_id` into `wrangler.toml`
   (`db:migrate:remote` applies every file in `migrations/`; run it again after pulling new ones):
   ```bash
   npx wrangler d1 create guestbook
   npm run db:migrate:remote
   ```
4. **Create a Turnstile widget**: Dashboard → *Turnstile* → *Add widget*
   - Hostnames: `ren-angel.github.io` (plus your custom domain if you ever add one)
   - Widget mode: *Managed*
   - Keep the **site key** (public) and the **secret key** (private).
5. **Add the secrets** to the Worker. They're never in the repo or the website:
   ```bash
   npx wrangler secret put TURNSTILE_SECRET   # paste the Turnstile secret key
   npx wrangler secret put IP_HASH_SALT       # paste a random string, e.g. from: openssl rand -hex 32
   npx wrangler secret put ADMIN_TOKEN        # your Inbox password: ≥32 chars, e.g. openssl rand -hex 32
   ```
   Save the `ADMIN_TOKEN` in your password manager. It's the only way into your Inbox, and
   Cloudflare won't show it to you again (you can always set a new one).
6. **Check `ALLOWED_ORIGINS`** in `wrangler.toml`. It must contain the exact origin of your site
   (`https://ren-angel.github.io`, no path, no trailing slash).
7. **Deploy**
   ```bash
   npm run deploy
   ```
   Wrangler prints the URL, e.g. `https://guestbook.<your-subdomain>.workers.dev`.
   Check it: open `<that URL>/health`.
8. **Connect the website**: in the GitHub repo, go to *Settings → Secrets and variables → Actions →
   **Variables*** and add:
   - `GUESTBOOK_API_URL` = the Worker URL from step 7
   - `TURNSTILE_SITE_KEY` = the Turnstile site key from step 4

   Then re-run the *Deploy portfolio to GitHub Pages* workflow (or push any commit).

## Reading and replying

Open `https://ren-angel.github.io/Portfolio/#inbox` (bookmark it), paste your `ADMIN_TOKEN`, and you
can read every message, see drawings, reply (or edit/remove a reply) and delete. Tick
*Remember this device* only on your own devices; otherwise the password is forgotten when the tab
closes. Visitors who open `#inbox` just see a password box.

Replies reach the visitor in the browser they wrote from (there are no accounts), the next time
they open the site. If they cleared their browser data, they won't see it.

## Command-line moderation

The same jobs from a terminal, via wrangler and your Cloudflare login:

```bash
npm run admin -- list            # latest 30 entries (id, date, nickname, message, has drawing)
npm run admin -- delete 12       # delete entry #12
npm run admin -- delete 12 13    # delete several
```

You can also browse and edit the table in the Cloudflare dashboard (*Storage & Databases → D1*).

## Local development

```bash
cd guestbook-api
cp .dev.vars.example .dev.vars    # always-pass Turnstile test secret, dev salt, dev Inbox password
npm run db:migrate:local
npm run dev                       # http://127.0.0.1:8787

# in the repo root, in another terminal:
cp .env.example .env.local        # points the site at the local Worker with the test site key
npm run dev
```

Local data lives in `guestbook-api/.wrangler/` (git-ignored). `npm run admin -- list --local` works too.

## Free-tier budget

| Limit (Workers Free) | Usage | Headroom |
|---|---|---|
| 100,000 Worker requests/day | 1 per guestbook open + 1 per drawing shown (cached by browsers) + 1 per post | thousands of visitors/day |
| D1: 5M rows read/day | ~11 per page of entries; up to ~330 per post (index-only counts for the rate limits) | ≤100k/day even at the daily cap |
| D1: 100k rows written/day | ~3 per post (row + 2 indexes); capped at `DAILY_ENTRY_LIMIT` = 300 posts/day | ~900 rows/day max |
| D1: 500 MB per database | a post is <1 KB, plus a drawing (usually 5–40 KB, max 150 KB) | thousands of drawings |
| Worker CPU: 10 ms/request | validation + hashing + decoding a ≤150 KB PNG | fits comfortably |
| Turnstile | free | - |

If a limit is ever hit, that request fails until midnight UTC and the site shows a friendly error.
Nothing gets charged, because the Free plan has no billing.
