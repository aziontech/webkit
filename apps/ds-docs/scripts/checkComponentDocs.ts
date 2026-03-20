#!/usr/bin/env node
/**
 * Component Documentation Completeness Check
 * 
 * Scans src/components and checks whether matching docs pages exist.
 * Warns in CI if a component exists without documentation.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Component info
 */
interface ComponentInfo {
  name: string;
  /** Doc filename without extension (e.g. form-field-text) when using componentNameToSlug */
  docsSlug?: string;
  path: string;
  hasDocs: boolean;
  docsPath: string | null;
  status: 'documented' | 'undocumented' | 'partial';
}

/**
 * Check result
 */
interface CheckResult {
  components: ComponentInfo[];
  summary: {
    total: number;
    documented: number;
    undocumented: number;
    partial: number;
  };
  passed: boolean;
}

/**
 * Options
 */
interface CheckOptions {
  /** Components directory (e.g. packages/webkit/src) */
  componentsDir: string;
  /** Documentation content root (e.g. apps/ds-docs/src/content) */
  docsDir: string;
  /** Content version segment in docs (e.g. "v1" -> docsDir/v1/lang/components) */
  contentVersion?: string;
  /** Convert component path to doc filename (e.g. "core/form/field-text" -> "form-field-text") */
  componentNameToSlug?: (componentPath: string) => string;
  /** File patterns to ignore */
  ignorePatterns?: RegExp[];
  /** Top-level component directory names to skip */
  ignoreComponentDirs?: string[];
  /** Languages to check */
  languages?: string[];
}

/**
 * Default options
 */
const DEFAULT_OPTIONS: CheckOptions = {
  componentsDir: 'src/components',
  docsDir: 'src/content',
  ignorePatterns: [
    /index\.ts$/,
    /index\.js$/,
    /\.d\.ts$/,
    /\.spec\.ts$/,
    /\.test\.ts$/,
    /\.stories\.ts$/,
    /\.stories\.js$/,
  ],
  ignoreComponentDirs: ['demo', 'docs', 'playground', 'search'],
  languages: ['en', 'pt'],
};

/**
 * Get all component directories
 */
function getComponentDirectories(
  dir: string,
  ignorePatterns: RegExp[],
  ignoreDirNames: string[] = []
): string[] {
  const components: string[] = [];

  if (!fs.existsSync(dir)) {
    console.warn(`Components directory not found: ${dir}`);
    return components;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoreDirNames.includes(entry.name)) {
        continue;
      }
      const componentPath = path.join(dir, entry.name);
      
      // Check if this is a component directory (contains .vue or .tsx files)
      const files = fs.readdirSync(componentPath);
      const hasComponent = files.some(
        (f) => /\.(vue|tsx|jsx)$/.test(f) && !ignorePatterns.some((p) => p.test(f))
      );

      if (hasComponent) {
        components.push(entry.name);
      }

      // Also check subdirectories for nested components
      const nestedComponents = getComponentDirectories(
        componentPath,
        ignorePatterns,
        ignoreDirNames
      ).map((c) => `${entry.name}/${c}`);
      components.push(...nestedComponents);
    }
  }

  return components;
}

/**
 * Get all demo component names
 */
function getDemoComponents(dir: string): string[] {
  const components: string[] = [];

  if (!fs.existsSync(dir)) {
    return components;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const componentPath = path.join(dir, entry.name);
      const files = fs.readdirSync(componentPath);
      
      // Check for Vue component files
      const vueFile = files.find((f) => /\.vue$/.test(f));
      if (vueFile) {
        components.push(entry.name);
      }
    }
  }

  return components;
}

/**
 * Check if documentation exists for a component
 */
