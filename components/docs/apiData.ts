import { ApiCategory } from './types';

// ─── Comprehensive API Reference Data ──────────────────────
// Base URL: /api/v1
// Authentication: JWT Bearer token in Authorization header

export const API_BASE_URL = '/api/v1';

export const API_AUTH_INFO = {
  type: 'Bearer Token (JWT)',
  header: 'Authorization: Bearer <token>',
  accessTokenExpiry: '24 hours',
  refreshTokenExpiry: '30 days',
};

export const API_CATEGORIES: ApiCategory[] = [
  // ════════════════════════════════════════════════════════
  // 4. PIPELINES
  // ════════════════════════════════════════════════════════
  {
    id: 'pipelines',
    name: 'Pipelines',
    description: 'Core pipeline CRUD, execution, streaming, validation, and deployment. Pipelines are directed acyclic graphs (DAGs) of data processing nodes.',
    endpoints: [
      {
        method: 'GET',
        path: '/pipelines',
        summary: 'List all pipelines',
        auth: true,
        responseBody: `{
  "pipelines": [
    {
      "id": "uuid",
      "name": "ETL Daily Load",
      "description": "Daily customer data sync",
      "node_count": 5,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-02-01T14:20:00Z",
      "folder_id": "uuid | null"
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/pipelines',
        summary: 'Create a new pipeline',
        auth: true,
        requestBody: `{
  "name": "My Pipeline",
  "description": "Optional description",
  "folder_id": "uuid (optional)",
  "nodes": [],
  "edges": []
}`,
        responseBody: `{
  "id": "uuid",
  "name": "My Pipeline",
  "description": "Optional description",
  "nodes": [],
  "edges": []
}`,
      },
      {
        method: 'GET',
        path: '/pipelines/:id',
        summary: 'Get pipeline by ID',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
        responseBody: `{
  "id": "uuid",
  "name": "My Pipeline",
  "description": "...",
  "nodes": [{ "id": "uuid", "type": "source", "config": {...} }],
  "edges": [{ "source": "uuid", "target": "uuid" }],
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-02-01T14:20:00Z"
}`,
      },
      {
        method: 'PUT',
        path: '/pipelines/:id',
        summary: 'Update a pipeline',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
        requestBody: `{
  "name": "Updated Name",
  "description": "Updated description",
  "nodes": [...],
  "edges": [...],
  "folder_id": "uuid | null",
  "screenshot": "base64-data-url (optional)"
}`,
      },
      {
        method: 'DELETE',
        path: '/pipelines/:id',
        summary: 'Delete a pipeline',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'POST',
        path: '/pipelines/:id/run',
        summary: 'Execute pipeline (synchronous)',
        description: 'Runs the pipeline and waits for completion. Returns full execution results with per-node details.',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
        responseBody: `{
  "pipeline_id": "uuid",
  "success": true,
  "total_duration_ms": 4523,
  "node_results": [
    {
      "node_id": "uuid",
      "node_name": "CSV Source",
      "row_count": 10000,
      "duration_ms": 1200
    }
  ],
  "error": null
}`,
      },
      {
        method: 'GET',
        path: '/pipelines/:id/run-stream',
        summary: 'Execute pipeline (SSE streaming)',
        description: 'Runs the pipeline with real-time progress via Server-Sent Events. Each event reports node status changes, row counts, and completion.',
        auth: true,
        sse: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
        responseBody: `event: node_start
data: {"node_id":"uuid","node_name":"CSV Source"}

event: node_complete
data: {"node_id":"uuid","node_name":"CSV Source","row_count":10000,"duration_ms":1200}

event: pipeline_complete
data: {"success":true,"total_duration_ms":4523}`,
      },
      {
        method: 'POST',
        path: '/pipelines/:id/abort',
        summary: 'Abort running pipeline',
        description: 'Sends a graceful abort signal to a running pipeline execution.',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'POST',
        path: '/pipelines/:id/force-abort',
        summary: 'Force abort pipeline',
        description: 'Kills all processes associated with the pipeline execution immediately.',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'POST',
        path: '/force-abort-all',
        summary: 'Force abort ALL running executions',
        description: 'Emergency endpoint that kills all currently running pipeline executions.',
        auth: true,
      },
      {
        method: 'POST',
        path: '/pipelines/:id/resume',
        summary: 'Resume a failed pipeline',
        description: 'Resumes execution from the last failed node, skipping already-completed nodes. Returns SSE stream.',
        auth: true,
        sse: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'POST',
        path: '/preview',
        summary: 'Preview node output',
        description: 'Executes a single node and returns preview data without running the full pipeline.',
        auth: true,
        requestBody: `{
  "pipeline": { "nodes": [...], "edges": [...] },
  "node_id": "uuid",
  "limit": 100
}`,
      },
      {
        method: 'POST',
        path: '/pipelines/:id/validate',
        summary: 'Validate pipeline configuration',
        description: 'Checks for configuration errors, missing connections, invalid SQL, and other issues.',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
        responseBody: `{
  "valid": false,
  "issues": [
    {
      "severity": "error",
      "node_id": "uuid",
      "message": "Missing database connection",
      "auto_fixable": true
    }
  ]
}`,
      },
      {
        method: 'POST',
        path: '/pipelines/:id/validate-promotion',
        summary: 'Validate pipeline for environment promotion',
        description: 'Runs stricter validation required before promoting a pipeline to a protected environment.',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'POST',
        path: '/pipelines/:id/auto-fix',
        summary: 'Apply automatic fixes',
        description: 'Applies auto-fixable validation issues identified by the validate endpoint.',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'POST',
        path: '/pipelines/import',
        summary: 'Import pipeline (AI format)',
        description: 'Imports a pipeline from a simplified format used by AI-generated pipelines.',
        auth: true,
        requestBody: `{
  "name": "Generated Pipeline",
  "nodes": [
    {
      "id": "n1",
      "type": "source",
      "config": { "type": "csv", "path": "/data/input.csv" }
    }
  ],
  "edges": [{ "source": "n1", "target": "n2" }]
}`,
      },
      {
        method: 'POST',
        path: '/pipelines/:id/nodes',
        summary: 'Add node to pipeline',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'POST',
        path: '/pipelines/:id/edges',
        summary: 'Add edge to pipeline',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'GET',
        path: '/pipelines/:id/screenshot',
        summary: 'Get pipeline screenshot',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'POST',
        path: '/pipelines/:id/deploy',
        summary: 'Deploy pipeline to environment',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
        requestBody: `{
  "environment_id": "uuid",
  "notes": "Deploying v2.1 with new transforms"
}`,
      },
      {
        method: 'POST',
        path: '/pipelines/:id/promote',
        summary: 'Promote pipeline to next environment',
        description: 'Promotes a deployed pipeline to the next environment in the promotion flow (e.g. dev -> staging -> prod).',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'GET',
        path: '/pipelines/:id/deployments',
        summary: 'Get pipeline deployment status',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'GET',
        path: '/pipelines/:id/deployment-history',
        summary: 'Get pipeline deployment history',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 5. METADATA (Connections & Resources)
  // ════════════════════════════════════════════════════════
  {
    id: 'metadata',
    name: 'Metadata & Connections',
    description: 'Manage database connections, cloud storage credentials, file schemas, and other resource metadata. Includes connection testing and schema introspection.',
    endpoints: [
      {
        method: 'GET',
        path: '/metadata',
        summary: 'List all metadata items',
        auth: true,
        responseBody: `[
  {
    "id": "uuid",
    "name": "Production DB",
    "type": "database",
    "config": { "host": "db.example.com", "port": 5432, ... },
    "folder_id": "uuid | null"
  }
]`,
      },
      {
        method: 'POST',
        path: '/metadata',
        summary: 'Create metadata item',
        auth: true,
        requestBody: `{
  "name": "Production DB",
  "type": "database",
  "config": {
    "host": "db.example.com",
    "port": 5432,
    "database": "mydb",
    "username": "user",
    "password": "secret",
    "db_type": "postgresql"
  },
  "folder_id": "uuid (optional)"
}`,
      },
      {
        method: 'GET',
        path: '/metadata/:id',
        summary: 'Get metadata item',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Metadata item ID' }],
      },
      {
        method: 'PUT',
        path: '/metadata/:id',
        summary: 'Update metadata item',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Metadata item ID' }],
      },
      {
        method: 'DELETE',
        path: '/metadata/:id',
        summary: 'Delete metadata item',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Metadata item ID' }],
      },
      {
        method: 'POST',
        path: '/metadata/test-connection',
        summary: 'Test database connection',
        description: 'Tests connectivity to a database using the provided configuration. Does not save the connection.',
        requestBody: `{
  "host": "db.example.com",
  "port": 5432,
  "database": "mydb",
  "username": "user",
  "password": "secret",
  "db_type": "postgresql"
}`,
        responseBody: `{
  "success": true,
  "message": "Connection successful"
}`,
      },
      {
        method: 'POST',
        path: '/metadata/introspect-schema',
        summary: 'Introspect database schema',
        description: 'Connects to a database and returns all tables with their columns and types.',
        requestBody: `{
  "host": "db.example.com",
  "port": 5432,
  "database": "mydb",
  "username": "user",
  "password": "secret",
  "db_type": "postgresql"
}`,
      },
      {
        method: 'GET',
        path: '/metadata/:id/tables',
        summary: 'List tables for a saved connection',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Database metadata ID' }],
      },
      {
        method: 'GET',
        path: '/metadata/:id/tables/:table_name/preview',
        summary: 'Preview table data',
        auth: true,
        pathParams: [
          { name: 'id', type: 'UUID', description: 'Database metadata ID' },
          { name: 'table_name', type: 'string', description: 'Table name' },
        ],
      },
      {
        method: 'POST',
        path: '/metadata/test-s3',
        summary: 'Test S3 connection',
        requestBody: `{
  "access_key": "AKIA...",
  "secret_key": "...",
  "region": "us-east-1",
  "bucket": "my-bucket"
}`,
      },
      {
        method: 'POST',
        path: '/metadata/test-gdrive',
        summary: 'Test Google Drive connection (OAuth2)',
      },
      {
        method: 'POST',
        path: '/metadata/test-gdrive-service-account',
        summary: 'Test Google Drive connection (Service Account)',
      },
      {
        method: 'POST',
        path: '/metadata/test-azure',
        summary: 'Test Azure Blob Storage connection',
        requestBody: `{
  "account_name": "myaccount",
  "access_key": "..."
}`,
      },
      {
        method: 'POST',
        path: '/metadata/test-ftp',
        summary: 'Test FTP/SFTP/FTPS connection',
        requestBody: `{
  "host": "ftp.example.com",
  "port": 22,
  "protocol": "sftp",
  "username": "user",
  "password": "secret"
}`,
      },
      {
        method: 'POST',
        path: '/gdrive/auth-url',
        summary: 'Get Google Drive OAuth2 authorization URL',
      },
      {
        method: 'POST',
        path: '/gdrive/exchange-code',
        summary: 'Exchange Google Drive OAuth2 code for tokens',
      },
      {
        method: 'POST',
        path: '/rest/test-token-request',
        summary: 'Test REST API token request',
        description: 'Tests an OAuth2/token endpoint for REST API connections.',
      },
      {
        method: 'POST',
        path: '/azure/introspect',
        summary: 'Introspect Azure Blob container',
        description: 'Lists blobs in an Azure container with metadata.',
      },
      {
        method: 'POST',
        path: '/azure/containers',
        summary: 'List Azure Blob containers',
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 6. MAESTROS (Orchestration)
  // ════════════════════════════════════════════════════════
  {
    id: 'maestros',
    name: 'Maestros',
    description: 'Multi-pipeline orchestration workflows. Compose pipelines into complex workflows with parallel execution, sequential chains, and conditional branching.',
    endpoints: [
      {
        method: 'GET',
        path: '/maestros',
        summary: 'List all maestros',
        auth: true,
        responseBody: `[
  {
    "id": "uuid",
    "name": "Daily ETL Workflow",
    "description": "Extract, transform, and load customer data",
    "steps": [...],
    "created_at": "2025-01-15T10:30:00Z"
  }
]`,
      },
      {
        method: 'POST',
        path: '/maestros',
        summary: 'Create a maestro',
        auth: true,
        requestBody: `{
  "name": "Daily ETL Workflow",
  "description": "...",
  "steps": [
    {
      "type": "pipeline",
      "pipeline_id": "uuid",
      "name": "Extract Customers"
    }
  ]
}`,
      },
      {
        method: 'GET',
        path: '/maestros/:id',
        summary: 'Get maestro by ID',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Maestro ID' }],
      },
      {
        method: 'PUT',
        path: '/maestros/:id',
        summary: 'Update a maestro',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Maestro ID' }],
      },
      {
        method: 'DELETE',
        path: '/maestros/:id',
        summary: 'Delete a maestro',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Maestro ID' }],
      },
      {
        method: 'POST',
        path: '/maestros/:id/run',
        summary: 'Execute maestro (synchronous)',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Maestro ID' }],
      },
      {
        method: 'GET',
        path: '/maestros/:id/run-stream',
        summary: 'Execute maestro (SSE streaming)',
        description: 'Runs the maestro with real-time step-by-step progress via Server-Sent Events.',
        auth: true,
        sse: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Maestro ID' }],
      },
      {
        method: 'POST',
        path: '/maestros/:id/abort',
        summary: 'Abort running maestro',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Maestro ID' }],
      },
      {
        method: 'GET',
        path: '/maestros/:id/executions',
        summary: 'Get maestro execution history',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Maestro ID' }],
      },
      {
        method: 'GET',
        path: '/maestro-executions',
        summary: 'List all maestro executions',
        auth: true,
      },
      {
        method: 'GET',
        path: '/maestro-executions/:id',
        summary: 'Get maestro execution details',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Execution ID' }],
      },
      {
        method: 'GET',
        path: '/maestro-executions/:id/steps',
        summary: 'Get maestro step executions',
        description: 'Returns execution details for each step in the maestro workflow.',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Execution ID' }],
      },
      {
        method: 'GET',
        path: '/maestros/:id/screenshot',
        summary: 'Get maestro screenshot',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Maestro ID' }],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 7. PULSES (Real-Time Streaming)
  // ════════════════════════════════════════════════════════
  {
    id: 'pulses',
    name: 'Pulses',
    description: 'Real-time streaming jobs. Connect to message brokers (Kafka, RabbitMQ, NATS, MQTT) and process events with operators like Map, Filter, Window, and Join.',
    endpoints: [
      {
        method: 'GET',
        path: '/pulses',
        summary: 'List all pulses',
        auth: true,
      },
      {
        method: 'POST',
        path: '/pulses',
        summary: 'Create a pulse',
        auth: true,
        requestBody: `{
  "name": "Event Processor",
  "description": "Process Kafka events in real-time",
  "nodes": [...],
  "edges": [...]
}`,
      },
      {
        method: 'GET',
        path: '/pulses/:id',
        summary: 'Get pulse by ID',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'PUT',
        path: '/pulses/:id',
        summary: 'Update a pulse',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'DELETE',
        path: '/pulses/:id',
        summary: 'Delete a pulse',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'POST',
        path: '/pulses/:id/start',
        summary: 'Start pulse streaming',
        description: 'Begins consuming events from the configured source and processing through operators.',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'POST',
        path: '/pulses/:id/stop',
        summary: 'Stop pulse streaming',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'POST',
        path: '/pulses/:id/pause',
        summary: 'Pause pulse streaming',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'POST',
        path: '/pulses/:id/resume',
        summary: 'Resume paused pulse',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'GET',
        path: '/pulses/:id/status',
        summary: 'Get pulse runtime status',
        description: 'Returns current state (running, paused, stopped), throughput metrics, and error counts.',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'GET',
        path: '/pulses/:id/output',
        summary: 'Stream pulse output (SSE)',
        description: 'Real-time SSE stream of processed events for live monitoring.',
        auth: true,
        sse: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'GET',
        path: '/pulses/:id/screenshot',
        summary: 'Get pulse screenshot',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 8. SCHEDULES
  // ════════════════════════════════════════════════════════
  {
    id: 'schedules',
    name: 'Schedules',
    description: 'Cron-based scheduling for automated pipeline, maestro, and pulse execution.',
    endpoints: [
      {
        method: 'GET',
        path: '/schedules',
        summary: 'List all schedules',
        auth: true,
        responseBody: `[
  {
    "id": "uuid",
    "name": "Daily Customer Sync",
    "cron": "0 6 * * *",
    "target_type": "pipeline",
    "target_id": "uuid",
    "enabled": true,
    "last_run": "2025-02-01T06:00:00Z",
    "next_run": "2025-02-02T06:00:00Z"
  }
]`,
      },
      {
        method: 'POST',
        path: '/schedules',
        summary: 'Create a schedule',
        auth: true,
        requestBody: `{
  "name": "Daily Customer Sync",
  "cron": "0 6 * * *",
  "target_type": "pipeline",
  "target_id": "uuid",
  "enabled": true,
  "timezone": "America/New_York"
}`,
      },
      {
        method: 'GET',
        path: '/schedules/:id',
        summary: 'Get schedule by ID',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Schedule ID' }],
      },
      {
        method: 'PUT',
        path: '/schedules/:id',
        summary: 'Update a schedule',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Schedule ID' }],
      },
      {
        method: 'DELETE',
        path: '/schedules/:id',
        summary: 'Delete a schedule',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Schedule ID' }],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 9. DATA QUALITY TESTS
  // ════════════════════════════════════════════════════════
  {
    id: 'dataquality',
    name: 'Data Quality Tests',
    description: 'Define and run validation rules on node outputs. Tests run inline during pipeline execution and results are tracked in execution history.',
    endpoints: [
      {
        method: 'GET',
        path: '/pipelines/:pipeline_id/nodes/:node_id/tests',
        summary: 'List tests for a node',
        auth: true,
        pathParams: [
          { name: 'pipeline_id', type: 'UUID', description: 'Pipeline ID' },
          { name: 'node_id', type: 'UUID', description: 'Node ID' },
        ],
        responseBody: `[
  {
    "id": "uuid",
    "test_type": "not_null",
    "config": { "column": "email" },
    "failure_action": "abort",
    "threshold": 0
  }
]`,
      },
      {
        method: 'POST',
        path: '/pipelines/:pipeline_id/nodes/:node_id/tests',
        summary: 'Create a test for a node',
        auth: true,
        pathParams: [
          { name: 'pipeline_id', type: 'UUID', description: 'Pipeline ID' },
          { name: 'node_id', type: 'UUID', description: 'Node ID' },
        ],
        requestBody: `{
  "test_type": "not_null",
  "config": { "column": "email" },
  "failure_action": "abort",
  "threshold": 0
}`,
      },
      {
        method: 'PUT',
        path: '/pipelines/:pipeline_id/nodes/:node_id/tests/:test_id',
        summary: 'Update a test',
        auth: true,
        pathParams: [
          { name: 'pipeline_id', type: 'UUID', description: 'Pipeline ID' },
          { name: 'node_id', type: 'UUID', description: 'Node ID' },
          { name: 'test_id', type: 'UUID', description: 'Test ID' },
        ],
      },
      {
        method: 'DELETE',
        path: '/pipelines/:pipeline_id/nodes/:node_id/tests/:test_id',
        summary: 'Delete a test',
        auth: true,
        pathParams: [
          { name: 'pipeline_id', type: 'UUID', description: 'Pipeline ID' },
          { name: 'node_id', type: 'UUID', description: 'Node ID' },
          { name: 'test_id', type: 'UUID', description: 'Test ID' },
        ],
      },
      {
        method: 'POST',
        path: '/pipelines/:pipeline_id/nodes/:node_id/tests/run',
        summary: 'Run all tests for a node',
        auth: true,
        pathParams: [
          { name: 'pipeline_id', type: 'UUID', description: 'Pipeline ID' },
          { name: 'node_id', type: 'UUID', description: 'Node ID' },
        ],
      },
      {
        method: 'GET',
        path: '/pipelines/:pipeline_id/nodes/:node_id/test-runs',
        summary: 'List test run history for a node',
        auth: true,
        pathParams: [
          { name: 'pipeline_id', type: 'UUID', description: 'Pipeline ID' },
          { name: 'node_id', type: 'UUID', description: 'Node ID' },
        ],
      },
      {
        method: 'GET',
        path: '/test-runs/:run_id',
        summary: 'Get test run details',
        auth: true,
        pathParams: [{ name: 'run_id', type: 'UUID', description: 'Test run ID' }],
        responseBody: `{
  "id": "uuid",
  "test_id": "uuid",
  "status": "pass",
  "rows_tested": 10000,
  "rows_passed": 10000,
  "rows_failed": 0,
  "failure_percentage": 0,
  "executed_at": "2025-02-01T14:20:00Z",
  "duration_ms": 45
}`,
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 10. EXECUTION & MONITORING
  // ════════════════════════════════════════════════════════
  {
    id: 'monitor',
    name: 'Execution & Monitoring',
    description: 'Unified execution history across pipelines, maestros, and pulses. View logs, node-level details, and real-time status.',
    endpoints: [
      {
        method: 'GET',
        path: '/monitor/executions',
        summary: 'Unified execution monitor',
        description: 'Returns all executions across pipelines, maestros, and pulses in a single view. Supports filtering and pagination.',
        auth: true,
        queryParams: [
          { name: 'status', type: 'string', description: 'Filter by status: running, success, error, pending', required: false },
          { name: 'type', type: 'string', description: 'Filter by type: pipeline, maestro, pulse', required: false },
          { name: 'limit', type: 'number', description: 'Max results to return', required: false },
        ],
      },
      {
        method: 'GET',
        path: '/executions',
        summary: 'List pipeline executions',
        auth: true,
        responseBody: `[
  {
    "id": "uuid",
    "pipeline_id": "uuid",
    "pipeline_name": "ETL Daily Load",
    "status": "success",
    "started_at": "2025-02-01T06:00:00Z",
    "finished_at": "2025-02-01T06:02:30Z",
    "duration_ms": 150000,
    "node_count": 5
  }
]`,
      },
      {
        method: 'GET',
        path: '/executions/:id/nodes',
        summary: 'Get execution node details',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Execution ID' }],
      },
      {
        method: 'GET',
        path: '/pipelines/:id/executions',
        summary: 'Get executions for a specific pipeline',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'GET',
        path: '/execution-logs/recent',
        summary: 'List recent execution logs',
        auth: true,
      },
      {
        method: 'GET',
        path: '/execution-logs/:type/:id',
        summary: 'Get execution logs',
        auth: true,
        pathParams: [
          { name: 'type', type: 'string', description: 'Log type: pipeline, maestro, pulse' },
          { name: 'id', type: 'UUID', description: 'Execution ID' },
        ],
      },
      {
        method: 'DELETE',
        path: '/execution-logs/:type/:id',
        summary: 'Delete execution logs',
        auth: true,
        pathParams: [
          { name: 'type', type: 'string', description: 'Log type' },
          { name: 'id', type: 'UUID', description: 'Execution ID' },
        ],
      },
    ],
  },


  // ════════════════════════════════════════════════════════
  // 13. CONTEXT VARIABLES
  // ════════════════════════════════════════════════════════
  {
    id: 'context',
    name: 'Context Variables',
    description: 'Runtime key-value variables available during pipeline execution. Variables can be scoped to specific environments.',
    endpoints: [
      {
        method: 'GET',
        path: '/context',
        summary: 'List all context variables',
        auth: true,
        responseBody: `[
  {
    "id": "uuid",
    "key": "output_path",
    "value": "/data/output",
    "environment": "production"
  }
]`,
      },
      {
        method: 'POST',
        path: '/context',
        summary: 'Create a context variable',
        auth: true,
        requestBody: `{
  "key": "output_path",
  "value": "/data/output",
  "environment": "production"
}`,
      },
      {
        method: 'PUT',
        path: '/context/:id',
        summary: 'Update a context variable',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Variable ID' }],
      },
      {
        method: 'DELETE',
        path: '/context/:id',
        summary: 'Delete a context variable',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Variable ID' }],
      },
      {
        method: 'GET',
        path: '/context/environment/:environment',
        summary: 'List variables by environment',
        auth: true,
        pathParams: [{ name: 'environment', type: 'string', description: 'Environment name' }],
      },
      {
        method: 'GET',
        path: '/context/resolve/:environment',
        summary: 'Resolve all variables for environment',
        description: 'Returns the final resolved set of variables for a given environment, including inherited values.',
        auth: true,
        pathParams: [{ name: 'environment', type: 'string', description: 'Environment name' }],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 14. FOLDERS
  // ════════════════════════════════════════════════════════
  {
    id: 'folders',
    name: 'Folders',
    description: 'Organize pipelines, maestros, pulses, and resources into folders with scope-based filtering.',
    endpoints: [
      {
        method: 'GET',
        path: '/folders',
        summary: 'List all folders',
        auth: true,
      },
      {
        method: 'POST',
        path: '/folders',
        summary: 'Create a folder',
        auth: true,
        requestBody: `{
  "name": "ETL Jobs",
  "scope": "pipeline",
  "parent_id": "uuid (optional)"
}`,
      },
      {
        method: 'GET',
        path: '/folders/scope/:scope',
        summary: 'List folders by scope',
        auth: true,
        pathParams: [{ name: 'scope', type: 'string', description: 'Scope: pipeline, maestro, pulse, resource' }],
      },
      {
        method: 'GET',
        path: '/folders/:id',
        summary: 'Get folder by ID',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Folder ID' }],
      },
      {
        method: 'PUT',
        path: '/folders/:id',
        summary: 'Update a folder',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Folder ID' }],
      },
      {
        method: 'DELETE',
        path: '/folders/:id',
        summary: 'Delete a folder',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Folder ID' }],
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 15. IMPORT & EXPORT
  // ════════════════════════════════════════════════════════
  {
    id: 'importexport',
    name: 'Import & Export',
    description: 'Export and import pipelines, maestros, pulses, and resources as portable files. Supports single and batch operations.',
    endpoints: [
      {
        method: 'GET',
        path: '/pipelines/:id/export',
        summary: 'Export pipeline as JSON',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
      },
      {
        method: 'POST',
        path: '/pipelines/:id/export-to-path',
        summary: 'Export pipeline to file path',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pipeline ID' }],
        requestBody: `{
  "path": "/exports/my-pipeline.json"
}`,
      },
      {
        method: 'POST',
        path: '/import/pipeline',
        summary: 'Import pipeline from file upload',
        auth: true,
      },
      {
        method: 'POST',
        path: '/import/pipeline-from-path',
        summary: 'Import pipeline from file path',
        auth: true,
        requestBody: `{
  "path": "/exports/my-pipeline.json"
}`,
      },
      {
        method: 'POST',
        path: '/import/validate',
        summary: 'Validate import file',
        description: 'Validates an import file without actually importing it. Returns any issues found.',
        auth: true,
      },
      {
        method: 'POST',
        path: '/import/batch/pipelines',
        summary: 'Batch import pipelines from directory',
        auth: true,
        requestBody: `{
  "directory": "/exports/pipelines/"
}`,
      },
      {
        method: 'GET',
        path: '/maestros/:id/export',
        summary: 'Export maestro as JSON',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Maestro ID' }],
      },
      {
        method: 'POST',
        path: '/maestros/:id/export-to-path',
        summary: 'Export maestro to file path',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Maestro ID' }],
      },
      {
        method: 'POST',
        path: '/import/maestro',
        summary: 'Import maestro from file upload',
        auth: true,
      },
      {
        method: 'POST',
        path: '/import/maestro-from-path',
        summary: 'Import maestro from file path',
        auth: true,
      },
      {
        method: 'POST',
        path: '/import/batch/maestros',
        summary: 'Batch import maestros from directory',
        auth: true,
      },
      {
        method: 'GET',
        path: '/pulses/:id/export',
        summary: 'Export pulse as JSON',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'POST',
        path: '/pulses/:id/export-to-path',
        summary: 'Export pulse to file path',
        auth: true,
        pathParams: [{ name: 'id', type: 'UUID', description: 'Pulse ID' }],
      },
      {
        method: 'POST',
        path: '/import/pulse',
        summary: 'Import pulse from file upload',
        auth: true,
      },
      {
        method: 'POST',
        path: '/import/pulse-from-path',
        summary: 'Import pulse from file path',
        auth: true,
      },
      {
        method: 'POST',
        path: '/import/batch/pulses',
        summary: 'Batch import pulses from directory',
        auth: true,
      },
      {
        method: 'POST',
        path: '/import/resource',
        summary: 'Import resource from file upload',
        auth: true,
      },
      {
        method: 'POST',
        path: '/import/resource-from-path',
        summary: 'Import resource from file path',
        auth: true,
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 16. GIT INTEGRATION
  // ════════════════════════════════════════════════════════
  {
    id: 'git',
    name: 'Git Integration',
    description: 'Version control integration for pipelines and configurations. Supports GitHub OAuth, commit, push, pull, and diff operations.',
    endpoints: [
      {
        method: 'GET',
        path: '/git/status',
        summary: 'Get repository status',
        auth: true,
        responseBody: `{
  "initialized": true,
  "branch": "main",
  "clean": false,
  "modified_files": ["pipelines/etl.json"],
  "untracked_files": []
}`,
      },
      {
        method: 'POST',
        path: '/git/init',
        summary: 'Initialize git repository',
        auth: true,
      },
      {
        method: 'POST',
        path: '/git/commit',
        summary: 'Create a commit',
        auth: true,
        requestBody: `{
  "message": "Add customer ETL pipeline",
  "files": ["pipelines/etl.json"]
}`,
      },
      {
        method: 'GET',
        path: '/git/history',
        summary: 'Get commit history',
        auth: true,
      },
      {
        method: 'GET',
        path: '/git/diff',
        summary: 'Get working directory diff',
        auth: true,
      },
      {
        method: 'GET',
        path: '/git/diff/:hash',
        summary: 'Get diff for a specific commit',
        auth: true,
        pathParams: [{ name: 'hash', type: 'string', description: 'Commit hash' }],
      },
      {
        method: 'GET',
        path: '/git/config',
        summary: 'Get git configuration',
        auth: true,
      },
      {
        method: 'PUT',
        path: '/git/config',
        summary: 'Update git configuration',
        auth: true,
        requestBody: `{
  "user_name": "Jane Doe",
  "user_email": "jane@example.com",
  "remote_url": "https://github.com/org/repo.git"
}`,
      },
      {
        method: 'GET',
        path: '/git/github/auth-url',
        summary: 'Get GitHub OAuth authorization URL',
        auth: true,
      },
      {
        method: 'POST',
        path: '/git/github/exchange',
        summary: 'Exchange GitHub OAuth code for token',
        auth: true,
      },
      {
        method: 'POST',
        path: '/git/test-connection',
        summary: 'Test remote connection',
        auth: true,
      },
      {
        method: 'POST',
        path: '/git/disconnect',
        summary: 'Disconnect remote repository',
        auth: true,
      },
      {
        method: 'POST',
        path: '/git/push',
        summary: 'Push to remote',
        auth: true,
      },
      {
        method: 'POST',
        path: '/git/pull',
        summary: 'Pull from remote',
        auth: true,
      },
      {
        method: 'POST',
        path: '/git/clone',
        summary: 'Clone a remote repository',
        auth: true,
        requestBody: `{
  "url": "https://github.com/org/repo.git",
  "path": "/projects/my-project"
}`,
      },
      {
        method: 'POST',
        path: '/git/validate-url',
        summary: 'Validate a git remote URL',
        auth: true,
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 17. AI FEATURES
  // ════════════════════════════════════════════════════════
  {
    id: 'ai',
    name: 'AI Features',
    description: 'AI-powered pipeline generation, code assistance, and chat. Supports configurable AI providers (OpenAI, Gemini, etc.).',
    endpoints: [
      {
        method: 'GET',
        path: '/ai/status',
        summary: 'Get AI provider status',
        description: 'Returns whether AI is configured and which provider is active.',
        responseBody: `{
  "configured": true,
  "provider": "gemini",
  "model": "gemini-2.0-flash"
}`,
      },
      {
        method: 'POST',
        path: '/ai/configure',
        summary: 'Configure AI provider',
        requestBody: `{
  "provider": "gemini",
  "api_key": "...",
  "model": "gemini-2.0-flash"
}`,
      },
      {
        method: 'DELETE',
        path: '/ai/settings',
        summary: 'Remove AI configuration',
      },
      {
        method: 'POST',
        path: '/ai/generate',
        summary: 'Generate pipeline from natural language',
        description: 'Describes a data task in plain English and receives a complete pipeline definition.',
        requestBody: `{
  "prompt": "Read customers.csv, filter active customers, write to PostgreSQL"
}`,
        responseBody: `{
  "pipeline": {
    "name": "Customer Load",
    "nodes": [...],
    "edges": [...]
  }
}`,
      },
      {
        method: 'POST',
        path: '/ai/generate/sql',
        summary: 'Generate SQL query',
        requestBody: `{
  "prompt": "Get top 10 customers by revenue",
  "schema": { "tables": [...] }
}`,
      },
      {
        method: 'POST',
        path: '/ai/generate/python',
        summary: 'Generate Python code',
        requestBody: `{
  "prompt": "Clean and normalize phone numbers",
  "input_schema": { "columns": [...] }
}`,
      },
      {
        method: 'POST',
        path: '/ai/chat',
        summary: 'AI chat interface',
        description: 'Conversational AI assistant with context about your pipelines and data.',
        requestBody: `{
  "message": "How can I optimize my ETL pipeline?",
  "context": { "pipeline_id": "uuid" }
}`,
      },
      {
        method: 'POST',
        path: '/ai/chat/clear',
        summary: 'Clear chat history',
      },
      {
        method: 'POST',
        path: '/import/analyze-ai',
        summary: 'Analyze Talend job with AI',
        description: 'Uses AI to analyze and convert Talend job definitions into Odara pipeline format.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 18. PROJECTS
  // ════════════════════════════════════════════════════════
  {
    id: 'projects',
    name: 'Projects',
    description: 'Project management for organizing workspaces. Each project has its own database, pipelines, and settings.',
    endpoints: [
      {
        method: 'GET',
        path: '/projects/current',
        summary: 'Get current project',
      },
      {
        method: 'PUT',
        path: '/projects/current',
        summary: 'Update current project settings',
      },
      {
        method: 'GET',
        path: '/projects/recent',
        summary: 'List recently opened projects',
      },
      {
        method: 'POST',
        path: '/projects',
        summary: 'Create a new project',
        requestBody: `{
  "name": "My Data Project",
  "path": "/projects/my-data-project"
}`,
      },
      {
        method: 'POST',
        path: '/projects/clone',
        summary: 'Clone an existing project',
        requestBody: `{
  "source_path": "/projects/original",
  "target_path": "/projects/clone"
}`,
      },
      {
        method: 'POST',
        path: '/projects/open',
        summary: 'Open a project by path',
        requestBody: `{
  "path": "/projects/my-data-project"
}`,
      },
      {
        method: 'POST',
        path: '/projects/info',
        summary: 'Get project info by path',
      },
      {
        method: 'POST',
        path: '/projects/recent/remove',
        summary: 'Remove project from recent list',
      },
      {
        method: 'GET',
        path: '/projects/legacy/check',
        summary: 'Check for legacy data migration',
      },
      {
        method: 'POST',
        path: '/projects/legacy/migrate',
        summary: 'Migrate legacy data to project format',
      },
      {
        method: 'POST',
        path: '/projects/delete',
        summary: 'Delete a project',
      },
      {
        method: 'GET',
        path: '/project/settings',
        summary: 'Get project settings',
      },
      {
        method: 'PUT',
        path: '/project/settings',
        summary: 'Update project settings',
      },
      {
        method: 'PUT',
        path: '/project/settings/git/credentials',
        summary: 'Update git credentials for project',
      },
      {
        method: 'DELETE',
        path: '/project/settings/git/credentials',
        summary: 'Remove git credentials from project',
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 19. DOCUMENTATION GENERATION
  // ════════════════════════════════════════════════════════
  {
    id: 'docs',
    name: 'Documentation',
    description: 'Auto-generate pipeline documentation with data flow diagrams, schemas, and PDF export.',
    endpoints: [
      {
        method: 'POST',
        path: '/docs/generate',
        summary: 'Generate pipeline documentation',
        auth: true,
        requestBody: `{
  "pipeline_id": "uuid"
}`,
      },
      {
        method: 'POST',
        path: '/docs/project',
        summary: 'Generate project-wide documentation',
        auth: true,
      },
      {
        method: 'POST',
        path: '/docs/generate-ai',
        summary: 'Generate documentation with AI',
        description: 'Uses AI to generate richer, more descriptive documentation from pipeline definitions.',
        auth: true,
      },
      {
        method: 'POST',
        path: '/docs/screenshot',
        summary: 'Upload documentation screenshot',
        auth: true,
      },
      {
        method: 'POST',
        path: '/docs/export-pdf',
        summary: 'Export documentation as PDF',
        auth: true,
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 20. FILES & SETTINGS
  // ════════════════════════════════════════════════════════
  {
    id: 'files',
    name: 'Files & Settings',
    description: 'File browsing, schema inference, and application settings management.',
    endpoints: [
      {
        method: 'POST',
        path: '/files/browse',
        summary: 'Browse local files',
        requestBody: `{
  "path": "/data",
  "pattern": "*.csv"
}`,
      },
      {
        method: 'POST',
        path: '/files/infer-schema',
        summary: 'Infer file schema',
        description: 'Reads a file and infers column names, types, and structure.',
        requestBody: `{
  "path": "/data/customers.csv"
}`,
      },
      {
        method: 'POST',
        path: '/files/detect-magic',
        summary: 'Detect file type',
        description: 'Auto-detects the format of a file (CSV, JSON, Parquet, Excel, XML, etc.).',
        requestBody: `{
  "path": "/data/unknown_file"
}`,
      },
      {
        method: 'GET',
        path: '/settings/:key',
        summary: 'Get a setting value',
        pathParams: [{ name: 'key', type: 'string', description: 'Setting key' }],
      },
      {
        method: 'PUT',
        path: '/settings/:key',
        summary: 'Set a setting value',
        pathParams: [{ name: 'key', type: 'string', description: 'Setting key' }],
        requestBody: `{
  "value": "setting-value"
}`,
      },
      {
        method: 'DELETE',
        path: '/settings/:key',
        summary: 'Delete a setting',
        pathParams: [{ name: 'key', type: 'string', description: 'Setting key' }],
      },
      {
        method: 'GET',
        path: '/health',
        summary: 'Health check',
        description: 'Returns server health status. No authentication required.',
        responseBody: `{
  "status": "ok"
}`,
      },
      {
        method: 'POST',
        path: '/system/pip-install',
        summary: 'Install Python packages',
        description: 'Installs Python packages required by Python transform nodes.',
        auth: true,
        requestBody: `{
  "packages": ["pandas", "numpy"]
}`,
      },
    ],
  },

  // ════════════════════════════════════════════════════════
  // 21. EXAMPLES
  // ════════════════════════════════════════════════════════
  {
    id: 'examples',
    name: 'Examples',
    description: 'Pre-built pipeline and maestro examples that can be imported directly into your project.',
    endpoints: [
      {
        method: 'GET',
        path: '/examples',
        summary: 'List pipeline examples',
        responseBody: `[
  {
    "category": "etl",
    "name": "csv-to-postgres",
    "title": "CSV to PostgreSQL",
    "description": "Load CSV data into PostgreSQL with transforms"
  }
]`,
      },
      {
        method: 'GET',
        path: '/examples/:category/:name',
        summary: 'Get a specific example',
        pathParams: [
          { name: 'category', type: 'string', description: 'Example category' },
          { name: 'name', type: 'string', description: 'Example name' },
        ],
      },
      {
        method: 'POST',
        path: '/examples/:category/:name/import',
        summary: 'Import example into project',
        auth: true,
        pathParams: [
          { name: 'category', type: 'string', description: 'Example category' },
          { name: 'name', type: 'string', description: 'Example name' },
        ],
      },
      {
        method: 'GET',
        path: '/maestro-examples',
        summary: 'List maestro examples',
      },
      {
        method: 'GET',
        path: '/maestro-examples/:name',
        summary: 'Get a maestro example',
        pathParams: [{ name: 'name', type: 'string', description: 'Example name' }],
      },
      {
        method: 'POST',
        path: '/maestro-examples/:name/import',
        summary: 'Import maestro example into project',
        auth: true,
        pathParams: [{ name: 'name', type: 'string', description: 'Example name' }],
      },
    ],
  },
];
