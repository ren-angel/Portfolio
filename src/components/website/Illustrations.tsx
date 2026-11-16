import type { CSSProperties } from "react";

type ArtProps = { className?: string; fill?: string; style?: CSSProperties };

// Hand-drawn style SVG placeholders. Swap any of these for your own SVG/PNG/WebP art.
const S = { stroke: "#A98DAE", strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" } as const;

export function Cat({ className = "" }) {
  return (
    <svg viewBox="0 0 200 200" className={`sticker ${className}`} role="img" aria-label="Illustrated cat placeholder">
      <g {...S}>
        <path d="M148 158 C192 160 196 104 170 96" fill="none" strokeWidth="14" />
        <path className="tail-wag" d="M148 158 C192 160 196 104 170 96" fill="none" stroke="#FFD9C0" strokeWidth="8" />
        <ellipse cx="100" cy="150" rx="52" ry="38" fill="#FFF0DA" />
        <path d="M54 74 L48 28 L90 54 Z" fill="#F6B8D0" />
        <path d="M146 74 L152 28 L110 54 Z" fill="#DCCBFA" />
        <ellipse cx="100" cy="92" rx="60" ry="50" fill="#FFF0DA" />
        <path d="M48 84 Q58 54 90 60 Q84 92 52 104 Z" fill="#FFD9C0" stroke="none" />
        <path d="M152 72 Q132 62 118 72 Q124 96 152 100 Z" fill="#E6DAF8" stroke="none" />
        <ellipse cx="78" cy="94" rx="6" ry="8" fill="#4A3B52" stroke="none" />
        <ellipse cx="122" cy="94" rx="6" ry="8" fill="#4A3B52" stroke="none" />
        <circle cx="80" cy="91" r="2" fill="#fff" stroke="none" />
        <circle cx="124" cy="91" r="2" fill="#fff" stroke="none" />
        <ellipse cx="62" cy="108" rx="9" ry="5" fill="#F6B8D0" stroke="none" opacity=".7" />
        <ellipse cx="138" cy="108" rx="9" ry="5" fill="#F6B8D0" stroke="none" opacity=".7" />
        <path d="M95 106 L105 106 L100 112 Z" fill="#F6B8D0" />
        <path d="M100 112 Q96 120 89 116 M100 112 Q104 120 111 116" fill="none" strokeWidth="2.5" />
        <path d="M40 98 L58 102 M40 110 L58 108 M160 98 L142 102 M160 110 L142 108" fill="none" strokeWidth="2" />
        <ellipse cx="80" cy="182" rx="14" ry="9" fill="#fff" />
        <ellipse cx="120" cy="182" rx="14" ry="9" fill="#fff" />
      </g>
    </svg>
  );
}

// Just the head of <Cat />: used as the KawaiiOS boot logo.
export function CatFace({ className = "" }) {
  return (
    <svg viewBox="34 22 132 124" className={`sticker ${className}`} role="img" aria-label="KawaiiOS cat logo">
      <g {...S}>
        <path d="M54 74 L48 28 L90 54 Z" fill="#F6B8D0" />
        <path d="M146 74 L152 28 L110 54 Z" fill="#DCCBFA" />
        <ellipse cx="100" cy="92" rx="60" ry="50" fill="#FFF0DA" />
        <path d="M48 84 Q58 54 90 60 Q84 92 52 104 Z" fill="#FFD9C0" stroke="none" />
        <path d="M152 72 Q132 62 118 72 Q124 96 152 100 Z" fill="#E6DAF8" stroke="none" />
        <ellipse cx="78" cy="94" rx="6" ry="8" fill="#4A3B52" stroke="none" />
        <ellipse cx="122" cy="94" rx="6" ry="8" fill="#4A3B52" stroke="none" />
        <circle cx="80" cy="91" r="2" fill="#fff" stroke="none" />
        <circle cx="124" cy="91" r="2" fill="#fff" stroke="none" />
        <ellipse cx="62" cy="108" rx="9" ry="5" fill="#F6B8D0" stroke="none" opacity=".7" />
        <ellipse cx="138" cy="108" rx="9" ry="5" fill="#F6B8D0" stroke="none" opacity=".7" />
        <path d="M95 106 L105 106 L100 112 Z" fill="#F6B8D0" />
        <path d="M100 112 Q96 120 89 116 M100 112 Q104 120 111 116" fill="none" strokeWidth="2.5" />
        <path d="M40 98 L58 102 M40 110 L58 108 M160 98 L142 102 M160 110 L142 108" fill="none" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function Star({ className = "", fill = "#FFF0DA", style }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <polygon points="50,8 61,37 92,38 68,57 77,88 50,70 23,88 32,57 8,38 39,37" fill={fill} {...S} />
    </svg>
  );
}

export function Sparkle({ className = "", fill = "#fff", style }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <path d="M50 6 Q55 45 94 50 Q55 55 50 94 Q45 55 6 50 Q45 45 50 6Z" fill={fill} {...S} strokeWidth="4" />
    </svg>
  );
}

export function Heart({ className = "", fill = "#F6B8D0", style }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden="true">
      <path d="M50 88 C10 58 8 28 30 20 C42 16 50 26 50 32 C50 26 58 16 70 20 C92 28 90 58 50 88Z" fill={fill} {...S} />
    </svg>
  );
}

export function Cloud({ className = "", fill = "#fff", style }: ArtProps) {
  return (
    <svg viewBox="0 0 100 70" className={className} style={style} aria-hidden="true">
      <path d="M22 62 Q4 62 7 46 Q9 32 26 34 Q30 14 52 16 Q70 16 74 34 Q94 32 93 50 Q92 62 76 62Z" fill={fill} {...S} />
    </svg>
  );
}

export function Bow({ className = "", fill = "#F6B8D0", style }: ArtProps) {
  return (
    <svg viewBox="0 0 100 70" className={className} style={style} aria-hidden="true">
      <path d="M50 35 L10 12 Q4 35 10 58 Z" fill={fill} {...S} />
      <path d="M50 35 L90 12 Q96 35 90 58 Z" fill={fill} {...S} />
      <circle cx="50" cy="35" r="9" fill="#fff" {...S} />
    </svg>
  );
}

export function Moon({ className = "", fill = "#FFF0DA", style }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className={`sticker ${className}`} style={style} aria-hidden="true">
      <path d="M62 10 C34 14 18 40 26 66 C34 90 64 98 86 82 C60 84 42 66 44 44 C46 28 52 18 62 10Z" fill={fill} {...S} />
      <ellipse cx="50" cy="66" rx="4" ry="2.6" fill="#F6B8D0" opacity=".8" />
      <path d="M38 52 Q41 56 44 52" fill="none" {...S} strokeWidth="3" />
    </svg>
  );
}
