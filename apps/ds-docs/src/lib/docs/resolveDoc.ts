/**
 * Documentation Content Resolution
 * 
 * Utilities for resolving documentation pages based on version, language, section, and slug.
 * Implements fallback behavior for missing translations.
 */

import { getCollection } from 'astro:content';
import {
  getCurrentVersion,
  isValidVersion,
  isCurrentVersion,
  getDefaultLanguage,
  isSupportedLanguage,
  isDefaultLanguage,
} from '@/config';
import type { Section } from '@/lib/content/sections';
import { getSectionById, SECTIONS } from '@/lib/content/sections';

/**
 * Content resolution parameters
 */
export interface ResolveDocParams {
  /** Documentation version (e.g., 'v1') */
  version?: string;
  /** Language code (e.g., 'en', 'pt') */
  language?: string;
  /** Section ID (e.g., 'components', 'foundations') */
  section: string;
  /** Page slug (e.g., 'button', 'color') */
  slug: string;
}

/**
 * Resolved documentation page
 */
export interface ResolvedDoc {
  /** Resolved version */
  version: string;
  /** Resolved language */
  language: string;
  /** Section information */
  section: Section;
  /** Page slug */
  slug: string;
  /** Full URL path */
  url: string;
  /** Canonical URL (for SEO) */
  canonicalUrl: string;
  /** Whether this is an index page */
  isIndex: boolean;
  /** Whether fallback was used (translation missing) */
  isFallback: boolean;
  /** Original requested language (if different from resolved) */
  requestedLanguage?: string;
  /** Collection entry */
  entry: unknown;
  /** Frontmatter data */
  frontmatter: Record<string, unknown>;
}

/**
 * Resolution result when content is not found
 */
export interface ResolvedDocNotFound {
  /** Whether resolution failed */
  notFound: true;
  /** Reason for failure */
  reason: 'invalid_version' | 'invalid_language' | 'invalid_section' | 'page_not_found';
  /** Requested parameters */
  requested: {
    version: string;
    language: string;
    section: string;
    slug: string;
  };
}

/**
 * Resolution options
 */
export interface ResolveOptions {
  /** Whether to allow fallback to default language */
  allowFallback?: boolean;
  /** Whether to allow fallback to current version */
  allowVersionFallback?: boolean;
}

/**
 * Content collection entry type
 * Matches Astro's content collection entry structure
 */
interface ContentEntry {
  id: string;
  collection: string;
  data: Record<string, unknown>;
  body?: string;
  rendered?: {
    html: string;
  };
  filePath?: string;
}

/**
 * Valid collection names based on content/config.ts
 */
type CollectionName = 'v1-en' | 'v1-pt';

/**
 * Get the collection name for a version and language
 */
function getCollectionName(version: string, language: string): CollectionName {
  return `${version}-${language}` as CollectionName;
}

/**
 * Resolve a documentation page with version and language support
 * 
 * @param params - Resolution parameters
 * @param options - Resolution options
 * @returns Resolved document or not found result
 * 
 * @example
 * // Resolve a component page
 * const result = await resolveDoc({
 *   section: 'components',
 *   slug: 'button'
 * });
 * 
 * @example
 * // Resolve with specific version and language
 * const result = await resolveDoc({
 *   version: 'v1',
 *   language: 'pt',
 *   section: 'components',
 *   slug: 'button'
 * });
 */
export async function resolveDoc(
  params: ResolveDocParams,
  options: ResolveOptions = {}
): Promise<ResolvedDoc | ResolvedDocNotFound> {
  const {
    allowFallback = true,
    allowVersionFallback = false,
  } = options;

  // Normalize and validate parameters
  const requestedVersion = params.version || getCurrentVersion();
  const requestedLanguage = params.language || getDefaultLanguage();
  const { section: sectionId, slug } = params;

  // Validate version
  if (!isValidVersion(requestedVersion)) {
    if (allowVersionFallback) {
      // Fallback to current version
      return resolveWithFallback(
        getCurrentVersion(),
        requestedLanguage,
        sectionId,
        slug,
        allowFallback
      );
    }
    return createNotFound('invalid_version', {
      version: requestedVersion,
      language: requestedLanguage,
      section: sectionId,
      slug,
    });
  }

  // Validate language
  if (!isSupportedLanguage(requestedLanguage)) {
    return createNotFound('invalid_language', {
      version: requestedVersion,
      language: requestedLanguage,
      section: sectionId,
      slug,
    });
  }

  // Validate section
  const section = getSectionById(sectionId);
  if (!section) {
    return createNotFound('invalid_section', {
      version: requestedVersion,
      language: requestedLanguage,
      section: sectionId,
      slug,
    });
  }

  // Try to resolve the content
  return resolveWithFallback(
    requestedVersion,
    requestedLanguage,
    sectionId,
    slug,
    allowFallback
  );
}

