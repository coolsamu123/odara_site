import {
  Database, FileText, Cloud, Globe, Code, Filter,
  ArrowRightLeft, Play, Clock, Activity, GitBranch,
  Bot, ShieldCheck, Zap, Layers
} from 'lucide-react';
import { NodeType, Feature, AIExample, Persona, Tutorial, Testimonial } from './types';

export const PRODUCT_NAV = [
  { label: 'AI Power', href: '#ai' },
  { label: 'Platform', href: '#features' },
  { label: 'API & Flexibility', href: '#api' },
  { label: 'Integrations', href: '#nodes' },
];

export const NAV_ITEMS = [
  // Order shown after the "Product" dropdown (rendered first by Layout.tsx):
  // Product · Download · Tutorials · Docs · Community
  { label: 'Download', href: '/download', isRoute: true },
  { label: 'Tutorials', href: '/tutorials', isRoute: true },
  { label: 'Docs', href: '/docs', isRoute: true },
  { label: 'Community', href: '/community', isRoute: true },
];

// Tutorials shown on the landing teaser (max 4) and the full /tutorials page.
// To add a video: copy its YouTube ID (the part after watch?v=) into youtubeId.
export const TUTORIALS: Tutorial[] = [
  // ----- Videos (rendered first on the Tutorials page) -----
  {
    id: 'vid_magic_file',
    youtubeId: 'mpL1uTlWkhw',
    title: 'Magic File — read ANY format with one node',
    description: 'CSV, JSON, Parquet, Excel — even a file with no extension. One node detects the format from the content and reads it. Something no other ETL tool does.',
  },
  {
    id: 'tut_1',
    youtubeId: 'cH2zq1-3_y8',
    title: 'Build Your First Data Pipeline in 3 Minutes',
    description: 'Go from zero to a running pipeline in the visual editor — connect a source, transform, and load.',
  },
  {
    id: 'tut_2',
    youtubeId: '72lf7JAyWAU',
    title: 'Describe a Pipeline in Plain English, Let AI Build It',
    description: 'Type what you want in natural language and watch Odara generate the SQL, Python, and nodes for you.',
  },
  {
    id: 'tut_3',
    youtubeId: 'REUJlRs92js',
    title: 'PostgreSQL to CSV: A Pipeline You’d Actually Ship',
    description: 'A real-world extract-and-export flow from a Postgres database to a clean CSV file.',
  },
  {
    id: 'tut_4',
    youtubeId: '5Dp-SVQ2kBE',
    title: 'SQL + Python in One Pipeline, Zero-Copy via Arrow',
    description: 'Mix SQL and Python transforms in a single pipeline with zero-copy data hand-off powered by Apache Arrow.',
  },
  // ----- Walkthroughs (Magic File first) -----
  {
    id: 'magic-file',
    kind: 'walkthrough',
    slug: 'magic-file',
    cover: 'screenshots/01-canvas-overview.png',
    estimatedMin: 10,
    title: 'Magic File + Iterate — one pipeline for a folder of mixed formats',
    description: 'List a folder with FileList, loop per file with Iterate, auto-detect CSV/Excel/JSON with Magic File, and append everything into one tagged CSV. Files included.',
  },
  {
    id: 'documentation',
    kind: 'walkthrough',
    slug: 'documentation',
    cover: 'screenshots/02-project-overview.png',
    estimatedMin: 14,
    title: 'Documentation — auto-generate, export, and publish your project docs',
    description: 'Odara reads your whole project and turns it into living docs — diagrams, node configs, and connections. Browse it, export a print-ready PDF, or publish an access-controlled shareable site.',
  },
  {
    id: 'api-tour',
    kind: 'walkthrough',
    slug: 'api-tour',
    cover: 'screenshots/01-canvas-api-built.png',
    estimatedMin: 12,
    title: 'The API — build, run, and orchestrate pipelines without the UI',
    description: 'Everything the UI does, over REST: create a pipeline as JSON, let the AI build one from a sentence, stream a headless run, infer schemas, and orchestrate with Maestro. Real curl, copy-pasteable.',
  },
  {
    id: 'ai-sql',
    kind: 'walkthrough',
    slug: 'ai-sql',
    cover: 'screenshots/05-canvas-generated.png',
    estimatedMin: 12,
    title: 'AI Assistant (SQL) — describe a pipeline, get a working SQL transform',
    description: 'Type one sentence and the AI Assistant plans and builds the whole pipeline — source, a SQL Transform with a window function, and a target — that you run as-is. Files included.',
  },
  {
    id: 'ai-python',
    kind: 'walkthrough',
    slug: 'ai-python',
    cover: 'screenshots/05-canvas-generated.png',
    estimatedMin: 12,
    title: 'AI Assistant (Python) — describe a pipeline, get a pandas transform',
    description: 'Describe an enrichment and the AI builds a CSV → pandas transform (quartiles, z-score outliers, labels) → Excel pipeline. Files included.',
  },
  {
    id: 'monitor',
    kind: 'walkthrough',
    slug: 'monitor',
    cover: 'screenshots/03-monitor-overview.png',
    estimatedMin: 7,
    title: 'Monitor — see what your pipelines are doing',
    description: 'A step-by-step tour of Monitor — the page where every run shows up. Filter, search, re-run, and read execution details.',
  },
  {
    id: 'schedule',
    kind: 'walkthrough',
    slug: 'schedule',
    cover: 'screenshots/01-overview.png',
    estimatedMin: 7,
    title: 'Schedule — run your pipelines automatically',
    description: 'Set up daily, hourly, or custom cron schedules; configure SMTP-based email alerts; pause, run-now, or delete.',
  },
  {
    id: 'admin',
    kind: 'walkthrough',
    slug: 'admin',
    cover: 'screenshots/02-users-list.png',
    estimatedMin: 8,
    title: 'Admin — manage users, roles, and permissions',
    description: 'Add users, change role assignments inline, deactivate vs delete, browse system roles, build custom roles from the permission catalog.',
  },
  {
    id: 'sql-join',
    kind: 'walkthrough',
    slug: 'sql-join',
    cover: 'screenshots/01-canvas-overview.png',
    estimatedMin: 10,
    title: 'SQL Join — combine two CSVs and load into Postgres',
    description: 'Wire two CSV sources into one SQL Transform, JOIN on a key, write the joined rows into a Postgres table. Files included.',
  },
  {
    id: 'python-email',
    kind: 'walkthrough',
    slug: 'python-email',
    cover: 'screenshots/01-canvas-overview.png',
    estimatedMin: 10,
    title: 'Python external + Email — call a script, mail the result',
    description: 'Read sales.csv, call an external transform.py with pandas, write the summary, and send it as an email attachment. Files + script included.',
  },
  {
    id: 'star-schema',
    kind: 'walkthrough',
    slug: 'star-schema',
    cover: 'screenshots/04-maestro-canvas.png',
    estimatedMin: 15,
    title: 'Star Schema → Snowflake — load with Maestro',
    description: 'Model a star schema (3 dims + 1 fact), build a Maestro from scratch to load all four into Snowflake in parallel, then JOIN the star at query time.',
  },
];

