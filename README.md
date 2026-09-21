<h1 align="center">Azion Webkit Monorepo</h1>

<p align="center">
  <a href="https://github.com/aziontech/webkit/actions/workflows/governance.yml?query=event%3Apull_request"><img src="https://github.com/aziontech/webkit/actions/workflows/governance.yml/badge.svg?event=pull_request" alt="Governance"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/node-%3E%3D24-brightgreen" alt="Node >=24">
  <img src="https://img.shields.io/badge/pnpm-11.x-orange" alt="pnpm 11.x">
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

The `webkit` CLI ships inside the `@aziontech/webkit` package — there is no separate CLI to install. One command adopts the design system in an existing project:

```bash
npx @aziontech/webkit init
```

`init` reads the project before it writes anything, never clobbers a file, and is safe to re-run. It records `@aziontech/webkit`, `@aziontech/theme` and `@aziontech/icons` (plus the lint peers) in `package.json`, writes the ESLint, Stylelint and PostCSS configs, creates `src/webkit.css` as the single CSS entry, registers the webkit MCP server in `.mcp.json` so AI tools get the component catalog, adds a lint-on-commit hook, and prepends the entry imports to `src/main.*`. Preview the whole plan with `--dry-run`, and use `-y` for CI or scripted runs.

`init` records the dependencies but does not install them — run your package manager afterwards, then confirm the wiring:

```bash
pnpm install
npx @aziontech/webkit doctor
```

`doctor` writes nothing and exits non-zero on a broken setup, so it also works as a CI gate. To pull in a newer webkit's `.claude/` bundle and `CLAUDE.md` fragment later, run `npx @aziontech/webkit sync` (`--check` reports drift without writing). Full flag reference: [`packages/webkit/docs/toolkit/cli.md`](./packages/webkit/docs/toolkit/cli.md).

Once the project is wired, import components by path:

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

### Wiring it by hand

If you would rather not run `init`, wire the runtime half by hand — the lint presets, the MCP server and the commit hook are not set up this way:

```bash
pnpm add @aziontech/webkit @aziontech/theme @aziontech/icons
```

```css
/* src/webkit.css */
@import '@aziontech/theme'; /* design tokens, Tailwind, fonts */
@import '@aziontech/webkit/styles'; /* registers webkit's source with Tailwind */
```

```js
// src/main.js|ts
import './webkit.css'
import '@aziontech/icons'
```

Do not skip `@aziontech/webkit/styles`: without it Tailwind never sees webkit's own source and the components render unstyled. `npx @aziontech/webkit doctor` reports that as a `FAIL`.

**Peer requirements**

- Vue `^3.5.x`
- A Tailwind-aware build (the design tokens compile to CSS variables and Tailwind utilities)

## Getting started (contributors)

### Prerequisites

- **Node.js `>= 24`** — the version lives in [`.nvmrc`](./.nvmrc) and is enforced by `engines` in the root `package.json`. With a version manager, `nvm use` (or `fnm use`) picks it up.
- **pnpm `11.x`** — the root `packageManager` field pins the exact version. Enable Corepack once and it installs that version for you:

```bash
corepack enable
```

### Clone and install

```bash
git clone https://github.com/aziontech/webkit.git
cd webkit
pnpm install
```

Always install from the repository root: it links the workspace packages to each other and installs the Husky hooks (`commit-msg` and `pre-commit`) that guard every commit.

### Run the Storybook

The Storybook in [`apps/storybook`](./apps/storybook) is the development playground: every component ships its stories there, with controls for every prop and a copy-paste-ready "Show code" snippet.

```bash
pnpm storybook:dev
```

This builds `@aziontech/icons` first (the stories need the icon font), then starts the dev server at <http://localhost:6006>. To skip the icons build on later runs, start it from the app directly:

```bash
pnpm --filter storybook dev
```

Stories live under `apps/storybook/src/stories/` — `foundations/` (tokens), `components/<category>/` (one folder per component), `templates/` (page-level compositions) and `utils/`. Every story must keep its "Show code" panel a runnable SFC; check the whole tree with:

```bash
pnpm storybook:validate-docs
```

A static build (`pnpm storybook:build`) lands in `apps/storybook/dist`; preview it with `pnpm storybook:preview` at <http://localhost:6007>. The full guide — stack, project structure, writing stories, visual tests — is in the [Storybook app README](./apps/storybook/README.md).

### Run the tests

Components ship a co-located `*.test.ts` run by **Vitest in browser mode** (real Chromium, never jsdom). The first run needs the browser installed:

```bash
pnpm --filter @aziontech/webkit exec playwright install chromium
pnpm webkit:test
```

Pixels are covered by a separate layer: `@storybook/test-runner` visits every story in the built Storybook and compares a screenshot against the committed baselines.

```bash
pnpm storybook:test:visual
```

Baselines are per-platform and only the Linux ones are committed, so never commit snapshots generated on macOS. The full testing contract — coverage, opting a story out, regenerating baselines — is in [CONTRIBUTING.md](./CONTRIBUTING.md#testing).

### Most used commands

```bash
# Storybook
pnpm storybook:dev          # Dev server (builds icons first)
pnpm storybook:build        # Static build
pnpm storybook:preview      # Preview the static build

# Icons
pnpm icons:build            # Generate icon artifacts
pnpm icons:validate         # Validate icon source
pnpm icons:gallery:serve    # Icons Gallery dev server

# Tests
pnpm webkit:test            # Unit suite (headless Chromium)
pnpm webkit:test:watch      # Unit suite in watch mode
pnpm webkit:test:ui         # Vitest UI (headed browser)
pnpm webkit:test:coverage   # v8 coverage report
pnpm storybook:test:visual  # Visual regression against the baselines

# Webkit quality gates
pnpm webkit:lint            # ESLint (max-warnings 0)
pnpm webkit:lint:style      # Stylelint
pnpm webkit:type-check      # vue-tsc --noEmit
pnpm webkit:type-coverage   # type-coverage >= 95%
pnpm webkit:format:check    # Prettier check

# Aggregate
pnpm governance             # Lint + type-check + format + audit
```

### Troubleshooting

- **Stale or half-installed dependencies** — `pnpm install:reset` deletes `pnpm-lock.yaml` and `node_modules/`, then reinstalls from scratch.
- **pnpm aborts a script with a deps-verify error** (common when `node_modules` is symlinked, e.g. in a git worktree) — prefix the command with `PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false`.

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
- [webkit CLI reference](./packages/webkit/docs/toolkit/cli.md) — `init`, `doctor`, `report`, `canary`, `sync`
- [Contributing guide](./CONTRIBUTING.md) — workflow, commit conventions, review checklist
- [Contribution rules](./.claude/rules/) — dependencies, migration, styling, no-invention
- [Component specs](./.specs/) — source of truth for every component API

## License

MIT © Azion Technologies
