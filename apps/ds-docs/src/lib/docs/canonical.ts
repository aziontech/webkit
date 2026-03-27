/**
 * Canonical URL Utilities
 * 
 * Functions for generating canonical URLs and alternate language links for SEO.
 */

import {
  getCurrentVersion,
  isCurrentVersion,
  isDefaultLanguage,
  getDefaultLanguage,
  getAllLanguages,
  getLanguageLabel,
} from '@/config';

/**
 * Site base URL for canonical URLs
 */
export const SITE_BASE_URL = 'https://docs.azion.com';

/**
 * Canonical URL configuration
 */
export interface CanonicalConfig {
  /** Current version */
  version: string;
  /** Current language */
  language: string;
  /** Section name */
  section: string;
  /** Page slug */
  slug: string;
}

/**
 * Generate the canonical URL for a documentation page
 * 
 * Canonical URLs should:
 * - Always use the current version
 * - Use short URLs for default language
 * - Include language prefix for other languages
 * 
 * @param config - Canonical configuration
 * @returns Full canonical URL
 */
export function getCanonicalUrl(config: CanonicalConfig): string {
  const { version, language, section, slug } = config;
  
  // Canonical always points to current version
  const canonicalVersion = getCurrentVersion();
  const isDefault = isDefaultLanguage(language);
  
  // Build path
  let path: string;
  
  if (isDefault) {
    // Short URL for default language
    path = slug === 'index' ? `/${section}` : `/${section}/${slug}`;
  } else {
    // Include language for non-default
    path = slug === 'index' 
      ? `/${language}/${section}` 
      : `/${language}/${section}/${slug}`;
  }
  
  return `${SITE_BASE_URL}${path}`;
}

/**
 * Generate alternate language URLs for hreflang tags
 * 
 * @param config - Current page configuration
 * @returns Map of language codes to URLs
 */
export function getAlternateUrls(config: CanonicalConfig): Map<string, string> {
  const { version, section, slug } = config;
  const alternates = new Map<string, string>();
  
  // Always use current version for alternates
  const canonicalVersion = getCurrentVersion();
  
  for (const lang of getAllLanguages()) {
    const isDefault = isDefaultLanguage(lang);
    
    let path: string;
    if (isDefault) {
      path = slug === 'index' ? `/${section}` : `/${section}/${slug}`;
    } else {
      path = slug === 'index' 
        ? `/${lang}/${section}` 
        : `/${lang}/${section}/${slug}`;
    }
    
    alternates.set(lang, `${SITE_BASE_URL}${path}`);
  }
  
  return alternates;
}

/**
 * Generate hreflang tags for HTML head
 * 
 * @param config - Current page configuration
 * @returns Array of hreflang link objects
 */
export function getHreflangTags(config: CanonicalConfig): Array<{
  hreflang: string;
  href: string;
}> {
  const alternates = getAlternateUrls(config);
  const tags: Array<{ hreflang: string; href: string }> = [];
  
  // Add x-default (points to default language)
  const defaultUrl = alternates.get(getDefaultLanguage());
  if (defaultUrl) {
    tags.push({
      hreflang: 'x-default',
      href: defaultUrl,
    });
  }
  
  // Add each language
  alternates.forEach((url, lang) => {
    tags.push({
      hreflang: lang,
      href: url,
    });
  });
  
  return tags;
}

/**
 * Generate OG URL for social sharing
 * 
 * @param config - Current page configuration
 * @returns OG URL
 */
export function getOgUrl(config: CanonicalConfig): string {
  return getCanonicalUrl(config);
}

/**
 * Generate the full URL for the current page
 * 
 * @param config - Current page configuration
 * @returns Full URL
 */
export function getCurrentPageUrl(config: CanonicalConfig): string {
  const { version, language, section, slug } = config;
  
  const isCurrent = isCurrentVersion(version);
  const isDefault = isDefaultLanguage(language);
  
  let path: string;
  
  if (isCurrent && isDefault) {
    // Short URL
    path = slug === 'index' ? `/${section}` : `/${section}/${slug}`;
  } else if (isCurrent) {
    // Current version, non-default language
    path = slug === 'index' 
      ? `/${language}/${section}` 
      : `/${language}/${section}/${slug}`;
  } else if (isDefault) {
    // Non-current version, default language
    path = slug === 'index' 
      ? `/${version}/${section}` 
      : `/${version}/${section}/${slug}`;
  } else {
    // Non-current version, non-default language
    path = slug === 'index' 
      ? `/${version}/${language}/${section}` 
      : `/${version}/${language}/${section}/${slug}`;
  }
  
  return `${SITE_BASE_URL}${path}`;
}

/**
 * SEO metadata for a documentation page
 */
export interface SeoMetadata {
  /** Canonical URL */
  canonical: string;
  /** OG URL */
  ogUrl: string;
  /** Alternate language URLs */
  alternates: Map<string, string>;
  /** hreflang tags */
  hreflangTags: Array<{ hreflang: string; href: string }>;
  /** Whether this is an older version */
  isOlderVersion: boolean;
  /** Whether this is a translation */
  isTranslation: boolean;
}

/**
 * Get complete SEO metadata for a documentation page
 * 
 * @param config - Page configuration
 * @returns Complete SEO metadata
 */
export function getSeoMetadata(config: CanonicalConfig): SeoMetadata {
  return {
    canonical: getCanonicalUrl(config),
    ogUrl: getOgUrl(config),
    alternates: getAlternateUrls(config),
    hreflangTags: getHreflangTags(config),
    isOlderVersion: !isCurrentVersion(config.version),
    isTranslation: !isDefaultLanguage(config.language),
  };
}
