import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X, Star as StarIcon, Heart as HeartIcon, Maximize2, Minimize2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { playSound } from "@/lib/sounds";
import type { DesktopWindow } from "@/lib/windows";

interface WindowProps {
  win: DesktopWindow;
  active: boolean;
  /** Mobile shows one window at a time; the others stay mounted but hidden (keeps their state). */
  hidden: boolean;
  vp: { w: number; h: number };
  mobile: boolean;
  title: string;
  tape?: string;
  children: ReactNode;
  onFocus: () => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onToggleMaximize: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, w: number, h: number) => void;
}

export const SIDEBAR_EDGE = 124;
/** Space kept free at the bottom for the desktop taskbar. */
export const TASKBAR_SPACE = 66;
const MARGIN = 8;
const MIN_W = 320;
const MIN_H = 240;

// Reusable desktop window: pastel title bar, drag by title, resize by corner,
// heart = minimize, cream bubble = maximize/restore, X = close.
export default function Window({
  win, active, hidden, vp, mobile, title, tape = "var(--k-pink)", children,
  onFocus, onClose, onMinimize, onToggleMaximize, onMove, onResize,
}: WindowProps) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const size = useRef<{ sx: number; sy: number; ow: number; oh: number } | null>(null);
  const [busy, setBusy] = useState<false | "drag" | "resize">(false);
  const max = win.maximized;
  const shown = !hidden && !win.minimized;

  const bottom = vp.h - TASKBAR_SPACE;
  const w = Math.max(Math.min(MIN_W, vp.w - SIDEBAR_EDGE - MARGIN), Math.min(win.w, vp.w - SIDEBAR_EDGE - MARGIN));
  const h = Math.max(Math.min(MIN_H, bottom - MARGIN), Math.min(win.h, bottom - MARGIN));
  const clampX = (x: number) => Math.max(SIDEBAR_EDGE, Math.min(x, vp.w - w - MARGIN));
  const clampY = (y: number) => Math.max(MARGIN, Math.min(y, bottom - h));
  const x = clampX(win.x);
  const y = clampY(win.y);
  const canDrag = !mobile && !max;

  const startDrag = (e: PointerEvent<HTMLElement>) => {
    if (!canDrag || !e.isPrimary || e.button !== 0 || (e.target instanceof Element && e.target.closest("button"))) return;
    drag.current = { sx: e.clientX, sy: e.clientY, ox: x, oy: y };
    e.currentTarget.setPointerCapture(e.pointerId);
    setBusy("drag");
  };
  const moveDrag = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (d) onMove(win.id, clampX(d.ox + e.clientX - d.sx), clampY(d.oy + e.clientY - d.sy));
  };
  const endDrag = () => {
    drag.current = null;
    setBusy(false);
  };

  const startSize = (e: PointerEvent<HTMLElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    size.current = { sx: e.clientX, sy: e.clientY, ow: w, oh: h };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
    setBusy("resize");
  };
  const moveSize = (e: PointerEvent<HTMLElement>) => {
    const s = size.current;
    if (!s) return;
    onResize(
      win.id,
      Math.max(MIN_W, Math.min(s.ow + e.clientX - s.sx, vp.w - x - MARGIN)),
      Math.min(bottom - y, Math.max(MIN_H, s.oh + e.clientY - s.sy))
    );
  };
  const endSize = () => {
    size.current = null;
    setBusy(false);
  };

  const minimize = () => { playSound("minimize"); onMinimize(win.id); };
  const toggleMax = () => { playSound(max ? "restore" : "maximize"); onToggleMaximize(win.id); };
  const close = () => { playSound("close"); onClose(win.id); };

  // Geometry glides between normal and maximized; no transition while dragging/resizing.
  const glide = busy ? "none" : "left .28s ease, top .28s ease, width .28s ease, height .28s ease, right .28s ease, bottom .28s ease";
  const style: CSSProperties = mobile
    ? max
      ? { left: 0, right: 0, top: 0, bottom: 0, zIndex: win.z + 10 }
      : { left: 8, right: 8, top: 60, bottom: 96, zIndex: win.z + 10 }
    : max
      ? { left: SIDEBAR_EDGE, top: MARGIN, width: vp.w - SIDEBAR_EDGE - MARGIN, height: bottom - MARGIN, zIndex: win.z + 10 }
      : { left: x, top: y, width: w, height: h, zIndex: win.z + 10 };

  const ctl = mobile ? "h-8 w-8" : "h-6 w-6";

  return (
    <motion.section
      aria-label={title}
      aria-hidden={!shown}
      inert={!shown}
      className={`absolute ${shown ? "pointer-events-auto" : "pointer-events-none"}`}
      style={{ ...style, transition: glide, transformOrigin: mobile ? "50% 0%" : "50% 100%" }}
      initial={reduce ? false : { scale: 0.8, opacity: 0 }}
      animate={
        shown
          ? reduce ? { opacity: 1, scale: 1, y: 0 } : { scale: [null, 1.04, 1], opacity: 1, y: 0 }
          : reduce ? { opacity: 0 } : { scale: 0.55, opacity: 0, y: mobile ? 0 : 140, transition: { duration: 0.22, ease: "easeIn" } }
      }
      exit={reduce ? { opacity: 0 } : { scale: 0.9, opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.34, ease: "easeOut" }}
      onPointerDownCapture={onFocus}
      onFocusCapture={onFocus}
    >
      {!mobile && !max && (
        <span aria-hidden="true" className="pointer-events-none absolute -top-3 left-10 z-10 h-6 w-16 -rotate-6 rounded-sm border border-dashed border-white/80 opacity-90" style={{ background: tape }} />
      )}
      <div
        className={`flex h-full flex-col overflow-hidden border-2 border-k-outline bg-k-surface/90 backdrop-blur-sm transition-[box-shadow,filter,opacity,border-radius] duration-200 ${
          mobile && max ? "rounded-none" : "rounded-[24px]"
        }`}
        style={{
          opacity: busy === "drag" ? 0.8 : 1,
          filter: active ? "none" : "grayscale(15%)",
          boxShadow: active
            ? "0 14px 0 -6px rgb(var(--k-shadow) / .25), 0 22px 40px rgb(var(--k-shadow) / .38)"
            : "0 6px 14px rgb(var(--k-shadow) / .2)",
        }}
      >
        <header
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={(e) => !mobile && !(e.target instanceof Element && e.target.closest("button")) && toggleMax()}
          className={`titlebar-dots flex h-12 shrink-0 select-none items-center gap-2 border-b-2 border-k-outline px-3 ${
            active ? "bg-k-pink" : "bg-k-lav"
          } ${canDrag ? (busy === "drag" ? "cursor-grabbing" : "cursor-grab") : ""}`}
          style={{ touchAction: canDrag ? "none" : undefined }}
        >
          <StarIcon aria-hidden="true" className="h-4 w-4 shrink-0 fill-white text-k-outline" />
          <h2 className="min-w-0 flex-1 truncate font-heading text-base text-k-text">{title}</h2>
          <button
            type="button"
            onClick={minimize}
            aria-label={`${t.ui.minimize}: ${title}`}
            data-tip={t.ui.minimize}
            className={`kctl group grid ${ctl} shrink-0 place-items-center rounded-full border-2 border-k-outline bg-k-mint transition-transform hover:-translate-y-0.5 hover:scale-110 active:scale-90`}
          >
            <HeartIcon aria-hidden="true" className="h-3 w-3 fill-white text-k-outline transition-colors group-hover:fill-[#F6B8D0]" />
          </button>
          <button
            type="button"
            onClick={toggleMax}
            aria-label={`${max ? t.ui.restore : t.ui.maximize}: ${title}`}
            data-tip={max ? t.ui.restore : t.ui.maximize}
            className={`kctl group grid ${ctl} shrink-0 place-items-center rounded-full border-2 border-k-outline bg-k-cream transition-transform hover:-translate-y-0.5 hover:scale-110 active:scale-90`}
          >
            {max
              ? <Minimize2 aria-hidden="true" className="h-3 w-3 text-k-text opacity-70 transition-opacity group-hover:opacity-100" strokeWidth={3} />
              : <Maximize2 aria-hidden="true" className="h-3 w-3 text-k-text opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" strokeWidth={3} />}
          </button>
          <button
            type="button"
            onClick={close}
            aria-label={`${t.ui.close}: ${title}`}
            data-tip={t.ui.closeShort}
            className={`kctl group grid ${mobile ? "h-8 w-8" : "h-7 w-7"} shrink-0 place-items-center rounded-full border-2 border-k-outline bg-k-surface text-k-text transition-transform hover:scale-110 hover:bg-k-peach active:scale-90`}
          >
            <X aria-hidden="true" className="h-4 w-4 transition-transform group-hover:rotate-90" strokeWidth={3} />
          </button>
        </header>
        <div className="k-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-k-bg/60">{children}</div>
      </div>
      {!mobile && !max && (
        <div
          role="separator"
          aria-label={t.ui.resize}
          onPointerDown={startSize}
          onPointerMove={moveSize}
          onPointerUp={endSize}
          onPointerCancel={endSize}
          className="absolute -bottom-1 -right-1 z-10 grid h-7 w-7 cursor-nwse-resize place-items-end"
          style={{ touchAction: "none" }}
        >
          <svg viewBox="0 0 20 20" className="mb-2 mr-2 h-4 w-4" aria-hidden="true">
            <path d="M16 4 L4 16 M16 10 L10 16" style={{ stroke: "var(--k-outline)" }} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </motion.section>
  );
}
