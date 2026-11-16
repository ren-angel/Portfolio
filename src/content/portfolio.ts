import type { Language } from "./translations";
// Real screenshots and a gameplay video. Originals live in design/screenshot-originals (gitignored):
// these copies are cropped to the page (no browser bar), resized and converted to WebP / H.264.
import virteaiHome from "@/assets/projects/virteai-home.webp";
import virteaiPatient from "@/assets/projects/virteai-pacient.webp";
import virteaiSession from "@/assets/projects/virteai-sessiondata.webp";
import vrMercado from "@/assets/projects/vr-mercado.mp4";
import vrMercadoPoster from "@/assets/projects/vr-mercado-poster.webp";
import clinixflowHome from "@/assets/projects/clinixflow-home.webp";
import clinixflowTimeline from "@/assets/projects/clinixflow-timeline.webp"; // made-up demo data (local seed)
import clinixflowIndicators from "@/assets/projects/clinixflow-indicators.webp";
import notebookHome from "@/assets/projects/notebook-home.webp";
import notebookChat from "@/assets/projects/notebook-chat.webp"; // file names blurred (the festival's internal files)
import artistHome from "@/assets/projects/artist-home.webp";
import artistDashboard from "@/assets/projects/artist-dashboard.webp";
import artistEditor from "@/assets/projects/artist-editor.webp";
import portfolioHome from "@/assets/projects/portfolio-home.webp";
import portfolioTabs from "@/assets/projects/portfolio-tabs.webp";
import portfolioFeats from "@/assets/projects/portfolio-feats.webp";
import timbreMain from "@/assets/projects/timbre-main.webp";
import timbreVoice from "@/assets/projects/timbre-voice.webp";
import timbreLibrary from "@/assets/projects/timbre-library.webp";
import modelViewer from "@/assets/projects/model-viewer.webp";

// Portfolio content - edit this file to make the desktop yours.
// Everything here is placeholder content.

export const profile: { name: string; email: string; aboutPhoto: string | null; githubUser: string } = {
  name: "Daniel \"Ren Angel\" Medrado",
  email: "danielmedradodemorais@gmail.com",
  aboutPhoto: null, // e.g. an imported image URL - replaces the illustrated cat on About Me
  githubUser: "ren-angel", // used by the Repos window and the terminal (public GitHub API, no token)
};

export const socials = [
  { id: "github", label: "GitHub", url: "https://github.com/ren-angel", icon: "github" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/daniel-medrado-de-morais-79073b299", icon: "linkedin" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/ren_angel1/", icon: "instagram" },
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

// Little desktop apps (icons on the desktop, "Apps" button on mobile).
export const appItems = [
  { id: "paint", color: "#FFD9C0" },
  { id: "guestbook", color: "#F6B8D0" },
  { id: "terminal", color: "#DCCBFA" },
  { id: "github", color: "#B9DEFA" },
  { id: "settings", color: "#C6EBDD" },
] as const;
export type AppItem = typeof appItems[number];

// Colour names map to theme tokens (src/styles/desktop.css), so they adapt to night mode.
export const tones = {
  pink: { bg: "var(--k-pink)", soft: "var(--k-pink-soft)" },
  blue: { bg: "var(--k-blue)", soft: "var(--k-blue-soft)" },
  lavender: { bg: "var(--k-lav)", soft: "var(--k-lav-soft)" },
  mint: { bg: "var(--k-mint)", soft: "var(--k-mint-soft)" },
  peach: { bg: "var(--k-peach)", soft: "var(--k-peach-soft)" },
  cream: { bg: "var(--k-cream)", soft: "var(--k-cream-soft)" },
};

export type Tone = keyof typeof tones;

// Skills - mirrors the groups in your GitHub README.
// `size: "lg"` renders big holographic stickers (use it for your main stack).
// `kind` is the line shown in the hover card (labels live in translations.ts → skills.kinds).
// `years` and `note` are optional extras for the card.
// `note` can be one string, or { en, pt, ja } to translate it.
export type SkillIcon =
  | "js" | "ts" | "server" | "route" | "cat" | "atom" | "container"
  | "git" | "github" | "editor" | "windows" | "linux"
  | "html" | "css" | "coffee" | "python" | "database" | "leaf" | "cloud" | "gamepad";

export type SkillKind =
  | "language" | "runtime" | "framework" | "ui" | "containers" | "vcs" | "hosting"
  | "editor" | "os" | "markup" | "styling" | "sql" | "nosql" | "cloud" | "engine";

export interface Skill {
  name: string;
  kind: SkillKind;
  icon: SkillIcon;
  years?: number;
  note?: string | Record<Language, string>;
}

export interface SkillCategory {
  id: "main" | "tools" | "extra";
  tone: Tone;
  size: "lg" | "sm";
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "main", tone: "pink", size: "lg",
    skills: [
      { name: "JavaScript", kind: "language", icon: "js", years: 3 },
      { name: "TypeScript", kind: "language", icon: "ts", years: 1.5 },
      { name: "Node.js", kind: "runtime", icon: "server", years: 2.5 },
      { name: "Express", kind: "framework", icon: "route", years: 2.5 },
      { name: "NestJS", kind: "framework", icon: "cat", years: 1.5 },
      { name: "React", kind: "ui", icon: "atom", years: 2.5 },
      { name: "Docker", kind: "containers", icon: "container", years: 2 },
    ],
  },
  {
    id: "tools", tone: "peach", size: "sm",
    skills: [
      { name: "Git", kind: "vcs", icon: "git", years: 2 },
      { name: "GitHub", kind: "hosting", icon: "github", years: 3 },
      { name: "VS Code", kind: "editor", icon: "editor", years: 3 },
      { name: "Windows", kind: "os", icon: "windows", years: 23 },
      { name: "Linux", kind: "os", icon: "linux", years: 2, note: "Ubuntu" },
    ],
  },
  {
    id: "extra", tone: "mint", size: "sm",
    skills: [
      { name: "HTML", kind: "markup", icon: "html", years: 3 },
      { name: "CSS", kind: "styling", icon: "css", years: 3 },
      { name: "Java", kind: "language", icon: "coffee", years: 2 },
      { name: "Python", kind: "language", icon: "python", years: 3 },
      { name: "Unity", kind: "engine", icon: "gamepad", years: 0.5 },
      { name: "MySQL", kind: "sql", icon: "database", years: 3 },
      { name: "PostgreSQL", kind: "sql", icon: "database", years: 2 },
      { name: "MongoDB", kind: "nosql", icon: "leaf", years: 2 },
      { name: "Azure", kind: "cloud", icon: "cloud", years: 1 },
    ],
  },
];

