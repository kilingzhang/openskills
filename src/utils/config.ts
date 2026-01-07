import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { OpenskillsConfig } from '../types.js';

/**
 * Load openskills configuration from .openskillsrc.json or .openskillsrc
 */
export function loadConfig(cwd: string = process.cwd()): OpenskillsConfig | null {
  const configPaths = [
    join(cwd, '.openskillsrc.json'),
    join(cwd, '.openskillsrc'),
  ];

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, 'utf-8');
        const config = JSON.parse(content) as OpenskillsConfig;
        return config;
      } catch (error) {
        console.warn(`Warning: Failed to parse config file ${configPath}`);
        return null;
      }
    }
  }

  return null;
}

/**
 * Merge CLI options with config file options
 * CLI options take precedence over config file
 */
export function mergeOptions<T extends Record<string, any>>(
  cliOptions: T,
  config: OpenskillsConfig | null
): T {
  if (!config) {
    return cliOptions;
  }

  const merged = { ...cliOptions };

  // Only use config values if CLI option is not provided
  if (!merged.output && config.output) {
    merged.output = config.output;
  }
  if (!merged.template && config.template) {
    merged.template = config.template;
  }

  return merged;
}
