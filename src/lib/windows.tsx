import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { activeIdOf, reducer, specFor, type DesktopWindow, type Target } from "./windowState";

export { DEFAULT_SIZE, type AppId, type DesktopWindow, type Target, type WindowKind } from "./windowState";

interface WindowManager {
  windows: DesktopWindow[];
  activeId: string | null;
  open: (target: Target) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
}

const Ctx = createContext<WindowManager | null>(null);

export function WindowsProvider({ children }: { children: ReactNode }) {
  const [windows, dispatch] = useReducer(reducer, [
    { ...specFor({ type: "home" }), x: 170, y: 48, z: 1, minimized: false, maximized: false },
  ]);
  // dispatch is stable, so these callbacks never change identity.
  const actions = useMemo(() => ({
    open: (target: Target) => dispatch({ type: "open", win: specFor(target) }),
    close: (id: string) => dispatch({ type: "close", id }),
    focus: (id: string) => dispatch({ type: "focus", id }),
    minimize: (id: string) => dispatch({ type: "minimize", id }),
    toggleMaximize: (id: string) => dispatch({ type: "toggleMaximize", id }),
    move: (id: string, x: number, y: number) => dispatch({ type: "move", id, x, y }),
    resize: (id: string, w: number, h: number) => dispatch({ type: "resize", id, w, h }),
  }), []);
  const value: WindowManager = { windows, activeId: activeIdOf(windows), ...actions };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWindows() {
  const value = useContext(Ctx);
  if (!value) throw new Error("WindowsProvider is missing");
  return value;
}