export const AI_EXAMPLES: AIExample[] = [
  {
    id: 'compose_1',
    label: 'Build a Full Pipeline',
    prompt: "Read orders from PostgreSQL, keep completed, total revenue by category & month, write to Snowflake",
    code: "-- The AI plans every node, then writes the SQL:\nSELECT category, month, order_count, revenue,\n       SUM(revenue) OVER (PARTITION BY category ORDER BY month) AS running_total_revenue\nFROM ( SELECT category, DATE_TRUNC('month', order_date) AS month,\n              COUNT(*) AS order_count, SUM(amount) AS revenue\n       FROM input GROUP BY category, DATE_TRUNC('month', order_date) ) sub\nORDER BY category, month",
    language: 'sql',
    pipelineScreenshot: './screenshots/ai/compose-pipeline.png',
  },
  {
    id: 'sql_1',
    label: 'Remove Duplicates',
    prompt: "Pull customers from MongoDB, remove duplicates by email, load into Postgres",
    code: "SELECT DISTINCT ON (email) * \nFROM input \nORDER BY email, created_at DESC",
    language: 'sql',
    pipelineScreenshot: './screenshots/ai/sql1-pipeline.png',
  },
  {
    id: 'sql_2',
    label: 'Sales Aggregation',
    prompt: "Aggregate total sales by region for Q4 from S3, write a CSV",
    code: "SELECT region, SUM(amount) as total \nFROM input \nWHERE quarter = 4 \nGROUP BY region",
    language: 'sql',
    pipelineScreenshot: './screenshots/ai/sql2-pipeline.png'
  },
  {
    id: 'sql_3',
    label: 'Join Tables',
    prompt: "Join MySQL customers with their orders from a REST API",
    code: "SELECT c.*, o.order_id, o.amount \nFROM customers c \nLEFT JOIN orders o \nON c.id = o.customer_id",
    language: 'sql',
    pipelineScreenshot: './screenshots/ai/sql3-pipeline.png',
  },
  {
    id: 'py_1',
    label: 'Parse JSON',
    prompt: "Parse JSON from the payload column of a REST feed",
    code: "import json\n\ndef transform(row):\n    try:\n        data = json.loads(row['payload'])\n        return { **row, **data }\n    except json.JSONDecodeError:\n        return { **row, 'error': 'invalid_json' }",
    language: 'python',
    pipelineScreenshot: './screenshots/ai/py1-pipeline.png',
  },
  {
    id: 'py_2',
    label: 'Extract Domains',
    prompt: "Extract email domains from a Snowflake users table",
    code: "import re\n\ndef transform(row):\n    email = row.get('email', '')\n    if not email:\n        return { **row, 'domain': None }\n    match = re.search(r'@([\\w.-]+)', email)\n    return { **row, 'domain': match.group(1) if match else None }",
    language: 'python',
    pipelineScreenshot: './screenshots/ai/py2-pipeline.png',
  }
];

