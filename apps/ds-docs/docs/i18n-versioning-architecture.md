# Internationalization (i18n) and Documentation Versioning Architecture

> This document describes the architecture for supporting multiple languages and versions in the Azion Design System Documentation Platform.

---

## Overview

The documentation platform supports:

- **Multiple languages**: English (default), Portuguese (future)
- **Multiple versions**: v1 (current), future versions like v2
- **Stable URLs**: URLs remain consistent across versions and languages
- **Graceful fallbacks**: Missing translations fall back to English

---

## 1. URL Structure

### URL Patterns

The documentation uses a stable URL structure:

```
/docs/{version}/{language}/{section}/{page}
```

#### Examples

| URL | Version | Language | Section | Page |
|-----|---------|----------|---------|------|
| `/components/button` | v1 (current) | en (default) | components | button |
| `/foundations/color` | v1 (current) | en (default) | foundations | color |
| `/pt/components/button` | v1 (current) | pt | components | button |
| `/v1/en/components/button` | v1 | en | components | button |
| `/v1/pt/components/button` | v1 | pt | components | button |
| `/v2/components/button` | v2 | en (default) | components | button |

### Short URLs

For the **default language (English)** and **current version**, URLs are shortened:

```
/components/button     → v1, en, components, button
/foundations/color     → v1, en, foundations, color
```

### Full URLs

For **non-default languages** or **older versions**, full URLs are used:

```
/pt/components/button  → v1, pt, components, button
/v1/pt/components/button → v1, pt, components, button
```

---

## 2. Configuration Files

### Version Configuration

**File**: [`src/config/docs-versions.ts`](../src/config/docs-versions.ts)

```typescript
export const DOCS_VERSIONS: DocsVersionConfig = {
  current: 'v1',
  versions: ['v1'],
  labels: {
    v1: 'Latest',
  },
};
```

#### Helper Functions

| Function | Description |
|----------|-------------|
| `getCurrentVersion()` | Returns the current version identifier |
| `isValidVersion(version)` | Checks if a version is valid |
| `isCurrentVersion(version)` | Checks if a version is the current one |
| `getAllVersions()` | Returns all available versions |
| `getVersionLabel(version)` | Returns the display label for a version |

### Language Configuration

**File**: [`src/config/docs-languages.ts`](../src/config/docs-languages.ts)

```typescript
export const DOCS_LANGUAGES: DocsLanguageConfig = {
  default: 'en',
  supported: ['en', 'pt'],
  labels: {
    en: 'English',
    pt: 'Português',
  },
};
```

#### Helper Functions

| Function | Description |
|----------|-------------|
| `getDefaultLanguage()` | Returns the default language code |
| `isSupportedLanguage(lang)` | Checks if a language is supported |
| `isDefaultLanguage(lang)` | Checks if a language is the default |
| `getAllLanguages()` | Returns all supported languages |
| `getLanguageLabel(lang)` | Returns the native name for a language |

---

## 3. Content Directory Structure

### Current Structure (Flat)

```
src/content/
├── components/
│   ├── button.mdx
│   └── fieldset.mdx
├── foundations/
│   └── color.md
└── ...
```

### Future Structure (Versioned & Localized)

```
src/content/docs/
├── v1/
│   ├── en/
│   │   ├── get-started/
│   │   ├── foundations/
│   │   ├── tokens/
│   │   ├── components/
│   │   ├── patterns/
│   │   ├── templates/
│   │   └── icons/
│   └── pt/
│       ├── get-started/
│       ├── foundations/
│       ├── components/
│       └── ...
└── v2/
    ├── en/
    └── pt/
```

### Migration Strategy

1. **Phase 1**: Keep flat structure, add version/language to frontmatter
2. **Phase 2**: Restructure content into version/language folders
3. **Phase 3**: Update content collections to use new structure

---

## 4. Content Collection Schema

### Updated Frontmatter

```yaml
---
title: Button
description: Trigger actions across the interface
version: v1
language: en
section: components
status: stable
tags:
  - action
  - form
translatedFrom: en  # For translations
translationStatus: complete  # complete | partial | missing
---
```

### Schema Definition

**File**: [`src/content/config.ts`](../src/content/config.ts)

```typescript
const baseSchema = z.object({
  // ... existing fields
  version: z.string().default('v1'),
  language: z.string().default('en'),
  translatedFrom: z.string().optional(),
  translationStatus: z.enum(['complete', 'partial', 'missing']).optional(),
});
```

---

## 5. Content Resolution

### Resolution Logic

**File**: [`src/lib/docs/resolveDoc.ts`](../src/lib/docs/resolveDoc.ts)

```typescript
const result = await resolveDoc({
  version: 'v1',
  language: 'pt',
  section: 'components',
  slug: 'button'
});
```

### Fallback Behavior

When a translation doesn't exist, the system falls back to English:

```
User visits: /pt/components/button
If Portuguese page exists → Serve Portuguese content
If not → Serve English content with isFallback: true
```

### Resolution Result

```typescript
interface ResolvedDoc {
  version: string;
  language: string;
  section: Section;
  slug: string;
  url: string;
  canonicalUrl: string;
  isIndex: boolean;
  isFallback: boolean;  // True if fell back to English
  requestedLanguage?: string;  // Original requested language
  entry: unknown;
  frontmatter: Record<string, unknown>;
}
```

---

## 6. Switcher Components

### Version Switcher

