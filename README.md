<h1 align="center">Azion Webkit Monorepo</h1>

The shared front-end foundation for Azion products. Webkit ships the Vue components, design tokens, and icon fonts that keep Console, Marketplace, and partner surfaces visually and behaviorally consistent.

## What is in this repository

- `@aziontech/webkit`: Vue component library and UI building blocks.
- `@aziontech/theme`: design token system, CSS variables, and Tailwind integration.
- `@aziontech/icons`: Azion + Prime icon fonts as CSS/woff2 assets.
- Storybook app for documentation and visual validation.
- Icons Gallery app for icon exploration and QA.

## Workspace structure

```text
webkit/
├── apps/
│   ├── storybook/      # Component docs and development playground
│   └── icons-gallery/  # Interactive icon browser
├── packages/
│   ├── webkit/         # Reusable Vue components
│   ├── theme/          # Tokens and theme styles
│   └── icons/          # Icon generation and distribution
├── .specs/             # Component specs (source of truth for the API)
├── package.json        # Root workspace scripts
└── pnpm-workspace.yaml
```

## Packages

| Package                                                              | Description                                                    | CI                                                                                                                                                                                                                | Version                                                                                                               |
| -------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [@aziontech/icons](https://www.npmjs.com/package/@aziontech/icons)   | Azion and Prime icon fonts used across products.               | [![Package Icons](https://github.com/aziontech/webkit/actions/workflows/package-icons.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-icons.yml?query=branch%3Amain)    | [![npm version](https://img.shields.io/npm/v/@aziontech/icons.svg)](https://www.npmjs.com/package/@aziontech/icons)   |
| [@aziontech/theme](https://www.npmjs.com/package/@aziontech/theme)   | Theme configuration, semantic tokens, and styling foundations. | [![Package Theme](https://github.com/aziontech/webkit/actions/workflows/package-theme.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-theme.yml?query=branch%3Amain)    | [![npm version](https://img.shields.io/npm/v/@aziontech/theme.svg)](https://www.npmjs.com/package/@aziontech/theme)   |
| [@aziontech/webkit](https://www.npmjs.com/package/@aziontech/webkit) | Reusable UI components and design system utilities.            | [![Package Webkit](https://github.com/aziontech/webkit/actions/workflows/package-webkit.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-webkit.yml?query=branch%3Amain) | [![npm version](https://img.shields.io/npm/v/@aziontech/webkit.svg)](https://www.npmjs.com/package/@aziontech/webkit) |

## Apps

| App                                   | Description                                      | CI                                                                                                                                                                                                                         |
| ------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [storybook](./apps/storybook)         | Storybook documentation for `@aziontech/webkit`. | ![App Storybook](https://github.com/aziontech/webkit/actions/workflows/app-storybook.yml/badge.svg?branch=main)                                                                                                                                                                                                                          |
| [icons-gallery](./apps/icons-gallery) | Interactive gallery for Azion and Prime icons.   | [![App Icons Gallery](https://github.com/aziontech/webkit/actions/workflows/app-icons-gallery.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/app-icons-gallery.yml?query=branch%3Amain) |

## Use in your app

Install the packages you need — `@aziontech/webkit` depends on `@aziontech/theme` transitively, but importing the theme stylesheet is up to the consumer:

```bash
pnpm add @aziontech/webkit @aziontech/theme @aziontech/icons
```

Wire the theme styles once at your app entry, then import components by path:

```js
// main.js|ts
import '@aziontech/theme'
import '@aziontech/icons'
```

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Button kind="primary" label="Button" icon="pi pi-arrow-right" />
  <Button kind="secondary" label="Button" icon="pi pi-arrow-right" />
  <Button kind="outlined" label="Button" icon="pi pi-arrow-right" />
  <Button kind="text" label="Button" icon="pi pi-arrow-right" />
  <Button kind="danger" label="Button" icon="pi pi-trash" />

  <!-- statment buttons -->
  <Button kind="outlined" label="Button" disabled />
  <Button kind="outlined" label="Button" loading />
</template>
```

**Peer requirements**

- Vue `^3.5.x`
- A Tailwind-aware build (the design tokens compile to CSS variables and Tailwind utilities)

## Getting started (contributors)

### Prerequisites

- Node.js `>= 22.18.0`
- pnpm `10.x` (corepack recommended)

### Install dependencies

From the repository root:

```bash
pnpm install
```

### Most used commands

```bash
# Storybook
pnpm storybook:dev          # Dev server (builds icons first)
pnpm storybook:build        # Static build
pnpm storybook:preview      # Preview the static build

# Icons
pnpm icons:build            # Generate icon artifacts
pnpm icons:validate         # Validate icon source

# Webkit quality gates
pnpm webkit:lint            # ESLint (max-warnings 0)
pnpm webkit:lint:style      # Stylelint
pnpm webkit:type-check      # vue-tsc --noEmit
pnpm webkit:type-coverage   # type-coverage >= 95%
pnpm webkit:build:dts       # Emit .d.ts files
pnpm webkit:format:check    # Prettier check

# Aggregate
pnpm governance             # Lint + type-check + format + audit
```

## Development flow

New components follow a **spec-driven pipeline**. The spec at `.specs/<name>.md` is the contract; the `.vue`, story, and exports are generated from it.

1. Draft the spec with `/spec-create <name>` — sets `status: draft`. Review and flip to `status: approved`.
2. Scaffold with `/component-create <name>` — writes the `.vue`, `package.json`, exports entry, and minimal story.
3. Verify with `/component-verify <name>` — re-runs spec compliance and validators.
4. Add or adjust stories under `apps/storybook/src/stories` if extra states are needed.
5. Validate locally with `pnpm storybook:dev` and `pnpm governance`.
6. Commit using conventional commits with a package scope: `feat(webkit): …`, `fix(theme): …`, `chore(icons): …`. Release tooling (`semantic-release`) reads these to publish.
7. Push your branch and open a pull request.

See [`.claude/rules/`](./.claude/rules/) for the non-negotiable rules: no external positioning/animation libs, no JS class presets, no invention beyond the spec.

## Storybook

- Local docs app: `apps/storybook`
- The project includes a `Foundations/Get Started` documentation page with onboarding details.
- Use Storybook as the source of truth for component API and expected visual behavior.

## Related docs

- [Storybook app guide](./apps/storybook/README.md)
- [Theme package guide](./packages/theme/README.md)
- [Icons package guide](./packages/icons/README.md)
- [Webkit package guide](./packages/webkit/README.md)
- [Contribution rules](./.claude/rules/) — dependencies, migration, styling, no-invention
- [Component specs](./.specs/) — source of truth for every component API

## License

MIT © Azion Technologies
