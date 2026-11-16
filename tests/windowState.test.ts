import { describe, expect, it } from "vitest";
import { activeIdOf, reducer, specFor, type DesktopWindow } from "@/lib/windowState";

const open = (state: DesktopWindow[], type: "home" | "about" | "skills" | "paint") =>
  reducer(state, { type: "open", win: specFor({ type }) });
const start = () => open(open(open([], "home"), "about"), "skills"); // skills on top

describe("window manager", () => {
  it("opens windows on top and focuses the newest", () => {
    const s = start();
    expect(s.map((w) => w.id)).toEqual(["home", "about", "skills"]);
    expect(s.map((w) => w.z)).toEqual([1, 2, 3]);
    expect(activeIdOf(s)).toBe("skills");
  });

  it("re-opening an existing window focuses it instead of duplicating", () => {
    const s = open(start(), "home");
    expect(s).toHaveLength(3);
    expect(activeIdOf(s)).toBe("home");
  });

  it("minimizing hands focus to the next visible window", () => {
    let s = reducer(start(), { type: "minimize", id: "skills" });
    expect(activeIdOf(s)).toBe("about");
    s = reducer(s, { type: "minimize", id: "about" });
    s = reducer(s, { type: "minimize", id: "home" });
    expect(activeIdOf(s)).toBeNull();
  });

  it("focusing a minimized window restores it on top (taskbar click)", () => {
    let s = reducer(start(), { type: "minimize", id: "home" });
    s = reducer(s, { type: "focus", id: "home" });
    const home = s.find((w) => w.id === "home")!;
    expect(home.minimized).toBe(false);
    expect(activeIdOf(s)).toBe("home");
    expect(home.z).toBe(3);
  });

  it("opening a minimized window restores it", () => {
    let s = reducer(start(), { type: "minimize", id: "about" });
    s = open(s, "about");
    expect(s.find((w) => w.id === "about")!.minimized).toBe(false);
    expect(activeIdOf(s)).toBe("about");
  });

  it("toggleMaximize flips state, focuses and un-minimizes", () => {
    let s = reducer(start(), { type: "minimize", id: "home" });
    s = reducer(s, { type: "toggleMaximize", id: "home" });
    let home = s.find((w) => w.id === "home")!;
    expect(home).toMatchObject({ maximized: true, minimized: false });
    expect(activeIdOf(s)).toBe("home");
    s = reducer(s, { type: "toggleMaximize", id: "home" });
    home = s.find((w) => w.id === "home")!;
    expect(home.maximized).toBe(false);
  });

  it("closing keeps z-order compact and focus sensible", () => {
    const s = reducer(start(), { type: "close", id: "skills" });
    expect(s.map((w) => w.z)).toEqual([1, 2]);
    expect(activeIdOf(s)).toBe("about");
  });

  it("unknown ids are ignored", () => {
    const s = start();
    expect(reducer(s, { type: "focus", id: "nope" })).toBe(s);
    expect(reducer(s, { type: "toggleMaximize", id: "nope" })).toBe(s);
  });

  it("move and resize only touch the target window", () => {
    let s = reducer(start(), { type: "move", id: "about", x: 300, y: 200 });
    s = reducer(s, { type: "resize", id: "about", w: 500, h: 400 });
    expect(s.find((w) => w.id === "about")).toMatchObject({ x: 300, y: 200, w: 500, h: 400 });
    expect(s.find((w) => w.id === "home")).toEqual(start().find((w) => w.id === "home"));
  });
});
