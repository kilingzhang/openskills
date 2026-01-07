import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  loadTemplate,
  renderTemplate,
  generateTemplateVariables,
  DEFAULT_TEMPLATE,
} from '../../src/utils/template.js';
import type { Skill, TemplateVariables } from '../../src/types.js';

const testId = Math.random().toString(36).slice(2);
const testTempDir = join(tmpdir(), `openskills-template-test-${testId}`);

describe('template utilities', () => {
  beforeEach(() => {
    mkdirSync(testTempDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testTempDir, { recursive: true, force: true });
  });

  describe('loadTemplate', () => {
    it('should return default template when no path provided', () => {
      const template = loadTemplate();
      expect(template).toBe(DEFAULT_TEMPLATE);
      expect(template).toContain('{{SKILLS}}');
      expect(template).toContain('{{PRIORITY}}');
    });

    it('should load template from file', () => {
      const customTemplate = 'Custom template with {{SKILLS}} and {{PRIORITY}}';
      const templatePath = join(testTempDir, 'custom.md');
      writeFileSync(templatePath, customTemplate);

      const template = loadTemplate(templatePath);
      expect(template).toBe(customTemplate);
    });

    it('should throw error for non-existent template', () => {
      const nonExistentPath = join(testTempDir, 'does-not-exist.md');
      expect(() => loadTemplate(nonExistentPath)).toThrow('Template file not found');
    });
  });

  describe('renderTemplate', () => {
    it('should replace template variables', () => {
      const template = 'Priority: {{PRIORITY}}, Skills: {{SKILLS}}';
      const variables: TemplateVariables = {
        SKILLS: '<skill>test</skill>',
        PRIORITY: 1,
        USAGE_INSTRUCTIONS: 'Use skills wisely',
        COMMAND: 'openskills read',
      };

      const rendered = renderTemplate(template, variables);
      expect(rendered).toBe('Priority: 1, Skills: <skill>test</skill>');
    });

    it('should handle multiple occurrences of same variable', () => {
      const template = '{{COMMAND}} {{COMMAND}} {{COMMAND}}';
      const variables: TemplateVariables = {
        SKILLS: '',
        PRIORITY: 1,
        USAGE_INSTRUCTIONS: '',
        COMMAND: 'openskills read',
      };

      const rendered = renderTemplate(template, variables);
      expect(rendered).toBe('openskills read openskills read openskills read');
    });

    it('should leave unmatched placeholders as-is', () => {
      const template = '{{SKILLS}} {{UNKNOWN}}';
      const variables: TemplateVariables = {
        SKILLS: 'test',
        PRIORITY: 1,
        USAGE_INSTRUCTIONS: '',
        COMMAND: 'cmd',
      };

      const rendered = renderTemplate(template, variables);
      expect(rendered).toContain('test');
      expect(rendered).toContain('{{UNKNOWN}}');
    });
  });

  describe('generateTemplateVariables', () => {
    it('should generate variables from skills', () => {
      const skills: Skill[] = [
        { name: 'pdf', description: 'PDF tools', location: 'project', path: '/path' },
        { name: 'xlsx', description: 'Excel tools', location: 'global', path: '/path2' },
      ];

      const variables = generateTemplateVariables(skills, 2, 'custom-cmd');

      expect(variables.PRIORITY).toBe(2);
      expect(variables.COMMAND).toBe('custom-cmd');
      expect(variables.SKILLS).toContain('<name>pdf</name>');
      expect(variables.SKILLS).toContain('<name>xlsx</name>');
      expect(variables.USAGE_INSTRUCTIONS).toContain('custom-cmd');
    });

    it('should use default values when not provided', () => {
      const skills: Skill[] = [];
      const variables = generateTemplateVariables(skills);

      expect(variables.PRIORITY).toBe(1);
      expect(variables.COMMAND).toBe('openskills read');
      expect(variables.SKILLS).toBe('');
    });
  });

  describe('default template structure', () => {
    it('should contain all required placeholders', () => {
      expect(DEFAULT_TEMPLATE).toContain('{{SKILLS}}');
      expect(DEFAULT_TEMPLATE).toContain('{{PRIORITY}}');
      expect(DEFAULT_TEMPLATE).toContain('{{USAGE_INSTRUCTIONS}}');
    });

    it('should have skills_system wrapper', () => {
      expect(DEFAULT_TEMPLATE).toContain('<skills_system');
      expect(DEFAULT_TEMPLATE).toContain('</skills_system>');
    });

    it('should have markers for replacement', () => {
      expect(DEFAULT_TEMPLATE).toContain('<!-- SKILLS_TABLE_START -->');
      expect(DEFAULT_TEMPLATE).toContain('<!-- SKILLS_TABLE_END -->');
    });
  });
});
