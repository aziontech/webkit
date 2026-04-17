/**
 * Documentation Lint System
 * 
 * Comprehensive linter for documentation quality checks including:
 * - Missing frontmatter
 * - Duplicate titles
 * - Duplicate slugs
 * - Missing descriptions
 * - Missing section metadata
 */

import { validateFrontmatter, type FrontmatterValidationResult } from './validateFrontmatter';

/**
 * Lint issue severity
 */
export type LintSeverity = 'error' | 'warning' | 'info';

/**
 * Lint issue type
 */
export type LintIssueType =
  | 'missing-frontmatter'
  | 'missing-title'
  | 'missing-description'
  | 'missing-section'
  | 'duplicate-title'
  | 'duplicate-slug'
  | 'invalid-frontmatter'
  | 'missing-content'
  | 'short-description'
  | 'missing-tags'
  | 'broken-link'
  | 'missing-overview'
  | 'missing-examples'
  | 'missing-accessibility';

/**
 * Lint issue interface
 */
export interface LintIssue {
  type: LintIssueType;
  severity: LintSeverity;
  message: string;
  filePath: string;
  line?: number;
  column?: number;
  field?: string;
  suggestion?: string;
}

/**
 * Lint result for a single file
 */
export interface FileLintResult {
  filePath: string;
  issues: LintIssue[];
  valid: boolean;
}

/**
 * Lint result for all files
 */
export interface LintResult {
  files: FileLintResult[];
  summary: {
    totalFiles: number;
    validFiles: number;
    invalidFiles: number;
    totalIssues: number;
    errors: number;
    warnings: number;
    info: number;
  };
  passed: boolean;
}

/**
 * Lint options
 */
export interface LintOptions {
  /** Minimum description length */
  minDescriptionLength?: number;
  /** Warn about missing tags */
  warnMissingTags?: boolean;
  /** Check for duplicate titles */
  checkDuplicateTitles?: boolean;
  /** Check for duplicate slugs */
  checkDuplicateSlugs?: boolean;
  /** Validate frontmatter strictly */
  strictFrontmatter?: boolean;
  /** File patterns to include */
  include?: string[];
  /** File patterns to exclude */
  exclude?: string[];
}

/**
 * Default lint options
 */
const DEFAULT_LINT_OPTIONS: LintOptions = {
  minDescriptionLength: 20,
  warnMissingTags: true,
  checkDuplicateTitles: true,
  checkDuplicateSlugs: true,
  strictFrontmatter: true,
};

/**
 * Documentation file representation
 */
export interface DocFile {
  path: string;
  content: string;
  frontmatter: Record<string, unknown> | null;
  rawFrontmatter: string | null;
  body: string;
}

/**
 * Parse frontmatter from markdown content
 */
export function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown> | null;
  rawFrontmatter: string | null;
  body: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      frontmatter: null,
      rawFrontmatter: null,
      body: content,
    };
  }

  const rawFrontmatter = match[1];
  const body = match[2];

  // Simple YAML-like parsing for frontmatter
  const frontmatter: Record<string, unknown> = {};
  const lines = rawFrontmatter.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();
    
    // Parse value based on format
    const parsedValue = parseYamlValue(rawValue);
    frontmatter[key] = parsedValue;
  }

  return {
    frontmatter,
    rawFrontmatter,
    body,
  };
}

/**
 * Parse a YAML-like value
 */
