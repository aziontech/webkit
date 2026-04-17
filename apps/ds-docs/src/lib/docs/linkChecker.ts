/**
 * Documentation Link Checker
 * 
 * Scans documentation markdown files and verifies:
 * - Internal links exist
 * - Section anchors exist
 * - Referenced component pages exist
 */

import type { DocFile } from './docLint';

/**
 * Link type
 */
export type LinkType = 'internal' | 'anchor' | 'external' | 'asset' | 'component';

/**
 * Link status
 */
export type LinkStatus = 'valid' | 'broken' | 'warning' | 'unknown';

/**
 * Detected link
 */
export interface DetectedLink {
  /** Link text or URL */
  text: string;
  /** Link URL/href */
  url: string;
  /** Type of link */
  type: LinkType;
  /** Source file containing the link */
  sourceFile: string;
  /** Line number in source file */
  line?: number;
  /** Column number in source file */
  column?: number;
}

/**
 * Link check result
 */
export interface LinkCheckResult {
  link: DetectedLink;
  status: LinkStatus;
  message: string;
  suggestion?: string;
}

/**
 * File link check result
 */
export interface FileLinkCheckResult {
  filePath: string;
  links: DetectedLink[];
  results: LinkCheckResult[];
  valid: boolean;
}

/**
 * Overall link check result
 */
export interface LinkCheckerResult {
  files: FileLinkCheckResult[];
  summary: {
    totalLinks: number;
    validLinks: number;
    brokenLinks: number;
    warnings: number;
    unknown: number;
  };
  passed: boolean;
}

/**
 * Link checker options
 */
export interface LinkCheckerOptions {
  /** Check external links (requires network) */
  checkExternal?: boolean;
  /** Check asset links */
  checkAssets?: boolean;
  /** Base path for resolving internal links */
  basePath?: string;
  /** Known valid external domains */
  allowedDomains?: string[];
  /** File patterns to include */
  include?: string[];
  /** File patterns to exclude */
  exclude?: string[];
}

/**
 * Default link checker options
 */
const DEFAULT_LINK_CHECKER_OPTIONS: LinkCheckerOptions = {
  checkExternal: false,
  checkAssets: true,
  basePath: '',
  allowedDomains: ['azion.com', 'docs.azion.com', 'github.com'],
};

/**
 * Extract all links from markdown content
 */
export function extractLinks(content: string, filePath: string): DetectedLink[] {
  const links: DetectedLink[] = [];
  const lines = content.split('\n');

  // Regex patterns for different link formats
  const markdownLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  const htmlLinkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineNum = lineIndex + 1;

    // Extract markdown links
    let match;
    while ((match = markdownLinkRegex.exec(line)) !== null) {
      const url = match[2];
      // Skip image links (handled separately)
      if (!url.startsWith('!')) {
        links.push({
          text: match[1],
          url,
          type: classifyLink(url),
          sourceFile: filePath,
          line: lineNum,
          column: match.index + 1,
        });
      }
    }

    // Extract HTML links
    while ((match = htmlLinkRegex.exec(line)) !== null) {
      links.push({
        text: match[2],
        url: match[1],
        type: classifyLink(match[1]),
        sourceFile: filePath,
        line: lineNum,
        column: match.index + 1,
      });
    }

    // Extract image references
    while ((match = imageRegex.exec(line)) !== null) {
      links.push({
        text: match[1],
        url: match[2],
        type: 'asset',
        sourceFile: filePath,
        line: lineNum,
        column: match.index + 1,
      });
    }

    // Extract HTML image references
    while ((match = htmlImageRegex.exec(line)) !== null) {
      links.push({
        text: '',
        url: match[1],
        type: 'asset',
        sourceFile: filePath,
        line: lineNum,
        column: match.index + 1,
      });
    }
  }

  return links;
}

/**
 * Classify a link by type
 */
export function classifyLink(url: string): LinkType {
  // External links
  if (/^https?:\/\//i.test(url)) {
    return 'external';
  }

  // Anchor links
  if (url.startsWith('#')) {
    return 'anchor';
  }

  // Asset links
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico|pdf|zip)$/i.test(url)) {
    return 'asset';
  }

  // Component links (pointing to component docs)
  if (/\/components\//.test(url)) {
    return 'component';
  }

  // Default to internal
  return 'internal';
}

/**
 * Check if an internal link is valid
 */
export function checkInternalLink(
  link: DetectedLink,
  allFiles: DocFile[]
): LinkCheckResult {
  // Normalize the URL
  const normalizedUrl = normalizeInternalUrl(link.url);
  
  // Check if the target file exists
  const targetExists = allFiles.some((file) => {
    const normalizedPath = normalizeFilePath(file.path);
    return normalizedPath === normalizedUrl;
  });

  if (targetExists) {
    return {
      link,
      status: 'valid',
      message: 'Link target exists',
    };
  }

  return {
    link,
    status: 'broken',
    message: `Link target not found: ${normalizedUrl}`,
    suggestion: 'Verify the file path or create the missing document',
  };
}