export const PERSONAS: Persona[] = [
  {
    role: "Data Engineers",
    description: "Build production-ready pipelines faster with AI assistance.",
    benefits: ["Focus on architecture, let AI handle boilerplate", "70+ pre-built connectors", "Rust-powered performance"]
  },
  {
    role: "Business Analysts",
    description: "Self-service data integration without writing code.",
    benefits: ["Transform data naturally", "Automate recurring reports", "Merge sources visually"]
  },
  {
    role: "Data Analysts",
    description: "Connect directly to databases and spreadsheets.",
    benefits: ["Create reusable workflows", "No need to wait for IT", "Clean messy spreadsheets"]
  },
  {
    role: "Startup Teams",
    description: "Move fast without hiring specialized ETL developers.",
    benefits: ["Connect entire data stack in days", "Scale from prototype to production", "Free Community edition"]
  },
  {
    role: "Students & Trainees",
    description: "Learn ETL concepts with a modern, visual tool.",
    benefits: ["AI explains code", "Portfolio-ready projects", "No setup complexity"]
  },
  {
    role: "IT Administrators",
    description: "Deploy a single platform for all data integration needs.",
    benefits: ["Monitor jobs centrally", "Git integration", "No licensing costs"]
  }
];

export const NODE_DATA: NodeType[] = [
  // Sources
  { id: 'src_1', category: 'Source', name: 'PostgreSQL', description: 'High-performance SQL query source', icon: Database },
  { id: 'src_2', category: 'Source', name: 'S3 Source', description: 'Download and process from AWS S3', icon: Cloud },
  { id: 'src_3', category: 'Source', name: 'Magic File', description: 'Auto-detect CSV, JSON, Parquet', icon: FileText },
  { id: 'src_4', category: 'Source', name: 'REST API', description: 'Paginated API ingestion', icon: Globe },
  { id: 'src_5', category: 'Source', name: 'Mongo DB', description: 'Collection querying', icon: Database },
  { id: 'src_6', category: 'Source', name: 'Snowflake', description: 'Enterprise data warehouse source', icon: Database },

  // Transforms
  { id: 'tr_1', category: 'Transform', name: 'SQL Transform', description: 'DataFusion powered SQL transformations', icon: Code },
  { id: 'tr_2', category: 'Transform', name: 'Python', description: 'Arbitrary Python code execution', icon: Code },
  { id: 'tr_3', category: 'Transform', name: 'Filter', description: 'High-speed row filtering', icon: Filter },
  { id: 'tr_4', category: 'Transform', name: 'Visual Mapper', description: 'N-input to M-output visual mapping', icon: Layers },

  // Targets
  { id: 'tg_1', category: 'Target', name: 'Postgres Target', description: 'INSERT, UPSERT, MERGE support', icon: Database },
  { id: 'tg_2', category: 'Target', name: 'S3 Upload', description: 'Stream results to S3 buckets', icon: Cloud },
  { id: 'tg_3', category: 'Target', name: 'Parquet Write', description: 'Optimized columnar storage', icon: FileText },
  { id: 'tg_4', category: 'Target', name: 'Email', description: 'SMTP notification dispatch', icon: Globe },
];

