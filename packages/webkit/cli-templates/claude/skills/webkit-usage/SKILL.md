---
name: webkit-usage
description: Consume the @aziontech/webkit design system correctly. Use when adding or reviewing UI in a project that depends on @aziontech/webkit — how to find the right component, import it with the flat path, style with @aziontech/theme tokens, and keep bundles small.
---

# Skill: webkit-usage

## Overview

`@aziontech/webkit` is the Azion design system: a set of themed, accessible Vue 3 components. This project depends on it. When you build or review UI here, reach for a webkit component first, import it with the flat path, and style with `@aziontech/theme` tokens. This skill is the paste-safe reference for doing that right.

## How to find a component

Do not guess a component name or import path. Look it up.

1. Ask the webkit MCP. The server exposes tools grounded in the exact webkit version this project installed:
   - `suggest_component` — describe what you need in plain words; it returns the matching component(s).
   - Import/validation tools — confirm a subpath is real and get the canonical path.
2. Read the catalog directly. `node_modules/@aziontech/webkit/catalog.json` has an `imports` object; every key is a real published subpath (`button`, `empty-state`, `table`, ...). If a subpath is not a key there, it does not exist.

## Must Have

- ✅ Flat import: `import Button from '@aziontech/webkit/button'`.
- ✅ PascalCase binding matching the last path segment: `@aziontech/webkit/mini-button` -> `MiniButton`.
- ✅ Color, spacing, radius, and typography from `@aziontech/theme` tokens (`var(--primary)`, `var(--spacing-4)`, `text-button-lg`).
- ✅ `import '@aziontech/theme'` and `import '@aziontech/icons'` once near the app entry (e.g. `src/main.ts`).
- ✅ The tree-shakeable `<name>-root` path (or specific sub-components) when you only need the root.
- ✅ Icons via the `@aziontech/icons` font: side-effect import once (`import '@aziontech/icons'`) + the icon CSS classes.
- ✅ A webkit component reused instead of a hand-rolled or third-party equivalent.

## Must Not Have

- ❌ Category-prefixed import: `@aziontech/webkit/feedback/skeleton`.
- ❌ `/src/` or deep-internal imports: `@aziontech/webkit/src/components/...`.
- ❌ Barrel import: `import { Button } from '@aziontech/webkit'` (no barrel exists).
- ❌ Binding that disagrees with the path: `import Chip from '@aziontech/webkit/chips'`.
- ❌ Hardcoded color: `#fff`, `rgb(...)`, `hsl(...)`, `text-[#1e40af]`, or raw Tailwind palette (`bg-blue-600`).
- ❌ A default/namespace binding of `@aziontech/icons` (`import Icons from '@aziontech/icons'`) — it is a font; import it for side effects only.
- ❌ A custom Button, Modal, Table, Tooltip, etc. when webkit ships one.

## Common Patterns

### Import + tokens

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Button class="bg-[var(--primary)] text-[var(--primary-contrast)]">Save</Button>
</template>
```

### Compound vs tree-shakeable root

`Table` (and other composition components) has two import shapes. Use the narrow one when you can:

```js
import Table from '@aziontech/webkit/table-root' // root only — smallest
import TableRow from '@aziontech/webkit/table-row' // one sub-component
import Table from '@aziontech/webkit/table' // full compound: Table.Row, Table.Cell, ...
```

### Lazy-load a heavy overlay

```js
import { defineAsyncComponent } from 'vue'

const Dialog = defineAsyncComponent(() => import('@aziontech/webkit/dialog'))
```

### App entry (styles + icons)

```ts
// src/main.ts
import '@aziontech/theme'
import '@aziontech/icons'
```

## Quality Checklist

Before you finish UI work in this project:

- [ ] Every webkit import is flat (`@aziontech/webkit/<name>`), no category, no `/src/`, no barrel.
- [ ] Every binding is PascalCase of its subpath's last segment.
- [ ] No hardcoded colors — all color/spacing/typography via `@aziontech/theme` tokens.
- [ ] Icons imported individually; the whole set is never bulk-imported.
- [ ] Root-only usage takes the `-root` path; heavy overlays are lazy-loaded.
- [ ] No custom component reinvents something webkit already provides (checked via MCP or `catalog.json`).
- [ ] `@aziontech/theme` and `@aziontech/icons` are imported once at the app entry.
