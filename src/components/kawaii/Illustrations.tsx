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

export function LyingCat({ className = "" }) {
  return (
    <svg viewBox="0 0 320 170" className={`sticker ${className}`} role="img" aria-label="A cat lying down, wagging its tail">
      <g {...S}>
        <g className="tail-wag">
          <path d="M240 128 C282 124 300 92 276 66" fill="none" strokeWidth="18" />
          <path d="M240 128 C282 124 300 92 276 66" fill="none" stroke="#FFD9C0" strokeWidth="11" />
        </g>
        <ellipse cx="160" cy="124" rx="100" ry="34" fill="#FFF0DA" />
        <path d="M150 92 Q190 84 210 108 Q190 118 160 112 Z" fill="#FFD9C0" stroke="none" />
        <path d="M200 100 Q232 100 246 122 Q220 138 200 126 Z" fill="#E6DAF8" stroke="none" />
        <path d="M52 78 L46 46 L78 66 Z" fill="#F6B8D0" />
        <path d="M110 74 L118 44 L88 64 Z" fill="#DCCBFA" />
        <circle cx="82" cy="108" r="40" fill="#FFF0DA" />
        <path d="M60 100 Q60 76 86 72 Q84 96 62 112 Z" fill="#FFD9C0" stroke="none" />
        <path d="M66 108 Q72 114 78 108 M90 108 Q96 114 102 108" fill="none" strokeWidth="2.5" />
        <ellipse cx="62" cy="120" rx="7" ry="4" fill="#F6B8D0" stroke="none" opacity=".7" />
        <ellipse cx="106" cy="120" rx="7" ry="4" fill="#F6B8D0" stroke="none" opacity=".7" />
        <path d="M80 118 L88 118 L84 123 Z" fill="#F6B8D0" />
        <ellipse cx="70" cy="146" rx="18" ry="9" fill="#fff" />
        <ellipse cx="104" cy="146" rx="18" ry="9" fill="#fff" />
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
