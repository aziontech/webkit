/**
 * Section Model
 * 
 * Defines the formal section model for the documentation platform.
 * This is the source of truth for navigation and routing logic.
 */

export interface Section {
  /** Unique section identifier */
  id: string;
  /** Human-readable label for display */
  label: string;
  /** URL path prefix */
  basePath: string;
  /** Order in sidebar navigation */
  order: number;
  /** Content collection name */
  collectionName: string;
  /** Optional description for section landing pages */
  description?: string;
  /** Icon identifier for visual display */
  icon?: string;
}

/**
 * All documentation sections
 * 
 * Order determines sidebar navigation order.
 */
export const SECTIONS: Section[] = [
  {
    id: 'get-started',
    label: 'Get Started',
    basePath: '/get-started',
    order: 1,
    collectionName: 'get-started',
    description: 'Get up and running with the Azion Design System.',
    icon: 'rocket',
  },
  {
    id: 'foundations',
    label: 'Foundations',
    basePath: '/foundations',
    order: 2,
    collectionName: 'foundations',
    description: 'Core design principles and guidelines that shape the system.',
    icon: 'palette',
  },
  {
    id: 'tokens',
    label: 'Tokens',
    basePath: '/tokens',
    order: 3,
    collectionName: 'tokens',
    description: 'Design tokens that power the visual language.',
    icon: 'code',
  },
  {
    id: 'components',
    label: 'Components',
    basePath: '/components',
    order: 4,
    collectionName: 'components',
    description: 'Reusable UI components built with Vue and Tailwind CSS.',
    icon: 'cube',
  },
  {
    id: 'blocks',
    label: 'Blocks',
    basePath: '/blocks',
    order: 5,
    collectionName: 'blocks',
    description: 'Composable UI blocks combining multiple components.',
    icon: 'blocks',
  },
  {
    id: 'patterns',
    label: 'Patterns',
    basePath: '/patterns',
    order: 6,
    collectionName: 'patterns',
    description: 'Common design patterns and best practices.',
    icon: 'puzzle',
  },
  {
    id: 'templates',
    label: 'Templates',
    basePath: '/templates',
    order: 7,
    collectionName: 'templates',
    description: 'Page templates and layout examples.',
    icon: 'layout',
  },
  {
    id: 'icons',
    label: 'Icons',
    basePath: '/icons',
    order: 8,
    collectionName: 'icons',
    description: 'Icon library with Azion Icons and PrimeIcons.',
    icon: 'star',
  },
];

/**
 * Section lookup map for O(1) access
 */
export const SECTION_MAP: Record<string, Section> = SECTIONS.reduce(
  (acc, section) => {
    acc[section.id] = section;
    return acc;
  },
  {} as Record<string, Section>
);

/**
 * Get section by ID
 */
export function getSectionById(id: string): Section | undefined {
  return SECTION_MAP[id];
}

/**
 * Get section by collection name
 */
export function getSectionByCollection(collectionName: string): Section | undefined {
  return SECTIONS.find((s) => s.collectionName === collectionName);
}

/**
 * Get section by base path
 */
export function getSectionByPath(path: string): Section | undefined {
  return SECTIONS.find((s) => s.basePath === path);
}

/**
 * Get all sections sorted by order
 */
export function getAllSections(): Section[] {
  return [...SECTIONS].sort((a, b) => a.order - b.order);
}

/**
 * Check if a section ID is valid
 */
export function isValidSection(id: string): boolean {
  return id in SECTION_MAP;
}
