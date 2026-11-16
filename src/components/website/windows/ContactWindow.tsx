import { useEffect, useRef, useState } from "react";
import { Check, Copy, Github, Globe, Instagram, Linkedin, Mail } from "lucide-react";
import { profile, socials } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { Cat, Heart, Sparkle } from "../Illustrations";

const ICONS = { github: Github, linkedin: Linkedin, instagram: Instagram, globe: Globe };

export default function ContactWindow() {
  const { t } = useI18n();
  const c = t.contact;
  const [feedback, setFeedback] = useState<"idle" | "copied" | "failed">("idle");
  const reset = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(reset.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setFeedback("copied");
    } catch {
      setFeedback("failed");
    }
    clearTimeout(reset.current);
    reset.current = window.setTimeout(() => setFeedback("idle"), 3000);
  };

  return (
    <div className="p-5 sm:p-6">
      <article className="paper relative rounded-2xl border-2 border-k-outline p-5 shadow-[4px_6px_0_rgb(var(--k-shadow)/.3)]">
        <div aria-hidden="true" className="absolute right-4 top-4 grid h-14 w-12 rotate-6 place-items-center rounded-sm border-2 border-dashed border-k-outline bg-k-pink">
          <Heart className="w-7" fill="#fff" />
        </div>
        <p className="font-heading text-sm text-k-outline">{c.to}</p>
        <h1 className="mt-1 max-w-[80%] font-heading text-2xl leading-tight">{c.subject}</h1>
        <p className="mt-4 font-semibold">{c.greeting}</p>
        <p className="mt-1 text-base leading-8">{c.body}</p>
        <p className="mt-3 font-heading">{c.sign}</p>
      </article>

      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border-2 border-k-outline p-3" style={{ background: "var(--k-blue-soft)" }}>
        <Mail className="h-5 w-5" aria-hidden="true" />
        <a href={`mailto:${profile.email}`} className="min-w-0 flex-1 truncate font-semibold underline decoration-k-pink decoration-2 underline-offset-4">{profile.email}</a>
        <button type="button" className="kbtn" onClick={copy} aria-live="polite">
          {feedback === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {feedback === "copied" ? c.copied : c.copy}
        </button>
      </div>

      {feedback === "failed" && <p role="status" className="mt-2 text-sm">{c.copyFailed}</p>}

      <h2 className="mb-2 mt-5 font-heading text-lg">{c.links}</h2>
      <ul className="flex flex-wrap gap-2">
        {socials.map((s) => {
          const Icon = ICONS[s.icon] ?? Globe;
          return (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="kbtn"><Icon className="h-4 w-4" />{s.label}</a>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-k-cream p-3">
        <Cat className="w-16 shrink-0" />
        <p className="font-heading text-base">
          {c.closing} <Sparkle className="twinkle inline w-4 align-middle" fill="#F6B8D0" />
        </p>
      </div>
    </div>
  );
}
