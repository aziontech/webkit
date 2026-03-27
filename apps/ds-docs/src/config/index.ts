/**
 * Configuration Exports
 * 
 * Central export point for all documentation configuration.
 */

// Version configuration
export {
  DOCS_VERSIONS,
  VERSION_ROUTES,
  getCurrentVersion,
  isValidVersion,
  isCurrentVersion,
  getAllVersions,
  getVersionLabel,
  getPreviousVersion,
  getNextVersion,
  buildVersionedUrl,
  parseVersionedUrl,
  type DocsVersionConfig,
} from './docs-versions';

// Language configuration
export {
  DOCS_LANGUAGES,
  LANGUAGE_ROUTES,
  getDefaultLanguage,
  isSupportedLanguage,
  isDefaultLanguage,
  getAllLanguages,
  getLanguageLabel,
  getLanguageEnglishLabel,
  isRTLLanguage,
  getLanguageDirection,
  validateLanguage,
  getFallbackLanguage,
  buildLanguageUrl,
  getAlternateLanguageUrls,
  UI_STRING_KEYS,
  type DocsLanguageConfig,
  type UIStringKey,
} from './docs-languages';
