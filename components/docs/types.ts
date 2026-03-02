import { LucideIcon } from 'lucide-react';

export interface DocSection {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  comingSoon?: boolean;
}

export interface Screenshot {
  src: string;
  alt: string;
  caption: string;
}

export interface DocFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ShortcutEntry {
  keys: string;
  action: string;
}

export interface NodeEntry {
  id: string;
  name: string;
  category: 'Source' | 'Transform' | 'Target' | 'Control';
  subcategory: string;
  description: string;
  icon: LucideIcon;
  configHighlights?: string[];
}

export interface DocSectionContent {
  overview: string;
  features: DocFeature[];
  screenshots: Screenshot[];
  shortcuts?: ShortcutEntry[];
  subsections?: { title: string; content: string }[];
}

// ─── API Reference Types ───────────────────────────────────

export interface ApiParam {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description?: string;
  auth?: boolean;
  pathParams?: ApiParam[];
  queryParams?: ApiParam[];
  requestBody?: string;
  responseBody?: string;
  sse?: boolean;
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
}
