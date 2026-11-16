import { useEffect, useRef, useState, type FormEvent } from "react";
import { Brush, Loader2, RotateCcw, X } from "lucide-react";
import { LIMITS, charCount, cleanMessage, cleanNickname, countLinks } from "../../../../guestbook-api/src/rules";
import { useDrawing } from "@/lib/drawing";
import {
  getVisitorToken, guestbookConfigured, GuestbookRequestError, postEntry, TURNSTILE_SITE_KEY,
  type Entry, type GuestbookError,
} from "@/lib/guestbookApi";
import { useMailbox } from "@/lib/mailbox";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { playSound } from "@/lib/sounds";
import { useWindows } from "@/lib/windows";
import { Cat, Heart, Sparkle } from "../Illustrations";
import PrivateDrawing from "../PrivateDrawing";
import Turnstile, { type TurnstileHandle } from "../Turnstile";

const TURNSTILE_LANG = { en: "en", pt: "pt-br", ja: "ja" } as const;
const LOCALE = { en: "en", pt: "pt-BR", ja: "ja" } as const;

/** One of the visitor's own messages, with the owner's reply underneath (if any). */
function MyMessage({ entry, isNew }: { entry: Entry; isNew: boolean }) {
  const { t, lang } = useI18n();
  const g = t.guestbook;
  const token = getVisitorToken();
  const date = (ms: number) => new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: "medium" }).format(ms);
  return (
    <li className="rounded-2xl border-2 border-k-outline bg-k-surface p-3 shadow-[3px_4px_0_rgb(var(--k-shadow)/.3)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        {/* React escapes text: user content is never interpreted as HTML. */}
        <p className="font-heading text-base">{entry.nickname} <span aria-hidden="true">✿</span></p>
        <time dateTime={new Date(entry.createdAt).toISOString()} className="text-xs">{date(entry.createdAt)}</time>
      </div>
      <p className="mt-1 whitespace-pre-wrap break-words text-base leading-7">{entry.message}</p>
      {entry.hasDrawing && token && <PrivateDrawing id={entry.id} token={token} alt={`${g.drawingAlt} ${entry.nickname}`} />}
      {entry.reply ? (
        <div className="relative mt-3 rounded-2xl border-2 border-k-outline bg-k-pink-soft p-3">
          <p className="flex flex-wrap items-center gap-2 font-heading text-sm">
            <Heart className="w-4" /> {g.myReply}
            {isNew && <span className="pop-in rounded-full border-2 border-k-outline bg-k-pink px-2 text-xs">{g.newReply}</span>}
            {entry.repliedAt && <time className="ml-auto text-xs font-normal" dateTime={new Date(entry.repliedAt).toISOString()}>{date(entry.repliedAt)}</time>}
          </p>
          <p className="mt-1 whitespace-pre-wrap break-words text-base leading-7">{entry.reply}</p>
        </div>
      ) : (
        <p className="mt-2 text-sm italic">{g.noReply}</p>
      )}
    </li>
  );
}

function Offline() {
  const { t } = useI18n();
  const { open } = useWindows();
  const g = t.guestbook;
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-k-outline bg-k-cream-soft p-5 text-center">
      <Cat className="w-24" />
      <p className="font-heading text-lg">{g.offline}</p>
      <p className="max-w-sm text-sm leading-6">{g.offlineHint}</p>
      <button type="button" className="kbtn" onClick={() => open({ type: "paint" })}><Brush className="h-4 w-4" />{g.addDrawing}</button>
    </div>
  );
}

