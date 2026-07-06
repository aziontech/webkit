# @aziontech/stylelint-config-webkit

Shareable [Stylelint](https://stylelint.io/) config that forbids hardcoded colors in CSS/SCSS and Vue `<style>` blocks, steering authors to design tokens from [`@aziontech/theme`](https://www.npmjs.com/package/@aziontech/theme) referenced as `var(--*)`.

It is the styles-side complement to [`@aziontech/eslint-plugin-webkit`](https://www.npmjs.com/package/@aziontech/eslint-plugin-webkit), which owns JS/TS and Vue `<template>` class strings. Together they keep every color in your codebase pointing at a token instead of a literal.

## What it enforces

Built on Stylelint's built-in rules only (zero runtime dependencies):

| Rule                                         | Catches                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| `color-no-hex`                               | `#fff`, `#ffffff`, `#ffffffff`                                               |
| `function-disallowed-list`                   | `rgb()`, `rgba()`, `hsl()`, `hsla()`                                         |
| `declaration-property-value-disallowed-list` | common named colors (`black`, `white`, `red`, …) on color-bearing properties |

`var(--*)`, `currentColor`, `transparent`, and `inherit` all pass untouched. Every message points the author at `var(--*)`.

## Install

```sh
npm install --save-dev @aziontech/stylelint-config-webkit stylelint
```

`stylelint` (>=15) is a peer dependency you install yourself.

## Usage

Add it to your Stylelint config (`.stylelintrc.json`, `stylelint.config.js`, or the `stylelint` key in `package.json`):

```json
{
  "extends": ["@aziontech/stylelint-config-webkit"]
}
```

That is all you need for plain `.css`.

### Linting `.vue` and `.scss`

This config ships **only rules** — it does not depend on any custom syntax. To lint Vue `<style>` blocks and SCSS you install the matching PostCSS syntaxes and wire them with `overrides`:

```sh
npm install --save-dev postcss-html postcss-scss
```

```json
{
  "extends": ["@aziontech/stylelint-config-webkit"],
  "overrides": [
    {
      "files": ["**/*.vue"],
      "customSyntax": "postcss-html"
    },
    {
      "files": ["**/*.scss"],
      "customSyntax": "postcss-scss"
    }
  ]
}
```

Then run Stylelint over the file types you care about:

```sh
stylelint "src/**/*.{css,scss,vue}"
```

## License

MIT
