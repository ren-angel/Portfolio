import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CatFace, Heart, Sparkle, Star } from "./Illustrations";
import { useI18n } from "@/lib/i18n";

const LINE_MS = 190;  // POST check: one line per tick
const BLOCK_MS = 65;  // splash: one bar block per tick
const BLOCKS = 14;
const HOLD_MS = 380;  // pause on the full bar before handing over to the desktop
const BLOCK_COLORS = ["bg-k-pink", "bg-k-peach", "bg-k-mint", "bg-k-blue", "bg-k-lav"];

// Retro "KawaiiOS" boot: a BIOS-style self-check, then a splash with a chunky block bar.
// Runs for ~2.6s at minimum; if the page still isn't loaded, the bar parks short of the end
// and waits. Any key or click skips the minimum (but never the real wait).
export default function BootScreen({ loaded, onDone }: { loaded: boolean; onDone: () => void }) {
  const { t } = useI18n();
  const lines = t.boot.lines;
  const [shown, setShown] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const splash = skipped || shown > lines.length; // one extra tick = short pause before the splash

  useEffect(() => {
    if (splash) return;
    const id = setTimeout(() => setShown((n) => n + 1), LINE_MS);
    return () => clearTimeout(id);
  }, [shown, splash]);

  useEffect(() => {
    if (!splash) return;
    if (blocks >= BLOCKS) {
      const id = setTimeout(onDone, skipped ? 120 : HOLD_MS);
      return () => clearTimeout(id);
    }
    if (blocks >= BLOCKS - 2 && !loaded) return; // the page is genuinely still loading: wait here
    const id = setTimeout(() => setBlocks((b) => b + 1), skipped ? 20 : BLOCK_MS);
    return () => clearTimeout(id);
  }, [splash, blocks, loaded, skipped, onDone]);

  useEffect(() => {
    const skip = () => setSkipped(true);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={t.boot.starting}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-k-bg wallpaper px-4"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative w-[min(92vw,30rem)]">
        <Star className="twinkle absolute -left-6 -top-6 z-10 w-8" fill="#DCCBFA" />
        <Sparkle className="floaty absolute -right-4 -top-7 z-10 w-6" fill="#C6EBDD" />
        <Heart className="floaty absolute -bottom-4 -left-3 z-10 w-6" style={{ animationDelay: "1.4s" }} />

        {/* the "monitor" */}
        <div className="rounded-[28px] border-2 border-k-outline bg-k-surface p-3 shadow-[0_8px_0_rgb(var(--k-shadow)/.35)]">
          <div className="crt relative h-72 overflow-hidden rounded-2xl border-2 border-k-outline bg-k-lav-soft">
            <AnimatePresence mode="wait" initial={false}>
              {!splash ? (
                <motion.div
                  key="post"
                  className="flex h-full flex-col gap-1 p-4 font-mono text-[12px] leading-5 text-k-text sm:text-[13px]"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="font-bold">✿ KawaiiOS BIOS v2.0</p>
                  <p className="mb-2 text-k-outline">(c) 2000 guest@portfolio-desktop</p>
                  {lines.slice(0, shown).map((line) => (
                    <p key={line} className="flex items-center justify-between gap-3">
                      <span className="truncate">{line}</span>
                      <span className="shrink-0 rounded-full border border-k-outline bg-k-mint px-2 text-[10px] font-bold leading-4">OK</span>
                    </p>
                  ))}
                  <span className="blink mt-0.5 inline-block h-3.5 w-2 bg-k-text" />
                </motion.div>
              ) : (
                <motion.div
                  key="splash"
                  className="flex h-full flex-col items-center justify-center gap-3 px-6"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <CatFace className="floaty w-20" />
                  <p className="font-heading text-3xl font-semibold leading-none text-k-text">
                    KawaiiOS<sup className="ml-1 text-sm text-k-outline">2000</sup>
                  </p>
                  <div
                    className="mt-1 flex w-full max-w-[17rem] gap-1 rounded-xl border-2 border-k-outline bg-k-surface p-1"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={BLOCKS}
                    aria-valuenow={blocks}
                  >
                    {Array.from({ length: BLOCKS }, (_, i) => (
                      <span
                        key={i}
                        className={`h-4 flex-1 rounded-[4px] border transition-colors duration-150 ${i < blocks ? `border-transparent ${BLOCK_COLORS[i % BLOCK_COLORS.length]}` : "border-dashed border-k-outline/40"}`}
                      />
                    ))}
                  </div>
                  <p className="font-mono text-xs text-k-text">{t.boot.starting}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="font-heading text-xs text-k-outline">{t.boot.skip}</p>
    </motion.div>
  );
}
