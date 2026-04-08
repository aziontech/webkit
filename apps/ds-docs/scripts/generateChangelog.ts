#!/usr/bin/env node
/**
 * Documentation Changelog Generator
 * 
 * Generates a changelog for documentation updates including:
 * - New components
 * - Updated components
 * - Deprecated components
 * - Token changes
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Changelog entry type
 */
export type ChangelogType = 'added' | 'updated' | 'deprecated' | 'removed' | 'fixed';

/**
 * Changelog category
 */
export type ChangelogCategory = 'component' | 'token' | 'foundation' | 'pattern' | 'documentation';

/**
 * Changelog entry
 */
export interface ChangelogEntry {
  type: ChangelogType;
  category: ChangelogCategory;
  name: string;
  description: string;
  filePath?: string;
  version?: string;
  date?: string;
  breaking?: boolean;
  migrationGuide?: string;
}

/**
 * Changelog section
 */
export interface ChangelogSection {
  version: string;
  date: string;
  entries: ChangelogEntry[];
}

/**
 * Full changelog
 */
export interface Changelog {
  title: string;
  description: string;
  sections: ChangelogSection[];
}

/**
 * Changelog generator options
 */
export interface ChangelogOptions {
  /** Output file path */
  outputPath: string;
  /** Include entries since version */
  sinceVersion?: string;
  /** Include entries since date */
  sinceDate?: string;
  /** Include unreleased changes */
  includeUnreleased?: boolean;
  /** Source directories to scan */
  sourceDirs?: string[];
}

/**
 * Default options
 */
const DEFAULT_OPTIONS: ChangelogOptions = {
  outputPath: 'docs/changelog.md',
  includeUnreleased: true,
};

/**
 * Generate a changelog entry from file changes
 */
export function generateEntryFromChange(
  filePath: string,
  changeType: 'added' | 'modified' | 'deleted',
  content?: string
): ChangelogEntry | null {
  // Determine category from path
  let category: ChangelogCategory = 'documentation';
  
  if (filePath.includes('/components/') || filePath.includes('\\components\\')) {
    category = 'component';
  } else if (filePath.includes('/tokens/') || filePath.includes('\\tokens\\')) {
    category = 'token';
  } else if (filePath.includes('/foundations/') || filePath.includes('\\foundations\\')) {
    category = 'foundation';
  } else if (filePath.includes('/patterns/') || filePath.includes('\\patterns\\')) {
    category = 'pattern';
  }
  
  // Extract name from file path
  const name = path.basename(filePath).replace(/\.(md|mdx)$/, '');
  
  // Determine type
  let type: ChangelogType;
  if (changeType === 'added') {
    type = 'added';
  } else if (changeType === 'deleted') {
    type = 'removed';
  } else {
    type = 'updated';
  }
  
  // Try to extract description from frontmatter
  let description = '';
  if (content) {
    const frontmatterMatch = content.match(/---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const descMatch = frontmatterMatch[1].match(/description:\s*(.+)/);
      if (descMatch) {
        description = descMatch[1].trim();
      }
      
      // Check for deprecated status
      const statusMatch = frontmatterMatch[1].match(/status:\s*(\w+)/);
      if (statusMatch && statusMatch[1] === 'deprecated') {
        type = 'deprecated';
      }
    }
  }
  
  return {
    type,
    category,
    name,
    description: description || `${type} ${category}: ${name}`,
    filePath,
  };
}

/**
 * Group entries by type
 */
export function groupEntriesByType(entries: ChangelogEntry[]): Map<ChangelogType, ChangelogEntry[]> {
  const groups = new Map<ChangelogType, ChangelogEntry[]>();
  
  const types: ChangelogType[] = ['added', 'updated', 'deprecated', 'removed', 'fixed'];
  for (const type of types) {
    groups.set(type, []);
  }
  
  for (const entry of entries) {
    const group = groups.get(entry.type);
    if (group) {
      group.push(entry);
    }
  }
  
  return groups;
}

