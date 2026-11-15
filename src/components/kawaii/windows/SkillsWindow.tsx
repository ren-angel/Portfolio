import { useRef, type RefObject } from "react";
import { motion } from "framer-motion";
import {
  Server, Terminal, Coffee, Workflow, Zap, Layers, Braces, Palette, Database, Package,
  Container, Cloud, Rocket, GitBranch, Cpu, Wrench,
} from "lucide-react";
import { skillCategories, tones, type Skill, type SkillCategory, type Tone } from "@/content/portfolio";
import { useI18n } from "@/lib/i18n";
import { Sparkle } from "../Illustrations";

const ICONS = {
  server: Server, terminal: Terminal, coffee: Coffee, workflow: Workflow, zap: Zap, layers: Layers,
  braces: Braces, palette: Palette, database: Database, package: Package, container: Container,
  cloud: Cloud, rocket: Rocket, git: GitBranch, cpu: Cpu, wrench: Wrench,
};

function Sticker({ skill, tone, large, index, bounds, yrs }: {
  skill: Skill; tone: Tone; large: boolean; index: number;
  bounds: RefObject<HTMLDivElement | null>; yrs: string;
}) {
  const Icon = ICONS[skill.icon] ?? Package;
  const tip = `${skill.name} · ${skill.years} ${yrs} — ${skill.note}`;
  return (
    <motion.button
      type="button"
      drag
      dragConstraints={bounds}
      dragMomentum={false}
      dragElastic={0.15}
      whileHover={{ scale: 1.08, rotate: 0 }}
      whileTap={{ scale: 0.96 }}
      aria-label={tip}
      className={`group relative flex flex-col items-center justify-center gap-1 rounded-[22px] border-[3px] border-white text-k-text outline outline-2 outline-k-outline ${
        large ? "holo h-28 w-28 shadow-[0_6px_14px_rgba(169,141,174,.45)]" : "glitter h-20 w-20 shadow-[0_4px_10px_rgba(169,141,174,.35)]"
      }`}
      style={{ touchAction: "none", backgroundColor: large ? undefined : tones[tone].bg, rotate: (index % 5 - 2) * 3 }}
    >
      <Icon className={large ? "h-9 w-9" : "h-6 w-6"} strokeWidth={2} />
      <span className={`font-heading leading-tight ${large ? "text-sm" : "text-xs"}`}>{skill.name}</span>
      <span role="tooltip" className="pointer-events-none absolute left-1/2 top-full z-30 mt-1 w-44 -translate-x-1/2 rounded-xl border-2 border-k-outline bg-white px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {tip}
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
          <Sticker key={s.name} skill={s} tone={cat.tone} large={cat.size === "lg"} index={i} bounds={ref} yrs={t.skills.years} />
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
