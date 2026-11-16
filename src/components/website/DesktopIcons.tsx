import { appItems, type AppItem } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { playSound } from "@/lib/sounds";
import { useWindows } from "@/lib/windows";
import { useMailbox } from "@/lib/mailbox";
import AppIcon from "./AppIcon";

export function AppButton({ item, compact = false, onOpen }: { item: AppItem; compact?: boolean; onOpen?: () => void }) {
  const { t } = useI18n();
  const { windows, open } = useWindows();
  const isOpen = windows.some((w) => w.id === item.id);
  const { unseen } = useMailbox();
  const badge = item.id === "guestbook" && unseen > 0;
  return (
    <button
      type="button"
      onClick={() => { playSound("open"); open({ type: item.id }); onOpen?.(); }}
      className={`folder-btn group flex flex-col items-center gap-1 rounded-2xl border-2 border-transparent p-1.5 transition-colors hover:border-k-outline hover:bg-k-surface/50 focus-visible:bg-k-surface/50 ${compact ? "w-[74px]" : "min-w-[84px]"}`}
    >
      <span className="folder-art relative block w-12">
        <AppIcon kind={item.id} color={item.color} className="w-full" />
        {badge && (
          <span className="pop-in absolute -right-2 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-k-outline bg-k-pink px-1 font-heading text-[11px] leading-none" aria-label={t.guestbook.newReply}>
            {unseen}
          </span>
        )}
      </span>
      <span className={`whitespace-nowrap rounded-full px-2 font-heading text-xs leading-5 text-k-text ${isOpen ? "bg-k-surface/80" : ""}`}>{t.apps[item.id]}</span>
    </button>
  );
}

// Classic desktop shortcuts, top-right of the wallpaper (desktop only; mobile uses the dock's Apps button).
export default function DesktopIcons() {
  const { t } = useI18n();
  return (
    <nav aria-label={t.ui.desktopApps} className="absolute right-4 top-4 z-[5]">
      <ul className="flex flex-col items-center gap-1">
        {appItems.map((item) => (
          <li key={item.id}><AppButton item={item} /></li>
        ))}
      </ul>
    </nav>
  );
}
