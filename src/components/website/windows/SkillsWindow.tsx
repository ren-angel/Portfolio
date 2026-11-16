import { useRef, type RefObject } from "react";
import { motion } from "framer-motion";
import {
  Atom, Braces, Cat, Cloud, CodeXml, Coffee, Container, Database, FileTerminal, Gamepad2, GitBranch, Github,
  LayoutGrid, Leaf, Palette, Route, Server, SquareCode, SquareTerminal, Type, type LucideIcon,
} from "lucide-react";
import { skillCategories, tones, type Skill, type SkillCategory, type SkillIcon, type Tone } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { Sparkle } from "../Illustrations";

const ICONS: Record<SkillIcon, LucideIcon> = {
  js: Braces, ts: Type, server: Server, route: Route, cat: Cat, atom: Atom, container: Container,
  git: GitBranch, github: Github, editor: SquareCode, windows: LayoutGrid, linux: SquareTerminal,
  html: CodeXml, css: Palette, coffee: Coffee, python: FileTerminal, database: Database, leaf: Leaf, cloud: Cloud, gamepad: Gamepad2,
};

function Sticker({ skill, tone, large, index, bounds }: {
  skill: Skill; tone: Tone; large: boolean; index: number;
  bounds: RefObject<HTMLDivElement | null>;
}) {
  const { lang, t } = useI18n();
  const Icon = ICONS[skill.icon];
  const note = typeof skill.note === "string" ? skill.note : skill.note?.[lang];
  const years = skill.years ? `${skill.years} ${t.skills.years}` : null;
  const kind = t.skills.kinds[skill.kind];
  const label = [skill.name, kind, years, note].filter(Boolean).join(" · ");
  return (
    <motion.button
      type="button"
      drag
      dragConstraints={bounds}
      dragMomentum={false}
      dragElastic={0.15}
      whileHover={{ scale: 1.08, rotate: 0 }}
      whileTap={{ scale: 0.96 }}
      aria-label={label}
      // Every sticker is transformed, so each one is its own stacking context. Lift the one being
      // hovered/focused/dragged above its siblings, or its hover card ends up underneath them.
      className={`group relative flex flex-col items-center justify-center gap-1 rounded-[22px] border-[3px] border-white text-k-text outline outline-2 outline-k-outline hover:z-40 focus-visible:z-40 active:z-50 ${
        large ? "holo h-28 w-28 shadow-[0_6px_14px_rgb(var(--k-shadow)/.45)]" : "glitter h-20 w-20 shadow-[0_4px_10px_rgb(var(--k-shadow)/.35)]"
      }`}
      style={{ touchAction: "none", backgroundColor: large ? undefined : tones[tone].bg, rotate: (index % 5 - 2) * 3 }}
    >
      <Icon className={large ? "h-9 w-9" : "h-6 w-6"} strokeWidth={2} />
      <span className={`px-1 text-center font-heading leading-tight ${large ? "text-sm" : "text-xs"}`}>{skill.name}</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 ${large ? "w-40" : "w-36"} rounded-2xl border-2 border-k-outline bg-k-surface px-3 py-2 text-left opacity-0 shadow-[0_6px_16px_rgb(var(--k-shadow)/.4)] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100`}
      >
        <span className="absolute -top-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-k-outline bg-k-surface" />
        <span className="flex items-center justify-between gap-2">
          <span className="font-heading text-sm leading-tight">{skill.name}</span>
          {years && (
            <span className="shrink-0 rounded-full px-1.5 font-heading text-[11px]" style={{ background: tones[tone].bg }}>{years}</span>
          )}
        </span>
        <span className="mt-0.5 block text-[11px] leading-snug text-k-text">{kind}</span>
        {note && <span className="mt-1 block text-xs leading-snug">{note}</span>}
      </span>
    </motion.button>
  );
}

function Category({ cat }: { cat: SkillCategory }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section className="rounded-3xl border-2 border-k-outline p-4" style={{ background: tones[cat.tone].soft }}>
      <h2 className="mb-3 inline-block rounded-full border-2 border-k-outline px-3 font-heading text-lg" style={{ background: tones[cat.tone].bg }}>
        {t.skills.categories[cat.id]}
      </h2>
      <div ref={ref} className="flex flex-wrap items-center gap-4 pb-6">
        {cat.skills.map((s, i) => (
          <Sticker key={s.name} skill={s} tone={cat.tone} large={cat.size === "lg"} index={i} bounds={ref} />
        ))}
      </div>
    </section>
  );
}

export default function SkillsWindow() {
  const { t } = useI18n();
  return (
    <div className="relative space-y-4 p-5 sm:p-6">
      <p className="flex items-center gap-2 font-heading text-sm">
        <Sparkle className="twinkle w-5" fill="#FFF0DA" /> {t.skills.hint}
      </p>
      {skillCategories.map((c) => (
        <Category key={c.id} cat={c} />
      ))}
    </div>
  );
}
