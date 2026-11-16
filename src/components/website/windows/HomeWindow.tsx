import { profile } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { useWindows } from "@/lib/windows";
import { Heart, Sparkle, Star } from "../Illustrations";

export default function HomeWindow() {
  const { t } = useI18n();
  const { open } = useWindows();
  return (
    <div className="flex min-h-full flex-col gap-5 p-5 sm:p-6">
      <div className="flex flex-1 flex-wrap gap-5">
        <article className="paper relative grow-[2] basis-[260px] rounded-[22px] border-2 border-k-outline p-5 pt-6" style={{ transform: "rotate(.6deg)" }}>
          <span aria-hidden="true" className="absolute -top-3 right-8 h-6 w-16 rotate-3 rounded-sm bg-k-mint opacity-90" />
          <Star className="twinkle absolute -left-3 -top-3 w-7" fill="#DCCBFA" />
          <Sparkle className="floaty absolute -bottom-3 right-6 w-6" fill="#F6B8D0" />
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
        <button type="button" className="kbtn" onClick={() => open({ type: "projects" })}>{t.home.openProjects}</button>
        <button type="button" className="kbtn" onClick={() => open({ type: "about" })}>{t.home.openAbout}</button>
        <button type="button" className="kbtn" onClick={() => open({ type: "contact" })}>{t.home.openContact}</button>
      </nav>
    </div>
  );
}
