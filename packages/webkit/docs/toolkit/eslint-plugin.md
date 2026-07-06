# @aziontech/eslint-plugin-webkit

ESLint rules that make **correct and performant** usage of the [`@aziontech/webkit`](https://github.com/aziontech/webkit) design system the default — enforced at lint time, in the editor, on commit, and in CI.

Every rule reads the **installed** webkit `catalog.json` (the version-locked manifest of allowed imports + token rules that ships inside the webkit package), so what the linter enforces always matches the webkit version the project actually has. If no webkit catalog can be resolved, the catalog-backed rules disable themselves and print a one-line warning — they never crash an unrelated repo, but they never fail _silently_ either.

The plugin resolves either published channel automatically: `@aziontech/webkit` (release) or `@aziontech/webkit.dev` (dev). The import prefix the rules match is read from the resolved catalog, so it always matches the installed name.

## Install

```bash
npm i -D @aziontech/eslint-plugin-webkit eslint vue-eslint-parser
```

`eslint` (>=9, flat config) is a peer dependency. `vue-eslint-parser` is an optional peer — install it to lint `<template>` blocks in `.vue` files.

## Usage (flat config)

```js
// eslint.config.js
import webkit from '@aziontech/eslint-plugin-webkit'

export default [
  // Pick one preset:
  ...webkit.configs.strict
]
```

## Presets

| Preset        | Correctness rules | Performance rules |
| ------------- | ----------------- | ----------------- |
| `recommended` | `error`           | `warn`            |
| `strict`      | `error`           | `error`           |
| `performance` | —                 | `warn`            |

## Rules

| Rule                         | What it catches                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `valid-import-path`          | An import of a subpath that is **not** a published export of the installed webkit version (with typo / singular↔plural suggestions). |
| `no-deep-internal-import`    | Reaching into internals — `@aziontech/webkit/src/**` or a path deeper than a published entry point.                                  |
| `no-barrel-import`           | A barrel import / re-export / dynamic `import()` from the bare package, which defeats tree-shaking.                                  |
| `no-whole-icon-set-import`   | Importing the entire `@aziontech/icons` set instead of per-icon subpaths.                                                            |
| `no-hardcoded-color`         | Hardcoded colors / raw palette / raw typography in class & style strings — use design tokens.                                        |
| `prefer-tree-shakeable-root` | Importing a compound entry (`…/table`) when only the root `<Table>` is used — suggests the tree-shakeable `…/table-root`.            |

## How it fits the adoption toolkit

This is the **FORCE** layer: deterministic, blocks on commit and in CI. The companion **GUIDE** layer ([`@aziontech/webkit-mcp`](https://github.com/aziontech/webkit)) helps an AI/dev generate correct code up front. Both read the same `catalog.json`. Wire everything in one step with `npx @aziontech/webkit-cli init`.

## License

MIT
