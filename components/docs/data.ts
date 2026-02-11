import {
  Layout, Activity, FileText, Database, Cloud, Globe, Code, Filter,
  Layers, Zap, ArrowRightLeft, Play, Clock, Bot, ShieldCheck,
  Settings, FolderOpen, Search, Monitor, Upload, Download,
  RefreshCw, GitBranch, Terminal, Table, FileSpreadsheet, FileCode,
  Wifi, Server, HardDrive, Mail, Trash2, Copy, Edit3,
  BarChart3, Eye, BookOpen, Calendar, Hash,
  Repeat, Pause, Network, Boxes, Radio, Workflow
} from 'lucide-react';
import { DocSection, NodeEntry, DocSectionContent, DocFeature, Screenshot, ShortcutEntry } from './types';

// ─── Navigation Sections ───────────────────────────────────

export const DOC_SECTIONS: DocSection[] = [
  { id: 'editor', label: 'Visual Editor', icon: Layout, description: 'Drag-and-drop pipeline canvas' },
  { id: 'nodes', label: 'Node Catalog', icon: Boxes, description: '70+ built-in connectors' },
  { id: 'resources', label: 'Resources', icon: Database, description: 'Connections, storage & schemas' },
  { id: 'pipelines', label: 'Pipelines', icon: GitBranch, description: 'Create, run & preview pipelines' },
  { id: 'maestros', label: 'Maestros', icon: Workflow, description: 'Pipeline orchestration' },
  { id: 'pulses', label: 'Pulses', icon: Zap, description: 'Real-time streaming' },
  { id: 'dataquality', label: 'Data Quality', icon: ShieldCheck, description: 'Testing & validation framework' },
  { id: 'monitor', label: 'Monitor', icon: Activity, description: 'Execution tracking & logs' },
  { id: 'documentation', label: 'Built-in Docs', icon: BookOpen, description: 'Auto-generated documentation' },
  { id: 'scheduler', label: 'Scheduler', icon: Calendar, description: 'Cron-based scheduling', comingSoon: true },
];

// ─── Section Content ───────────────────────────────────────

