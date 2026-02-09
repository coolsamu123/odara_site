# Odara Community - Complete Feature Reference

> **Version**: 1.0.0 (Community Edition)
> **Last Updated**: 2026-02-04

---

## **"You don't have to know how to code. Just tell Odara what you want. Odara will build it."**

Odara is the **AI-first ETL platform** that transforms how you build data pipelines. No programming skills required. Describe your data transformation in plain English, and Odara's AI generates the SQL, Python, or entire pipeline for you.

---

## Table of Contents

1. [Overview](#overview)
2. [Who Is Odara For?](#who-is-odara-for)
3. [AI Integration](#ai-integration)
4. [Available Pages](#available-pages)
5. [Pipeline Editor](#pipeline-editor)
6. [Node Types](#node-types)
7. [Data Quality Testing](#data-quality-testing)
8. [Maestro Orchestration](#maestro-orchestration)
9. [Pulse Streaming](#pulse-streaming)
10. [Scheduling](#scheduling)
11. [Monitoring](#monitoring)
12. [Environments & Context Variables](#environments--context-variables)
13. [Git Integration](#git-integration)
14. [Project Management](#project-management)
15. [Import & Export](#import--export)
16. [Community vs Enterprise](#community-vs-enterprise)

---

## Overview

Odara Community is a **free, AI-first ETL/ELT platform** that lets anyone build data pipelines—no coding required.

### Why Odara?

- **AI-Powered** - Describe what you want in plain English, get working code
- **No Programming Required** - Business users can build complex pipelines
- **Visual Editor** - Drag-and-drop interface with 70+ pre-built nodes
- **Enterprise-Grade** - Rust backend for performance and reliability
- **Free to Use** - Full-featured Community edition at no cost

---

## Who Is Odara For?

Odara is designed to be accessible to everyone—from complete beginners to seasoned professionals.

### Data Engineers
- Build production-ready pipelines faster with AI assistance
- Focus on architecture, let AI handle the boilerplate
- 70+ pre-built connectors for databases, APIs, and cloud storage
- Rust-powered performance for large-scale data processing

### Data Analysts
- Transform data without writing code
- Connect directly to databases, spreadsheets, and APIs
- Create reusable data preparation workflows
- No need to wait for IT or engineering teams

### Business Analysts
- Self-service data integration
- Merge data from multiple sources visually
- Automate recurring reports and data refreshes
- Understand data flows through visual pipelines

### Project Managers
- Oversee data workflows without technical expertise
- Monitor pipeline executions in real-time
- Schedule automated data processes
- Understand what your team is building

### Students & Trainees
- Learn ETL concepts with a modern, visual tool
- No setup complexity—start building immediately
- AI explains code and teaches best practices
- Portfolio-ready projects without deep coding skills

### IT Administrators
- Deploy a single platform for all data integration needs
- Monitor and schedule jobs centrally
- Git integration for version control
- No licensing costs for Community edition

### Startup Teams
- Move fast without hiring specialized ETL developers
- Connect your entire data stack in days, not months
- Scale from prototype to production with the same tool
- Free means more budget for growth

### Consultants & Freelancers
- Deliver client projects faster
- Reusable pipeline templates
- Professional-grade output without enterprise costs
- Impress clients with visual data flows

### Database Administrators
- Automate data migration and synchronization
- Cross-database transformations (PostgreSQL, MySQL, Oracle, etc.)
- Schema-aware operations with introspection
- Scheduled data maintenance tasks

### Citizen Developers
- Build what you need without waiting for developers
- AI guides you through complex transformations
- Visual interface makes logic transparent
- No programming background required

### Educators & Trainers
- Teach data integration concepts visually
- Students see immediate results
- AI assistance helps struggling learners
- Modern tool that prepares students for industry

---

### The Bottom Line

**If you work with data, Odara is for you.**

Whether you're moving data between systems, cleaning messy spreadsheets, building reports, or orchestrating complex data workflows—Odara's AI-first approach means you can do it yourself, without writing code.

### Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Rust, Axum, DataFusion, Tokio |
| Frontend | React, TypeScript, React Flow, Zustand, TailwindCSS |
| Database | SQLite (WAL mode) |
| Code Editor | Monaco Editor |
| Data Format | Apache Arrow RecordBatch |

---

## Available Pages

The Community edition provides access to the following pages via the navigation menu:

| Page | Description | Access |
|------|-------------|--------|
| **Editor** | Visual pipeline/maestro/pulse editor | All users |
| **Schedule** | Job scheduling with cron expressions | All users |
| **Monitor** | Execution monitoring and history | All users |
| **Admin** | User management (when auth enabled) | Admin only |

### Not Available in Community Edition

The following features have backend code but are **not exposed in the Community UI**:

- Deployment Center (environment-based deployment)
- Promotion workflows (dev → staging → prod)
- Data Observability dashboard
- Import Utility page (Talend converter)
- Multi-user authentication (single-user mode by default)
- Role-Based Access Control (RBAC)

---

## Pipeline Editor

### Canvas Features

| Feature | Status |
|---------|--------|
| Visual drag-and-drop editor | Available |
| Multi-tab support | Available |
| Auto-save (1-second debounce) | Available |
| Undo/Redo (50-state history) | Available |
| Copy/Paste nodes | Available |
| Multi-selection | Available |
| Resizable panels | Available |

### Panels

| Panel | Description |
|-------|-------------|
| **Sidebar** | Node palette, pipelines list, maestros, pulses, metadata, context variables |
| **Properties Panel** | Node configuration, data quality tests, preview |
| **Log Console** | Real-time execution logs |
| **AI Chat** | Natural language code generation |

### Code Editing

- Monaco Editor for SQL and Python
- Syntax highlighting
- Variable auto-completion (`${variable}` syntax)
- Schema preview from upstream nodes

---

## Node Types

### Source Nodes (21 types)

#### File Sources
| Node | Description |
|------|-------------|
| `csv_source` | Read CSV files |
| `excel_source` | Read Excel files (.xlsx, .xls) |
| `xml_source` | Read XML files |
| `magic_file_source` | Auto-detect format (CSV, JSON, Parquet, Excel) |
| `file_list` | List files/folders in directory |

#### Database Sources
| Node | Description |
|------|-------------|
| `postgres_source` | PostgreSQL query |
| `mysql_source` | MySQL query |
| `oracle_source` | Oracle query (requires Oracle Instant Client) |
| `mssql_source` | SQL Server query (feature-gated) |
| `mongo_source` | MongoDB collection query |
| `snowflake_source` | Snowflake query |
| `db2_source` | IBM DB2 query |

#### Cloud Storage Sources
| Node | Description |
|------|-------------|
| `s3_list` | List S3 bucket objects |
| `s3_source` | Download from S3 |
| `azure_blob_list` | List Azure container blobs (requires `--features azure`) |
| `azure_blob_download` | Download from Azure Blob |
| `google_drive_list` | List Google Drive files |
| `google_drive_download` | Download from Google Drive |

#### Remote Sources
| Node | Description |
|------|-------------|
| `ftp_list` | List FTP/SFTP/FTPS files |
| `ftp_get` | Download from FTP/SFTP/FTPS |
| `rest_source` | REST API GET with pagination and auth |

### Transform Nodes (5 types)

| Node | Description |
|------|-------------|
| `sql_transform` | SQL transformation (DataFusion engine) |
| `python_transform` | Python code execution (subprocess with PyArrow) |
| `filter` | Filter rows with SQL WHERE condition |
| `mapper` | Visual mapper (N inputs, M outputs, joins, expressions) |
| `set_variable` | Set pipeline variables |

### Target Nodes (27 types)

#### File Targets
| Node | Description |
|------|-------------|
| `csv_target` | Write CSV |
| `excel_target` | Write Excel (.xlsx) |
| `xml_target` | Write XML |
| `magic_file_target` | Auto-format based on extension |

#### Database Targets
| Node | Write Modes |
|------|-------------|
| `postgres_target` | INSERT, UPSERT, UPDATE, DELETE, MERGE |
| `mysql_target` | INSERT, INSERT IGNORE, UPSERT, REPLACE, UPDATE, DELETE |
| `oracle_target` | INSERT, MERGE, UPDATE, DELETE |
| `mssql_target` | INSERT, MERGE, UPDATE, DELETE |
| `mongo_target` | INSERT, UPSERT, UPDATE, REPLACE, DELETE |
| `snowflake_target` | INSERT, MERGE, UPDATE, DELETE, COPY INTO |
| `db2_target` | INSERT, MERGE, UPDATE, DELETE |

#### Cloud Storage Targets
| Node | Description |
|------|-------------|
| `s3_target` | Upload to S3 |
| `s3_copy` | Copy within S3 |
| `s3_delete` | Delete from S3 |
| `azure_blob_upload` | Upload to Azure Blob |
| `azure_blob_copy` | Copy Azure blob |
| `azure_blob_delete` | Delete Azure blob |
| `google_drive_upload` | Upload to Google Drive |
| `google_drive_copy` | Copy in Google Drive |
| `google_drive_delete` | Delete from Google Drive |

#### Remote Targets
| Node | Description |
|------|-------------|
| `ftp_put` | Upload to FTP/SFTP/FTPS |
| `ftp_rename` | Rename/move on FTP |
| `ftp_delete` | Delete from FTP |
| `rest_target` | REST API POST/PUT/PATCH with batching |

#### Communication
| Node | Description |
|------|-------------|
| `email_target` | Send email via SMTP |

#### Utility
| Node | Description |
|------|-------------|
| `console_target` | Debug output |
| `folder_management` | Create/delete folders |
| `file_management` | Create/delete files |

### Control Flow Nodes (3 types)

| Node | Status | Description |
|------|--------|-------------|
| `sleep` | Complete | Pause for N seconds |
| `run_after` | Complete | Wait for all upstream branches |
| `loop_while` | Partial | Config exists, loop re-execution TODO |

---

## Data Quality Testing

Built-in data quality framework for validating node outputs.

### Accessing Tests

1. Select a data-producing node in the canvas
2. Click the gold **"Data Quality Tests"** button in Properties Panel
3. Add, configure, and run tests

### Test Types

| Test Type | Description |
|-----------|-------------|
| `not_null` | Column must not contain NULL |
| `unique` | Column values must be unique |
| `unique_combination` | Combination of columns must be unique |
| `accepted_values` | Column must contain only specified values |
| `range` | Numeric column must be within min/max |
| `positive` | Column must be > 0 |
| `non_negative` | Column must be >= 0 |
| `matches_regex` | Column must match regex pattern |
| `valid_email` | Column must be valid email format |
| `valid_uuid` | Column must be valid UUID format |
| `expression` | Custom SQL expression must be true |

### Severity Levels

| Severity | Behavior |
|----------|----------|
| `error` | Stops pipeline execution |
| `warn` | Logs warning, continues |
| `info` | Silent log entry |

### Threshold Options

- **percent**: Allow up to X% of rows to fail
- **count**: Allow up to N rows to fail

---

## Maestro Orchestration

Pipeline orchestrator for complex workflows.

### Execution Modes

| Mode | Description |
|------|-------------|
| Parallel | Execute multiple pipelines simultaneously |
| Series | Execute pipelines sequentially |
| Conditional | Execute based on expression |

### Features

- Visual workflow editor
- Variable passing between steps
- Step-level error handling
- Execution history
- Export/import definitions

---

## Pulse Streaming

Real-time streaming pipelines (partial implementation).

### Supported Sources

| Source | Status |
|--------|--------|
| Kafka | Partial |
| RabbitMQ | Partial |
| NATS | Stub |
| MQTT | Stub |

### Stream Operators

| Operator | Description |
|----------|-------------|
| Map | Transform each event |
| Filter | Filter events |
| Window | Time/count windowing |
| Aggregate | Aggregation within windows |

### Supported Sinks

| Sink | Status |
|------|--------|
| Kafka | Partial |
| PostgreSQL | Partial |

---

## Scheduling

Cron-based job scheduling for automated execution.

### Features

| Feature | Status |
|---------|--------|
| Cron expressions | Available |
| Timezone support | Available |
| Enable/disable | Available |
| Pipeline execution | Available |
| Maestro execution | Available |
| Execution history | Available |

### Cron Format

```
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6)
* * * * *
```

### Common Presets

| Preset | Expression |
|--------|------------|
| Every minute | `* * * * *` |
| Every hour | `0 * * * *` |
| Daily midnight | `0 0 * * *` |
| Weekly Monday | `0 0 * * 1` |
| Monthly 1st | `0 0 1 * *` |

### Access

Navigate to **Schedule** page from the navigation menu.

---

## Monitoring

Real-time execution monitoring.

### Features

| Feature | Description |
|---------|-------------|
| Type filters | Pipeline, Maestro, Pulse |
| Status filters | Running, Completed, Failed, Aborted |
| Execution history | Full history per pipeline |
| Node-level metrics | Per-node execution status |
| Real-time updates | SSE-based progress |
| Duration tracking | Start/end times |

### Access

Navigate to **Monitor** page from the navigation menu.

---

## Environments & Context Variables

### Default Environments

| Environment | Color | Description |
|-------------|-------|-------------|
| Development | Blue | Local development |
| UAT | Orange | Testing |
| Production | Green | Live |

### Context Variables

Define variables that can differ per environment:

```
${DATABASE_URL}
${API_KEY}
${OUTPUT_PATH}
```

### Variable Interpolation

Variables are resolved at runtime using `${variable}` syntax in:
- SQL queries
- File paths
- Connection strings
- API URLs

### Access

Click **Context** section in the Sidebar to manage variables.

---

## Git Integration

Version control for pipelines (available via Sidebar).

### Features

| Feature | Status |
|---------|--------|
| Initialize repository | Available |
| Commit changes | Available |
| View history | Available |
| View diff | Available |
| GitHub OAuth | Available |
| Push to remote | Available |
| Pull from remote | Available |

### Access

Click the **Git** icon in the Sidebar to open Git panel.

---

## AI Integration

### The Core Philosophy: No Code Required

**You don't need to be a developer to build powerful data pipelines.**

Odara's AI understands natural language and translates your intentions into working code. Whether you need to:
- Clean messy data
- Join tables from different sources
- Filter records by complex conditions
- Transform data formats
- Aggregate and summarize information

Just describe what you want in plain English. Odara handles the rest.

---

### AI-Powered Code Generation

#### SQL Generation

Tell the AI what you need, and it writes the SQL for you:

| You Say | Odara Generates |
|---------|-----------------|
| "Remove duplicate customers by email" | `SELECT DISTINCT ON (email) * FROM input ORDER BY email, created_at DESC` |
| "Calculate total sales by region for Q4" | `SELECT region, SUM(amount) as total FROM input WHERE quarter = 4 GROUP BY region` |
| "Join customers with their orders" | `SELECT c.*, o.order_id, o.amount FROM customers c LEFT JOIN orders o ON c.id = o.customer_id` |
| "Find records where age is between 18 and 65" | `SELECT * FROM input WHERE age BETWEEN 18 AND 65` |
| "Convert dates to YYYY-MM-DD format" | `SELECT *, strftime('%Y-%m-%d', date_column) as formatted_date FROM input` |

#### Python Generation

For complex transformations that go beyond SQL:

| You Say | Odara Generates |
|---------|-----------------|
| "Parse JSON from the payload column" | Complete Python code with `json.loads()` and error handling |
| "Extract email domains" | Python regex extraction with proper null handling |
| "Geocode addresses to lat/long" | Python with geocoding library integration |
| "Detect language of text column" | Python with language detection using langdetect |
| "Calculate sentiment scores" | Python with sentiment analysis |

#### Full Pipeline Generation

Describe an entire workflow, and Odara builds it:

**You say:** *"Load customer data from the CSV file, remove duplicates by email, filter to only active customers, join with their purchase history from PostgreSQL, calculate total spend per customer, and save to a new Excel file."*

**Odara creates:**
- CSV Source node (configured with your file)
- SQL Transform (deduplication)
- Filter node (active = true)
- PostgreSQL Source node (purchase history)
- Mapper node (join on customer_id)
- SQL Transform (SUM aggregation)
- Excel Target node (output file)
- All connections between nodes

---

### Benefits of AI-First ETL

| Traditional ETL | Odara AI-First |
|-----------------|----------------|
| Learn SQL syntax | Describe in plain English |
| Memorize function names | AI knows all functions |
| Debug cryptic errors | AI explains and fixes |
| Hours of coding | Minutes of conversation |
| Hire specialists | Anyone can build pipelines |
| Documentation hunting | AI is the documentation |

### Who Benefits Most

- **Business Analysts** - Build pipelines without waiting for IT
- **Data Scientists** - Focus on insights, not infrastructure
- **Small Teams** - No need for dedicated ETL developers
- **Citizen Developers** - Democratize data transformation
- **Experienced Engineers** - Accelerate development 10x

---

### AI Chat Interface

The AI Chat Panel provides an interactive experience:

1. **Describe your goal** - "I need to merge two CSV files by customer ID"
2. **AI asks clarifying questions** - "Which columns should be included in the output?"
3. **Review generated code** - See exactly what will run
4. **Apply with one click** - Insert into your pipeline
5. **Iterate and refine** - "Actually, also filter out inactive customers"

### Context-Aware Generation

The AI understands your pipeline context:
- **Knows your schema** - References actual column names
- **Knows upstream data** - Understands what data is available
- **Knows your connections** - Can reference configured databases
- **Knows your variables** - Uses your context variables

---

### Supported AI Providers

| Provider | Status | Best For |
|----------|--------|----------|
| DeepSeek | Available | Code generation, SQL, Python |
| Claude | Planned | Complex reasoning, documentation |
| Ollama | Planned | Local/private deployment |

### Configuration

1. Open AI Settings (gear icon in AI panel)
2. Enter your DeepSeek API key
3. Start generating code immediately

---

### AI in Every Node

The AI isn't just in the chat panel. It's integrated throughout:

| Node Type | AI Assistance |
|-----------|---------------|
| SQL Transform | Generate SQL from description |
| Python Transform | Generate Python from description |
| Filter | Describe filter conditions naturally |
| Mapper | Describe transformations for expressions |

### Access

- Click the **AI** icon in the toolbar
- Or use the **AI Chat Panel** on the right side
- Or click **"Generate with AI"** in any code editor

---

## Project Management

### Features

| Feature | Status |
|---------|--------|
| Create project | Available |
| Open project | Available |
| Recent projects | Available |
| Project settings | Available |
| Clone from Git | Available |

### Project Structure

```
project/
├── data/
│   ├── pipelines/      # Pipeline JSON files
│   ├── maestros/       # Maestro definitions
│   ├── pulses/         # Pulse definitions
│   └── maestrio.db     # SQLite database
├── resources/          # Uploaded resources
└── .git/               # Git repository (optional)
```

---

## Import & Export

### Pipeline Import/Export

| Format | Description |
|--------|-------------|
| JSON | Native pipeline format |
| File upload | Import from file |
| Batch import | Import from directory |

### Access

Right-click pipeline in Sidebar for export options.

---

## Community vs Enterprise

### Available in Community

| Feature | Status |
|---------|--------|
| Pipeline Editor | Full |
| 70+ Node Types | Full |
| Data Quality Tests | Full |
| Maestro Orchestration | Full |
| Pulse Streaming | Partial |
| Scheduling | Full |
| Monitoring | Full |
| Git Integration | Full |
| AI Code Generation | Full |
| Context Variables | Full |
| Single-user mode | Default |

### Not Available in Community (Enterprise Only)

| Feature | Description |
|---------|-------------|
| Multi-user Authentication | JWT-based auth with user management |
| Role-Based Access Control | Admin/Developer/Viewer roles |
| Deployment Center | Environment-based deployments |
| Promotion Workflows | Dev → Staging → Prod promotion |
| Data Observability | Target history and lineage |
| Talend Import Wizard | Visual Talend job converter |
| Protected Environments | Require approval for production |

---

## System Requirements

### Backend

- Rust 1.70+
- SQLite 3.35+

### Frontend

- Node.js 18+
- npm 9+

### Optional

- Python 3.8+ (for Python transforms)
- Oracle Instant Client (for Oracle connector)

---

## Commands

```bash
# Start backend
cargo run --bin odarax-api

# Start frontend
cd ui && npm run dev

# Open http://localhost:5175

# With Azure support
cargo run --bin odarax-api --features azure

# Run tests
cargo test --workspace

# Build production
cargo build --release --workspace
cd ui && npm run build
```

---

## API Endpoints (Community)

### Core Endpoints

| Category | Count | Description |
|----------|-------|-------------|
| Pipelines | ~15 | CRUD, execution, preview |
| Maestros | ~10 | CRUD, execution |
| Pulses | ~10 | CRUD, start/stop |
| Metadata | ~10 | Connection management |
| Schedules | 5 | Cron scheduling |
| Context | ~8 | Environment variables |
| Git | ~10 | Version control |
| AI | ~5 | Code generation |
| Files | 3 | File browsing, schema inference |
| Monitor | ~5 | Execution history |
| Tests | 7 | Data quality |

**Total: ~90 endpoints in Community Edition**

---

## Known Limitations

1. **LoopWhile** - Config exists but loop body re-execution not fully implemented
2. **Pulse Streaming** - Module exists, connectors partially implemented
3. **Single-user mode** - No authentication by default
4. **No dark/light toggle** - Dark theme only

---

## License

**Odara Community is free to use.**

This is not open-source software. Odara Community is provided free of charge for personal and commercial use, but the source code is proprietary. See LICENSE file for full terms and conditions.
