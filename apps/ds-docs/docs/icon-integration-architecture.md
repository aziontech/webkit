# Icon Integration Architecture

This document describes the architecture and implementation of the `@aziontech/icons` integration into the Azion Design System documentation platform.

## Overview

The icon integration provides a scalable, accessible, and maintainable way to use icons throughout the documentation platform. It serves as the foundation for:

1. **Icon usage in documentation components** - Header, sidebar, callouts, etc.
2. **Icon gallery page** - A dedicated `/icons` page for browsing and discovering icons
3. **Future icon documentation** - Extensible architecture for enhanced icon features

## Package Analysis

### `@aziontech/icons` Package Structure

The `@aziontech/icons` package is a dual icon font library:

| Font | Prefix | Icons | Description |
|------|--------|-------|-------------|
| **azionicons** | `ai` | 87 | Azion product, platform, and ecosystem icons |
| **primeicons** | `pi` | 315 | General-purpose UI icons (PrimeIcons set) |

### Package Exports

```js
// Main CSS import (both icon sets)
import '@aziontech/icons';

// Individual icon sets
import '@aziontech/icons/azionicons';
import '@aziontech/icons/primeicons';

// Icon catalog (JSON metadata)
import iconsCatalog from '@aziontech/icons/catalog.json';
```

### Catalog Structure

The `catalog.json` provides basic icon metadata:

```json
[
  {
    "icon": "ai ai-azion",
    "keywords": "",
    "name": "ai-azion"
  }
]
```

## Integration Architecture

### 1. CSS Import

Icons are imported globally in `DocsLayout.astro`:

```astro
import '@aziontech/icons';
```

This loads both `azionicons.css` and `primeicons.css`, which include:
- `@font-face` declarations for woff2 fonts
- Base icon class styles (`.ai`, `.pi`)
- Individual icon class rules (`.ai-azion::before`, etc.)

### 2. Icon Registry

The icon registry (`src/data/icons-registry.ts`) provides:

- **Normalized IconEntry interface** - Consistent structure for all icons
- **Category mapping** - Logical grouping for Azion icons
- **Keyword enrichment** - Enhanced searchability
- **Utility functions** - Search, filter, and retrieve icons

```typescript
interface IconEntry {
  name: string;        // "azion"
  fullName: string;    // "ai-azion"
  prefix: 'ai' | 'pi';
  className: string;   // "ai ai-azion"
  keywords: string[];
  category: IconCategory;
}
```

### 3. Icon usage (direct from library)

**Note:** The `DocsIcon.vue` component was removed. Icons are used directly from `@aziontech/icons`:

- **PrimeIcons:** `<i class="pi pi-{name}" aria-hidden="true" />` (e.g. `pi pi-search`, `pi pi-check`)
- **Azion Icons:** `<i class="ai ai-{name}" aria-hidden="true" />` (e.g. `ai ai-azion`)

Size and color: use Tailwind on the `<i>` (e.g. `class="pi pi-code text-lg text-muted"`). For semantic icons, add `aria-label="…"` and omit `aria-hidden="true"`.

<details>
<summary>Legacy: former DocsIcon component (removed)</summary>

The previous `DocsIcon.vue` abstraction provided:
- Size variants (sm, md, lg, xl, 2xl)
- Accessibility support (decorative vs semantic)
- Custom class passthrough
- Type-safe icon names

**Usage (legacy):**

```vue
<!-- Decorative icon (hidden from screen readers) -->
<DocsIcon name="ai-azion" />

<!-- Semantic icon (announced by screen readers) -->
<DocsIcon name="pi-search" ariaLabel="Search" />
```

</details>

### 4. Supporting Components

#### IconCard.vue

Displays a single icon with:
- Icon preview
- Icon name
- CSS class reference
- Copy-to-clipboard functionality

#### IconsGrid.vue

Interactive icon gallery with:
- Search by name/keywords
- Filter by icon set (ai/pi)
- Filter by category
- Responsive grid layout
- Empty state handling

#### IconUsageCode.astro

Code snippet display for icon usage in:
- HTML
- Vue
- React

## Accessibility

The icon integration follows WCAG guidelines:

### Decorative Icons

Icons that are purely decorative should be hidden from assistive technology:

```html
<i class="ai ai-azion" aria-hidden="true" />
```

### Semantic Icons

Icons that convey meaning must have an accessible label:

```html
<i class="pi pi-search" aria-label="Search" role="img" />
```

### Default Behavior

- Use `aria-hidden="true"` for decorative icons
- Use `aria-label="…"` (and optionally `role="img"`) for semantic icons

## File Structure