/**
 * Check if an anchor link is valid
 */
export function checkAnchorLink(
  link: DetectedLink,
  sourceFile: DocFile
): LinkCheckResult {
  const anchor = link.url.slice(1); // Remove #

  if (!anchor) {
    return {
      link,
      status: 'warning',
      message: 'Empty anchor link',
      suggestion: 'Specify the target heading ID',
    };
  }

  // Extract headings from the source file content
  const headings = extractHeadings(sourceFile.content);
  const anchorExists = headings.some((h) => 
    generateHeadingId(h) === anchor.toLowerCase()
  );

  if (anchorExists) {
    return {
      link,
      status: 'valid',
      message: 'Anchor target exists',
    };
  }

  return {
    link,
    status: 'broken',
    message: `Anchor target not found: #${anchor}`,
    suggestion: 'Verify the heading ID exists on the page',
  };
}

/**
 * Check if a component link is valid
 */
export function checkComponentLink(
  link: DetectedLink,
  allFiles: DocFile[]
): LinkCheckResult {
  // Extract component name from URL
  const componentName = extractComponentName(link.url);

  if (!componentName) {
    return {
      link,
      status: 'warning',
      message: 'Could not determine component name from URL',
      suggestion: 'Use a valid component documentation path',
    };
  }

  // Check if component documentation exists
  const componentDocExists = allFiles.some((file) => {
    const path = file.path.toLowerCase();
    return path.includes(`/components/${componentName.toLowerCase()}`) ||
           path.includes(`\\components\\${componentName.toLowerCase()}`);
  });

  if (componentDocExists) {
    return {
      link,
      status: 'valid',
      message: `Component documentation exists: ${componentName}`,
    };
  }

  return {
    link,
    status: 'broken',
    message: `Component documentation not found: ${componentName}`,
    suggestion: `Create documentation for ${componentName} component`,
  };
}

/**
 * Check if an asset link is valid
 */
export function checkAssetLink(
  link: DetectedLink,
  options: LinkCheckerOptions
): LinkCheckResult {
  // For now, just check if the URL is properly formatted
  // In a real implementation, this would check if the file exists
  
  if (!link.url || link.url === '#') {
    return {
      link,
      status: 'broken',
      message: 'Empty or invalid asset URL',
      suggestion: 'Provide a valid asset path',
    };
  }

  // Check for common issues
  if (link.url.includes(' ')) {
    return {
      link,
      status: 'warning',
      message: 'Asset URL contains spaces',
      suggestion: 'Use URL encoding or rename the file',
    };
  }

  return {
    link,
    status: 'unknown',
    message: 'Asset existence could not be verified',
    suggestion: 'Verify the asset file exists in the public directory',
  };
}

/**
 * Check if an external link is valid
 */
export function checkExternalLink(
  link: DetectedLink,
  options: LinkCheckerOptions
): LinkCheckResult {
  // For now, just validate URL format
  // In a real implementation, this would make HTTP requests
  
  try {
    const url = new URL(link.url);
    
    // Check if domain is allowed
    if (options.allowedDomains) {
      const isAllowed = options.allowedDomains.some(
        (domain) => url.hostname.endsWith(domain)
      );
      
      if (!isAllowed) {
        return {
          link,
          status: 'warning',
          message: `External domain not in allowed list: ${url.hostname}`,
          suggestion: 'Verify this external link is intentional',
        };
      }
    }

    return {
      link,
      status: 'unknown',
      message: 'External link (not verified)',
      suggestion: 'Enable external link checking to verify',
    };
  } catch {
    return {
      link,
      status: 'broken',
      message: 'Invalid URL format',
      suggestion: 'Verify the URL is correctly formatted',
    };
  }
}

/**
 * Check all links in a file
 */
export function checkFileLinks(
  file: DocFile,
  allFiles: DocFile[],
  options: LinkCheckerOptions = {}
): FileLinkCheckResult {
  const opts = { ...DEFAULT_LINK_CHECKER_OPTIONS, ...options };
  const links = extractLinks(file.content, file.path);
  const results: LinkCheckResult[] = [];

  for (const link of links) {
    let result: LinkCheckResult;

    switch (link.type) {
      case 'internal':
        result = checkInternalLink(link, allFiles);
        break;
      case 'anchor':
        result = checkAnchorLink(link, file);
        break;
      case 'component':
        result = checkComponentLink(link, allFiles);
        break;
      case 'asset':
        result = checkAssetLink(link, opts);
        break;
      case 'external':
        result = opts.checkExternal
          ? checkExternalLink(link, opts)
          : { link, status: 'unknown', message: 'External link checking disabled' };
        break;
      default:
        result = { link, status: 'unknown', message: 'Unknown link type' };
    }

    results.push(result);
  }

  return {
    filePath: file.path,
    links,
    results,
    valid: !results.some((r) => r.status === 'broken'),
  };
}

