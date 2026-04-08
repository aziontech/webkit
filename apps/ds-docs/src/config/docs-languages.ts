/**
 * Documentation Language Configuration
 * 
 * Centralized configuration for documentation internationalization (i18n).
 * Supports multiple languages with graceful fallback to the default language.
 */

/**
 * Language configuration structure
 */
export interface DocsLanguageConfig {
  /** Default language code (used for short URLs) */
  default: string;
  /** All supported language codes (ISO 639-1) */
  supported: string[];
  /** Language labels for display (native names) */
  labels: Record<string, string>;
  /** English names for languages */
  englishLabels?: Record<string, string>;
  /** RTL (right-to-left) language support */
  rtlLanguages?: string[];
}

/**
 * Documentation languages configuration
 * 
 * Current: English (default)
 * Future: Portuguese and other languages
 * 
 * @example
 * // Future configuration with multiple languages:
 * export const DOCS_LANGUAGES: DocsLanguageConfig = {
 *   default: 'en',
 *   supported: ['en', 'pt', 'es'],
 *   labels: {
 *     en: 'English',
 *     pt: 'Português',
 *     es: 'Español',
 *   },
 *   englishLabels: {
 *     en: 'English',
 *     pt: 'Portuguese',
 *     es: 'Spanish',
 *   },
 * };
 */
export const DOCS_LANGUAGES: DocsLanguageConfig = {
  default: 'en',
  supported: ['en', 'pt'],
  labels: {
    en: 'EN',
    pt: 'PT-BR',
  },
  englishLabels: {
    en: 'EN',
    pt: 'PT-BR',
  },
};

/**
 * Get the default documentation language
 * 
 * @returns The default language code (e.g., 'en')
 */
export function getDefaultLanguage(): string {
  return DOCS_LANGUAGES.default;
}

/**
 * Check if a language code is supported
 * 
 * @param language - Language code to check (ISO 639-1)
 * @returns True if the language is in the supported list
 * 
 * @example
 * isSupportedLanguage('en'); // true
 * isSupportedLanguage('pt'); // true
 * isSupportedLanguage('fr'); // false
 */
export function isSupportedLanguage(language: string): boolean {
  return DOCS_LANGUAGES.supported.includes(language);
}

/**
 * Check if a language is the default language
 * 
 * @param language - Language code to check
 * @returns True if this is the default language
 */
export function isDefaultLanguage(language: string): boolean {
  return language === DOCS_LANGUAGES.default;
}

/**
 * Get all supported languages
 * 
 * @returns Array of language codes
 */
export function getAllLanguages(): string[] {
  return [...DOCS_LANGUAGES.supported];
}

/**
 * Get the display label for a language (native name)
 * 
 * @param language - Language code
 * @returns Native name for the language
 */
export function getLanguageLabel(language: string): string {
  return DOCS_LANGUAGES.labels[language] ?? language;
}

/**
 * Get the English name for a language
 * 
 * @param language - Language code
 * @returns English name for the language
 */
export function getLanguageEnglishLabel(language: string): string {
  return DOCS_LANGUAGES.englishLabels?.[language] ?? DOCS_LANGUAGES.labels[language] ?? language;
}

/**
 * Check if a language is RTL (right-to-left)
 * 
 * @param language - Language code
 * @returns True if the language is RTL
 */
export function isRTLLanguage(language: string): boolean {
  return DOCS_LANGUAGES.rtlLanguages?.includes(language) ?? false;
}

/**
 * Get the text direction for a language
 * 
 * @param language - Language code
 * @returns 'rtl' or 'ltr'
 */
export function getLanguageDirection(language: string): 'rtl' | 'ltr' {
  return isRTLLanguage(language) ? 'rtl' : 'ltr';
}

/**
 * Validate and normalize a language code
 * 
 * @param language - Language code to validate
 * @returns The validated language code or the default language
 */
export function validateLanguage(language: string | undefined): string {
  if (!language) return DOCS_LANGUAGES.default;
  const normalized = language.toLowerCase();
  return isSupportedLanguage(normalized) ? normalized : DOCS_LANGUAGES.default;
}

/**
 * Get fallback language for a missing translation
 * 
 * @param language - Requested language
 * @returns The language to fall back to (usually the default)
 */
export function getFallbackLanguage(language: string): string {
  // If the language is not supported, fall back to default
  if (!isSupportedLanguage(language)) {
    return DOCS_LANGUAGES.default;
  }
  
  // If the language is supported but content might be missing,
  // we still return the requested language - the content resolver
  // will handle the actual fallback
  return language;
}

/**
 * Language route configuration
 */
export const LANGUAGE_ROUTES = {
  /** URL parameter name for language */
  param: 'lang',
  /** Default language URL behavior */
  defaultInUrl: false, // Don't include default language in URLs
} as const;

/**
 * Build a language-specific URL
 * 
 * @param language - Language code
 * @param path - Base path without language prefix
 * @param isDefault - Whether this is the default language
 * @returns URL with language prefix if needed
 */
export function buildLanguageUrl(
  language: string,
  path: string,
  isDefault: boolean = true
): string {
  // Don't prefix default language URLs
  if (isDefault) {
    return path;
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `/${language}${normalizedPath}`;
}

/**
 * Get alternate language URLs for hreflang tags
 * 
 * @param currentPath - Current page path (without language prefix)
 * @param currentLanguage - Current language code
 * @returns Map of language codes to URLs
 */
export function getAlternateLanguageUrls(
  currentPath: string,
  currentLanguage: string
): Record<string, string> {
  const alternates: Record<string, string> = {};
  
  for (const lang of DOCS_LANGUAGES.supported) {
    if (lang !== currentLanguage) {
      alternates[lang] = buildLanguageUrl(lang, currentPath, isDefaultLanguage(lang));
    }
  }
  
  return alternates;
}

/**
 * UI string keys for translation
 * These are UI strings that need translation (not content)
 */
export const UI_STRING_KEYS = [
  // Navigation
  'nav.getStarted',
  'nav.foundations',
  'nav.tokens',
  'nav.components',
  'nav.blocks',
  'nav.patterns',
  'nav.templates',
  'nav.icons',
  'nav.playground',
  'nav.contributing',
  
  // Search
  'search.placeholder',
  'search.noResults',
  'search.clear',
  'search.close',
  
  // Version
  'version.current',
  'version.latest',
  'version.older',
  'version.banner',
  
  // Status
  'status.stable',
  'status.beta',
  'status.deprecated',
  'status.planned',
  'status.experimental',
  
  // Common
  'common.onThisPage',
  'common.lastUpdated',
  'common.contributors',
  'common.editPage',
  'common.reportIssue',
] as const;

export type UIStringKey = typeof UI_STRING_KEYS[number];
