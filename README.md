<h1 align="center">Azion Webkit Monorepo</h1>

<p align="center">
  <a href="https://github.com/aziontech/webkit/actions/workflows/governance.yml?query=branch%3Amain"><img src="https://github.com/aziontech/webkit/actions/workflows/governance.yml/badge.svg?branch=main" alt="Governance"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/node-%3E%3D22.18-brightgreen" alt="Node >=22.18">
  <img src="https://img.shields.io/badge/pnpm-10.x-orange" alt="pnpm 10.x">
  <img src="https://img.shields.io/badge/Vue-3.5%2B-42b883" alt="Vue 3.5+">
</p>

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

**Internal dependencies:** `icons` is standalone. `theme` has no internal deps. `webkit` depends on `theme`. Apps depend on all three.

## How to read this repo

If you are new (human or AI), open these in order — together they describe the entire shape of a component:

1. [`.specs/_template.md`](./.specs/_template.md) — the spec format every component conforms to.
2. [`.specs/button.md`](./.specs/button.md) — canonical filled-in spec.
3. [`packages/webkit/src/components/actions/button/button.vue`](./packages/webkit/src/components/actions/button/button.vue) — canonical implementation matching that spec.
4. [`.claude/rules/`](./.claude/rules/) — the constraints every component must respect.

## Packages

| Package                                                              | Description                                                    | CI                                                                                                                                                                                                                | Version                                                                                                               |
| -------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [@aziontech/icons](https://www.npmjs.com/package/@aziontech/icons)   | Azion and Prime icon fonts used across products.               | [![Package Icons](https://github.com/aziontech/webkit/actions/workflows/package-icons.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-icons.yml?query=branch%3Amain)    | [![npm version](https://img.shields.io/npm/v/@aziontech/icons.svg)](https://www.npmjs.com/package/@aziontech/icons)   |
| [@aziontech/theme](https://www.npmjs.com/package/@aziontech/theme)   | Theme configuration, semantic tokens, and styling foundations. | [![Package Theme](https://github.com/aziontech/webkit/actions/workflows/package-theme.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-theme.yml?query=branch%3Amain)    | [![npm version](https://img.shields.io/npm/v/@aziontech/theme.svg)](https://www.npmjs.com/package/@aziontech/theme)   |
| [@aziontech/webkit](https://www.npmjs.com/package/@aziontech/webkit) | Reusable UI components and design system utilities.            | [![Package Webkit](https://github.com/aziontech/webkit/actions/workflows/package-webkit.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-webkit.yml?query=branch%3Amain) | [![npm version](https://img.shields.io/npm/v/@aziontech/webkit.svg)](https://www.npmjs.com/package/@aziontech/webkit) |

## Apps

| App                                   | Description                                      | CI                                                                                                                                                                                                                         |
| ------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [storybook](./apps/storybook)         | Storybook documentation for `@aziontech/webkit`. Live: <https://webkit.azion.app/> | [![App Storybook](https://github.com/aziontech/webkit/actions/workflows/app-storybook.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/app-storybook.yml?query=branch%3Amain)             |
| [icons-gallery](./apps/icons-gallery) | Interactive gallery for Azion and Prime icons. Live: <https://icons-gallery.azion.app/> | [![App Icons Gallery](https://github.com/aziontech/webkit/actions/workflows/app-icons-gallery.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/app-icons-gallery.yml?query=branch%3Amain) |

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

New components follow a **spec-driven pipeline**: spec → scaffold → verify. The spec at `.specs/<name>.md` is the contract; the `.vue`, story, and exports are generated from it.

1. Draft the spec with `/spec-create <name>`, then flip `status: draft` → `approved`.
2. Scaffold with `/component-create <name>`.
3. Verify with `/component-verify <name>` and `pnpm governance`.
4. Commit using Conventional Commits with a package scope (e.g. `feat(webkit): …`).
5. Open a pull request.

Full workflow, commit-scope table, and review checklist: [CONTRIBUTING.md](./CONTRIBUTING.md). Non-negotiable rules: [`.claude/rules/`](./.claude/rules/).

## For AI agents

The slash commands above (`/spec-create`, `/component-create`, `/component-verify`) are [Claude Code](https://claude.com/claude-code) commands defined in [`.claude/commands/`](./.claude/commands/), which orchestrate lower-level skills in [`.claude/skills/`](./.claude/skills/) (spec-validate, component-scaffold, storybook-write, echo-report, etc.).

If your tooling does not run these natively (Cursor, Copilot, plain ChatGPT with repo access), read the corresponding `.md` file under `.claude/commands/<name>.md` and follow the steps manually — each command is a documented procedure, not a black box. The constraints in [`.claude/rules/`](./.claude/rules/) apply regardless of which tool runs them; treat that directory as load-bearing context for any contribution.

## Live previews

- **Component playground** — <https://webkit.azion.app/> — Storybook deployment. Source of truth for every component's API, props, and visual states. Start here to explore the design system.
- **Icon catalog** — <https://icons-gallery.azion.app/> — Searchable browser for the Azion + Prime icon sets used by `@aziontech/icons`.

Local equivalents run via `pnpm storybook:dev` and `pnpm icons:gallery:serve`.

## Related docs

- [Storybook app guide](./apps/storybook/README.md)
- [Theme package guide](./packages/theme/README.md)
- [Icons package guide](./packages/icons/README.md)
- [Webkit package guide](./packages/webkit/README.md)
- [Contributing guide](./CONTRIBUTING.md) — workflow, commit conventions, review checklist
- [Contribution rules](./.claude/rules/) — dependencies, migration, styling, no-invention
- [Component specs](./.specs/) — source of truth for every component API

## License

MIT © Azion Technologies
