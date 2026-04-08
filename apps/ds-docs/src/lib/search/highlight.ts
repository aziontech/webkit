/**
 * Highlight
 * 
 * Utilities for highlighting matched terms in search results.
 */

import { tokenize } from './tokenizer';

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Highlight matched terms in text
 * Wraps matched terms in <mark> tags
 */
export function highlightMatches(
  text: string,
  terms: string[],
  options: {
    /** CSS class for the mark element */
    markClass?: string;
    /** Maximum length of highlighted text */
    maxLength?: number;
    /** Whether to show ellipsis for truncated text */
    showEllipsis?: boolean;
  } = {}
): string {
  if (!text || terms.length === 0) {
    return escapeHtml(text);
  }

  const {
    markClass = 'search-highlight',
    maxLength = 200,
    showEllipsis = true,
  } = options;

  // Normalize terms for matching
  const normalizedTerms = new Set(
    terms.map(t => t.toLowerCase()).filter(t => t.length > 1)
  );

  if (normalizedTerms.size === 0) {
    return escapeHtml(text);
  }

  // Truncate text if needed, trying to keep matches visible
  let processedText = text;
  let truncated = false;

  if (text.length > maxLength) {
    // Find first match position
    const lowerText = text.toLowerCase();
    let firstMatchPos = -1;

    normalizedTerms.forEach(term => {
      const pos = lowerText.indexOf(term);
      if (pos !== -1 && (firstMatchPos === -1 || pos < firstMatchPos)) {
        firstMatchPos = pos;
      }
    });

    if (firstMatchPos > 0) {
      // Start before the first match
      const start = Math.max(0, firstMatchPos - 50);
      const end = Math.min(text.length, start + maxLength);
      processedText = (start > 0 ? '...' : '') + 
                      text.slice(start, end) + 
                      (end < text.length ? '...' : '');
      truncated = true;
    } else {
      // No match found, just truncate from start
      processedText = text.slice(0, maxLength) + (showEllipsis ? '...' : '');
      truncated = true;
    }
  }

  // Escape HTML first
  let result = escapeHtml(processedText);

  // Create a regex that matches any of the terms
  const termsArray = Array.from(normalizedTerms);
  const termsPattern = termsArray
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const regex = new RegExp(`(${termsPattern})`, 'gi');

  // Replace matches with highlighted version
  result = result.replace(regex, (match) => {
    return `<mark class="${markClass}">${match}</mark>`;
  });

  return result;
}

/**
 * Highlight matches in a title
 * Simpler version without truncation
 */
export function highlightTitle(title: string, terms: string[]): string {
  if (!title || terms.length === 0) {
    return escapeHtml(title);
  }

  // Normalize terms for matching
  const normalizedTerms = new Set(
    terms.map(t => t.toLowerCase()).filter(t => t.length > 1)
  );

  if (normalizedTerms.size === 0) {
    return escapeHtml(title);
  }

  // Escape HTML first
  let result = escapeHtml(title);

  // Create a regex that matches any of the terms
  const termsPattern = Array.from(normalizedTerms)
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const regex = new RegExp(`(${termsPattern})`, 'gi');

  // Replace matches with highlighted version
  result = result.replace(regex, (match) => {
    return `<mark class="search-highlight">${match}</mark>`;
  });

  return result;
}

/**
 * Get a snippet of text around the first match
 */
export function getMatchSnippet(
  text: string,
  terms: string[],
  contextLength: number = 50
): string {
  if (!text || terms.length === 0) {
    return text.slice(0, 100) + (text.length > 100 ? '...' : '');
  }

  const lowerText = text.toLowerCase();
  let bestPos = -1;
  let bestTerm = '';

  // Find the earliest match
  for (const term of terms) {
    const pos = lowerText.indexOf(term.toLowerCase());
    if (pos !== -1 && (bestPos === -1 || pos < bestPos)) {
      bestPos = pos;
      bestTerm = term;
    }
  }

  if (bestPos === -1) {
    return text.slice(0, 100) + (text.length > 100 ? '...' : '');
  }

  // Calculate snippet bounds
  const start = Math.max(0, bestPos - contextLength);
  const end = Math.min(text.length, bestPos + bestTerm.length + contextLength);

  let snippet = text.slice(start, end);

  // Add ellipsis
  if (start > 0) {
    snippet = '...' + snippet;
  }
  if (end < text.length) {
    snippet = snippet + '...';
  }

  return snippet;
}

/**
 * Find which headings contain matches
 */
export function findMatchingHeadings(
  headings: string[],
  terms: string[]
): string[] {
  if (!headings.length || !terms.length) {
    return [];
  }

  const normalizedTerms = new Set(
    terms.map(t => t.toLowerCase()).filter(t => t.length > 1)
  );
  const termsArray = Array.from(normalizedTerms);

  return headings.filter(heading => {
    const lowerHeading = heading.toLowerCase();
    for (const term of termsArray) {
      if (lowerHeading.includes(term)) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Calculate the position of the first match in text
 */
export function findFirstMatchPosition(
  text: string,
  terms: string[]
): number {
  if (!text || !terms.length) {
    return -1;
  }

  const lowerText = text.toLowerCase();
  let firstPos = -1;

  for (const term of terms) {
    const pos = lowerText.indexOf(term.toLowerCase());
    if (pos !== -1 && (firstPos === -1 || pos < firstPos)) {
      firstPos = pos;
    }
  }

  return firstPos;
}