/**
 * Internal resolution with fallback logic
 */
async function resolveWithFallback(
  version: string,
  language: string,
  sectionId: string,
  slug: string,
  allowFallback: boolean
): Promise<ResolvedDoc | ResolvedDocNotFound> {
  const section = getSectionById(sectionId);
  if (!section) {
    return createNotFound('invalid_section', {
      version,
      language,
      section: sectionId,
      slug,
    });
  }

  // Try to get content in requested language
  let entry = await getContentEntry(version, language, sectionId, slug);
  let isFallback = false;
  let requestedLanguage: string | undefined;

  // If not found and fallback is allowed, try default language
  if (!entry && allowFallback && !isDefaultLanguage(language)) {
    requestedLanguage = language;
    language = getDefaultLanguage();
    entry = await getContentEntry(version, language, sectionId, slug);
    isFallback = true;
  }

  // If still not found, return 404
  if (!entry) {
    return createNotFound('page_not_found', {
      version,
      language,
      section: sectionId,
      slug,
    });
  }

  // Build URLs
  const url = buildDocUrl(version, language, sectionId, slug);
  const canonicalUrl = buildCanonicalUrl(version, language, sectionId, slug);

  return {
    version,
    language,
    section,
    slug,
    url,
    canonicalUrl,
    isIndex: slug === 'index' || slug === '',
    isFallback,
    requestedLanguage,
    entry,
    frontmatter: entry.data,
  };
}

/**
 * Get a content entry from the collection
 * 
 * Content is organized by version-language (e.g., 'v1-en', 'v1-pt')
 * Each collection contains all content types organized by folder structure
 */
async function getContentEntry(
  version: string,
  language: string,
  sectionId: string,
  slug: string
): Promise<ContentEntry | null> {
  const section = getSectionById(sectionId);
  if (!section) return null;

  try {
    const collectionName = getCollectionName(version, language);
    const entries = await getCollection(collectionName);
    
    // Find entry by matching the section folder and slug
    // Entry IDs are like 'components/button.md' or 'foundations/color.md'
    const entry = entries.find((e) => {
      const idParts = e.id.split('/');
      const entrySection = idParts[0];
      const entrySlug = idParts.slice(1).join('/').replace(/\.(md|mdx)$/, '');
      return entrySection === sectionId && entrySlug === slug;
    });
    
    return entry as ContentEntry | null;
  } catch (error) {
    console.error(`Error getting content entry: ${sectionId}/${slug}`, error);
    return null;
  }
}

/**
 * Build the URL for a documentation page
 */
function buildDocUrl(
  version: string,
  language: string,
  sectionId: string,
  slug: string
): string {
  const isDefault = isDefaultLanguage(language);
  const isCurrent = isCurrentVersion(version);

  // Short URLs for default language and current version
  if (isDefault && isCurrent) {
    return slug === 'index' ? `/${sectionId}` : `/${sectionId}/${slug}`;
  }

  // Full URLs for non-default language or older versions
  const parts: string[] = [];

  if (!isCurrent) {
    parts.push(version);
  }

  if (!isDefault) {
    parts.push(language);
  }

  parts.push(sectionId);

  if (slug !== 'index' && slug !== '') {
    parts.push(slug);
  }

  return `/${parts.join('/')}`;
}

/**
 * Build the canonical URL for SEO
 * 
 * Canonical URLs should always point to the default language version
 * for non-translated content, or to the specific language version for
 * translated content.
 */
function buildCanonicalUrl(
  version: string,
  language: string,
  sectionId: string,
  slug: string
): string {
  // Canonical URL always uses the current version
  const canonicalVersion = getCurrentVersion();
  
  // For default language, use short URL
  if (isDefaultLanguage(language)) {
    return slug === 'index' 
      ? `https://docs.azion.com/${sectionId}` 
      : `https://docs.azion.com/${sectionId}/${slug}`;
  }

  // For other languages, include language in URL
  return slug === 'index'
    ? `https://docs.azion.com/${language}/${sectionId}`
    : `https://docs.azion.com/${language}/${sectionId}/${slug}`;
}

/**
 * Create a not found result
 */
function createNotFound(
  reason: ResolvedDocNotFound['reason'],
  requested: ResolvedDocNotFound['requested']
): ResolvedDocNotFound {
  return {
    notFound: true,
    reason,
    requested,
  };
}

