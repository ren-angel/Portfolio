import { describe, expect, it } from "vitest";
import { hashFor, parseHash } from "@/lib/route";

const has = (slug: string) => slug === "portfolio-desktop";

describe("deep links", () => {
  it("empty hash opens nothing extra", () => {
    expect(parseHash("", has)).toEqual({ targets: [] });
    expect(parseHash("#", has)).toEqual({ targets: [] });
  });
  it("opens a top-level window or app", () => {
    expect(parseHash("#about", has).targets).toEqual([{ type: "about" }]);
    expect(parseHash("#paint", has).targets).toEqual([{ type: "paint" }]);
    expect(parseHash("#/guestbook", has).targets).toEqual([{ type: "guestbook" }]);
    expect(parseHash("#inbox", has).targets).toEqual([{ type: "inbox" }]); // hidden owner window
  });
  it("opens the projects folder and then the project", () => {
    expect(parseHash("#projects/portfolio-desktop", has)).toEqual({
      targets: [{ type: "projects" }, { type: "project", slug: "portfolio-desktop" }],
    });
  });
  it("falls back gracefully for unknown projects and pages", () => {
    expect(parseHash("#projects/nope", has)).toEqual({ targets: [{ type: "projects" }], fixedHash: "#projects" });
    expect(parseHash("#definitely-not-a-window", has)).toEqual({ targets: [], fixedHash: "" });
  });
  it("builds hashes that parse back to the same window", () => {
    expect(hashFor({ type: "home" })).toBe("");
    expect(hashFor(null)).toBe("");
    expect(hashFor({ type: "skills" })).toBe("#skills");
    const h = hashFor({ type: "project", slug: "portfolio-desktop" });
    expect(h).toBe("#projects/portfolio-desktop");
    expect(parseHash(h, has).targets.at(-1)).toEqual({ type: "project", slug: "portfolio-desktop" });
  });
});
