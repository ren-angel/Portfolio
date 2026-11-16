import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { setSoundsEnabled } from "./sounds";

// Keep these lists in sync with the inline script in index.html (it applies the theme before
// React loads, so there is no light flash on a night-mode reload).
export const THEMES = ["system", "light", "night"] as const;
export const WALLPAPERS = ["grid", "dots", "checker", "sky"] as const;
export type ThemePref = typeof THEMES[number];
export type Wallpaper = typeof WALLPAPERS[number];
export interface Settings { theme: ThemePref; wallpaper: Wallpaper; sounds: boolean }

export const STORAGE_KEY = "settings";
export const DEFAULT_SETTINGS: Settings = { theme: "system", wallpaper: "grid", sounds: false };

/** Tolerant parser: anything missing or invalid falls back to the default. */
export function parseSettings(raw: string | null): Settings {
  let data: Partial<Record<keyof Settings, unknown>> = {};
  try { data = raw ? JSON.parse(raw) ?? {} : {}; } catch { /* corrupted storage → defaults */ }
  const pick = <T,>(list: readonly T[], v: unknown, fallback: T) => (list.includes(v as T) ? (v as T) : fallback);
  return {
    theme: pick(THEMES, data.theme, DEFAULT_SETTINGS.theme),
    wallpaper: pick(WALLPAPERS, data.wallpaper, DEFAULT_SETTINGS.wallpaper),
    sounds: typeof data.sounds === "boolean" ? data.sounds : DEFAULT_SETTINGS.sounds,
  };
}

export const resolveTheme = (pref: ThemePref, systemDark: boolean): "light" | "night" =>
  pref === "system" ? (systemDark ? "night" : "light") : pref;

const THEME_COLOR = { light: "#F6B8D0", night: "#2A2444" };

const Ctx = createContext<{
  settings: Settings;
  theme: "light" | "night";
  update: (patch: Partial<Settings>) => void;
} | null>(null);

function load(): Settings {
  try { return parseSettings(localStorage.getItem(STORAGE_KEY)); } catch { return DEFAULT_SETTINGS; }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(load);
  const [systemDark, setSystemDark] = useState(() => matchMedia("(prefers-color-scheme: dark)").matches);
  const theme = resolveTheme(settings.theme, systemDark);

  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.wallpaper = settings.wallpaper;
    root.style.colorScheme = theme === "night" ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  }, [theme, settings.wallpaper]);

  useEffect(() => setSoundsEnabled(settings.sounds), [settings.sounds]);

  const update = (patch: Partial<Settings>) => {
    if (patch.theme || patch.wallpaper) {
      // Let colours glide for a moment instead of snapping (removed again so it never slows drags).
      const root = document.documentElement;
      root.classList.add("theme-fade");
      window.setTimeout(() => root.classList.remove("theme-fade"), 450);
    }
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* session only */ }
      return next;
    });
  };
  return <Ctx.Provider value={{ settings, theme, update }}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const value = useContext(Ctx);
  if (!value) throw new Error("SettingsProvider is missing");
  return value;
}
