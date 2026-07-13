# webkit ESLint plugin — `@aziontech/webkit/eslint-plugin`

ESLint rules that make **correct and performant** usage of the [`@aziontech/webkit`](https://github.com/aziontech/webkit) design system the default — enforced at lint time, in the editor, on commit, and in CI. The plugin ships **inside** `@aziontech/webkit` as a subpath export — there is no separate plugin package.

The catalog-backed rules read the **installed** webkit `catalog.json` (the version-locked manifest of allowed imports + token rules that ships inside the webkit package), so what the linter enforces always matches the webkit version the project actually has. If no webkit catalog can be resolved, the catalog-backed rules disable themselves and print a one-line warning — they never crash an unrelated repo, but they never fail _silently_ either. The construction-standard rules (`authoring-standards`, `prefer-define-model`, `no-style-override`) are catalog-independent and always run.

The plugin resolves either published channel automatically: `@aziontech/webkit` (release) or `@aziontech/webkit.dev` (dev). The import prefix the rules match is read from the resolved catalog, so it always matches the installed name.

## Install

```bash
npm i -D eslint vue-eslint-parser @typescript-eslint/parser
```

The plugin itself comes with `@aziontech/webkit`. `eslint` (>=9, flat config) is a peer dependency. `vue-eslint-parser` (+ `@typescript-eslint/parser` for `<script setup lang="ts">`) lints `<template>` blocks in `.vue` files — the config `npx @aziontech/webkit init` generates wires both.

## Usage (flat config)

```js
// eslint.config.js
import webkit from '@aziontech/webkit/eslint-plugin'

export default [
  // Pick one preset:
  ...webkit.configs.strict
]
```

## Presets

Nothing out of standard is ever a warning — **every rule in every preset is `error`**.

| Preset        | Rule set                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `strict`      | every rule (default of `init`)                                                                         |
| `recommended` | every rule                                                                                             |
| `performance` | tree-shaking rules only (`no-barrel-import`, `prefer-tree-shakeable-root`, `no-whole-icon-set-import`) |

## Rules

| Rule                         | What it catches                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `valid-import-path`          | An import of a subpath that is **not** a published export of the installed webkit version (with typo / singular↔plural suggestions). |
| `no-deep-internal-import`    | Reaching into internals — `@aziontech/webkit/src/**` or a path deeper than a published entry point.                                  |
| `no-barrel-import`           | A barrel import / re-export / dynamic `import()` from the bare package, which defeats tree-shaking.                                  |
| `no-whole-icon-set-import`   | Importing the entire `@aziontech/icons` set instead of per-icon subpaths.                                                            |
| `no-hardcoded-color`         | Hardcoded colors / raw palette / raw typography in class & style strings — use design tokens.                                        |
| `prefer-tree-shakeable-root` | Importing a compound entry (`…/table`) when only the root `<Table>` is used — suggests the tree-shakeable `…/table-root`.            |
| `no-deprecated-component`    | Importing a component the installed catalog marks `@deprecated` — names the replacement.                                             |
| `prefer-webkit-component`    | Reaching for a foreign UI library (or hand-rolling) where a webkit component exists.                                                 |
| `prefer-define-model`        | Hand-rolled `modelValue` prop + `update:modelValue` emit instead of `defineModel`.                                                   |
| `no-style-override`          | Utility classes that fight a webkit component's internals instead of composing its slots / style seams.                              |
| `authoring-standards`        | The shipped construction standards (typed props/emits/slots, composable surface, deprecation shape) — same engine the DS hooks run.  |

Deterministic import rules (`valid-import-path`, `no-deep-internal-import`, `no-barrel-import`, `no-whole-icon-set-import`, `prefer-tree-shakeable-root`) are **autofixable**.

## How it fits the adoption toolkit

This is the **FORCE** layer: deterministic, blocks on commit and in CI. The companion **GUIDE** layer (the [webkit MCP server](./mcp.md)) helps an AI/dev generate correct code up front. Both read the same `catalog.json`. Wire everything in one step with `npx @aziontech/webkit init`.

## License

MIT
