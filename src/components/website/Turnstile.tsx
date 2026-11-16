import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}
declare global { interface Window { turnstile?: TurnstileApi } }

let script: Promise<TurnstileApi> | null = null;
function loadTurnstile() {
  script ??= new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    el.async = true;
    el.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile")));
    el.onerror = () => { script = null; el.remove(); reject(new Error("turnstile")); };
    document.head.appendChild(el);
  });
  return script;
}

export interface TurnstileHandle { reset: () => void }

// Cloudflare Turnstile (free, privacy-friendly captcha). Loaded only when the guestbook form is shown.
export default function Turnstile({ siteKey, theme, lang, onToken, failedText, ref }: {
  siteKey: string;
  failedText: string;
  theme: "light" | "dark";
  lang: string;
  onToken: (token: string | null) => void;
  ref?: Ref<TurnstileHandle>;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const tokenCb = useRef(onToken);
  tokenCb.current = onToken;
  const [failed, setFailed] = useState(false);

  useImperativeHandle(ref, () => ({
    reset: () => {
      tokenCb.current(null);
      if (widget.current) window.turnstile?.reset(widget.current);
    },
  }), []);

  useEffect(() => {
    let cancelled = false;
    loadTurnstile().then((ts) => {
      if (cancelled || !box.current) return;
      widget.current = ts.render(box.current, {
        sitekey: siteKey,
        theme,
        language: lang,
        size: "flexible",
        callback: (t: string) => tokenCb.current(t),
        "expired-callback": () => tokenCb.current(null),
        "error-callback": () => tokenCb.current(null),
      });
    }).catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      tokenCb.current(null);
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, theme, lang]);

  return failed ? <p role="alert" className="text-sm">⚠ {failedText}</p> : <div ref={box} className="min-h-[65px] w-full max-w-[400px]" />;
}