export const FEATURES: Feature[] = [
  {
    title: 'AI-First Code Generation',
    description: 'Describe transformations in plain English. Odara generates the SQL, Python, or entire pipeline for you. Powered by Gemini, OpenAI, and Anthropic.',
    icon: Bot,
    tags: ['Gemini', 'OpenAI', 'Anthropic']
  },
  {
    title: 'Visual Pipeline Editor',
    description: 'Drag-and-drop interface with multi-tab support, auto-save, and 50-state undo/redo history.',
    icon: Layers,
    tags: ['React Flow', 'Canvas']
  },
  {
    title: 'Monitoring',
    description: "Odara provides comprehensive monitoring and real-time observability for your data workflows. Track pipeline execution, node-level performance, and system health with detailed logs and metrics.",
    icon: Activity,
    tags: ['Observability', 'Metrics']
  },
  {
    title: 'Maestros',
    description: 'Complex workflow orchestration supporting parallel, series, and conditional execution paths.',
    icon: ArrowRightLeft,
    tags: ['Workflow', 'Logic']
  },
  {
    title: 'Data Quality Framework',
    description: 'Built-in testing for NULLs, uniqueness, regex matching, and custom expressions.',
    icon: ShieldCheck,
    tags: ['Validation', 'Trust']
  },
  {
    title: 'Rust Core',
    description: 'Powered by Axum, DataFusion, and Tokio for blazing fast, memory-safe execution.',
    icon: Zap,
    tags: ['Performance', 'Safety']
  }
];

export const COMPARISON_DATA = [
  { feature: 'Visual Pipeline Editor', community: true, enterprise: true },
  { feature: '70+ Built-in Connectors', community: true, enterprise: true },
  { feature: 'Maestros', community: true, enterprise: true },
  { feature: 'AI Code Generation', community: true, enterprise: true },
  { feature: 'SSO / SAML Integration', community: false, enterprise: true },
  { feature: 'Role-Based Access Control', community: false, enterprise: true },
  { feature: 'Audit Logging', community: false, enterprise: true },
  { feature: 'Priority Support', community: false, enterprise: true },
  { feature: 'VPC Peering', community: false, enterprise: true },
];

// NOTE: quotes below are PLACEHOLDER / fictitious — to be replaced with the
// real testimonials. The people have confirmed; the wording is provisional.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Mauro Porcaro',
    role: 'Data Management Evangelist',
    avatar: 'testimonials/mauro-porcaro.jpg',
    tags: ['Early Adopter', 'Contributor'],
    quote:
      "Odara is the first ETL tool where the AI genuinely understands data management. I described the pipeline in plain English and it produced exactly what I'd have built by hand — connectors, transforms and all.",
  },
  {
    name: 'Thomas Letellier',
    role: 'Senior Data Tech Lead',
    avatar: 'testimonials/thomas-letellier-2.jpg',
    tags: ['Early Adopter', 'Contributor'],
    linkedin: 'https://www.linkedin.com/in/thomas-letellier-8b482a65',
    quote:
      'We swapped a tangle of cron jobs and one-off scripts for Odara in an afternoon. Pipelines as JSON means they live in Git and get reviewed like any other code.',
  },
  {
    name: 'Rodrigo Maruski Desideri',
    role: 'Senior Data Engineer',
    avatar: 'testimonials/rodrigo-maruski-desideri-2.jpg',
    tags: ['Early Adopter', 'Contributor'],
    linkedin: 'https://www.linkedin.com/in/rodrigo-maruski-desideri',
    // REAL quote — original PT: "O Odara me ajudou muito em um projeto de
    // integração de dados. A instalação e configuração foram simples, e
    // consegui construir e colocar os pipelines em produção rapidamente, mesmo
    // sem treinamento prévio. A ferramenta é intuitiva, prática e o suporte de
    // IA facilita ainda mais a criação e manutenção dos processos."
    quote:
      'Odara helped me a lot on a data-integration project. Installation and setup were simple, and I was able to build and ship pipelines to production quickly — even without any prior training. The tool is intuitive and practical, and the AI support makes creating and maintaining the processes even easier.',
  },
  {
    name: 'Andre Nery',
    role: 'Data Manager',
    avatar: 'testimonials/andre-nery.jpg',
    tags: ['Early Adopter', 'Contributor'],
    // REAL quote (provided in English).
    quote:
      'Most ETL platforms force you to choose between ease of use and computational power. Odara breaks that paradigm. By pairing a blazing-fast, Arrow-native Rust engine with an AI assistant that actually understands data schemas without hallucinating, it eliminates friction and accelerates delivery. Robustly engineered, it is exactly what the modern data stack has been waiting for.',
  },
];