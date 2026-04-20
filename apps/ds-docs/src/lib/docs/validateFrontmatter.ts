/**
 * Documentation Frontmatter Validation
 *
 * Validates that all documentation pages include required frontmatter fields
 * and provides warnings for missing recommended fields.
 */

import { z } from 'astro:content';

/**
 * Required frontmatter fields for all documentation pages
 */
export const REQUIRED_FIELDS = ['title', 'description', 'section', 'version', 'language'] as const;

/**
 * Recommended but optional frontmatter fields
 */
export const RECOMMENDED_FIELDS = ['tags', 'status', 'related'] as const;

/**
 * Field type definitions for validation
 */
export const FIELD_TYPES = {
  title: 'string',
  description: 'string',
  section: 'string',
  version: 'string',
  language: 'string',
  tags: 'array',
  status: 'string',
  related: 'array',
  navLabel: 'string',
  order: 'number',
  hidden: 'boolean',
  category: 'string',
  since: 'string',
  deprecatedIn: 'string',
  contributors: 'array',
  lastUpdated: 'date',
} as const;

/**
 * Valid status values
 */
export const VALID_STATUSES = ['stable', 'beta', 'deprecated', 'planned', 'experimental'] as const;

/**
 * Valid section values
 */
export const VALID_SECTIONS = [
  'components',
  'foundations',
  'tokens',
  'blocks',
  'patterns',
  'templates',
  'get-started',
  'icons',
] as const;

/**
 * Validation error interface
 */
export interface ValidationError {
  type: 'error' | 'warning';
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Validation result interface
 */
export interface FrontmatterValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  filePath?: string;
}

/**
 * Frontmatter validation options
 */
export interface ValidationOptions {
  /** Whether to validate field types strictly */
  strictTypes?: boolean;
  /** Whether to warn about missing recommended fields */
  warnRecommended?: boolean;
  /** Whether to validate status values */
  validateStatus?: boolean;
  /** Whether to validate section values */
  validateSection?: boolean;
  /** File path for error reporting */
  filePath?: string;
}

/**
 * Default validation options
 */
const DEFAULT_OPTIONS: ValidationOptions = {
  strictTypes: true,
  warnRecommended: true,
  validateStatus: true,
  validateSection: true,
};

/**
 * Validate frontmatter object
 */