/**
 * Group entries by category
 */
export function groupEntriesByCategory(entries: ChangelogEntry[]): Map<ChangelogCategory, ChangelogEntry[]> {
  const groups = new Map<ChangelogCategory, ChangelogEntry[]>();
  
  const categories: ChangelogCategory[] = ['component', 'token', 'foundation', 'pattern', 'documentation'];
  for (const category of categories) {
    groups.set(category, []);
  }
  
  for (const entry of entries) {
    const group = groups.get(entry.category);
    if (group) {
      group.push(entry);
    }
  }
  
  return groups;
}

/**
 * Get type emoji
 */
function getTypeEmoji(type: ChangelogType): string {
  const emojis: Record<ChangelogType, string> = {
    added: '✨',
    updated: '📝',
    deprecated: '⚠️',
    removed: '🗑️',
    fixed: '🐛',
  };
  return emojis[type] || '📄';
}

/**
 * Get type label
 */
function getTypeLabel(type: ChangelogType): string {
  const labels: Record<ChangelogType, string> = {
    added: 'New',
    updated: 'Updated',
    deprecated: 'Deprecated',
    removed: 'Removed',
    fixed: 'Fixed',
  };
  return labels[type] || type;
}

/**
 * Format changelog entry for markdown
 */
function formatEntry(entry: ChangelogEntry): string {
  const emoji = getTypeEmoji(entry.type);
  const breakingTag = entry.breaking ? ' **BREAKING**' : '';
  
  let line = `- ${emoji} **${entry.name}**${breakingTag} - ${entry.description}`;
  
  if (entry.migrationGuide) {
    line += `\n  - Migration: ${entry.migrationGuide}`;
  }
  
  return line;
}

/**
 * Format changelog section for markdown
 */
function formatSection(section: ChangelogSection): string {
  const lines: string[] = [];
  
  lines.push(`## ${section.version}`);
  lines.push('');
  lines.push(`_Released: ${section.date}_`);
  lines.push('');
  
  // Group by type
  const typeGroups = groupEntriesByType(section.entries);
  
  const typeOrder: ChangelogType[] = ['added', 'updated', 'deprecated', 'removed', 'fixed'];
  
  for (const type of typeOrder) {
    const entries = typeGroups.get(type);
    if (entries && entries.length > 0) {
      lines.push(`### ${getTypeLabel(type)}`);
      lines.push('');
      
      // Group by category within type
      const categoryGroups = groupEntriesByCategory(entries);
      
      categoryGroups.forEach((categoryEntries, category) => {
        if (categoryEntries.length > 0) {
          lines.push(`#### ${category.charAt(0).toUpperCase() + category.slice(1)}s`);
          lines.push('');
          for (const entry of categoryEntries) {
            lines.push(formatEntry(entry));
          }
          lines.push('');
        }
      });
    }
  }
  
  return lines.join('\n');
}

/**
 * Generate full changelog markdown
 */
export function generateChangelogMarkdown(changelog: Changelog): string {
  const lines: string[] = [];
  
  lines.push(`# ${changelog.title}`);
  lines.push('');
  lines.push(changelog.description);
  lines.push('');
  
  for (const section of changelog.sections) {
    lines.push(formatSection(section));
    lines.push('');
    lines.push('---');
    lines.push('');
  }
  
  return lines.join('\n');
}

/**
 * Generate unreleased section
 */
export function generateUnreleasedSection(entries: ChangelogEntry[]): ChangelogSection {
  return {
    version: 'Unreleased',
    date: new Date().toISOString().split('T')[0],
    entries,
  };
}

/**
 * Create a new changelog
 */
export function createChangelog(title: string = 'Documentation Changelog'): Changelog {
  return {
    title,
    description: 'A record of all notable changes to the Azion Design System documentation.',
    sections: [],
  };
}

