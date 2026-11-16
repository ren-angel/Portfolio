import { useEffect, useRef, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/content/portfolio";

interface Labels { screenshot: string; video: string; closeShot: string; prevShot: string; nextShot: string }

const MEDIA = "block max-h-[78vh] max-w-[92vw] rounded-2xl border-2 border-k-outline bg-k-surface object-contain shadow-lg";

interface Props {
  items: GalleryItem[];
  /** Index of the open item, or null when closed. */
  index: number | null;
  title: string;
  labels: Labels;
  onIndex: (index: number | null) => void;
}

// Enlarged screenshot (or video player) in a native <dialog>. showModal() puts it in the browser's top layer (above
// every desktop window, even ones moved with CSS transforms), keeps focus inside, and gives focus
// back to the thumbnail when it closes.
export default function ScreenshotViewer({ items, index, title, labels, onIndex }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const isOpen = index !== null;
  const many = items.length > 1;
  const item = index === null ? null : items[index];

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const go = (step: number) => {
    if (index !== null) onIndex((index + step + items.length) % items.length);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    // The dialog closes itself on Esc; stop it here so the desktop doesn't also close the window.
    if (e.key === "Escape") e.stopPropagation();
    // On the video player, arrows seek the video instead of switching items.
    else if (e.target instanceof HTMLVideoElement) return;
    else if (many && e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (many && e.key === "ArrowRight") { e.preventDefault(); go(1); }
  };

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={() => onIndex(null)}
      onKeyDown={onKeyDown}
      // A click on the dimmed backdrop lands on the <dialog> itself.
      onClick={(e) => { if (e.target === e.currentTarget) ref.current?.close(); }}
      className="m-auto max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-[#2A2444]/70"
    >
      {index !== null && item !== null && (
        <figure className="flex flex-col items-center gap-3">
          {typeof item === "string" ? (
            <img src={item} alt={`${title} - ${labels.screenshot} ${index + 1}`} className={MEDIA} />
          ) : (
            // Muted autoplay is allowed everywhere; the controls can turn the sound on.
            <video key={index} src={item.video} poster={item.poster} aria-label={`${title} - ${labels.video}`}
              controls autoPlay muted playsInline preload="metadata" className={MEDIA} />
          )}
          <figcaption className="flex items-center gap-2 rounded-full border-2 border-k-outline bg-k-surface px-2 py-1 font-heading text-sm text-k-text">
            {many && (
              <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-k-pink" aria-label={labels.prevShot} onClick={() => go(-1)}>
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <span className="px-1">{title}{many && ` · ${index + 1} / ${items.length}`}</span>
            {many && (
              <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-k-pink" aria-label={labels.nextShot} onClick={() => go(1)}>
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
            <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-k-pink" aria-label={labels.closeShot} onClick={() => ref.current?.close()} autoFocus>
              <X className="h-5 w-5" />
            </button>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}
