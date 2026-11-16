import { describe, expect, it } from "vitest";
import { complete, runCommand, type TerminalData } from "@/lib/terminal";
import { toCanvasPoint } from "@/lib/paint";

const data: TerminalData = {
  name: "Ren", role: "Back-end developer", about: ["hello"], theme: "light", lang: "en", uptimeMinutes: 3,
  projects: [{ slug: "portfolio-desktop", title: "This very desktop" }],
  skills: [{ group: "Main", names: ["TypeScript"] }],
  socials: [{ label: "GitHub", url: "https://github.com/x" }],
};

describe("terminal", () => {
  it("knows the basic commands", () => {
    expect(runCommand("help", data).output[0]).toMatch(/available commands/);
    expect(runCommand("cat about.txt", data).output).toEqual(["hello"]);
    expect(runCommand("ls projects", data).output[0]).toMatch(/portfolio-desktop/);
    expect(runCommand("   ", data).output).toEqual([]);
  });
  it("produces effects instead of touching the app directly", () => {
    expect(runCommand("clear", data).effect).toEqual({ type: "clear" });
    expect(runCommand("open paint", data).effect).toEqual({ type: "open", target: { type: "paint" } });
    expect(runCommand("open portfolio-desktop", data).effect).toEqual({ type: "open", target: { type: "project", slug: "portfolio-desktop" } });
    expect(runCommand("theme night", data).effect).toEqual({ type: "theme", theme: "night" });
    expect(runCommand("sudo hire-me", data).effect).toEqual({ type: "open", target: { type: "contact" } });
  });
  it("never executes anything unknown", () => {
    expect(runCommand("rm -rf /", data).effect).toBeUndefined();
    expect(runCommand("<script>", data).output[0]).toMatch(/command not found/);
    expect(runCommand("open ../../etc", data).effect).toBeUndefined();
  });
  it("tab-completes commands and arguments", () => {
    expect(complete("neo", data)).toBe("neofetch ");
    expect(complete("cat ab", data)).toBe("cat about.txt");
    expect(complete("open port", data)).toBe("open portfolio-desktop");
    expect(complete("e", data)).toBe("e"); // ambiguous: echo / exit
  });
});

describe("paint", () => {
  it("maps CSS pixels to canvas pixels", () => {
    expect(toCanvasPoint(110, 70, { left: 10, top: 20, width: 720, height: 480 }, 360, 240)).toEqual({ x: 50, y: 25 });
  });
});
