/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Guestbook Worker URL, e.g. https://guestbook.<you>.workers.dev (see guestbook-api/README.md) */
  readonly VITE_GUESTBOOK_API?: string;
  /** Public Cloudflare Turnstile site key */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
