/**
 * Search Engine
 * 
 * Main search engine module that coordinates indexing, querying, and ranking.
 * Designed for client-side search with a pre-built index.
 */

import type { 
  SearchIndex, 
  SearchIndexEntry, 
  SearchResult, 
  SearchOptions,
  SearchContentType 
} from './types';
import { tokenize } from './tokenizer';
import { rankResults, groupResultsByType } from './ranking';
import { highlightTitle, highlightMatches, findMatchingHeadings } from './highlight';

/**
 * Search Engine class
 * Manages the search index and provides search functionality
 */
export class SearchEngine {
  private index: SearchIndex | null = null;
  private entries: SearchIndexEntry[] = [];
  private loaded = false;
  
  /**
   * Load the search index
   */
  async loadIndex(indexUrl: string = '/search-index.json'): Promise<void> {
    try {
      const response = await fetch(indexUrl);
      if (!response.ok) {
        throw new Error(`Failed to load search index: ${response.status}`);
      }
      
      this.index = await response.json();
      this.entries = this.index?.entries || [];
      this.loaded = true;
    } catch (error) {
      console.error('Failed to load search index:', error);
      throw error;
    }
  }
  
  /**
   * Load index from a pre-fetched object
   */
  loadIndexFromObject(index: SearchIndex): void {
    this.index = index;
    this.entries = index.entries;
    this.loaded = true;
  }
  
  /**
   * Check if the index is loaded
   */
  isLoaded(): boolean {
    return this.loaded;
  }
  
  /**
   * Get index metadata
   */
  getMeta(): SearchIndex['meta'] | null {
    return this.index?.meta || null;
  }
  
  /**
   * Search the index
   */
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    if (!this.loaded || !query.trim()) {
      return [];
    }
    
    // Tokenize query
    const queryTerms = tokenize(query);
    
    if (queryTerms.length === 0) {
      return [];
    }
    
    // Filter entries based on options
    let filteredEntries = this.entries;
    
    if (options.type) {
      const types = Array.isArray(options.type) ? options.type : [options.type];
      filteredEntries = filteredEntries.filter(e => 
        types.includes(e.type)
      );
    }
    
    if (options.section) {
      const sections = Array.isArray(options.section) ? options.section : [options.section];
      filteredEntries = filteredEntries.filter(e => 
        sections.includes(e.section)
      );
    }
    
    if (options.category) {
      const categories = Array.isArray(options.category) ? options.category : [options.category];
      filteredEntries = filteredEntries.filter(e => 
        e.category && categories.includes(e.category)
      );
    }
    
    if (options.tags && options.tags.length > 0) {
      filteredEntries = filteredEntries.filter(e => 
        e.tags && options.tags!.some(tag => 
          e.tags!.includes(tag)
        )
      );
    }
    
    // Filter by language (i18n support)
    if (options.language) {
      filteredEntries = filteredEntries.filter(e => 
        e.language === options.language
      );
    }
    
    // Filter by version
    if (options.version) {
      filteredEntries = filteredEntries.filter(e => 
        e.version === options.version
      );
    }
    
    // Rank results
    const results = rankResults(filteredEntries, queryTerms, {
      minScore: options.minScore,
      limit: options.limit || 20,
    });
    
    // Add highlighting
    return results.map(result => ({
      ...result,
      highlightedTitle: highlightTitle(result.entry.title, queryTerms),
      highlightedDescription: highlightMatches(result.entry.description, queryTerms, {
        maxLength: 150,
      }),
      matchedHeadings: findMatchingHeadings(result.entry.headings || [], queryTerms),
    }));
  }
  
  /**
   * Search and group results by type
   */
  searchGrouped(
    query: string, 
    options: SearchOptions = {}
  ): Map<SearchContentType, SearchResult[]> {
    const results = this.search(query, { ...options, limit: options.limit || 50 });
    return groupResultsByType(results);
  }
  
  /**
   * Get suggestions for a partial query
   * Returns matching titles and tags
   */
  getSuggestions(partialQuery: string, limit: number = 5): string[] {
    if (!this.loaded || !partialQuery.trim()) {
      return [];
    }
    
    const queryLower = partialQuery.toLowerCase();
    const suggestions = new Set<string>();
    
    // Find matching titles
    for (const entry of this.entries) {
      if (suggestions.size >= limit) break;
      
      const titleLower = entry.title.toLowerCase();
      if (titleLower.startsWith(queryLower)) {
        suggestions.add(entry.title);
      }
    }
    
    // Find matching tags
    for (const entry of this.entries) {
      if (suggestions.size >= limit) break;
      
      if (entry.tags) {
        for (const tag of entry.tags) {
          if (suggestions.size >= limit) break;
          
          const tagLower = tag.toLowerCase();
          if (tagLower.startsWith(queryLower)) {
            suggestions.add(tag);
          }
        }
      }
    }
    
    return Array.from(suggestions);
  }
  
  /**
   * Get an entry by ID
   */
  getEntry(id: string): SearchIndexEntry | undefined {
    return this.entries.find(e => e.id === id);
  }
  
  /**
   * Get all entries of a specific type
   */
  getEntriesByType(type: SearchContentType): SearchIndexEntry[] {
    return this.entries.filter(e => e.type === type);
  }
  
  /**
   * Get all entries in a section
   */
  getEntriesBySection(section: string): SearchIndexEntry[] {
    return this.entries.filter(e => e.section === section);
  }
  
  /**
   * Get related entries for a given entry ID
   */
  getRelated(id: string, limit: number = 5): SearchIndexEntry[] {
    const entry = this.getEntry(id);
    if (!entry || !entry.related) {
      return [];
    }
    
    return entry.related
      .map(relId => this.getEntry(relId))
      .filter((e): e is SearchIndexEntry => e !== undefined)
      .slice(0, limit);
  }
}

/**
 * Singleton instance for convenience
 */
let searchEngineInstance: SearchEngine | null = null;

/**
 * Get the singleton search engine instance
 */
export function getSearchEngine(): SearchEngine {
  if (!searchEngineInstance) {
    searchEngineInstance = new SearchEngine();
  }
  return searchEngineInstance;
}

/**
 * Initialize the search engine with the index
 */
export async function initSearchEngine(indexUrl?: string): Promise<SearchEngine> {
  const engine = getSearchEngine();
  if (!engine.isLoaded()) {
    await engine.loadIndex(indexUrl);
  }
  return engine;
}

/**
 * Perform a quick search (convenience function)
 */
export async function quickSearch(
  query: string, 
  options?: SearchOptions
): Promise<SearchResult[]> {
  const engine = await initSearchEngine();
  return engine.search(query, options);
}
