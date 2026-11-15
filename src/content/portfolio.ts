import type { Language } from "./translations";

// Portfolio content — edit this file to make the desktop yours.
// Everything here is placeholder content.

export const profile: { name: string; email: string; avatar: string | null } = {
  name: "Your Name",
  email: "hello@example.com",
  avatar: null, // e.g. an imported image URL to replace the illustrated cat on Home & About
};

export const socials = [
  { id: "github", label: "GitHub", url: "https://github.com/", icon: "github" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/", icon: "linkedin" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/", icon: "instagram" },
  { id: "site", label: "Website", url: "https://example.com/", icon: "globe" },
] as const;

// Sidebar shortcuts. Set `assets[id]` to a PNG/WebP/SVG url to replace a folder drawing.
export const navItems = [
  { id: "home", color: "#F6B8D0", shade: "#EE9DBE" },
  { id: "about", color: "#FFD9C0", shade: "#F7BFA0" },
  { id: "skills", color: "#C6EBDD", shade: "#A5DAC6" },
  { id: "projects", color: "#B9DEFA", shade: "#96C8F0" },
  { id: "contact", color: "#DCCBFA", shade: "#C4AEF0" },
] as const;
export type NavItem = typeof navItems[number];
export type NavId = NavItem["id"];
export const iconAssets: Record<NavId, string | null> = { home: null, about: null, skills: null, projects: null, contact: null };

export const tones = {
  pink: { bg: "#F6B8D0", soft: "#FFE3EE" },
  blue: { bg: "#B9DEFA", soft: "#E3F2FD" },
  lavender: { bg: "#DCCBFA", soft: "#F0E8FF" },
  mint: { bg: "#C6EBDD", soft: "#E6F7F0" },
  peach: { bg: "#FFD9C0", soft: "#FFF0E6" },
  cream: { bg: "#FFF0DA", soft: "#FFF9EF" },
};

export type Tone = keyof typeof tones;

// Skills: `size: "lg"` renders heavy-duty holographic stickers (use for your focus area).
export const skillCategories = [
  {
    id: "backend", tone: "pink", size: "lg",
    skills: [
      { name: "Node.js", icon: "server", years: 5, note: "APIs, queues, workers" },
      { name: "Python", icon: "terminal", years: 4, note: "FastAPI, scripting, data" },
      { name: "Java", icon: "coffee", years: 3, note: "Spring Boot services" },
      { name: "REST & GraphQL", icon: "workflow", years: 5, note: "API design & docs" },
      { name: "Auth & Security", icon: "zap", years: 4, note: "OAuth, JWT, hardening" },
    ],
  },
  {
    id: "frontend", tone: "blue", size: "sm",
    skills: [
      { name: "React", icon: "layers", years: 3, note: "Hooks, routing, state" },
      { name: "TypeScript", icon: "braces", years: 3, note: "Typed UIs and APIs" },
      { name: "CSS & Tailwind", icon: "palette", years: 4, note: "Responsive, animated" },
    ],
  },
  {
    id: "databases", tone: "mint", size: "sm",
    skills: [
      { name: "PostgreSQL", icon: "database", years: 5, note: "Modeling, indexing" },
      { name: "MongoDB", icon: "package", years: 3, note: "Document stores" },
      { name: "Redis", icon: "zap", years: 3, note: "Caching, rate limits" },
    ],
  },
  {
    id: "devops", tone: "lavender", size: "sm",
    skills: [
      { name: "Docker", icon: "container", years: 4, note: "Images & compose" },
      { name: "AWS", icon: "cloud", years: 3, note: "EC2, S3, Lambda" },
      { name: "CI/CD", icon: "rocket", years: 4, note: "GitHub Actions" },
    ],
  },
  {
    id: "tools", tone: "peach", size: "sm",
    skills: [
      { name: "Git", icon: "git", years: 6, note: "Branching, reviews" },
      { name: "Linux", icon: "cpu", years: 5, note: "Shell, servers" },
      { name: "Figma", icon: "wrench", years: 2, note: "Wireframes & icons" },
    ],
  },
] as const;
export type SkillCategory = typeof skillCategories[number];
export type Skill = SkillCategory["skills"][number];