**File**: [`src/components/docs/VersionSwitcher.vue`](../src/components/docs/VersionSwitcher.vue)

- Shows available versions
- Highlights current version
- Maintains same page when switching (if exists)
- Falls back to section index if page doesn't exist in target version

### Language Switcher

**File**: [`src/components/docs/LanguageSwitcher.vue`](../src/components/docs/LanguageSwitcher.vue)

- Shows available languages
- Maintains same page when switching
- Falls back to English if translation missing

### Version Banner

**File**: [`src/components/docs/DocsVersionBanner.vue`](../src/components/docs/DocsVersionBanner.vue)

- Shows when viewing an older version
- Provides link to latest version
- Dismissible by user

---

## 7. Search Engine Integration

### Updated Search Index

```typescript
interface SearchIndexEntry {
  id: string;  // Format: "{version}-{language}-{section}-{slug}"
  version: string;
  language: string;
  // ... other fields
}
```

### Search Filtering

Search results are filtered by:

- Current language
- Current version

```typescript
const results = searchEngine.search('button', {
  language: 'en',
  version: 'v1'
});
```

---

## 8. Canonical URLs & SEO

### Canonical URL Logic

**File**: [`src/lib/docs/canonical.ts`](../src/lib/docs/canonical.ts)

Canonical URLs always point to:

- Current version
- Same language (or default if English)

```typescript
// English page
getCanonicalUrl({
  version: 'v1',
  language: 'en',
  section: 'components',
  slug: 'button'
});
// → https://docs.azion.com/components/button

// Portuguese page
getCanonicalUrl({
  version: 'v1',
  language: 'pt',
  section: 'components',
  slug: 'button'
});
// → https://docs.azion.com/pt/components/button
```

### hreflang Tags

```html
<link rel="alternate" hreflang="en" href="https://docs.azion.com/components/button" />
<link rel="alternate" hreflang="pt" href="https://docs.azion.com/pt/components/button" />
<link rel="alternate" hreflang="x-default" href="https://docs.azion.com/components/button" />
```

---

## 9. Routing Architecture

### Current Routes

```
/pages/
├── components/[slug].astro
├── foundations/[slug].astro
├── tokens/[slug].astro
└── ...
```

### Future Unified Route

```
/pages/
└── docs/[...path].astro
```

This catch-all route handles:

1. Parse URL to extract version, language, section, slug
2. Resolve content using `resolveDoc()`
3. Handle fallbacks
4. Render with SEO metadata

---

## 10. Adding a New Version

### Step 1: Update Configuration

```typescript
// src/config/docs-versions.ts
export const DOCS_VERSIONS = {
  current: 'v2',
  versions: ['v2', 'v1'],
  labels: {
    v2: 'Latest',
    v1: 'Legacy',
  },
};
```

### Step 2: Create Content Directory

```bash
mkdir -p src/content/docs/v2/en
mkdir -p src/content/docs/v2/pt
```

### Step 3: Copy and Evolve Content

```bash
cp -r src/content/docs/v1/en/* src/content/docs/v2/en/
```

### Step 4: Update Frontmatter

Update version field in all v2 content files.

---

## 11. Adding a New Language

### Step 1: Update Configuration

```typescript
// src/config/docs-languages.ts
export const DOCS_LANGUAGES = {
  default: 'en',
  supported: ['en', 'pt', 'es'],
  labels: {
    en: 'English',
    pt: 'Português',
    es: 'Español',
  },
};
```

### Step 2: Create Content Directory

```bash
mkdir -p src/content/docs/v1/es
```

### Step 3: Translate Content

Copy English content and translate.

---

## 12. Engineering Principles

1. **URLs must remain stable**: Once published, URLs should not change
2. **Default language has shortest URLs**: English uses `/section/page` format
3. **Translations gracefully fallback**: Missing translations show English content
4. **Versioning doesn't break navigation**: Switching versions maintains context
5. **Content is easy to maintain**: Clear structure for writers
6. **No unnecessary runtime complexity**: Most logic is build-time

---

## 13. File Reference

| File | Purpose |
|------|---------|
| [`src/config/docs-versions.ts`](../src/config/docs-versions.ts) | Version configuration |
| [`src/config/docs-languages.ts`](../src/config/docs-languages.ts) | Language configuration |
| [`src/lib/docs/resolveDoc.ts`](../src/lib/docs/resolveDoc.ts) | Content resolution |
| [`src/lib/docs/canonical.ts`](../src/lib/docs/canonical.ts) | SEO utilities |
| [`src/components/docs/VersionSwitcher.vue`](../src/components/docs/VersionSwitcher.vue) | Version switcher UI |
| [`src/components/docs/LanguageSwitcher.vue`](../src/components/docs/LanguageSwitcher.vue) | Language switcher UI |
| [`src/components/docs/DocsVersionBanner.vue`](../src/components/docs/DocsVersionBanner.vue) | Version banner |
| [`src/content/config.ts`](../src/content/config.ts) | Content schema |
| [`src/lib/search/types.ts`](../src/lib/search/types.ts) | Search types |
| [`src/lib/search/searchEngine.ts`](../src/lib/search/searchEngine.ts) | Search engine |

---

## 14. Future Considerations

- **Content Translation Workflow**: Integration with translation management systems
- **Automated Translation Status**: Track translation completeness
- **Version Diff**: Show differences between versions
- **Migration Guides**: Auto-generate migration guides between versions
- **Language-specific Search**: Separate search indices per language
