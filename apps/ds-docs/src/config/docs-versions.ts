/**
 * Documentation Version Configuration
 * 
 * Centralized configuration for documentation versioning.
 * Supports multiple versions with stable URLs and future expansion.
 */

/**
 * Version configuration structure
 */
export interface DocsVersionConfig {
  /** Current active version (shown by default) */
  current: string;
  /** All available versions (ordered newest to oldest) */
  versions: string[];
  /** Version labels for display (optional) */
  labels?: Record<string, string>;
  /** Version release dates (optional, for UI display) */
  releaseDates?: Record<string, string>;
}

/**
 * Documentation versions configuration
 * 
 * Current: v1 only
 * Future: Add v2, v3, etc. as needed
 * 
 * @example
 * // Future configuration with multiple versions:
 * export const DOCS_VERSIONS: DocsVersionConfig = {
 *   current: 'v2',
 *   versions: ['v2', 'v1'],
 *   labels: {
 *     v2: 'Latest',
 *     v1: 'Legacy',
 *   },
 *   releaseDates: {
 *     v2: '2025-01-15',
 *     v1: '2024-06-01',
 *   },
 * };
 */
export const DOCS_VERSIONS: DocsVersionConfig = {
  current: 'v1',
  versions: ['v1'],
  labels: {
    v1: 'Latest',
  },
};

/**
 * Get the current documentation version
 * 
 * @returns The current version identifier (e.g., 'v1')
 */
export function getCurrentVersion(): string {
  return DOCS_VERSIONS.current;
}

/**
 * Check if a version identifier is valid
 * 
 * @param version - Version identifier to check
 * @returns True if the version exists in the versions list
 * 
 * @example
 * isValidVersion('v1'); // true
 * isValidVersion('v2'); // false (until v2 is added)
 * isValidVersion('invalid'); // false
 */
export function isValidVersion(version: string): boolean {
  return DOCS_VERSIONS.versions.includes(version);
}

/**
 * Check if a version is the current (latest) version
 * 
 * @param version - Version identifier to check
 * @returns True if this is the current version
 */
export function isCurrentVersion(version: string): boolean {
  return version === DOCS_VERSIONS.current;
}

/**
 * Get all available versions
 * 
 * @returns Array of version identifiers
 */
export function getAllVersions(): string[] {
  return [...DOCS_VERSIONS.versions];
}

/**
 * Get the display label for a version
 * 
 * @param version - Version identifier
 * @returns Human-readable label for the version
 */
export function getVersionLabel(version: string): string {
  return DOCS_VERSIONS.labels?.[version] ?? version;
}

/**
 * Get the previous version (for version banners)
 * 
 * @param version - Current version identifier
 * @returns The previous version or null if none exists
 */
export function getPreviousVersion(version: string): string | null {
  const index = DOCS_VERSIONS.versions.indexOf(version);
  if (index === -1 || index === DOCS_VERSIONS.versions.length - 1) {
    return null;
  }
  return DOCS_VERSIONS.versions[index + 1];
}

/**
 * Get the next version (newer)
 * 
 * @param version - Current version identifier
 * @returns The next version or null if none exists
 */
export function getNextVersion(version: string): string | null {
  const index = DOCS_VERSIONS.versions.indexOf(version);
  if (index <= 0) {
    return null;
  }
  return DOCS_VERSIONS.versions[index - 1];
}

/**
 * Version routing configuration
 */
export const VERSION_ROUTES = {
  /** URL prefix for versioned routes */
  prefix: '/docs',
  /** Pattern for versioned URLs */
  versionedPattern: '/docs/{version}/{language}/{section}/{page}',
  /** Pattern for default language URLs (shorter) */
  defaultLanguagePattern: '/docs/{section}/{page}',
} as const;

/**
 * Build a versioned URL
 * 
 * @param version - Version identifier
 * @param language - Language code
 * @param section - Section name
 * @param slug - Page slug
 * @param isDefaultLanguage - Whether this is the default language
 * @returns Full URL path
 */
export function buildVersionedUrl(
  version: string,
  language: string,
  section: string,
  slug: string,
  isDefaultLanguage: boolean = true
): string {
  // For default language and current version, use short URLs
  if (isDefaultLanguage && isCurrentVersion(version)) {
    return slug === 'index' 
      ? `/${section}` 
      : `/${section}/${slug}`;
  }
  
  // For non-default language or older versions, use full URLs
  const langPart = isDefaultLanguage ? '' : `/${language}`;
  const slugPart = slug === 'index' ? '' : `/${slug}`;
  
  if (isCurrentVersion(version) && isDefaultLanguage) {
    return `/${section}${slugPart}`;
  }
  
  return `/${version}${langPart}/${section}${slugPart}`;
}

/**
 * Parse a URL to extract version, language, section, and slug
 * 
 * @param url - URL path to parse
 * @param defaultLanguage - Default language code
 * @returns Parsed components or null if invalid
 */
export function parseVersionedUrl(
  url: string,
  defaultLanguage: string = 'en'
): { version: string; language: string; section: string; slug: string } | null {
  // Remove leading/trailing slashes and split
  const parts = url.replace(/^\/|\/$/g, '').split('/');
  
  if (parts.length === 0) return null;
  
  // Check if first part is a version
  const firstPart = parts[0];
  const isVersioned = firstPart.startsWith('v') && isValidVersion(firstPart);
  
  if (isVersioned) {
    const version = firstPart;
    
    // Check if second part is a language
    if (parts.length >= 2) {
      const secondPart = parts[1];
      // Languages are typically 2-letter codes
      const isLanguage = secondPart.length === 2;
      
      if (isLanguage) {
        // /{version}/{language}/{section}/{slug}
        const language = secondPart;
        const section = parts[2] ?? '';
        const slug = parts.length > 3 ? parts.slice(3).join('/') : 'index';
        return { version, language, section, slug };
      } else {
        // /{version}/{section}/{slug} (default language)
        const section = secondPart;
        const slug = parts.length > 2 ? parts.slice(2).join('/') : 'index';
        return { version, language: defaultLanguage, section, slug };
      }
    }
  } else {
    // Default version (current), check for language
    const firstPart = parts[0];
    const isLanguage = firstPart.length === 2 && firstPart !== 'en';
    
    if (isLanguage) {
      // /{language}/{section}/{slug}
      const language = firstPart;
      const section = parts[1] ?? '';
      const slug = parts.length > 2 ? parts.slice(2).join('/') : 'index';
      return { version: getCurrentVersion(), language, section, slug };
    } else {
      // /{section}/{slug} (default version and language)
      const section = firstPart;
      const slug = parts.length > 1 ? parts.slice(1).join('/') : 'index';
      return { version: getCurrentVersion(), language: defaultLanguage, section, slug };
    }
  }
  
  return null;
}