// Projects — all placeholders. `thumb` / gallery entries accept image URLs;
// a tone name ("pink", "blue"...) draws a placeholder screenshot.
export interface Project {
  slug: string;
  category: "backend" | "fullstack" | "frontend" | "devops";
  tone: Tone;
  icon: "server" | "layers" | "palette" | "cloud";
  tags: string[];
  github: string;
  live: string | null;
  thumb: string | null;
  gallery: string[];
  text: Record<Language, {
    title: string;
    short: string;
    summary: string;
    problem: string;
    solution: string;
    features: string[];
  }>;
}

export const projects: Project[] = [
  {
    slug: "paw-tracker-api", category: "backend", tone: "pink", icon: "server",
    tags: ["Node.js", "PostgreSQL", "Redis", "Docker"],
    github: "https://github.com/", live: null, thumb: null,
    gallery: ["pink", "lavender", "cream"],
    text: {
      en: {
        title: "Paw Tracker API",
        short: "REST API for a pet-care app.",
        summary: "A sample REST API that stores pet profiles, vet records and feeding reminders.",
        problem: "Pet owners juggle vaccines, meds and appointments across scattered notes.",
        solution: "One tidy API with scheduled reminders, role-based access and cached reads.",
        features: ["Pet & vet-record endpoints", "Scheduled reminder worker", "Cached read-heavy routes"],
      },
      pt: {
        title: "Paw Tracker API",
        short: "API REST para um app de pets.",
        summary: "Uma API REST de exemplo que guarda perfis de pets, registros veterinários e lembretes de alimentação.",
        problem: "Tutores controlam vacinas, remédios e consultas em anotações espalhadas.",
        solution: "Uma API organizada com lembretes agendados, controle de acesso e leituras em cache.",
        features: ["Endpoints de pets e registros", "Worker de lembretes agendados", "Rotas de leitura com cache"],
      },
      ja: {
        title: "Paw Tracker API",
        short: "ペットケアアプリ用のREST API。",
        summary: "ペットのプロフィール、通院記録、ごはんのリマインダーを保存するサンプルREST APIです。",
        problem: "ワクチンや薬、通院の予定がバラバラのメモに散らばっていました。",
        solution: "リマインダー、権限管理、キャッシュ付きのすっきりしたAPIにまとめました。",
        features: ["ペット・通院記録のAPI", "定期リマインダーワーカー", "読み取りのキャッシュ"],
      },
    },
  },
  {
    slug: "bubble-tea-orders", category: "fullstack", tone: "mint", icon: "layers",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    github: "https://github.com/", live: "https://example.com/", thumb: null,
    gallery: ["mint", "blue", "peach"],
    text: {
      en: {
        title: "Bubble Tea Orders",
        short: "Order board for a tea shop.",
        summary: "A sample full-stack ordering board where customers customise drinks and staff track the queue.",
        problem: "A busy tea shop lost orders on paper tickets during rush hour.",
        solution: "A live queue with a customer ordering page and a staff screen that updates instantly.",
        features: ["Drink customiser", "Live order queue", "Order history"],
      },
      pt: {
        title: "Bubble Tea Orders",
        short: "Quadro de pedidos para uma chaseria.",
        summary: "Um quadro de pedidos full-stack de exemplo onde clientes personalizam bebidas e a equipe acompanha a fila.",
        problem: "Uma chaseria movimentada perdia pedidos em comandas de papel no horário de pico.",
        solution: "Uma fila ao vivo com página de pedidos e tela da equipe que atualiza na hora.",
        features: ["Personalizador de bebidas", "Fila de pedidos ao vivo", "Histórico de pedidos"],
      },
      ja: {
        title: "Bubble Tea Orders",
        short: "ティーショップの注文ボード。",
        summary: "お客様がドリンクをカスタマイズし、スタッフが注文待ちを確認できるサンプルのフルスタックアプリです。",
        problem: "忙しい時間帯に、紙の伝票で注文が漏れていました。",
        solution: "注文ページとスタッフ画面がすぐに更新されるライブ注文キューを作りました。",
        features: ["ドリンクのカスタマイズ", "ライブ注文キュー", "注文履歴"],
      },
    },
  },
  {
    slug: "starry-notes", category: "frontend", tone: "lavender", icon: "palette",
    tags: ["React", "TypeScript", "Tailwind"],
    github: "https://github.com/", live: "https://example.com/", thumb: null,
    gallery: ["lavender", "pink", "mint"],
    text: {
      en: {
        title: "Starry Notes",
        short: "A dreamy note-taking UI.",
        summary: "A sample front-end for sticky notes you can drag, colour and pin on a starry board.",
        problem: "Most note apps feel cold and don't invite doodling or play.",
        solution: "A tactile board with draggable notes, pastel themes and gentle animations.",
        features: ["Draggable sticky notes", "Pastel themes", "Local autosave"],
      },
      pt: {
        title: "Starry Notes",
        short: "Uma interface de notas sonhadora.",
        summary: "Um front-end de exemplo para notas adesivas que você arrasta, colore e fixa em um quadro estrelado.",
        problem: "A maioria dos apps de notas parece fria e não convida a rabiscar.",
        solution: "Um quadro tátil com notas arrastáveis, temas pastel e animações suaves.",
        features: ["Notas adesivas arrastáveis", "Temas pastel", "Salvamento local automático"],
      },
      ja: {
        title: "Starry Notes",
        short: "夢みたいなメモUI。",
        summary: "星空のボードに付箋をドラッグ、色付け、ピン留めできるサンプルのフロントエンドです。",
        problem: "多くのメモアプリは冷たい印象で、落書きや遊び心がありません。",
        solution: "ドラッグできる付箋、パステルのテーマ、やさしいアニメーションのボードです。",
        features: ["ドラッグできる付箋", "パステルテーマ", "ローカル自動保存"],
      },
    },
  },
  {
    slug: "cloud-kitchen-deploy", category: "devops", tone: "blue", icon: "cloud",
    tags: ["Docker", "AWS", "GitHub Actions", "Linux"],
    github: "https://github.com/", live: null, thumb: null,
    gallery: ["blue", "cream", "lavender"],
    text: {
      en: {
        title: "Cloud Kitchen Deploy",
        short: "One-click deploy pipeline.",
        summary: "A sample CI/CD setup that builds, tests and ships a containerised service to the cloud.",
        problem: "Manual deployments were slow and easy to get wrong.",
        solution: "A pipeline that builds images, runs tests and rolls out with health checks.",
        features: ["Automated tests on every push", "Containerised releases", "Health-checked rollouts"],
      },
      pt: {
        title: "Cloud Kitchen Deploy",
        short: "Pipeline de deploy com um clique.",
        summary: "Um exemplo de CI/CD que compila, testa e publica um serviço em contêiner na nuvem.",
        problem: "Os deploys manuais eram lentos e fáceis de errar.",
        solution: "Um pipeline que gera imagens, roda testes e publica com verificações de saúde.",
        features: ["Testes automáticos a cada push", "Releases em contêiner", "Publicação com health check"],
      },
      ja: {
        title: "Cloud Kitchen Deploy",
        short: "ワンクリックのデプロイ。",
        summary: "コンテナ化したサービスをビルド、テストしてクラウドへ公開するサンプルのCI/CDです。",
        problem: "手作業のデプロイは遅く、ミスも起きやすいものでした。",
        solution: "イメージのビルド、テスト、ヘルスチェック付きのリリースを自動化しました。",
        features: ["pushごとの自動テスト", "コンテナでのリリース", "ヘルスチェック付き展開"],
      },
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
