# Documentation Governance and Automation System

This document describes the governance and automation system implemented for the Azion Design System documentation platform.

## Overview

The documentation governance system ensures that documentation remains consistent, scalable, and maintainable as the design system evolves. It provides automated quality checks that run during development and CI to catch issues early.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Documentation Governance                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Frontmatter  │  │    Link      │  │    Content Rules     │   │
│  │ Validation   │  │   Checker    │  │    Enforcement       │   │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬──────────┘   │
│         │                 │                       │              │
│  ┌──────┴─────────────────┴───────────────────────┴──────────┐  │
│  │                    Documentation Linter                     │  │
│  └────────────────────────────┬───────────────────────────────┘  │
│                               │                                  │
│  ┌────────────────────────────┴───────────────────────────────┐  │
│  │                      CI Pipeline                             │  │
│  │  • Lint • Links • Coverage • API Extraction • Build        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Frontmatter Validation

**Location:** [`src/lib/docs/validateFrontmatter.ts`](../src/lib/docs/validateFrontmatter.ts)

Validates that all documentation pages include required frontmatter fields.

**Required Fields:**
- `title` - Page title
- `description` - Page description
- `section` - Documentation section (components, foundations, etc.)
- `version` - Documentation version
- `language` - Content language

**Recommended Fields:**
- `tags` - Search/categorization tags
- `status` - Component status (stable, beta, deprecated, etc.)
- `related` - Related component names

**Usage:**
```typescript
import { validateFrontmatter } from '@/lib/docs';

const result = validateFrontmatter(frontmatter, {
  strictTypes: true,
  warnRecommended: true,
});

if (!result.valid) {
  console.error('Validation failed:', result.errors);
}
```

### 2. Documentation Lint System

**Location:** [`src/lib/docs/docLint.ts`](../src/lib/docs/docLint.ts)

Comprehensive linter for documentation quality checks.

**Checks:**
- Missing frontmatter
- Duplicate titles across files
- Duplicate slugs (URL conflicts)
- Missing descriptions
- Short descriptions
- Missing tags

**Usage:**
```bash
pnpm lint
```

### 3. Link Checker

**Location:** [`src/lib/docs/linkChecker.ts`](../src/lib/docs/linkChecker.ts)

Scans documentation for broken links.

**Link Types:**
- Internal links (to other docs pages)
- Anchor links (to sections within the same page)
- Component links (to component documentation)
- Asset links (images, files)
- External links (optional checking)

**Usage:**
```bash
pnpm lint:links
```

### 4. Component Documentation Coverage

**Location:** [`scripts/checkComponentDocs.ts`](../scripts/checkComponentDocs.ts)

Verifies that all components have corresponding documentation.

**Checks:**
- Components in `src/components` have matching docs in `src/content`
- Documentation exists in all required languages
- Reports undocumented components

**Usage:**
```bash
pnpm lint:coverage
```

### 5. API Extraction

**Location:** [`scripts/extractComponentApi.ts`](../scripts/extractComponentApi.ts)

Automatically extracts component API information from Vue components.

**Extracts:**
- Props (name, type, default, required, description)
- Events (name, payload type, description)
- Slots (name, description)

**Output:** JSON files in `src/generated/component-api/`

**Usage:**
```bash
pnpm build:api
```

**See also:** [Component docs generation](./component-docs-generation.md) — geração automática de páginas e registry a partir do webkit (`pnpm build:scaffold`).

**Example Output:**
```json
{
  "component": "Button",
  "props": [
    {
      "name": "variant",
      "type": "'primary' | 'secondary' | 'outline'",
      "default": "'primary'",
      "required": false,
      "description": "Visual style variant"
    }
  ],
  "events": [...],
  "slots": [...]
}
```

### 6. Content Rules

**Location:** [`src/lib/docs/contentRules.ts`](../src/lib/docs/contentRules.ts)

Enforces documentation structure rules.

**Required Sections (for components):**
- Overview
- Examples

**Recommended Sections:**
- Accessibility
- API
- When to Use

**Special Rules:**
- Deprecated components must have migration guidance
- Beta components should have stability notice

**Usage:**
```bash
pnpm lint:rules
```

### 7. Changelog Generator

**Location:** [`scripts/generateChangelog.ts`](../scripts/generateChangelog.ts)

Generates documentation changelog.

**Categories:**
- New components
- Updated components
- Deprecated components
- Token changes
- Foundation updates

**Output:** [`docs/changelog.md`](./changelog.md)

**Usage:**
```bash
pnpm changelog
```

### 8. CI Pipeline

