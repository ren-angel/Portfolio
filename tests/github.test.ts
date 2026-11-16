import { describe, expect, it } from "vitest";
import { pickRepos } from "@/lib/github";

const repo = (name: string, pushed: string, extra: object = {}) => ({
  name, description: null, html_url: `https://github.com/x/${name}`, language: "TypeScript",
  stargazers_count: 1, pushed_at: pushed, fork: false, archived: false, ...extra,
});

describe("github repos", () => {
  it("drops forks and archived repos and sorts by latest push", () => {
    const out = pickRepos([
      repo("old", "2024-01-01T00:00:00Z"),
      repo("fork", "2026-01-01T00:00:00Z", { fork: true }),
      repo("archived", "2026-01-01T00:00:00Z", { archived: true }),
      repo("new", "2026-06-01T00:00:00Z"),
    ]);
    expect(out.map((r) => r.name)).toEqual(["new", "old"]);
  });
  it("handles junk responses", () => {
    expect(pickRepos({ message: "API rate limit exceeded" })).toEqual([]);
    expect(pickRepos(null)).toEqual([]);
  });
});
