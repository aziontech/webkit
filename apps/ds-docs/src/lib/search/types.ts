/**
 * Search Engine Types
 * 
 * Data models for the documentation search system.
 * Designed to support multilingual and versioned content.
 */

/**
 * Content type for search results
 * Maps to the content collection types
 */
export type SearchContentType = 
  | 'component'
  | 'token'
  | 'foundation'
  | 'pattern'
  | 'template'
  | 'block'
  | 'guide'
  | 'icon'
  | 'doc';

/**
 * Search index entry
 * Represents a single searchable document
 */
export interface SearchIndexEntry {
  /** Unique identifier (version-language-collection/slug format) */
  id: string;
  
  /** Document title */
  title: string;
  
  /** Section/collection name */
  section: string;
  
  /** Content type */
  type: SearchContentType;
  
  /** Category within the type (e.g., 'form' for components) */
  category?: string;
  
  /** Brief description */
  description: string;
  
  /** Extracted headings from the document */
  headings: string[];
  
  /** Tags for categorization and filtering */
  tags: string[];
  
  /** Normalized searchable content text */
  content: string;
  
  /** URL path to the document */
  url: string;
  
  /** Component status (for components) */
  status?: 'stable' | 'beta' | 'deprecated' | 'planned' | 'experimental';
  
  /** Related component/document IDs */
  related?: string[];
  
  /** Version identifier (e.g., 'v1') */
  version: string;
  
  /** Language code (e.g., 'en', 'pt') */
  language: string;
  
  /** Last modified timestamp */
  lastUpdated?: string;
}

/**
 * Search index structure
 * The complete index containing all entries
 */
export interface SearchIndex {
  /** Index metadata */
  meta: {
    /** Build timestamp */
    generated: string;
    /** Total number of entries */
    count: number;
    /** Default language of the index */
    language: string;
    /** Default version of the documentation */
    version: string;
    /** Supported languages in this index */
    languages: string[];
    /** Supported versions in this index */
    versions: string[];
    /** Index schema version for future migrations */
    schemaVersion: number;
  };
  
  /** Search entries */
  entries: SearchIndexEntry[];
}

/**
 * Search result with scoring information
 */
export interface SearchResult {
  /** The original index entry */
  entry: SearchIndexEntry;
  
  /** Relevance score (higher is better) */
  score: number;
  
  /** Matched terms */
  matches: string[];
  
  /** Highlighted title with matches marked */
  highlightedTitle?: string;
  
  /** Highlighted description with matches marked */
  highlightedDescription?: string;
  
  /** Matched headings */
  matchedHeadings?: string[];
}

/**
 * Search options for querying
 */
export interface SearchOptions {
  /** Maximum number of results to return */
  limit?: number;
  
  /** Filter by content type */
  type?: SearchContentType | SearchContentType[];
  
  /** Filter by section */
  section?: string | string[];
  
  /** Filter by category */
  category?: string | string[];
  
  /** Filter by tags (any match) */
  tags?: string[];
  
  /** Minimum score threshold */
  minScore?: number;
  
  /** Language filter (e.g., 'en', 'pt') */
  language?: string;
  
  /** Version filter (e.g., 'v1') */
  version?: string;
}

/**
 * Search query state
 */
export interface SearchQuery {
  /** Raw search query */
  query: string;
  
  /** Tokenized search terms */
  terms: string[];
  
  /** Applied filters */
  filters?: SearchOptions;
}

/**
 * Search state for UI
 */
export interface SearchState {
  /** Current search query */
  query: string;
  
  /** Search results */
  results: SearchResult[];
  
  /** Loading state */
  loading: boolean;
  
  /** Error message if any */
  error?: string;
  
  /** Currently selected result index (for keyboard navigation) */
  selectedIndex: number;
  
  /** Whether search is open */
  isOpen: boolean;
}

/**
 * Ranking weights for different match types
 */
export interface RankingWeights {
  /** Weight for title matches */
  title: number;
  
  /** Weight for exact title matches */
  titleExact: number;
  
  /** Weight for tag matches */
  tag: number;
  
  /** Weight for heading matches */
  heading: number;
  
  /** Weight for description matches */
  description: number;
  
  /** Weight for content matches */
  content: number;
  
  /** Boost for component section results */
  componentBoost: number;
  
  /** Boost for stable status */
  stableBoost: number;
}

/**
 * Default ranking weights
 */
export const DEFAULT_RANKING_WEIGHTS: RankingWeights = {
  title: 100,
  titleExact: 150,
  tag: 80,
  heading: 50,
  description: 30,
  content: 10,
  componentBoost: 1.2,
  stableBoost: 1.1,
};

/**
 * Section labels for display
 */
export const SECTION_LABELS: Record<string, string> = {
  'get-started': 'Get Started',
  'foundations': 'Foundations',
  'tokens': 'Tokens',
  'components': 'Components',
  'blocks': 'Blocks',
  'patterns': 'Patterns',
  'templates': 'Templates',
  'icons': 'Icons',
};

/**
 * Type labels for display
 */
export const TYPE_LABELS: Record<SearchContentType, string> = {
  component: 'Component',
  token: 'Token',
  foundation: 'Foundation',
  pattern: 'Pattern',
  template: 'Template',
  block: 'Block',
  guide: 'Guide',
  icon: 'Icon',
  doc: 'Documentation',
};

/**
 * Type icon names for display
 */
export const TYPE_ICONS: Record<SearchContentType, string> = {
  component: 'cube',
  token: 'variable',
  foundation: 'book',
  pattern: 'puzzle',
  template: 'layout',
  block: 'blocks',
  guide: 'map',
  icon: 'image',
  doc: 'file-text',
};
