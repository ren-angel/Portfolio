import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X, Star as StarIcon, Heart as HeartIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

import type { DesktopWindow } from "@/lib/windows";

interface WindowProps {
  win: DesktopWindow;
  active: boolean;
  vp: { w: number; h: number };
  mobile: boolean;
  title: string;
  tape?: string;
  children: ReactNode;
  onFocus: () => void;
  onClose: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, w: number, h: number) => void;
}

const SIDEBAR_EDGE = 124;
const MARGIN = 8;
const MIN_W = 320;
const MIN_H = 240;

// Reusable desktop window: pastel title bar, drag by title, resize by corner.
export default function Window({ win, active, vp, mobile, title, tape = "#F6B8D0", children, onFocus, onClose, onMove, onResize }: WindowProps) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const size = useRef<{ sx: number; sy: number; ow: number; oh: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const w = Math.min(win.w, vp.w - SIDEBAR_EDGE - MARGIN);
  const h = Math.min(win.h, vp.h - 16);
  const clampX = (x: number) => Math.max(SIDEBAR_EDGE, Math.min(x, vp.w - w - MARGIN));
  const clampY = (y: number) => Math.max(MARGIN, Math.min(y, vp.h - h - MARGIN));
  const x = clampX(win.x);
  const y = clampY(win.y);

  const startDrag = (e: PointerEvent<HTMLElement>) => {
    if (mobile || !e.isPrimary || e.button !== 0 || (e.target instanceof Element && e.target.closest("button"))) return;
    drag.current = { sx: e.clientX, sy: e.clientY, ox: x, oy: y };
    e.currentTarget.setPointerCapture(e.pointerId);
    setBusy(true);
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
  };
  const moveSize = (e: PointerEvent<HTMLElement>) => {
    const s = size.current;
    if (!s) return;
    onResize(
      win.id,
      Math.max(MIN_W, Math.min(s.ow + e.clientX - s.sx, vp.w - x - 8)),
      Math.min(vp.h - y - MARGIN, Math.max(MIN_H, s.oh + e.clientY - s.sy))
    );
  };
  const endSize = () => (size.current = null);

  const style = mobile
    ? { left: 8, right: 8, top: 60, bottom: 96, zIndex: 10 }
    : { left: x, top: y, width: w, height: h, zIndex: win.z + 10 };

  return (
    <motion.section
      aria-label={title}
      className="absolute"
      style={style}
      initial={reduce ? false : { scale: 0.8, opacity: 0 }}
      animate={reduce ? { opacity: 1 } : { scale: [0.8, 1.05, 1], opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { scale: 0.9, opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      onPointerDownCapture={onFocus}
      onFocusCapture={onFocus}
    >
      {!mobile && (
        <span aria-hidden="true" className="pointer-events-none absolute -top-3 left-10 z-10 h-6 w-16 -rotate-6 rounded-sm border border-dashed border-white/80 opacity-90" style={{ background: tape }} />
      )}
      <div
        className="flex h-full flex-col overflow-hidden rounded-[24px] border-2 border-k-outline bg-white/90 backdrop-blur-sm transition-[box-shadow,filter,opacity] duration-200"
        style={{
          opacity: busy ? 0.8 : 1,
          filter: active ? "none" : "grayscale(15%)",
          boxShadow: active
            ? "0 14px 0 -6px rgba(169,141,174,.25), 0 22px 40px rgba(169,141,174,.38)"
            : "0 6px 14px rgba(169,141,174,.2)",
        }}
      >
        <header
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`titlebar-dots flex h-12 shrink-0 select-none items-center gap-2 border-b-2 border-k-outline px-3 ${
            active ? "bg-k-pink" : "bg-k-lav"
          } ${mobile ? "" : busy ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ touchAction: "none" }}
        >
          <StarIcon aria-hidden="true" className="h-4 w-4 fill-white text-k-outline" />
          <h2 className="min-w-0 flex-1 truncate font-heading text-base text-k-text">{title}</h2>
          <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full border-2 border-k-outline bg-k-mint">
            <HeartIcon className="h-3 w-3 fill-white text-k-outline" />
          </span>
          <span aria-hidden="true" className="h-6 w-6 rounded-full border-2 border-k-outline bg-k-cream" />
          <button
            type="button"
            onClick={() => onClose(win.id)}
            aria-label={`${t.ui.close}: ${title}`}
            className="grid h-7 w-7 place-items-center rounded-full border-2 border-k-outline bg-white text-k-text transition-transform hover:rotate-90 hover:scale-110 hover:bg-k-peach"
          >
            <X className="h-4 w-4" strokeWidth={3} />
          </button>
        </header>
        <div className="k-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-k-bg/60">{children}</div>
      </div>
      {!mobile && (
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
            <path d="M16 4 L4 16 M16 10 L10 16" stroke="#A98DAE" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </motion.section>
  );
}
