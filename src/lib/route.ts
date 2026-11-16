// Hash-based deep links (#about, #projects/<slug>, #paint…). Hash routing works on GitHub Pages
// without any server config, and plain "/" stays exactly as before.
import { navItems } from "@/content/portfolio";
import type { AppId, Target, WindowKind } from "./windowState";

// "inbox" has no icon on purpose: open it with #inbox (it asks for your password).
export const APP_IDS: AppId[] = ["paint", "guestbook", "terminal", "github", "settings", "inbox"];
const KINDS = new Set<string>([...navItems.map((n) => n.id), ...APP_IDS]);

export interface ParsedRoute {
  /** Windows to open, in order (the last one ends up focused). */
  targets: Target[];
  /** Canonical hash if the given one was invalid or partly invalid, e.g. an unknown project. */
  fixedHash?: string;
}

export function parseHash(hash: string, hasProject: (slug: string) => boolean): ParsedRoute {
  const raw = decodeURIComponent(hash.replace(/^#\/?/, "")).trim();
  if (!raw) return { targets: [] };
  const [head, slug] = raw.split("/");
  if (head === "projects" && slug) {
    return hasProject(slug)
      ? { targets: [{ type: "projects" }, { type: "project", slug }] }
      : { targets: [{ type: "projects" }], fixedHash: "#projects" };
  }
  if (KINDS.has(head)) return { targets: [{ type: head as WindowKind }] };
  return { targets: [], fixedHash: "" };
}

export function hashFor(win: Target | null | undefined): string {
  if (!win || win.type === "home") return "";
  if (win.type === "project") return `#projects/${encodeURIComponent(win.slug)}`;
  return `#${win.type}`;
}
