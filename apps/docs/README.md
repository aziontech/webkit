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
| `/assets/icons`           | `packages/webkit/catalog/assets/icons.json`: every Azion and colored class, searchable, copied on select.                                                                                                                                                                                                                                                                                                          |
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

Examples and blocks import every image they show from `@aziontech/webkit/assets/<file>`. The one
folder of media the docs site serves itself is `public/thumbnails/blocks/`: the `/blocks` cards show a
384×240 WebP of each block's primary state in light and dark, cut from its visual baseline
(`apps/visual/baselines/blocks/<id>/*--<theme>-1280.png`). After a block is added or its baselines are
regenerated, run `pnpm --filter @aziontech/webkit-docs generate:block-thumbnails` and commit the files;
`test/block-thumbnails.test.ts` fails when a block has none. `packages/webkit/llms/` is served at `/llms/` and its `llms.txt` at
`/llms.txt`; component, block and foundation pages link their `.md` as "View as Markdown".

## Token table pattern

Every table on a foundation page is `src/components/tokens/token-table.vue`. A new foundation
page reuses it; it never builds its own table. It composes `Table` by hand (not `DataTable`),
because tokens that share a usage sit under a full-width group row, and `DataTable` has no group
rows. Below a 36rem container the header row is visually hidden and each row wraps: the sample
and the token share the first line, the value (and the usage) take their own line.

| Column           | Shows                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sample           | `token-sample.vue`, picked with `sample`: a 32px square for `swatch`, `radius`, `ease`; a tile for `shadow`; a bar for `bar` and `duration`; text for `type`, `font`, `weight`. `ease` and `animation` add `motion-sample.vue`, a Play button that runs the curve or replays the `animate-*` class; under reduced motion it shows a note instead. `none` drops the column. A color with a dark value shows its light and dark swatch side by side. |
| Token · Tailwind | The token, and under it the Tailwind class from `tailwindClass()` in `src/lib/tokens.ts`. Both are `CopyText`: the only things that copy.                                                                                                                                                                                                                                                                                                          |
| Value            | The value; a color shows its light and dark values together; a responsive token lists every step and tags the one live at this width.                                                                                                                                                                                                                                                                                                              |
| Usage            | Only when a token has a usage no other token in the table shares. Nothing is ever repeated: a usage every token shares goes once in the table header (`usage`); a usage two or more tokens share becomes a group row (the job and "Used by") above those tokens, which leave the Usage cell empty (`usageGroups()` in `src/lib/tokens.ts`). A token with no usage shows nothing.                                                                   |

- One table per group, with its own `title` (and `description`) above it; `heading-level` is `2`
  for a page section and `3` (the default) for a group inside one.
- Order rows by magnitude, largest first for type (`typeGroups()`), smallest first for scales, never
  alphabetically.
- Samples use real content: amounts for `text-amount-*`, numbers for `text-big-number-*`, a
  paragraph for body styles, a heading for headings, code for `*-code-*`.

## Do and Don't

Every pair of guidance on the site renders through one structure,
`src/components/do-dont.vue` (owner decision B28): two `Card`s side by side from `md`, the Do
column first (and on top when they stack on a phone), labelled with the check and the cross, the
same height. Never lay out a pair by hand in a page or in Markdown; write it in one of these shapes
and the content pipeline (`plugins/content.ts`, `markdownParts`) builds the pair.

**One vocabulary.** A pair is labelled **Do** and **Don't**, the words Carbon, Atlassian, Polaris
and Material use. A guidance list and a code example take the same two words; there is no
Correct / Wrong, Good / Bad, Do not, Never, Avoid or Recommended pair. The one other pair is the
usage section, **When to use** / **When not to use**, which carries no check or cross.

| Where                                                                            | Write                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A rule, skill or README rendered as a foundation page; a block's `guidelines.md` | Two **adjacent** headings of the same level: `## Do` then `## Don't`, or `## When to use` then `## When not to use`. Nothing between them.                                                                                                     |
| A code example inside a rule                                                     | `## Example`, then `### Do` and `### Don't`, each holding one fenced block. A single sample with no counter-example is `## Example` alone.                                                                                                     |
| One example inside a list                                                        | A list whose items start with a bold label: `- **Do:** …` and `- **Don't:** …`. Other items of that list stay as a list above the pair.                                                                                                        |
| A component spec (`.specs/<name>.md`)                                            | `## Best practices` bullets fill the Do column; a bullet that starts with `**Don't**` (or `**Never**`, `**Avoid**`) moves to the Don't column. The spec's `## Constraints — DO NOT` block is written for agents and never renders on the page. |

Each card follows the common Do/Don't pattern (Polaris, Atlassian, Primer, Carbon): a coloured top
edge, the label with its check or cross icon in the header, then the example. The colours are the
documented status marks on a surface (`rules/webkit-tokens.md` § Contrast): the edge and the icon
are `--success-mark` for Do and `--danger-mark` for Don't, which pass WCAG 2.1 (at least 4.4:1 on
the surfaces) and APCA Lc 45 for an icon in light and dark. Never colour the icon with
`--success-foreground` / `--danger-foreground`: those are the text on the pale status fill, near
black in light, and read as no colour on a card. The label and the text stay `--text-default`. A
column that is only a fenced code block shows it flush, as the card's example area, with no second
frame inside the card; a column with text keeps the padded body and a normal code block. Code
inside a pair is an ordinary fenced block: write it as you would anywhere else, with no wrapper and
no comment above it.

