// The fake terminal's command interpreter. Pure function: no real shell, no eval - just a lookup
// table of predefined commands, so it's safe and easy to test.
import type { Target } from "./windowState";

export interface TerminalData {
  name: string;
  role: string;
  about: string[];
  projects: { slug: string; title: string }[];
  skills: { group: string; names: string[] }[];
  socials: { label: string; url: string }[];
  theme: "light" | "night";
  lang: string;
  uptimeMinutes: number;
}

export type Effect =
  | { type: "clear" }
  | { type: "exit" }
  | { type: "open"; target: Target }
  | { type: "theme"; theme: "light" | "night" };

export interface Result { output: string[]; effect?: Effect }

const OPENABLE: Record<string, Target> = {
  home: { type: "home" }, about: { type: "about" }, skills: { type: "skills" }, projects: { type: "projects" },
  contact: { type: "contact" }, paint: { type: "paint" }, guestbook: { type: "guestbook" },
  repos: { type: "github" }, github: { type: "github" }, settings: { type: "settings" },
};

export const COMMANDS = ["help", "whoami", "ls", "cat", "open", "theme", "neofetch", "date", "echo", "clear", "exit", "sudo"];

const HELP = [
  "available commands:",
  "  help              this list",
  "  whoami            who are you?",
  "  ls [projects]     list files (or projects)",
  "  cat <file>        read a file, e.g. cat about.txt",
  "  open <app>        open a window: about, projects, paint, guestbook…",
  "  open <project>    open a project, e.g. open portfolio-desktop",
  "  theme <light|night>",
  "  neofetch          system info ✿",
  "  date · echo · clear · exit",
];

const FILES = ["about.txt", "skills.txt", "socials.txt", "projects/", "paint.exe", "guestbook.html", "secret.txt"];

export function runCommand(input: string, data: TerminalData): Result {
  const line = input.trim();
  if (!line) return { output: [] };
  const [cmd, ...args] = line.split(/\s+/);
  const arg = args.join(" ");

  switch (cmd.toLowerCase()) {
    case "help":
    case "?":
      return { output: HELP };
    case "whoami":
      return { output: ["guest  (but you can call me friend ♡)", `looking for the owner? → ${data.name}, ${data.role}`, "try: cat about.txt"] };
    case "ls":
      if (arg === "projects" || arg === "projects/") return { output: data.projects.map((p) => `${p.slug.padEnd(22)} ${p.title}`) };
      if (arg && arg !== "." && arg !== "~") return { output: [`ls: cannot access '${arg}': No such file or directory`] };
      return { output: [FILES.join("  ")] };
    case "cat":
      switch (arg) {
        case "about.txt": return { output: data.about };
        case "skills.txt": return { output: data.skills.map((s) => `${s.group}: ${s.names.join(", ")}`) };
        case "socials.txt": return { output: data.socials.map((s) => `${s.label.padEnd(10)} ${s.url}`) };
        case "secret.txt": return { output: ["↑ ↑ ↓ ↓ ← → ← → B A"] };
        case "": return { output: ["cat: missing file operand (try: cat about.txt)"] };
        default: return { output: [`cat: ${arg}: No such file or directory`] };
      }
    case "open": {
      const key = arg.toLowerCase().replace(/\.(exe|html|txt|mail)$/, "");
      const target = OPENABLE[key] ?? (data.projects.some((p) => p.slug === key) ? { type: "project" as const, slug: key } : null);
      if (!target) return { output: [arg ? `open: '${arg}' not found (try: ls)` : "open: what should I open? (try: open paint)"] };
      return { output: [`opening ${key}… ✿`], effect: { type: "open", target } };
    }
    case "theme":
      if (arg === "light" || arg === "night") return { output: [`theme → ${arg} ${arg === "night" ? "☾" : "☀"}`], effect: { type: "theme", theme: arg } };
      return { output: [`current theme: ${data.theme}. usage: theme <light|night>`] };
    case "neofetch":
      return {
        output: [
          "   /\\_/\\      guest@portfolio-desktop",
          "  ( o.o )     ---------------------",
          "   > ^ <      OS: KawaiiOS 2000",
          "  /  ♡  \\     Host: GitHub Pages",
          " (__|_|__)    Kernel: React + TypeScript",
          `              Uptime: ${data.uptimeMinutes} min`,
          "              Shell: kawaii-sh (pretend)",
          `              Theme: ${data.theme === "night" ? "Night ☾" : "Light ☀"}`,
          `              Locale: ${data.lang}`,
          "              Backend: Cloudflare Workers + D1",
        ],
      };
    case "date":
      return { output: [new Date().toString()] };
    case "echo":
      return { output: [arg] };
    case "clear":
    case "cls":
      return { output: [], effect: { type: "clear" } };
    case "exit":
      return { output: ["bye bye ♡"], effect: { type: "exit" } };
    case "sudo":
      if (arg === "hire-me" || arg === "hire me") {
        return {
          output: [
            "[sudo] password for guest: ********",
            "✔ permission granted. excellent taste!",
            "✔ tea brewed · ✔ tests passing · ✔ cat fed",
            "→ opening love_letter.mail so you can say hi ♡",
          ],
          effect: { type: "open", target: { type: "contact" } },
        };
      }
      return { output: ["guest is not in the sudoers file. 🐾"] };
    case "rm":
      return { output: ["rm: nice try heh"] };
    default:
      return { output: [`${cmd}: command not found (type 'help')`] };
  }
}

/** Tab completion: completes the command name, or a file/app name after cat/open/ls. */
export function complete(input: string, data: Pick<TerminalData, "projects">): string {
  const parts = input.split(" ");
  const pool = parts.length === 1
    ? COMMANDS
    : parts[0] === "cat" ? FILES.filter((f) => f.endsWith(".txt"))
    : parts[0] === "open" ? [...Object.keys(OPENABLE), ...data.projects.map((p) => p.slug)]
    : parts[0] === "ls" ? ["projects"]
    : [];
  const last = parts.at(-1) ?? "";
  const hits = pool.filter((p) => p.startsWith(last));
  if (hits.length !== 1) return input;
  parts[parts.length - 1] = hits[0];
  return parts.join(" ") + (parts.length === 1 ? " " : "");
}
