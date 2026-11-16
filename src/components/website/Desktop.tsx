import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence } from "framer-motion";
import { getProject } from "@/content/portfolio";
import { DrawingProvider } from "@/lib/drawing";
import { useI18n } from "@/lib/i18n";
import { hashFor, parseHash } from "@/lib/route";
import { WindowsProvider, useWindows, type DesktopWindow, type WindowKind } from "@/lib/windows";
import Decor from "./Decor";
import DesktopIcons from "./DesktopIcons";
import { ContextMenu, KonamiSecret } from "./DesktopExtras";
import BootScreen from "./BootScreen";
import Sidebar from "./Sidebar";
import Taskbar from "./Taskbar";
import { MobileDock, MobileTop } from "./MobileNav";
import Window from "./Window";
import { Cat } from "./Illustrations";
import HomeWindow from "./windows/HomeWindow";
import AboutWindow from "./windows/AboutWindow";
import SkillsWindow from "./windows/SkillsWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import ContactWindow from "./windows/ContactWindow";
import ProjectDetailWindow from "./windows/ProjectDetailWindow";
import PaintWindow from "./windows/PaintWindow";
import GuestbookWindow from "./windows/GuestbookWindow";
import TerminalWindow from "./windows/TerminalWindow";
import GithubWindow from "./windows/GithubWindow";
import SettingsWindow from "./windows/SettingsWindow";
import InboxWindow from "./windows/InboxWindow";
import { MailboxProvider } from "@/lib/mailbox";

const REGISTRY: Record<WindowKind, ComponentType> = {
  home: HomeWindow, about: AboutWindow, skills: SkillsWindow, projects: ProjectsWindow, contact: ContactWindow,
  paint: PaintWindow, guestbook: GuestbookWindow, terminal: TerminalWindow, github: GithubWindow, settings: SettingsWindow,
  inbox: InboxWindow,
};
const TAPES: Record<WindowKind | "project", string> = {
  home: "var(--k-pink)", about: "var(--k-peach)", skills: "var(--k-mint)", projects: "var(--k-blue)", contact: "var(--k-lav)",
  project: "var(--k-blue)", paint: "var(--k-peach)", guestbook: "var(--k-pink)", terminal: "var(--k-lav)", github: "var(--k-blue)", settings: "var(--k-mint)", inbox: "var(--k-pink)",
};

/** Keeps the URL hash and the focused window in sync (#projects/<slug>, #paint…). */
function useDeepLinks() {
  const { windows, activeId, open } = useWindows();

  // URL → windows: on load and on back/forward or a manually edited hash.
  useEffect(() => {
    const apply = () => {
      const { targets, fixedHash } = parseHash(location.hash, (slug) => !!getProject(slug));
      if (location.hash.replace(/^#\/?/, "") === "") open({ type: "home" });
      targets.forEach(open);
      if (fixedHash !== undefined) history.replaceState(history.state, "", fixedHash || location.pathname + location.search);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [open]);

  // Windows → URL: newly opened windows get a history entry (so Back returns to the previous one);
  // focus changes between already-open windows just replace the current entry.
  const known = useRef<Set<string> | null>(null);
  useEffect(() => {
    const first = known.current === null;
    const prev = known.current ?? new Set<string>();
    known.current = new Set(windows.map((w) => w.id));
    if (first) return; // the initial route is applied by the effect above
    const active = windows.find((w) => w.id === activeId);
    const hash = hashFor(active);
    if (hash === location.hash || (!hash && !location.hash)) return;
    const url = hash || location.pathname + location.search;
    if (active && !prev.has(active.id)) history.pushState(history.state, "", url);
    else history.replaceState(history.state, "", url);
  }, [windows, activeId]);
}

function DesktopInner() {
  const { windows, activeId, close, focus, minimize, toggleMaximize, move, resize } = useWindows();
  const { t, lang } = useI18n();
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [loaded, setLoaded] = useState(false); // fonts + page assets are actually in
  const [ready, setReady] = useState(false);   // boot screen finished, desktop is live
  const finishBoot = useCallback(() => setReady(true), []);
  useDeepLinks();

  useEffect(() => {
    const measure = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const pageLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const done = () => setLoaded(true);
    Promise.all([document.fonts?.ready ?? Promise.resolve(), pageLoad]).then(done);
    const cap = setTimeout(done, 12_000); // safety net: never leave someone stuck on the boot screen
    return () => clearTimeout(cap);
  }, []);

  const mobile = vp.w < 768;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !activeId) return;
      // Don't throw away what someone is typing (guestbook form, terminal…).
      if ((e.target as Element | null)?.closest("input, textarea, select, [contenteditable]")) return;
      close(activeId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, close]);

  const titleOf = (w: DesktopWindow) => {
    if (w.type === "project") return getProject(w.slug)?.text[lang].title ?? "";
    return t.titles[w.type];
  };
  const shortTitle = (w: DesktopWindow) => {
    if (w.type === "project") return titleOf(w);
    return w.type in t.nav ? t.nav[w.type as keyof typeof t.nav] : t.apps[w.type as keyof typeof t.apps];
  };
  const active = windows.find((w) => w.id === activeId);
  // On mobile a maximized window covers the top tabs and the dock (its own buttons restore it).
  const coverNav = mobile && active?.maximized;

  return (
    <main className="relative h-dvh w-full overflow-hidden text-k-text">
      <Decor />
      {!mobile && <DesktopIcons />}
      {mobile ? <MobileTop titleOf={shortTitle} /> : <Sidebar />}
      {mobile && ready && !activeId && (
        <div className="absolute inset-x-0 top-1/3 z-10 flex flex-col items-center gap-3 px-8 text-center">
          <Cat className="w-32" />
          <p className="font-heading">{t.ui.empty}</p>
        </div>
      )}
      {/* pointer-events-none: empty desktop areas let clicks through to the icons below. */}
      <div className={`pointer-events-none absolute inset-0 ${coverNav ? "z-[60]" : "z-10"}`}>
        <AnimatePresence>
          {ready && windows.map((w) => {
            const Content = w.type === "project" ? null : REGISTRY[w.type];
            return (
              <Window
                key={w.id}
                win={w}
                active={w.id === activeId}
                hidden={mobile && w.id !== activeId}
                vp={vp}
                mobile={mobile}
                title={titleOf(w)}
                tape={TAPES[w.type]}
                onFocus={() => w.id !== activeId && focus(w.id)}
                onClose={close}
                onMinimize={minimize}
                onToggleMaximize={toggleMaximize}
                onMove={move}
                onResize={resize}
              >
                {w.type === "project" ? <ProjectDetailWindow slug={w.slug} /> : Content && <Content />}
              </Window>
            );
          })}
        </AnimatePresence>
      </div>
      {mobile ? <MobileDock /> : <Taskbar titleOf={titleOf} />}
      {!mobile && <ContextMenu />}
      <KonamiSecret />
      <AnimatePresence>{!ready && <BootScreen key="boot" loaded={loaded} onDone={finishBoot} />}</AnimatePresence>
    </main>
  );
}

export default function Desktop() {
  return (
    <WindowsProvider>
      <DrawingProvider>
        <MailboxProvider>
          <DesktopInner />
        </MailboxProvider>
      </DrawingProvider>
    </WindowsProvider>
  );
}
