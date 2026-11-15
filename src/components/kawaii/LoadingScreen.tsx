import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LyingCat } from "./Illustrations";
import { Sparkle, Star } from "./Illustrations";
import { useI18n } from "@/lib/i18n";

// Shown only while the app is genuinely loading (fonts + hydration). No artificial delay.
export default function LoadingScreen() {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % t.loading.length), 900);
    return () => clearInterval(id);
  }, [t.loading.length]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-k-bg grid-bg"
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative">
        <Star className="twinkle absolute -left-6 -top-4 w-7" fill="#DCCBFA" />
        <Sparkle className="floaty absolute -right-4 -top-8 w-6" fill="#C6EBDD" />
        <LyingCat className="w-64 sm:w-80" />
        {[0, 0.8, 1.6].map((d) => (
          <span key={d} className="bubble absolute -top-3 left-12 h-3 w-3 rounded-full border-2 border-k-outline bg-white" style={{ animationDelay: `${d}s`, left: `${40 + d * 20}px` }} />
        ))}
      </div>
      <div className="h-5 w-64 overflow-hidden rounded-full border-2 border-k-outline bg-white p-0.5 sm:w-80">
        <div className="bar-anim h-full w-1/3 rounded-full bg-k-pink" />
      </div>
      <p className="font-heading text-lg text-k-text">{t.loading[i]}</p>
    </motion.div>
  );
}
