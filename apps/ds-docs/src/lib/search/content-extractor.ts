/**
 * Content Extractor
 * 
 * Utilities for extracting searchable content from markdown documents.
 * Used during the build process to create the search index.
 */

/**
 * Extract headings from markdown content
 */
export function extractHeadings(content: string): string[] {
  const headings: string[] = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    // Remove any trailing {#custom-id} or similar
    const headingText = match[2]
      .replace(/\s*\{#[^}]+\}\s*$/, '')
      .replace(/\s*\[#[^}]+\]\s*$/, '')
      .trim();
    
    if (headingText) {
      headings.push(headingText);
    }
  }
  
  return headings;
}

/**
 * Extract text content from markdown
 * Removes code blocks, links, images, and formatting
 */
export function extractTextContent(content: string): string {
  let text = content;
  
  // Remove frontmatter
  text = text.replace(/^---[\s\S]*?---/, '');
  
  // Remove code blocks (fenced)
  text = text.replace(/```[\s\S]*?```/g, ' ');
  
  // Remove inline code
  text = text.replace(/`[^`]+`/g, ' ');
  
  // Remove import statements
  text = text.replace(/^import\s+.*$/gm, '');
  
  // Remove component usage (custom components in markdown)
  text = text.replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, ' ');
  text = text.replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, ' ');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Remove markdown links but keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove markdown images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, ' ');
  
  // Remove markdown heading markers
  text = text.replace(/^#{1,6}\s+/gm, '');
  
  // Remove markdown bold/italic
  text = text.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1');
  
  // Remove blockquotes
  text = text.replace(/^>\s+/gm, '');
  
  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, '');
  
  // Remove list markers
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');
  
  // Remove special characters except basic punctuation
  text = text.replace(/[^\w\s.,!?;:'"()-]/g, ' ');
  
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

/**
 * Extract component names from content
 * Looks for common patterns like component references
 */
export function extractComponentNames(content: string): string[] {
  const names = new Set<string>();
  
  // Match PascalCase component names
  const pascalCase = content.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b/g) || [];
  pascalCase.forEach(name => names.add(name));
  
  // Match <ComponentName patterns
  const jsxPattern = content.match(/<([A-Z][a-zA-Z]+)/g) || [];
  jsxPattern.forEach(match => {
    const name = match.slice(1);
    if (name) names.add(name);
  });
  
  return Array.from(names);
}

/**
 * Extract code titles from code blocks
 */
export function extractCodeTitles(content: string): string[] {
  const titles: string[] = [];
  
  // Match code blocks with titles: ```language title="filename"
  const titledCodeBlocks = content.match(/```[a-z]*\s+title="([^"]+)"/gi) || [];
  titledCodeBlocks.forEach(match => {
    const titleMatch = match.match(/title="([^"]+)"/i);
    if (titleMatch && titleMatch[1]) {
      titles.push(titleMatch[1]);
    }
  });
  
  return titles;
}

/**
 * Extract prop names from API tables
 */
export function extractPropNames(content: string): string[] {
  const props: string[] = [];
  
  // Match prop definitions in tables: | `propName` | type | default | description |
  const propRows = content.match(/\|\s*`([a-zA-Z][a-zA-Z0-9]*)`\s*\|/g) || [];
  propRows.forEach(match => {
    const propMatch = match.match(/`([a-zA-Z][a-zA-Z0-9]*)`/);
    if (propMatch && propMatch[1]) {
      props.push(propMatch[1]);
    }
  });
  
  return props;
}

/**
 * Truncate content to a maximum length
 * Tries to break at word boundaries
 */
export function truncateContent(content: string, maxLength: number = 2000): string {
  if (content.length <= maxLength) {
    return content;
  }
  
  // Try to break at a sentence boundary
  const truncated = content.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclaim = truncated.lastIndexOf('!');
  
  const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclaim);
  
  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.slice(0, lastSentenceEnd + 1);
  }
  
  // Try to break at a word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace);
  }
  
  return truncated;
}

/**
 * Extract all searchable content from a markdown document
 */
export interface ExtractedContent {
  headings: string[];
  text: string;
  componentNames: string[];
  codeTitles: string[];
  propNames: string[];
}

export function extractAllContent(content: string): ExtractedContent {
  return {
    headings: extractHeadings(content),
    text: truncateContent(extractTextContent(content)),
    componentNames: extractComponentNames(content),
    codeTitles: extractCodeTitles(content),
    propNames: extractPropNames(content),
  };
}

/**
 * Build a searchable content string from extracted content
 */
export function buildSearchableContent(extracted: ExtractedContent): string {
  const parts: string[] = [];
  
  // Add component names (high priority)
  if (extracted.componentNames.length > 0) {
    parts.push(extracted.componentNames.join(' '));
  }
  
  // Add headings
  if (extracted.headings.length > 0) {
    parts.push(extracted.headings.join(' '));
  }
  
  // Add code titles
  if (extracted.codeTitles.length > 0) {
    parts.push(extracted.codeTitles.join(' '));
  }
  
  // Add prop names
  if (extracted.propNames.length > 0) {
    parts.push(extracted.propNames.join(' '));
  }
  
  // Add main text content
  parts.push(extracted.text);
  
  return parts.join(' ');
}
