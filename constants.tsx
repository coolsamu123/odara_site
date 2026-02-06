import { 
  Database, FileText, Cloud, Globe, Code, Filter, 
  ArrowRightLeft, Play, Clock, Activity, GitBranch, 
  Bot, ShieldCheck, Zap, Layers 
} from 'lucide-react';
import { NodeType, Feature, AIExample, Persona } from './types';

export const NAV_ITEMS = [
  { label: 'AI Power', href: '#ai' },
  { label: 'Platform', href: '#features' },
  { label: 'Use Cases', href: '#users' },
  { label: 'Integrations', href: '#nodes' },
  { label: 'Why Free?', href: '#community' },
];

export const AI_EXAMPLES: AIExample[] = [
  {
    id: 'sql_1',
    label: 'Remove Duplicates',
    prompt: "Remove duplicate customers by email",
    code: "SELECT DISTINCT ON (email) * \nFROM input \nORDER BY email, created_at DESC",
    language: 'sql'
  },
  {
    id: 'sql_2',
    label: 'Sales Aggregation',
    prompt: "Calculate total sales by region for Q4",
    code: "SELECT region, SUM(amount) as total \nFROM input \nWHERE quarter = 4 \nGROUP BY region",
    language: 'sql'
  },
  {
    id: 'sql_3',
    label: 'Join Tables',
    prompt: "Join customers with their orders",
    code: "SELECT c.*, o.order_id, o.amount \nFROM customers c \nLEFT JOIN orders o \nON c.id = o.customer_id",
    language: 'sql'
  },
  {
    id: 'py_1',
    label: 'Parse JSON',
    prompt: "Parse JSON from the payload column",
    code: "import json\n\ndef transform(row):\n    try:\n        data = json.loads(row['payload'])\n        return { **row, **data }\n    except json.JSONDecodeError:\n        return { **row, 'error': 'invalid_json' }",
    language: 'python'
  },
  {
    id: 'py_2',
    label: 'Extract Domains',
    prompt: "Extract email domains",
    code: "import re\n\ndef transform(row):\n    email = row.get('email', '')\n    if not email:\n        return { **row, 'domain': None }\n    match = re.search(r'@([\\w.-]+)', email)\n    return { **row, 'domain': match.group(1) if match else None }",
    language: 'python'
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
    description: 'Describe transformations in plain English. Odara generates the SQL, Python, or entire pipeline for you.',
    icon: Bot,
    tags: ['DeepSeek', 'GenAI']
  },
  {
    title: 'Visual Pipeline Editor',
    description: 'Drag-and-drop interface with multi-tab support, auto-save, and 50-state undo/redo history.',
    icon: Layers,
    tags: ['React Flow', 'Canvas']
  },
  {
    title: 'Maestro Orchestration',
    description: 'Complex workflow orchestration supporting parallel, series, and conditional execution paths.',
    icon: ArrowRightLeft,
    tags: ['Workflow', 'Logic']
  },
  {
    title: 'Pulse Streaming',
    description: 'Real-time event processing with Kafka, RabbitMQ support and windowing operators.',
    icon: Zap,
    tags: ['Real-time', 'Kafka']
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
    icon: Activity,
    tags: ['Performance', 'Safety']
  }
];

export const COMPARISON_DATA = [
    { feature: 'Visual Pipeline Editor', community: true, enterprise: true },
    { feature: '70+ Built-in Connectors', community: true, enterprise: true },
    { feature: 'Maestro Orchestration', community: true, enterprise: true },
    { feature: 'AI Code Generation', community: true, enterprise: true },
    { feature: 'Unlimited Users', community: true, enterprise: true },
    { feature: 'SSO / SAML Integration', community: false, enterprise: true },
    { feature: 'Role-Based Access Control', community: false, enterprise: true },
    { feature: 'Audit Logging', community: false, enterprise: true },
    { feature: 'Priority Support', community: false, enterprise: true },
    { feature: 'VPC Peering', community: false, enterprise: true },
];