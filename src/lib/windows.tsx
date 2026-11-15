import { createContext, useCallback, useContext, useReducer, type ReactNode } from "react";
import type { NavId } from "@/content/portfolio";

export const DEFAULT_SIZE = {
  home: { w: 680, h: 460 },
  about: { w: 700, h: 540 },
  skills: { w: 680, h: 520 },
  projects: { w: 720, h: 500 },
  contact: { w: 500, h: 500 },
  project: { w: 740, h: 560 },
};

type Target = { type: NavId } | { type: "project"; slug: string };
type WindowSpec = Target & { id: string; w: number; h: number };
export type DesktopWindow = WindowSpec & { x: number; y: number; z: number };

type Action =
  | { type: "open"; win: WindowSpec }
  | { type: "focus" | "close"; id: string }
  | { type: "move"; id: string; x: number; y: number }
  | { type: "resize"; id: string; w: number; h: number };

function renumber(list: DesktopWindow[]) {
  return [...list].sort((a, b) => a.z - b.z).map((win, i) => ({ ...win, z: i + 1 }));
}

function reducer(state: DesktopWindow[], action: Action): DesktopWindow[] {
  // renumber keeps the list sorted from back to front.
  const nextZ = state.length + 1;
  switch (action.type) {
    case "open": {
      const existing = state.find(w => w.id === action.win.id);
      if (existing) return reducer(state, { type: "focus", id: existing.id });
      const n = state.length % 6;
      return [...state, { x: 160 + n * 36, y: 36 + n * 32, ...action.win, z: nextZ }];
    }
    case "focus":
      if (state.at(-1)?.id === action.id) return state;
      return renumber(state.map(w => w.id === action.id ? { ...w, z: nextZ } : w));
    case "close":
      return renumber(state.filter(w => w.id !== action.id));
    case "move":
      return state.map(w => w.id === action.id ? { ...w, x: action.x, y: action.y } : w);
    case "resize":
      return state.map(w => w.id === action.id ? { ...w, w: action.w, h: action.h } : w);
  }
}

interface WindowManager {
  windows: DesktopWindow[];
  activeId: string | null;
  open: (...args: [NavId] | ["project", { slug: string }]) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
}

const Ctx = createContext<WindowManager | null>(null);

export function WindowsProvider({ children }: { children: ReactNode }) {
  const [windows, dispatch] = useReducer(reducer, [
    { id: "home", type: "home", x: 170, y: 48, ...DEFAULT_SIZE.home, z: 1 },
  ]);
  const open: WindowManager["open"] = (...[type, props]) => {
    const target = type === "project"
      ? { type, slug: props.slug, id: `project-${props.slug}` }
      : { type, id: type };
    dispatch({ type: "open", win: { ...target, ...DEFAULT_SIZE[type] } });
  };
  const close = useCallback((id: string) => dispatch({ type: "close", id }), []);
  const value: WindowManager = {
    windows, open, close, activeId: windows.at(-1)?.id ?? null,
    focus: id => dispatch({ type: "focus", id }),
    move: (id, x, y) => dispatch({ type: "move", id, x, y }),
    resize: (id, w, h) => dispatch({ type: "resize", id, w, h }),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWindows() {
  const value = useContext(Ctx);
  if (!value) throw new Error("WindowsProvider is missing");
  return value;
}