export function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  options: ValidationOptions = {}
): FrontmatterValidationResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in frontmatter) || frontmatter[field] === undefined || frontmatter[field] === null) {
      errors.push({
        type: 'error',
        field,
        message: `Missing required field: ${field}`,
      });
    }
  }

  // Validate field types
  if (opts.strictTypes) {
    for (const [field, expectedType] of Object.entries(FIELD_TYPES)) {
      if (field in frontmatter && frontmatter[field] !== undefined && frontmatter[field] !== null) {
        const value = frontmatter[field];
        const actualType = Array.isArray(value) ? 'array' : typeof value;

        if (actualType !== expectedType) {
          errors.push({
            type: 'error',
            field,
            message: `Invalid type for ${field}: expected ${expectedType}, got ${actualType}`,
            value,
          });
        }
      }
    }
  }

  // Validate status values
  if (opts.validateStatus && frontmatter.status) {
    const status = frontmatter.status as string;
    if (!VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
      errors.push({
        type: 'error',
        field: 'status',
        message: `Invalid status value: ${status}. Must be one of: ${VALID_STATUSES.join(', ')}`,
        value: status,
      });
    }
  }

  // Validate section values
  if (opts.validateSection && frontmatter.section) {
    const section = frontmatter.section as string;
    if (!VALID_SECTIONS.includes(section as typeof VALID_SECTIONS[number])) {
      errors.push({
        type: 'error',
        field: 'section',
        message: `Invalid section value: ${section}. Must be one of: ${VALID_SECTIONS.join(', ')}`,
        value: section,
      });
    }
  }

  // Warn about missing recommended fields
  if (opts.warnRecommended) {
    for (const field of RECOMMENDED_FIELDS) {
      if (!(field in frontmatter) || frontmatter[field] === undefined || frontmatter[field] === null) {
        warnings.push({
          type: 'warning',
          field,
          message: `Missing recommended field: ${field}`,
        });
      }
    }
  }

  // Validate tags is an array of strings
  if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
    for (let i = 0; i < frontmatter.tags.length; i++) {
      if (typeof frontmatter.tags[i] !== 'string') {
        errors.push({
          type: 'error',
          field: 'tags',
          message: `tags[${i}] must be a string, got ${typeof frontmatter.tags[i]}`,
          value: frontmatter.tags[i],
        });
      }
    }
  }

  // Validate related is an array of strings
  if (frontmatter.related && Array.isArray(frontmatter.related)) {
    for (let i = 0; i < frontmatter.related.length; i++) {
      if (typeof frontmatter.related[i] !== 'string') {
        errors.push({
          type: 'error',
          field: 'related',
          message: `related[${i}] must be a string, got ${typeof frontmatter.related[i]}`,
          value: frontmatter.related[i],
        });
      }
    }
  }

  // Validate deprecated components have deprecatedIn
  if (frontmatter.status === 'deprecated' && !frontmatter.deprecatedIn) {
    warnings.push({
      type: 'warning',
      field: 'deprecatedIn',
      message: 'Deprecated component should have deprecatedIn field',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    filePath: opts.filePath,
  };
}

/**
 * Validate frontmatter against a Zod schema
 */
export function validateFrontmatterWithSchema<T extends z.ZodTypeAny>(
  frontmatter: unknown,
  schema: T,
  options: ValidationOptions = {}
): FrontmatterValidationResult & { data?: z.infer<T> } {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // First do basic validation
  const basicResult = validateFrontmatter(
    frontmatter as Record<string, unknown>,
    { ...opts, strictTypes: false }
  );

  // Then validate with schema
  const result = schema.safeParse(frontmatter);

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path.join('.');
      errors.push({
        type: 'error',
        field,
        message: issue.message,
      });
    }
  }

  return {
    valid: errors.length === 0 && basicResult.valid,
    errors: [...basicResult.errors, ...errors],
    warnings: basicResult.warnings,
    filePath: opts.filePath,
    data: result.success ? result.data : undefined,
  };
}

/**
 * Format validation result for display
 */
export function formatValidationResult(result: FrontmatterValidationResult): string {
  const lines: string[] = [];

  if (result.filePath) {
    lines.push(`File: ${result.filePath}`);
  }

  if (result.errors.length > 0) {
    lines.push('\nErrors:');
    for (const error of result.errors) {
      lines.push(`  ❌ ${error.field}: ${error.message}`);
    }
  }

  if (result.warnings.length > 0) {
    lines.push('\nWarnings:');
    for (const warning of result.warnings) {
      lines.push(`  ⚠️  ${warning.field}: ${warning.message}`);
    }
  }

  if (result.valid) {
    lines.push('\n✅ Frontmatter is valid');
  } else {
    lines.push('\n❌ Frontmatter validation failed');
  }

  return lines.join('\n');
}

/**
 * Get required fields list
 */
export function getRequiredFields(): readonly string[] {
  return REQUIRED_FIELDS;
}

/**
 * Get recommended fields list
 */
export function getRecommendedFields(): readonly string[] {
  return RECOMMENDED_FIELDS;
}

/**
 * Check if a field is required
 */
export function isRequiredField(field: string): boolean {
  return REQUIRED_FIELDS.includes(field as typeof REQUIRED_FIELDS[number]);
}

/**
 * Check if a field is recommended
 */
export function isRecommendedField(field: string): boolean {
  return RECOMMENDED_FIELDS.includes(field as typeof RECOMMENDED_FIELDS[number]);
}

/**
 * Get field type
 */
export function getFieldType(field: string): string | undefined {
  return FIELD_TYPES[field as keyof typeof FIELD_TYPES];
}

/**
 * Create a frontmatter template with required fields
 */
export function createFrontmatterTemplate(
  section: string,
  options: Partial<Record<string, unknown>> = {}
): Record<string, unknown> {
  return {
    title: options.title || 'Untitled',
    description: options.description || '',
    section,
    version: options.version || 'v1',
    language: options.language || 'en',
    tags: options.tags || [],
    status: options.status || 'stable',
    ...options,
  };
}
