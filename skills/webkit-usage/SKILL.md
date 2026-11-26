---
name: webkit-usage
description: Entry point for building UI on @aziontech/webkit. Use when adding or reviewing UI in a project that depends on @aziontech/webkit — compose the app layout once (ConsoleLayout, SiteLayout, DocLayout) and start each screen from a block, find the right component, import it with the flat path, style with @aziontech/theme tokens, keep bundles small, and pick the focused skill for each task (forms, tables, lists, errors, states, layout, copy, polish, verification).
scope: general
status: active
last_updated: 2026-11-25
enforced_by:
  [
    webkit-imports,
    webkit-tokens,
    webkit-style-override,
    webkit-prefer-over-custom,
    webkit-performance,
    webkit-page-layout
  ]
---

# Skill: webkit-usage

## Overview

`@aziontech/webkit` is the Azion design system: a set of themed, accessible Vue 3 components. This project depends on it. When you build or review UI here, reach for a webkit component first, import it with the flat path, and style with `@aziontech/theme` tokens. This skill is the paste-safe reference for doing that right.

## Start here: one app layout, then each screen is a page body

The chrome is composed **once**, in `App.vue`, around `RouterView`, from the layout of the surface:

```vue
<script setup>
  import ConsoleLayoutRoot from '@aziontech/webkit/console-layout-root'
  import { navigation } from './navigation'
</script>

<template>
  <ConsoleLayoutRoot
    :navigation="navigation"
    :breadcrumbs="$route.meta.breadcrumbs ?? []"
    :account="{ name: 'Jane Doe', email: 'jane.doe@example.com' }"
  >
    <RouterView />
  </ConsoleLayoutRoot>
</template>
```

