import { useSettings } from "@/lib/settings";
import { Cloud, Heart, Moon, Sparkle, Star } from "./Illustrations";

const STARS = [
  { l: "14%", t: "10%", s: 22, d: "0s" },
  { l: "42%", t: "6%", s: 16, d: "1.2s" },
  { l: "78%", t: "12%", s: 26, d: "0.6s" },
  { l: "92%", t: "40%", s: 18, d: "2s" },
  { l: "30%", t: "88%", s: 20, d: "1.6s" },
  { l: "66%", t: "84%", s: 24, d: "0.3s" },
  { l: "52%", t: "52%", s: 14, d: "2.4s" },
];

// Ambient desktop background: wallpaper, clouds, stars and sparkles. Purely decorative.
// Night adds a static star field, a sleepy moon and the occasional shooting star (all CSS, cheap).
export default function Decor() {
  const { theme } = useSettings();
  const night = theme === "night";
  return (
    <div aria-hidden="true" className="wallpaper pointer-events-none absolute inset-0 overflow-hidden">
      {night && (
        <>
          <div className="night-stars absolute inset-0" />
          <div className="night-stars far absolute inset-0" />
          <Moon className="floaty absolute w-20 sm:w-24" style={{ left: "62%", top: "7%", animationDuration: "9s" }} />
          <div className="shooting-star absolute" style={{ left: "70%", top: "18%" }} />
          <div className="shooting-star absolute" style={{ left: "40%", top: "8%", animationDelay: "7s", animationDuration: "19s" }} />
        </>
      )}
      {[
        { t: "8%", w: 150, dur: "130s", delay: "-30s" },
        { t: "62%", w: 110, dur: "170s", delay: "-110s" },
        { t: "82%", w: 190, dur: "150s", delay: "-60s" },
      ].map((c, i) => (
        <div key={i} className="cloud-drift absolute left-0" style={{ top: c.t, width: c.w, animationDuration: c.dur, animationDelay: c.delay, opacity: night ? 0.22 : 0.8 }}>
          <Cloud className="w-full" />
        </div>
      ))}
      {STARS.map((s, i) => (
        <Star key={i} className="twinkle absolute" fill={i % 2 ? "#FFF0DA" : "#DCCBFA"} style={{ left: s.l, top: s.t, width: s.s, animationDelay: s.d }} />
      ))}
      <Sparkle className="floaty absolute" style={{ left: "58%", top: "30%", width: 22 }} fill="#C6EBDD" />
      <Sparkle className="floaty absolute" style={{ left: "24%", top: "70%", width: 18, animationDelay: "1.5s" }} fill="#FFD9C0" />
      <Heart className="floaty absolute" style={{ left: "88%", top: "72%", width: 28, animationDelay: "0.8s" }} />
    </div>
  );
}
