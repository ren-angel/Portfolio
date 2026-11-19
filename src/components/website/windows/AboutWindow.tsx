import { profile } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { Bow, Heart, Sparkle, Star } from "../Illustrations";

function Note({ title, items, color, rotate, tape }: { title: string; items: string[]; color: string; rotate: number; tape: string }) {
  return (
    <section className="relative rounded-xl border-2 border-k-outline p-4 pt-5 shadow-[3px_4px_0_rgb(var(--k-shadow)/.35)]" style={{ background: color, transform: `rotate(${rotate}deg)` }}>
      <span aria-hidden="true" className="absolute -top-2.5 left-1/2 h-5 w-14 -translate-x-1/2 rounded-sm opacity-90" style={{ background: tape }} />
      <h3 className="font-heading text-lg">{title}</h3>
      <ul className="mt-1 space-y-0.5 text-base leading-7">
        {items.map((it) => (
          <li key={it} className="flex gap-2"><span aria-hidden="true">✿</span>{it}</li>
        ))}
      </ul>
    </section>
  );
}

export default function AboutWindow() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <div className="relative p-5 sm:p-6">
      <Sparkle className="twinkle absolute right-6 top-4 w-6" fill="#FFF0DA" />
      <div className="flex flex-wrap items-start gap-6">
        <figure className="relative w-[190px] shrink-0 rotate-[-3deg] rounded-md border-2 border-k-outline bg-k-surface p-3 pb-6 shadow-[4px_6px_0_rgb(var(--k-shadow)/.35)]">
          <span aria-hidden="true" className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 rotate-2 rounded-sm bg-k-pink opacity-90" />
          <div className={`grid place-items-center overflow-hidden rounded ${profile.aboutPhoto ? "aspect-[3/4]" : "aspect-square"}`} style={{ background: "var(--k-lav-soft)" }}>
            {profile.aboutPhoto ? (
              <img src={profile.aboutPhoto} alt={profile.name} className="h-full w-full object-cover object-[50%_20%]" />
            ) : (
              <p className="px-3 text-center font-heading text-sm leading-6 text-k-text">
                <span aria-hidden="true" className="mb-1 block text-2xl">✎</span>
                {a.photoPending}
              </p>
            )}
          </div>
          <Bow className="absolute -bottom-3 -right-4 w-12 rotate-12" />
        </figure>
        <div className="min-w-[240px] flex-1">
          <h1 className="font-heading text-3xl">{a.heading} <Heart className="inline w-6 align-middle" /></h1>
          {a.paragraphs.map((p) => (
            <p key={p} className="mt-3 text-base leading-8">{p}</p>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-6">
        <Note title={a.interestsTitle} items={a.interests} color="var(--k-cream)" rotate={-1.5} tape="var(--k-mint)" />
        <Note title={a.eduTitle} items={a.edu} color="var(--k-blue-soft)" rotate={1.2} tape="var(--k-pink)" />
        <Note title={a.influencesTitle} items={a.influences} color="var(--k-mint-soft)" rotate={1.6} tape="var(--k-lav)" />
        <Note title={a.factsTitle} items={a.facts} color="var(--k-pink-soft)" rotate={-1} tape="var(--k-peach)" />
      </div>
      <Star className="floaty mx-auto mt-6 w-8" fill="#DCCBFA" />
    </div>
  );
}
