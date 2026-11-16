import { useCallback, useEffect, useState, type FormEvent } from "react";
import { KeyRound, Loader2, LogOut, RotateCcw, Send, Trash2, X } from "lucide-react";
import { LIMITS, charCount, cleanReply } from "../../../../guestbook-api/src/rules";
import {
  adminCheck, adminDelete, adminList, adminReply, clearAdminToken, getAdminToken, guestbookConfigured,
  GuestbookRequestError, saveAdminToken, type Entry,
} from "@/lib/guestbookApi";
import { useI18n } from "@/lib/i18n";
import { playSound } from "@/lib/sounds";
import { Cat, Heart } from "../Illustrations";
import PrivateDrawing from "../PrivateDrawing";

// Your private inbox. Hidden on purpose: no desktop icon, open it with …/#inbox.
// The password lives only in Cloudflare (ADMIN_TOKEN secret) and whatever you type here.

const LOCALE = { en: "en", pt: "pt-BR", ja: "ja" } as const;
const field = "w-full rounded-xl border-2 border-k-outline bg-k-surface px-3 py-2 text-base text-k-text focus:outline-none focus-visible:outline-[3px] focus-visible:outline-k-outline";

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const { t } = useI18n();
  const x = t.inbox;
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const token = pass.trim();
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      await adminCheck(token);
      saveAdminToken(token, remember);
      playSound("success");
      onLogin(token);
    } catch (err) {
      setError(err instanceof GuestbookRequestError && err.code === "auth" ? x.wrong : t.guestbook.errors.network);
      playSound("error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="paper mx-auto max-w-sm space-y-3 rounded-2xl border-2 border-k-outline p-5 shadow-[4px_6px_0_rgb(var(--k-shadow)/.3)]">
      <h1 className="flex items-center gap-2 font-heading text-xl"><KeyRound className="h-5 w-5" />{x.login}</h1>
      <label className="block">
        <span className="font-heading text-sm">{x.password}</span>
        <input type="password" className={field} value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" required />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#F6B8D0]" />
        {x.remember}
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="kbtn" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}{x.enter}</button>
        {error && <p role="alert" className="text-sm font-semibold">⚠ {error}</p>}
      </div>
      <p className="text-xs leading-5">{x.hint}</p>
    </form>
  );
}

function Message({ entry, token, onChange, onDelete, onAuthLost }: {
  entry: Entry; token: string;
  onChange: (e: Entry) => void; onDelete: (id: number) => void; onAuthLost: () => void;
}) {
  const { t, lang } = useI18n();
  const x = t.inbox;
  const [draft, setDraft] = useState(entry.reply ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const date = (ms: number) => new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: "medium", timeStyle: "short" }).format(ms);

  const run = async (fn: () => Promise<void>) => {
    setState("saving");
    setError(null);
    try {
      await fn();
      setState("saved");
      playSound("success");
    } catch (err) {
      if (err instanceof GuestbookRequestError && err.code === "auth") return onAuthLost();
      setError(err instanceof GuestbookRequestError && err.code === "reply" ? t.guestbook.errors.reply : x.error);
      setState("idle");
      playSound("error");
    }
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    const reply = cleanReply(draft);
    if (!reply) { setError(t.guestbook.errors.reply); return; }
    run(async () => { onChange(await adminReply(token, entry.id, reply)); });
  };
  const removeReply = () => run(async () => { onChange(await adminReply(token, entry.id, null)); setDraft(""); });
  const remove = () => {
    if (!window.confirm(x.confirmDelete)) return;
    run(async () => { await adminDelete(token, entry.id); onDelete(entry.id); });
  };

  const count = charCount(draft);
  return (
    <li className="rounded-2xl border-2 border-k-outline bg-k-surface p-3 shadow-[3px_4px_0_rgb(var(--k-shadow)/.3)]">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-heading text-base">{entry.nickname}</p>
        <span className={`rounded-full border-2 border-k-outline px-2 font-heading text-xs ${entry.reply ? "bg-k-mint" : "bg-k-pink"}`}>
          {entry.reply ? x.answered : x.unanswered}
        </span>
        <time className="ml-auto text-xs" dateTime={new Date(entry.createdAt).toISOString()}>#{entry.id} · {date(entry.createdAt)}</time>
      </div>
      <p className="mt-1 whitespace-pre-wrap break-words text-base leading-7">{entry.message}</p>
      {entry.hasDrawing && <PrivateDrawing id={entry.id} token={token} alt={`${t.guestbook.drawingAlt} ${entry.nickname}`} />}

      <form onSubmit={send} className="mt-3 space-y-2 rounded-2xl border-2 border-dashed border-k-outline bg-k-pink-soft p-2.5">
        <label className="flex items-center justify-between font-heading text-sm">
          <span className="flex items-center gap-1"><Heart className="w-4" />{t.guestbook.myReply}</span>
          <span className={count > LIMITS.replyMax ? "underline decoration-wavy" : ""}>{count}/{LIMITS.replyMax}</span>
        </label>
        <textarea
          aria-label={`${t.guestbook.myReply}: ${entry.nickname}`}
          className={`${field} min-h-[72px] resize-y`}
          placeholder={x.replyPlaceholder}
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setState("idle"); }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className="kbtn text-sm" disabled={state === "saving"}>
            {state === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {entry.reply ? x.update : x.send}
          </button>
          {entry.reply && <button type="button" className="kbtn text-sm" onClick={removeReply}><X className="h-4 w-4" />{x.removeReply}</button>}
          <button type="button" className="kbtn ml-auto text-sm" onClick={remove}><Trash2 className="h-4 w-4" />{x.delete}</button>
        </div>
        <p role="status" className="text-sm font-semibold empty:hidden">
          {state === "saved" && x.saved}
          {error && <span role="alert">⚠ {error}</span>}
        </p>
      </form>
    </li>
  );
}

