import { Github, ExternalLink, Heart, Play } from "lucide-react";
import { getProject, tones, type GalleryItem } from "@/content/portfolio";
import { useState, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import ProjectThumb, { Shot } from "../ProjectThumb";
import ScreenshotViewer from "../ScreenshotViewer";

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
  const [shot, setShot] = useState<number | null>(null);
  const p = getProject(slug);
  if (!p) return null;
  const tx = p.text[lang];
  const d = t.detail;
  // Palette names ("pink"…) draw a placeholder; everything else is a real image or video.
  const isPlaceholder = (g: GalleryItem): g is string => typeof g === "string" && Object.hasOwn(tones, g);
  const media = p.gallery.filter((g) => !isPlaceholder(g));

  return (
    <div className="pb-6">
      {p.gallery.length > 0 && (
        <div className="film flex gap-3 overflow-x-auto px-3 py-4 k-scroll" role="group" aria-label={d.gallery}>
          {p.gallery.map((g, i) => {
            const frame = "h-28 w-44 shrink-0 overflow-hidden rounded-md border-2 border-white bg-k-surface";
            if (isPlaceholder(g)) return <div key={i} className={frame}><Shot src={g} alt={`${tx.title} - ${d.screenshot} ${i + 1}`} /></div>;
            const video = typeof g === "string" ? null : g;
            const thumb = typeof g === "string" ? g : g.poster;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setShot(media.indexOf(g))}
                aria-label={video ? `${d.playVideo}: ${tx.title}` : `${d.enlarge} ${i + 1}`}
                className={`${frame} relative ${video ? "cursor-pointer" : "cursor-zoom-in"} transition-transform hover:-translate-y-0.5 hover:rotate-1`}
              >
                <Shot src={thumb} alt="" />
                {video && (
                  <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
                    <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-k-outline bg-k-surface text-k-text shadow">
                      <Play className="ml-0.5 h-5 w-5 fill-current" />
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
      <ScreenshotViewer items={media} index={shot} title={tx.title} labels={d} onIndex={setShot} />

      <div className={`space-y-4 px-5 ${p.gallery.length > 0 ? "pt-5" : "pt-6"}`}>
        <div className="flex flex-wrap items-center gap-4">
          <ProjectThumb project={p} className="h-24 w-24 shrink-0" />
          <div className="min-w-[200px] flex-1">
            <h1 className="font-heading text-3xl leading-tight">{tx.title} <Heart className="inline h-6 w-6 fill-k-pink text-k-outline" /></h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.github ? (
                <a className="kbtn" href={p.github} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" />{d.github}</a>
              ) : (
                <span className="kbtn" aria-disabled="true"><Github className="h-4 w-4" />{d.privateRepo}</span>
              )}
              {p.live ? (
                <a className="kbtn" href={p.live} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />{d.live}</a>
              ) : (
                <span className="kbtn" aria-disabled="true">{d.noLive}</span>
              )}
            </div>
          </div>
        </div>

        <Block title={d.summary} color="var(--k-cream-soft)"><p className="mt-1 text-base leading-8">{tx.summary}</p></Block>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          <Block title={d.problem} color="var(--k-pink-soft)"><p className="mt-1 text-base leading-7">{tx.problem}</p></Block>
          <Block title={d.solution} color="var(--k-mint-soft)"><p className="mt-1 text-base leading-7">{tx.solution}</p></Block>
        </div>
        <Block title={d.tech} color="var(--k-lav-soft)">
          <ul className="mt-2 flex flex-wrap gap-2">
            {p.tags.map((tag) => (
              <li key={tag} className="rounded-full border-2 border-k-outline bg-k-surface px-3 text-sm font-semibold">{tag}</li>
            ))}
          </ul>
        </Block>
        <Block title={d.features} color="var(--k-blue-soft)">
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