/**
 * Check all links in all files
 */
export function checkAllLinks(
  files: DocFile[],
  options: LinkCheckerOptions = {}
): LinkCheckerResult {
  const fileResults: FileLinkCheckResult[] = [];

  for (const file of files) {
    const result = checkFileLinks(file, files, options);
    fileResults.push(result);
  }

  // Calculate summary
  const allResults = fileResults.flatMap((f) => f.results);
  const summary = {
    totalLinks: allResults.length,
    validLinks: allResults.filter((r) => r.status === 'valid').length,
    brokenLinks: allResults.filter((r) => r.status === 'broken').length,
    warnings: allResults.filter((r) => r.status === 'warning').length,
    unknown: allResults.filter((r) => r.status === 'unknown').length,
  };

  return {
    files: fileResults,
    summary,
    passed: summary.brokenLinks === 0,
  };
}

/**
 * Normalize an internal URL for comparison
 */
function normalizeInternalUrl(url: string): string {
  // Remove leading ./ or /
  let normalized = url.replace(/^\.?\//, '');
  
  // Remove .md or .mdx extension
  normalized = normalized.replace(/\.(md|mdx)$/, '');
  
  // Remove trailing /index
  normalized = normalized.replace(/\/index$/, '');
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  
  return normalized.toLowerCase();
}

/**
 * Normalize a file path for comparison
 */
function normalizeFilePath(path: string): string {
  // Remove file extension
  let normalized = path.replace(/\.(md|mdx)$/, '');
  
  // Remove content directory prefix
  normalized = normalized.replace(/^content\//, '');
  normalized = normalized.replace(/^content\\/, '');
  
  // Remove language prefix (en/, pt/, etc.)
  normalized = normalized.replace(/^[a-z]{2}\//, '');
  
  // Remove trailing /index
  normalized = normalized.replace(/\/index$/, '');
  
  // Normalize slashes
  normalized = normalized.replace(/\\/g, '/');
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  
  return normalized.toLowerCase();
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): string[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: string[] = [];
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(match[2].trim());
  }
  
  return headings;
}

/**
 * Generate a heading ID from heading text
 */
function generateHeadingId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Extract component name from URL
 */
function extractComponentName(url: string): string | null {
  const match = url.match(/\/components\/([^\/]+)/);
  return match ? match[1].replace(/\.(md|mdx)$/, '') : null;
}

/**
 * Format link check result for display
 */
export function formatLinkCheckResult(result: LinkCheckerResult): string {
  const lines: string[] = [];

  lines.push('Documentation Link Check Results');
  lines.push('='.repeat(50));
  lines.push('');

  // Summary
  lines.push('Summary:');
  lines.push(`  Total links: ${result.summary.totalLinks}`);
  lines.push(`  Valid links: ${result.summary.validLinks}`);
  lines.push(`  Broken links: ${result.summary.brokenLinks}`);
  lines.push(`  Warnings: ${result.summary.warnings}`);
  lines.push(`  Unknown: ${result.summary.unknown}`);
  lines.push('');

  // Broken links
  const brokenLinks = result.files
    .flatMap((f) => f.results)
    .filter((r) => r.status === 'broken');

  if (brokenLinks.length > 0) {
    lines.push('Broken Links:');
    lines.push('-'.repeat(50));

    for (const { link, message, suggestion } of brokenLinks) {
      lines.push(`\n${link.sourceFile}:${link.line || '?'}`);
      lines.push(`  URL: ${link.url}`);
      lines.push(`  ${message}`);
      if (suggestion) {
        lines.push(`  Suggestion: ${suggestion}`);
      }
    }
  }

  // Warnings
  const warnings = result.files
    .flatMap((f) => f.results)
    .filter((r) => r.status === 'warning');

  if (warnings.length > 0) {
    lines.push('\nWarnings:');
    lines.push('-'.repeat(50));

    for (const { link, message, suggestion } of warnings) {
      lines.push(`\n${link.sourceFile}:${link.line || '?'}`);
      lines.push(`  URL: ${link.url}`);
      lines.push(`  ${message}`);
      if (suggestion) {
        lines.push(`  Suggestion: ${suggestion}`);
      }
    }
  }

  lines.push('');
  lines.push(result.passed ? '✅ All links valid' : '❌ Broken links found');

  return lines.join('\n');
}
