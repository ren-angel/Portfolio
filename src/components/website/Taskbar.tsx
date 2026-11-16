import { useEffect, useRef, useState } from "react";
import { Moon, SlidersHorizontal, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { playSound } from "@/lib/sounds";
import { useWindows, type DesktopWindow } from "@/lib/windows";
import { SIDEBAR_EDGE } from "./Window";

function Clock() {
  const { lang, t } = useI18n();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  const locale = lang === "pt" ? "pt-BR" : lang;
  return (
    <time aria-label={t.ui.clock} dateTime={now.toISOString()} className="px-1 font-heading text-sm tabular-nums">
      {now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
    </time>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const { theme, update } = useSettings();
  const night = theme === "night";
  return (
    <button
      type="button"
      onClick={() => { playSound("click"); update({ theme: night ? "light" : "night" }); }}
      aria-label={t.desktop.toggleNight}
      aria-pressed={night}
      title={t.desktop.toggleNight}
      className={`grid h-8 w-8 place-items-center rounded-full border-2 border-k-outline bg-k-cream transition-transform hover:rotate-12 hover:scale-110 ${className}`}
    >
      {night ? <Moon className="h-4 w-4 fill-current" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}

// Desktop taskbar: one button per open window (minimized ones look "tucked away"),
// plus a tiny system tray. Clicking the focused window minimizes it, like a real OS.
export default function Taskbar({ titleOf }: { titleOf: (w: DesktopWindow) => string }) {
  const { t } = useI18n();
  const { windows, activeId, focus, minimize, open } = useWindows();
  // `windows` is sorted by z (it changes on every focus); buttons keep the order windows were opened in.
  const order = useRef<string[]>([]);
  const ids = windows.map((w) => w.id);
  const kept = order.current.filter((id) => ids.includes(id));
  order.current = [...kept, ...ids.filter((id) => !kept.includes(id))]; // idempotent, safe during render
  const list = order.current.map((id) => windows.find((w) => w.id === id)).filter((w): w is DesktopWindow => !!w);

  return (
    <div
      role="toolbar"
      aria-label={t.ui.taskbar}
      className="absolute bottom-3 right-3 z-50 flex h-[50px] items-center gap-2 rounded-[22px] border-2 border-k-outline bg-k-surface/80 px-2 backdrop-blur-md"
      style={{ left: SIDEBAR_EDGE, boxShadow: "0 8px 24px rgb(var(--k-shadow) / .3)" }}
      data-no-menu
    >
      <ul className="k-scroll flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-1">
        {list.map((w) => {
          const active = w.id === activeId;
          return (
            <li key={w.id} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (active) { playSound("minimize"); minimize(w.id); }
                  else { playSound(w.minimized ? "restore" : "click"); focus(w.id); }
                }}
                aria-pressed={active}
                title={titleOf(w)}
                className={`flex max-w-[11rem] items-center gap-1.5 rounded-full border-2 px-3 py-0.5 font-heading text-sm transition-all hover:-translate-y-0.5 ${
                  active
                    ? "border-k-outline bg-k-pink shadow-[0_2px_0_var(--k-outline)]"
                    : w.minimized
                      ? "border-dashed border-k-outline bg-transparent opacity-75 hover:opacity-100"
                      : "border-k-outline bg-k-surface"
                }`}
              >
                <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full border border-k-outline ${w.minimized ? "bg-transparent" : "bg-k-mint"}`} />
                <span className="truncate">{titleOf(w)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex shrink-0 items-center gap-1.5 border-l-2 border-dashed border-k-outline pl-2">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => { playSound("open"); open({ type: "settings" }); }}
          aria-label={t.apps.settings}
          title={t.apps.settings}
          className="grid h-8 w-8 place-items-center rounded-full border-2 border-k-outline bg-k-mint transition-transform hover:rotate-12 hover:scale-110"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <Clock />
      </div>
    </div>
  );
}
