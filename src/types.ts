export interface Skill {
  name: string;
  description: string;
  location: 'project' | 'global';
  path: string;
}

export interface SkillLocation {
  path: string;
  baseDir: string;
  source: string;
}

export interface InstallOptions {
  global?: boolean;
  universal?: boolean;
  yes?: boolean;
}

export interface SkillMetadata {
  name: string;
  description: string;
  context?: string;
}

export interface OpenskillsConfig {
  output?: string;
  template?: string;
  priority?: number;
}

export interface TemplateVariables {
  SKILLS: string;
  PRIORITY: number;
  USAGE_INSTRUCTIONS: string;
  COMMAND: string;
}
