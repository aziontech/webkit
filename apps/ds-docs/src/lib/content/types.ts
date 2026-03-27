/**
 * Navigation Types
 * 
 * Type definitions for navigation system.
 * Re-exported from content module for convenience.
 */

import type { Section } from './sections';

// Re-export Section type
export type { Section };

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
