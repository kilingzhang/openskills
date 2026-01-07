import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import type { Skill, TemplateVariables } from '../types.js';

/**
 * Default template for AGENTS.md
 */
export const DEFAULT_TEMPLATE = `<skills_system priority="{{PRIORITY}}">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
{{USAGE_INSTRUCTIONS}}
</usage>

<available_skills>

{{SKILLS}}

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>`;

/**
 * Default usage instructions
 */
export const DEFAULT_USAGE_INSTRUCTIONS = `When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: Bash("{{COMMAND}} <skill-name>")
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless`;

/**
 * Generate skill XML tags
 */
export function generateSkillTags(skills: Skill[]): string {
  return skills
    .map(
      (s) => `<skill>
<name>${s.name}</name>
<description>${s.description}</description>
<location>${s.location}</location>
</skill>`
    )
    .join('\n\n');
}

/**
 * Load template from file or use default
 */
export function loadTemplate(templatePath?: string): string {
  if (!templatePath) {
    return DEFAULT_TEMPLATE;
  }

  const resolvedPath = resolve(templatePath);
  
  if (!existsSync(resolvedPath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  return readFileSync(resolvedPath, 'utf-8');
}

/**
 * Render template with variables
 */
export function renderTemplate(template: string, variables: TemplateVariables): string {
  let rendered = template;

  // Replace all template variables
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    rendered = rendered.split(placeholder).join(String(value));
  }

  return rendered;
}

/**
 * Generate template variables from skills
 */
export function generateTemplateVariables(
  skills: Skill[],
  priority: number = 1,
  command: string = 'openskills read'
): TemplateVariables {
  const skillTags = generateSkillTags(skills);
  const usageInstructions = DEFAULT_USAGE_INSTRUCTIONS.replace('{{COMMAND}}', command);

  return {
    SKILLS: skillTags,
    PRIORITY: priority,
    USAGE_INSTRUCTIONS: usageInstructions,
    COMMAND: command,
  };
}
