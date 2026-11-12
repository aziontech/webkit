# @aziontech/webkit

Azion's design system for Vue 3 — 100+ accessible, token-driven components, plus the
tooling that keeps every project using them on-pattern: an ESLint plugin (every rule
`error`), a Stylelint config, an MCP server that guides AI coding tools, and a CLI that
wires it all in one command.

- **Docs site:** every component with its examples live beside their source, every block in every state, and the foundations (`apps/docs`, `pnpm docs:dev`). Full flows built from blocks run in `apps/demos` (`pnpm demos:dev`).
- **Styleguide:** [`docs/STYLEGUIDE.md`](./docs/STYLEGUIDE.md) — every code standard in full, with the gate that blocks each one.
- **Guidelines:** [`docs/GUIDELINES.md`](./docs/GUIDELINES.md) — the one-page digest (build & use on-pattern).

## For AI agents: start here

Pick the path by what you are about to do.

### I am building a screen or an app with WebKit (consume)

1. Run `npx @aziontech/webkit init`. It installs the `webkit` MCP server, the lint, the skills and
   rules, and writes the WebKit block into `AGENTS.md` (and `CLAUDE.md`).
2. The app's chrome is one layout, composed once in `App.vue` around `RouterView`: `ConsoleLayout`
   (console), `SiteLayout` (marketing site) or `DocLayout` (docs). Start it from its shell block
   (`npx @aziontech/webkit add shells/console`, `shells/website`, `shells/documentation`) and
   replace the stand-in body with `<RouterView />`. Every screen below is only a page body in that
   layout's slot: no `<main>`, sidebar, header, footer or ⌘K palette of its own (a page opens the
   console palette with `useConsoleLayout().openSearch()`). Only a screen with no rail (a create,
   edit or deploy flow, sign-in) is routed outside the layout and keeps its own bar and `<main>`.
3. A whole screen (login, signup, settings, a list, a create flow): start from a block.
   `npx @aziontech/webkit search <the screen in plain words>`, then
   `npx @aziontech/webkit add <block-id>` (`--variant <state>` for another state). It copies the
   reviewed SFC into your views, checks its imports against the installed version, records it in
   `webkit.blocks.json` and prints the route to add. Change only the content. Do not build the
   screen from scratch. (The MCP gives an agent the same blocks: `search_patterns`, `get_pattern`.) Patterns are grouped by task (`platform/<auth|account|create|view|detail|edit|delete|settings|states|dashboard>/…`),
   one per job with its states as variants; an id from before v6 still resolves, with a `note`
   naming the new one.
4. A single piece: `suggest_component`, then `get_component`.
5. Follow the `webkit-usage` skill, which points to the skill for each case.
6. Before you hand it over: `npx @aziontech/webkit check` (the CI gate: setup, v5 names, imports,
   lint, blocks drifting from the canonical copy) and the `webkit-ui-verify` skill.

