# @aziontech/webkit

Azion's design system for Vue 3 — 100+ accessible, token-driven components, plus the
tooling that keeps every project using them on-pattern: an ESLint plugin (every rule
`error`), a Stylelint config, an MCP server that guides AI coding tools, and a CLI that
wires it all in one command.

- **Playground:** every component ships interactive stories in the Storybook, with controls for every prop.
- **Guidelines:** [`docs/GUIDELINES.md`](./docs/GUIDELINES.md) — how to build and use components on-pattern.

## Getting started

### Quick start with AI

Using Claude Code, Cursor, or another AI coding tool? Paste this into your agent:

> Install `@aziontech/webkit`, `@aziontech/theme`, and `@aziontech/icons` in this project,
> then run `npx @aziontech/webkit init` to wire the lint, the MCP server, and the agent docs.

The MCP server it wires gives your AI the full component catalog (`list_components`,
`get_component`, `list_tokens`, `suggest_component`, `get_best_practices`,
`validate_usage`) — so it writes the right import, prop, and token on the first try.

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

In your app entry (e.g. `src/main.js`):

```js
import '@aziontech/theme/globals.css' // design tokens (light/dark aware)
import '@aziontech/icons' // the icon font
```

Using Tailwind? The theme also ships a preset — `@aziontech/theme/tailwind-preset` — so
the semantic utilities (`text-body-sm`, `bg-[var(--primary)]`, …) resolve in your build.

### 3 · Add your first component

Every component is a flat, tree-shakeable import — `@aziontech/webkit/<name>`:

<!-- prettier-ignore -->
```vue
<script setup>
import Button from '@aziontech/webkit/button'
import FieldText from '@aziontech/webkit/field-text'
</script>

<template>
  <FieldText name="email" label="Email" />
  <Button kind="primary" @click="submit">Create account</Button>
</template>
```

Composition components expose a compound API (`Table.Row`, `Table.Cell`) and a
tree-shakeable root (`@aziontech/webkit/table-root`) when you only need the root.

### 4 · Try it in the playground

The Storybook is the live playground: every component ships its stories — the **Default**
story is interactive, with controls for every prop — plus copy-paste-ready "Show code"
snippets that run as-is when pasted into your app.

```bash
# in this repo
pnpm storybook:dev
```

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
npx @aziontech/webkit doctor   # verify the wiring is healthy (lint, MCP, theme)
npx webkit-mcp                 # the MCP server your AI tools connect to
```

## Packages

| Package             | What it is                                                 |
| ------------------- | ---------------------------------------------------------- |
| `@aziontech/webkit` | The components + eslint-plugin, stylelint-config, MCP, CLI |
| `@aziontech/theme`  | Design tokens, `globals.css`, Tailwind preset              |
| `@aziontech/icons`  | The icon font (CSS/woff2) + catalog                        |

## Requirements

- Vue 3.5+ (components use `defineModel` and `useId`)
- VeeValidate 4.x (form fields only)

## License

MIT