function checkDocumentationExists(
  componentName: string,
  docsDir: string,
  languages: string[],
  options: { contentVersion?: string; componentNameToSlug?: (n: string) => string } = {}
): { exists: boolean; paths: string[] } {
  const slug = options.componentNameToSlug ? options.componentNameToSlug(componentName) : componentName;
  const possiblePaths: string[] = [];
  const foundPaths: string[] = [];
  const version = options.contentVersion;

  for (const lang of languages) {
    if (version) {
      possiblePaths.push(
        path.join(docsDir, version, lang, 'components', `${slug}.md`),
        path.join(docsDir, version, lang, 'components', `${slug}.mdx`)
      );
    } else {
      possiblePaths.push(
        path.join(docsDir, lang, 'components', `${slug}.md`),
        path.join(docsDir, lang, 'components', `${slug}.mdx`)
      );
    }
  }

  if (!version) {
    possiblePaths.push(
      path.join(docsDir, 'components', `${slug}.md`),
      path.join(docsDir, 'components', `${slug}.mdx`)
    );
  }

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      foundPaths.push(p);
    }
  }

  return {
    exists: foundPaths.length > 0,
    paths: foundPaths,
  };
}

/**
 * Check component documentation completeness
 */
export function checkComponentDocs(options: Partial<CheckOptions> = {}): CheckResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const components: ComponentInfo[] = [];

  // Get all components (excluding ignoreComponentDirs like demo, docs, playground, search)
  const componentNames = getComponentDirectories(
    opts.componentsDir,
    opts.ignorePatterns || [],
    opts.ignoreComponentDirs || []
  );

  // Check documentation for each component
  for (const name of componentNames) {
    const componentPath = path.join(opts.componentsDir, name);
    const docsCheck = checkDocumentationExists(
      name,
      opts.docsDir,
      opts.languages || ['en'],
      {
        contentVersion: opts.contentVersion,
        componentNameToSlug: opts.componentNameToSlug,
      }
    );

    const docsSlug = opts.componentNameToSlug ? opts.componentNameToSlug(name) : undefined;
    const info: ComponentInfo = {
      name,
      docsSlug,
      path: componentPath,
      hasDocs: docsCheck.exists,
      docsPath: docsCheck.paths[0] || null,
      status: docsCheck.exists ? 'documented' : 'undocumented',
    };

    // Check for partial documentation (exists in some languages but not all)
    if (opts.languages && docsCheck.exists) {
      const expectedCount = opts.languages.length;
      const actualCount = new Set(
        docsCheck.paths.map((p) => {
          const match = p.match(/\/([a-z]{2})\//);
          return match ? match[1] : 'en';
        })
      ).size;

      if (actualCount < expectedCount) {
        info.status = 'partial';
      }
    }

    components.push(info);
  }

  // Calculate summary
  const summary = {
    total: components.length,
    documented: components.filter((c) => c.status === 'documented').length,
    undocumented: components.filter((c) => c.status === 'undocumented').length,
    partial: components.filter((c) => c.status === 'partial').length,
  };

  return {
    components,
    summary,
    passed: summary.undocumented === 0,
  };
}

/**
 * Format check result for display
 */
