/**
 * Search Module
 *
 * Public API for the documentation search engine.
 */

// Types
export type {
  SearchContentType,
  SearchIndexEntry,
  SearchIndex,
  SearchResult,
  SearchOptions,
  SearchQuery,
  SearchState,
  RankingWeights,
} from './types';

export {
  DEFAULT_RANKING_WEIGHTS,
  SECTION_LABELS,
  TYPE_LABELS,
  TYPE_ICONS,
} from './types';

// Search Engine
export {
  SearchEngine,
  getSearchEngine,
  initSearchEngine,
  quickSearch,
} from './searchEngine';

// Tokenizer utilities
export {
  normalizeText,
  tokenize,
  extractUniqueTokens,
  createNgrams,
  levenshteinDistance,
  similarity,
  fuzzyMatch,
  extractIdentifiers,
  simpleStem,
  tokenizeWithPositions,
} from './tokenizer';

// Highlighting utilities
export {
  highlightMatches,
  highlightTitle,
  getMatchSnippet,
  findMatchingHeadings,
  findFirstMatchPosition,
} from './highlight';

// Ranking utilities
export {
  calculateScore,
  findMatchedTerms,
  rankResults,
  groupResultsBySection,
  groupResultsByType,
  getPreferredSection,
  getRelevanceCategory,
} from './ranking';

// Composables
export { useSearch } from './use-search';
