# Documentation Search Engine Architecture

This document describes the architecture of the custom documentation search engine implemented for the Azion Design System documentation platform.

## Overview

The search engine is a **fully client-side** solution that provides fast, relevant search results without relying on external services. It's designed to scale with the design system and support future multilingual and versioned documentation.

## Architecture Principles

1. **No External Dependencies**: No Algolia, Meilisearch, or other third-party search services
2. **Build-Time Indexing**: Search index is generated during the Astro build process
3. **Client-Side Execution**: All search operations happen in the browser
4. **Metadata-Aware Ranking**: Uses component metadata for intelligent result ranking
5. **Extensible Design**: Prepared for future multilingual and versioned content

## System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    Build-Time Pipeline                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Content Collections ──► Content Extractor ──► Search Index    │
│   (Markdown files)       (Headings, text)     (JSON)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Client-Side Runtime                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Search Engine ──► Ranking Engine ──► Highlighter              │
│       │                  │                  │                   │
│       ▼                  ▼                  ▼                   │
│   SearchModal ◄── SearchResults ◄── Formatted Results           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
apps/ds-docs/
├── src/
│   ├── lib/
│   │   └── search/
│   │       ├── index.ts              # Public API
│   │       ├── types.ts              # TypeScript types
│   │       ├── searchEngine.ts       # Main search engine
│   │       ├── tokenizer.ts          # Text processing
│   │       ├── ranking.ts            # Scoring algorithm
│   │       ├── highlight.ts          # Result highlighting
│   │       └── content-extractor.ts  # Markdown extraction
│   │
│   ├── components/
│   │   └── search/
│   │       ├── index.ts              # Component exports
│   │       └── SearchModal.vue       # Search UI
│   │
│   └── integrations/
│       └── search-index.ts           # Astro integration
│
├── public/
│   └── search-index.json             # Generated search index
│
└── scripts/
    └── build-search-index.ts         # Standalone build script
