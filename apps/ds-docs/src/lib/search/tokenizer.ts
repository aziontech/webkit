/**
 * Tokenizer
 * 
 * Text processing utilities for search indexing and querying.
 * Handles normalization, tokenization, and text cleaning.
 */

/**
 * Common English stop words to filter out
 * These words are too common to be useful for search
 */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'were', 'will', 'with', 'the', 'this', 'but', 'they',
  'have', 'had', 'what', 'when', 'where', 'who', 'which', 'why', 'how',
  'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 'can', 'just', 'should', 'now', 'or', 'if', 'then', 'else',
]);

/**
 * Normalize text for search
 * - Converts to lowercase
 * - Removes markdown formatting
 * - Removes special characters
 * - Normalizes whitespace
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // Remove inline code
    .replace(/`[^`]+`/g, ' ')
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, ' ')
    // Remove markdown headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove markdown bold/italic
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Remove special characters but keep alphanumeric and spaces
    .replace(/[^\w\s-]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Convert to lowercase
    .toLowerCase()
    .trim();
}

/**
 * Tokenize text into individual terms
 * - Normalizes text first
 * - Splits on whitespace
 * - Filters stop words
 * - Removes empty tokens
 */
export function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  
  return normalized
    .split(/\s+/)
    .filter(token => token.length > 0)
    .filter(token => !STOP_WORDS.has(token));
}

/**
 * Extract unique tokens from text
 * Returns a Set of unique tokens
 */
export function extractUniqueTokens(text: string): Set<string> {
  return new Set(tokenize(text));
}

/**
 * Create n-grams from a string
 * Useful for fuzzy matching
 */
export function createNgrams(text: string, n: number = 3): string[] {
  const normalized = normalizeText(text);
  const ngrams: string[] = [];
  
  for (let i = 0; i <= normalized.length - n; i++) {
    ngrams.push(normalized.slice(i, i + n));
  }
  
  return ngrams;
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Calculate similarity ratio between two strings (0-1)
 */
export function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
  const maxLength = Math.max(a.length, b.length);
  
  return 1 - distance / maxLength;
}

/**
 * Check if a term matches with fuzzy tolerance
 */
export function fuzzyMatch(term: string, target: string, threshold: number = 0.8): boolean {
  if (term === target) return true;
  if (term.startsWith(target) || target.startsWith(term)) return true;
  
  return similarity(term, target) >= threshold;
}

/**
 * Extract words that look like component names or identifiers
 * These are typically PascalCase or kebab-case
 */
export function extractIdentifiers(text: string): string[] {
  const identifiers: string[] = [];
  
  // Match PascalCase identifiers
  const pascalCase = text.match(/[A-Z][a-z]+(?:[A-Z][a-z]+)*/g) || [];
  identifiers.push(...pascalCase.map(s => s.toLowerCase()));
  
  // Match kebab-case identifiers
  const kebabCase = text.match(/[a-z]+(?:-[a-z]+)+/g) || [];
  identifiers.push(...kebabCase);
  
  return identifiers;
}

/**
 * Stem a word to its root form
 * Simple implementation - just removes common suffixes
 * For more sophisticated stemming, consider Porter stemmer
 */
export function simpleStem(word: string): string {
  const lower = word.toLowerCase();
  
  // Common suffix patterns to remove
  const suffixes = [
    'ization', 'ational', 'ousness', 'fulness', 'iveness',
    'ations', 'ically', 'encies', 'ancies', 'ement',
    'ation', 'ences', 'ances', 'ments', 'ities',
    'ally', 'ence', 'ance', 'ment', 'ness', 'able', 'ible',
    'ious', 'eous', 'ical', 'ings', 'tion', 'sion',
    'ing', 'ion', 'ity', 'ies', 'ive', 'ous', 'ess',
    'ed', 'er', 'ly', 'es', 's',
  ];
  
  for (const suffix of suffixes) {
    if (lower.endsWith(suffix) && lower.length > suffix.length + 2) {
      return lower.slice(0, -suffix.length);
    }
  }
  
  return lower;
}

/**
 * Create a searchable token map with positions
 * Useful for phrase matching and highlighting
 */
export interface TokenPosition {
  token: string;
  start: number;
  end: number;
}

export function tokenizeWithPositions(text: string): TokenPosition[] {
  const positions: TokenPosition[] = [];
  const normalized = normalizeText(text);
  
  let match;
  const regex = /\b\w+\b/g;
  
  while ((match = regex.exec(normalized)) !== null) {
    const token = match[0].toLowerCase();
    if (!STOP_WORDS.has(token)) {
      positions.push({
        token,
        start: match.index,
        end: match.index + token.length,
      });
    }
  }
  
  return positions;
}
