import { iconAssets, type NavId } from "@/content/portfolio";

const W = { stroke: "#A98DAE", strokeWidth: 2.5, strokeLinejoin: "round", strokeLinecap: "round" } as const;

const EMBLEMS = {
  home: (
    <g {...W} fill="#fff">
      <path d="M42 28 L28 40 H33 V54 H51 V40 H56 Z" />
      <path d="M42 50 C36 46 36 42 39 42 C41 42 42 44 42 44 C42 44 43 42 45 42 C48 42 48 46 42 50Z" fill="#F6B8D0" strokeWidth="1.5" />
    </g>
  ),
  about: (
    <g {...W} fill="#fff">
      <circle cx="42" cy="42" r="13" />
      <circle cx="37" cy="40" r="1.6" fill="#4A3B52" stroke="none" />
      <circle cx="47" cy="40" r="1.6" fill="#4A3B52" stroke="none" />
      <path d="M37 46 Q42 51 47 46" fill="none" />
    </g>
  ),
  skills: (
    <g {...W} fill="#fff">
      <polygon points="42,27 46,37 57,38 49,45 51,56 42,50 33,56 35,45 27,38 38,37" />
    </g>
  ),
  projects: (
    <g {...W} fill="#fff">
      <rect x="28" y="30" width="12" height="10" rx="3" />
      <rect x="44" y="30" width="12" height="10" rx="3" />
      <rect x="28" y="44" width="12" height="10" rx="3" />
      <rect x="44" y="44" width="12" height="10" rx="3" fill="#F6B8D0" />
    </g>
  ),
  contact: (
    <g {...W} fill="#fff">
      <rect x="27" y="32" width="30" height="22" rx="4" />
      <path d="M28 35 L42 46 L56 35" fill="none" />
    </g>
  ),
};

// Replace by setting iconAssets[kind] to an image URL (PNG/WebP/SVG/animated SVG),
// or edit the SVG below. Keep the 84x70 viewBox so layout stays the same.
export default function FolderIcon({ kind, color, shade, className = "" }: { kind: NavId; color: string; shade: string; className?: string }) {
  const asset = iconAssets[kind];
  if (asset) return <img src={asset} alt="" className={className} draggable={false} />;
  return (
    <svg viewBox="0 0 84 70" className={`sticker ${className}`} aria-hidden="true">
      <path
        d="M8 18 Q8 10 16 10 H30 Q35 10 38 15 L40 19 H66 Q76 19 76 29 V54 Q76 62 68 62 H16 Q8 62 8 54Z"
        fill={shade}
        {...W}
      />
      <path d="M6 31 Q6 25 14 25 H70 Q78 25 78 33 L74 57 Q73 65 65 65 H16 Q8 65 7 57Z" fill={color} {...W} />
      <path d="M14 31 H58" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".75" />
      {EMBLEMS[kind]}
    </svg>
  );
}
