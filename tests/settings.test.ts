import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, parseSettings, resolveTheme } from "@/lib/settings";

describe("settings", () => {
  it("defaults when storage is empty or corrupted", () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("{not json")).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("null")).toEqual(DEFAULT_SETTINGS);
  });
  it("keeps valid values and drops invalid ones", () => {
    expect(parseSettings(JSON.stringify({ theme: "night", wallpaper: "dots", sounds: true }))).toEqual({ theme: "night", wallpaper: "dots", sounds: true });
    expect(parseSettings(JSON.stringify({ theme: "purple", wallpaper: 3, sounds: "yes" }))).toEqual(DEFAULT_SETTINGS);
  });
  it("system theme follows the device", () => {
    expect(resolveTheme("system", true)).toBe("night");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("night", false)).toBe("night");
  });
});
