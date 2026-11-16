import { useState } from "react";
import { projects } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { useWindows } from "@/lib/windows";
import ProjectThumb from "../ProjectThumb";

const CATS = ["all", "backend", "fullstack", "frontend", "mobile", "devops"] as const;
// Only show filters that have at least one project, so no folder opens empty.
const VISIBLE_CATS = CATS.filter((c) => c === "all" || projects.some((p) => p.category === c));

export default function ProjectsWindow() {
  const { t, lang } = useI18n();
  const { open } = useWindows();
  const [cat, setCat] = useState<typeof CATS[number]>("all");
  const list = projects.filter((p) => cat === "all" || p.category === cat);

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-k-outline bg-k-cream px-4 py-2">
        <span className="rounded-lg border-2 border-k-outline bg-k-surface px-3 font-heading text-sm">📁 {t.projects.path}</span>
        <div role="group" aria-label="Filter" className="ml-auto flex flex-wrap gap-1">
          {VISIBLE_CATS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`rounded-full border-2 border-k-outline px-3 font-heading text-xs transition-transform hover:scale-105 ${cat === c ? "bg-k-pink" : "bg-k-surface"}`}
            >
              {c === "all" ? t.projects.all : t.projects.cats[c]}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-4 p-4">
        {list.map((p) => {
          const tx = p.text[lang];
          return (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => open({ type: "project", slug: p.slug })}
                className="group flex h-full w-full flex-col items-center gap-2 rounded-2xl border-2 border-transparent p-3 text-center transition-all hover:-translate-y-1 hover:border-k-outline hover:bg-k-surface focus-visible:bg-k-surface"
              >
                <ProjectThumb project={p} className="h-24 w-24 transition-transform group-hover:rotate-3 group-hover:scale-105" />
                <span className="font-heading text-base leading-tight">{tx.title}</span>
                <span className="rounded-full bg-k-lav px-2 text-xs font-semibold">{t.projects.cats[p.category]}</span>
                <span className="text-sm leading-snug">{tx.short}</span>
                <span className="flex flex-wrap justify-center gap-1">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-md border border-k-outline bg-k-bg px-1.5 text-[11px]">{tag}</span>
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <footer className="flex items-center gap-2 border-t-2 border-k-outline bg-k-lav px-4 py-1 text-xs">
        <span>{list.length} {t.projects.items}</span>
      </footer>
    </div>
  );
}
