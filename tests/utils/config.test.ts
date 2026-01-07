import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { loadConfig, mergeOptions } from '../../src/utils/config.js';
import type { OpenskillsConfig } from '../../src/types.js';

const testId = Math.random().toString(36).slice(2);
const testTempDir = join(tmpdir(), `openskills-config-test-${testId}`);

describe('config utilities', () => {
  beforeEach(() => {
    mkdirSync(testTempDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testTempDir, { recursive: true, force: true });
  });

  describe('loadConfig', () => {
    it('should return null when no config file exists', () => {
      const config = loadConfig(testTempDir);
      expect(config).toBeNull();
    });

    it('should load .openskillsrc.json', () => {
      const configData: OpenskillsConfig = {
        output: '.github/AGENTS.mdc',
        template: 'template.md',
        priority: 2,
      };
      
      writeFileSync(
        join(testTempDir, '.openskillsrc.json'),
        JSON.stringify(configData, null, 2)
      );

      const config = loadConfig(testTempDir);
      expect(config).toEqual(configData);
    });

    it('should load .openskillsrc', () => {
      const configData: OpenskillsConfig = {
        output: 'AGENTS.md',
        template: 'custom.md',
      };
      
      writeFileSync(
        join(testTempDir, '.openskillsrc'),
        JSON.stringify(configData, null, 2)
      );

      const config = loadConfig(testTempDir);
      expect(config).toEqual(configData);
    });

    it('should prefer .openskillsrc.json over .openskillsrc', () => {
      const config1: OpenskillsConfig = { output: 'from-json' };
      const config2: OpenskillsConfig = { output: 'from-no-ext' };
      
      writeFileSync(
        join(testTempDir, '.openskillsrc.json'),
        JSON.stringify(config1)
      );
      writeFileSync(
        join(testTempDir, '.openskillsrc'),
        JSON.stringify(config2)
      );

      const config = loadConfig(testTempDir);
      expect(config?.output).toBe('from-json');
    });

    it('should handle invalid JSON gracefully', () => {
      writeFileSync(
        join(testTempDir, '.openskillsrc.json'),
        'invalid json {'
      );

      const config = loadConfig(testTempDir);
      expect(config).toBeNull();
    });
  });

  describe('mergeOptions', () => {
    it('should return CLI options when no config', () => {
      const cliOptions = { output: 'cli.md', template: 'cli-template.md' };
      const merged = mergeOptions(cliOptions, null);
      expect(merged).toEqual(cliOptions);
    });

    it('should prefer CLI options over config', () => {
      const cliOptions = { output: 'cli.md', template: undefined };
      const config: OpenskillsConfig = { 
        output: 'config.md', 
        template: 'config-template.md' 
      };

      const merged = mergeOptions(cliOptions, config);
      expect(merged.output).toBe('cli.md');
      expect(merged.template).toBe('config-template.md');
    });

    it('should use config values when CLI options not provided', () => {
      const cliOptions = { yes: true };
      const config: OpenskillsConfig = { 
        output: 'config.md', 
        template: 'config-template.md' 
      };

      const merged = mergeOptions(cliOptions, config);
      expect(merged.output).toBe('config.md');
      expect(merged.template).toBe('config-template.md');
      expect(merged.yes).toBe(true);
    });

    it('should handle empty config object', () => {
      const cliOptions = { output: 'cli.md' };
      const config: OpenskillsConfig = {};

      const merged = mergeOptions(cliOptions, config);
      expect(merged).toEqual(cliOptions);
    });

    it('should merge priority from config', () => {
      const cliOptions = { yes: true };
      const config: OpenskillsConfig = { priority: 5 };

      const merged = mergeOptions(cliOptions, config);
      expect(merged.priority).toBe(5);
      expect(merged.yes).toBe(true);
    });

    it('should not override priority if CLI provides it', () => {
      const cliOptions = { priority: 3 };
      const config: OpenskillsConfig = { priority: 5 };

      const merged = mergeOptions(cliOptions, config);
      expect(merged.priority).toBe(3);
    });
  });
});