Rules for this path: [`skills/`](https://github.com/aziontech/webkit/tree/main/skills) and [`rules/`](https://github.com/aziontech/webkit/tree/main/rules). Do not use `.claude/`,
`.specs/` or `apps/` to build screens; they belong to the people who maintain WebKit.

### I am creating or changing WebKit (contribute)

1. Read [`.claude/AGENTS.md`](https://github.com/aziontech/webkit/blob/main/.claude/AGENTS.md).
2. Every component starts from a spec in `.specs/`, through `/component-create`.
3. Every block in `blocks/` is a pattern and every folder in `examples/` documents a component.
   Changed one? Run `pnpm --filter @aziontech/webkit catalog:build`; the docs page and the styled
   visual test follow from the files.
4. Before the PR: "What to update when WebKit changes", in [CONTRIBUTING.md](https://github.com/aziontech/webkit/blob/main/CONTRIBUTING.md).

## Building with WebKit (consume)

### Quick start with AI

Using Claude Code, Cursor, or another AI coding tool? Paste this into your agent:

> Install `@aziontech/webkit`, `@aziontech/theme`, and `@aziontech/icons` in this project,
> then run `npx @aziontech/webkit init` to wire the lint, the MCP server, and the agent docs.

The MCP server it wires gives your AI the screen patterns (`search_patterns`, `get_pattern`) and
the full component catalog (`list_components`, `get_component`, `list_tokens`, `list_assets`,
`suggest_component`, `get_best_practices`, `validate_usage`) — so it starts each screen from the
reviewed layout and writes the right import, prop, and token on the first try.

No MCP? The package ships the same content as plain files for any agent or reader:
`node_modules/@aziontech/webkit/llms/llms.txt` (in the [llms.txt](https://llmstxt.org) format)
links one Markdown page per block, component and foundation, a JSON API per component
(`llms/components/<name>.json`), and `llms-full.txt` holds every page in one file. They are
generated from `catalog.json` (`pnpm --filter @aziontech/webkit llms:build`).

### 1 · Install

```bash
npm install @aziontech/webkit @aziontech/theme @aziontech/icons
```

Then wire the project (lint presets, MCP, pre-commit, agent docs) in one command:

```bash
npx @aziontech/webkit init
```

`init` reads your project first and never clobbers existing files — run with `--dry-run`
to preview the plan. See [`docs/toolkit/cli.md`](./docs/toolkit/cli.md).

### 2 · Add the theme CSS

`init` does this step for you. By hand: create `src/webkit.css` with the theme and the webkit
source registration, and import it once at your app entry (e.g. `src/main.ts`) with the icon font:

```css
/* src/webkit.css */
@import '@aziontech/theme';
@import '@aziontech/webkit/styles';
```

```js
import './webkit.css'
import '@aziontech/icons'
```

`@aziontech/theme` brings the design tokens, Tailwind v4 and the fonts; `@aziontech/webkit/styles`
registers WebKit's source with Tailwind so the component classes compile. Tailwind has to run in
your build: `@tailwindcss/postcss` in `postcss.config.mjs` (what `init` writes) or `@tailwindcss/vite`.

`@aziontech/webkit/vite` is deprecated since 6.0 and removed in 7.0: WebKit no longer depends on
`vee-validate`, so `webkitViteConfig` has nothing of WebKit's to pre-bundle. An app that uses
`vee-validate` puts `optimizeDeps: { include: ['vee-validate'] }` in its own Vite config. See
[`docs/toolkit/vite.md`](./docs/toolkit/vite.md).

**Dark mode.** The theme is **light by default**. For an app that is always dark, set the attribute
in `index.html`, so the first paint is already dark:

<!-- prettier-ignore -->
```html
<html lang="en" data-theme="dark">
```

To switch at runtime, write the same attribute
(`document.documentElement.dataset.theme = 'dark'` or `'light'`); a `.dark` class on an ancestor
works too. Every token changes with it, so nothing else needs a dark variant.

### 3 · Add your first component

Every component is a flat, tree-shakeable import — `@aziontech/webkit/<name>`:

<!-- prettier-ignore -->
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
  <Button kind="primary" @click="submit">Create account</Button>
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
pnpm docs:dev     # components, blocks, foundations
pnpm demos:dev    # list → create → detail → edit → delete, settings, onboarding, deploy, AI assistant
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
npx @aziontech/webkit add platform/delete/delete-with-confirmation   # copy a block into src/views
npx @aziontech/webkit diff delete-with-confirmation # your copy vs the canonical block
npx @aziontech/webkit check    # CI gate: doctor + v5 names + imports + lint + block drift
npx @aziontech/webkit doctor   # verify the wiring is healthy (lint, MCP, theme)
npx webkit-mcp                 # the MCP server your AI tools connect to
```

## Changing WebKit (contribute)

This package lives in the [`aziontech/webkit`](https://github.com/aziontech/webkit) monorepo. Read
[`.claude/AGENTS.md`](https://github.com/aziontech/webkit/blob/main/.claude/AGENTS.md) and [CONTRIBUTING.md](https://github.com/aziontech/webkit/blob/main/CONTRIBUTING.md) (its
"What to update when WebKit changes" section) before changing a component, a story or a skill.

A new or moved export is written as a plain path and then typed by `pnpm --filter @aziontech/webkit exports:build`
(`exports:check` fails until it is). `pnpm pack` builds `types/` (`types:build`) and removes it afterwards;
`consumer:types` packs the three packages, installs them into a fresh Vite `vue-ts` app and runs its
`npm run build` (needs the network; CI job `consumer-types`).

## Packages

| Package             | What it is                                                 |
| ------------------- | ---------------------------------------------------------- |
| `@aziontech/webkit` | The components + eslint-plugin, stylelint-config, MCP, CLI |
| `@aziontech/theme`  | Design tokens, Tailwind v4 theme, fonts (`@import`)        |
| `@aziontech/icons`  | The icon font (CSS/woff2) + catalog                        |

## Requirements

- Vue 3.5+ (components use `defineModel` and `useId`)
- TypeScript (optional): every export carries a `types` condition that points at a declaration in `types/` (built at pack time), so a fresh Vite `vue-ts` app type-checks WebKit with its default `vue-tsc -b`, under `strict`, without reading WebKit's sources; bundlers load the `.vue` and `.ts` sources. CSS entries (`@aziontech/theme`, `@aziontech/webkit/styles`, `@aziontech/icons`) declare an empty module, so side-effect imports pass `noUncheckedSideEffectImports`. Name an `IconButton` or `ButtonGroup` with the `aria-label` (or `aria-labelledby`) attribute, as in the examples; it type-checks with no `vueCompilerOptions` override, and the `webkit/accessible-name` lint keeps the name required. Use `vue-tsc` 3.3.13 (or any 3.3.8–3.3.13), not 3.3.14: 3.3.14 (`@vue/language-core` 3.3.14) mistypes every template expression after a static attribute containing `//` on a component (`href="https://…"`, `eyebrow-prefix="//"`) as a ref ("Property 'value' does not exist"). `webkit init` pins `vue-tsc` to 3.3.13 when your range admits 3.3.14, and `webkit doctor` warns when 3.3.14 is installed.

## License

MIT
