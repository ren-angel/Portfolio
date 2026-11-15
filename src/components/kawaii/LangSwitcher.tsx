import { LANGS } from "@/content/translations";
import { useI18n } from "@/lib/i18n";

export default function LangSwitcher({ vertical = false }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t.ui.language}
      className={`flex gap-1 rounded-full border-2 border-k-outline bg-white/80 p-1 ${vertical ? "flex-col" : ""}`}
    >
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          lang={l.id}
          aria-label={l.name}
          aria-pressed={lang === l.id}
          onClick={() => setLang(l.id)}
          className={`rounded-full px-2 py-0.5 font-heading text-xs transition-transform hover:scale-110 ${
            lang === l.id ? "bg-k-pink text-k-text shadow-[0_2px_0_var(--k-outline)]" : "text-k-text"
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
