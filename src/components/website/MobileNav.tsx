import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { appItems, navItems } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { playSound } from "@/lib/sounds";
import { useWindows, type DesktopWindow } from "@/lib/windows";
import { useMailbox } from "@/lib/mailbox";
import LangSwitcher from "./LangSwitcher";
import { NavButton } from "./Sidebar";
import { AppButton } from "./DesktopIcons";

// On mobile this row is the taskbar: every open window is a tab; minimized ones are dashed.
export function MobileTop({ titleOf }: { titleOf: (win: DesktopWindow) => string }) {
  const { t } = useI18n();
  const { windows, activeId, focus } = useWindows();
  return (
    <div className="absolute inset-x-2 top-2 z-50 flex items-center gap-2" data-no-menu>
      <ul aria-label={t.ui.openWindows} className="k-scroll flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1">
        {windows.map((w) => (
          <li key={w.id} className="shrink-0">
            <button
              type="button"
              onClick={() => { playSound(w.minimized ? "restore" : "click"); focus(w.id); }}
              aria-pressed={activeId === w.id}
              className={`max-w-[9rem] truncate rounded-full border-2 border-k-outline px-3 py-1 font-heading text-sm text-k-text ${
                activeId === w.id ? "bg-k-pink" : w.minimized ? "border-dashed bg-transparent opacity-80" : "bg-k-surface/80"
              }`}
            >
              {titleOf(w)}
            </button>
          </li>
        ))}
      </ul>
      <LangSwitcher />
    </div>
  );
}

function AppsMenu() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const { unseen } = useMailbox();
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <li ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-apps"
        className={`flex w-full flex-col items-center gap-0 rounded-2xl border-2 px-1 py-1 ${open ? "border-k-outline bg-k-surface/80" : "border-transparent"}`}
      >
        <span className="relative grid h-[37px] w-11 place-items-center">
          <Sparkles className="h-7 w-7 text-k-text" />
          {unseen > 0 && <span aria-hidden="true" className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-k-outline bg-k-pink" />}
        </span>
        <span className="font-heading text-[11px] leading-tight text-k-text">{t.ui.apps}</span>
        <span aria-hidden="true" className="h-1.5 w-1.5" />
      </button>
      {open && (
        <div
          id="mobile-apps"
          className="pop-in absolute bottom-[calc(100%+12px)] right-0 w-[min(19rem,calc(100vw-1.5rem))] rounded-3xl border-2 border-k-outline bg-k-surface/95 p-2 backdrop-blur-md"
          style={{ boxShadow: "0 10px 30px rgb(var(--k-shadow) / .35)", transformOrigin: "90% 100%" }}
        >
          <ul className="grid grid-cols-3 justify-items-center gap-1">
            {appItems.map((item) => (
              <li key={item.id}><AppButton item={item} compact onOpen={() => setOpen(false)} /></li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export function MobileDock() {
  const { t } = useI18n();
  return (
    <nav
      aria-label={t.ui.sidebar}
      className="absolute inset-x-2 bottom-2 z-50 rounded-[26px] border-2 border-k-outline bg-k-surface/80 px-1 py-1 backdrop-blur-md"
      style={{ boxShadow: "0 8px 24px rgb(var(--k-shadow) / .35)" }}
      data-no-menu
    >
      <ul className="grid grid-cols-6 gap-0.5">
        {navItems.map((item, i) => (
          <NavButton key={item.id} item={item} index={i} compact />
        ))}
        <AppsMenu />
      </ul>
    </nav>
  );
}