export const SECTION_CONTENT: Record<string, DocSectionContent> = {
  editor: {
    overview: 'The Visual Pipeline Editor is the heart of Maestrio. Built on React Flow, it provides a fully interactive canvas where you drag, drop, and connect 70+ node types to build data pipelines visually. The editor supports multi-tab workflows, 50-state undo/redo history, auto-save, grid snapping, and real-time execution status overlays.',
    features: [
      { icon: Layout, title: 'Drag & Drop Canvas', description: 'Intuitive React Flow canvas with grid snapping, zoom controls, and minimap navigation.' },
      { icon: Layers, title: 'Multi-Tab Support', description: 'Work on multiple pipelines simultaneously with per-tab state preservation.' },
      { icon: RefreshCw, title: 'Undo / Redo', description: '50-state history stack — never lose work. Ctrl+Z / Ctrl+Shift+Z.' },
      { icon: Copy, title: 'Copy & Paste', description: 'Duplicate nodes and sub-graphs with Ctrl+C / Ctrl+V. Connections preserved.' },
      { icon: Eye, title: 'Real-Time Status', description: 'Execution status overlays on each node — see running, success, error states live.' },
      { icon: Bot, title: 'AI Assistant', description: 'Chat panel generates SQL, Python, or entire pipelines from natural language.' },
    ],
    screenshots: [
      { src: './screenshots/editor.png', alt: 'Visual Pipeline Editor', caption: 'The main canvas with drag-and-drop nodes and connection wires' },
      { src: './screenshots/docs/editor/pipeline-example.png', alt: 'Pipeline Example', caption: 'A multi-step ETL pipeline with source, transform, and target nodes' },
      { src: './screenshots/docs/editor/pipeline-complex.png', alt: 'Complex Pipeline', caption: 'Complex pipeline with branching logic and multiple outputs' },
    ],
    shortcuts: [
      { keys: 'Ctrl + Z', action: 'Undo' },
      { keys: 'Ctrl + Shift + Z', action: 'Redo' },
      { keys: 'Ctrl + C / V', action: 'Copy / Paste nodes' },
      { keys: 'Ctrl + A', action: 'Select all nodes' },
      { keys: 'Delete', action: 'Remove selected nodes' },
      { keys: 'Ctrl + S', action: 'Save pipeline' },
      { keys: 'Space + Drag', action: 'Pan canvas' },
      { keys: 'Scroll', action: 'Zoom in/out' },
    ],
  },

  nodes: {
    overview: 'Maestrio ships with 70+ pre-built nodes covering databases, cloud storage, file formats, REST APIs, FTP servers, streaming sources, and control flow. Each node has a dedicated configuration panel with schema introspection, preview capabilities, and inline validation.',
    features: [
      { icon: Database, title: '6 Database Connectors', description: 'PostgreSQL, MySQL, Oracle, SQL Server, MongoDB, Snowflake — source and target.' },
      { icon: Cloud, title: 'Cloud Storage', description: 'S3, Google Drive, Azure Blob — list, download, upload, copy, delete operations.' },
      { icon: Globe, title: 'REST & FTP', description: 'REST Source/Target with pagination and auth. FTP/SFTP/FTPS with list, get, put, rename, delete.' },
      { icon: FileText, title: 'File Formats', description: 'CSV, Excel, XML, JSON, Parquet — with Magic File auto-detection.' },
      { icon: Code, title: 'Transform Nodes', description: 'SQL (DataFusion), Python (subprocess), Filter, Mapper, Set Variable.' },
      { icon: ArrowRightLeft, title: 'Control Flow', description: 'Sleep, RunAfter, LoopWhile — orchestrate complex execution patterns.' },
    ],
    screenshots: [
      { src: './screenshots/editor.png', alt: 'Node Palette', caption: 'The sidebar node palette organized by category' },
    ],
  },

  resources: {
    overview: 'The Resources panel centralizes management of all external connections and schemas. Organize your data stores (database connections with table introspection), file storage (S3, Google Drive, Azure, FTP), schemas (CSV, Excel, JSON, XML), and runtime configuration (context variables, environments, folders).',
    features: [
      { icon: Database, title: 'Data Stores', description: 'Configure database connections with encrypted credentials. Test connectivity and introspect table schemas.' },
      { icon: Cloud, title: 'File Storage', description: 'S3 buckets, Google Drive folders, Azure containers, FTP/SFTP servers — all in one place.' },
      { icon: Table, title: 'Schemas', description: 'Define and reuse data schemas for CSV, Excel, JSON, and XML files.' },
      { icon: Settings, title: 'Runtime Config', description: 'Context variables, environment definitions, and folder management.' },
    ],
    screenshots: [
      { src: './screenshots/editor.png', alt: 'Resources Panel', caption: 'The Resources panel with Data Stores, File Storage, Schemas, and Runtime tabs' },
    ],
    subsections: [
      { title: 'Data Stores', content: 'Create and manage database connections. Each connection stores host, port, database name, username, and encrypted password. Supports test-connection validation and full schema introspection (tables, columns, types).' },
      { title: 'File Storage', content: 'Configure cloud storage and FTP connections. S3 requires access key, secret key, region, and bucket. Google Drive uses OAuth2 flow. Azure needs account name and access key. FTP supports plain, SFTP, and FTPS.' },
      { title: 'Schemas', content: 'Define reusable column schemas. Useful for CSV files without headers, XML mappings, or enforcing consistent types across pipelines.' },
      { title: 'Runtime', content: 'Manage context variables (key-value pairs available at runtime), environments (dev/staging/prod configurations), and working folders.' },
    ],
  },

  pipelines: {
    overview: 'Pipelines are the core unit of work in Maestrio. Each pipeline is a directed acyclic graph (DAG) of nodes that extract, transform, and load data. Create pipelines visually, configure each node through the Properties panel, preview intermediate results, and execute synchronously or with real-time SSE streaming.',
    features: [
      { icon: Play, title: 'One-Click Execution', description: 'Run pipelines synchronously or stream progress via SSE for real-time updates.' },
      { icon: Eye, title: 'Node Preview', description: 'Preview any node output without running the full pipeline — see data instantly.' },
      { icon: Layers, title: 'Multi-Tab Editing', description: 'Open multiple pipelines in tabs. Each tab preserves its own state and scroll position.' },
      { icon: Settings, title: 'Properties Panel', description: 'Rich configuration panel for every node type — SQL editors, file pickers, connection selectors.' },
      { icon: GitBranch, title: 'Version Tracking', description: 'Pipeline definitions stored in SQLite with full execution history.' },
      { icon: Bot, title: 'AI Generation', description: 'Describe your pipeline in plain English and let AI build it for you.' },
    ],
    screenshots: [
      { src: './screenshots/editor.png', alt: 'Pipeline Editor', caption: 'The pipeline editor with nodes, connections, and properties panel' },
      { src: './screenshots/docs/editor/pipeline-example.png', alt: 'Pipeline Running', caption: 'A pipeline during execution showing real-time node status' },
    ],
  },

  maestros: {
    overview: 'Maestros are the orchestration layer of Maestrio. They allow you to compose multiple pipelines into complex workflows with parallel execution, sequential chains, and conditional branching. Each Maestro step can call a pipeline, group steps in parallel or series, or use conditional logic to determine the execution path.',
    features: [
      { icon: Workflow, title: 'Visual Orchestration', description: 'Build multi-pipeline workflows with a dedicated Maestro canvas editor.' },
      { icon: Play, title: 'Parallel Execution', description: 'Run independent pipeline steps concurrently for maximum throughput.' },
      { icon: ArrowRightLeft, title: 'Conditional Branching', description: 'Route execution based on conditions — if/else logic for pipeline flows.' },
      { icon: Settings, title: 'Variable Passing', description: 'Pass context variables between pipeline steps in the orchestration.' },
      { icon: Activity, title: 'Execution Tracking', description: 'Monitor each step with individual status, duration, and error details.' },
      { icon: RefreshCw, title: 'Retry Logic', description: 'Automatic retry on failure with configurable policies.' },
    ],
    screenshots: [
      { src: './screenshots/docs/maestro/maestro-canvas.png', alt: 'Maestro Canvas', caption: 'The Maestro orchestration canvas with parallel and series steps' },
      { src: './screenshots/docs/maestro/maestro-example.png', alt: 'Maestro Example', caption: 'A multi-step Maestro workflow with conditional branching' },
    ],
    subsections: [
      { title: 'Step Types', content: 'Pipeline Call — executes a single pipeline. Parallel Group — runs multiple steps concurrently. Series Group — runs steps sequentially. Conditional — evaluates an expression to choose a branch.' },
      { title: 'Use Cases', content: 'Daily data refresh (extract → transform → load in sequence). Multi-source aggregation (parallel extracts, then merge). Conditional processing (route data based on quality checks).' },
    ],
  },

  pulses: {
    overview: 'Pulses bring real-time streaming capabilities to Maestrio. Connect to message brokers like Kafka, RabbitMQ, NATS, and MQTT, then apply operators like Map, Filter, FlatMap, Window, Aggregate, and Join to process events in real-time. Route results to databases, cloud storage, REST endpoints, or files.',
    features: [
      { icon: Radio, title: 'Streaming Sources', description: 'Kafka, RabbitMQ, NATS, MQTT — consume events from any message broker.' },
      { icon: Code, title: 'Stream Operators', description: 'Map, Filter, FlatMap, Window, Aggregate, Join — full stream processing toolkit.' },
      { icon: Database, title: 'Multiple Sinks', description: 'Route processed events to databases, cloud storage, REST APIs, or files.' },
      { icon: Activity, title: 'Real-Time Monitoring', description: 'Track throughput, latency, and error rates in the Monitor dashboard.' },
    ],
    screenshots: [
      { src: './screenshots/pulse.png', alt: 'Pulse Streaming', caption: 'The Pulse streaming canvas with Kafka source and processing operators' },
      { src: './screenshots/docs/pulse/pulse-canvas.png', alt: 'Pulse Canvas', caption: 'A Pulse pipeline with windowed aggregation' },
      { src: './screenshots/docs/pulse/pulse-example.png', alt: 'Pulse Example', caption: 'Real-time event processing with multiple sinks' },
    ],
    subsections: [
      { title: 'Sources', content: 'Kafka Consumer — subscribe to topics with consumer groups. RabbitMQ — consume from queues with acknowledgment. NATS — subject-based messaging. MQTT — IoT-friendly publish/subscribe.' },
      { title: 'Operators', content: 'Map — transform each event. Filter — drop events by condition. FlatMap — one-to-many expansion. Window — time-based or count-based batching. Aggregate — running computations. Join — combine two streams.' },
      { title: 'Sinks', content: 'Database sinks (all 6 supported DBs). Cloud storage (S3, GDrive, Azure). REST Target (POST/PUT with batching). File output (CSV, JSON, Parquet).' },
    ],
  },

  dataquality: {
    overview: 'The Data Quality framework in Maestrio lets you define validation rules on any node output to catch data issues before they propagate downstream. Tests run inline during pipeline execution — if a test fails, you can choose to abort the pipeline, log a warning, or route bad rows to a quarantine output. Every test result is recorded in the execution history for auditing and trend analysis.',
    features: [
      { icon: ShieldCheck, title: 'Not Null', description: 'Assert that specified columns contain no NULL values. Catches missing data before it reaches targets. Supports configurable threshold (e.g. allow up to 1% NULLs).' },
      { icon: Hash, title: 'Unique', description: 'Verify that a column or combination of columns contains only unique values. Detects duplicates that would violate primary key or business key constraints.' },
      { icon: Search, title: 'Regex Match', description: 'Validate that column values match a regular expression pattern. Useful for emails, phone numbers, postal codes, IDs, and any structured format.' },
      { icon: Filter, title: 'Range Check', description: 'Ensure numeric or date values fall within an expected range (min/max). Catches outliers, negative amounts, future dates, or impossible values.' },
      { icon: Code, title: 'Custom Expression', description: 'Write arbitrary SQL expressions for complex validations. Examples: cross-column checks, conditional rules, computed thresholds.' },
      { icon: Database, title: 'Referential Integrity', description: 'Verify that foreign key values exist in a reference dataset. Catches orphaned records before loading into the target.' },
      { icon: Table, title: 'Schema Conformity', description: 'Validate that the data matches an expected schema — column names, data types, and column count. Detects upstream schema drift.' },
      { icon: BarChart3, title: 'Accepted Values', description: 'Restrict a column to a defined set of allowed values (enum/whitelist). Catches unexpected categories, typos, or invalid codes.' },
    ],
    screenshots: [],
    subsections: [
      {
        title: 'How Tests Work',
        content: 'Data quality tests are attached to node outputs in the pipeline editor. After a node finishes processing, Maestrio evaluates all attached tests against the output data. Each test produces a pass/fail result along with details: total rows tested, rows passed, rows failed, and failure percentage. Results are stored in the execution log and visible in the Monitor dashboard.'
      },
      {
        title: 'Adding Tests to a Node',
        content: 'Select any node in the pipeline editor and open the Properties panel. Navigate to the "Quality Tests" tab. Click "Add Test" and choose a test type. Configure the test parameters (column, expression, threshold). Multiple tests can be added to a single node — they all run in sequence after the node completes.'
      },
      {
        title: 'Not Null Test',
        content: 'Checks that the specified column(s) have no NULL values. Configuration: select one or more columns, set an optional failure threshold (percentage of NULLs allowed, default 0%). Use case: ensure required fields like customer_id, email, or transaction_date are always populated before loading into a warehouse.'
      },
      {
        title: 'Unique Test',
        content: 'Checks that values in the specified column(s) are unique across all rows. For composite uniqueness, select multiple columns — the combination must be unique. Configuration: select column(s), enable/disable case sensitivity. Use case: validate primary keys, detect duplicate records after a merge, ensure business key integrity.'
      },
      {
        title: 'Regex Match Test',
        content: 'Validates that every value in a column matches a given regular expression. Configuration: select column, enter regex pattern, set case-insensitive flag. Common patterns: email (^[\\w.-]+@[\\w.-]+\\.\\w{2,}$), phone (^\\+?[\\d\\s()-]{7,15}$), UUID (^[0-9a-f]{8}-...), ISO date (^\\d{4}-\\d{2}-\\d{2}$). Rows that don\'t match are flagged as failures.'
      },
      {
        title: 'Range Check Test',
        content: 'Validates that numeric or date column values fall within specified bounds. Configuration: select column, set min and/or max values (both optional — you can check only a lower or upper bound). Supports integers, decimals, and dates. Use case: amounts must be positive, ages between 0–150, dates must be in the past, percentages between 0–100.'
      },
      {
        title: 'Custom Expression Test',
        content: 'Write an arbitrary SQL expression that evaluates to true (pass) or false (fail) for each row. The expression has access to all columns in the dataset. Examples: "amount > 0 AND currency IS NOT NULL" (cross-column check), "LENGTH(name) > 1" (minimum length), "start_date < end_date" (date logic), "total = subtotal + tax" (calculated field validation). This is the most flexible test type.'
      },
      {
        title: 'Referential Integrity Test',
        content: 'Verifies that values in a column exist in a reference dataset (lookup table). Configuration: select the column to check, select the reference node or resource and its lookup column. Use case: ensure every order.customer_id exists in the customers table, every product_code maps to a valid product, or every country_code is in the ISO list.'
      },
      {
        title: 'Schema Conformity Test',
        content: 'Validates the structure of the data against an expected schema. Checks: expected columns are present, data types match (or are castable), no unexpected extra columns (optional strict mode). Configuration: select a reference schema from Resources, or define inline. Use case: detect upstream schema changes that would break downstream transformations — a column renamed, a type changed from int to string, or a new column added.'
      },
      {
        title: 'Accepted Values Test',
        content: 'Restricts column values to a predefined whitelist. Configuration: select column, enter the list of accepted values (comma-separated or from a resource). Case sensitivity is configurable. Use case: status must be one of (active, inactive, pending), country_code must be a valid ISO-2 code, payment_method must be (credit_card, bank_transfer, paypal).'
      },
      {
        title: 'Failure Handling',
        content: 'When a test fails, Maestrio offers three actions: Abort — immediately stop pipeline execution and mark it as failed. Warn — log a warning but continue execution (test result is recorded as "warning"). Quarantine — route failing rows to a separate quarantine output and continue with clean rows only. The quarantine output can be connected to a target node for review (e.g. write bad rows to a CSV or error table).'
      },
      {
        title: 'Failure Thresholds',
        content: 'Every test supports a configurable failure threshold — the maximum percentage of rows that can fail before the test is considered failed overall. A threshold of 0% means any single failing row triggers the test failure. A threshold of 5% means up to 5% of rows can fail and the test still passes. This is useful for real-world data where a small percentage of bad records is acceptable.'
      },
      {
        title: 'Test Results & Monitoring',
        content: 'All test results are recorded in the execution log and visible in the Monitor dashboard. For each test: status (pass/warn/fail), rows tested, rows passed, rows failed, failure percentage, execution time. Over time, you can track data quality trends — see if failure rates are increasing, identify which sources produce the most issues, and generate quality reports for stakeholders.'
      },
      {
        title: 'Best Practices',
        content: 'Add Not Null and Unique tests on key columns right after source nodes to catch issues early. Use Schema Conformity tests when reading from external sources that may change without notice. Place Regex tests on string columns that must follow a format (emails, phones, IDs). Use Range checks on financial amounts and dates. For critical pipelines, set failure action to Abort. For exploratory pipelines, use Warn to collect quality metrics without blocking. Use quarantine outputs to review and fix bad data systematically.'
      },
    ],
  },

  monitor: {
    overview: 'The Monitor dashboard provides unified execution history across all pipelines, Maestros, and Pulses. View real-time status updates, filter by status or date range, search by name, and drill into individual executions with live log streaming and node-level details.',
    features: [
      { icon: Activity, title: 'Unified Dashboard', description: 'See all pipeline, Maestro, and Pulse executions in one place.' },
      { icon: Search, title: 'Filter & Search', description: 'Filter by status (running, success, error), date range, or search by name.' },
      { icon: RefreshCw, title: 'Auto-Refresh', description: 'Real-time updates every few seconds — no manual refresh needed.' },
      { icon: Terminal, title: 'Live Logs', description: 'Stream execution logs in real-time. Node-level detail with timing and row counts.' },
      { icon: BarChart3, title: 'Status Indicators', description: 'Color-coded badges: green (success), red (error), blue (running), gray (pending).' },
      { icon: Eye, title: 'Execution Detail', description: 'Drill into any execution to see per-node status, duration, row counts, and error messages.' },
    ],
    screenshots: [
      { src: './screenshots/monitor.png', alt: 'Monitor Dashboard', caption: 'The Monitor dashboard showing execution history with status badges' },
    ],
  },

  documentation: {
    overview: 'Maestrio auto-generates comprehensive documentation for every pipeline. Each pipeline produces a data flow diagram, node configuration cards, input/output schema documentation, and connection references. Export to PDF or HTML for sharing with your team.',
    features: [
      { icon: FileText, title: 'Auto-Generated', description: 'Documentation is generated automatically from pipeline definitions — no manual writing.' },
      { icon: BookOpen, title: 'Data Flow Diagrams', description: 'Visual pipeline diagrams with node connections and data flow arrows.' },
      { icon: Table, title: 'Schema Documentation', description: 'Input and output schemas for every node, with column names, types, and descriptions.' },
      { icon: Download, title: 'Export Options', description: 'Export to PDF or HTML. Share with stakeholders who don\'t use Maestrio.' },
    ],
    screenshots: [
      { src: './screenshots/docs.png', alt: 'Auto-Generated Documentation', caption: 'Auto-generated pipeline documentation with data flow diagrams' },
    ],
  },

  scheduler: {
    overview: 'The Scheduler enables cron-based pipeline execution. Define schedules using familiar cron expressions, set up recurring data loads, and monitor scheduled runs from the Monitor dashboard. This feature is currently under development.',
    features: [
      { icon: Calendar, title: 'Cron Expressions', description: 'Standard cron syntax — minute, hour, day, month, weekday.' },
      { icon: Clock, title: 'Recurring Jobs', description: 'Schedule hourly, daily, weekly, or custom interval pipeline runs.' },
      { icon: Activity, title: 'Monitoring', description: 'Scheduled execution history visible in the Monitor dashboard.' },
      { icon: Settings, title: 'Configuration', description: 'Set timezone, retry policies, and notification preferences per schedule.' },
    ],
    screenshots: [],
  },

};