- **Console:** `ConsoleLayout` — navigation rows `{ id, label, icon, href }` (an in-app `href` is
  followed with the app's router, no `@navigate` wiring needed) and the active row follows the
  route; `actions`, `account-menu`, `search`, `header-leading`, `breadcrumbs`, `notifications` and `tools` slots. A page
  opens the shared palette with `useConsoleLayout().openSearch()`
  (`@aziontech/webkit/use-console-layout`); a body that also renders on its own calls
  `useConsoleLayout({ optional: true })`, which returns `null` outside a layout. Bind `v-model:navigation-open` to persist the rail or
  to offer `Collapse sidebar` in the palette (`search` slot + `@search-select`). A page sets its own
  trail, control crumb included, with `ConsoleLayout.Breadcrumb`, and a full-height workspace puts
  `data-layout-fill` on its root (never `calc(100dvh - …)`).
- **Site:** `SiteLayout` — `navigation` and `footer` are the `SiteHeaderSection` and `SiteFooterSection` data. The
  site is dark: `<html data-theme="dark">`. `SiteFooterSection` binds its language select (the compact
  `LanguageSelect`, round flag and language tag; `languages` are BCP 47 tags) with
  `v-model:language`; switch the locale from that value.
- **Docs:** `DocLayout` — the docs tree, section links, `outline-groups`, and `actions`,
  `navigation-footer`, `aside`, `footer` slots. The document scrolls. The page feeds the "On this
  page" rail by itself: every `DocHeading` with an `anchor` (level 2 or 3) and every
  `DocChangelogEntry` registers with the layout, in document order, so App.vue passes nothing per
  page and a page never renders `DocLayout`; a page with no anchored heading (the docs home) shows no
  outline rail and no `aside`. A drill row
  (`type: 'drill'`) opens in place and the rail's Back reads `Back to Docs` (`rootLabel` renames it);
  never add a hand-made Back row.

The shell blocks (`shell/shell-console`, `shell/shell-site`, `shell/shell-docs`) are these layouts with
the real navigation: copy one as your `App.vue` and replace its stand-in body with `<RouterView />`.
`npx @aziontech/webkit add shell/shell-console` writes the block into your views folder and prints the
path (`src/views/console.vue`): move that file to `src/App.vue`, and skip the route it suggests.
A page never renders its own `<main>`, `AppLayout`, `Sidebar`, `AppHeader`, `SiteHeaderSection`,
`SiteFooterSection` or `Command`. Every platform block is a page body; the one exception is a screen with no rail — a
create flow (`create/*`, headed by the `top-bar/top-bar-creation` bar) or a
signed-out screen (`auth/auth-sign-in`): route it outside the layout (a route meta `App.vue` reads), and
it keeps its own bar and `<main>` (`webkit-navigation`). An app with two surfaces (a marketing site
and its docs) does the same: `App.vue` picks `SiteLayout` or `DocLayout` from a route meta
(`meta: { layout: 'docs' }`) around one `RouterView`, and every page stays a body. The `shell/shell-docs`
variants are such bodies: `webkit add shell/shell-docs --variant Article` copies the shell (your App.vue
or docs layout) and the page side by side.

## A screen begins from a block

Before composing anything, check whether the screen already exists as a block:
`npx @aziontech/webkit search <the screen in plain words>` ("login", "account settings", "delete
confirmation"), or the `webkit` MCP `search_blocks`. Read the best one with
`npx @aziontech/webkit view <block-id>` (or `get_block`), then start the screen with
`npx @aziontech/webkit add <block-id>` (`--variant <state>` for another state): it copies the SFC
into the views directory, checks its imports, records it in `webkit.blocks.json` and prints the
route entry. `npx @aziontech/webkit diff <block-id>` later shows what you changed against the
canonical block, and `npx @aziontech/webkit remove <block-id>` (`--dry-run` first) deletes a copy you
no longer need with its `webkit.blocks.json` entry, then lists the imports left to remove. Before adapting it, read the guidelines (`view`, or the `guidelines` field
`get_block` returns): when to use the screen and when another block fits better, what each building block (A,
B, C…) is for, do and don't, the copy rules and the accessibility rules. If "When not to use"
matches your case, switch to the block it names. Then change only the content of the copy,
keeping to the guidelines. Only when no block fits, compose from components (below).

A block takes its data through props and emits its actions; it fetches nothing. `add` copies its
data files beside it (`<name>.sample.ts`, and an API adapter when the block ships one) and its parts
as kebab SFCs (`<name>-<part>.vue`). To go live,
do not rewrite the block: render it from the routed page that owns the request and pass what the
request returns (its `## Data` guidelines list the props and events):
`<TableView :resources="rows" :loading="pending" :error="message" @refresh="load" @retry="load" />`.
A data prop left out renders the sample; pass `[]` for none, and delete the `.sample.ts` file and
its import once real data flows. A state variant (`--variant Empty`) is the same block with other
props, so it imports the primary instead of copying it. A marketing band is a page section, not a block (rule
`webkit-sections`).

## Headers and the docs home — never hand-build these

- **Every app header has search.** A console, demo, docs or site header puts `SearchTrigger`
  (`@aziontech/webkit/search-trigger`) first in `AppHeader.End`, opening a `Command` palette;
  it draws `Search … ⌘K` (`Ctrl K` off macOS) on a wide bar and the magnifier on a narrow one, and
  binds the shortcut. `ConsoleLayout`, `SiteLayout` and `DocLayout` already carry it, wired to
  their palette (rule `webkit-header-search`, lint `webkit/require-header-search`).
- **A docs home is `shell/shell-docs --variant Landing`.** It opens on `DocHero` (display
  title with air above it, deck, `Get started` then `CopyPromptButton` — the dark "Copy prompt"
  chip carrying the Claude, ChatGPT, Gemini and Cursor marks — and a note), then the first section
  opens on `DocAgentCard` ("Your AI agent, fluent in Azion" with the inline Copy prompt; "Prefer the
  guided route?" with the orange Agent setup over a halftone) above the Console, CLI and API
  `DocCard`s (`az az-azion`, `az az-azion-cli`, `az az-azion-api`). Framework templates use the
  brand-colour icons (`az-color az-react`). Do not substitute `DocPageHeader`, a `DocPrompt` or a
  `DocCard` with an overline for these.

## Read the pattern first

A **pattern** is the written guidance for one kind of screen or problem: how a form, a table, a
state or an error is built here. A **block** is the copyable screen that already follows it. Before
composing a screen, read the pattern for the job, then start from its block. Each pattern is the
`SKILL.md` named below (in `node_modules/@aziontech/webkit/skills/`), and the same file is the page
on the docs site:

| Job                                                                                                                                                                      | Pattern                  | Docs page                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | --------------------------- |
| A whole product screen, end to end (the routing table)                                                                                                                   | `webkit-product-screens` | `/patterns/product-screens` |
| An Azion web page (rule `webkit-site-pages`, SD-01 to SD-25)                                                                                                             | `webkit-site-pages`      | `/patterns/site-pages`      |
| A form, and the control each value takes (dates in `DatePicker`, periods in `DateRangePicker`, references in a searchable picker, never an ID or ISO date typed as text) | `webkit-form`            | `/patterns/form`            |
| Where a create lives: page, drawer or dialog                                                                                                                             | `webkit-create-surface`  | `/patterns/create-surface`  |
| A data table: columns, toolbar, scroll, cell recipes                                                                                                                     | `webkit-tables`          | `/patterns/tables`          |
| The list page around a table: filters, collection, selection                                                                                                             | `webkit-lists`           | `/patterns/lists`           |
| A chart, a stat or a figure                                                                                                                                              | `webkit-data-viz`        | `/patterns/data-viz`        |
| API data: references by name, remote pickers, fresh lookups, typed records                                                                                               | `webkit-api-data`        | `/patterns/api-data`        |
| Loading, empty, error and success; async behaviour                                                                                                                       | `webkit-ui-states`       | `/patterns/ui-states`       |
| Where a failure goes: field, section, toast, signed-out screen                                                                                                           | `webkit-errors`          | `/patterns/errors`          |
| Explaining a field, section or page in place                                                                                                                             | `webkit-in-product-help` | `/patterns/in-product-help` |
| Shells, levels, breadcrumb, and drawers: never the way into a resource; `large`, then at most one `medium`                                                               | `webkit-navigation`      | `/patterns/navigation`      |
| Page width, inset and rhythm                                                                                                                                             | `webkit-layout`          | `/patterns/layout`          |
| Every interface string                                                                                                                                                   | `webkit-microcopy`       | `/patterns/microcopy`       |
| AI chat, streamed answers and actions the reader approves                                                                                                                | `webkit-ai-surfaces`     | `/patterns/ai-surfaces`     |
| Calling the Azion API: CORS, the dev and edge proxy, the token                                                                                                           | `webkit-azion-api`       | `/patterns/azion-api`       |
| A Metrics or Events GraphQL explorer                                                                                                                                     | `webkit-query-explorer`  | `/patterns/query-explorer`  |

The working steps are skills you run, not pages to read. Structure and states first, polish last:

- **Right component per moment:** `/webkit-ux-heuristics`
- **Foundation:** `/webkit-quick-cleanup` (tokens, typography, spacing rhythm) ·
  `/webkit-theming-dark-mode`
- **Polish:** `/webkit-motion-polish` → `/webkit-final-polish`
- **Verify:** `/webkit-ui-verify` (real browser, both themes, several widths, axe)
- **Adopting WebKit in an existing app:** `/webkit-adoption`

## Pick the component for the job

Name the job first, then take the component made for it. A plain `Input`, a string in a `<span>`
or a `Button` with extra markup is the answer only when no row below fits. For a form field, the
table is in `/webkit-form` ("Pick the control from the kind of value"); for a chart,
`/webkit-data-viz`; for an AI conversation, `/webkit-ai-surfaces`.

### Showing a value

| The screen shows                                                   | Use                                                                                                              | Never                                                  |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| A moment in time (created, updated, expires, ran at)               | `Timestamp`; in a `DataTable` column, `TableCellTime`; inside a sentence, `useLocale().formatRelativeTime(date)` | a string such as `'Nov 10'` or `'5 minutes ago'`       |
| A monetary amount                                                  | `CurrencyAmount`                                                                                                 | `'$' + value.toFixed(2)`                               |
| A number, a file size, a percentage, a list of words               | the `useLocale()` formatters (`formatNumber`, `formatFileSize`, `formatList`)                                    | `toFixed`, `toLocaleString` or a hand-made unit ladder |
| The state of a resource (Active, Failed, Paused)                   | `StatusIndicator`                                                                                                | a coloured `Tag`, a coloured dot drawn by hand         |
| How severe a finding is (critical, high, medium, low)              | `SeverityTag`                                                                                                    | a `Tag` with a hand-picked colour                      |
| An HTTP method and status (`GET 200`)                              | `StatusCode`                                                                                                     | a `Tag`                                                |
| A category or label word                                           | `Tag`                                                                                                            | a `Chip` (a chip is removable or selectable)           |
| A count attached to something (unread, items in a section)         | `Badge`                                                                                                          | a `Tag` with a number                                  |
| The first value of a list and "+3" for the rest                    | `OverflowCount`                                                                                                  | a truncated string                                     |
| A short value the reader pastes elsewhere (ID, CNAME, token name)  | `CopyText` (the value shown) or `CopyButton` beside your own markup                                              | a hand-written clipboard call                          |
| Code, config or JSON to read or copy                               | `CodeBlock`                                                                                                      | a `pre` element, a read-only `Textarea`                |
| Build, deploy or runtime log lines                                 | `LogViewer`                                                                                                      | a `CodeBlock`                                          |
| The facts of one resource (ID, region, created at)                 | `KeyValueList`                                                                                                   | a two-column `Table`                                   |
| A person, or the people on something                               | `Avatar`, `AvatarGroup`                                                                                          | an `img` in a circle                                   |
| A key or a shortcut                                                | `Kbd`                                                                                                            | a styled `code` element                                |
| A value a phone must pick up (an authenticator URI, a link)        | `QrCode`                                                                                                         | an image from a third-party service                    |
| A payment card network                                             | `PaymentBrand`                                                                                                   | a logo file of your own                                |
| Another company's mark                                             | `ThirdPartyLogo`                                                                                                 | a hand-picked SVG                                      |
| Usage against a limit                                              | `Progress`                                                                                                       | a hand-drawn bar                                       |
| A file opened from a list (image, text, JSON, PDF)                 | `FilePreview`                                                                                                    | an `iframe` or `img` by hand                           |
| How urgent a ticket or task is (urgent, high, medium, low)         | `PriorityTag`                                                                                                    | a `Tag` with a hand-picked colour                      |
| Time left before a deadline (a response target, an expiry)         | `Countdown`                                                                                                      | a relative-time string you refresh by hand             |
| The events of one record in order (ticket activity, audit history) | `Timeline`                                                                                                       | a list of dated paragraphs                             |
| The messages of a ticket or case (replies, internal notes)         | `MessageThread`                                                                                                  | chat bubbles built from `Card`                         |

### Look-alikes: which one

| Pair                           | Use the first when                                                    | Use the second when                                                                                   |
| ------------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `DataTable` / `DataGrid`       | people read rows and act on them (sort, filter, select, open)         | people edit many cells of many records in place, like a spreadsheet                                   |
| `DataTable` / `Table`          | the rows come from data (`data` + `columns`), with sort and pages     | a small static table composed by hand                                                                 |
| `DataTable` / `CardList`       | records compare column by column                                      | each record reads as a card (a logo, a title, a few facts)                                            |
| `Wizard` / `Stepper`           | an ordered create needs steps, content and Cancel, Previous, Next     | only the step rail is needed and the footer and gating are your own                                   |
| `CodeBlock` / `CodeEditor`     | the person reads or copies the code                                   | the person edits the code                                                                             |
| `DropdownMenu` / `SplitButton` | a button opens a list of actions                                      | one default action has a few related alternatives                                                     |
| `DropdownMenu` / `ContextMenu` | the menu opens from a button                                          | the same actions open by right-click or long-press on an item                                         |
| `Button` / `IconButton`        | the action has a text label                                           | the action is an icon alone (it needs `aria-label`)                                                   |
| `Button` / `HighlightButton`   | every action                                                          | the one AI entry point of the screen                                                                  |
| `ButtonGroup` / `ToggleGroup`  | several separate actions sit joined in one bar                        | one of several views or modes is chosen and stays selected                                            |
| `CopyButton` / `CopyText`      | you already show the value and need only the copy control             | the component should show the value and copy it                                                       |
| `Tabs` / `Accordion`           | one of a few peer views is visible at a time                          | sections expand and collapse in place, several may be open                                            |
| `Tabs` / `PageTabs`            | the views switch inside a page region                                 | the tabs are the second-level strip of a resource page, under its header, with the resource's actions |
| `Tree` / `SidebarMenu`         | the person browses or picks from nested data (files, folders)         | the rows are the app's navigation                                                                     |
| `Dialog` / `Drawer`            | a short question or confirmation interrupts the task                  | a form or a detail opens over the screen that owns it                                                 |
| `ConfirmDialog` / `Dialog`     | the person confirms one action, most often a destructive one          | the dialog holds anything else                                                                        |
| `Tooltip` / `Popover`          | a short hint shows on hover or focus and holds no control             | the panel holds controls or longer content and opens on click                                         |
| `Tooltip` / `Hint`             | an existing control needs a hint                                      | a label needs an info glyph that explains it                                                          |
| `Alert` / `Toast`              | the message belongs to the page or a section and stays                | the message confirms something that just happened and leaves                                          |
| `Skeleton` / `Spinner`         | content is loading and its shape is known                             | a short action is running inside a control                                                            |
| `Progress` / `UploadProgress`  | one measured value against a total                                    | file transfers keep running while the person works elsewhere                                          |
| `EmptyState` / `ErrorBoundary` | there is no data, or a load failed and you render the message         | a region may throw while rendering and must not take the page down                                    |
| `Timestamp` / `DatePicker`     | the person reads a date                                               | the person picks a date                                                                               |
| `Select` / `Combobox`          | the value must be one of the options                                  | the list only suggests and a typed value is valid                                                     |
| `Card` / `IntegrationCard`     | any framed content                                                    | a catalog tile for an integration: logo, vendor, installed state, one action                          |
| `HelpPanel` / `TutorialPanel`  | static help for the page                                              | a guided tutorial whose steps point at real controls                                                  |
| `ScrollArea` / plain overflow  | a bounded region scrolls inside the page (a panel body, a wide table) | the page itself scrolls                                                                               |

Also in the app shell: `SkipLink` is the first child of every page shell (the layouts place it
for you). For a plan row use `PricingCard`; for an official product scene, `Illustration`; to run
real components in a device-sized viewport in docs, `BrowserFrame`.

## How to find a component

Do not guess a component name or import path. Look it up.

1. Ask the webkit MCP. The server exposes tools grounded in the exact webkit version this project installed. Arguments are JSON fields of the call; required ones are in bold, and `surface` is `app`, `site` or `docs` (console screens: `app`):
   - `search_blocks` — **`query`** (the screen in plain words), `surface`, `fragments` (boolean). Start every screen here.
   - `get_block` — **`id`**, `variant`, `sections` (`["guidelines"]` or `["sfc"]`).
   - `suggest_component` — **`need`** (what you are building, e.g. `"a ranked top list"`), `surface`; the block, section or component that fits, with alternatives.
   - `search_components` — **`query`**, `surface`.
   - `get_component`, `get_import`, `get_usage_example`, `get_best_practices` — **`name`** (kebab-case, e.g. `"bar-list"`).
   - `list_components` — `category`, `surface`, `cursor`, `limit`; `list_categories` — none; `list_tokens` — `category` (a group such as `bg`, or one token name such as `--bg-surface`; each semantic token comes with its light and dark value and its purpose); `list_assets` — `kind`, `query`.
   - `validate_usage` — `import`, `classes`, `component`: confirm a subpath is real and a class string is allowed.
2. No MCP? Read `node_modules/@aziontech/webkit/llms/llms.txt`. It links one Markdown page per block (`llms/blocks/<id>.md`: guidelines, variants, the primary SFC), per component (`llms/components/<name>.md`: props, events, slots, examples, accessibility, do and don't, with the same data as JSON in `<name>.json`) and per foundation (`llms/foundations/`: tokens, color, typography, spacing, motion, i18n, RTL, devices). `llms-full.txt` is every page in one file.
3. Read the catalog directly. `node_modules/@aziontech/webkit/catalog.json` has an `imports` object; every key is a real published subpath (`button`, `empty-state`, `table`, ...). If a subpath is not a key there, it does not exist.

## App-level setup (`setup` in the catalog)

A few components need **one-time wiring in the app entry before first use** — the catalog entry (and `get_component` on the MCP) carries it in a `setup` field. When `setup` is non-null, apply it BEFORE emitting code that uses the component, and check whether the project already has it (do not duplicate).

- **Toast**: fire-from-anywhere (`toast.success('Saved')`) only renders if a region is mounted. Wire the service once in the entry — `import { ToastPlugin } from '@aziontech/webkit/toast'` and chain `.use(ToastPlugin)` onto `createApp()`; the plugin mounts the region automatically (options: `app.use(ToastPlugin, { duration: 6000 })`; leave `position` at its `bottom-end` default, where every app puts toasts). A manually mounted Toaster also counts — never add both blindly (the store keeps only the first region active, but one wiring is enough). `npx webkit doctor` flags toast usage with no wired region.

- **Theme (light or dark)**: with no `data-theme` the theme follows the device (`prefers-color-scheme`). An app that is always dark sets `data-theme="dark"` on `<html>` in `index.html` (`<html lang="en" data-theme="dark">`), so the first paint is dark, and an app that is always light sets `data-theme="light"`; a toggle writes `document.documentElement.dataset.theme` (`'dark'` / `'light'`), and a `.dark` class on an ancestor works too. Every token switches with it — never add per-theme classes (`/webkit-theming-dark-mode`).

- **ConfigProvider (languages)**: mount it once at the app root; pass `locale` when the user chose one, or leave it unset to follow the device locale (`en-US` on the server and until mount, then `navigator.language`). Every built-in string a component ships (close buttons, pagination, empty states, assistive labels) then reads from the locale's catalog, and dates, numbers, file sizes and plurals format with `Intl` for that locale; `dir` follows the locale (`ar`, `he`, `fa`, `ur` are right-to-left). English is built in; Portuguese and Spanish are opt-in: import them from `@aziontech/webkit/locales/pt-BR` and `@aziontech/webkit/locales/es` and pass them through `catalogs` (`{ 'pt-BR': ptBR, es }`), or the provider falls back to English and warns in development. With no provider every component formats for the device locale and reads English text. Only what people read follows the locale: send the `v-model` value to your server (DatePicker a `Date`, DateRangePicker ISO 8601 instants, TagEditor `key`/`value` pairs), never a printed label. A label prop you pass still wins over the catalog; `messages` renames a built-in string for the whole app. Import it as `import ConfigProvider from '@aziontech/webkit/config-provider'`.

```vue
<!-- App.vue -->
<script setup>
  import { es } from '@aziontech/webkit/locales/es'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import ConfigProvider from '@aziontech/webkit/config-provider'

  const catalogs = { 'pt-BR': ptBR, es }
</script>

<template>
  <ConfigProvider
    :locale="user.locale"
    :catalogs="catalogs"
  >
    <RouterView />
  </ConfigProvider>
</template>
```

In your own components, `useLocale()` from `@aziontech/webkit/use-locale` returns the active `locale`, `dir`, `t(key, params)` and the `Intl` helpers (`formatNumber`, `formatDate`, `formatRelativeTime`, `formatList`, `formatFileSize`, `plural`), so your numbers and dates match WebKit's. `t` reads the provider's catalog; pass the English messages it should fall back to when no provider is mounted (`useLocale(en)`, with `en` from the same import).

## Must Have

- ✅ Flat import: `import Button from '@aziontech/webkit/button'`.
- ✅ PascalCase binding matching the last path segment: `@aziontech/webkit/icon-button` -> `IconButton`.
- ✅ One `ConfigProvider` at the app root with the user's locale and the catalogs of every language the app offers.
- ✅ Color, spacing, radius, and typography from `@aziontech/theme` tokens (`var(--primary)`, `var(--spacing-md)`, `text-button-lg`).
- ✅ `import './webkit.css'` (the theme, the fonts and `./webkit.sources.css`, as `webkit init` writes it) and `import '@aziontech/icons'` once near the app entry (e.g. `src/main.ts`).
- ✅ `webkit()` from `@aziontech/webkit/vite-plugin` in `vite.config`: it keeps `src/webkit.sources.css`, the WebKit files Tailwind compiles, in step with your imports. Without Vite, run `npx @aziontech/webkit css` after adding or removing a WebKit import.
- ✅ The tree-shakeable `<name>-root` path (or specific sub-components) when you only need the root.
- ✅ Icons via the `@aziontech/icons` font: side-effect import once (`import '@aziontech/icons'`) + the icon CSS classes.
- ✅ Colour logos (`az-color az-<name>`) need no import: `./webkit.css` compiles the ones your sources name, so write the whole class in the code (`'az-color az-react'`, never `` `az-color az-${name}` ``). A logo named only in fetched data goes in `@source inline("az-react");` in `webkit.css`; the whole set (`import '@aziontech/icons/azionicons-color'`, about 85 KB gzip) is only for a page that shows every logo.
- ✅ Artwork and icon names from the published lists: `node_modules/@aziontech/webkit/llms/foundations/` (`illustrations.md`, `diagrams.md`, `brand-marks.md`, `icons.md`) or the MCP `list_assets` (`variant`, plus a `query` such as "ddos" or "delete"). Icon classes are `az az-<name>`, and `az-color az-<name>` for a colour logo; pick one by what it stands for (`list_assets` gives each icon's group, category and meaning, and a product icon names only that product). WebKit 6 uses only the Azion set: write `az az-check`, never the removed `pi pi-check` set (the default `@aziontech/icons` entry no longer loads it; `webkit migrate v6` rewrites old classes).
- ✅ A webkit component reused instead of a hand-rolled or third-party equivalent.
- ✅ A control that matches the value's type: `DatePicker` (`show-time` for an instant) or `DateRangePicker` for dates and periods, a searchable picker for a reference to another resource, a `Select` or `RadioGroup` for an enum (`/webkit-form`, Pick the control from the kind of value; the lint rule `prefer-value-control` fails a typed date, and `prefer-date-picker` and `no-raw-id-input` warn on the text fields it cannot see).

## Must Not Have

- ❌ Category-prefixed import: `@aziontech/webkit/feedback/skeleton`.
- ❌ `/src/` or deep-internal imports: `@aziontech/webkit/src/components/...`.
- ❌ Barrel import: `import { Button } from '@aziontech/webkit'` (no barrel exists).
- ❌ Binding that disagrees with the path: `import Chip from '@aziontech/webkit/chips'`.
- ❌ Hardcoded color: `#fff`, `rgb(...)`, `hsl(...)`, `text-[#1e40af]`, or raw Tailwind palette (`bg-blue-600`).
- ❌ Restyling a webkit component: `<Button class="bg-(--primary)">`, `:class`, `style` on its tag. Use its props; put your classes on your own wrapper or in its slots. Only layout utilities (size, flex and grid placement, order, logical margins) may sit on the tag, each optionally behind a breakpoint prefix (`sm:` to `2xl:`): `w-full`, `h-full`, `max-w-*`, `min-w-*`, `max-h-*`, `min-h-*`, `flex-1`, `flex-auto`, `flex-initial`, `flex-none`, `grow`, `grow-*`, `basis-*`, `shrink-0`, `self-*`, `justify-self-*`, `place-self-*`, `order-*`, `col-span-*`, `col-start-*`, `col-end-*`, `row-span-*`, `row-start-*`, `row-end-*`, `m-*`, `mx-*`, `my-*`, `mt-*`, `mb-*`, `ms-*`, `me-*`.
- ❌ An illustration, diagram, figure or mark name guessed from a file in `src/` or from the page title: an unknown illustration renders a "PLACE DESIGN ASSET" placeholder, an unknown diagram or figure draws nothing.
- ❌ `ai ai-<name>`, `ai-cor ai-<name>` or `ai-color ai-<name>`: the old base classes are gone in WebKit 6. Use `az az-<name>` and, for a colour logo, `az-color az-<name>` (never `az-<name>-color`).
- ❌ A default/namespace binding of `@aziontech/icons` (`import Icons from '@aziontech/icons'`) — it is a font; import it for side effects only.
- ❌ A custom Button, Modal, Table, Tooltip, etc. when webkit ships one.
- ❌ Passing a translated label to every instance (`aria-label="Fechar"` on each close button) instead of setting the locale on `ConfigProvider`.

## Common Patterns

### Import + tokens

Pick a token by its purpose, not its value: `list_tokens` gives every semantic token's light and
dark value and a one-line purpose, and the rule `webkit-tokens` holds the design intent behind the
groups (the surface order, the two rhythm steps, radius and type by role).

Tokens style **your own** markup around a component. The component keeps its own look and changes
it only through its props (`variant`, `size`); a class or style on its tag is restyling it (rule
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
    <Button
      variant="primary"
      label="Save"
    />
  </section>
</template>
```

### Compound vs tree-shakeable root

`Table` (and every other composition component) has two import shapes. Lead with the compound, the
form the examples and blocks use; reach for the root path only when you render the root alone:

```ts
import Table from '@aziontech/webkit/table' // compound: Table.Row, Table.Cell, ...
import TableRoot from '@aziontech/webkit/table-root' // root only, no dot-notation parts
import TableRow from '@aziontech/webkit/table-row' // one part on its own
```

Bind each import to the PascalCase of its path: `table-root` is `TableRoot`, never `Table`, so
`<Table.Row>` never appears on a binding that has no parts.

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
- A standalone printout (a deploy log) is `<DocCodeGroup type="output" …>`, not a "Text" sample.
- A flow diagram in a docs column is `Diagram` with one `row`: in the docs column it stacks, the
  nodes are centred, connectors run through the centre of each node and an edge label sits on its
  line. Do not offset nodes or labels to fake that.

### Logos, badges and photos

Logos, compliance badges and illustrations ship in the package: import the file and pass the URL
(`import magalu from '@aziontech/webkit/assets/magalu-extended-color.svg'`, then
`logo: magalu`). Names follow `<brand>-<extended|symbol>-<color|mono|reversed>` (`extended` is the
wordmark, `symbol` the mark; `color` for light surfaces, `reversed` for dark ones, `mono` in one
ink); `catalog.json` lists every file under `imports` with `"kind": "asset"`. A client wall
(`ClientQuotesSection`, `LogoWall`) on the dark site shows each brand in colour: `-extended-color` where it
reads on black (GPA, Zoop, HeroSpark, Magalu), `-extended-reversed` where the colour logo has dark
lettering (Axur, Contabilizei, Dafiti, Global Fashion Group); a one-ink registry `mark` only for a client with no
logo file. Photos, covers,
banners and clips are your content: pass URLs your app serves, or
`@aziontech/webkit/assets/placeholder-image.svg` / `placeholder-clip.webm` until you have them.
Never copy a root-relative `/marketing-components/…` or `/media/…` URL from azion.com or the docs
site: your app does not serve it (lint `webkit/no-root-relative-asset`).

### Large data and server rendering

- Pass the whole list: `Select`, `MultiSelect`, `LogViewer` and `CodeBlock` mount long lists (over 300 rows) in chunks as they scroll into view, and `Tree` renders collapsed children only when expanded. Do not page or slice the data yourself to make them fast.
- `Chart` takes 10k points per series; its hidden data table keeps an even sample of 1,000 rows, so turn on `tableView` when people need every value on screen.
- `PhoneInput` loads its flag sprite the first time the country list opens; the closed field costs no image download.
- Every block and example renders on the server (`renderToString`). Keep `window` and `document` out of `setup` in your own screens: read them in `onMounted`.

### App entry (styles + icons)

```ts
// src/main.ts
import './webkit.css' // the theme, the fonts and the WebKit files this app imports
import '@aziontech/icons'
```

`src/webkit.css` imports `./webkit.sources.css`, one `@source` per WebKit file the app imports, so
the stylesheet holds only the classes of the components you use. A bare `import '@aziontech/theme'`
compiles no component class: the components render unstyled.

## Quality Checklist

Before you finish UI work in this project:

- [ ] Every webkit import is flat (`@aziontech/webkit/<name>`), no category, no `/src/`, no barrel.
- [ ] Every binding is PascalCase of its subpath's last segment.
- [ ] No hardcoded colors — all color/spacing/typography via `@aziontech/theme` tokens.
- [ ] Icons imported individually; the whole set is never bulk-imported.
- [ ] Root-only usage takes the `-root` path; heavy overlays are lazy-loaded.
- [ ] No custom component reinvents something webkit already provides (checked via MCP or `catalog.json`).
- [ ] `./webkit.css` and `@aziontech/icons` are imported once at the app entry, and `npx @aziontech/webkit css --check` passes (the Vite plugin keeps it so).
- [ ] `ConfigProvider` wraps the app once with the user's locale, and `catalogs` registers every non-English language the app offers.
