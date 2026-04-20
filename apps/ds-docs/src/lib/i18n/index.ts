/**
 * i18n Utilities
 * 
 * Provides translation functionality for UI strings.
 * Content translations are handled separately through content collections.
 */

import { getDefaultLanguage, isSupportedLanguage, getLanguageLabel } from '@/config';

// Import translation files
import enTranslations from '../../../i18n/en.json';
import ptTranslations from '../../../i18n/pt.json';

/**
 * Translation dictionary type
 */
type TranslationDict = typeof enTranslations;

/**
 * All available translations
 */
const translations: Record<string, TranslationDict> = {
  en: enTranslations,
  pt: ptTranslations,
};

/**
 * Get translations for a language
 * 
 * @param language - Language code
 * @returns Translation dictionary
 */
export function getTranslations(language: string): TranslationDict {
  const lang = isSupportedLanguage(language) ? language : getDefaultLanguage();
  return translations[lang] ?? translations[getDefaultLanguage()];
}

/**
 * Get a translation value by key path
 * 
 * @param key - Dot-notation key path (e.g., 'nav.getStarted')
 * @param language - Language code
 * @returns Translated string or key if not found
 * 
 * @example
 * t('nav.getStarted', 'pt') // Returns "Começar"
 * t('search.placeholder', 'en') // Returns "Search documentation..."
 */
export function t(key: string, language?: string): string {
  const lang = language ?? getDefaultLanguage();
  const dict = getTranslations(lang);
  
  // Navigate the key path
  const parts = key.split('.');
  let value: unknown = dict;
  
  for (const part of parts) {
    if (typeof value === 'object' && value !== null && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      // Key not found, return the key itself
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Get a translation with interpolation
 * 
 * @param key - Dot-notation key path
 * @param params - Parameters to interpolate
 * @param language - Language code
 * @returns Translated string with interpolated values
 * 
 * @example
 * tInterpolated('search.noResults', { query: 'button' }, 'en')
 * // Returns "No results found for \"button\""
 */
export function tInterpolated(
  key: string,
  params: Record<string, string | number>,
  language?: string
): string {
  let text = t(key, language);
  
  // Replace {param} placeholders
  for (const [param, value] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
  }
  
  return text;
}

/**
 * Get a translation with pluralization
 * 
 * @param key - Dot-notation key path (should contain {plural} placeholder)
 * @param count - Count for pluralization
 * @param language - Language code
 * @returns Translated string with proper plural form
 * 
 * @example
 * tPlural('search.resultsCount', 1, 'en') // Returns "1 result"
 * tPlural('search.resultsCount', 5, 'en') // Returns "5 results"
 */
export function tPlural(key: string, count: number, language?: string): string {
  const text = tInterpolated(key, { count, plural: count === 1 ? '' : 's' }, language);
  return text;
}

/**
 * Check if a translation key exists
 * 
 * @param key - Dot-notation key path
 * @param language - Language code
 * @returns True if the key exists in the translation dictionary
 */
export function hasTranslation(key: string, language?: string): boolean {
  const lang = language ?? getDefaultLanguage();
  const dict = getTranslations(lang);
  
  const parts = key.split('.');
  let value: unknown = dict;
  
  for (const part of parts) {
    if (typeof value === 'object' && value !== null && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return false;
    }
  }
  
  return typeof value === 'string';
}

/**
 * Get all translation keys for a namespace
 * 
 * @param namespace - Namespace prefix (e.g., 'nav')
 * @param language - Language code
 * @returns Object with all keys in the namespace
 */
export function getNamespace(
  namespace: string,
  language?: string
): Record<string, string> {
  const lang = language ?? getDefaultLanguage();
  const dict = getTranslations(lang);
  
  const parts = namespace.split('.');
  let value: unknown = dict;
  
  for (const part of parts) {
    if (typeof value === 'object' && value !== null && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return {};
    }
  }
  
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, string>;
  }
  
  return {};
}

/**
 * i18n context for a specific language
 * Provides a convenient way to get translations for a language
 */
export interface I18nContext {
  /** Language code */
  language: string;
  /** Get a translation */
  t: (key: string) => string;
  /** Get a translation with interpolation */
  tInterpolated: (key: string, params: Record<string, string | number>) => string;
  /** Get a translation with pluralization */
  tPlural: (key: string, count: number) => string;
  /** Check if a key exists */
  has: (key: string) => boolean;
  /** Get a namespace */
  namespace: (ns: string) => Record<string, string>;
  /** Get language label */
  languageLabel: string;
}

/**
 * Create an i18n context for a language
 * 
 * @param language - Language code
 * @returns i18n context object
 */
export function createI18nContext(language: string): I18nContext {
  const lang = isSupportedLanguage(language) ? language : getDefaultLanguage();
  
  return {
    language: lang,
    t: (key: string) => t(key, lang),
    tInterpolated: (key: string, params: Record<string, string | number>) => 
      tInterpolated(key, params, lang),
    tPlural: (key: string, count: number) => tPlural(key, count, lang),
    has: (key: string) => hasTranslation(key, lang),
    namespace: (ns: string) => getNamespace(ns, lang),
    languageLabel: getLanguageLabel(lang),
  };
}

/**
 * Get all available translation languages
 * 
 * @returns Array of language codes with translations
 */
export function getAvailableTranslationLanguages(): string[] {
  return Object.keys(translations);
}

/**
 * Export types
 */
export type { TranslationDict };
