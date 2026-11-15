import { Github, ExternalLink, Heart } from "lucide-react";
import { getProject } from "@/content/portfolio";
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import ProjectThumb, { Shot } from "../ProjectThumb";

function Block({ title, children, color }: { title: string; children: ReactNode; color: string }) {
  return (
    <section className="rounded-2xl border-2 border-k-outline p-4" style={{ background: color }}>
      <h3 className="font-heading text-lg">{title}</h3>
      {children}
    </section>
  );
}

export default function ProjectDetailWindow({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const p = getProject(slug);
  if (!p) return null;
  const tx = p.text[lang];
  const d = t.detail;

  return (
    <div className="pb-6">
      <div className="film flex gap-3 overflow-x-auto px-3 py-4 k-scroll" role="group" aria-label={d.gallery}>
        {p.gallery.map((src, i) => (
          <div key={i} className="h-28 w-44 shrink-0 overflow-hidden rounded-md border-2 border-white bg-white">
            <Shot src={src} alt={`${d.screenshot} ${i + 1}`} />
          </div>
        ))}
      </div>

      <div className="space-y-4 px-5 pt-5">
        <div className="flex flex-wrap items-center gap-4">
          <ProjectThumb project={p} className="h-24 w-24 shrink-0" />
          <div className="min-w-[200px] flex-1">
            <h1 className="font-heading text-3xl leading-tight">{tx.title} <Heart className="inline h-6 w-6 fill-k-pink text-k-outline" /></h1>
            <p className="mt-1 text-sm italic">{d.placeholderNote}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a className="kbtn" href={p.github} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" />{d.github}</a>
              {p.live ? (
                <a className="kbtn" href={p.live} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />{d.live}</a>
              ) : (
                <span className="kbtn" aria-disabled="true">{d.noLive}</span>
              )}
            </div>
          </div>
        </div>

        <Block title={d.summary} color="#FFF9EF"><p className="mt-1 text-base leading-8">{tx.summary}</p></Block>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <Block title={d.problem} color="#FFE3EE"><p className="mt-1 text-base leading-7">{tx.problem}</p></Block>
          <Block title={d.solution} color="#E6F7F0"><p className="mt-1 text-base leading-7">{tx.solution}</p></Block>
        </div>
        <Block title={d.tech} color="#EFE6FD">
          <ul className="mt-2 flex flex-wrap gap-2">
            {p.tags.map((tag) => (
              <li key={tag} className="rounded-full border-2 border-k-outline bg-white px-3 text-sm font-semibold">{tag}</li>
            ))}
          </ul>
        </Block>
        <Block title={d.features} color="#DDEFFC">
          <ul className="mt-1 space-y-1 text-base leading-7">
            {tx.features.map((f) => (
              <li key={f} className="flex gap-2"><span aria-hidden="true">✿</span>{f}</li>
            ))}
          </ul>
        </Block>
      </div>
    </div>
  );
}
