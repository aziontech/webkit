# WebKit docs site

`@aziontech/webkit-docs` is the documentation site for `@aziontech/webkit`. Every component, block and foundation page is rendered from the files in this
repository, with the code beside it. It is built with WebKit itself (`AppHeader`, `Sidebar`,
`Menu`, `Command`, `DocPageHeader`, `DocProse`, `DocTableOfContents`, `CodeBlock`, `Table`,
`ThemeSwitcher`…), the theme from `@aziontech/theme` and the Rubik font, in light and dark, with a
right-to-left toggle and a language switch (English, Português, Español) through `ConfigProvider`.

```bash
pnpm dev:docs       # Vite dev server
pnpm build:docs     # static build into apps/docs/dist (one HTML file per route)
pnpm preview:docs   # serve apps/docs/dist on http://localhost:4173
pnpm test:docs:smoke     # Playwright over every built route + axe on a sample
pnpm lint:docs
```

## Where each page comes from

Nothing is copied into this app. Add a file in the package and its page appears on the next build.

| Page                      | Source                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/components/<name>`      | `packages/webkit/catalog.json` (every `kind: "component"` entry, plus any `examples/*/examples.json` that names another entry): summary, import, when to use / not, related, props, events, slots, subcomponents, best practices.                                                                                                                                                                                  |
| Examples on that page     | `packages/webkit/examples/<dir>/examples.json` and each `.vue` it lists, loaded with `import.meta.glob`: the SFC mounts live and its source is shown beside it, highlighted with Shiki at build time; alone at `/frame/example/<dir>/<file>/`.                                                                                                                                                                     |
| Accessibility, RTL, Don't | The `Accessibility (WCAG 2.1 AA)`, `Right-to-left` and `Constraints — DO NOT` sections of `.specs/<name>.md`.                                                                                                                                                                                                                                                                                                      |
| `/blocks/<id>`            | `packages/webkit/blocks/**/block.json` (primary and variants), each state's `.vue` (live, in an iframe at `/frame/block/<id>/<state>/` with 375 / 768 / 1280 / full widths and a drag handle), its source, `guidelines.md` and `npx @aziontech/webkit add <id>`.                                                                                                                                                   |
| `/foundations/*`          | Token pages read `packages/theme/dist/globals.css` (the `@theme` block and the light and dark theme blocks), `catalog.json` `tokens`, the responsive steps of `packages/theme/src/tokens/semantic/spacings.data.js` and the job table of `rules/webkit-tokens.md` (the Usage column); the prose comes from `packages/webkit/README.md` and `rules/webkit-*.md`. Every table follows the token table pattern below. |
| `/foundations/icon`       | `packages/webkit/catalog/assets/icons.json`: every Azion and colored class, searchable, copied on select.                                                                                                                                                                                                                                                                                                          |
| `/components`             | Every component grouped by category, each card rendering its first example live (loaded when it scrolls into view) with its name linking to its page.                                                                                                                                                                                                                                                              |
| `/assets`                 | The `Brand` lockups and every name in `packages/webkit/catalog/assets/illustrations.json`, drawn with `Illustration`.                                                                                                                                                                                                                                                                                              |
| Search (⌘K / Ctrl+K)      | A client-side index of every component, block and foundation page (title and summary), served by WebKit's `Command`.                                                                                                                                                                                                                                                                                               |
| Copy for AI               | Builds Markdown from the page data (summary, import, API tables, every example's source). When `packages/webkit/llms/` exists at build time, the matching `.md` there is copied instead and linked as "View as Markdown".                                                                                                                                                                                          |

The data side is a Vite plugin, `plugins/docs-plugin.ts`:

- `virtual:docs-index` — the slim list used by navigation, index pages and search.
- `virtual:docs-component-loaders` / `virtual:docs-component:<name>` — one lazy chunk per component
  with the full catalog entry and the rendered spec sections.
- `virtual:docs-tokens` — the token groups parsed from the theme.
- `virtual:docs-assets` — the icon classes and illustration names from `packages/webkit/catalog/assets/`.
- `?highlight` — any file imported with it becomes `{ code, html }` (Shiki,
  `github-light-high-contrast` and `github-dark-high-contrast` through CSS variables, so the theme switch needs no re-highlighting).
- `?markdown` — any Markdown file becomes `{ title, parts }` (markdown-it + Shiki); a part is
  prose HTML or a Do / Don't pair (see below).

A router guard (`src/lib/data.ts`, `preloadRoute`) loads the chunks a route needs before it
renders, so server rendering and hydration see the same data.

Examples and blocks import every image they show from `@aziontech/webkit/assets/<file>`, so the docs
site serves no media of its own and has no public folder. `packages/webkit/llms/` is served at `/llms/` and its `llms.txt` at
`/llms.txt`; component, block and foundation pages link their `.md` as "View as Markdown".

## Token table pattern

Every table on a foundation page is `src/components/tokens/token-table.vue`. A new foundation
page reuses it; it never builds its own table.

| Column           | Shows                                                                                                                                                                                                                                                                            |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sample           | `token-sample.vue`, picked with `sample`: a 32px square for `swatch`, `radius`, `ease`; a tile for `shadow`; a bar for `bar` and `duration`; text for `type`, `font`, `weight`. `none` drops the column. A color with a dark value shows its light and dark swatch side by side. |
| Token · Tailwind | The token, and under it the Tailwind class from `tailwindClass()` in `src/lib/tokens.ts`. Both are `CopyText`: the only things that copy.                                                                                                                                        |
| Value            | The value; a color shows its light and dark values together; a responsive token lists every step and tags the one live at this width.                                                                                                                                            |
| Usage            | Only when tokens carry usage. A usage every token shares goes once in the table header (`usage`), and a run of rows with the same usage prints it once.                                                                                                                          |

- One table per group, with its own `title` (and `description`) above it; `heading-level` is `2`
  for a page section and `3` (the default) for a group inside one.
- Order rows by magnitude, largest first for type (`typeGroups()`), smallest first for scales, never
  alphabetically.
- Samples use real content: amounts for `text-amount-*`, numbers for `text-big-number-*`, a
  paragraph for body styles, a heading for headings, code for `*-code-*`.

## Do and Don't

Every pair of guidance on the site renders through one structure,
`src/components/do-dont.vue` (owner decision B28): two `Card`s side by side from `md`, the Do
column first (and on top when they stack on a phone), labelled with the green check and the red
cross, the same height. Never lay out a pair by hand in a page or in Markdown; write it in one of
these shapes and the content pipeline (`plugins/content.ts`, `markdownParts`) builds the pair:

| Where                                                                            | Write                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A rule, skill or README rendered as a foundation page; a block's `guidelines.md` | Two **adjacent** headings of the same level: `## Do` then `## Don't` (or `Do not`, `Never`, `Avoid`), `## When to use` then `## When not to use`, `## Correct` then `## Wrong`. Nothing between them. |
| One example inside a rule                                                        | A list whose items start with a bold label: `- **Correct:** …` and `- **Incorrect:** …` (or `**Do:**` / `**Don't:**`). Other items of that list stay as a list above the pair.                        |
| A component spec (`.specs/<name>.md`)                                            | `## Best practices` bullets fill the Do column; a bullet that starts with `**Don't**` (or `**Never**`, `**Avoid**`) moves to the Don't column, above `## Constraints — DO NOT`.                       |

Each card follows the common Do/Don't pattern (Polaris, Atlassian, Primer, Carbon): a coloured top
edge (`--success-mark` for Do, `--danger-mark` for Don't; none for When to use), the label with
its check or cross icon in the header, then the example. A column that is only a fenced code block
shows it flush, as the card's example area, with no second frame inside the card; a column with
text keeps the padded body and a normal code block. Code inside a pair is an ordinary fenced
block: write it as you would anywhere else, with no wrapper and no comment above it.

Markdown on the site is rendered with raw HTML off, and a paragraph that is only an HTML comment
(`<!-- … -->`) is dropped (`dropHtmlComments` in `plugins/content.ts`), so a comment never prints
as text. Do not add tool comments above code fences: Prettier leaves code inside Markdown fences
alone (`embeddedLanguageFormatting: "off"` for `*.md` in `.prettierrc.json`), so no
`prettier-ignore` is needed.

A block's `## Do` / `## Don't` and `## When to use` / `## When not to use` are read by name
(`block-page.vue`) and must keep those headings. The visual suite checks the result on every page
(`apps/visual/tests/do-dont.spec.ts`): at 1280 px each pair sits in two columns of equal height, at
390 px the Do column comes first, and a Do, Don't, Correct or Wrong label outside the structure
fails the test.

## Build and deploy

`pnpm build:docs` runs `vite-ssg build`: a client build, a server build, and then every route
(listed in `vite.config.ts`, `includedRoutes`) is rendered to `dist/<route>/index.html` and hydrated
in the browser. The output is plain static files:

- Any static host works (Azion Edge Storage + an Edge Application, S3, Netlify, GitHub Pages…).
  Upload `apps/docs/dist/` as is.
- Serve `/<route>/` from `/<route>/index.html` (the default on most hosts) and `404/index.html` for
  unknown paths.
- Serve every `/frame/example/<name>/<file>` from `frame/example/index.html`: the example frame is
  one prerendered page that reads the example from its path (`scripts/serve.mjs` does this).
- The site expects to live at the domain root. To serve it under a path, set Vite's `base` in
  `vite.config.ts`.

## Smoke test

`pnpm test:docs:smoke` serves `dist/`, opens every route in Chromium (Playwright), fails on any console
error, uncaught exception or same-origin request that answers 4xx/5xx, and runs axe (WCAG 2.1 A and
AA) on the index pages and one route in every eight (`SMOKE_AXE_EVERY`), in dark and light, with
transitions off. A violation inside a live example or block frame whose rule
`packages/webkit/src/test/a11y-known.json` already lists for that source file is counted as known
WebKit debt instead of failing (the list only shrinks, so these expire as WebKit fixes them);
the same goes for a finding of a WebKit component used anywhere
(`COMPONENT_KNOWN` in `scripts/test-smoke.mjs`: `Table`, `NavigationMenu`) while `a11y-known.json` still
lists it for that component's example. Everything else fails. `SMOKE_ONLY=/blocks` limits it to matching routes. It needs a Playwright Chromium; in this repository's container:

```bash
docker run --rm --ipc=host -v "$PWD":/w -w /w/apps/docs mcr.microsoft.com/playwright:v1.62.0-noble node scripts/test-smoke.mjs
```