// Projects. `thumb` and `gallery` take imported image URLs (see the imports at the top).
// No real screenshot yet? Use thumb: null and gallery: [] - the illustrated icon is used instead.
/** A gallery entry: an image URL, or a video with the image shown before it plays. */
export type GalleryItem = string | { video: string; poster: string };
export interface Project {
  slug: string;
  category: "backend" | "fullstack" | "frontend" | "devops" | "mobile";
  tone: Tone;
  icon: "server" | "layers" | "palette" | "cloud" | "glasses" | "book" | "mic" | "box";
  tags: string[];
  /** null = private repo: the button shows as disabled with a "private repo" note. */
  github: string | null;
  live: string | null;
  thumb: string | null;
  gallery: GalleryItem[];
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
    slug: "virteai", category: "fullstack", tone: "lavender", icon: "glasses",
    tags: ["Node.js", "Unity (C#)", "Docker", "Express", "Prisma", "MySQL", "React", "OpenXR eye tracking", "GitHub Actions", "Claude API"],
    github: null, live: "https://www.virteai.com.br", thumb: null,
    gallery: [{ video: vrMercado, poster: vrMercadoPoster }, virteaiHome, virteaiSession, virteaiPatient],
    text: {
      en: {
        title: "VirTEAI",
        short: "A VR platform that helps therapists follow the progress of autistic patients.",
        summary: "VirTEAI is a team project where therapists manage their patients and run virtual reality sessions. The patient practises everyday situations in VR while the headset records where they look, what they pick up and which tasks they finish, and the therapist then sees that session as charts on the website. Several scenarios are planned, and the grocery shopping one is fully built so far. I built the back-end API, the Unity VR scenario and the deployment. The front-end design and the original pages were made by my teammate Murillo, and I connected them to the API.",
        problem: "Therapists who work with autistic patients need a safe way to practise everyday situations, like going shopping, and a way to see how a session really went instead of relying only on notes. On top of that, clinical data has to stay locked to the right people.",
        solution: "The Express + Prisma API (MySQL) owns every rule: therapists sign up and wait for approval, only ever see their own patients, and generate a single-use code for each VR session. The headset sends the session data with that code, so it never needs a login. In Unity I built the first scenario, a supermarket with a shopping list, items you can pick up and a checkout, plus a gaze tracker that reads eye tracking through OpenXR and turns it into gaze events, a 3D heatmap and the path walked. Everything ships as Docker images through GitHub Actions to a VPS behind nginx.",
        features: [
          "Roles for admins, therapists and patients, with therapist sign-ups approved by the team through an email link",
          "Single-use 6-digit session codes (valid for 3 hours) that link a VR session to the right patient",
          "Eye tracking in Unity via OpenXR: gaze events, a voxel heatmap, the walked path, tasks and errors sent to the API",
          "Report attachments encrypted on disk with AES-256-GCM, downloadable only after an access check",
          "Optional two-factor login with an email code (only an HMAC of the code is stored)",
          "A help chatbot that answers only from an admin-managed knowledge base and cites its sources, with per-IP and daily limits",
          "CI/CD: migrations tested on a clean MySQL, images published to GHCR, SSH deploy with automatic rollback if the new version isn't healthy",
        ],
      },
      pt: {
        title: "VirTEAI",
        short: "Uma plataforma de realidade virtual que ajuda terapeutas a acompanhar pacientes autistas.",
        summary: "A VirTEAI é um projeto em equipe em que terapeutas gerenciam seus pacientes e conduzem sessões em realidade virtual. O paciente treina situações do dia a dia em VR enquanto o óculos registra para onde ele olha, o que pega e quais tarefas conclui, e depois o terapeuta vê essa sessão em gráficos no site. São várias situações planejadas, e a compra no mercado é a que está totalmente desenvolvida até agora. Eu fiz a API do back-end, o cenário em Unity e o deploy. O design e as páginas originais do front-end foram feitos pelo meu colega Murillo, e eu os integrei à API.",
        problem: "Terapeutas que atendem pacientes autistas precisam de um jeito seguro de treinar situações do dia a dia, como ir ao mercado, e de ver como a sessão realmente foi, sem depender só de anotações. Além disso, os dados clínicos precisam ficar restritos às pessoas certas.",
        solution: "A API em Express + Prisma (MySQL) concentra todas as regras: terapeutas se cadastram e aguardam aprovação, só enxergam os próprios pacientes e geram um código de uso único para cada sessão em VR. O óculos envia os dados da sessão com esse código, então não precisa de login. No Unity, montei o primeiro cenário, um supermercado com lista de compras, itens que dá para pegar e caixa, além de um rastreador de olhar que lê o eye tracking via OpenXR e o transforma em eventos de olhar, um mapa de calor em 3D e o trajeto percorrido. Tudo vai para produção como imagens Docker, pelo GitHub Actions, numa VPS atrás do nginx.",
        features: [
          "Papéis de admin, terapeuta e paciente, com cadastros de terapeuta aprovados pela equipe por um link no e-mail",
          "Códigos de sessão de 6 dígitos e uso único (válidos por 3 horas) que ligam a sessão em VR ao paciente certo",
          "Eye tracking no Unity via OpenXR: eventos de olhar, mapa de calor em voxels, trajeto, tarefas e erros enviados à API",
          "Anexos de relatório criptografados em disco com AES-256-GCM, baixados só depois de checar o acesso",
          "Login em dois fatores opcional com código por e-mail (só o HMAC do código é guardado)",
          "Um chatbot de dúvidas que responde só com base nos documentos cadastrados pelo admin e cita as fontes, com limites por IP e por dia",
          "CI/CD: migrations testadas num MySQL limpo, imagens publicadas no GHCR e deploy por SSH com rollback automático se a versão nova não ficar saudável",
        ],
      },
      ja: {
        title: "VirTEAI",
        short: "セラピストが自閉スペクトラム症の患者さんの成長を見守るためのVRプラットフォーム。",
        summary: "VirTEAI はチームで作っているプロジェクトで、セラピストが患者さんを管理し、VRセッションを行えるプラットフォームです。患者さんはVRで日常のさまざまな場面を練習し、ヘッドセットは視線の先、手に取った商品、終えたタスクを記録します。セラピストはそのセッションをサイト上のグラフで確認できます。いくつもの場面を予定していて、今のところ完成しているのはスーパーでの買い物です。私はバックエンドAPI、UnityのVRシナリオ、デプロイを担当しました。フロントエンドのデザインと最初のページはチームメイトの Murillo が作り、私がAPIとつなぎました。",
        problem: "自閉スペクトラム症の患者さんを支えるセラピストには、買い物のような日常の場面を安全に練習できる場と、メモだけに頼らずセッションの様子を確かめる方法が必要です。さらに、臨床データは決められた人だけが見られるようにしなければなりません。",
        solution: "ルールはすべて Express + Prisma（MySQL）のAPIが持っています。セラピストは登録後に承認を待ち、自分の患者さんだけを閲覧でき、VRセッションごとに使い切りのコードを発行します。ヘッドセットはそのコードでセッションデータを送るので、ログインは不要です。Unity では最初のシナリオとして、買い物リスト、手に取れる商品、レジのあるスーパーマーケットを作り、OpenXR でアイトラッキングを読み取って視線イベント・3Dヒートマップ・移動経路に変換する視線トラッカーも実装しました。すべて Docker イメージとして GitHub Actions から nginx の後ろの VPS にデプロイされます。",
        features: [
          "管理者・セラピスト・患者の権限。セラピストの登録はメールのリンクからチームが承認",
          "6桁・使い切り（3時間有効）のセッションコードで、VRセッションを正しい患者さんに紐づけ",
          "Unity + OpenXR のアイトラッキング：視線イベント、ボクセルのヒートマップ、移動経路、タスクとミスをAPIへ送信",
          "レポートの添付ファイルは AES-256-GCM で暗号化して保存し、権限を確認してからダウンロード",
          "メールのコードによる二段階認証（任意）。保存するのはコードの HMAC だけ",
          "管理者が登録した資料だけをもとに答え、出典を示すお問い合わせチャットボット（IPごと・1日ごとの上限つき）",
          "CI/CD：クリーンな MySQL でマイグレーションを検証し、GHCR にイメージを公開、SSH でデプロイ。新バージョンが正常に動かなければ自動ロールバック",
        ],
      },
    },
  },
  {
    slug: "clinixflow", category: "backend", tone: "mint", icon: "server",
    tags: ["Node.js", "PostgreSQL", "Prisma", "Express", "React", "Asaas (Pix)", "Docker", "Integration tests"],
    github: null, live: null, thumb: null,
    gallery: [clinixflowHome, clinixflowTimeline, clinixflowIndicators],
    text: {
      en: {
        title: "ClinixFlow",
        short: "Practice-management software for therapists and small clinics.",
        summary: "A clinic-management system for independent therapists and small practices: patients and guardians, therapy goals, scheduling, session records, finances, team roles and a portal for patients. It has a large back-end (43 database models) and a strong focus on data integrity. It works end to end, but it isn't publicly launched yet. (The screenshots use made-up demo data.)",
        problem: "Small practices juggle spreadsheets, chat apps and paper for appointments, notes and payments. Clinical data is sensitive, two people can try to book the same time slot at the same moment, and money records must never change silently.",
        solution: "An Express 5 + Prisma API on PostgreSQL where each clinic is an isolated workspace and every permission is checked on the server; the menu in the React front-end is just a convenience. Booking takes a per-therapist PostgreSQL advisory lock so nobody can grab a slot that's already taken, payments lock the charge row and use idempotency keys, and finance entries go into an immutable ledger. The integration tests run on a throwaway local PostgreSQL cluster, including one that fires 20 bookings for the same slot at once.",
        features: [
          "Multi-tenant workspaces with owner, admin, professional and staff roles, all enforced by the API",
          "Weekly recurring appointments, conflict detection and a history of every reschedule",
          "Reminder jobs that are safe to run from several processes at once (one idempotency key per reminder)",
          "Subscription billing through Asaas, with Pix QR codes and webhooks",
          "Finances with payments, refunds and an immutable ledger",
          "A portal where patients and guardians see their appointments, shared documents and activities",
          "Audit log, PDF records and CSV/XLSX import and export (protected against CSV injection)",
          "89 database integration tests on a disposable PostgreSQL, with a guard that refuses to touch any real database",
        ],
      },
      pt: {
        title: "ClinixFlow",
        short: "Um sistema de gestão para terapeutas e pequenos consultórios.",
        summary: "Um sistema de gestão clínica para terapeutas autônomos e pequenos consultórios: pacientes e responsáveis, metas terapêuticas, agenda, registros de atendimento, financeiro, equipe e um portal para os pacientes. Tem um back-end grande (43 modelos no banco) e muito cuidado com a integridade dos dados. Funciona de ponta a ponta, mas ainda não foi lançado publicamente. (As capturas usam dados fictícios de demonstração.)",
        problem: "Consultórios pequenos se viram com planilhas, apps de mensagem e papel para agenda, anotações e pagamentos. Os dados clínicos são sensíveis, duas pessoas podem tentar marcar o mesmo horário ao mesmo tempo, e os registros financeiros nunca podem mudar sem deixar rastro.",
        solution: "Uma API em Express 5 + Prisma sobre PostgreSQL em que cada consultório é um workspace isolado e toda permissão é conferida no servidor; o menu do front-end em React é só uma conveniência. O agendamento usa um advisory lock do PostgreSQL por terapeuta, para ninguém pegar um horário já ocupado; os pagamentos travam a linha da cobrança e usam chaves de idempotência; e os lançamentos financeiros vão para um livro-razão imutável. Os testes de integração rodam num cluster PostgreSQL local descartável, incluindo um que dispara 20 agendamentos para o mesmo horário ao mesmo tempo.",
        features: [
          "Workspaces multi-tenant com papéis de titular, admin, profissional e equipe, todos aplicados pela API",
          "Agendamentos recorrentes semanais, detecção de conflito e histórico de cada remarcação",
          "Rotinas de lembrete seguras mesmo rodando em vários processos ao mesmo tempo (uma chave de idempotência por lembrete)",
          "Assinatura do sistema pelo Asaas, com QR code de Pix e webhooks",
          "Financeiro com pagamentos, estornos e livro-razão imutável",
          "Portal em que pacientes e responsáveis veem horários, documentos compartilhados e atividades",
          "Log de auditoria, registros em PDF e importação/exportação em CSV/XLSX (protegida contra CSV injection)",
          "89 testes de integração com banco num PostgreSQL descartável, com uma trava que impede rodar em qualquer banco real",
        ],
      },
      ja: {
        title: "ClinixFlow",
        short: "セラピストや小さなクリニックのための業務管理システム。",
        summary: "個人のセラピストや小規模なクリニック向けの管理システムです。患者さんと保護者、治療目標、予約、記録、会計、スタッフの権限、患者さん向けポータルをまとめて扱えます。データベースのモデルが43個ある大きなバックエンドを持ち、データの整合性を特に大切にしています。一通り動きますが、まだ一般公開はしていません。（スクリーンショットは架空のデモデータです。）",
        problem: "小さなクリニックでは、予約・メモ・支払いをスプレッドシートやチャットアプリ、紙でやりくりしがちです。臨床データはデリケートですし、同じ時間枠に二人が同時に予約しようとすることもあります。お金の記録は、黙って書き換わることが絶対にあってはいけません。",
        solution: "Express 5 + Prisma と PostgreSQL のAPIで、クリニックごとに独立したワークスペースを持ち、すべての権限をサーバー側で確認します。React のフロントエンドのメニューはあくまで便利機能です。予約ではセラピストごとに PostgreSQL の advisory lock を取り、埋まった枠を重ねて取れないようにしました。支払いは請求の行をロックして冪等キーを使い、会計の記録は変更できない台帳に追記します。結合テストは使い捨てのローカル PostgreSQL クラスタで動き、同じ枠に20件の予約を同時に送るテストもあります。",
        features: [
          "オーナー・管理者・専門職・スタッフの権限を持つマルチテナントのワークスペース（すべてAPI側で制御）",
          "毎週の繰り返し予約、重複の検出、予約変更の履歴",
          "複数のプロセスから同時に動かしても安全なリマインダー処理（リマインダーごとの冪等キー）",
          "Asaas によるサブスクリプション課金（Pix のQRコードと Webhook）",
          "支払い・返金と、変更できない台帳による会計",
          "患者さんと保護者が予約、共有された書類、課題を見られるポータル",
          "監査ログ、PDFの記録、CSV/XLSX のインポートとエクスポート（CSVインジェクション対策つき）",
          "使い捨ての PostgreSQL で動く89件のデータベース結合テスト。本番のデータベースには触れないようガードつき",
        ],
      },
    },
  },
  {
    slug: "drive-notebooks", category: "backend", tone: "blue", icon: "book",
    tags: ["Node.js", "Google Drive API", "Claude API", "Express", "SQLite FTS5", "PostgreSQL"],
    github: null, live: null, thumb: null,
    gallery: [notebookHome, notebookChat],
    text: {
      en: {
        title: "Drive Notebooks",
        short: "Ask questions about a team's Google Drive and get answers with sources.",
        summary: "A NotebookLM-style internal tool I built for the organizing team of Bunka Matsuri, a festival held by Bunkyo. Every folder in the team's Google Drive becomes a notebook, and a chat powered by Claude answers questions from those files, showing exactly which document each part of the answer came from.",
        problem: "Years of event planning live in Drive: spreadsheets, PDFs, slides and docs spread across many folders. Answering \"how did we do this last year?\" means opening file after file, and some folders, like HR and finance, must stay visible only to the right people.",
        solution: "A read-only Google service account syncs the Drive, and each subfolder of a chosen root turns into a notebook on its own. The server extracts text from Google files, PDF, Office and OpenDocument, splits it into chunks and indexes them with SQLite FTS5 (BM25). When someone asks a question, the server searches only the notebooks that person is allowed to open, sends the best passages to Claude and returns the answer with numbered citations. Users, permissions, conversations and API costs live in PostgreSQL.",
        features: [
          "Drive folders become notebooks automatically on each sync",
          "Access by area checked on the server: HR, finance and coordination folders never reach the general chat",
          "Answers with numbered citations that open the source file next to the chat",
          "Text extraction for Google Docs/Sheets/Slides, PDF, Word, Excel, PowerPoint, OpenDocument, CSV and Markdown",
          "Full-text search with SQLite FTS5 (BM25) to choose which passages go to the model",
          "Optional local OCR (Tesseract) for scanned PDFs, without sending files to any outside service",
          "API cost tracking per user and passwords hashed with scrypt",
        ],
      },
      pt: {
        title: "Drive Notebooks",
        short: "Pergunte sobre o Google Drive da equipe e receba respostas com as fontes.",
        summary: "Uma ferramenta interna no estilo NotebookLM que fiz para a equipe organizadora do Bunka Matsuri, festival realizado pelo Bunkyo. Cada pasta do Google Drive da equipe vira um notebook, e um chat com o Claude responde perguntas a partir desses arquivos, mostrando de qual documento saiu cada parte da resposta.",
        problem: "Anos de organização do evento estão no Drive: planilhas, PDFs, apresentações e documentos espalhados por várias pastas. Responder \"como fizemos isso no ano passado?\" significa abrir arquivo atrás de arquivo, e algumas pastas, como RH e financeiro, só podem ser vistas pelas pessoas certas.",
        solution: "Uma conta de serviço do Google, só de leitura, sincroniza o Drive, e cada subpasta de uma raiz escolhida vira um notebook sozinha. O servidor extrai o texto de arquivos do Google, PDF, Office e OpenDocument, divide em trechos e indexa com SQLite FTS5 (BM25). Quando alguém pergunta algo, o servidor busca só nos notebooks que essa pessoa pode abrir, manda os melhores trechos para o Claude e devolve a resposta com citações numeradas. Usuários, permissões, conversas e custos da API ficam no PostgreSQL.",
        features: [
          "Pastas do Drive viram notebooks automaticamente a cada sincronização",
          "Acesso por área conferido no servidor: pastas de RH, financeiro e coordenação nunca entram no chat geral",
          "Respostas com citações numeradas que abrem o arquivo de origem ao lado do chat",
          "Extração de texto de Docs/Planilhas/Apresentações do Google, PDF, Word, Excel, PowerPoint, OpenDocument, CSV e Markdown",
          "Busca textual com SQLite FTS5 (BM25) para escolher os trechos enviados ao modelo",
          "OCR local opcional (Tesseract) para PDFs escaneados, sem enviar arquivos a nenhum serviço externo",
          "Controle de custo da API por usuário e senhas com hash scrypt",
        ],
      },
      ja: {
        title: "Drive Notebooks",
        short: "チームの Google ドライブに質問すると、出典つきで答えてくれるツール。",
        summary: "文協（Bunkyo）が開催するお祭り「文化祭り（Bunka Matsuri）」の運営チームのために作った、NotebookLM 風の社内ツールです。チームの Google ドライブのフォルダがそれぞれノートブックになり、Claude を使ったチャットがそのファイルをもとに質問に答えます。答えのどの部分がどの資料から来たのかも表示されます。",
        problem: "何年分ものイベント準備の資料が、スプレッドシート、PDF、スライド、ドキュメントとしてたくさんのフォルダに散らばっています。「去年はどうやったっけ？」を調べるにはファイルを一つずつ開くしかなく、人事や会計などのフォルダは決められた人だけが見られるようにする必要があります。",
        solution: "読み取り専用の Google サービスアカウントがドライブを同期し、指定したフォルダの中のサブフォルダが自動でノートブックになります。サーバーは Google のファイル、PDF、Office、OpenDocument からテキストを取り出し、小さく分けて SQLite FTS5（BM25）で索引を作ります。質問が来ると、その人が開けるノートブックだけを検索し、関連の高い部分を Claude に渡して、番号つきの出典と一緒に答えを返します。ユーザー、権限、会話、APIの費用は PostgreSQL に保存します。",
        features: [
          "同期のたびに、ドライブのフォルダが自動でノートブックに",
          "分野ごとのアクセス権をサーバー側で確認。人事・会計・コーディネーターのフォルダは全体チャットに入らない",
          "番号つきの出典をクリックすると、元のファイルがチャットの横に開く",
          "Google ドキュメント／スプレッドシート／スライド、PDF、Word、Excel、PowerPoint、OpenDocument、CSV、Markdown からテキストを抽出",
          "SQLite FTS5（BM25）の全文検索で、モデルに渡す部分を選ぶ",
          "スキャンしたPDF向けのローカルOCR（Tesseract・任意）。外部サービスにファイルを送らない",
          "ユーザーごとのAPI費用の記録と、scrypt でハッシュ化したパスワード",
        ],
      },
    },
  },
  {
    slug: "artists-portfolio-maker", category: "fullstack", tone: "peach", icon: "palette",
    tags: ["TypeScript", "Next.js", "Fastify", "PostgreSQL", "S3 / R2 storage", "Playwright", "pnpm monorepo"],
    github: null, live: null, thumb: null,
    gallery: [artistHome, artistDashboard, artistEditor],
    text: {
      en: {
        title: "Artists Portfolio Maker",
        short: "A portfolio builder for illustrators (work in progress).",
        summary: "A platform where artists upload their work, arrange it into galleries and pages, style it with templates and publish their own portfolio site. It's a TypeScript monorepo with a Next.js studio and a Fastify API on PostgreSQL. It's my newest project: the core works locally and is covered by tests, but it isn't production-ready yet, since payments, email and hosting still need real-world setup.",
        problem: "Artists need a portfolio that shows their work nicely without having to learn web design, and their unpublished images must stay private until they decide to share them.",
        solution: "The API is split into domain modules (identity, tenancy, media, portfolio, billing…) and every query is scoped to the artist's own space. Images go to private storage, either the local disk or any S3-compatible service like Cloudflare R2, and anonymous visitors can only load them while the portfolio is published; unpublishing takes that access away again. The Next.js studio has a visual section editor with autosave and a revision history.",
        features: [
          "Artwork library with JPEG/PNG/WebP uploads, captions, alt text and featured works",
          "Galleries and pages with reordering, plus a visual section editor with undo/redo",
          "Private draft preview, publish and unpublish (which also removes public access to the images)",
          "Revision history you can restore from",
          "Tenant isolation, plan limits and subscription billing (so far tested with a mock payment provider)",
          "Integration tests plus Playwright browser tests for the main artist journeys",
        ],
      },
      pt: {
        title: "Artists Portfolio Maker",
        short: "Um criador de portfólios para ilustradores (em desenvolvimento).",
        summary: "Uma plataforma em que artistas enviam suas obras, organizam tudo em galerias e páginas, escolhem um template e publicam o próprio site de portfólio. É um monorepo em TypeScript com um estúdio em Next.js e uma API em Fastify sobre PostgreSQL. É meu projeto mais novo: o núcleo funciona localmente e tem testes, mas ainda não está pronto para produção, porque pagamentos, e-mail e hospedagem ainda precisam ser configurados de verdade.",
        problem: "Artistas precisam de um portfólio que mostre bem o trabalho deles sem precisar aprender web design, e as imagens não publicadas têm que continuar privadas até eles decidirem compartilhar.",
        solution: "A API é dividida em módulos de domínio (identidade, tenancy, mídia, portfólio, cobrança…) e toda consulta fica restrita ao espaço do próprio artista. As imagens vão para um armazenamento privado, seja o disco local ou qualquer serviço compatível com S3, como o Cloudflare R2, e visitantes anônimos só conseguem carregá-las enquanto o portfólio está publicado; despublicar tira esse acesso de novo. O estúdio em Next.js tem um editor visual de seções com salvamento automático e histórico de revisões.",
        features: [
          "Biblioteca de obras com upload de JPEG/PNG/WebP, legendas, texto alternativo e destaques",
          "Galerias e páginas com reordenação, e um editor visual de seções com desfazer/refazer",
          "Prévia privada do rascunho, publicar e despublicar (o que também tira o acesso público às imagens)",
          "Histórico de revisões que pode ser restaurado",
          "Isolamento entre artistas, limites por plano e assinatura (por enquanto testada com um provedor de pagamento simulado)",
          "Testes de integração e testes de navegador com Playwright para os principais fluxos do artista",
        ],
      },
      ja: {
        title: "Artists Portfolio Maker",
        short: "イラストレーターのためのポートフォリオ作成サービス（開発中）。",
        summary: "アーティストが作品をアップロードし、ギャラリーやページにまとめ、テンプレートで見た目を整えて、自分のポートフォリオサイトを公開できるプラットフォームです。Next.js のスタジオと、PostgreSQL を使う Fastify のAPIからなる TypeScript のモノレポです。いちばん新しいプロジェクトで、中心となる機能はローカルで動いてテストもありますが、決済・メール・ホスティングの本番設定が残っているので、まだ本番公開はできません。",
        problem: "アーティストには、Webデザインを学ばなくても作品をきれいに見せられるポートフォリオが必要です。そして、まだ公開していない画像は、本人が決めるまで非公開のままでなければいけません。",
        solution: "APIはドメインごとのモジュール（認証、テナント、メディア、ポートフォリオ、課金…）に分かれていて、すべてのクエリがそのアーティスト自身のスペースに限定されます。画像はローカルディスクか Cloudflare R2 などの S3 互換ストレージに非公開で保存され、ポートフォリオが公開されている間だけ匿名の訪問者が読み込めます。非公開に戻すと、そのアクセスもなくなります。Next.js のスタジオには自動保存と履歴つきのビジュアルセクションエディターがあります。",
        features: [
          "JPEG/PNG/WebP のアップロード、キャプション、代替テキスト、おすすめ作品の設定ができる作品ライブラリ",
          "並べ替えできるギャラリーとページ、元に戻す／やり直しつきのビジュアルセクションエディター",
          "下書きの非公開プレビュー、公開と非公開（非公開にすると画像の公開アクセスも消える）",
          "復元できるリビジョン履歴",
          "テナントの分離、プランごとの上限、サブスクリプション課金（現在はモックの決済サービスでテスト）",
          "結合テストと、主なアーティストの操作を確かめる Playwright のブラウザテスト",
        ],
      },
    },
  },
  {
    slug: "portfolio-desktop", category: "fullstack", tone: "pink", icon: "layers",
    tags: ["React", "TypeScript", "Cloudflare Workers", "D1 (SQLite)", "Turnstile", "GitHub Actions"],
    github: "https://github.com/ren-angel/Portfolio", live: null, thumb: null,
    gallery: [portfolioHome, portfolioTabs, portfolioFeats],
    text: {
      en: {
        title: "This very desktop",
        short: "How this website works.",
        summary: "This portfolio is a tiny pretend operating system: React + TypeScript on GitHub Pages, with a real back-end for the guestbook running on Cloudflare Workers and a D1 (SQLite) database. It's all built to fit in free tiers, so keeping it online costs nothing.",
        problem: "I wanted a portfolio that feels like me and still shows real back-end work, without paying for a server just to keep a guestbook alive.",
        solution: "The front-end is a static site, so GitHub Pages hosts it for free. Windows live in a small reducer (open, focus, minimize, maximize, close) that is unit-tested. The guestbook talks to a separate Worker API that validates every field on the server, checks a Turnstile captcha, rate-limits by a salted IP hash and stores entries (and drawings as small PNGs) in D1. Messages are private: only I can read them, and each visitor can see their own messages plus my replies.",
        features: [
          "Draggable, resizable windows with minimize, maximize and a taskbar",
          "Light, night and system themes built from CSS variables, plus wallpapers",
          "Mini Paint: draw, then attach the picture to a guestbook entry",
          "Private guestbook: only I can read messages, and my replies show up for the sender",
          "Guestbook API: server-side validation, captcha, rate limits, PNG checks",
          "A little terminal with safe built-in commands, and a window with my latest public GitHub repos",
          "Deep links like #projects/portfolio-desktop, with back/forward support",
          "English, Portuguese and Japanese",
        ],
      },
      pt: {
        title: "Este desktop",
        short: "Como este site funciona.",
        summary: "Este portfólio é um sisteminha operacional de mentira: React + TypeScript no GitHub Pages, com um back-end de verdade para o livro de visitas rodando em Cloudflare Workers e um banco D1 (SQLite). Tudo foi feito para caber nos planos gratuitos, então mantê-lo no ar não custa nada.",
        problem: "Eu queria um portfólio com a minha cara que ainda mostrasse back-end de verdade, sem pagar um servidor só para manter um livro de visitas vivo.",
        solution: "O front-end é um site estático, então o GitHub Pages hospeda de graça. As janelas vivem num reducer pequeno (abrir, focar, minimizar, maximizar, fechar) com testes unitários. O livro de visitas conversa com uma API separada num Worker que valida cada campo no servidor, confere um captcha Turnstile, limita o envio por um hash de IP com salt e guarda as mensagens (e desenhos como PNGs pequenos) no D1. As mensagens são privadas: só eu leio, e cada visitante vê as próprias mensagens e as minhas respostas.",
        features: [
          "Janelas arrastáveis e redimensionáveis com minimizar, maximizar e barra de tarefas",
          "Temas claro, noturno e do sistema feitos com variáveis CSS, além de papéis de parede",
          "Mini Paint: desenhe e anexe o desenho a uma mensagem do livro de visitas",
          "Livro de visitas privado: só eu leio as mensagens, e minhas respostas aparecem para quem enviou",
          "API do livro de visitas: validação no servidor, captcha, limite de envios, checagem de PNG",
          "Um terminalzinho com comandos próprios e seguros, e uma janela com meus repositórios públicos mais recentes do GitHub",
          "Links diretos como #projects/portfolio-desktop, com voltar/avançar do navegador",
          "Inglês, português e japonês",
        ],
      },
      ja: {
        title: "このデスクトップ",
        short: "このサイトのしくみ。",
        summary: "このポートフォリオは小さな「なんちゃってOS」です。React + TypeScript を GitHub Pages で公開し、ゲストブックには Cloudflare Workers と D1（SQLite）で動く本物のバックエンドがあります。すべて無料枠に収まるように作ったので、維持費はかかりません。",
        problem: "自分らしいポートフォリオにしたい。でも本物のバックエンドも見せたいし、ゲストブックのためだけにサーバー代は払いたくありませんでした。",
        solution: "フロントエンドは静的サイトなので GitHub Pages で無料公開。ウィンドウは小さな reducer（開く・フォーカス・最小化・最大化・閉じる）で管理し、ユニットテスト付きです。ゲストブックは別の Worker API と通信し、サーバー側で全項目を検証、Turnstile の認証、ソルト付きIPハッシュでの回数制限を行い、メッセージと小さなPNGの絵を D1 に保存します。メッセージは非公開で、読めるのは私だけ。訪問者は自分のメッセージと私の返信を見られます。",
        features: [
          "ドラッグ・リサイズ・最小化・最大化できるウィンドウとタスクバー",
          "CSS変数で作ったライト／ナイト／システム連動のテーマと壁紙",
          "ミニペイント：描いた絵をゲストブックに添付できる",
          "非公開ゲストブック：メッセージを読めるのは私だけ、返信は送り主に表示",
          "ゲストブックAPI：サーバー側検証、認証、回数制限、PNGチェック",
          "安全な専用コマンドだけの小さなターミナルと、GitHub の最新の公開リポジトリを表示するウィンドウ",
          "#projects/portfolio-desktop のような直接リンク（戻る／進む対応）",
          "英語・ポルトガル語・日本語",
        ],
      },
    },
  },
  {
    slug: "timbre-studio", category: "mobile", tone: "cream", icon: "mic",
    tags: ["Kotlin", "Jetpack Compose", "Android audio", "DSP", "ONNX Runtime", "RVC"],
    github: null, live: null, thumb: null,
    gallery: [timbreMain, timbreVoice, timbreLibrary],
    text: {
      en: {
        title: "Timbre Studio",
        short: "An Android voice changer for chatting and cosplay.",
        summary: "An Android app (it started as Villager Voice Changer) that changes your voice live, right on the phone, with no server. It's made for conversation and cosplay: pick a voice, talk, and it comes out of the speaker in real time. It's a working prototype that I test on a budget phone (a Moto E13), and I'd like to publish it on the Play Store.",
        problem: "Neural voice conversion sounds great, but it's far too heavy to run live on a cheap phone, and a cosplayer needs something that keeps working in their pocket, offline, without a laptop.",
        solution: "The live path is a DSP engine I wrote in Kotlin: it reads the microphone with AudioRecord, re-synthesizes the voice with the target timbre and plays it back with AudioTrack inside a foreground service. The heavier RVC conversion (ContentVec, pitch estimation and an ONNX synthesizer) runs offline on short clips in an isolated process, so a crash or memory spike there can't take the live audio down with it. The app suggests a starting quality profile based on the phone's RAM and CPU cores.",
        features: [
          "Real-time voice transformation on the device, with pitch, timbre, mix and noise-reduction controls",
          "Voice library: import voice profiles or extract a new one from a short WAV recording",
          "Offline RVC conversion with ONNX Runtime in an isolated process",
          "Quality profiles suggested from the phone's RAM and CPU cores",
          "A soundboard for WAV clips and a cosplay mode that locks the controls",
          "Tested on a real low-end phone, with the latency and performance numbers written down",
        ],
      },
      pt: {
        title: "Timbre Studio",
        short: "Um modificador de voz para Android, para conversar e fazer cosplay.",
        summary: "Um app Android (que começou como Villager Voice Changer) que transforma a sua voz ao vivo, no próprio celular, sem servidor. Ele foi feito para conversa e cosplay: escolha uma voz, fale, e ela sai pelo alto-falante em tempo real. É um protótipo funcional que testo num celular simples (um Moto E13), e quero publicá-lo na Play Store.",
        problem: "Conversão de voz com redes neurais fica ótima, mas é pesada demais para rodar ao vivo num celular barato, e quem faz cosplay precisa de algo que funcione no bolso, offline, sem notebook.",
        solution: "O caminho ao vivo é um motor de DSP que escrevi em Kotlin: ele lê o microfone com AudioRecord, ressintetiza a voz com o timbre escolhido e toca com AudioTrack dentro de um foreground service. A conversão mais pesada por RVC (ContentVec, estimativa de pitch e um sintetizador ONNX) roda offline, em trechos curtos, num processo isolado, então se ela travar ou estourar a memória o áudio ao vivo continua. O app sugere um perfil de qualidade inicial pela RAM e pelos núcleos do celular.",
        features: [
          "Transformação de voz em tempo real no aparelho, com controles de pitch, timbre, mistura e redução de ruído",
          "Biblioteca de vozes: importe perfis ou extraia um novo de uma gravação WAV curta",
          "Conversão por RVC offline com ONNX Runtime num processo isolado",
          "Perfis de qualidade sugeridos pela RAM e pelos núcleos do celular",
          "Soundboard para clipes WAV e um modo cosplay que trava os controles",
          "Testado num celular simples de verdade, com os números de latência e desempenho documentados",
        ],
      },
      ja: {
        title: "Timbre Studio",
        short: "おしゃべりやコスプレのための Android ボイスチェンジャー。",
        summary: "スマホの中だけで、サーバーなしで声をリアルタイムに変える Android アプリです（最初は Villager Voice Changer という名前でした）。会話やコスプレ向けで、声を選んで話すと、変わった声がその場でスピーカーから出ます。格安スマホ（Moto E13）で試している動くプロトタイプで、いつか Play ストアで公開したいと思っています。",
        problem: "ニューラルネットワークの声質変換は音がいい反面、格安スマホでリアルタイムに動かすには重すぎます。コスプレ中は、ノートPCなしでポケットの中のスマホだけで、オフラインでも動き続けてほしいものです。",
        solution: "リアルタイムの部分は Kotlin で書いた自前の DSP エンジンです。AudioRecord でマイクを読み、目標の声色で声を合成し直して、フォアグラウンドサービスの中で AudioTrack から再生します。重い RVC 変換（ContentVec、ピッチ推定、ONNX の合成器）は短いクリップに対してオフラインで、別プロセスの中で動かすので、そちらが落ちたりメモリを使いすぎたりしても、リアルタイムの音声は止まりません。スマホのRAMとCPUコア数から、最初の品質プロファイルを提案します。",
        features: [
          "端末上でのリアルタイム音声変換（ピッチ、声色、ミックス、ノイズ低減を調整可能）",
          "ボイスライブラリ：プロファイルの読み込みや、短いWAV録音からの新しい声の抽出",
          "ONNX Runtime を使ったオフラインの RVC 変換（別プロセスで実行）",
          "スマホのRAMとCPUコア数から提案する品質プロファイル",
          "WAVクリップのサウンドボードと、操作をロックできるコスプレモード",
          "実際の低価格スマホでテストし、遅延や性能の数値を記録",
        ],
      },
    },
  },
  {
    slug: "3d-model-viewer", category: "frontend", tone: "pink", icon: "box",
    tags: ["JavaScript", "three.js", "Vite", "GitHub Pages"],
    github: "https://github.com/ren-angel/3D-Model-Viewer-Simple-", live: "https://ren-angel.github.io/3D-Model-Viewer-Simple-/", thumb: null,
    gallery: [modelViewer],
    text: {
      en: {
        title: "3D Model Viewer",
        short: "A tiny web viewer for FBX and OBJ models.",
        summary: "A small, fast website for showing 3D models in the browser. You put the model files in a folder, list them in a JSON file and push, and GitHub Actions publishes the viewer to GitHub Pages. A small side project built in a couple of days.",
        problem: "Models exported from other tools often point to textures with the wrong folders or formats (like .dds), so they show up untextured or don't load at all.",
        solution: "The viewer uses the three.js loaders for FBX, OBJ and MTL, and matches textures by file name only, ignoring folders, extension and letter case. So if a model asks for 0.dds, it uses 0.png or 0.tga from the model's folder instead. Each model is a tab that loads only the first time it's opened, and anything still missing is listed on the page.",
        features: [
          "FBX and OBJ + MTL models with TGA, PNG, JPG or WebP textures",
          "Texture matching by name, with a list of anything that couldn't be found",
          "Tabs that load each model only when they're first opened",
          "A link for each model that opens it directly",
          "Per-material transparency settings in viewer.json",
          "Orbit controls and optional auto-rotate",
          "Automatic deploy to GitHub Pages with GitHub Actions",
        ],
      },
      pt: {
        title: "Visualizador 3D",
        short: "Um visualizador web pequenininho para modelos FBX e OBJ.",
        summary: "Um site pequeno e rápido para mostrar modelos 3D no navegador. Você coloca os arquivos do modelo numa pasta, lista num JSON e dá push, e o GitHub Actions publica o visualizador no GitHub Pages. Um projeto paralelo pequeno, feito em poucos dias.",
        problem: "Modelos exportados de outras ferramentas muitas vezes apontam para texturas com pastas ou formatos errados (como .dds), então aparecem sem textura ou nem carregam.",
        solution: "O visualizador usa os loaders do three.js para FBX, OBJ e MTL e encontra as texturas só pelo nome do arquivo, ignorando pastas, extensão e maiúsculas. Então, se o modelo pede 0.dds, ele usa o 0.png ou o 0.tga da pasta do modelo. Cada modelo é uma aba que só carrega na primeira vez que é aberta, e o que ainda faltar aparece listado na página.",
        features: [
          "Modelos FBX e OBJ + MTL com texturas TGA, PNG, JPG ou WebP",
          "Texturas encontradas pelo nome, com a lista do que não foi achado",
          "Abas que carregam cada modelo só na primeira vez que são abertas",
          "Um link para cada modelo que abre ele direto",
          "Transparência configurável por material no viewer.json",
          "Controles de órbita e rotação automática opcional",
          "Deploy automático no GitHub Pages com GitHub Actions",
        ],
      },
      ja: {
        title: "3Dモデルビューア",
        short: "FBX と OBJ のための小さなWebビューア。",
        summary: "ブラウザで3Dモデルを見せるための、小さくて軽いWebサイトです。モデルのファイルをフォルダに入れて JSON に書き、push するだけで、GitHub Actions が GitHub Pages にビューアを公開します。数日で作った小さなサイドプロジェクトです。",
        problem: "ほかのツールから書き出したモデルは、テクスチャのフォルダや形式（.dds など）が合っていないことが多く、テクスチャなしで表示されたり、読み込めなかったりします。",
        solution: "three.js の FBX・OBJ・MTL ローダーを使い、テクスチャはファイル名だけで探します（フォルダ、拡張子、大文字・小文字は無視）。モデルが 0.dds を求めていても、同じフォルダの 0.png や 0.tga を代わりに使います。モデルごとにタブがあり、初めて開いたときだけ読み込みます。見つからなかったものはページに一覧で表示されます。",
        features: [
          "TGA・PNG・JPG・WebP テクスチャつきの FBX、OBJ + MTL モデルに対応",
          "名前でテクスチャを探し、見つからなかったものを一覧表示",
          "初めて開いたときだけモデルを読み込むタブ",
          "モデルごとに、直接開けるリンク",
          "viewer.json でマテリアルごとに透明度を設定",
          "オービット操作と、任意の自動回転",
          "GitHub Actions で GitHub Pages へ自動デプロイ",
        ],
      },
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
