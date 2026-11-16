import { LANGS } from "@/content/translations";
import { useI18n } from "@/lib/i18n";

// Pills are 20px tall (radius 10px). The outer radius has to equal pill radius + padding + border,
// otherwise the outer curve is deeper than the pill and the active pill pokes through the border.
// Horizontal: fully rounded works because the bar is exactly one pill tall.
// Vertical: 10px + 6px (p-1.5) + 2px (border) = 18px.
export default function LangSwitcher({ vertical = false }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t.ui.language}
      className={`flex shrink-0 border-2 border-k-outline bg-k-surface/80 ${
        vertical ? "flex-col gap-1.5 rounded-[18px] p-1.5" : "gap-1 rounded-full p-1"
      }`}
    >
      {LANGS.map((l) => {
        const active = lang === l.id;
        return (
          <button
            key={l.id}
            type="button"
            lang={l.id}
            aria-label={l.name}
            aria-pressed={active}
            onClick={() => setLang(l.id)}
            className={`h-5 rounded-full px-2 font-heading text-xs leading-5 transition-transform ${
              active ? "bg-k-pink text-k-text shadow-[0_2px_0_var(--k-outline)]" : "text-k-text hover:scale-110"
            }`}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}
