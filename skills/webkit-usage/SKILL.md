---
name: webkit-usage
description: Entry point for building UI on @aziontech/webkit. Use when adding or reviewing UI in a project that depends on @aziontech/webkit — compose the app layout once (ConsoleLayout, SiteLayout, DocLayout) and start each screen from a pattern, find the right component, import it with the flat path, style with @aziontech/theme tokens, keep bundles small, and pick the focused skill for each task (forms, tables, lists, errors, states, layout, copy, polish, verification).
scope: general
status: active
last_updated: 2026-11-12
enforced_by: [webkit-imports, webkit-tokens, webkit-style-override, webkit-prefer-over-custom, webkit-performance]
---

# Skill: webkit-usage

## Overview

`@aziontech/webkit` is the Azion design system: a set of themed, accessible Vue 3 components. This project depends on it. When you build or review UI here, reach for a webkit component first, import it with the flat path, and style with `@aziontech/theme` tokens. This skill is the paste-safe reference for doing that right.

## Start here: one app layout, then each screen is a page body

The chrome is composed **once**, in `App.vue`, around `RouterView`, from the layout of the surface:

```vue
<script setup>
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import { navigation } from './navigation'
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    :breadcrumbs="$route.meta.breadcrumbs ?? []"
    :account="{ name: 'Ana Souza', email: 'ana@example.com' }"
  >
    <RouterView />
  </ConsoleLayout>
</template>
```

