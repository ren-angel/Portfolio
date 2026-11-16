// Latest public repos via GitHub's public REST API (no token, free). Unauthenticated requests are
// limited to 60/hour per visitor IP, so results are cached in sessionStorage for 30 minutes.
export interface Repo { name: string; description: string | null; url: string; language: string | null; stars: number; pushedAt: string }

interface ApiRepo {
  name: string; description: string | null; html_url: string; language: string | null;
  stargazers_count: number; pushed_at: string; fork: boolean; archived: boolean;
}

export class GithubError extends Error {
  constructor(public kind: "rate" | "error") { super(kind); }
}

/** Keeps own (non-fork, non-archived) repos, newest push first. */
export function pickRepos(data: unknown, max = 6): Repo[] {
  if (!Array.isArray(data)) return [];
  return (data as ApiRepo[])
    .filter((r) => r && typeof r.name === "string" && !r.fork && !r.archived)
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, max)
    .map((r) => ({
      name: r.name, description: r.description, url: r.html_url, language: r.language,
      stars: r.stargazers_count ?? 0, pushedAt: r.pushed_at,
    }));
}

const TTL = 30 * 60_000;

export async function fetchRepos(user: string): Promise<Repo[]> {
  const key = `github-repos:${user}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) ?? "null") as { at: number; repos: Repo[] } | null;
    if (cached && Date.now() - cached.at < TTL) return cached.repos;
  } catch { /* ignore broken cache */ }

  let res: Response;
  try {
    res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=30&type=owner`, {
      headers: { Accept: "application/vnd.github+json" },
    });
  } catch {
    throw new GithubError("error");
  }
  if ((res.status === 403 || res.status === 429) && res.headers.get("x-ratelimit-remaining") === "0") throw new GithubError("rate");
  if (!res.ok) throw new GithubError("error");
  const repos = pickRepos(await res.json());
  try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), repos })); } catch { /* fine */ }
  return repos;
}