```
apps/ds-docs/
├── src/
│   ├── components/
│   │   ├── docs/
│   │   │   ├── DocsHeader.vue      # Uses icons
│   │   │   ├── DocsSidebar.vue     # Uses icons (logo SVG + nav)
│   │   │   └── Callout.astro       # Uses icons
│   │   └── icons/
│   │       ├── index.ts            # Barrel export
│   │       ├── IconCard.vue        # Icon preview card
│   │       ├── IconsGrid.vue       # Icon gallery grid
│   │       └── IconUsageCode.astro # Code snippets
│   ├── data/
│   │   └── icons-registry.ts       # Icon metadata & utilities
│   ├── layouts/
│   │   └── DocsLayout.astro        # Imports icon CSS
│   └── pages/
│       └── icons/
│           └── index.astro         # Icon gallery page
└── astro.config.mjs                # Vite alias config
```

## Architectural Decisions

### 1. Icon Font vs SVG

**Decision:** Use icon fonts (as provided by `@aziontech/icons`)

**Rationale:**
- Consistent with the package design
- Smaller bundle size for many icons
- CSS-based styling (color, size via font-size)
- No need for SVG sprite management

**Trade-offs:**
- Less flexibility than inline SVG
- No multi-color icons
- Requires font loading

### 2. Centralized Registry

**Decision:** Create a normalized registry from the package catalog

**Rationale:**
- Package catalog provides basic structure
- Registry adds category and keyword metadata
- Single source of truth for icon data
- Enables search and filter functionality

**Future Evolution:**
- Keywords should be added to the package catalog
- Categories should be defined in the package
- Registry should become a thin wrapper

### 3. Direct icon usage

**Decision:** Use icon font classes directly on `<i>` elements (no wrapper component)

**Rationale:**
- Simpler: no extra component to maintain
- Library is already global; size/color via Tailwind
- Accessibility: add `aria-hidden="true"` or `aria-label="…"` on the `<i>` as needed

### 4. Astro Config Alias

**Decision:** Use Vite alias for `@aziontech/icons`

**Rationale:**
- Ensures correct path resolution in monorepo
- Works for both CSS and JSON imports
- Handles woff2 font files correctly

## Limitations

### Current Limitations

1. **Keywords are empty in catalog** - The package catalog doesn't include keywords, so we add them manually in the registry

2. **Categories are inferred** - Icon categories are mapped manually based on README documentation

3. **No icon versioning** - Icons don't have individual version tracking

4. **No icon deprecation** - No mechanism for deprecating icons

5. **Static search only** - Client-side filtering without a search index

### Package Improvements Needed

The `@aziontech/icons` package should evolve to provide:

```json
{
  "name": "ai-azion",
  "icon": "ai ai-azion",
  "keywords": ["brand", "logo", "azion"],
  "category": "platform",
  "deprecated": false,
  "since": "1.0.0",
  "aliases": ["azion-logo"]
}
```

## Future Evolution

### Short-term (Next Sprint)

1. **Enhanced search** - Add debounced search with highlight
2. **Copy feedback** - Toast notification on copy
3. **Icon detail modal** - Click icon for detailed view

### Medium-term (Next Quarter)

1. **Icon search index** - Integrate with docs search
2. **Dark mode preview** - Toggle dark/light background
3. **Icon categories page** - Dedicated category pages

### Long-term

1. **SVG support** - Add SVG icon option
2. **Icon subsets** - Download only needed icons
3. **Icon versioning** - Track icon changes
4. **Figma sync** - Auto-update from Figma

## Usage Examples

### In Vue Components

```vue
<template>
  <button>
    <i class="pi pi-search text-sm" aria-label="Search" role="img" />
    <span>Search</span>
  </button>
</template>
```

### In Astro Components

```astro
---
// No import needed; @aziontech/icons is loaded in layout
---

<div class="status">
  <i class="pi pi-check-circle text-green-500" aria-hidden="true" />
  <span>Success</span>
</div>
```

### In Markdown / MDX

```html
<i class="ai ai-azion text-2xl" aria-hidden="true" />
```

## Testing

### Manual Testing Checklist

- [ ] Icons render correctly in header
- [ ] Icons render correctly in sidebar
- [ ] Icons render correctly in callouts
- [ ] Icon gallery page loads
- [ ] Search filters icons
- [ ] Category filter works
- [ ] Icon set filter works
- [ ] Copy to clipboard works
- [ ] Screen reader announces semantic icons
- [ ] Screen reader ignores decorative icons

### Automated Tests (Future)

- Unit tests for icon registry utilities
- E2E tests for icon gallery page
- Accessibility tests for icon rendering

## References

- [`@aziontech/icons` README](../../packages/icons/README.md)
- [WCAG Icon Accessibility](https://www.w3.org/WAI/WCAG21/Techniques/html/ARIA24)
- [Astro Vite Config](https://docs.astro.build/en/reference/configuration-reference/#vite)
