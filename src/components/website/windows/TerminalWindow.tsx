import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { profile, projects, skillCategories, socials } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { complete, runCommand, type TerminalData } from "@/lib/terminal";
import { useWindows } from "@/lib/windows";

const PROMPT = "guest@kawaii:~$";
const BOOT = ["KawaiiOS 2000 · kawaii-sh", "type 'help' to see what I can do ✿", ""];
const startedAt = performance.now();

type Line = { kind: "in" | "out"; text: string };

export default function TerminalWindow() {
  const { t, lang } = useI18n();
  const { theme, update } = useSettings();
  const { open, close } = useWindows();
  const [lines, setLines] = useState<Line[]>(BOOT.map((text) => ({ kind: "out", text })));
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const field = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);

  // Scroll only the window body (scrollIntoView would also nudge the overflow-hidden desktop).
  useEffect(() => {
    const body = end.current?.closest(".k-scroll");
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines]);

  const data = (): TerminalData => ({
    name: profile.name,
    role: t.home.role,
    about: t.about.paragraphs,
    projects: projects.map((p) => ({ slug: p.slug, title: p.text[lang].title })),
    skills: skillCategories.map((c) => ({ group: t.skills.categories[c.id], names: c.skills.map((s) => s.name) })),
    socials: socials.map((s) => ({ label: s.label, url: s.url })),
    theme,
    lang,
    uptimeMinutes: Math.round((performance.now() - startedAt) / 60_000),
  });

  const submit = () => {
    const cmd = input;
    setInput("");
    cursor.current = -1;
    if (cmd.trim()) history.current.unshift(cmd);
    const { output, effect } = runCommand(cmd, data());
    if (effect?.type === "clear") return setLines([]);
    setLines((prev) => [...prev, { kind: "in", text: cmd }, ...output.map((text) => ({ kind: "out" as const, text }))]);
    if (effect?.type === "open") setTimeout(() => open(effect.target), 350);
    if (effect?.type === "theme") update({ theme: effect.theme });
    if (effect?.type === "exit") setTimeout(() => close("terminal"), 400);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); submit(); }
    else if (e.key === "Tab") { e.preventDefault(); setInput((v) => complete(v, data())); }
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(-1, Math.min(history.current.length - 1, cursor.current + (e.key === "ArrowUp" ? 1 : -1)));
      cursor.current = next;
      setInput(next === -1 ? "" : history.current[next]);
    } else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines([]); }
  };

  return (
    // The terminal keeps its retro dark screen in both themes.
    <div
      className="min-h-full cursor-text p-4 font-mono text-[15px] leading-6"
      style={{ background: "#2B2238", color: "#F4ECFF" }}
      onClick={() => field.current?.focus()}
    >
      <div role="log" aria-live="polite" aria-label={t.titles.terminal}>
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {l.kind === "in" ? <><span style={{ color: "#C6EBDD" }}>{PROMPT}</span> {l.text}</> : l.text || " "}
          </div>
        ))}
      </div>
      <div ref={end} className="flex items-center gap-2">
        <label htmlFor="term-input" style={{ color: "#C6EBDD" }} className="shrink-0">{PROMPT}</label>
        <input
          id="term-input"
          ref={field}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent caret-[#F6B8D0] outline-none"
          style={{ color: "#F4ECFF" }}
        />
      </div>
    </div>
  );
}
