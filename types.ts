import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  isRoute?: boolean;
}

export interface NodeType {
  id: string;
  category: 'Source' | 'Transform' | 'Target' | 'Control';
  name: string;
  description: string;
  icon?: LucideIcon;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  tags?: string[];
}

export interface AIExample {
  id: string;
  label: string;
  prompt: string;
  code: string;
  language: 'sql' | 'python' | 'pipeline';
  pipelineScreenshot: string;
  codeScreenshot?: string;
}

export interface Persona {
  role: string;
  description: string;
  benefits: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  /** Path under public/, e.g. 'testimonials/mauro-porcaro.jpg'. */
  avatar: string;
  /** Optional LinkedIn profile URL. */
  linkedin?: string;
  /** Optional recognition badge, e.g. 'Early Adopter'. */
  tag?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  /** Discriminator. Defaults to 'video' so existing entries keep working. */
  kind?: 'video' | 'walkthrough';
  /** Video kind: YouTube video ID (the part after watch?v= ). */
  youtubeId?: string;
  /** Optional display duration, e.g. "8:32" */
  duration?: string;
  /** Walkthrough kind: URL slug under /tutorials/<slug> (also the public folder name). */
  slug?: string;
  /** Walkthrough kind: cover screenshot path, relative to /tutorials/<slug>/. */
  cover?: string;
  /** Walkthrough kind: estimated reading time in minutes. */
  estimatedMin?: number;
}

export enum PageSection {
  HOME = 'home',
  AI = 'ai',
  FEATURES = 'features',
  NODES = 'nodes',
  USERS = 'users',
  TECH = 'tech',
  COMMUNITY = 'community'
}