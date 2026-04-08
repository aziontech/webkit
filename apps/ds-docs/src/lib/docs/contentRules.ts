/**
 * Documentation Content Rules
 * 
 * Enforces documentation consistency rules such as:
 * - Component pages must include an "Overview" section
 * - Component pages must include an "Examples" section
 * - Component pages must include an "Accessibility" section
 */

import type { DocFile } from './docLint';

/**
 * Rule severity
 */
export type RuleSeverity = 'error' | 'warning' | 'info';

/**
 * Rule result
 */
export interface RuleResult {
  ruleId: string;
  ruleName: string;
  severity: RuleSeverity;
  message: string;
  filePath: string;
  line?: number;
  suggestion?: string;
}

/**
 * Content rule definition
 */
export interface ContentRule {
  id: string;
  name: string;
  description: string;
  severity: RuleSeverity;
  check: (file: DocFile) => RuleResult[];
}

/**
 * File rule check result
 */
export interface FileRuleCheckResult {
  filePath: string;
  results: RuleResult[];
  passed: boolean;
}

/**
 * Overall rule check result
 */
export interface RuleCheckResult {
  files: FileRuleCheckResult[];
  summary: {
    totalFiles: number;
    passedFiles: number;
    failedFiles: number;
    totalIssues: number;
    errors: number;
    warnings: number;
    info: number;
  };
  passed: boolean;
}

/**
 * Section aliases for flexible matching
 */
const SECTION_ALIASES: Record<string, string[]> = {
  'overview': ['overview', 'introduction', 'about', 'intro'],
  'examples': ['examples', 'demos', 'usage examples', 'usage', 'code examples'],
  'accessibility': ['accessibility', 'a11y', 'wcag', 'accessibility features'],
  'api': ['api', 'props', 'properties', 'api reference'],
  'anatomy': ['anatomy', 'structure', 'parts', 'components'],
  'states': ['states', 'variations', 'state variations'],
  'when-to-use': ['when to use', 'usage', 'use cases', 'when-to-use'],
  'related': ['related', 'see also', 'related components', 'related resources'],
};

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): Array<{ level: number; text: string; line: number }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; line: number }> = [];
  
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        line: i + 1,
      });
    }
  }
  
  return headings;
}

/**
 * Check if a section exists in headings
 */
function hasSection(
  headings: Array<{ level: number; text: string; line: number }>,
  sectionId: string
): { exists: boolean; line?: number } {
  const aliases = SECTION_ALIASES[sectionId] || [sectionId];
  const lowerAliases = aliases.map((a) => a.toLowerCase());
  
  for (const heading of headings) {
    const lowerText = heading.text.toLowerCase();
    if (lowerAliases.some((alias) => lowerText.includes(alias))) {
      return { exists: true, line: heading.line };
    }
  }
  
  return { exists: false };
}

/**
 * Rule: Component pages must have Overview section
 */
export const requireOverviewSection: ContentRule = {
  id: 'require-overview',
  name: 'Require Overview Section',
  description: 'Component pages must include an Overview section',
  severity: 'error',
  check: (file: DocFile): RuleResult[] => {
    const results: RuleResult[] = [];
    
    // Only apply to component pages
    if (!isComponentPage(file)) {
      return results;
    }
    
    const headings = extractHeadings(file.body);
    const { exists, line } = hasSection(headings, 'overview');
    
    if (!exists) {
      results.push({
        ruleId: 'require-overview',
        ruleName: 'Require Overview Section',
        severity: 'error',
        message: 'Component page is missing an Overview section',
        filePath: file.path,
        suggestion: 'Add an "## Overview" section at the top of the document',
      });
    }
    
    return results;
  },
};

/**
 * Rule: Component pages must have Examples section
 */
export const requireExamplesSection: ContentRule = {
  id: 'require-examples',
  name: 'Require Examples Section',
  description: 'Component pages must include an Examples section',
  severity: 'error',
  check: (file: DocFile): RuleResult[] => {
    const results: RuleResult[] = [];
    
    if (!isComponentPage(file)) {
      return results;
    }
    
    const headings = extractHeadings(file.body);
    const { exists } = hasSection(headings, 'examples');
    
    if (!exists) {
      results.push({
        ruleId: 'require-examples',
        ruleName: 'Require Examples Section',
        severity: 'error',
        message: 'Component page is missing an Examples section',
        filePath: file.path,
        suggestion: 'Add an "## Examples" section with usage examples',
      });
    }
    
    return results;
  },
};

