// Pure window-manager state. No React here, so it's easy to test (see windowState.test.ts).
import type { NavId } from "@/content/portfolio";

export type AppId = "paint" | "guestbook" | "terminal" | "github" | "settings" | "inbox";
export type WindowKind = NavId | AppId;
export type Target = { type: WindowKind } | { type: "project"; slug: string };
export type WindowSpec = Target & { id: string; w: number; h: number };
export type DesktopWindow = WindowSpec & { x: number; y: number; z: number; minimized: boolean; maximized: boolean };

export const DEFAULT_SIZE: Record<WindowKind | "project", { w: number; h: number }> = {
  home: { w: 680, h: 460 },
  about: { w: 700, h: 540 },
  skills: { w: 680, h: 520 },
  projects: { w: 720, h: 500 },
  contact: { w: 500, h: 500 },
  project: { w: 740, h: 560 },
  paint: { w: 600, h: 650 },
  guestbook: { w: 640, h: 640 },
  terminal: { w: 600, h: 400 },
  github: { w: 520, h: 480 },
  settings: { w: 480, h: 640 },
  inbox: { w: 700, h: 640 },
};

export const windowId = (t: Target) => (t.type === "project" ? `project-${t.slug}` : t.type);

export function specFor(t: Target): WindowSpec {
  return { ...t, id: windowId(t), ...DEFAULT_SIZE[t.type] };
}

export type Action =
  | { type: "open"; win: WindowSpec }
  | { type: "focus" | "close" | "minimize" | "toggleMaximize"; id: string }
  | { type: "move"; id: string; x: number; y: number }
  | { type: "resize"; id: string; w: number; h: number };

// The list is always kept sorted back-to-front, with z = 1..n.
function renumber(list: DesktopWindow[]) {
  return [...list].sort((a, b) => a.z - b.z).map((win, i) => ({ ...win, z: i + 1 }));
}

type Geometry = Partial<Pick<DesktopWindow, "x" | "y" | "w" | "h" | "z" | "minimized" | "maximized">>;
const patch = (state: DesktopWindow[], id: string, p: Geometry): DesktopWindow[] =>
  state.map((w) => (w.id === id ? { ...w, ...p } : w));

export function reducer(state: DesktopWindow[], action: Action): DesktopWindow[] {
  const nextZ = state.length + 1;
  switch (action.type) {
    case "open": {
      const existing = state.find((w) => w.id === action.win.id);
      if (existing) return reducer(state, { type: "focus", id: existing.id });
      const n = state.length % 6;
      return [...state, { x: 160 + n * 36, y: 36 + n * 32, ...action.win, z: nextZ, minimized: false, maximized: false }];
    }
    case "focus": {
      const win = state.find((w) => w.id === action.id);
      if (!win) return state;
      if (state.at(-1)?.id === action.id && !win.minimized) return state;
      return renumber(patch(state, action.id, { z: nextZ, minimized: false }));
    }
    case "minimize":
      return patch(state, action.id, { minimized: true });
    case "toggleMaximize": {
      const win = state.find((w) => w.id === action.id);
      if (!win) return state;
      return renumber(patch(state, action.id, { maximized: !win.maximized, minimized: false, z: nextZ }));
    }
    case "close":
      return renumber(state.filter((w) => w.id !== action.id));
    case "move":
      return patch(state, action.id, { x: action.x, y: action.y });
    case "resize":
      return patch(state, action.id, { w: action.w, h: action.h });
  }
}

/** The focused window is the top-most one that isn't minimized. */
export function activeIdOf(state: DesktopWindow[]): string | null {
  for (let i = state.length - 1; i >= 0; i--) if (!state[i].minimized) return state[i].id;
  return null;
}
