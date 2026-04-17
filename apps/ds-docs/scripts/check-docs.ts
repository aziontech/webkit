#!/usr/bin/env node
/**
 * Unified Documentation Check Script
 * 
 * Runs all documentation validation checks:
 * - Frontmatter validation
 * - Documentation lint
 * - Link checking
 * - Content rules
 * - Component documentation coverage
 */

import * as fs from 'fs';
import * as path from 'path';

// Import validation modules (these would be proper imports in a real setup)
// For now, we'll implement inline

/**
 * Check mode
 */
type CheckMode = 'lint' | 'links' | 'rules' | 'coverage' | 'all';

/**
 * Check result
 */
interface CheckResult {
  name: string;
  passed: boolean;
  errors: number;
  warnings: number;
  message: string;
}

/**
 * Get all markdown files in a directory
 */
function getMarkdownFiles(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      getMarkdownFiles(fullPath, files);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Parse frontmatter from content
 */
function parseFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter: Record<string, unknown> = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    // Simple parsing
    if (value === 'true') {
      frontmatter[key] = true;
    } else if (value === 'false') {
      frontmatter[key] = false;
    } else if (!isNaN(Number(value))) {
      frontmatter[key] = Number(value);
    } else if (value.startsWith('[')) {
      frontmatter[key] = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/['"]/g, ''));
    } else {
      frontmatter[key] = value.replace(/['"]/g, '');
    }
  }

  return frontmatter;
}

/**
 * Check frontmatter validation (aligned with src/content/config.ts schema)
 */
function checkFrontmatter(files: string[]): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const requiredFields = ['title', 'description', 'type'];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
      errors.push(`${file}: Missing frontmatter`);
      continue;
    }

    for (const field of requiredFields) {
      if (!(field in frontmatter)) {
        errors.push(`${file}: Missing required field '${field}'`);
      }
    }
  }

  return {
    name: 'Frontmatter Validation',
    passed: errors.length === 0,
    errors: errors.length,
    warnings: warnings.length,
    message: errors.length === 0
      ? 'All files have valid frontmatter'
      : `Found ${errors.length} frontmatter errors`,
  };
}

/**
 * Check for broken links
 */
function checkLinks(files: string[]): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;

  // Build a set of all known paths
  const knownPaths = new Set(
    files.map((f) => f.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/'))
  );

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = Array.from(content.matchAll(linkRegex));

    for (const match of matches) {
      const url = match[2];

      // Skip external links and anchors
      if (url.startsWith('http') || url.startsWith('#')) continue;

      // Check if internal link exists
      const targetPath = path.join(path.dirname(file), url)
        .replace(/\.md$/, '')
        .replace(/\.mdx$/, '');

      if (!knownPaths.has(targetPath.replace(/\\/g, '/'))) {
        // This is a simplified check - real implementation would be more thorough
        warnings.push(`${file}: Potentially broken link to '${url}'`);
      }
    }
  }

  return {
    name: 'Link Validation',
    passed: true, // Links are warnings, not errors
    errors: errors.length,
    warnings: warnings.length,
    message: warnings.length === 0
      ? 'No broken links found'
      : `Found ${warnings.length} potential broken links`,
  };
}

/**
 * Check content rules
 */
function checkContentRules(files: string[]): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const file of files) {
    // Only check component files
    if (!file.includes('/components/') && !file.includes('\\components\\')) continue;

    const content = fs.readFileSync(file, 'utf-8').toLowerCase();

    // Check for required sections
    if (!content.includes('## overview') && !content.includes('## introduction')) {
      warnings.push(`${file}: Missing Overview section`);
    }

    if (!content.includes('## examples') && !content.includes('## usage')) {
      warnings.push(`${file}: Missing Examples section`);
    }

    if (!content.includes('## accessibility') && !content.includes('## a11y')) {
      warnings.push(`${file}: Missing Accessibility section`);
    }
  }

  return {
    name: 'Content Rules',
    passed: true, // Content rules are warnings
    errors: errors.length,
    warnings: warnings.length,
    message: warnings.length === 0
      ? 'All content rules satisfied'
      : `Found ${warnings.length} content rule violations`,
  };
}

/**
 * Check component documentation coverage
 */
function checkComponentCoverage(): CheckResult {
  const componentsDir = 'src/components';
  const docsDir = 'src/content';

  let totalComponents = 0;
  let documentedComponents = 0;

  // Check demo components
  const demoDir = path.join(componentsDir, 'demo');
  if (fs.existsSync(demoDir)) {
    const entries = fs.readdirSync(demoDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        totalComponents++;

        // Check if documentation exists
        const docPath = path.join(docsDir, 'components', `${entry.name}.md`);
        const docPathMdx = path.join(docsDir, 'components', `${entry.name}.mdx`);

        if (fs.existsSync(docPath) || fs.existsSync(docPathMdx)) {
          documentedComponents++;
        }
      }
    }
  }

  const undocumented = totalComponents - documentedComponents;

  return {
    name: 'Component Documentation Coverage',
    passed: undocumented === 0,
    errors: undocumented,
    warnings: 0,
    message: `${documentedComponents}/${totalComponents} components documented`,
  };
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const mode: CheckMode = (args.find((a) => !a.startsWith('--')) as CheckMode) || 'all';

  console.log('Documentation Governance Check');
  console.log('='.repeat(50));
  console.log('');

  const cwd = process.cwd();
  const contentDir = path.join(cwd, 'src/content');

  // Get all markdown files
  const files = getMarkdownFiles(contentDir);
  console.log(`Found ${files.length} documentation files`);
  console.log('');

  const results: CheckResult[] = [];

  // Run checks based on mode
  if (mode === 'lint' || mode === 'all') {
    results.push(checkFrontmatter(files));
  }

  if (mode === 'links' || mode === 'all') {
    results.push(checkLinks(files));
  }

  if (mode === 'rules' || mode === 'all') {
    results.push(checkContentRules(files));
  }

  if (mode === 'coverage' || mode === 'all') {
    results.push(checkComponentCoverage());
  }

  // Print results
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const result of results) {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}`);
    if (result.errors > 0) {
      console.log(`   Errors: ${result.errors}`);
    }
    if (result.warnings > 0) {
      console.log(`   Warnings: ${result.warnings}`);
    }
    console.log('');

    totalErrors += result.errors;
    totalWarnings += result.warnings;
  }

  // Summary
  console.log('='.repeat(50));
  console.log(`Total Errors: ${totalErrors}`);
  console.log(`Total Warnings: ${totalWarnings}`);
  console.log('');

  const exitCode = totalErrors > 0 ? 1 : 0;
  if (exitCode !== 0) {
    console.log('❌ Documentation check failed');
  } else {
    console.log('✅ Documentation check passed');
  }
  process.exit(exitCode);
}

// Run main function
main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error('Error:', message);
  process.exit(1);
});
