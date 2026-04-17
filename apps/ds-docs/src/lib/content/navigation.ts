/**
 * Navigation Generation System
 * 
 * Automatically generates sidebar navigation from content collections.
 * Supports ordering, hidden pages, index pages, and future extensibility.
 */

import { getCollection } from 'astro:content';
import { SECTIONS, type Section } from './sections';

/**
 * Navigation item representing a single page
 */
export interface NavItem {
  /** Page title */
  title: string;
  /** Navigation label (falls back to title) */
  navLabel: string;
  /** URL path */
  href: string;
  /** Sort order */
  order: number;
  /** Whether the item is hidden from navigation */
  hidden: boolean;
  /** Category for grouping (optional) */
  category?: string;
  /** Section ID this item belongs to */
  sectionId: string;
  /** Whether this is an index/landing page */
  isIndex: boolean;
  /** Page slug */
  slug: string;
}

/**
 * Navigation section containing multiple items
 */
export interface NavSection {
  /** Section metadata */
  section: Section;
  /** Navigation items in this section */
  items: NavItem[];
  /** Whether the section has an index page */
  hasIndex: boolean;
}

/**
 * Full navigation tree
 */
export type NavigationTree = NavSection[];

/**
 * Frontmatter fields used for navigation
 */
interface NavFrontmatter {
  title: string;
  description?: string;
  navLabel?: string;
  order?: number;
  hidden?: boolean;
  category?: string;
}

/**
 * Extract navigation metadata from a collection entry
 */
function extractNavItem(
  entry: { slug: string; data: NavFrontmatter },
  section: Section
): NavItem {
  const data = entry.data;
  const slug = entry.slug;
  // In Astro 5's glob loader, index files have ID equal to the folder name (e.g., 'tokens' for 'tokens/index.mdx')
  // So we also check if slug equals the section ID (which means it's an index file)
  const isIndex = slug === 'index' || slug === '' || slug.endsWith('/index') || slug === section.id;

  // Build href - index pages link to section root
  const href = isIndex
    ? section.basePath
    : `${section.basePath}/${slug}`;

  return {
    title: data.title,
    navLabel: data.navLabel || data.title,
    href,
    order: data.order ?? 9999,
    hidden: data.hidden ?? false,
    category: data.category,
    sectionId: section.id,
    isIndex,
    slug,
  };
}

/**
 * Sort navigation items
 * Primary: by order
 * Secondary: by title (alphabetical)
 */
function sortNavItems(a: NavItem, b: NavItem): number {
  if (a.order !== b.order) {
    return a.order - b.order;
  }
  return a.navLabel.localeCompare(b.navLabel);
}

/**
 * Get navigation for a specific section
 */
export async function getSectionNavigation(sectionId: string): Promise<NavSection | null> {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return null;

  try {
    // Get English content collection and filter by section
    const entries = await getCollection('v1-en');
    
    // Filter entries that belong to this section (entry.id starts with sectionId + '/')
    const sectionEntries = entries.filter((entry) => {
      const id = entry.id || '';
      return id.startsWith(sectionId + '/') || id === sectionId;
    });
    
    const items = sectionEntries
      .map((entry) => {
        // Extract slug from entry.id (e.g., 'components/button.md' -> 'button')
        const id = entry.id || '';
        const slug = id.replace(new RegExp(`^${sectionId}/`), '').replace(/\.(md|mdx)$/, '');
        return extractNavItem(
          { slug, data: entry.data as NavFrontmatter },
          section
        );
      })
      .filter((item) => !item.hidden)
      .sort(sortNavItems);

    const hasIndex = items.some((item) => item.isIndex);

    return {
      section,
      items,
      hasIndex,
    };
  } catch (error) {
    // Collection might not exist yet
    return {
      section,
      items: [],
      hasIndex: false,
    };
  }
}

/**
 * Get full navigation tree for all sections
 */
export async function getNavigationTree(): Promise<NavigationTree> {
  const sections = await Promise.all(
    SECTIONS.map((section) => getSectionNavigation(section.id))
  );

  return sections.filter((s): s is NavSection => s !== null);
}

/**
 * Get flat list of all navigation items
 */
export async function getAllNavItems(): Promise<NavItem[]> {
  const tree = await getNavigationTree();
  return tree.flatMap((section) => section.items);
}

/**
 * Get navigation items for sidebar (excludes index pages from listing)
 */
export async function getSidebarNavigation(): Promise<NavigationTree> {
  const tree = await getNavigationTree();
  
  return tree.map((navSection) => ({
    ...navSection,
    // Keep all items but mark index pages
    items: navSection.items,
  }));
}

/**
 * Find current page in navigation
 */
export async function getCurrentNavItem(href: string): Promise<NavItem | undefined> {
  const items = await getAllNavItems();
  return items.find((item) => item.href === href);
}

/**
 * Get previous/next navigation items within a section
 */
export async function getPrevNextItems(
  currentHref: string
): Promise<{ prev: NavItem | null; next: NavItem | null }> {
  const tree = await getNavigationTree();
  
  for (const section of tree) {
    const visibleItems = section.items.filter((item) => !item.hidden && !item.isIndex);
    const currentIndex = visibleItems.findIndex((item) => item.href === currentHref);
    
    if (currentIndex !== -1) {
      return {
        prev: currentIndex > 0 ? visibleItems[currentIndex - 1] : null,
        next: currentIndex < visibleItems.length - 1 ? visibleItems[currentIndex + 1] : null,
      };
    }
  }
  
  return { prev: null, next: null };
}

/**
 * Strip language prefix from a path
 * Removes /pt, /en, etc. from the beginning of a path
 */
function stripLanguagePrefix(href: string): string {
  // Match paths like /pt/... or /pt at the start
  const langPrefixMatch = href.match(/^\/(pt|en)(\/.*)?$/);
  if (langPrefixMatch) {
    return langPrefixMatch[2] || '/';
  }
  return href;
}

/**
 * Get breadcrumb context for a page
 */
export async function getBreadcrumbContext(
  href: string
): Promise<{ section: Section; item: NavItem | null }> {
  const tree = await getNavigationTree();
  
  // Strip language prefix to get the base path for navigation lookup
  const basePath = stripLanguagePrefix(href);
  
  for (const navSection of tree) {
    const item = navSection.items.find((i) => i.href === basePath);
    if (item) {
      return {
        section: navSection.section,
        item,
      };
    }
  }
  
  // Check if it's a section index
  for (const navSection of tree) {
    if (navSection.section.basePath === basePath) {
      return {
        section: navSection.section,
        item: null,
      };
    }
  }
  
  throw new Error(`No breadcrumb context found for href: ${href}`);
}

/**
 * Check if a href is active (current page or parent section)
 */
export function isActive(href: string, currentPath: string): boolean {
  return href === currentPath || currentPath.startsWith(href + '/');
}

/**
 * Check if a section is active
 */
export function isSectionActive(section: Section, currentPath: string): boolean {
  return currentPath.startsWith(section.basePath);
}
