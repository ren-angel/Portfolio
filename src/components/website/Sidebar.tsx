import type { CSSProperties } from "react";
import { navItems, type NavItem } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { useWindows } from "@/lib/windows";
import FolderIcon from "./FolderIcon";
import LangSwitcher from "./LangSwitcher";
import { Star, Sparkle } from "./Illustrations";

export function NavButton({ item, index, compact = false }: { item: NavItem; index: number; compact?: boolean }) {
  const { t } = useI18n();
  const { windows, activeId, open } = useWindows();
  const isOpen = windows.some((w) => w.id === item.id);
  const active = activeId === item.id;
  return (
    <li>
      <button
        type="button"
        onClick={() => open({ type: item.id })}
        aria-label={t.nav[item.id]}
        aria-current={active ? "true" : undefined}
        className={`folder-btn group relative flex w-full flex-col items-center rounded-2xl border-2 transition-colors ${
          compact ? "gap-0 px-1 py-1" : "gap-1 px-1 py-2"
        } ${active ? "border-k-outline bg-k-surface/80" : "border-transparent hover:bg-k-surface/50"}`}
      >
        <span className={`folder-art relative block ${compact ? "w-11" : "w-[66px]"}`} style={{ "--d": `${index * 0.55}s` } as CSSProperties}>
          <FolderIcon kind={item.id} color={item.color} shade={item.shade} className="w-full" />
          {active && <Star className="pop-in absolute -right-2 -top-2 w-6" fill="#FFF0DA" />}
        </span>
        <span className={`font-heading leading-tight text-k-text ${compact ? "text-[11px]" : "text-sm"}`}>{t.nav[item.id]}</span>
        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-k-outline" : "bg-transparent"}`} />
      </button>
    </li>
  );
}

export default function Sidebar() {
  const { t } = useI18n();
  return (
    <nav
      aria-label={t.ui.sidebar}
      className="k-scroll absolute bottom-3 left-3 top-3 z-50 flex w-[104px] flex-col items-center gap-2 overflow-y-auto overflow-x-hidden rounded-[28px] border-2 border-k-outline bg-k-surface/70 px-1.5 py-3 backdrop-blur-md"
      style={{ boxShadow: "0 10px 30px rgb(var(--k-shadow)/.3)" }}
    >
      <Sparkle className="floaty w-7 shrink-0" fill="#F6B8D0" />
      <ul className="flex w-full flex-1 flex-col justify-center gap-1">
        {navItems.map((item, i) => (
          <NavButton key={item.id} item={item} index={i} />
        ))}
      </ul>
      <LangSwitcher vertical />
    </nav>
  );
}
