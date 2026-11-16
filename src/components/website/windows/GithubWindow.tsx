import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Github, RotateCcw, Star } from "lucide-react";
import { profile } from "@/content/portfolio";
import { fetchRepos, GithubError, type Repo } from "@/lib/github";
import { useI18n } from "@/lib/i18n";

const LOCALE = { en: "en", pt: "pt-BR", ja: "ja" } as const;
const TONES = ["var(--k-pink-soft)", "var(--k-blue-soft)", "var(--k-mint-soft)", "var(--k-lav-soft)", "var(--k-peach-soft)", "var(--k-cream-soft)"];

export default function GithubWindow() {
  const { t, lang } = useI18n();
  const g = t.github;
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "rate">("loading");

  const load = useCallback(() => {
    setStatus("loading");
    fetchRepos(profile.githubUser)
      .then((r) => { setRepos(r); setStatus("ready"); })
      .catch((e) => setStatus(e instanceof GithubError && e.kind === "rate" ? "rate" : "error"));
  }, []);
  useEffect(load, [load]);

  const profileUrl = `https://github.com/${profile.githubUser}`;

  return (
    <div className="space-y-3 p-4 sm:p-5">
      <p className="flex items-center gap-2 text-sm"><Github className="h-4 w-4 shrink-0" />{g.intro}</p>

      {status === "loading" && (
        <div role="status" className="flex flex-col items-center gap-2 py-8">
          <div className="h-4 w-48 overflow-hidden rounded-full border-2 border-k-outline bg-k-surface p-0.5">
            <div className="bar-anim h-full w-1/3 rounded-full bg-k-blue" />
          </div>
          <p className="font-heading text-sm">{g.loading}</p>
        </div>
      )}
      {(status === "error" || status === "rate") && (
        <div role="alert" className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-k-outline p-4 text-center">
          <p className="font-heading">{status === "rate" ? g.rateLimited : g.error}</p>
          <button type="button" className="kbtn" onClick={load}><RotateCcw className="h-4 w-4" />{g.retry}</button>
        </div>
      )}
      {status === "ready" && repos.length === 0 && <p className="py-6 text-center font-heading">{g.empty}</p>}
      {status === "ready" && repos.length > 0 && (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          {repos.map((r, i) => (
            <li key={r.name}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col gap-1 rounded-2xl border-2 border-k-outline p-3 transition-transform hover:-translate-y-1 hover:rotate-[-0.5deg]"
                style={{ background: TONES[i % TONES.length] }}
              >
                <span className="flex items-center gap-1 font-heading text-base leading-tight">
                  <span className="truncate">{r.name}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </span>
                <span className="line-clamp-2 text-sm leading-5">{r.description ?? g.noDescription}</span>
                <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-0.5 pt-1 text-xs">
                  {r.language && <span className="rounded-full border border-k-outline bg-k-surface px-1.5">{r.language}</span>}
                  {r.stars > 0 && <span className="flex items-center gap-0.5"><Star className="h-3 w-3" aria-hidden="true" />{r.stars}</span>}
                  <span>{g.updated} {new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: "medium" }).format(Date.parse(r.pushedAt))}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="text-center">
        <a className="kbtn" href={profileUrl} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" />{g.viewAll}</a>
      </p>
    </div>
  );
}