```

## Data Model

### Search Index Entry

```typescript
interface SearchIndexEntry {
  id: string;              // Unique identifier: "collection/slug"
  title: string;           // Document title
  section: string;         // Collection name
  type: SearchContentType; // component | token | foundation | pattern | etc.
  category?: string;       // Category within type
  description: string;     // Brief description
  headings: string[];      // Extracted headings
  tags: string[];          // Tags for filtering
  content: string;         // Normalized searchable text
  url: string;             // URL path
  status?: string;         // Component status
  related?: string[];      // Related entry IDs
  version?: string;        // For future versioned docs
  lang?: string;           // For future i18n
}
```

### Search Index

```typescript
interface SearchIndex {
  meta: {
    generated: string;     // Build timestamp
    count: number;         // Total entries
    lang: string;          // Language code
    version?: string;      // Documentation version
    schemaVersion: number; // For future migrations
  };
  entries: SearchIndexEntry[];
}
```

## Build-Time Indexing

### Content Extraction

The indexing pipeline extracts searchable content from markdown files:

1. **Frontmatter Parsing**: Extracts metadata (title, description, tags, status)
2. **Heading Extraction**: Captures all heading text for navigation
3. **Text Extraction**: Removes code blocks, HTML, and markdown syntax
4. **Normalization**: Lowercases, removes stop words, normalizes whitespace

### Astro Integration

The search index is generated during the Astro build via a custom integration:

```typescript
// src/integrations/search-index.ts
export function searchIndexIntegration(): AstroIntegration {
  return {
    name: 'search-index',
    hooks: {
      'astro:build:done': ({ dir }) => {
        // Process content collections
        // Generate search-index.json
      },
    },
  };
}
```

## Search Engine Core

### Tokenization

The tokenizer processes search queries and content:

- **Normalization**: Converts to lowercase, removes punctuation
- **Stop Word Removal**: Filters common words (the, a, is, etc.)
- **Fuzzy Matching**: Supports typo tolerance via Levenshtein distance

### Ranking Algorithm

Results are scored using a weighted system optimized for design system documentation:

| Match Type | Weight | Description |
|------------|--------|-------------|
| Exact Title | 150 | Query exactly matches title |
| Title Start | 150 | Title starts with query |
| Title Contains | 100 | Title contains query |
| Tag Match | 80 | Query matches a tag |
| Heading Match | 50 | Query appears in heading |
| Description Match | 30 | Query in description |
| Content Match | 10 | Query in content (capped) |

### Boosts

Additional multipliers applied to scores:

- **Component Boost (1.2x)**: Results from components section
- **Stable Boost (1.1x)**: Components with stable status
- **Deprecated Penalty (0.5x)**: Deprecated components ranked lower

### Result Highlighting

Matched terms are highlighted in results:

```html
<mark class="search-highlight">button</mark>
```

## Search UI

### SearchModal Component

The search interface provides:

- **Keyboard Navigation**: Arrow keys, Enter, Escape
- **Real-time Results**: Debounced search as you type
- **Category Grouping**: Results grouped by content type
- **Status Badges**: Visual indicators for component status
- **Keyboard Shortcut**: CMD/CTRL+K to open

### User Interactions

| Action | Behavior |
|--------|----------|
| Click search button | Opens modal |
| Press CMD+K | Toggles modal |
| Type query | Searches with 150ms debounce |
| Press Arrow keys | Navigates results |
| Press Enter | Navigates to selected result |
| Press Escape | Closes modal |
| Click backdrop | Closes modal |

## Multilingual Support (Future)

The architecture is prepared for multilingual support:

### Index Structure

```
public/
├── search-index.en.json
├── search-index.pt.json
└── search-index.es.json
```

### Engine API

```typescript
// Future API
const engine = await initSearchEngine({ lang: 'pt' });
```

## Versioned Documentation (Future)

The index schema includes version support:

```typescript
interface SearchIndexEntry {
  // ...
  version?: string;  // e.g., "v1", "v2"
}

// Future API
const engine = await initSearchEngine({ version: 'v2' });
```

## Performance Considerations

### Index Size

- Target: < 100KB for 500 documents
- Achieved through text truncation and normalization
- No code blocks in index (only titles)

### Search Speed

- Target: < 50ms for typical queries
- Achieved through:
  - In-memory index
  - Simple string matching
  - No external network requests

### Optimization Techniques

1. **Content Truncation**: Limit indexed text to 2000 characters
2. **Debounced Input**: 150ms delay before searching
3. **Result Limiting**: Maximum 30 results per query
4. **Lazy Loading**: Index loaded only when search is opened

## Extensibility

### Adding New Content Types

1. Add type to `SearchContentType` in [`types.ts`](src/lib/search/types.ts)
2. Add label to `TYPE_LABELS`
3. Content will be automatically indexed

### Custom Ranking

Override default weights:

```typescript
const results = engine.search(query, {
  weights: {
    title: 200,
    tag: 100,
    // ...
  }
});
```

### Custom Filters

Filter by type, section, or tags:

```typescript
const results = engine.search(query, {
  type: 'component',
  section: 'components',
  tags: ['form'],
});
```

## Testing

### Example Queries

| Query | Expected Top Result |
|-------|---------------------|
| `button` | Button component |
| `fieldset` | Fieldset component |
| `color` | Color foundation |
| `spacing` | Tokens page |
| `icon` | Icons page |
| `accessibility` | Components with accessibility sections |
| `install` | Installation guide |

## Maintenance

### Updating the Index

The index is automatically regenerated on each build:

```bash
pnpm build
```

### Manual Index Generation

For development, a pre-built index is provided:

```
public/search-index.json
```

## Conclusion

This search engine provides a fast, relevant, and maintainable search experience for the Azion Design System documentation. It's designed to grow with the design system while remaining simple and dependency-free.
