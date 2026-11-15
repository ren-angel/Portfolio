import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getProject } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { WindowsProvider, useWindows, type DesktopWindow } from "@/lib/windows";
import Decor from "./Decor";
import LoadingScreen from "./LoadingScreen";
import Sidebar from "./Sidebar";
import { MobileDock, MobileTop } from "./MobileNav";
import Window from "./Window";
import { Cat } from "./Illustrations";
import HomeWindow from "./windows/HomeWindow";
import AboutWindow from "./windows/AboutWindow";
import SkillsWindow from "./windows/SkillsWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import ContactWindow from "./windows/ContactWindow";
import ProjectDetailWindow from "./windows/ProjectDetailWindow";

const REGISTRY = {
  home: HomeWindow, about: AboutWindow, skills: SkillsWindow,
  projects: ProjectsWindow, contact: ContactWindow,
};
const TAPES = { home: "#F6B8D0", about: "#FFD9C0", skills: "#C6EBDD", projects: "#B9DEFA", contact: "#DCCBFA", project: "#B9DEFA" };

function DesktopInner() {
  const { windows, activeId, close, focus, move, resize } = useWindows();
  const { t, lang } = useI18n();
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const measure = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    const done = () => setReady(true);
    (document.fonts?.ready ?? Promise.resolve()).then(done);
    const cap = setTimeout(done, 2500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(cap);
    };
  }, []);

  const mobile = vp.w < 768;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && activeId && close(activeId);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, close]);

  const titleOf = (w: DesktopWindow) => {
    if (w.type === "project") return getProject(w.slug)?.text[lang].title ?? "";
    return t.titles[w.type];
  };
  const visible = !ready ? [] : mobile ? windows.filter((w) => w.id === activeId) : windows;

  return (
    <main className="relative h-dvh w-full overflow-hidden text-k-text">
      <Decor />
      {mobile ? <MobileTop titleOf={(w) => (w.type === "project" ? titleOf(w) : t.nav[w.type])} /> : <Sidebar />}
      {mobile && ready && windows.length === 0 && (
        <div className="absolute inset-x-0 top-1/3 z-10 flex flex-col items-center gap-3 px-8 text-center">
          <Cat className="w-32" />
          <p className="font-heading">{t.ui.empty}</p>
        </div>
      )}
      <div className="absolute inset-0 z-10">
        <AnimatePresence>
          {visible.map((w) => {
            const Content = w.type === "project" ? null : REGISTRY[w.type];
            return (
              <Window
                key={w.id}
                win={w}
                active={w.id === activeId}
                vp={vp}
                mobile={mobile}
                title={titleOf(w)}
                tape={TAPES[w.type]}
                onFocus={() => w.id !== activeId && focus(w.id)}
                onClose={close}
                onMove={move}
                onResize={resize}
              >
                {w.type === "project" ? <ProjectDetailWindow slug={w.slug} /> : Content && <Content />}
              </Window>
            );
          })}
        </AnimatePresence>
      </div>
      {mobile && <MobileDock />}
      <AnimatePresence>{!ready && <LoadingScreen key="loading" />}</AnimatePresence>
    </main>
  );
}

export default function Desktop() {
  return (
    <WindowsProvider>
      <DesktopInner />
    </WindowsProvider>
  );
}
