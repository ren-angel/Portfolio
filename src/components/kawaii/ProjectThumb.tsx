import { Server, Layers, Palette, Cloud } from "lucide-react";
import { tones, type Project, type Tone } from "@/content/portfolio";
import { Sparkle, Star } from "./Illustrations";

const ICONS = { server: Server, layers: Layers, palette: Palette, cloud: Cloud };

// Project icon / hero. Provide project.thumb (image URL) to replace the illustration.
export default function ProjectThumb({ project, className = "" }: { project: Project; className?: string }) {
  if (project.thumb) return <img src={project.thumb} alt="" loading="lazy" className={`object-cover ${className}`} />;
  const tone = tones[project.tone];
  const Icon = ICONS[project.icon] ?? Layers;
  return (
    <div
      aria-hidden="true"
      className={`relative grid place-items-center overflow-hidden rounded-[22px] border-2 border-k-outline ${className}`}
      style={{ background: `linear-gradient(145deg, ${tone.soft}, ${tone.bg})` }}
    >
      <Sparkle className="twinkle absolute left-2 top-2 w-4" />
      <Star className="twinkle absolute bottom-2 right-2 w-5" fill="#fff" style={{ animationDelay: "1s" }} />
      <span className="grid h-1/2 w-1/2 min-h-8 min-w-8 place-items-center rounded-2xl border-2 border-k-outline bg-white">
        <Icon className="h-3/5 w-3/5 text-k-text" strokeWidth={2} />
      </span>
    </div>
  );
}

// Named palette entries draw the sample filmstrip. Other entries are image URLs.
export function Shot({ src, alt }: { src: string; alt: string }) {
  if (!Object.hasOwn(tones, src)) return <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />;
  const tone = tones[src as Tone];
  return (
    <svg viewBox="0 0 200 130" role="img" aria-label={alt} className="h-full w-full">
      <rect width="200" height="130" fill={tone.soft} />
      <rect width="200" height="16" fill={tone.bg} />
      <circle cx="10" cy="8" r="3" fill="#fff" />
      <circle cx="20" cy="8" r="3" fill="#fff" />
      <rect x="14" y="26" width="70" height="8" rx="4" fill={tone.bg} />
      <rect x="14" y="42" width="120" height="6" rx="3" fill="#fff" />
      <rect x="14" y="54" width="100" height="6" rx="3" fill="#fff" />
      <rect x="14" y="72" width="52" height="42" rx="8" fill="#fff" stroke={tone.bg} strokeWidth="3" />
      <rect x="74" y="72" width="52" height="42" rx="8" fill="#fff" stroke={tone.bg} strokeWidth="3" />
      <rect x="134" y="72" width="52" height="42" rx="8" fill={tone.bg} />
    </svg>
  );
}