- **Console:** `ConsoleLayout` — navigation rows `{ id, label, icon, href }` (an in-app `href` is
  followed with the app's router, no `@navigate` wiring needed) and the active row follows the
  route; `actions`, `account-menu`, `search`, `header-start`, `breadcrumbs`, `notifications` and `tools` slots. A page
  opens the shared palette with `useConsoleLayout().openSearch()`
  (`@aziontech/webkit/use-console-layout`).
- **Site:** `SiteLayout` — `navigation` and `footer` are the `SiteNav` and `SiteFooter` data. The
  site is dark: `<html data-theme="dark">`.
- **Docs:** `DocLayout` — the docs tree, section links, `outline` (the article's headings), and
  `actions`, `navigation-footer`, `aside`, `footer` slots. The document scrolls.

The shell blocks (`shells/console`, `shells/website`, `shells/documentation`) are these layouts with
the real navigation: copy one as your `App.vue` and replace its stand-in body with `<RouterView />`.
A page never renders its own `<main>`, `AppLayout`, `Sidebar`, `GlobalHeader`, `SiteNav`,
`SiteFooter` or `Command`. Some platform blocks still inline a whole console shell around their body:
keep what is inside their `<main>` and drop the rest.

## A screen begins from a pattern

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

## Headers and the docs home — never hand-build these

- **Every app header has search.** A console, demo, docs or site header puts `SearchTrigger`
  (`@aziontech/webkit/search-trigger`) first in `GlobalHeader.Right`, opening a `Command` palette;
  it draws `Search … ⌘K` (`Ctrl K` off macOS) on a wide bar and the magnifier on a narrow one, and
  binds the shortcut. `ConsoleLayout`, `SiteLayout` and `DocLayout` already carry it, wired to
  their palette (rule `webkit-header-search`, lint `webkit/header-search-trigger`).
- **A docs home is `shells/documentation --variant Landing`.** It opens on `DocHero` (display
  title with air above it, deck, `Get started` then `CopyPromptButton` — the dark "Copy prompt"
  chip carrying the Claude, ChatGPT, Gemini and Cursor marks — and a note), then the first section
  opens on `DocAgentCard` ("Your AI agent, fluent in Azion" with the inline Copy prompt; "Prefer the
  guided route?" with the orange Agent setup over a halftone) above the Console, CLI and API
  `DocCard`s (`ai ai-azion`, `ai ai-azion-cli`, `ai ai-azion-api`). Framework templates use the
  brand-colour icons (`ai-cor ai-react`). Do not substitute `DocPageHeader`, a `DocPrompt` or a
  `DocCard` with an overline for these.

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

- **Theme (light or dark)**: the theme is light by default. An app that is always dark sets `data-theme="dark"` on `<html>` in `index.html` (`<html lang="en" data-theme="dark">`), so the first paint is dark; a toggle writes `document.documentElement.dataset.theme` (`'dark'` / `'light'`), and a `.dark` class on an ancestor works too. Every token switches with it — never add per-theme classes (`/webkit-theming-dark-mode`).

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
- ✅ Artwork and icon names from the published lists: `node_modules/@aziontech/webkit/llms/foundations/` (`illustrations.md`, `diagrams.md`, `line-figures.md`, `brand-marks.md`, `icons.md`) or the MCP `list_assets` (`kind`, plus a `query` such as "ddos" or "delete"). Icon classes are `ai ai-<name>`, `pi pi-<name>`, and `ai-cor ai-<name>` for a colour brand icon.
- ✅ A webkit component reused instead of a hand-rolled or third-party equivalent.

## Must Not Have

- ❌ Category-prefixed import: `@aziontech/webkit/feedback/skeleton`.
- ❌ `/src/` or deep-internal imports: `@aziontech/webkit/src/components/...`.
- ❌ Barrel import: `import { Button } from '@aziontech/webkit'` (no barrel exists).
- ❌ Binding that disagrees with the path: `import Chip from '@aziontech/webkit/chips'`.
- ❌ Hardcoded color: `#fff`, `rgb(...)`, `hsl(...)`, `text-[#1e40af]`, or raw Tailwind palette (`bg-blue-600`).
- ❌ Restyling a webkit component: `<Button class="bg-(--primary)">`, `:class`, `style` on its tag. Use its props; put your classes on your own wrapper or in its slots. Only `w-full`, `max-w-*`, `self-*` and `shrink-0` may sit on the tag.
- ❌ An illustration, diagram, figure or mark name guessed from a file in `src/` or from the page title: an unknown illustration renders a "PLACE DESIGN ASSET" placeholder, an unknown diagram or figure draws nothing.
- ❌ `ai-<name>-cor` or `ai ai-<name>-cor` for a colour icon: neither is a class. Use `ai-cor ai-<name>`.
- ❌ A default/namespace binding of `@aziontech/icons` (`import Icons from '@aziontech/icons'`) — it is a font; import it for side effects only.
- ❌ A custom Button, Modal, Table, Tooltip, etc. when webkit ships one.
- ❌ Passing a translated label to every instance (`aria-label="Fechar"` on each close button) instead of setting the locale on `WebkitProvider`.

## Common Patterns

### Import + tokens

Tokens style **your own** markup around a component. The component keeps its own look and changes
it only through its props (`kind`, `size`); a class or style on its tag is restyling it (rule
`webkit-style-override`):

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <section
    class="flex flex-col gap-(--spacing-md) rounded-(--shape-card) bg-(--bg-surface) p-(--spacing-lg)"
  >
    <p class="text-body-sm text-(--text-muted)">Changes apply to every domain.</p>
    <Button kind="primary">Save</Button>
  </section>
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

### Logos, badges and photos

Logos, compliance badges and illustrations ship in the package: import the file and pass the URL
(`import magalu from '@aziontech/webkit/assets/magalu-extended-color.svg'`, then
`logo: magalu`). Names follow `<brand>-<extended|symbol>-<color|mono|reversed>` (`extended` is the
wordmark, `symbol` the mark; `color` for light surfaces, `reversed` for dark ones, `mono` in one
ink); `catalog.json` lists every file under `imports` with `"kind": "asset"`. Photos, covers,
banners and clips are your content: pass URLs your app serves, or
`@aziontech/webkit/assets/placeholder-image.svg` / `placeholder-clip.webm` until you have them.
Never copy a root-relative `/marketing-components/…` or `/media/…` URL from azion.com or the docs
site: your app does not serve it (lint `webkit/no-root-relative-asset`).

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
