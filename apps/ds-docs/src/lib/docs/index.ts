/**
 * Documentation Utilities
 *
 * Central export point for documentation resolution and utilities.
 */

export {
  resolveDoc,
  resolveDocFromUrl,
  getAvailablePages,
  hasTranslation,
  getDocStaticPaths,
  type ResolveDocParams,
  type ResolvedDoc,
  type ResolvedDocNotFound,
  type ResolveOptions,
} from './resolveDoc';

export {
  SITE_BASE_URL,
  getCanonicalUrl,
  getAlternateUrls,
  getHreflangTags,
  getOgUrl,
  getCurrentPageUrl,
  getSeoMetadata,
  type CanonicalConfig,
  type SeoMetadata,
} from './canonical';

// Frontmatter validation
export {
  validateFrontmatter,
  validateFrontmatterWithSchema,
  formatValidationResult,
  getRequiredFields,
  getRecommendedFields,
  isRequiredField,
  isRecommendedField,
  getFieldType,
  createFrontmatterTemplate,
  REQUIRED_FIELDS,
  RECOMMENDED_FIELDS,
  VALID_STATUSES,
  VALID_SECTIONS,
  type FrontmatterValidationResult,
  type ValidationError,
  type ValidationOptions,
} from './validateFrontmatter';

// Documentation lint
export {
  lintFile,
  lintAllFiles,
  parseFrontmatter,
  createDocFile,
  checkDuplicateTitles,
  checkDuplicateSlugs,
  formatLintResult,
  getLintIssueDescription,
  type LintSeverity,
  type LintIssueType,
  type LintIssue,
  type FileLintResult,
  type LintResult,
  type LintOptions,
  type DocFile,
} from './docLint';

// Link checker
export {
  extractLinks,
  classifyLink,
  checkAllLinks,
  formatLinkCheckResult,
  type LinkType,
  type LinkStatus,
  type DetectedLink,
  type LinkCheckResult,
  type FileLinkCheckResult,
  type LinkCheckerResult,
  type LinkCheckerOptions,
} from './linkChecker';

// Content rules
export {
  checkFileRules,
  checkAllFilesRules,
  formatRuleCheckResult,
  getRuleById,
  getRulesBySeverity,
  getRequiredRules,
  getRecommendedRules,
  CONTENT_RULES,
  requireOverviewSection,
  requireExamplesSection,
  requireAccessibilitySection,
  requireApiSection,
  requireWhenToUseSection,
  requireMigrationGuide,
  requireBetaNotice,
  type RuleSeverity,
  type RuleResult,
  type ContentRule,
  type FileRuleCheckResult,
  type RuleCheckResult,
} from './contentRules';

// Analytics
export {
  AnalyticsManager,
  getAnalytics,
  initAnalytics,
  useAnalytics,
  createConsoleHandler,
  createLocalStorageHandler,
  createBatchHandler,
  createGA4Handler,
  createPlausibleHandler,
  type AnalyticsEventType,
  type AnalyticsEvent,
  type AnalyticsHandler,
  type AnalyticsConfig,
  type PageViewData,
  type SearchQueryData,
  type SearchResultClickData,
  type ComponentViewData,
  type CodeCopyData,
  type LinkClickData,
  type FeedbackSubmitData,
  type VersionSwitchData,
  type LanguageSwitchData,
} from './analytics';
