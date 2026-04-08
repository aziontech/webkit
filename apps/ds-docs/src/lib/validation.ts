/**
 * Component Page Validation Helpers
 * 
 * Utilities for validating component documentation structure and metadata.
 */

import type { ComponentFrontmatter } from '../content/config';

/**
 * Section requirements for component pages
 */
export const COMPONENT_SECTIONS = {
  required: ['overview', 'when-to-use', 'examples'],
  recommended: ['anatomy', 'states', 'accessibility', 'api'],
  optional: ['related', 'notes'],
} as const;

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missingSections: string[];
}

/**
 * Validate component frontmatter
 */
export function validateComponentFrontmatter(
  frontmatter: ComponentFrontmatter
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!frontmatter.title) {
    errors.push('Missing required field: title');
  }

  if (!frontmatter.description) {
    errors.push('Missing required field: description');
  }

  // Recommended fields
  if (!frontmatter.status) {
    warnings.push('Missing recommended field: status');
  }

  if (!frontmatter.category) {
    warnings.push('Missing recommended field: category');
  }

  if (!frontmatter.component) {
    warnings.push('Missing recommended field: component (needed for API extraction)');
  }

  // Status-specific validation
  if (frontmatter.status === 'deprecated' && !frontmatter.deprecatedIn) {
    warnings.push('Deprecated component should have deprecatedIn field');
  }

  // API validation
  if (frontmatter.api) {
    const { props, slots, events } = frontmatter.api;
    
    if (props && props.length > 0) {
      props.forEach((prop: { name: string; type: string }, index: number) => {
        if (!prop.name) {
          errors.push(`API props[${index}]: missing name`);
        }
        if (!prop.type) {
          errors.push(`API props[${index}]: missing type`);
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missingSections: [],
  };
}

/**
 * Validate component markdown content for required sections
 */
export function validateComponentContent(content: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingSections: string[] = [];

  // Extract headings from content
  const headings = extractHeadings(content);

  // Check for required sections
  for (const section of COMPONENT_SECTIONS.required) {
    if (!hasSection(headings, section)) {
      missingSections.push(section);
      errors.push(`Missing required section: ${section}`);
    }
  }

  // Check for recommended sections
  for (const section of COMPONENT_SECTIONS.recommended) {
    if (!hasSection(headings, section)) {
      missingSections.push(section);
      warnings.push(`Missing recommended section: ${section}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missingSections,
  };
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): Array<{ level: number; text: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string }> = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim().toLowerCase(),
    });
  }

  return headings;
}

/**
 * Check if a section exists in headings
 */
function hasSection(
  headings: Array<{ level: number; text: string }>,
  sectionId: string
): boolean {
  const sectionAliases: Record<string, string[]> = {
    'overview': ['overview', 'introduction', 'about'],
    'when-to-use': ['when to use', 'usage', 'use cases', 'when-to-use'],
    'examples': ['examples', 'demos', 'usage examples'],
    'anatomy': ['anatomy', 'structure', 'parts'],
    'states': ['states', 'variations', 'state'],
    'accessibility': ['accessibility', 'a11y', 'wcag'],
    'api': ['api', 'props', 'properties'],
    'related': ['related', 'see also', 'related components'],
  };

  const aliases = sectionAliases[sectionId] || [sectionId];

  return headings.some((heading) =>
    aliases.some((alias) => heading.text.includes(alias))
  );
}

/**
 * Combined validation for component pages
 */
export function validateComponentPage(
  frontmatter: ComponentFrontmatter,
  content: string
): ValidationResult {
  const frontmatterResult = validateComponentFrontmatter(frontmatter);
  const contentResult = validateComponentContent(content);

  return {
    valid: frontmatterResult.valid && contentResult.valid,
    errors: [...frontmatterResult.errors, ...contentResult.errors],
    warnings: [...frontmatterResult.warnings, ...contentResult.warnings],
    missingSections: contentResult.missingSections,
  };
}

/**
 * Get section requirements documentation
 */
export function getSectionRequirements(): {
  required: string[];
  recommended: string[];
  optional: string[];
} {
  return {
    required: [...COMPONENT_SECTIONS.required],
    recommended: [...COMPONENT_SECTIONS.recommended],
    optional: [...COMPONENT_SECTIONS.optional],
  };
}
