/**
 * Content Engine
 * 
 * Central export for all content utilities.
 * This module provides the abstraction layer between Astro pages
 * and raw collection logic.
 */

// Section model
export {
  SECTIONS,
  SECTION_MAP,
  getSectionById,
  getSectionByCollection,
  getSectionByPath,
  getAllSections,
  isValidSection,
} from './sections';

// Navigation generation
export {
  getSectionNavigation,
  getNavigationTree,
  getAllNavItems,
  getSidebarNavigation,
  getCurrentNavItem,
  getPrevNextItems,
  getBreadcrumbContext,
  isActive,
  isSectionActive,
} from './navigation';

// Routing utilities
export {
  type ResolvedPage,
  resolvePage,
  resolvePageFromPath,
  getSectionSlugs,
  getSectionStaticPaths,
  getAllStaticPaths,
  buildPageUrl,
  parsePageUrl,
} from './routing';

// Types
export type { NavItem, NavSection, NavigationTree, Section } from './types';
