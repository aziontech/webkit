# WebKit docs site

`@aziontech/webkit-docs` is the documentation site for `@aziontech/webkit`. It replaces Storybook
for people: every component, block and foundation page is rendered from the files in this
repository, with the code beside it. It is built with WebKit itself (`GlobalHeader`, `Sidebar`,
`Menu`, `Command`, `DocPageHeader`, `DocProse`, `DocOnThisPage`, `CodeBlock`, `Table`,
`ThemeSwitcher`…), the theme from `@aziontech/theme` and the Rubik font, in light and dark, with a
right-to-left toggle and a language switch (English, Português, Español) through `WebkitProvider`.

```bash
pnpm docs:dev       # Vite dev server
pnpm docs:build     # static build into apps/docs/dist (one HTML file per route)
pnpm docs:preview   # serve apps/docs/dist on http://localhost:4173
pnpm docs:smoke     # Playwright over every built route + axe on a sample
pnpm docs:lint
```

## Where each page comes from

Nothing is copied into this app. Add a file in the package and its page appears on the next build.

| Page                      | Source                                                                                                                                                                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/components/<name>`      | `packages/webkit/catalog.json` (every `kind: "component"` entry, plus any `examples/*/examples.json` that names another entry): summary, import, when to use / not, related, props, events, slots, subcomponents, best practices.                          |
| Examples on that page     | `packages/webkit/examples/<dir>/examples.json` and each `.vue` it lists, loaded with `import.meta.glob`: the SFC mounts live and its source is shown beside it, highlighted with Shiki at build time.                                                      |
| Accessibility, RTL, Don't | The `Accessibility (WCAG 2.1 AA)`, `Right-to-left` and `Constraints — DO NOT` sections of `.specs/<name>.md`.                                                                                                                                              |
| `/blocks/<id>`            | `packages/webkit/blocks/**/block.json` (primary and variants), each state's `.vue` (live, in an iframe at `/frame/<state>/<id>/` with 375 / 768 / 1280 / full widths and a drag handle), its source, `guidelines.md` and `npx @aziontech/webkit add <id>`. |
| `/foundations/*`          | Token pages read `packages/theme/dist/v4/globals.css` (the `@theme` block and the light and dark theme blocks) and `catalog.json` `tokens`; the prose comes from `packages/webkit/README.md` and `rules/webkit-*.md`.                                      |
| Search (⌘K / Ctrl+K)      | A client-side index of every component, block and foundation page (title and summary), served by WebKit's `Command`.                                                                                                                                       |
| Copy for AI               | Builds Markdown from the page data (summary, import, API tables, every example's source). When `packages/webkit/llms/` exists at build time, the matching `.md` there is copied instead and linked as "View as Markdown".                                  |

The data side is a Vite plugin, `plugins/docs-plugin.ts`:

- `virtual:docs-index` — the slim list used by navigation, index pages and search.
- `virtual:docs-component-loaders` / `virtual:docs-component:<name>` — one lazy chunk per component
  with the full catalog entry and the rendered spec sections.
- `virtual:docs-tokens` — the token groups parsed from the theme.
- `?highlight` — any file imported with it becomes `{ code, html }` (Shiki,
  `github-light-high-contrast` and `github-dark-high-contrast` through CSS variables, so the theme switch needs no re-highlighting).
- `?markdown` — any Markdown file becomes `{ title, html }` (markdown-it + Shiki).

A router guard (`src/lib/data.ts`, `preloadRoute`) loads the chunks a route needs before it
renders, so server rendering and hydration see the same data.

Examples and blocks import every image they show from `@aziontech/webkit/assets/<file>`, so the docs
site serves no media of its own and has no public folder. `packages/webkit/llms/` is served at `/llms/` and its `llms.txt` at
`/llms.txt`; component, block and foundation pages link their `.md` as "View as Markdown".

## Build and deploy

`pnpm docs:build` runs `vite-ssg build`: a client build, a server build, and then every route
(listed in `vite.config.ts`, `includedRoutes`) is rendered to `dist/<route>/index.html` and hydrated
in the browser. The output is plain static files:

- Any static host works (Azion Edge Storage + an Edge Application, S3, Netlify, GitHub Pages…).
  Upload `apps/docs/dist/` as is.
- Serve `/<route>/` from `/<route>/index.html` (the default on most hosts) and `404/index.html` for
  unknown paths.
- The site expects to live at the domain root. To serve it under a path, set Vite's `base` in
  `vite.config.ts`.

## Smoke test

`pnpm docs:smoke` serves `dist/`, opens every route in Chromium (Playwright), fails on any console
error, uncaught exception or same-origin request that answers 4xx/5xx, and runs axe (WCAG 2.1 A and
AA) on the index pages and one route in every eight (`SMOKE_AXE_EVERY`), in dark and light, with
transitions off. A violation inside a live example or block frame whose rule
`packages/webkit/src/test/a11y-known.json` already lists for that source file is counted as known
WebKit debt instead of failing (the list only shrinks, so these expire as WebKit fixes them);
the same goes for a finding of a WebKit component used anywhere
(`COMPONENT_KNOWN` in `scripts/smoke.mjs`: `Table`, `NavigationMenu`) while `a11y-known.json` still
lists it for that component's example. Everything else fails. `SMOKE_ONLY=/blocks` limits it to matching routes. It needs a Playwright Chromium; in this repository's container:

```bash
docker run --rm --ipc=host -v "$PWD":/w -w /w/apps/docs mcr.microsoft.com/playwright:v1.62.0-noble node scripts/smoke.mjs
```