/**
 * Get all available pages for a version and language
 * 
 * Used for generating static paths and sitemaps
 */
export async function getAvailablePages(
  version?: string,
  language?: string
): Promise<Array<{ section: string; slug: string }>> {
  const resolvedVersion = version || getCurrentVersion();
  const resolvedLanguage = language || getDefaultLanguage();
  const pages: Array<{ section: string; slug: string }> = [];

  try {
    const collectionName = getCollectionName(resolvedVersion, resolvedLanguage);
    const entries = await getCollection(collectionName);
    
    for (const entry of entries) {
      // Parse section and slug from entry ID
      const idParts = entry.id.split('/');
      const section = idParts[0];
      const slug = idParts.slice(1).join('/').replace(/\.(md|mdx)$/, '');
      
      pages.push({
        section,
        slug,
      });
    }
  } catch (error) {
    console.error('Error getting available pages:', error);
  }

  return pages;
}

/**
 * Check if a translation exists for a page
 */
export async function hasTranslation(
  sectionId: string,
  slug: string,
  language: string
): Promise<boolean> {
  if (isDefaultLanguage(language)) return true;

  const entry = await getContentEntry(getCurrentVersion(), language, sectionId, slug);
  return entry !== null;
}

/**
 * Get all static paths for documentation pages
 * 
 * Generates paths for all combinations of version, language, section, and slug
 */
export async function getDocStaticPaths(): Promise<
  Array<{
    params: { version?: string; lang?: string; section: string; slug: string };
    props: { entry: ContentEntry; section: Section; version: string; language: string };
  }>
> {
  const paths: Array<{
    params: { version?: string; lang?: string; section: string; slug: string };
    props: { entry: ContentEntry; section: Section; version: string; language: string };
  }> = [];

  const currentVersion = getCurrentVersion();
  const defaultLanguage = getDefaultLanguage();

  // Get entries from the default language collection
  try {
    const collectionName = getCollectionName(currentVersion, defaultLanguage);
    const entries = await getCollection(collectionName);

    for (const entry of entries) {
      // Parse section and slug from entry ID
      const idParts = entry.id.split('/');
      const sectionId = idParts[0];
      const slug = idParts.slice(1).join('/').replace(/\.(md|mdx)$/, '');
      
      const section = getSectionById(sectionId);
      if (!section) continue;

      // Default language and current version (short URL)
      paths.push({
        params: { section: sectionId, slug },
        props: {
          entry: entry as ContentEntry,
          section,
          version: currentVersion,
          language: defaultLanguage,
        },
      });
    }
  } catch (error) {
    console.error('Error generating static paths:', error);
  }

  return paths;
}

/**
 * Resolve a URL to documentation parameters
 * 
 * Parses a URL and extracts version, language, section, and slug
 */
export function resolveDocFromUrl(url: string): ResolveDocParams | null {
  // Remove leading/trailing slashes and split
  const parts = url.replace(/^\/|\/$/g, '').split('/');

  if (parts.length === 0) return null;

  const currentVersion = getCurrentVersion();
  const defaultLanguage = getDefaultLanguage();

  // Check if first part is a version
  const firstPart = parts[0];
  const isVersioned = firstPart.startsWith('v') && isValidVersion(firstPart);

  if (isVersioned) {
    const version = firstPart;

    // Check if second part is a language
    if (parts.length >= 2) {
      const secondPart = parts[1];
      const isLanguage = isSupportedLanguage(secondPart);

      if (isLanguage) {
        // /{version}/{language}/{section}/{slug}
        return {
          version,
          language: secondPart,
          section: parts[2] ?? '',
          slug: parts.length > 3 ? parts.slice(3).join('/') : 'index',
        };
      } else {
        // /{version}/{section}/{slug} (default language)
        return {
          version,
          language: defaultLanguage,
          section: secondPart,
          slug: parts.length > 2 ? parts.slice(2).join('/') : 'index',
        };
      }
    }
  } else {
    // Default version (current)
    const firstPart = parts[0];
    const isLanguage = isSupportedLanguage(firstPart) && !isDefaultLanguage(firstPart);

    if (isLanguage) {
      // /{language}/{section}/{slug}
      return {
        version: currentVersion,
        language: firstPart,
        section: parts[1] ?? '',
        slug: parts.length > 2 ? parts.slice(2).join('/') : 'index',
      };
    } else {
      // /{section}/{slug} (default version and language)
      return {
        version: currentVersion,
        language: defaultLanguage,
        section: firstPart,
        slug: parts.length > 1 ? parts.slice(1).join('/') : 'index',
      };
    }
  }

  return null;
}