function Messages({ token, onLogout }: { token: string; onLogout: (expired?: boolean) => void }) {
  const { t } = useI18n();
  const x = t.inbox;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "more">("loading");

  const load = useCallback(async (before?: number | null) => {
    setStatus(before ? "more" : "loading");
    try {
      const page = await adminList(token, before);
      setEntries((prev) => (before ? [...prev, ...page.entries.filter((e) => !prev.some((p) => p.id === e.id))] : page.entries));
      setCursor(page.nextCursor);
      setStatus("ready");
    } catch (err) {
      if (err instanceof GuestbookRequestError && err.code === "auth") onLogout(true);
      else setStatus("error");
    }
  }, [token, onLogout]);
  useEffect(() => { load(); }, [load]);

  const unanswered = entries.filter((e) => !e.reply).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="font-heading text-2xl">{t.apps.inbox}</h1>
        {unanswered > 0 && <span className="rounded-full border-2 border-k-outline bg-k-pink px-2 font-heading text-sm">{unanswered} {x.unanswered}</span>}
        <button type="button" className="kbtn ml-auto text-sm" onClick={() => load()} aria-label={x.retry}><RotateCcw className="h-4 w-4" /></button>
        <button type="button" className="kbtn text-sm" onClick={() => onLogout()}><LogOut className="h-4 w-4" />{x.logout}</button>
      </div>
      {status === "loading" && (
        <div role="status" className="flex flex-col items-center gap-2 py-8">
          <div className="h-4 w-48 overflow-hidden rounded-full border-2 border-k-outline bg-k-surface p-0.5"><div className="bar-anim h-full w-1/3 rounded-full bg-k-pink" /></div>
          <p className="font-heading text-sm">{x.loading}</p>
        </div>
      )}
      {status === "error" && (
        <div role="alert" className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-k-outline p-4 text-center">
          <p className="font-heading">{x.error}</p>
          <button type="button" className="kbtn" onClick={() => load()}><RotateCcw className="h-4 w-4" />{x.retry}</button>
        </div>
      )}
      {status === "ready" && entries.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-6"><Cat className="w-20" /><p className="font-heading">{x.empty}</p></div>
      )}
      <ul className="space-y-3">
        {entries.map((e) => (
          <Message
            key={e.id}
            entry={e}
            token={token}
            onChange={(next) => setEntries((list) => list.map((it) => (it.id === next.id ? next : it)))}
            onDelete={(id) => setEntries((list) => list.filter((it) => it.id !== id))}
            onAuthLost={() => onLogout(true)}
          />
        ))}
      </ul>
      {cursor && (
        <div className="flex justify-center">
          <button type="button" className="kbtn" onClick={() => load(cursor)} disabled={status === "more"}>
            {status === "more" && <Loader2 className="h-4 w-4 animate-spin" />}{x.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}

export default function InboxWindow() {
  const { t } = useI18n();
  const [token, setToken] = useState(getAdminToken);
  const [expired, setExpired] = useState(false);
  const logout = useCallback((wasExpired?: boolean) => {
    clearAdminToken();
    setToken(null);
    setExpired(!!wasExpired);
  }, []);

  return (
    <div className="p-4 sm:p-5">
      {!guestbookConfigured ? (
        <p className="rounded-2xl border-2 border-dashed border-k-outline p-5 text-center font-heading">{t.inbox.offline}</p>
      ) : token ? (
        <Messages token={token} onLogout={logout} />
      ) : (
        <>
          {expired && <p role="alert" className="mb-3 text-center text-sm font-semibold">⚠ {t.inbox.wrong}</p>}
          <Login onLogin={(tk) => { setExpired(false); setToken(tk); }} />
        </>
      )}
    </div>
  );
}
