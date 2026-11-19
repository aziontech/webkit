# @aziontech/webkit

Azion's design system for Vue 3 — 100+ accessible, token-driven components, plus the
tooling that keeps every project using them on-pattern: an ESLint plugin (every rule
`error`), a Stylelint config, an MCP server that guides AI coding tools, and a CLI that
wires it all in one command.

- **Docs site:** every component with its examples live beside their source, every block in every state, and the foundations (`apps/docs`, `pnpm dev:docs`). Full flows built from blocks run in `apps/demos` (`pnpm dev:demos`).
- **Styleguide:** [`docs/STYLEGUIDE.md`](./docs/STYLEGUIDE.md) — every code standard in full, with the gate that blocks each one.
- **Guidelines:** [`docs/GUIDELINES.md`](./docs/GUIDELINES.md) — the one-page digest (build & use on-pattern).

## For AI agents: start here

Creating or changing WebKit itself? Skip to "Changing WebKit (contribute)" at the end of this
page. Building a screen or an app with WebKit? Follow these steps.

1. Run `npx @aziontech/webkit init`. It installs the `webkit` MCP server, the lint, the skills and
   rules, and writes the WebKit block into `AGENTS.md` (and `CLAUDE.md`).
2. The app's chrome is one layout, composed once in `App.vue` around `RouterView`: `ConsoleLayout`
   (console), `SiteLayout` (marketing site) or `DocLayout` (docs). Start it from its shell block
   (`npx @aziontech/webkit add shell/shell-console`, `shell/shell-site`, `shell/shell-docs`): `add` writes the block
   into your views folder and prints the path, so move that file to `src/App.vue` and replace the
   stand-in body with `<RouterView />`. Every screen below is only a page body in that
   layout's slot: no `<main>`, sidebar, header, footer or ⌘K palette of its own (a page opens the
   console palette with `useConsoleLayout().openSearch()`). Only a screen with no rail (a create,
   edit or deploy flow, sign-in) is routed outside the layout and keeps its own bar and `<main>`.
3. A whole screen (login, signup, settings, a list, a create flow): start from a block.
   `npx @aziontech/webkit search <the screen in plain words>`, then
   `npx @aziontech/webkit add <block-id>` (`--variant <state>` for another state). It copies the
   reviewed SFC into your views, checks its imports against the installed version, records it in
   `webkit.blocks.json` and prints the route to add. Change only the content. Do not build the
   screen from scratch. (The MCP gives an agent the same blocks: `search_blocks`, `get_block`.) Blocks are grouped by job (`<account|ai|auth|create|dashboard|detail|edit|settings|state|view|shell|top-bar>/…`),
   one per job with its states as variants; an id from before v6 still resolves, with a `note`
   naming the new one.
4. A single piece: `suggest_component`, then `get_component`.
5. Follow the `webkit-usage` skill, which points to the skill for each case.
6. Before you hand it over: `npx @aziontech/webkit check` (the CI gate: setup, v5 names, imports,
   lint, blocks drifting from the canonical copy) and the `webkit-ui-verify` skill.

