/**
 * Routing Utilities
 * 
 * Helper functions for resolving routes and pages.
 * Updated for v1 content structure with v1-en and v1-pt collections.
 */

import { getCollection } from 'astro:content';
import { SECTIONS, getSectionById, type Section } from './sections';

/**
 * Page resolution result
 */
export interface ResolvedPage {
  /** Section the page belongs to */
  section: Section;
  /** Page slug */
  slug: string;
  /** Full URL path */
  href: string;
  /** Whether this is an index page */
  isIndex: boolean;
  /** Collection entry data */
  entry: unknown;
}

/**
 * Extract slug from entry ID
 * Entry ID format: "section/slug" or "section/subfolder/slug"
 */
function extractSlugFromId(id: string): string {
  const parts = id.split('/');
  // Remove the section part (first element)
  return parts.slice(1).join('/').replace(/\.(md|mdx)$/, '');
}

/**
 * Get entries for a section from a language collection
 */
async function getSectionEntries(sectionId: string, language: 'en' | 'pt' = 'en') {
  const collectionName = language === 'en' ? 'v1-en' : 'v1-pt';
  const allEntries = await getCollection(collectionName);
  
  // Filter entries by section (section is the first part of the ID)
  return allEntries.filter((entry) => {
    const entrySection = entry.id.split('/')[0];
    return entrySection === sectionId;
  });
}

/**
 * Resolve a page from section ID and slug
 */
export async function resolvePage(
  sectionId: string,
  slug: string,
  language: 'en' | 'pt' = 'en'
): Promise<ResolvedPage | null> {
  const section = getSectionById(sectionId);
  if (!section) return null;

  try {
    const entries = await getSectionEntries(sectionId, language);
    
    // Find entry by slug (matching the file path after section)
    const entry = entries.find((e) => {
      const entrySlug = extractSlugFromId(e.id);
      return entrySlug === slug || entrySlug === `${slug}.md` || entrySlug === `${slug}.mdx`;
    });
    
    if (!entry) return null;

    const isIndex = slug === 'index' || slug === '';
    const href = isIndex ? section.basePath : `${section.basePath}/${slug}`;

    return {
      section,
      slug,
      href,
      isIndex,
      entry,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Resolve a page from a URL path
 */
export async function resolvePageFromPath(path: string, language: 'en' | 'pt' = 'en'): Promise<ResolvedPage | null> {
  // Remove leading slash and split
  const parts = path.replace(/^\//, '').split('/');
  
  if (parts.length === 0) return null;

  // Find matching section
  const section = SECTIONS.find((s) => s.basePath === `/${parts[0]}`);
  if (!section) return null;

  // Get slug (default to index)
  const slug = parts.length === 1 ? 'index' : parts.slice(1).join('/');

  return resolvePage(section.id, slug, language);
}

/**
 * Get all slugs for a section (for static path generation)
 */
export async function getSectionSlugs(sectionId: string, language: 'en' | 'pt' = 'en'): Promise<string[]> {
  const section = getSectionById(sectionId);
  if (!section) return [];

  try {
    const entries = await getSectionEntries(sectionId, language);
    return entries.map((e) => extractSlugFromId(e.id));
  } catch (error) {
    return [];
  }
}

/**
 * Get static paths for a section
 */
export async function getSectionStaticPaths(sectionId: string, language: 'en' | 'pt' = 'en') {
  const section = getSectionById(sectionId);
  if (!section) return [];

  try {
    const entries = await getSectionEntries(sectionId, language);
    
    return entries.map((entry) => ({
      params: { slug: extractSlugFromId(entry.id) },
      props: { entry, section },
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Get all static paths for all sections
 */
export async function getAllStaticPaths(language: 'en' | 'pt' = 'en') {
  const allPaths = await Promise.all(
    SECTIONS.map((section) => getSectionStaticPaths(section.id, language))
  );
  
  return allPaths.flat();
}

/**
 * Build URL for a page
 */
export function buildPageUrl(section: Section, slug: string, language: 'en' | 'pt' = 'en'): string {
  const basePath = language === 'en' ? section.basePath : `/pt${section.basePath}`;
  if (slug === 'index' || slug === '') {
    return basePath;
  }
  return `${basePath}/${slug}`;
}

/**
 * Parse URL to extract section and slug
 */
export function parsePageUrl(url: string): { sectionId: string; slug: string; language: 'en' | 'pt' } | null {
  const parts = url.replace(/^\//, '').split('/');
  
  if (parts.length === 0) return null;

  // Check if first part is a language prefix
  let language: 'en' | 'pt' = 'en';
  let sectionIndex = 0;
  
  if (parts[0] === 'pt') {
    language = 'pt';
    sectionIndex = 1;
  }

  // Find matching section
  const section = SECTIONS.find((s) => s.basePath === `/${parts[sectionIndex]}`);
  if (!section) return null;

  const slug = parts.length === sectionIndex + 1 ? 'index' : parts.slice(sectionIndex + 1).join('/');

  return {
    sectionId: section.id,
    slug,
    language,
  };
}