export function formatCheckResult(result: CheckResult): string {
  const lines: string[] = [];

  lines.push('Component Documentation Completeness Check');
  lines.push('='.repeat(50));
  lines.push('');

  // Summary
  lines.push('Summary:');
  lines.push(`  Total components: ${result.summary.total}`);
  lines.push(`  Documented: ${result.summary.documented}`);
  lines.push(`  Partial: ${result.summary.partial}`);
  lines.push(`  Undocumented: ${result.summary.undocumented}`);
  lines.push('');

  // Undocumented components
  const undocumented = result.components.filter((c) => c.status === 'undocumented');
  if (undocumented.length > 0) {
    lines.push('Undocumented Components:');
    lines.push('-'.repeat(50));

    const contentVersion = 'v1';
    for (const component of undocumented) {
      const slug = component.docsSlug ?? component.name.replace(/\//g, '-');
      lines.push(`  ❌ ${component.name}`);
      lines.push(`     Path: ${component.path}`);
      lines.push(`     Create: src/content/${contentVersion}/en/components/${slug}.mdx`);
    }
    lines.push('');
  }

  // Partially documented components
  const partial = result.components.filter((c) => c.status === 'partial');
  if (partial.length > 0) {
    lines.push('Partially Documented Components:');
    lines.push('-'.repeat(50));

    for (const component of partial) {
      lines.push(`  ⚠️  ${component.name}`);
      lines.push(`     Path: ${component.path}`);
      lines.push(`     Docs: ${component.docsPath}`);
    }
    lines.push('');
  }

  // Documented components
  const documented = result.components.filter((c) => c.status === 'documented');
  if (documented.length > 0) {
    lines.push('Documented Components:');
    lines.push('-'.repeat(50));

    for (const component of documented) {
      lines.push(`  ✅ ${component.name}`);
    }
  }

  lines.push('');
  lines.push(result.passed ? '✅ All components documented' : '❌ Some components lack documentation');

  return lines.join('\n');
}

/**
 * Generate JSON report
 */
export function generateJsonReport(result: CheckResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Main function for CLI
 * When run from apps/ds-docs, checks packages/webkit/src components against ds-docs content.
 */
async function main() {
  const args = process.argv.slice(2);
  const outputJson = args.includes('--json');
  const outputMarkdown = args.includes('--md');

  const cwd = process.cwd();
  // Source: webkit package components (design system)
  const webkitSrc = path.resolve(cwd, '../../packages/webkit/src');
  const componentsDir = fs.existsSync(webkitSrc) ? webkitSrc : path.join(cwd, 'src/components');
  // Docs: ds-docs content (v1/en|pt/components)
  const docsDir = path.join(cwd, 'src/content');

  const result = checkComponentDocs({
    componentsDir,
    docsDir,
    contentVersion: 'v1',
    componentNameToSlug: (name) =>
      name.replace(/^(core|components)\//, '').replace(/\//g, '-'),
    ignoreComponentDirs: componentsDir === webkitSrc ? [] : ['demo', 'docs', 'playground', 'search'],
  });

  if (outputJson) {
    console.log(generateJsonReport(result));
  } else if (outputMarkdown) {
    console.log(generateMarkdownReport(result));
  } else {
    console.log(formatCheckResult(result));
  }

  // Exit with error code if check failed
  if (!result.passed) {
    process.exit(1);
  }
}

/**
 * Generate Markdown report
 */
function generateMarkdownReport(result: CheckResult): string {
  const lines: string[] = [];

  lines.push('# Component Documentation Coverage Report');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`| Status | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total | ${result.summary.total} |`);
  lines.push(`| Documented | ${result.summary.documented} |`);
  lines.push(`| Partial | ${result.summary.partial} |`);
  lines.push(`| Undocumented | ${result.summary.undocumented} |`);
  lines.push('');

  if (result.summary.undocumented > 0) {
    lines.push('## Undocumented Components');
    lines.push('');
    lines.push('| Component | Path |');
    lines.push('|-----------|------|');
    
    for (const component of result.components.filter((c) => c.status === 'undocumented')) {
      lines.push(`| ${component.name} | \`${component.path}\` |`);
    }
    lines.push('');
  }

  if (result.summary.partial > 0) {
    lines.push('## Partially Documented Components');
    lines.push('');
    lines.push('| Component | Docs Path |');
    lines.push('|-----------|-----------|');
    
    for (const component of result.components.filter((c) => c.status === 'partial')) {
      lines.push(`| ${component.name} | \`${component.docsPath}\` |`);
    }
    lines.push('');
  }

  lines.push('## Documented Components');
  lines.push('');
  
  for (const component of result.components.filter((c) => c.status === 'documented')) {
    lines.push(`- ${component.name}`);
  }

  return lines.join('\n');
}

// Run main function if executed directly (CJS or ESM)
const isMain =
  typeof require !== 'undefined' && require.main === module ||
  (process.argv[1] && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]));
if (isMain) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { CheckResult, ComponentInfo, CheckOptions };
