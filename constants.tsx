import {
  Database, FileText, Cloud, Globe, Code, Filter,
  ArrowRightLeft, Play, Clock, Activity, GitBranch,
  Bot, ShieldCheck, Zap, Layers
} from 'lucide-react';
import { NodeType, Feature, AIExample, Persona, Tutorial } from './types';

export const PRODUCT_NAV = [
  { label: 'AI Power', href: '#ai' },
  { label: 'Platform', href: '#features' },
  { label: 'API & Flexibility', href: '#api' },
  { label: 'Integrations', href: '#nodes' },
];

export const NAV_ITEMS = [
  { label: 'Docs', href: '/docs', isRoute: true },
  { label: 'Tutorials', href: '/tutorials', isRoute: true },
  { label: 'Community', href: '/community', isRoute: true },
  { label: 'Download', href: '/download', isRoute: true },
];

// Tutorials shown on the landing teaser (max 4) and the full /tutorials page.
// To add a video: copy its YouTube ID (the part after watch?v=) into youtubeId.
export const TUTORIALS: Tutorial[] = [
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
];

export const AI_EXAMPLES: AIExample[] = [
  {
    id: 'sql_1',
    label: 'Remove Duplicates',
    prompt: "Remove duplicate customers by email",
    code: "SELECT DISTINCT ON (email) * \nFROM input \nORDER BY email, created_at DESC",
    language: 'sql',
    pipelineScreenshot: './screenshots/ai/sql1-pipeline.png',
    codeScreenshot: './screenshots/ai/sql1-code.png'
  },
  {
    id: 'sql_2',
    label: 'Sales Aggregation',
    prompt: "Calculate total sales by region for Q4",
    code: "SELECT region, SUM(amount) as total \nFROM input \nWHERE quarter = 4 \nGROUP BY region",
    language: 'sql',
    pipelineScreenshot: './screenshots/ai/sql2-pipeline.png'
  },
  {
    id: 'sql_3',
    label: 'Join Tables',
    prompt: "Join customers with their orders",
    code: "SELECT c.*, o.order_id, o.amount \nFROM customers c \nLEFT JOIN orders o \nON c.id = o.customer_id",
    language: 'sql',
    pipelineScreenshot: './screenshots/ai/sql3-pipeline.png',
    codeScreenshot: './screenshots/ai/sql3-code.png'
  },
  {
    id: 'py_1',
    label: 'Parse JSON',
    prompt: "Parse JSON from the payload column",
    code: "import json\n\ndef transform(row):\n    try:\n        data = json.loads(row['payload'])\n        return { **row, **data }\n    except json.JSONDecodeError:\n        return { **row, 'error': 'invalid_json' }",
    language: 'python',
    pipelineScreenshot: './screenshots/ai/py1-pipeline.png',
    codeScreenshot: './screenshots/ai/py1-code.png'
  },
  {
    id: 'py_2',
    label: 'Extract Domains',
    prompt: "Extract email domains",
    code: "import re\n\ndef transform(row):\n    email = row.get('email', '')\n    if not email:\n        return { **row, 'domain': None }\n    match = re.search(r'@([\\w.-]+)', email)\n    return { **row, 'domain': match.group(1) if match else None }",
    language: 'python',
    pipelineScreenshot: './screenshots/ai/py2-pipeline.png',
    codeScreenshot: './screenshots/ai/py2-code.png'
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