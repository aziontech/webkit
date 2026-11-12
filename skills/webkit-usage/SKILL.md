---
name: webkit-usage
description: Entry point for building UI on @aziontech/webkit. Use when adding or reviewing UI in a project that depends on @aziontech/webkit — start a screen from a pattern, find the right component, import it with the flat path, style with @aziontech/theme tokens, keep bundles small, and pick the focused skill for each task (forms, tables, lists, errors, states, layout, copy, polish, verification).
scope: general
status: active
last_updated: 2026-11-12
enforced_by: [webkit-imports, webkit-tokens, webkit-prefer-over-custom, webkit-performance]
---

# Skill: webkit-usage

## Overview

`@aziontech/webkit` is the Azion design system: a set of themed, accessible Vue 3 components. This project depends on it. When you build or review UI here, reach for a webkit component first, import it with the flat path, and style with `@aziontech/theme` tokens. This skill is the paste-safe reference for doing that right.

## Start here: a screen begins from a pattern

Before composing anything, check whether the screen already exists as a block:
`npx @aziontech/webkit search <the screen in plain words>` ("login", "account settings", "delete
confirmation"), or the `webkit` MCP `search_patterns`. Read the best one with
`npx @aziontech/webkit view <block-id>` (or `get_pattern`), then start the screen with
`npx @aziontech/webkit add <block-id>` (`--variant <state>` for another state): it copies the SFC
into the views directory, checks its imports, records it in `webkit.blocks.json` and prints the
route entry. `npx @aziontech/webkit diff <block-id>` later shows what you changed against the
canonical block. Before adapting it, read the guidelines (`view`, or the `guidelines` field
`get_pattern` returns): when to use the screen and when another block fits better, what each building block (A,
B, C…) is for, do and don't, the copy rules and the accessibility rules. If "When not to use"
matches your case, switch to the block it names. Then change only the content of the copy,
keeping to the guidelines. Only when no pattern fits, compose from components (below). A marketing band is a page section, not a pattern (rule
`webkit-sections`).

## Which skill for which task

Structure and states first, polish last:

- **Structure:** `/webkit-ux-heuristics` (right component per moment) · `/webkit-ui-states` (loading,
  empty, error, async) · `/webkit-form` · `/webkit-create-surface` (page vs drawer) · `/webkit-errors`
  (where a failure goes) · `/webkit-tables` · `/webkit-lists` · `/webkit-navigation`
- **Layout:** `/webkit-layout` · **Words:** `/webkit-microcopy`
- **Foundation:** `/webkit-baseline-ui` (tokens, typography, spacing rhythm)
- **Cross-cutting:** `/webkit-theming-dark-mode` · `/webkit-data-viz` · `/webkit-genai` (AI chat
  and agent actions)
- **Polish:** `/webkit-motion-polish` → `/webkit-impeccable-polish`
- **Verify:** `/webkit-ui-verify` (real browser, both themes, several widths, axe)
- **Adopting WebKit in an existing app:** `/webkit-ds-adoption`

## How to find a component

Do not guess a component name or import path. Look it up.

1. Ask the webkit MCP. The server exposes tools grounded in the exact webkit version this project installed:
   - `suggest_component` — describe what you need in plain words; it returns the matching component(s).
   - Import/validation tools — confirm a subpath is real and get the canonical path.
2. No MCP? Read `node_modules/@aziontech/webkit/llms/llms.txt`. It links one Markdown page per block (`llms/blocks/<id>.md`: guidelines, variants, the primary SFC), per component (`llms/components/<name>.md`: props, events, slots, examples, accessibility, do and don't, with the same data as JSON in `<name>.json`) and per foundation (`llms/foundations/`: tokens, color, typography, spacing, motion, i18n, RTL, devices). `llms-full.txt` is every page in one file.
3. Read the catalog directly. `node_modules/@aziontech/webkit/catalog.json` has an `imports` object; every key is a real published subpath (`button`, `empty-state`, `table`, ...). If a subpath is not a key there, it does not exist.

## App-level setup (`setup` in the catalog)

A few components need **one-time wiring in the app entry before first use** — the catalog entry (and `get_component` on the MCP) carries it in a `setup` field. When `setup` is non-null, apply it BEFORE emitting code that uses the component, and check whether the project already has it (do not duplicate).

- **Toast**: fire-from-anywhere (`toast.success('Saved')`) only renders if a region is mounted. Wire the service once in the entry — `import { ToastPlugin } from '@aziontech/webkit/toast'` and chain `.use(ToastPlugin)` onto `createApp()`; the plugin mounts the region automatically (options: `app.use(ToastPlugin, { position: 'top-right' })`). A manually mounted Toaster also counts — never add both blindly (the store keeps only the first region active, but one wiring is enough). `npx webkit doctor` flags toast usage with no wired region.

- **WebkitProvider (languages)**: mount it once at the app root with the user's locale. Every built-in string a component ships (close buttons, pagination, empty states, assistive labels) then reads from the locale's catalog, and dates, numbers, file sizes and plurals format with `Intl` for that locale; `dir` follows the locale (`ar`, `he`, `fa`, `ur` are right-to-left). English is built in; Portuguese and Spanish are opt-in: import them from `@aziontech/webkit/locales/pt-BR` and `@aziontech/webkit/locales/es` and pass them through `catalogs` (`{ 'pt-BR': ptBR, es }`), or the provider falls back to English and warns in development. With no provider every component falls back to English. A label prop you pass still wins over the catalog; `messages` renames a built-in string for the whole app. Import it as `import WebkitProvider from '@aziontech/webkit/webkit-provider'`.

```vue
<!-- App.vue -->
<script setup>
  import { es } from '@aziontech/webkit/locales/es'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'

  const catalogs = { 'pt-BR': ptBR, es }
</script>

<template>
  <WebkitProvider
    :locale="user.locale"
    :catalogs="catalogs"
  >
    <RouterView />
  </WebkitProvider>
</template>
```

In your own components, `useLocale()` from `@aziontech/webkit/use-locale` returns the active `locale`, `dir`, `t(key, params)` and the `Intl` helpers (`formatNumber`, `formatDate`, `formatRelativeTime`, `formatList`, `formatFileSize`, `plural`), so your numbers and dates match WebKit's. `t` reads the provider's catalog; pass the English messages it should fall back to when no provider is mounted (`useLocale(en)`, with `en` from the same import).

## Must Have

- ✅ Flat import: `import Button from '@aziontech/webkit/button'`.
- ✅ PascalCase binding matching the last path segment: `@aziontech/webkit/mini-button` -> `MiniButton`.
- ✅ One `WebkitProvider` at the app root with the user's locale and the catalogs of every language the app offers.
- ✅ Color, spacing, radius, and typography from `@aziontech/theme` tokens (`var(--primary)`, `var(--spacing-md)`, `text-button-lg`).
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
- ❌ Passing a translated label to every instance (`aria-label="Fechar"` on each close button) instead of setting the locale on `WebkitProvider`.

## Common Patterns

### Import + tokens

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Button class="bg-(--primary) text-(--primary-contrast)">Save</Button>
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

### Docs pages: code samples and diagrams

- A code sample is `DocCodeGroup`. Set `language` on every sample; the block shows a label header
  with its readable name (Shell, JavaScript, JSON) by default.
- A **command** block holds only what the reader runs; its copy control copies exactly that (a
  leading `$ ` prompt is drawn but not copied). What the command prints goes in the sample's
  `output` field, drawn as a separate muted "Output" block with no copy control, or in prose. Never
  write output into the command as `# HTTP/2 200` (lint `webkit/no-output-in-command`, rule
  `webkit-code-samples`).
- A standalone printout (a deploy log) is `<DocCodeGroup kind="output" …>`, not a "Text" sample.
- A flow diagram in a docs column is `Diagram` with one `row`: in the docs column it stacks, the
  nodes are centred, connectors run through the centre of each node and an edge label sits on its
  line. Do not offset nodes or labels to fake that.

### Large data and server rendering

- Pass the whole list: `Select`, `MultiSelect`, `LogView` and `CodeBlock` mount long lists (over 300 rows) in chunks as they scroll into view, and `Tree` renders collapsed children only when expanded. Do not page or slice the data yourself to make them fast.
- `Chart` takes 10k points per series; its hidden data table keeps an even sample of 1,000 rows, so turn on `tableView` when people need every value on screen.
- `PhoneInput` loads its flag sprite the first time the country list opens; the closed field costs no image download.
- Every block and example renders on the server (`renderToString`). Keep `window` and `document` out of `setup` in your own screens: read them in `onMounted`.

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
- [ ] `WebkitProvider` wraps the app once with the user's locale, and `catalogs` registers every non-English language the app offers.