function SignForm({ onPosted }: { onPosted: (e: Entry) => void }) {
  const { t, lang } = useI18n();
  const { theme } = useSettings();
  const { attachment, setAttachment } = useDrawing();
  const { open } = useWindows();
  const g = t.guestbook;
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<GuestbookError | "captchaWait" | null>(null);
  const captcha = useRef<TurnstileHandle>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    // Client-side checks are just for friendly instant feedback; the Worker re-validates everything.
    const nick = cleanNickname(nickname);
    const msg = cleanMessage(message);
    const problem: GuestbookError | "captchaWait" | null =
      !nick ? "nickname" : !msg ? "message" : countLinks(msg) > LIMITS.maxLinks ? "links" : !token ? "captchaWait" : null;
    if (problem || !nick || !msg || !token) { setError(problem); playSound("error"); return; }

    setState("sending");
    setError(null);
    try {
      const entry = await postEntry({ nickname: nick, message: msg, drawing: attachment, turnstileToken: token, website });
      onPosted(entry);
      setMessage("");
      setAttachment(null);
      setState("done");
      playSound("success");
    } catch (err) {
      setError(err instanceof GuestbookRequestError ? err.code : "generic");
      setState("idle");
      playSound("error");
    } finally {
      captcha.current?.reset(); // tokens are single-use
    }
  };

  const msgCount = charCount(message);
  const field = "w-full rounded-xl border-2 border-k-outline bg-k-surface px-3 py-2 text-base text-k-text placeholder:text-k-outline focus:outline-none focus-visible:outline-[3px] focus-visible:outline-k-outline";

  return (
    <form onSubmit={submit} noValidate className="paper space-y-3 rounded-2xl border-2 border-k-outline p-4 shadow-[4px_6px_0_rgb(var(--k-shadow)/.3)]">
      <label className="block">
        <span className="font-heading text-sm">{g.nickname}</span>
        <input
          className={field}
          value={nickname}
          maxLength={LIMITS.nicknameMax * 2}
          onChange={(e) => { setNickname(e.target.value); setState("idle"); }}
          autoComplete="nickname"
          required
        />
      </label>
      <label className="block">
        <span className="flex justify-between font-heading text-sm">
          {g.message}
          <span className={msgCount > LIMITS.messageMax ? "text-k-text underline decoration-wavy" : ""}>{msgCount}/{LIMITS.messageMax}</span>
        </span>
        <textarea
          className={`${field} min-h-[88px] resize-y`}
          value={message}
          onChange={(e) => { setMessage(e.target.value); setState("idle"); }}
          required
        />
      </label>
      {/* Honeypot for bots: hidden from people and assistive tech. */}
      <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />

      <div>
        <span className="font-heading text-sm">{g.drawing}</span>
        {attachment ? (
          <div className="mt-1 flex flex-wrap items-end gap-2">
            <img src={attachment} alt="" className="aspect-[3/2] w-40 rounded-md border-2 border-k-outline bg-white" />
            <div className="flex flex-col gap-1.5">
              <button type="button" className="kbtn text-sm" onClick={() => open({ type: "paint" })}><Brush className="h-4 w-4" />{g.editDrawing}</button>
              <button type="button" className="kbtn text-sm" onClick={() => setAttachment(null)}><X className="h-4 w-4" />{g.removeDrawing}</button>
            </div>
          </div>
        ) : (
          <div className="mt-1"><button type="button" className="kbtn" onClick={() => open({ type: "paint" })}><Brush className="h-4 w-4" />{g.addDrawing}</button></div>
        )}
      </div>

      <div>
        <p className="mb-1 font-heading text-sm">{g.captcha}</p>
        <Turnstile ref={captcha} siteKey={TURNSTILE_SITE_KEY} theme={theme === "night" ? "dark" : "light"} lang={TURNSTILE_LANG[lang]} onToken={setToken} failedText={g.captchaFailed} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="kbtn" disabled={state === "sending"}>
          {state === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" />{g.sending}</> : g.submit}
        </button>
        <p role="status" aria-live="polite" className="text-sm font-semibold">
          {state === "done" && <>{g.success} <Heart className="inline w-4 align-middle" /></>}
          {error && <span role="alert">⚠ {error === "captchaWait" ? g.captchaWait : g.errors[error]}</span>}
        </p>
      </div>
    </form>
  );
}

function MyMessages() {
  const { t } = useI18n();
  const g = t.guestbook;
  const { mine, status, seenAt, refresh, markSeen, forget } = useMailbox();
  // Remember what was already seen when the window opened (so "new!" stays visible), then mark seen.
  const [seenBefore] = useState(seenAt);
  useEffect(() => { markSeen(); }, [mine, markSeen]);

  if (!getVisitorToken()) return null;
  return (
    <section aria-busy={status === "loading"} className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-heading text-lg">{g.yourMessages}</h2>
        <button type="button" className="kbtn ml-auto text-sm" onClick={refresh} disabled={status === "loading"}>
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}{g.checkReplies}
        </button>
      </div>
      {status === "error" && <p role="alert" className="text-sm">⚠ {g.loadError}</p>}
      {mine.length > 0 && (
        <ul className="space-y-3">
          {mine.map((e) => <MyMessage key={e.id} entry={e} isNew={(e.repliedAt ?? 0) > seenBefore} />)}
        </ul>
      )}
      <p className="text-xs leading-5">
        {g.deviceNote}{" "}
        <button type="button" className="underline decoration-dotted underline-offset-2" onClick={() => window.confirm(g.forgetConfirm) && forget()}>
          {g.forget}
        </button>
      </p>
    </section>
  );
}

export default function GuestbookWindow() {
  const { t } = useI18n();
  const g = t.guestbook;
  const { add } = useMailbox();
  return (
    <div className="space-y-4 p-4 sm:p-5">
      <header className="relative">
        <Sparkle className="twinkle absolute right-1 top-0 w-5" fill="#F6B8D0" />
        <h1 className="font-heading text-2xl">{g.heading}</h1>
        <p className="text-sm leading-6">{g.intro}</p>
      </header>
      {!guestbookConfigured ? <Offline /> : (
        <>
          <SignForm onPosted={add} />
          <MyMessages />
        </>
      )}
    </div>
  );
}