**HTML comments never print.** Markdown on the site is rendered with raw HTML off, and the pipeline
drops every HTML comment (`<!-- … -->`) outside code: a paragraph that is only comments, a comment
inside a sentence and one that runs over several lines (`dropHtmlComments` in
`plugins/content.ts`). A comment inside a code span or a fenced block stays, because it is the
sample. Do not add tool comments above code fences: Prettier leaves code inside Markdown fences
alone (`embeddedLanguageFormatting: "off"` for `*.md` in `.prettierrc.json`), so no
`prettier-ignore` is needed.

**No task lists.** The docs are read, not ticked: a page the site renders has no `- [ ]` list. A
checklist is a plain list or numbered steps under a heading such as `## How to check it works`. If
one slips in, the renderer drops the `[ ]` marker and shows a plain bullet, never a checkbox. Agent
skills the site does not render may keep their checklists.

A block's `## Do` / `## Don't` and `## When to use` / `## When not to use` are read by name
(`block-page.vue`) and must keep those headings.

**Say it once.** A page never shows the same text twice. The header sentence is the first
sentence of the source, and the body goes on after it: a component page shows the first sentence
of its `purpose` in the header and the rest under it, and a block page shows the first sentence of
its `guidelines.md` intro in the header and the rest of the intro under it (`splitLead` in
`plugins/content.ts`). So open the intro with the one sentence that says what the piece is, and
do not restate it in the next one. A source the site renders has no heading or paragraph twice,
an example is never named like an API heading (`Props`, `Events`, `Slots`), and the sidebar links
each page once.

How it is checked:

- `pnpm --filter @aziontech/webkit check:docs-markdown` (the `docs-markdown` gate and the `toolkit`
  CI job; engine `packages/webkit/scripts/lib/docs-markdown.mjs`) fails a pair heading or list
  label other than Do / Don't in `rules/`, `skills/`, `.specs/` and every block `guidelines.md`,
  and a task list in a page the site renders.
- `pnpm test:docs` (`test/content.test.ts`, same gate and job) proves the pipeline drops comments,
  renders task lists as plain lists and pairs only Do / Don't, and fails a repeated heading or
  paragraph in a rendered source, a header sentence repeated in the body, an example named like
  an API heading and a page linked twice from the sidebar.
- The visual suite checks the result on every page (`apps/visual/tests/do-dont.spec.ts`): at
  1280 px each pair sits in two columns of equal height, at 390 px the Do column comes first, a
  pair label outside the structure fails, and in light and dark the label, the icon, the text and
  the code in each card meet WCAG 2.1 contrast against the card.
- The theme test `packages/theme/test/apca-contrast.test.mjs` holds `--success-mark` and
  `--danger-mark` to the icon target on every surface.

## Build and deploy

`pnpm build:docs` runs `vite-ssg build`: a client build, a server build, and then every route
(listed in `vite.config.ts`, `includedRoutes`) is rendered to `dist/<route>/index.html` and hydrated
in the browser. The output is plain static files:

- Any static host works (Azion Edge Storage + an Edge Application, S3, Netlify, GitHub Pages…).
  Upload `apps/docs/dist/` as is.
- Serve `/<route>/` from `/<route>/index.html` (the default on most hosts) and `404/index.html` for
  unknown paths.
- Every example frame (`/frame/example/<name>/<file>`) is its own prerendered page, like the block
  frames. `frame/example/index.html` is the fallback for a path that has no page of its own
  (`scripts/serve.mjs` does this).
- Send the security headers `scripts/serve.mjs` sends: `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and on each HTML page a
  `Content-Security-Policy` of `frame-ancestors 'self'; object-src 'none'; base-uri 'self';
script-src 'self'` plus the `sha256` hash of each inline script the page carries, and
  `worker-src 'self' blob:` (`pagePolicy()` computes it from the page).
- The site expects to live at the domain root. To serve it under a path, set Vite's `base` in
  `vite.config.ts`.
- Serve it compressed (brotli or gzip) over HTTP/2, as every CDN does by default (Azion's Edge
  Application included). `scripts/serve.mjs` does the same: it compresses every text file, and
  with `TLS_KEY` and `TLS_CERT` set it speaks HTTP/2.
- Links to repository files point at `main`; set `DOCS_SOURCE_REF` (a branch or commit) at build
  time to point them at another ref. CI builds with the pull request's head commit.

## Performance and external links

`pnpm --filter @aziontech/webkit-docs run check:lighthouse` (after `pnpm build:docs` and
`pnpm build:demos`) serves both sites compressed over HTTP/2 and runs Lighthouse 12.8.2 three
times on the docs home, `/components/button` (mobile profile) and the demos `/resources`
(desktop profile). The median must have LCP at most 2.5 s, CLS at most 0.1 and TBT at most
200 ms, and the accessibility score must be 100; a failing node counts only when no entry of
`packages/webkit/src/test/a11y-accepted.json` covers its rule, theme and selector.
`LIGHTHOUSE_OUT=<dir>` keeps the reports.

`pnpm --filter @aziontech/webkit-docs run check:external-links` runs `lychee` over the built
pages: `lychee.toml` for every external link, `lychee-bot-blocked.toml` for the hosts that block
automated clients, where a 403 or 429 is accepted. It needs `lychee` on `PATH` and the network.

The page starts the app after its first paint (`src/boot.ts`), loads each component's examples,
each block's files and the non-English messages only on the route that needs them, and hydrates
the side navigation, the header navigation and the lower parts of a component page when the
browser is idle.

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