/**
 * Add section to changelog
 */
export function addSection(changelog: Changelog, section: ChangelogSection): Changelog {
  changelog.sections.push(section);
  return changelog;
}

/**
 * Write changelog to file
 */
export function writeChangelog(changelog: Changelog, outputPath: string): void {
  const markdown = generateChangelogMarkdown(changelog);
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, markdown);
  console.log(`Changelog written to: ${outputPath}`);
}

/**
 * Parse existing changelog
 */
export function parseChangelog(content: string): Changelog {
  const sections: ChangelogSection[] = [];
  
  // Split by version headers
  const versionRegex = /^## (.+)$/gm;
  const matches = Array.from(content.matchAll(versionRegex));
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const version = match[1];
    
    // Get content until next version or end
    const start = match.index! + match[0].length;
    const end = i < matches.length - 1 ? matches[i + 1].index! : content.length;
    const sectionContent = content.slice(start, end);
    
    // Extract date
    const dateMatch = sectionContent.match(/_Released: (.+)_/);
    const date = dateMatch ? dateMatch[1] : 'Unknown';
    
    // Parse entries
    const entries: ChangelogEntry[] = [];
    const entryRegex = /^- (.+)$/gm;
    const entryMatches = Array.from(sectionContent.matchAll(entryRegex));
    
    for (const entryMatch of entryMatches) {
      const entryLine = entryMatch[1];
      
      // Parse entry
      const emojiMatch = entryLine.match(/^([✨📝⚠️🗑️🐛])\s*\*\*(.+?)\*\*\s*-\s*(.+)$/);
      if (emojiMatch) {
        const emoji = emojiMatch[1];
        const name = emojiMatch[2];
        const description = emojiMatch[3];
        
        // Determine type from emoji
        const typeMap: Record<string, ChangelogType> = {
          '✨': 'added',
          '📝': 'updated',
          '⚠️': 'deprecated',
          '🗑️': 'removed',
          '🐛': 'fixed',
        };
        
        entries.push({
          type: typeMap[emoji] || 'updated',
          category: 'documentation', // Would need more context to determine
          name,
          description,
        });
      }
    }
    
    sections.push({ version, date, entries });
  }
  
  return {
    title: 'Documentation Changelog',
    description: 'A record of all notable changes to the Azion Design System documentation.',
    sections,
  };
}

/**
 * Generate changelog from git diff (placeholder for future integration)
 */
export function generateFromGitDiff(
  _baseRef: string,
  _headRef: string
): ChangelogEntry[] {
  // This would integrate with git to compare changes
  // For now, return empty array
  console.log('Git integration not yet implemented');
  return [];
}

/**
 * Main function for CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const outputPath = args.find((a) => a.startsWith('--output='))?.split('=')[1] || 'docs/changelog.md';
  
  console.log('Generating documentation changelog...');
  console.log(`Output: ${outputPath}`);
  console.log('');
  
  // Create sample changelog
  const changelog = createChangelog();
  
  // Add unreleased section with sample entries
  const sampleEntries: ChangelogEntry[] = [
    {
      type: 'added',
      category: 'component',
      name: 'Button',
      description: 'Added comprehensive Button component documentation with all variants.',
      filePath: 'src/content/en/components/button.md',
    },
    {
      type: 'added',
      category: 'component',
      name: 'Fieldset',
      description: 'Added Fieldset component documentation for form grouping.',
      filePath: 'src/content/en/components/fieldset.md',
    },
    {
      type: 'updated',
      category: 'foundation',
      name: 'Color',
      description: 'Updated color documentation with new brand colors.',
      filePath: 'src/content/en/foundations/color.md',
    },
  ];
  
  changelog.sections.push(generateUnreleasedSection(sampleEntries));
  
  // Write changelog
  writeChangelog(changelog, outputPath);
  
  console.log('');
  console.log('Changelog generated successfully!');
}

// Run main function if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}