Rules for this path: [`skills/`](https://github.com/aziontech/webkit/tree/main/skills) and [`rules/`](https://github.com/aziontech/webkit/tree/main/rules). Do not use `.claude/`,
`.specs/` or `apps/` to build screens; they belong to the people who maintain WebKit.

## Building with WebKit (consume)

### Quick start with AI

Using Claude Code, Cursor, or another AI coding tool? Paste this into your agent:

> Install `@aziontech/webkit`, `@aziontech/theme`, and `@aziontech/icons` in this project,
> then run `npx @aziontech/webkit init` to wire the lint, the MCP server, and the agent docs.

The MCP server it wires gives your AI the screen blocks (`search_blocks`, `get_block`) and
the full component catalog (`list_components`, `get_component`, `list_tokens`, `list_assets`,
`suggest_component`, `get_best_practices`, `validate_usage`) — so it starts each screen from the
reviewed layout and writes the right import, prop, and token on the first try.

No MCP? The package ships the same content as plain files for any agent or reader:
`node_modules/@aziontech/webkit/llms/llms.txt` (in the [llms.txt](https://llmstxt.org) format)
links one Markdown page per block, component and foundation, a JSON API per component
(`llms/components/<name>.json`), `llms-full.txt` holds the foundations, blocks and product
components in one file and `llms-full-site.txt` the site and docs components. They are
generated from `catalog.json` (`pnpm --filter @aziontech/webkit build:llms`).

### 1 · Install

```bash
npm install @aziontech/webkit @aziontech/theme @aziontech/icons
```

Then wire the project (lint presets, MCP, pre-commit, agent docs) in one command:

```bash
npx @aziontech/webkit init
```

`init` reads your project first and never clobbers existing files — run with `--dry-run`
to preview the plan. See [`docs/toolkit/CLI.md`](./docs/toolkit/CLI.md).

### 2 · Add the theme CSS

`init` does this step for you. By hand: create `src/webkit.css` with the theme, the WebKit base
rules and the list of WebKit files your app imports, and import it once at your app entry (e.g.
`src/main.ts`) with the icon font:

```css
/* src/webkit.css */
@import '@aziontech/theme';
@import '@aziontech/theme/fonts.css'; /* skip it if your app hosts its own font files */
@import '@aziontech/webkit/styles';
@import './webkit.sources.css';
@source not '../.claude';
@source not '../CLAUDE.md';
@source not '../AGENTS.md';
```

```js
import './webkit.css'
import '@aziontech/icons'
```

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import webkit from '@aziontech/webkit/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [webkit(), vue()] })
```

`@aziontech/theme` brings the design tokens and Tailwind v4 (4.1 or later); the fonts are
`@aziontech/theme/fonts.css`. WebKit ships its components as source, and Tailwind only compiles the
classes of the files it scans, so `src/webkit.sources.css` lists the WebKit files your app imports
(each component plus what it imports itself), one `@source` per file. The Vite plugin
`@aziontech/webkit/vite-plugin` writes it on every dev start and build and rewrites it when you
add or remove a WebKit import (it waits for a changed file to settle, so a formatter rewriting the
file never drops its components, and re-scans the whole app when a build starts); without Vite, run `npx @aziontech/webkit css` after the change
(`webkit doctor` and `webkit check` fail while the list is stale). Your stylesheet then holds only
the classes of what you use: about 10 KB gzipped for a Button-only app, about 23 KB for a console
screen with a table, dialog, select, tabs and chart, instead of 77 KB for the whole library. An app
that renders every component (a catalogue, a playground) imports `@aziontech/webkit/styles/all`
instead of `./webkit.sources.css`. The `@source not` lines keep the AI guidance files `init` copies
out of the scan: their examples are not your UI. Tailwind has to run in your build:
`@tailwindcss/postcss` in `postcss.config.mjs` (what `init` writes) or `@tailwindcss/vite`.

WebKit does not depend on `vee-validate`. An app that uses `vee-validate` puts
`optimizeDeps: { include: ['vee-validate'] }` in its own Vite config.

**Dark mode.** With no `data-theme` the theme **follows the device** (`prefers-color-scheme`): light
on a light device, dark on a dark one. To pin it, set the attribute in `index.html`, so the first
paint is already right; an app that is always dark sets:

```html
<html lang="en" data-theme="dark">
```

and an app that is always light sets `data-theme="light"`. To switch at runtime, write the same
attribute (`document.documentElement.dataset.theme = 'dark'` or `'light'`); a `.dark` class on an
ancestor works too. Every token changes with it, so nothing else needs a dark variant.

### 3 · Add your first component

Every component is a flat, tree-shakeable import — `@aziontech/webkit/<name>`:

```vue
<script setup>
import Button from '@aziontech/webkit/button'
import Field from '@aziontech/webkit/field'
import Input from '@aziontech/webkit/input'
</script>

<template>
  <Field>
    <Field.Label>Email</Field.Label>
    <Input name="email" type="email" autocomplete="email" />
  </Field>
  <Button variant="primary" @click="submit">Create account</Button>
</template>
```

Composition components expose a compound API (`Table.Row`, `Table.Cell`) and a
tree-shakeable root (`@aziontech/webkit/table-root`) when you only need the root.

### 4 · Try it in the playground

The docs site is the playground: every component page renders its examples live beside the
exact source file, which runs as-is when pasted into your app, and every block page shows each
state in a resizable frame. The demos assemble blocks into routed flows on mock data.

```bash
# in this repo
pnpm dev:docs     # components, blocks, foundations
pnpm dev:demos    # list → create → detail → edit → delete, settings, onboarding, deploy, AI assistant
```

Local setup for contributors is in the [repository README](../../README.md#run-the-docs-site).

### 5 · Stay on-pattern (the lint does the remembering)

`init` enables the webkit ESLint preset, where **every rule is an `error`** — wrong
imports, deep/internal paths, style overrides on components, hardcoded colors, and
deprecated components fail your lint instead of shipping:

```js
// eslint.config.js
import webkit from '@aziontech/webkit/eslint-plugin'
export default [...webkit.configs.recommended]
```

The full pattern catalog — how to build a component by hand and how to use ours — is in
[`docs/GUIDELINES.md`](./docs/GUIDELINES.md).

### 6 · Explore from the terminal

```bash
npx @aziontech/webkit search delete confirmation   # blocks, components and examples
npx @aziontech/webkit view button                   # a component's API, or a block's guidelines + SFC
npx @aziontech/webkit add edit/edit-delete-dialog   # copy a block into src/views
npx @aziontech/webkit diff delete-dialog # your copy vs the canonical block
npx @aziontech/webkit remove delete-dialog # delete the copy and its webkit.blocks.json entry
npx @aziontech/webkit check    # CI gate: doctor + v5 names + imports + lint + block drift
npx @aziontech/webkit doctor   # verify the wiring is healthy (lint, MCP, theme)
npx -y @aziontech/webkit-mcp   # the MCP server your AI tools connect to (its own package)
```

## Changing WebKit (contribute)

This package lives in the [`aziontech/webkit`](https://github.com/aziontech/webkit) monorepo.

1. Read [`.claude/AGENTS.md`](https://github.com/aziontech/webkit/blob/main/.claude/AGENTS.md).
2. Every component starts from a spec in `.specs/`, through `/component-create`.
3. Every block in `blocks/` is a screen agents copy and every folder in `examples/` documents a component.
   Changed one? Run `pnpm --filter @aziontech/webkit build:catalog`; the docs page and the styled
   visual test follow from the files.
4. A new or moved export is written as a plain path and then typed by
   `pnpm --filter @aziontech/webkit build:exports` (`check:exports` fails until it is). `pnpm pack`
   builds `types/` (`build:types`) and removes it afterwards; `check:consumer-types` packs the three
   packages, installs them into a fresh Vite `vue-ts` app and runs its `npm run build` (needs the
   network; CI job `consumer-types`).
5. Before the PR: "What to update when WebKit changes", in
   [CONTRIBUTING.md](https://github.com/aziontech/webkit/blob/main/CONTRIBUTING.md).

## Packages

| Package             | What it is                                                 |
| ------------------- | ---------------------------------------------------------- |
| `@aziontech/webkit` | The components + eslint-plugin, stylelint-config, MCP, CLI |
| `@aziontech/theme`  | Design tokens, Tailwind v4 theme, fonts (`@import`)        |
| `@aziontech/icons`  | The icon font (CSS/woff2) + catalog                        |

## Requirements

- Vue 3.5+ (components use `defineModel` and `useId`)
- TypeScript (optional): every export carries a `types` condition that points at a declaration in `types/` (built at pack time), so a fresh Vite `vue-ts` app type-checks WebKit with its default `vue-tsc -b`, under `strict`, without reading WebKit's sources; bundlers load the `.vue` and `.ts` sources. CSS entries (`@aziontech/theme`, `@aziontech/webkit/styles`, `@aziontech/icons`) declare an empty module, so side-effect imports pass `noUncheckedSideEffectImports`. Name an `IconButton` or `ButtonGroup` with the `aria-label` (or `aria-labelledby`) attribute, as in the examples; it type-checks with no `vueCompilerOptions` override, and the `webkit/require-accessible-name` lint keeps the name required. Use `vue-tsc` 3.3.13 (or any 3.3.8–3.3.13), not 3.3.14: 3.3.14 (`@vue/language-core` 3.3.14) mistypes every template expression after a static attribute containing `//` on a component (`href="https://…"`, `eyebrow-prefix="//"`) as a ref ("Property 'value' does not exist"). `webkit init` leaves your `vue-tsc` version as it is and prints the pin when your range admits 3.3.14, and `webkit doctor` warns when 3.3.14 is installed.

## License

MIT