// ─── Full Node Catalog (70+ nodes) ────────────────────────

export const FULL_NODE_CATALOG: NodeEntry[] = [
  // ── Database Sources ──
  { id: 'db_src_pg', name: 'PostgreSQL Source', category: 'Source', subcategory: 'Database', description: 'Query PostgreSQL with full SQL support', icon: Database, configHighlights: ['Connection selector', 'SQL editor', 'Schema preview'] },
  { id: 'db_src_mysql', name: 'MySQL Source', category: 'Source', subcategory: 'Database', description: 'Read from MySQL/MariaDB databases', icon: Database, configHighlights: ['Connection selector', 'Query builder', 'Limit/offset'] },
  { id: 'db_src_oracle', name: 'Oracle Source', category: 'Source', subcategory: 'Database', description: 'Connect to Oracle Database 12c+', icon: Database, configHighlights: ['SID/Service name', 'PL/SQL support', 'Bind variables'] },
  { id: 'db_src_mssql', name: 'SQL Server Source', category: 'Source', subcategory: 'Database', description: 'Query Microsoft SQL Server', icon: Database, configHighlights: ['Windows/SQL auth', 'Stored procedures', 'T-SQL support'] },
  { id: 'db_src_mongo', name: 'MongoDB Source', category: 'Source', subcategory: 'Database', description: 'Read from MongoDB collections', icon: Database, configHighlights: ['Collection selector', 'Aggregation pipeline', 'Projection'] },
  { id: 'db_src_snow', name: 'Snowflake Source', category: 'Source', subcategory: 'Database', description: 'Query Snowflake data warehouse', icon: Database, configHighlights: ['Warehouse/schema selector', 'SQL editor', 'Role selection'] },

  // ── File Sources ──
  { id: 'file_src_csv', name: 'CSV Source', category: 'Source', subcategory: 'File', description: 'Read delimited text files (CSV, TSV, pipe)', icon: FileText, configHighlights: ['Delimiter config', 'Header detection', 'Encoding'] },
  { id: 'file_src_excel', name: 'Excel Source', category: 'Source', subcategory: 'File', description: 'Read Excel workbooks (.xlsx, .xls)', icon: FileSpreadsheet, configHighlights: ['Sheet selector', 'Range selection', 'Header row'] },
  { id: 'file_src_xml', name: 'XML Source', category: 'Source', subcategory: 'File', description: 'Parse XML files with XPath', icon: FileCode, configHighlights: ['XPath expression', 'Namespace support', 'Schema inference'] },
  { id: 'file_src_magic', name: 'Magic File', category: 'Source', subcategory: 'File', description: 'Auto-detect format (CSV, JSON, Parquet, etc.)', icon: FileText, configHighlights: ['Auto-detection', 'Format override', 'Encoding fallback'] },

  // ── Cloud Sources ──
  { id: 'cloud_src_s3_list', name: 'S3 List', category: 'Source', subcategory: 'Cloud', description: 'List objects in an S3 bucket', icon: Cloud, configHighlights: ['Prefix filter', 'Recursive listing', 'Metadata extraction'] },
  { id: 'cloud_src_s3_dl', name: 'S3 Download', category: 'Source', subcategory: 'Cloud', description: 'Download and read files from S3', icon: Download, configHighlights: ['Key/prefix', 'Format detection', 'Multi-file merge'] },
  { id: 'cloud_src_gdrive_list', name: 'Google Drive List', category: 'Source', subcategory: 'Cloud', description: 'List files in Google Drive folders', icon: Cloud, configHighlights: ['Folder selector', 'MIME filter', 'Shared drives'] },
  { id: 'cloud_src_gdrive_dl', name: 'Google Drive Download', category: 'Source', subcategory: 'Cloud', description: 'Download files from Google Drive', icon: Download, configHighlights: ['File picker', 'Export format', 'OAuth2 flow'] },
  { id: 'cloud_src_azure_list', name: 'Azure Blob List', category: 'Source', subcategory: 'Cloud', description: 'List blobs in Azure containers', icon: Cloud, configHighlights: ['Container selector', 'Prefix filter', 'Include metadata'] },
  { id: 'cloud_src_azure_dl', name: 'Azure Blob Download', category: 'Source', subcategory: 'Cloud', description: 'Download blobs from Azure Storage', icon: Download, configHighlights: ['Blob path', 'Format detection', 'SAS token support'] },

  // ── REST Sources ──
  { id: 'rest_src', name: 'REST Source', category: 'Source', subcategory: 'REST', description: 'Ingest data from REST APIs with pagination', icon: Globe, configHighlights: ['URL template', 'Auth (Bearer/Basic/API Key)', 'Pagination config', 'Retry policy'] },

  // ── FTP Sources ──
  { id: 'ftp_list', name: 'FTP List', category: 'Source', subcategory: 'FTP', description: 'List files on FTP/SFTP/FTPS servers', icon: Server, configHighlights: ['Protocol (FTP/SFTP/FTPS)', 'Path filter', 'Recursive'] },
  { id: 'ftp_get', name: 'FTP Get', category: 'Source', subcategory: 'FTP', description: 'Download files from FTP servers', icon: Download, configHighlights: ['Remote path', 'Local destination', 'Binary/ASCII mode'] },

  // ── Local Sources ──
  { id: 'local_filelist', name: 'File List', category: 'Source', subcategory: 'Local', description: 'List files in local directories', icon: FolderOpen, configHighlights: ['Directory path', 'Glob pattern', 'Recursive'] },

  // ── Transform Nodes ──
  { id: 'tr_sql', name: 'SQL Transform', category: 'Transform', subcategory: 'Transform', description: 'DataFusion-powered SQL transformations', icon: Code, configHighlights: ['Monaco SQL editor', 'Multi-input support', 'Schema preview'] },
  { id: 'tr_python', name: 'Python Transform', category: 'Transform', subcategory: 'Transform', description: 'Custom Python code with PyArrow', icon: Code, configHighlights: ['Monaco Python editor', 'Package imports', 'DataFrame API'] },
  { id: 'tr_filter', name: 'Filter', category: 'Transform', subcategory: 'Transform', description: 'Row filtering with SQL conditions', icon: Filter, configHighlights: ['SQL WHERE clause', 'Column picker', 'Preview'] },
  { id: 'tr_mapper', name: 'Visual Mapper', category: 'Transform', subcategory: 'Transform', description: 'N-input to M-output visual field mapping', icon: Layers, configHighlights: ['Drag-and-drop mapping', 'Expression editor', 'Join configuration', 'Multiple outputs'] },
  { id: 'tr_setvar', name: 'Set Variable', category: 'Transform', subcategory: 'Transform', description: 'Set context variables from data', icon: Hash, configHighlights: ['Variable name', 'Expression', 'Scope (pipeline/global)'] },

  // ── Database Targets ──
  { id: 'db_tgt_pg', name: 'PostgreSQL Target', category: 'Target', subcategory: 'Database', description: 'Write to PostgreSQL (INSERT/UPSERT/MERGE)', icon: Database, configHighlights: ['Write mode', 'Conflict resolution', 'Batch size', 'Table creation'] },
  { id: 'db_tgt_mysql', name: 'MySQL Target', category: 'Target', subcategory: 'Database', description: 'Write to MySQL/MariaDB', icon: Database, configHighlights: ['INSERT/REPLACE/UPSERT', 'ON DUPLICATE KEY', 'Batch insert'] },
  { id: 'db_tgt_oracle', name: 'Oracle Target', category: 'Target', subcategory: 'Database', description: 'Write to Oracle Database', icon: Database, configHighlights: ['MERGE support', 'Sequence generation', 'Bulk operations'] },
  { id: 'db_tgt_mssql', name: 'SQL Server Target', category: 'Target', subcategory: 'Database', description: 'Write to Microsoft SQL Server', icon: Database, configHighlights: ['MERGE/INSERT', 'Identity insert', 'Bulk copy'] },
  { id: 'db_tgt_mongo', name: 'MongoDB Target', category: 'Target', subcategory: 'Database', description: 'Write to MongoDB collections', icon: Database, configHighlights: ['Insert/Upsert/Replace', 'Write concern', 'Ordered operations'] },
  { id: 'db_tgt_snow', name: 'Snowflake Target', category: 'Target', subcategory: 'Database', description: 'Load data into Snowflake', icon: Database, configHighlights: ['Stage upload', 'COPY INTO', 'Warehouse selection'] },

  // ── File Targets ──
  { id: 'file_tgt_csv', name: 'CSV Target', category: 'Target', subcategory: 'File', description: 'Write delimited output files', icon: FileText, configHighlights: ['Delimiter', 'Header toggle', 'Append/overwrite', 'Encoding'] },
  { id: 'file_tgt_excel', name: 'Excel Target', category: 'Target', subcategory: 'File', description: 'Write Excel workbooks', icon: FileSpreadsheet, configHighlights: ['Sheet name', 'Styling', 'Multiple sheets'] },
  { id: 'file_tgt_xml', name: 'XML Target', category: 'Target', subcategory: 'File', description: 'Generate XML output files', icon: FileCode, configHighlights: ['Root element', 'Row element', 'Namespace config'] },
  { id: 'file_tgt_magic', name: 'Magic File Target', category: 'Target', subcategory: 'File', description: 'Auto-format output (CSV, JSON, Parquet)', icon: FileText, configHighlights: ['Format selection', 'Compression', 'Partitioning'] },

  // ── Cloud Targets ──
  { id: 'cloud_tgt_s3_up', name: 'S3 Upload', category: 'Target', subcategory: 'Cloud', description: 'Upload data to S3 buckets', icon: Upload, configHighlights: ['Key template', 'Content type', 'ACL', 'Encryption'] },
  { id: 'cloud_tgt_s3_cp', name: 'S3 Copy', category: 'Target', subcategory: 'Cloud', description: 'Copy objects between S3 locations', icon: Copy, configHighlights: ['Source/dest keys', 'Cross-bucket', 'Metadata preserve'] },
  { id: 'cloud_tgt_s3_del', name: 'S3 Delete', category: 'Target', subcategory: 'Cloud', description: 'Delete objects from S3', icon: Trash2, configHighlights: ['Key pattern', 'Versioned delete', 'Batch delete'] },
  { id: 'cloud_tgt_gdrive_up', name: 'Google Drive Upload', category: 'Target', subcategory: 'Cloud', description: 'Upload files to Google Drive', icon: Upload, configHighlights: ['Folder destination', 'MIME type', 'Overwrite policy'] },
  { id: 'cloud_tgt_gdrive_cp', name: 'Google Drive Copy', category: 'Target', subcategory: 'Cloud', description: 'Copy files within Google Drive', icon: Copy, configHighlights: ['Source file', 'Destination folder', 'New name'] },
  { id: 'cloud_tgt_gdrive_del', name: 'Google Drive Delete', category: 'Target', subcategory: 'Cloud', description: 'Delete files from Google Drive', icon: Trash2, configHighlights: ['File selector', 'Trash vs permanent'] },
  { id: 'cloud_tgt_azure_up', name: 'Azure Blob Upload', category: 'Target', subcategory: 'Cloud', description: 'Upload to Azure Blob Storage', icon: Upload, configHighlights: ['Container/path', 'Content type', 'Access tier'] },
  { id: 'cloud_tgt_azure_cp', name: 'Azure Blob Copy', category: 'Target', subcategory: 'Cloud', description: 'Copy blobs within Azure Storage', icon: Copy, configHighlights: ['Source/dest URL', 'Cross-container', 'Async copy'] },
  { id: 'cloud_tgt_azure_del', name: 'Azure Blob Delete', category: 'Target', subcategory: 'Cloud', description: 'Delete blobs from Azure Storage', icon: Trash2, configHighlights: ['Blob path', 'Snapshot delete', 'Soft delete'] },

  // ── REST Targets ──
  { id: 'rest_tgt', name: 'REST Target', category: 'Target', subcategory: 'REST', description: 'Send data to REST APIs (POST/PUT/PATCH)', icon: Globe, configHighlights: ['HTTP method', 'URL template', 'Auth config', 'Batch size', 'Retry policy'] },

  // ── FTP Targets ──
  { id: 'ftp_put', name: 'FTP Put', category: 'Target', subcategory: 'FTP', description: 'Upload files to FTP servers', icon: Upload, configHighlights: ['Remote path', 'Overwrite policy', 'Transfer mode'] },
  { id: 'ftp_rename', name: 'FTP Rename', category: 'Target', subcategory: 'FTP', description: 'Rename files on FTP servers', icon: Edit3, configHighlights: ['Source name', 'Target name', 'Path'] },
  { id: 'ftp_delete', name: 'FTP Delete', category: 'Target', subcategory: 'FTP', description: 'Delete files from FTP servers', icon: Trash2, configHighlights: ['File path', 'Confirmation'] },

  // ── Local Targets ──
  { id: 'local_folder', name: 'Folder Management', category: 'Target', subcategory: 'Local', description: 'Create, move, or delete folders', icon: FolderOpen, configHighlights: ['Operation (create/move/delete)', 'Path', 'Recursive'] },
  { id: 'local_file', name: 'File Management', category: 'Target', subcategory: 'Local', description: 'Copy, move, or delete local files', icon: HardDrive, configHighlights: ['Operation', 'Source/dest', 'Overwrite policy'] },
  { id: 'local_console', name: 'Console Output', category: 'Target', subcategory: 'Local', description: 'Print data to console (debug)', icon: Terminal, configHighlights: ['Row limit', 'Format (table/JSON)', 'Column selection'] },
  { id: 'local_email', name: 'Email', category: 'Target', subcategory: 'Local', description: 'Send email via SMTP', icon: Mail, configHighlights: ['SMTP config', 'To/CC/BCC', 'HTML/plain', 'Attachments'] },

  // ── Control Flow ──
  { id: 'ctrl_sleep', name: 'Sleep', category: 'Control', subcategory: 'Control', description: 'Pause execution for a duration', icon: Pause, configHighlights: ['Duration (ms/s/m)', 'Variable duration'] },
  { id: 'ctrl_runafter', name: 'RunAfter', category: 'Control', subcategory: 'Control', description: 'Synchronization point — wait for predecessors', icon: Clock, configHighlights: ['No config needed', 'Auto-waits for all inputs'] },
  { id: 'ctrl_loop', name: 'LoopWhile', category: 'Control', subcategory: 'Control', description: 'Repeat a subgraph while condition is true', icon: Repeat, configHighlights: ['Condition expression', 'Max iterations', 'Break variable'] },
];

export const NODE_CATEGORIES = ['All', 'Source', 'Transform', 'Target', 'Control'] as const;
export const NODE_SUBCATEGORIES = ['All', 'Database', 'File', 'Cloud', 'REST', 'FTP', 'Local', 'Transform', 'Control'] as const;
