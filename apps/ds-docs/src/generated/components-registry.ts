/**
 * Component Metadata Registry
 *
 * Central registry of documented components. Derived from webkit (playground-registry).
 * For the list of component doc pages, the app uses the content collection (v1-en/v1-pt);
 * this registry is used by docs tooling (e.g. getComponentByName, search).
 *
 * Regenerate playground (and thus webkit component list) with: pnpm build:scaffold
 */

import { webkitRegistry } from './playground-registry';

/**
 * Component registry entry
 */
export interface ComponentRegistryEntry {
  /** Component name */
  name: string;
  /** Component status */
  status: 'stable' | 'beta' | 'deprecated' | 'planned' | 'experimental';
  /** Component category */
  category: string;
  /** Path to documentation */
  documentation: string;
  /** Short description */
  description?: string;
  /** Available since version */
  since?: string;
  /** Deprecated in version */
  deprecatedIn?: string;
  /** Related components */
  related?: string[];
  /** Tags for search */
  tags?: string[];
}

/**
 * Build components registry from webkit registry.
 * Slug is used as the doc path segment (e.g. form-field-text → /components/form-field-text).
 */
export const componentsRegistry: ComponentRegistryEntry[] = webkitRegistry.map(
  (entry) => ({
    name: entry.displayName,
    status: 'experimental' as const,
    category: entry.category,
    documentation: `/components/${entry.slug}`,
    description: `${entry.displayName} component from the Azion Design System.`,
    tags: [entry.category, 'webkit', 'form', 'ui'].filter(
      (v, i, a) => a.indexOf(v) === i
    ),
  })
);

/**
 * Get component by name
 */
export function getComponentByName(name: string): ComponentRegistryEntry | undefined {
  return componentsRegistry.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get components by status
 */
export function getComponentsByStatus(
  status: ComponentRegistryEntry['status']
): ComponentRegistryEntry[] {
  return componentsRegistry.filter((c) => c.status === status);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: string): ComponentRegistryEntry[] {
  return componentsRegistry.filter(
    (c) => c.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get stable components
 */
export function getStableComponents(): ComponentRegistryEntry[] {
  return getComponentsByStatus('stable');
}

/**
 * Get beta components
 */
export function getBetaComponents(): ComponentRegistryEntry[] {
  return getComponentsByStatus('beta');
}

/**
 * Get deprecated components
 */
export function getDeprecatedComponents(): ComponentRegistryEntry[] {
  return getComponentsByStatus('deprecated');
}

/**
 * Search components by query
 */
export function searchComponents(query: string): ComponentRegistryEntry[] {
  const lowerQuery = query.toLowerCase();

  return componentsRegistry.filter((c) => {
    if (c.name.toLowerCase().includes(lowerQuery)) return true;
    if (c.description?.toLowerCase().includes(lowerQuery)) return true;
    if (c.tags?.some((t) => t.toLowerCase().includes(lowerQuery))) return true;
    return false;
  });
}

/**
 * Get all component names
 */
export function getAllComponentNames(): string[] {
  return componentsRegistry.map((c) => c.name);
}

/**
 * Get component categories
 */
export function getCategories(): string[] {
  const categories = new Set(componentsRegistry.map((c) => c.category));
  return Array.from(categories);
}

/**
 * Registry statistics
 */
export function getRegistryStats(): {
  total: number;
  stable: number;
  beta: number;
  deprecated: number;
  planned: number;
  experimental: number;
} {
  return {
    total: componentsRegistry.length,
    stable: getComponentsByStatus('stable').length,
    beta: getComponentsByStatus('beta').length,
    deprecated: getComponentsByStatus('deprecated').length,
    planned: getComponentsByStatus('planned').length,
    experimental: getComponentsByStatus('experimental').length,
  };
}

export default componentsRegistry;
