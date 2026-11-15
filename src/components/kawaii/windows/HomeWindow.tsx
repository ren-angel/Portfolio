import { profile } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { useWindows } from "@/lib/windows";
import { Cat, Heart, Sparkle, Star, Cloud } from "../Illustrations";

export default function HomeWindow() {
  const { t } = useI18n();
  const { open } = useWindows();
  return (
    <div className="flex min-h-full flex-col gap-5 p-5 sm:p-6">
      <div className="flex flex-1 flex-wrap gap-5">
        <figure className="relative flex grow basis-[200px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-k-outline bg-k-blue/60 p-4" style={{ background: "#DDEFFC" }}>
          <Cloud className="absolute left-3 top-3 w-12" />
          <Star className="twinkle absolute right-4 top-5 w-6" />
          <Sparkle className="floaty absolute bottom-10 left-4 w-5" fill="#F6B8D0" />
          <Heart className="floaty absolute bottom-12 right-5 w-6" />
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="max-w-[220px] rounded-3xl" />
          ) : (
            <Cat className="w-full max-w-[210px]" />
          )}
          <figcaption className="mt-2 font-heading text-xs text-k-text">({t.home.caption})</figcaption>
        </figure>

        <article className="paper relative grow-[2] basis-[260px] rounded-[22px] border-2 border-k-outline p-5 pt-6" style={{ transform: "rotate(.6deg)" }}>
          <span aria-hidden="true" className="absolute -top-3 right-8 h-6 w-16 rotate-3 rounded-sm bg-k-mint opacity-90" />
          <p className="font-heading text-lg text-k-text">{t.home.hello}</p>
          <h1 className="font-heading text-4xl font-medium leading-tight text-k-text">
            {profile.name}
            <Heart className="ml-2 inline-block w-7 align-middle" />
          </h1>
          <p className="mt-1 inline-block rounded-full bg-k-lav px-3 py-0.5 font-heading text-sm">{t.home.role}</p>
          <p className="mt-4 text-base leading-8">{t.home.intro}</p>
          <p className="mt-2 text-base font-semibold leading-8">{t.home.invite}</p>
        </article>
      </div>

      <nav aria-label={t.home.quickStart} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-k-outline bg-k-cream px-4 py-3">
        <span className="font-heading text-sm">{t.home.quickStart} ✿</span>
        <button type="button" className="kbtn" onClick={() => open("projects")}>{t.home.openProjects}</button>
        <button type="button" className="kbtn" onClick={() => open("about")}>{t.home.openAbout}</button>
        <button type="button" className="kbtn" onClick={() => open("contact")}>{t.home.openContact}</button>
      </nav>
    </div>
  );
}