/**
 * Rule: Component pages must have Accessibility section
 */
export const requireAccessibilitySection: ContentRule = {
  id: 'require-accessibility',
  name: 'Require Accessibility Section',
  description: 'Component pages must include an Accessibility section',
  severity: 'warning',
  check: (file: DocFile): RuleResult[] => {
    const results: RuleResult[] = [];
    
    if (!isComponentPage(file)) {
      return results;
    }
    
    const headings = extractHeadings(file.body);
    const { exists } = hasSection(headings, 'accessibility');
    
    if (!exists) {
      results.push({
        ruleId: 'require-accessibility',
        ruleName: 'Require Accessibility Section',
        severity: 'warning',
        message: 'Component page is missing an Accessibility section',
        filePath: file.path,
        suggestion: 'Add an "## Accessibility" section documenting keyboard interactions and ARIA attributes',
      });
    }
    
    return results;
  },
};

/**
 * Rule: Component pages should have API section
 */
export const requireApiSection: ContentRule = {
  id: 'require-api',
  name: 'Require API Section',
  description: 'Component pages should include an API section',
  severity: 'warning',
  check: (file: DocFile): RuleResult[] => {
    const results: RuleResult[] = [];
    
    if (!isComponentPage(file)) {
      return results;
    }
    
    const headings = extractHeadings(file.body);
    const { exists } = hasSection(headings, 'api');
    
    if (!exists) {
      results.push({
        ruleId: 'require-api',
        ruleName: 'Require API Section',
        severity: 'warning',
        message: 'Component page is missing an API section',
        filePath: file.path,
        suggestion: 'Add an "## API" section documenting props, events, and slots',
      });
    }
    
    return results;
  },
};

/**
 * Rule: Component pages should have When to Use section
 */
export const requireWhenToUseSection: ContentRule = {
  id: 'require-when-to-use',
  name: 'Require When to Use Section',
  description: 'Component pages should include a When to Use section',
  severity: 'warning',
  check: (file: DocFile): RuleResult[] => {
    const results: RuleResult[] = [];
    
    if (!isComponentPage(file)) {
      return results;
    }
    
    const headings = extractHeadings(file.body);
    const { exists } = hasSection(headings, 'when-to-use');
    
    if (!exists) {
      results.push({
        ruleId: 'require-when-to-use',
        ruleName: 'Require When to Use Section',
        severity: 'warning',
        message: 'Component page is missing a When to Use section',
        filePath: file.path,
        suggestion: 'Add a "## When to Use" section explaining appropriate use cases',
      });
    }
    
    return results;
  },
};

/**
 * Rule: Deprecated components must have migration guide
 */
export const requireMigrationGuide: ContentRule = {
  id: 'require-migration-guide',
  name: 'Require Migration Guide',
  description: 'Deprecated components must include migration guidance',
  severity: 'error',
  check: (file: DocFile): RuleResult[] => {
    const results: RuleResult[] = [];
    
    if (!file.frontmatter || file.frontmatter.status !== 'deprecated') {
      return results;
    }
    
    const content = file.body.toLowerCase();
    const hasMigrationGuide = 
      content.includes('migration') ||
      content.includes('migrate') ||
      content.includes('alternative') ||
      content.includes('replaced by');
    
    if (!hasMigrationGuide) {
      results.push({
        ruleId: 'require-migration-guide',
        ruleName: 'Require Migration Guide',
        severity: 'error',
        message: 'Deprecated component is missing migration guidance',
        filePath: file.path,
        suggestion: 'Add migration guidance explaining how to transition away from this component',
      });
    }
    
    return results;
  },
};

/**
 * Rule: Beta components must have stability notice
 */
export const requireBetaNotice: ContentRule = {
  id: 'require-beta-notice',
  name: 'Require Beta Notice',
  description: 'Beta components should include a stability notice',
  severity: 'warning',
  check: (file: DocFile): RuleResult[] => {
    const results: RuleResult[] = [];
    
    if (!file.frontmatter || file.frontmatter.status !== 'beta') {
      return results;
    }
    
    const content = file.body.toLowerCase();
    const hasBetaNotice = 
      content.includes('beta') ||
      content.includes('experimental') ||
      content.includes('subject to change');
    
    if (!hasBetaNotice) {
      results.push({
        ruleId: 'require-beta-notice',
        ruleName: 'Require Beta Notice',
        severity: 'warning',
        message: 'Beta component is missing stability notice',
        filePath: file.path,
        suggestion: 'Add a notice explaining the component is in beta and may change',
      });
    }
    
    return results;
  },
};

