import { navItems } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { useWindows, type DesktopWindow } from "@/lib/windows";
import LangSwitcher from "./LangSwitcher";
import { NavButton } from "./Sidebar";

export function MobileTop({ titleOf }: { titleOf: (win: DesktopWindow) => string }) {
  const { t } = useI18n();
  const { windows, activeId, focus } = useWindows();
  return (
    <div className="absolute inset-x-2 top-2 z-50 flex items-center gap-2">
      <ul aria-label={t.ui.openWindows} className="k-scroll flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-1">
        {windows.map((w) => (
          <li key={w.id} className="shrink-0">
            <button
              type="button"
              onClick={() => focus(w.id)}
              aria-pressed={activeId === w.id}
              className={`max-w-[9rem] truncate rounded-full border-2 border-k-outline px-3 py-1 font-heading text-sm text-k-text ${
                activeId === w.id ? "bg-k-pink" : "bg-white/80"
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

export function MobileDock() {
  const { t } = useI18n();
  return (
    <nav
      aria-label={t.ui.sidebar}
      className="absolute inset-x-2 bottom-2 z-50 rounded-[26px] border-2 border-k-outline bg-white/80 px-1 py-1 backdrop-blur-md"
      style={{ boxShadow: "0 8px 24px rgba(169,141,174,.35)" }}
    >
      <ul className="grid grid-cols-5 gap-1">
        {navItems.map((item, i) => (
          <NavButton key={item.id} item={item} index={i} compact />
        ))}
      </ul>
    </nav>
  );
}
