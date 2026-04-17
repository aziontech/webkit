/**
 * Ranking
 * 
 * Scoring and ranking algorithms for search results.
 * Implements a weighted scoring system optimized for design system documentation.
 */

import type { 
  SearchIndexEntry, 
  SearchResult, 
  RankingWeights,
  SearchContentType 
} from './types';
import { DEFAULT_RANKING_WEIGHTS } from './types';
import { tokenize, similarity } from './tokenizer';

/**
 * Calculate the score for a search result
 */
export function calculateScore(
  entry: SearchIndexEntry,
  queryTerms: string[],
  weights: RankingWeights = DEFAULT_RANKING_WEIGHTS
): number {
  let score = 0;
  
  // Normalize query terms
  const normalizedTerms = queryTerms.map(t => t.toLowerCase());
  
  // Title scoring
  const titleLower = entry.title.toLowerCase();
  for (const term of normalizedTerms) {
    // Exact title match (highest score)
    if (titleLower === term) {
      score += weights.titleExact;
    }
    // Title starts with term
    else if (titleLower.startsWith(term)) {
      score += weights.title * 1.5;
    }
    // Title contains term
    else if (titleLower.includes(term)) {
      score += weights.title;
    }
    // Fuzzy title match
    else if (similarity(titleLower, term) > 0.8) {
      score += weights.title * 0.5;
    }
  }
  
  // Tag scoring
  if (entry.tags && entry.tags.length > 0) {
    for (const tag of entry.tags) {
      const tagLower = tag.toLowerCase();
      for (const term of normalizedTerms) {
        if (tagLower === term || tagLower.includes(term)) {
          score += weights.tag;
        }
      }
    }
  }
  
  // Heading scoring
  if (entry.headings && entry.headings.length > 0) {
    for (const heading of entry.headings) {
      const headingLower = heading.toLowerCase();
      for (const term of normalizedTerms) {
        if (headingLower.includes(term)) {
          score += weights.heading;
        }
      }
    }
  }
  
  // Description scoring
  const descLower = entry.description.toLowerCase();
  for (const term of normalizedTerms) {
    if (descLower.includes(term)) {
      score += weights.description;
    }
  }
  
  // Content scoring
  const contentLower = entry.content.toLowerCase();
  for (const term of normalizedTerms) {
    // Count occurrences but cap the bonus
    const matches = contentLower.split(term).length - 1;
    score += Math.min(matches, 5) * weights.content;
  }
  
  // Apply boosts
  
  // Component section boost
  if (entry.section === 'components' || entry.type === 'component') {
    score *= weights.componentBoost;
  }
  
  // Stable status boost
  if (entry.status === 'stable') {
    score *= weights.stableBoost;
  }
  
  // Penalize deprecated components
  if (entry.status === 'deprecated') {
    score *= 0.5;
  }
  
  return score;
}

/**
 * Find which terms matched in the entry
 */
export function findMatchedTerms(
  entry: SearchIndexEntry,
  queryTerms: string[]
): string[] {
  const matched: string[] = [];
  const normalizedTerms = queryTerms.map(t => t.toLowerCase());
  
  const titleLower = entry.title.toLowerCase();
  const descLower = entry.description.toLowerCase();
  const contentLower = entry.content.toLowerCase();
  
  for (const term of normalizedTerms) {
    let found = false;
    
    // Check title
    if (titleLower.includes(term)) {
      found = true;
    }
    // Check tags
    else if (entry.tags?.some(tag => tag.toLowerCase().includes(term))) {
      found = true;
    }
    // Check headings
    else if (entry.headings?.some(h => h.toLowerCase().includes(term))) {
      found = true;
    }
    // Check description
    else if (descLower.includes(term)) {
      found = true;
    }
    // Check content
    else if (contentLower.includes(term)) {
      found = true;
    }
    
    if (found && !matched.includes(term)) {
      matched.push(term);
    }
  }
  
  return matched;
}

/**
 * Rank and sort search results
 */
export function rankResults(
  entries: SearchIndexEntry[],
  queryTerms: string[],
  options: {
    weights?: RankingWeights;
    minScore?: number;
    limit?: number;
  } = {}
): SearchResult[] {
  const { weights = DEFAULT_RANKING_WEIGHTS, minScore = 1, limit = 20 } = options;
  
  // Calculate scores for all entries
  const results: SearchResult[] = entries
    .map(entry => {
      const score = calculateScore(entry, queryTerms, weights);
      const matches = findMatchedTerms(entry, queryTerms);
      
      return {
        entry,
        score,
        matches,
      };
    })
    // Filter by minimum score
    .filter(result => result.score >= minScore && result.matches.length > 0)
    // Sort by score descending
    .sort((a, b) => b.score - a.score)
    // Limit results
    .slice(0, limit);
  
  return results;
}

/**
 * Group results by section for display
 */
export function groupResultsBySection(
  results: SearchResult[]
): Map<string, SearchResult[]> {
  const groups = new Map<string, SearchResult[]>();
  
  for (const result of results) {
    const section = result.entry.section;
    if (!groups.has(section)) {
      groups.set(section, []);
    }
    groups.get(section)!.push(result);
  }
  
  return groups;
}

/**
 * Group results by type for display
 */
export function groupResultsByType(
  results: SearchResult[]
): Map<SearchContentType, SearchResult[]> {
  const groups = new Map<SearchContentType, SearchResult[]>();
  
  for (const result of results) {
    const type = result.entry.type;
    if (!groups.has(type)) {
      groups.set(type, []);
    }
    groups.get(type)!.push(result);
  }
  
  return groups;
}

/**
 * Get the best section to show first based on query
 */
export function getPreferredSection(query: string): string | null {
  const queryLower = query.toLowerCase();
  
  // Map query patterns to preferred sections
  const patterns: Array<[RegExp, string]> = [
    [/button|input|select|checkbox|form|fieldset/i, 'components'],
    [/color|spacing|typography|border|shadow/i, 'tokens'],
    [/foundation|principle|guideline/i, 'foundations'],
    [/pattern|workflow/i, 'patterns'],
    [/template|page|layout/i, 'templates'],
    [/icon/i, 'icons'],
    [/install|setup|start|quick/i, 'get-started'],
    [/block|section/i, 'blocks'],
  ];
  
  for (const [regex, section] of patterns) {
    if (regex.test(queryLower)) {
      return section;
    }
  }
  
  return null;
}

/**
 * Calculate relevance category for a result
 */
export function getRelevanceCategory(score: number): 'high' | 'medium' | 'low' {
  if (score >= 100) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}