/**
 * Check if a file is a component page
 */
function isComponentPage(file: DocFile): boolean {
  if (!file.frontmatter) return false;
  
  const type = file.frontmatter.type;
  const path = file.path.toLowerCase();
  
  return (
    type === 'component' ||
    path.includes('/components/') ||
    path.includes('\\components\\')
  );
}

/**
 * All content rules
 */
export const CONTENT_RULES: ContentRule[] = [
  requireOverviewSection,
  requireExamplesSection,
  requireAccessibilitySection,
  requireApiSection,
  requireWhenToUseSection,
  requireMigrationGuide,
  requireBetaNotice,
];

/**
 * Check a file against all rules
 */
export function checkFileRules(
  file: DocFile,
  rules: ContentRule[] = CONTENT_RULES
): FileRuleCheckResult {
  const results: RuleResult[] = [];
  
  for (const rule of rules) {
    const ruleResults = rule.check(file);
    results.push(...ruleResults);
  }
  
  return {
    filePath: file.path,
    results,
    passed: !results.some((r) => r.severity === 'error'),
  };
}

/**
 * Check all files against all rules
 */
export function checkAllFilesRules(
  files: DocFile[],
  rules: ContentRule[] = CONTENT_RULES
): RuleCheckResult {
  const fileResults: FileRuleCheckResult[] = [];
  
  for (const file of files) {
    const result = checkFileRules(file, rules);
    fileResults.push(result);
  }
  
  const summary = {
    totalFiles: fileResults.length,
    passedFiles: fileResults.filter((f) => f.passed).length,
    failedFiles: fileResults.filter((f) => !f.passed).length,
    totalIssues: fileResults.reduce((sum, f) => sum + f.results.length, 0),
    errors: fileResults.reduce(
      (sum, f) => sum + f.results.filter((r) => r.severity === 'error').length,
      0
    ),
    warnings: fileResults.reduce(
      (sum, f) => sum + f.results.filter((r) => r.severity === 'warning').length,
      0
    ),
    info: fileResults.reduce(
      (sum, f) => sum + f.results.filter((r) => r.severity === 'info').length,
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
 * Format rule check result for display
 */
export function formatRuleCheckResult(result: RuleCheckResult): string {
  const lines: string[] = [];
  
  lines.push('Documentation Content Rules Check');
  lines.push('='.repeat(50));
  lines.push('');
  
  // Summary
  lines.push('Summary:');
  lines.push(`  Total files: ${result.summary.totalFiles}`);
  lines.push(`  Passed files: ${result.summary.passedFiles}`);
  lines.push(`  Failed files: ${result.summary.failedFiles}`);
  lines.push(`  Total issues: ${result.summary.totalIssues}`);
  lines.push(`    Errors: ${result.summary.errors}`);
  lines.push(`    Warnings: ${result.summary.warnings}`);
  lines.push('');
  
  // Issues by file
  const filesWithIssues = result.files.filter((f) => f.results.length > 0);
  
  if (filesWithIssues.length > 0) {
    lines.push('Issues by file:');
    lines.push('-'.repeat(50));
    
    for (const file of filesWithIssues) {
      lines.push(`\n${file.filePath}`);
      
      for (const issue of file.results) {
        const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        lines.push(`  ${icon} [${issue.ruleId}] ${issue.message}`);
        if (issue.suggestion) {
          lines.push(`     Suggestion: ${issue.suggestion}`);
        }
      }
    }
  }
  
  lines.push('');
  lines.push(result.passed ? '✅ All rules passed' : '❌ Some rules failed');
  
  return lines.join('\n');
}

/**
 * Get rule by ID
 */
export function getRuleById(ruleId: string): ContentRule | undefined {
  return CONTENT_RULES.find((r) => r.id === ruleId);
}

/**
 * Get rules by severity
 */
export function getRulesBySeverity(severity: RuleSeverity): ContentRule[] {
  return CONTENT_RULES.filter((r) => r.severity === severity);
}

/**
 * Get required rules (error severity)
 */
export function getRequiredRules(): ContentRule[] {
  return getRulesBySeverity('error');
}

/**
 * Get recommended rules (warning severity)
 */
export function getRecommendedRules(): ContentRule[] {
  return getRulesBySeverity('warning');
}
