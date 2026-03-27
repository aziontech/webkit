/**
 * Code Snippet Generator
 * 
 * Generates Vue template code from props values.
 * This is a simple generator that creates usage examples
 * based on the current playground state.
 */

import type { PropsDefinition, PropsValues, GeneratedCode, PropMetadata } from './types';

/**
 * Format a prop value for code output
 */
function formatPropValue(
  value: unknown,
  metadata: PropMetadata,
  propName: string
): string | null {
  // Skip if value is the default
  if (value === metadata.default) {
    return null;
  }

  // Skip if value is undefined or null
  if (value === undefined || value === null) {
    return null;
  }

  // Handle different types
  switch (metadata.type) {
    case 'string':
      // Simple string - use as attribute if short, or bind if contains special chars
      if (typeof value === 'string') {
        // Check if it's a simple string that can be unquoted
        if (/^[a-zA-Z0-9\s-]+$/.test(value) && value.length < 20) {
          return `${propName}="${value}"`;
        }
        // Otherwise use v-bind with template literal
        return `:${propName}="\`${value}\`"`;
      }
      return null;

    case 'boolean':
      // Boolean: only include if true
      if (value === true) {
        return propName;
      }
      // Explicit false uses binding
      if (value === false) {
        return `:${propName}="false"`;
      }
      return null;

    case 'number':
      // Numbers always use binding
      return `:${propName}="${value}"`;

    case 'enum':
      // Enum values use binding for strings
      if (typeof value === 'string') {
        return `${propName}="${value}"`;
      }
      return null;

    default:
      return null;
  }
}

/**
 * Generate Vue template code from props
 */
export function generateCode(
  componentName: string,
  propsDefinition: PropsDefinition,
  propsValues: PropsValues,
  slotContent?: string
): GeneratedCode {
  const lines: string[] = [];
  const propsLines: string[] = [];

  // Sort props by name for consistent output
  const sortedPropNames = Object.keys(propsDefinition).sort();

  // Generate prop attributes
  for (const propName of sortedPropNames) {
    const metadata = propsDefinition[propName];
    const value = propsValues[propName];
    const formatted = formatPropValue(value, metadata, propName);

    if (formatted) {
      propsLines.push(formatted);
    }
  }

  // Build the opening tag
  if (propsLines.length === 0) {
    // Self-closing or simple tag
    if (slotContent) {
      lines.push(`<${componentName}>`);
      lines.push(`  ${slotContent}`);
      lines.push(`</${componentName}>`);
    } else {
      lines.push(`<${componentName} />`);
    }
  } else if (propsLines.length === 1) {
    // Single prop on same line
    if (slotContent) {
      lines.push(`<${componentName} ${propsLines[0]}>`);
      lines.push(`  ${slotContent}`);
      lines.push(`</${componentName}>`);
    } else {
      lines.push(`<${componentName} ${propsLines[0]} />`);
    }
  } else {
    // Multiple props, each on new line
    lines.push(`<${componentName}`);
    for (const propLine of propsLines) {
      lines.push(`  ${propLine}`);
    }

    if (slotContent) {
      lines.push(`>`);
      lines.push(`  ${slotContent}`);
      lines.push(`</${componentName}>`);
    } else {
      lines.push(`/>`);
    }
  }

  return {
    code: lines.join('\n'),
    language: 'vue',
    componentName,
  };
}

/**
 * Generate a minimal example with only essential props
 */
export function generateMinimalExample(
  componentName: string,
  propsDefinition: PropsDefinition
): GeneratedCode {
  // Use defaults for all props
  const defaultValues: PropsValues = {};

  for (const [propName, metadata] of Object.entries(propsDefinition)) {
    if (metadata.default !== undefined) {
      defaultValues[propName] = metadata.default;
    }
  }

  return generateCode(componentName, propsDefinition, defaultValues, 'Content');
}

/**
 * Generate code for multiple variants
 */
export function generateVariantExamples(
  componentName: string,
  propsDefinition: PropsDefinition,
  variantProp: string,
  variants: string[]
): GeneratedCode[] {
  return variants.map((variant) => {
    const values: PropsValues = {
      [variantProp]: variant,
    };

    // Add other required props with defaults
    for (const [propName, metadata] of Object.entries(propsDefinition)) {
      if (metadata.default !== undefined && propName !== variantProp) {
        values[propName] = metadata.default;
      }
    }

    return generateCode(componentName, propsDefinition, values, 'Button');
  });
}