**Location:** [`.github/workflows/docs.yml`](../../.github/workflows/docs.yml)

Automated checks running on every push and pull request.

**Jobs:**
1. **Lint** - Frontmatter and content validation
2. **Link Check** - Broken link detection
3. **Component Docs** - Coverage check
4. **API Extraction** - Generate component API metadata
5. **Build** - Verify documentation builds successfully
6. **Preview** - Deploy preview for pull requests

### 9. Analytics Hooks

**Location:** [`src/lib/docs/analytics.ts`](../src/lib/docs/analytics.ts)

Prepared hooks for analytics integration.

**Trackable Events:**
- Page views
- Search queries
- Search result clicks
- Component views
- Code copies
- Link clicks
- Feedback submissions
- Version/language switches

**Usage:**
```typescript
import { useAnalytics } from '@/lib/docs';

const analytics = useAnalytics();
analytics.trackPageView({ path: '/components/button', title: 'Button' });
```

### 10. Component Registry

**Location:** [`src/generated/components-registry.ts`](../src/generated/components-registry.ts)

Central registry of documented components.

**Structure:**
```typescript
{
  name: 'Button',
  status: 'stable',
  category: 'actions',
  documentation: '/components/button',
  description: 'Primary action trigger',
  tags: ['action', 'interactive', 'form']
}
```

**Usage:**
```typescript
import { getComponentByName, getStableComponents } from '@/generated/components-registry';

const button = getComponentByName('Button');
const stable = getStableComponents();
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `pnpm lint` | Run documentation lint |
| `pnpm lint:links` | Check for broken links |
| `pnpm lint:rules` | Check content rules |
| `pnpm lint:coverage` | Check component documentation coverage |
| `pnpm check` | Run all checks |
| `pnpm build:api` | Extract component APIs |
| `pnpm changelog` | Generate changelog |

## Best Practices

### Writing Documentation

1. **Always include frontmatter** - Every page needs title, description, section, version, and language
2. **Use descriptive titles** - Unique, clear titles for each page
3. **Write meaningful descriptions** - At least 20 characters, summarize the content
4. **Add relevant tags** - Improve searchability
5. **Include required sections** - Overview, Examples, Accessibility for components

### Component Documentation

1. **Document all components** - Every component needs documentation
2. **Keep API in sync** - Use extracted API data for PropsTable, EventsTable, SlotsTable
3. **Include examples** - Show common usage patterns
4. **Document accessibility** - Keyboard interactions and ARIA attributes

### Maintenance

1. **Run checks locally** - Use `pnpm check` before committing
2. **Fix errors immediately** - CI will fail on documentation errors
3. **Update changelog** - Document significant changes
4. **Review coverage reports** - Ensure all components are documented

## Error Handling

The governance system distinguishes between:

- **Errors** - Must be fixed before merge (missing required fields, broken links)
- **Warnings** - Should be addressed but don't block merge (missing recommended fields)
- **Info** - Suggestions for improvement (missing tags)

## Future Enhancements

1. **Git Integration** - Automatic changelog from commit history
2. **External Link Checking** - Verify external links periodically
3. **Screenshot Testing** - Visual regression testing for component examples
4. **Performance Metrics** - Track documentation load times
5. **Search Analytics** - Integrate with search provider for query analysis

## Related Files

- [`src/lib/docs/validateFrontmatter.ts`](../src/lib/docs/validateFrontmatter.ts) - Frontmatter validation
- [`src/lib/docs/docLint.ts`](../src/lib/docs/docLint.ts) - Documentation linter
- [`src/lib/docs/linkChecker.ts`](../src/lib/docs/linkChecker.ts) - Link checker
- [`src/lib/docs/contentRules.ts`](../src/lib/docs/contentRules.ts) - Content rules
- [`src/lib/docs/analytics.ts`](../src/lib/docs/analytics.ts) - Analytics hooks
- [`scripts/checkComponentDocs.ts`](../scripts/checkComponentDocs.ts) - Coverage checker
- [`scripts/extractComponentApi.ts`](../scripts/extractComponentApi.ts) - API extraction
- [`scripts/scaffoldComponentDocs.ts`](../scripts/scaffoldComponentDocs.ts) - Component docs scaffold (see [component-docs-generation.md](./component-docs-generation.md))
- [`scripts/generateChangelog.ts`](../scripts/generateChangelog.ts) - Changelog generator
- [`scripts/check-docs.ts`](../scripts/check-docs.ts) - Unified check script
- [`.github/workflows/docs.yml`](../../.github/workflows/docs.yml) - CI pipeline
