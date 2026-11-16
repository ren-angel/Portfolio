import { describe, expect, it } from "vitest";
import { getProject, projects } from "@/content/portfolio";
import { LANGS } from "@/content/translations";
import { hashFor, parseHash } from "@/lib/route";

const hasProject = (slug: string) => !!getProject(slug);

describe("projects", () => {
  it("has unique, URL-friendly slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("has every text field in every language, with matching feature lists", () => {
    for (const p of projects) {
      const counts = new Set<number>();
      for (const { id } of LANGS) {
        const tx = p.text[id];
        for (const key of ["title", "short", "summary", "problem", "solution"] as const) {
          expect(tx[key].trim(), `${p.slug}.${id}.${key}`).not.toBe("");
        }
        expect(tx.features.length, `${p.slug}.${id}.features`).toBeGreaterThan(0);
        counts.add(tx.features.length);
      }
      expect(counts.size, `${p.slug}: feature count differs between languages`).toBe(1);
    }
  });

  it("never uses placeholder links", () => {
    for (const p of projects) {
      if (p.github) expect(p.github).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+$/);
      if (p.live) expect(p.live).toMatch(/^https:\/\//);
    }
  });

  it("opens every project from its deep link", () => {
    for (const p of projects) {
      const hash = hashFor({ type: "project", slug: p.slug });
      expect(parseHash(hash, hasProject)).toEqual({ targets: [{ type: "projects" }, { type: "project", slug: p.slug }] });
    }
  });

  it("falls back to the Projects folder for an unknown slug", () => {
    expect(parseHash("#projects/paw-tracker-api", hasProject)).toEqual({ targets: [{ type: "projects" }], fixedHash: "#projects" });
  });
});