function parseYamlValue(rawValue: string): unknown {
  // Empty or array literal
  if (rawValue === '[]' || rawValue === '') {
    return [];
  }
  
  // Array format [item1, item2]
  if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
    return rawValue
      .slice(1, -1)
      .split(',')
      .map((v) => v.trim().replace(/^["']|["']$/g, ''))
      .filter((v) => v !== '');
  }
  
  // Boolean true
  if (rawValue === 'true') {
    return true;
  }
  
  // Boolean false
  if (rawValue === 'false') {
    return false;
  }
  
  // Number
  if (!isNaN(Number(rawValue)) && rawValue !== '') {
    return Number(rawValue);
  }
  
  // String (remove surrounding quotes)
  return rawValue.replace(/^["']|["']$/g, '');
}

/**
 * Create a DocFile from file content
 */
export function createDocFile(filePath: string, content: string): DocFile {
  const { frontmatter, rawFrontmatter, body } = parseFrontmatter(content);
  return {
    path: filePath,
    content,
    frontmatter,
    rawFrontmatter,
    body,
  };
}

/**
 * Lint a single documentation file
 */
export function lintFile(
  file: DocFile,
  options: LintOptions = {}
): FileLintResult {
  const opts = { ...DEFAULT_LINT_OPTIONS, ...options };
  const issues: LintIssue[] = [];

  // Check for missing frontmatter
  if (!file.frontmatter) {
    issues.push({
      type: 'missing-frontmatter',
      severity: 'error',
      message: 'Missing frontmatter section',
      filePath: file.path,
      line: 1,
      suggestion: 'Add frontmatter with required fields: title, description, section, version, language',
    });

    return {
      filePath: file.path,
      issues,
      valid: false,
    };
  }

  // Validate frontmatter
  const frontmatterResult = validateFrontmatter(file.frontmatter, {
    strictTypes: opts.strictFrontmatter,
    warnRecommended: true,
    filePath: file.path,
  });

  // Convert frontmatter validation issues to lint issues
  for (const error of frontmatterResult.errors) {
    issues.push({
      type: 'invalid-frontmatter',
      severity: 'error',
      message: error.message,
      filePath: file.path,
      field: error.field,
    });
  }

  for (const warning of frontmatterResult.warnings) {
    issues.push({
      type: 'invalid-frontmatter',
      severity: 'warning',
      message: warning.message,
      filePath: file.path,
      field: warning.field,
    });
  }

  // Check description length
  const description = file.frontmatter.description;
  if (description && typeof description === 'string') {
    if (description.length < (opts.minDescriptionLength || 20)) {
      issues.push({
        type: 'short-description',
        severity: 'warning',
        message: `Description is too short (${description.length} chars). Minimum recommended: ${opts.minDescriptionLength}`,
        filePath: file.path,
        suggestion: 'Expand the description to provide more context',
      });
    }
  }

  // Check for missing tags
  if (opts.warnMissingTags && !file.frontmatter.tags) {
    issues.push({
      type: 'missing-tags',
      severity: 'info',
      message: 'Missing tags field. Tags improve searchability',
      filePath: file.path,
      suggestion: 'Add relevant tags to improve documentation discoverability',
    });
  }

  // Check for missing content
  if (!file.body.trim()) {
    issues.push({
      type: 'missing-content',
      severity: 'error',
      message: 'Document has no content after frontmatter',
      filePath: file.path,
      suggestion: 'Add content to the document',
    });
  }

  return {
    filePath: file.path,
    issues,
    valid: !issues.some((issue) => issue.severity === 'error'),
  };
}

/**
 * Check for duplicate titles across files
 */
export function checkDuplicateTitles(files: DocFile[]): LintIssue[] {
  const issues: LintIssue[] = [];
  const titleMap = new Map<string, string[]>();

  for (const file of files) {
    const title = file.frontmatter?.title;
    if (title && typeof title === 'string') {
      const paths = titleMap.get(title) || [];
      paths.push(file.path);
      titleMap.set(title, paths);
    }
  }

  titleMap.forEach((paths, title) => {
    if (paths.length > 1) {
      for (const path of paths) {
        issues.push({
          type: 'duplicate-title',
          severity: 'warning',
          message: `Duplicate title "${title}" found in ${paths.length} files`,
          filePath: path,
          suggestion: 'Use unique titles for each document to avoid confusion',
        });
      }
    }
  });

  return issues;
}

/**
 * Check for duplicate slugs across files
 */
export function checkDuplicateSlugs(files: DocFile[]): LintIssue[] {
  const issues: LintIssue[] = [];
  const slugMap = new Map<string, string[]>();

  for (const file of files) {
    // Generate slug from file path
    const slug = generateSlug(file.path);
    const paths = slugMap.get(slug) || [];
    paths.push(file.path);
    slugMap.set(slug, paths);
  }

  slugMap.forEach((paths, slug) => {
    if (paths.length > 1) {
      for (const path of paths) {
        issues.push({
          type: 'duplicate-slug',
          severity: 'error',
          message: `Duplicate slug "${slug}" found in ${paths.length} files`,
          filePath: path,
          suggestion: 'Ensure each document has a unique URL path',
        });
      }
    }
  });

  return issues;
}

/**
 * Generate a slug from file path
 */
function generateSlug(filePath: string): string {
  // Remove extension and normalize path
  return filePath
    .replace(/\.(md|mdx)$/, '')
    .replace(/\\/g, '/')
    .toLowerCase();
}

/**
 * Lint all documentation files
 */
export function lintAllFiles(
  files: DocFile[],
  options: LintOptions = {}
): LintResult {
  const opts = { ...DEFAULT_LINT_OPTIONS, ...options };
  const fileResults: FileLintResult[] = [];

  // Lint each file individually
  for (const file of files) {
    const result = lintFile(file, opts);
    fileResults.push(result);
  }

  // Check for duplicates across files
  if (opts.checkDuplicateTitles) {
    const duplicateTitleIssues = checkDuplicateTitles(files);
    // Add to respective file results
    for (const issue of duplicateTitleIssues) {
      const fileResult = fileResults.find((r) => r.filePath === issue.filePath);
      if (fileResult) {
        fileResult.issues.push(issue);
        if (issue.severity === 'error') {
          fileResult.valid = false;
        }
      }
    }
  }

  if (opts.checkDuplicateSlugs) {
    const duplicateSlugIssues = checkDuplicateSlugs(files);
    // Add to respective file results
    for (const issue of duplicateSlugIssues) {
      const fileResult = fileResults.find((r) => r.filePath === issue.filePath);
      if (fileResult) {
        fileResult.issues.push(issue);
        if (issue.severity === 'error') {
          fileResult.valid = false;
        }
      }
    }
  }

  // Calculate summary
  const summary = {
    totalFiles: fileResults.length,
    validFiles: fileResults.filter((r) => r.valid).length,
    invalidFiles: fileResults.filter((r) => !r.valid).length,
    totalIssues: fileResults.reduce((sum, r) => sum + r.issues.length, 0),
    errors: fileResults.reduce(
      (sum, r) => sum + r.issues.filter((i) => i.severity === 'error').length,
      0
    ),
    warnings: fileResults.reduce(
      (sum, r) => sum + r.issues.filter((i) => i.severity === 'warning').length,
      0
    ),
    info: fileResults.reduce(
      (sum, r) => sum + r.issues.filter((i) => i.severity === 'info').length,
      0
    ),
  };

  return {
    files: fileResults,
    summary,
    passed: summary.errors === 0,
  };
}

/**
 * Format lint result for display
 */
export function formatLintResult(result: LintResult): string {
  const lines: string[] = [];

  lines.push('Documentation Lint Results');
  lines.push('='.repeat(50));
  lines.push('');

  // Summary
  lines.push('Summary:');
  lines.push(`  Total files: ${result.summary.totalFiles}`);
  lines.push(`  Valid files: ${result.summary.validFiles}`);
  lines.push(`  Invalid files: ${result.summary.invalidFiles}`);
  lines.push(`  Total issues: ${result.summary.totalIssues}`);
  lines.push(`    Errors: ${result.summary.errors}`);
  lines.push(`    Warnings: ${result.summary.warnings}`);
  lines.push(`    Info: ${result.summary.info}`);
  lines.push('');

  // Issues by file
  const filesWithIssues = result.files.filter((f) => f.issues.length > 0);

  if (filesWithIssues.length > 0) {
    lines.push('Issues by file:');
    lines.push('-'.repeat(50));

    for (const file of filesWithIssues) {
      lines.push(`\n${file.filePath}`);

      for (const issue of file.issues) {
        const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        lines.push(`  ${icon} [${issue.type}] ${issue.message}`);
        if (issue.suggestion) {
          lines.push(`     Suggestion: ${issue.suggestion}`);
        }
      }
    }
  }

  lines.push('');
  lines.push(result.passed ? '✅ Lint passed' : '❌ Lint failed');

  return lines.join('\n');
}

/**
 * Get lint issue type description
 */
export function getLintIssueDescription(type: LintIssueType): string {
  const descriptions: Record<LintIssueType, string> = {
    'missing-frontmatter': 'Document is missing frontmatter section',
    'missing-title': 'Frontmatter is missing title field',
    'missing-description': 'Frontmatter is missing description field',
    'missing-section': 'Frontmatter is missing section field',
    'duplicate-title': 'Multiple documents have the same title',
    'duplicate-slug': 'Multiple documents would generate the same URL slug',
    'invalid-frontmatter': 'Frontmatter contains invalid or malformed data',
    'missing-content': 'Document has no content after frontmatter',
    'short-description': 'Description is shorter than recommended length',
    'missing-tags': 'Document is missing tags for categorization',
    'broken-link': 'Document contains broken internal links',
    'missing-overview': 'Component page is missing Overview section',
    'missing-examples': 'Component page is missing Examples section',
    'missing-accessibility': 'Component page is missing Accessibility section',
  };

  return descriptions[type] || 'Unknown issue type';
}
