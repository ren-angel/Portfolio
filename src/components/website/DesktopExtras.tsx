import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Brush, Image, Moon, SlidersHorizontal, SquareTerminal } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { WALLPAPERS, useSettings } from "@/lib/settings";
import { playSound } from "@/lib/sounds";
import { useWindows } from "@/lib/windows";
import { Heart, Sparkle, Star } from "./Illustrations";

/** Right-click on the wallpaper (desktop only). Ignores windows, sidebar and taskbar. */
export function ContextMenu() {
  const { t } = useI18n();
  const { open } = useWindows();
  const { theme, settings, update } = useSettings();
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const menu = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onMenu = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || target.closest("section[aria-label], nav, [data-no-menu], input, textarea, a")) return;
      e.preventDefault();
      setAt({ x: Math.min(e.clientX, window.innerWidth - 230), y: Math.min(e.clientY, window.innerHeight - 230) });
    };
    document.addEventListener("contextmenu", onMenu);
    return () => document.removeEventListener("contextmenu", onMenu);
  }, []);

  useEffect(() => {
    if (!at) return;
    menu.current?.querySelector("button")?.focus();
    const away = (e: PointerEvent) => !menu.current?.contains(e.target as Node) && setAt(null);
    const shut = () => setAt(null);
    document.addEventListener("pointerdown", away);
    window.addEventListener("resize", shut);
    window.addEventListener("blur", shut);
    return () => {
      document.removeEventListener("pointerdown", away);
      window.removeEventListener("resize", shut);
      window.removeEventListener("blur", shut);
    };
  }, [at]);

  if (!at) return null;

  const run = (fn: () => void) => () => { playSound("click"); fn(); setAt(null); };
  const items = [
    { icon: Brush, label: t.desktop.newDrawing, act: run(() => open({ type: "paint" })) },
    { icon: SquareTerminal, label: t.desktop.openTerminal, act: run(() => open({ type: "terminal" })) },
    { icon: Moon, label: t.desktop.toggleNight, act: run(() => update({ theme: theme === "night" ? "light" : "night" })) },
    { icon: Image, label: t.desktop.nextWallpaper, act: run(() => update({ wallpaper: WALLPAPERS[(WALLPAPERS.indexOf(settings.wallpaper) + 1) % WALLPAPERS.length] })) },
    { icon: SlidersHorizontal, label: t.desktop.openSettings, act: run(() => open({ type: "settings" })) },
  ];

  const onKey = (e: ReactKeyboardEvent) => {
    const buttons = [...(menu.current?.querySelectorAll("button") ?? [])];
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") { e.stopPropagation(); setAt(null); }
    else if (e.key === "ArrowDown") { e.preventDefault(); buttons[(i + 1) % buttons.length]?.focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); buttons[(i - 1 + buttons.length) % buttons.length]?.focus(); }
    else if (e.key === "Tab") setAt(null);
  };

  return (
    <ul
      ref={menu}
      role="menu"
      aria-label={t.desktop.menu}
      onKeyDown={onKey}
      className="pop-in fixed z-[90] w-56 rounded-2xl border-2 border-k-outline bg-k-surface/95 p-1.5 backdrop-blur-md"
      style={{ left: at.x, top: at.y, boxShadow: "0 10px 26px rgb(var(--k-shadow) / .4)", transformOrigin: "0 0" }}
    >
      {items.map(({ icon: Icon, label, act }) => (
        <li key={label} role="none">
          <button
            type="button"
            role="menuitem"
            onClick={act}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left font-heading text-sm hover:bg-k-pink focus-visible:bg-k-pink focus-visible:outline-none"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />{label}
          </button>
        </li>
      ))}
    </ul>
  );
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const PIECES = Array.from({ length: 36 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 12) * 0.12}s`,
  dur: `${2.4 + (i % 5) * 0.35}s`,
  size: 14 + (i % 4) * 7,
  kind: i % 3,
  fill: ["#F6B8D0", "#DCCBFA", "#C6EBDD", "#FFF0DA", "#B9DEFA", "#FFD9C0"][i % 6],
}));

/** ↑↑↓↓←→←→BA: a shower of hearts, stars and sparkles. */
export function KonamiSecret() {
  const { t } = useI18n();
  const [party, setParty] = useState(0);
  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as Element | null;
      if (el?.closest("input, textarea")) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        playSound("success");
        setParty(Date.now());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (!party) return;
    const id = setTimeout(() => setParty(0), 4500);
    return () => clearTimeout(id);
  }, [party]);

  if (!party) return null;
  return (
    <div key={party} className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
      {PIECES.map((p, i) => {
        const Art = [Heart, Star, Sparkle][p.kind];
        return (
          <Art key={i} className="confetti absolute -top-10" fill={p.fill} style={{ left: p.left, width: p.size, animationDelay: p.delay, animationDuration: p.dur }} />
        );
      })}
      <p role="status" className="pop-in absolute left-1/2 top-1/3 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-k-outline bg-k-surface px-5 py-2 font-heading text-xl shadow-[0_4px_0_var(--k-outline)]">
        {t.desktop.secret}
      </p>
    </div>
  );
}
