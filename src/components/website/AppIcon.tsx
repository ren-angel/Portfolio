import type { AppId } from "@/lib/windows";

// Sticker-style icons for the desktop apps, drawn in the same style as FolderIcon.
const W = { stroke: "#A98DAE", strokeWidth: 2.5, strokeLinejoin: "round", strokeLinecap: "round" } as const;

function art(kind: AppId, color: string) {
  switch (kind) {
    case "paint":
      return (
        <g {...W}>
          <path d="M32 8 C48 8 58 18 58 30 C58 40 50 42 44 40 C38 38 36 44 40 50 C42 55 38 58 31 58 C16 58 6 46 6 32 C6 18 17 8 32 8Z" fill={color} />
          <circle cx="20" cy="26" r="4.5" fill="#F6B8D0" />
          <circle cx="31" cy="18" r="4.5" fill="#B9DEFA" />
          <circle cx="44" cy="22" r="4.5" fill="#C6EBDD" />
          <circle cx="19" cy="41" r="4.5" fill="#DCCBFA" />
          <path d="M60 6 L40 32" strokeWidth="5" stroke="#A98DAE" />
          <path d="M60 6 L40 32" strokeWidth="2" stroke="#fff" />
        </g>
      );
    case "guestbook":
      return (
        <g {...W}>
          <path d="M32 16 C24 10 14 10 6 12 V52 C14 50 24 50 32 56 C40 50 50 50 58 52 V12 C50 10 40 10 32 16Z" fill="#fff" />
          <path d="M32 16 V56" fill="none" />
          <path d="M10 14 C16 13 24 13 30 17 V52 C24 49 16 48 10 49Z" fill={color} strokeWidth="0" opacity=".55" />
          <path d="M45 40 C38 35 38 29 42 29 C44 29 45 31 45 31 C45 31 46 29 48 29 C52 29 52 35 45 40Z" fill="#F6B8D0" strokeWidth="2" />
          <path d="M38 22 H52 M38 26 H48" fill="none" strokeWidth="2" />
        </g>
      );
    case "terminal":
      return (
        <g {...W}>
          <rect x="6" y="8" width="52" height="40" rx="8" fill={color} />
          <rect x="11" y="13" width="42" height="30" rx="4" fill="#4A3B52" />
          <path d="M17 22 L23 27 L17 32" fill="none" stroke="#C6EBDD" strokeWidth="2.5" />
          <path d="M27 33 H35" fill="none" stroke="#F6B8D0" strokeWidth="2.5" />
          <path d="M24 48 L22 56 H42 L40 48" fill="#fff" />
        </g>
      );
    case "github":
      return (
        <g {...W}>
          <path d="M10 8 H48 L56 16 V54 Q56 58 52 58 H12 Q8 58 8 54 V12 Q8 8 12 8Z" fill={color} />
          <rect x="18" y="8" width="26" height="16" rx="2" fill="#fff" />
          <rect x="34" y="11" width="6" height="10" rx="1" fill="#A98DAE" strokeWidth="0" />
          <rect x="16" y="32" width="32" height="20" rx="3" fill="#fff" />
          <path d="M32 46 C27 42 27 38 30 38 C31 38 32 39.5 32 39.5 C32 39.5 33 38 34 38 C37 38 37 42 32 46Z" fill="#F6B8D0" strokeWidth="1.5" />
        </g>
      );
    case "settings":
      return (
        <g {...W}>
          <rect x="8" y="8" width="48" height="48" rx="12" fill={color} />
          <path d="M20 18 V46 M32 18 V46 M44 18 V46" fill="none" stroke="#fff" strokeWidth="3.5" />
          <circle cx="20" cy="38" r="5" fill="#F6B8D0" />
          <circle cx="32" cy="24" r="5" fill="#FFF0DA" />
          <circle cx="44" cy="33" r="5" fill="#B9DEFA" />
        </g>
      );
  }
}

export default function AppIcon({ kind, color, className = "" }: { kind: AppId; color: string; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`sticker ${className}`} aria-hidden="true">
      {art(kind, color)}
    </svg>
  );
}
