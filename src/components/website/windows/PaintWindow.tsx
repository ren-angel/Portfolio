import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Download, Eraser, Paperclip, Pencil, Trash2, Undo2 } from "lucide-react";
import { LIMITS } from "../../../../guestbook-api/src/rules";
import { useDrawing } from "@/lib/drawing";
import { useI18n } from "@/lib/i18n";
import { playSound } from "@/lib/sounds";
import { useWindows } from "@/lib/windows";
import { toCanvasPoint } from "@/lib/paint";

const W = LIMITS.drawingWidth;
const H = LIMITS.drawingHeight;
const PAPER = "#FFFFFF";
const COLORS = [
  "#4A3B52", "#A98DAE", "#F6B8D0", "#FF7EB6", "#E5484D", "#FFB86B", "#FFE27A", "#C6EBDD",
  "#5BC49F", "#B9DEFA", "#5B9BF0", "#DCCBFA", "#9B7BEA", "#8B5E3C", "#000000", "#FFFFFF",
];
const SIZES = [2, 5, 10, 18];
const UNDO_STEPS = 25;

type Tool = "pencil" | "eraser";

export default function PaintWindow() {
  const { t } = useI18n();
  const p = t.paint;
  const { attachment, setAttachment } = useDrawing();
  const { open } = useWindows();
  const canvas = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const history = useRef<ImageData[]>([]);
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [canUndo, setCanUndo] = useState(false);
  const [note, setNote] = useState<"attached" | "tooBig" | null>(null);

  const ctx = () => canvas.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  // Fresh white paper; if a drawing is already attached to the guestbook, reopen it for editing.
  useEffect(() => {
    const c = ctx();
    if (!c) return;
    c.fillStyle = PAPER;
    c.fillRect(0, 0, W, H);
    if (attachment) {
      const img = new Image();
      img.onload = () => c.drawImage(img, 0, 0, W, H);
      img.src = attachment;
    }
    // Only on mount: later attachment changes come *from* this canvas.
  }, []);

  useEffect(() => {
    if (!note) return;
    const id = setTimeout(() => setNote(null), 2500);
    return () => clearTimeout(id);
  }, [note]);

  const snapshot = () => {
    const c = ctx();
    if (!c) return;
    history.current.push(c.getImageData(0, 0, W, H));
    if (history.current.length > UNDO_STEPS) history.current.shift();
    setCanUndo(true);
  };

  const undo = () => {
    const c = ctx();
    const prev = history.current.pop();
    if (c && prev) c.putImageData(prev, 0, 0);
    setCanUndo(history.current.length > 0);
  };

  const clear = () => {
    const c = ctx();
    if (!c) return;
    snapshot();
    c.fillStyle = PAPER;
    c.fillRect(0, 0, W, H);
    playSound("close");
  };

  const stroke = (to: { x: number; y: number }) => {
    const c = ctx();
    const from = last.current ?? to;
    if (!c) return;
    c.strokeStyle = tool === "eraser" ? PAPER : color;
    c.lineWidth = tool === "eraser" ? size * 2 : size;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(from.x, from.y);
    c.lineTo(to.x + (from.x === to.x && from.y === to.y ? 0.01 : 0), to.y); // a tap still makes a dot
    c.stroke();
    last.current = to;
  };

  const down = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    snapshot();
    last.current = null;
    stroke(toCanvasPoint(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect(), W, H));
  };
  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!last.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Coalesced events give smooth lines even when the browser batches pointer moves.
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    for (const ev of events.length ? events : [e.nativeEvent]) stroke(toCanvasPoint(ev.clientX, ev.clientY, rect, W, H));
  };
  const up = () => { last.current = null; };

  const download = () => {
    canvas.current?.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "drawing.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, "image/png");
  };

  const attach = () => {
    const url = canvas.current?.toDataURL("image/png");
    if (!url) return;
    const bytes = Math.floor(((url.length - "data:image/png;base64,".length) * 3) / 4);
    if (bytes > LIMITS.drawingMaxBytes) {
      setNote("tooBig");
      playSound("error");
      return;
    }
    setAttachment(url);
    setNote("attached");
    playSound("success");
    open({ type: "guestbook" });
  };

  const onKey = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
    }
  };

  const toolBtn = (active: boolean) =>
    `grid h-9 w-9 place-items-center rounded-xl border-2 border-k-outline transition-transform hover:-translate-y-0.5 ${
      active ? "bg-k-pink shadow-[0_2px_0_var(--k-outline)]" : "bg-k-surface"
    }`;

  return (
    <div className="flex min-h-full flex-col" onKeyDown={onKey}>
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-k-outline bg-k-cream px-3 py-2">
        <div role="group" aria-label={p.tools} className="flex gap-1.5">
          <button type="button" className={toolBtn(tool === "pencil")} aria-pressed={tool === "pencil"} aria-label={p.pencil} title={p.pencil} onClick={() => setTool("pencil")}>
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" className={toolBtn(tool === "eraser")} aria-pressed={tool === "eraser"} aria-label={p.eraser} title={p.eraser} onClick={() => setTool("eraser")}>
            <Eraser className="h-4 w-4" />
          </button>
        </div>
        <div role="group" aria-label={p.size} className="flex items-center gap-1 rounded-xl border-2 border-k-outline bg-k-surface px-1.5 py-1">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              aria-label={`${p.size}: ${s}px`}
              title={`${s}px`}
              onClick={() => setSize(s)}
              className={`grid h-7 w-7 place-items-center rounded-lg ${size === s ? "bg-k-lav" : "hover:bg-k-lav-soft"}`}
            >
              <span className="block rounded-full bg-k-text" style={{ width: Math.min(4 + s, 20), height: Math.min(4 + s, 20) }} />
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-1.5">
          <button type="button" className={toolBtn(false)} onClick={undo} disabled={!canUndo} aria-label={p.undo} title={`${p.undo} (Ctrl+Z)`} style={{ opacity: canUndo ? 1 : 0.45 }}>
            <Undo2 className="h-4 w-4" />
          </button>
          <button type="button" className={toolBtn(false)} onClick={clear} aria-label={p.clear} title={p.clear}>
            <Trash2 className="h-4 w-4" />
          </button>
          <button type="button" className={toolBtn(false)} onClick={download} aria-label={p.download} title={p.download}>
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* canvas */}
      <div className="grid flex-1 place-items-center bg-k-lav-soft p-3 sm:p-4">
        <canvas
          ref={canvas}
          width={W}
          height={H}
          role="img"
          aria-label={p.canvas}
          tabIndex={0}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onLostPointerCapture={up}
          className="aspect-[3/2] w-full max-w-[540px] cursor-crosshair rounded-md border-2 border-k-outline shadow-[4px_5px_0_rgb(var(--k-shadow)/.35)]"
          style={{ touchAction: "none", background: PAPER }}
        />
      </div>

      {/* palette + attach */}
      <div className="flex flex-wrap items-center gap-3 border-t-2 border-k-outline bg-k-surface px-3 py-2">
        <span aria-hidden="true" className="h-9 w-9 shrink-0 rounded-lg border-2 border-k-outline" style={{ background: tool === "eraser" ? PAPER : color }} />
        <div role="group" aria-label={p.colors} className="grid grid-cols-8 gap-1">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              aria-pressed={color === c && tool === "pencil"}
              onClick={() => { setColor(c); setTool("pencil"); }}
              className={`h-6 w-6 rounded-md border-2 transition-transform hover:scale-110 ${color === c && tool === "pencil" ? "scale-110 border-k-text" : "border-k-outline"}`}
              style={{ background: c }}
            />
          ))}
        </div>
        <button type="button" className="kbtn ml-auto" onClick={attach}>
          <Paperclip className="h-4 w-4" />
          {note === "attached" ? p.attached : p.attach}
        </button>
        <p role="status" className="w-full text-xs empty:hidden">
          {note === "tooBig" ? t.guestbook.errors.drawing : ""}
        </p>
      </div>
    </div>
  );
}
