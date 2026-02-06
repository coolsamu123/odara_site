import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
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
}

export interface Persona {
  role: string;
  description: string;
  benefits: string[];
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