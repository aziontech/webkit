<h1 align="center">Azion Webkit Monorepo</h1>

<p align="center">
  <a href="https://github.com/aziontech/webkit/actions/workflows/governance.yml?query=event%3Apull_request"><img src="https://github.com/aziontech/webkit/actions/workflows/governance.yml/badge.svg?event=pull_request" alt="Governance"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/node-%3E%3D24-brightgreen" alt="Node >=24">
  <img src="https://img.shields.io/badge/pnpm-11.x-orange" alt="pnpm 11.x">
  <img src="https://img.shields.io/badge/Vue-3.5%2B-42b883" alt="Vue 3.5+">
</p>

The shared front-end foundation for Azion products. Webkit ships the Vue components, design tokens, and icon fonts that keep Console, Marketplace, and partner surfaces visually and behaviorally consistent.

## The goal: an agentic AI WebKit

WebKit is built so that **AI agents build Azion screens, and people review them**. Every part of
the package exists to make an agent's first attempt correct:

- **Agents find the right piece instead of guessing.** The `webkit` MCP server, `catalog.json` and
  `webkit search` answer "which component or screen fits this job" from the real package.
- **Agents start from reviewed screens, not from scratch.** Blocks (`webkit add <block-id>`) are
  finished, accessible screens an agent copies and only changes the content of.
- **Machines check the result, not reviewers' memory.** Lint rules, `webkit check`, type checks
  and browser tests reject off-standard code in the agent's own loop, before a person looks at it.
- **One way to do each thing.** Same prop names, event shapes and file layout everywhere, so what
  an agent learns from one component holds for all of them.

Old or unused parts are removed rather than kept for compatibility. Breaking changes ship as a new
major version (v6), with `webkit migrate` to move existing apps across.

Every component follows one [component lifecycle](./CONTRIBUTING.md#component-lifecycle) — Add, Change, Deprecate, Remove — spec first, enforced by CI gates.

## For AI agents: start here

Pick the path by what you are about to do.

### I am building a screen or an app with WebKit (consume)

1. Run `npx @aziontech/webkit init`. It installs the `webkit` MCP server, the lint, the skills and
   rules, and writes the WebKit block into `AGENTS.md` (and `CLAUDE.md`).
2. A whole screen (login, signup, settings, a list, a create flow): start from a block.
   `npx @aziontech/webkit search <the screen in plain words>`, then
   `npx @aziontech/webkit add <block-id>` (`--variant <state>` for another state). It copies the
   reviewed SFC into your views, checks its imports against the installed version, records it in
   `webkit.blocks.json` and prints the route to add. Change only the content. Do not build the
   screen from scratch. (The MCP gives an agent the same blocks: `search_patterns`, `get_pattern`.) Patterns are grouped by task (`platform/<auth|account|create|view|detail|edit|delete|settings|states|dashboard>/…`),
   one per job with its states as variants; an id from before v6 still resolves, with a `note`
   naming the new one.
3. A single piece: `suggest_component`, then `get_component`.
4. Follow the `webkit-usage` skill, which points to the skill for each case.
5. Before you hand it over: `npx @aziontech/webkit check` (the CI gate: setup, v5 names, imports,
   lint, blocks drifting from the canonical copy) and the `webkit-ui-verify` skill.

Rules for this path: [`skills/`](./skills/) and [`rules/`](./rules/). Do not use `.claude/`,
`.specs/` or `apps/` to build screens; they belong to the people who maintain WebKit.

### I am creating or changing WebKit (contribute)

1. Read [`.claude/AGENTS.md`](./.claude/AGENTS.md).
2. Follow the [component lifecycle](./CONTRIBUTING.md#component-lifecycle): Add, Change,
   Deprecate, Remove. Every component starts from a spec in `.specs/`, through `/webkit-new`.
3. Every block in `packages/webkit/blocks/` is a pattern and every folder in
   `packages/webkit/examples/` documents a component. Changed one? Run
   `pnpm --filter @aziontech/webkit catalog:build`; the docs page and the styled visual test follow
   from the files.
4. Before the PR: "What to update when WebKit changes", in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Building with WebKit (consume)

The path for apps and screens that use the packages. AI agents start with the patterns in the `webkit` MCP (above); agents without the MCP read `node_modules/@aziontech/webkit/llms/llms.txt`, a page per block, component and foundation.

### Use in your app

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
  <Button
    kind="primary"
    label="Button"
    icon="pi pi-arrow-right"
  />
  <Button
    kind="secondary"
    label="Button"
    icon="pi pi-arrow-right"
  />
  <Button
    kind="outlined"
    label="Button"
    icon="pi pi-arrow-right"
  />
  <Button
    kind="transparent"
    label="Button"
    icon="pi pi-arrow-right"
  />
  <Button
    kind="danger"
    label="Button"
    icon="pi pi-trash"
  />

  <!-- statment buttons -->
  <Button
    kind="outlined"
    label="Button"
    disabled
  />
  <Button
    kind="outlined"
    label="Button"
    loading
  />
</template>
```

**Peer requirements**

- Vue `^3.5.x`
- A Tailwind-aware build (the design tokens compile to CSS variables and Tailwind utilities)

### Live previews

- **Docs site** — `apps/docs` (`pnpm docs:dev`) — every component's API and examples beside their source, every block in every state, the foundations. It replaces the Storybook that <https://webkit.azion.app/> served; publishing it there is pending (ROADMAP M2.10).
- **Icon catalog** — <https://icons-gallery.azion.app/> — Searchable browser for the Azion + Prime icon sets used by `@aziontech/icons`.

Run them locally with `pnpm docs:dev`, `pnpm demos:dev` and `pnpm icons:gallery:serve`.

## Changing WebKit (contribute)

The path for people and agents who maintain the design system itself.

Every component moves through one practice, the
[component lifecycle](./CONTRIBUTING.md#component-lifecycle): **Add** (an issue, `/webkit-new`, a
spec reviewed by a second agent, the build, the gates, the `ui-craft` review, the usage check, a
PR), **Change** (spec first, then code; a breaking change carries `!` in the PR title and a
migration), **Deprecate** (`@deprecated` naming the replacement and the removal version, kept for
one major) and **Remove** (a major, with everything the component shipped removed together).
Designers file the issue forms and review screenshots: see
[For designers](./CONTRIBUTING.md#for-designers).

### What is in this repository

- `@aziontech/webkit`: Vue component library and UI building blocks.
- `@aziontech/theme`: design token system, CSS variables, and Tailwind integration.
- `@aziontech/icons`: Azion + Prime icon fonts as CSS/woff2 assets.
- Docs site (`apps/docs`), demos (`apps/demos`) and the styled visual suite (`apps/visual`).
- Icons Gallery app for icon exploration and QA.

### Workspace structure

```text
webkit/
├── apps/
│   ├── docs/           # Docs site: components, blocks, foundations (vite-ssg)
│   ├── demos/          # Routed flows assembled from blocks with `webkit add`
│   ├── visual/         # Playwright visual suite with the real theme CSS
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

### How to read this repo

If you are new (human or AI), open these in order — together they describe the entire shape of a component:

1. [`.specs/_template.md`](./.specs/_template.md) — the spec format every component conforms to.
2. [`.specs/button.md`](./.specs/button.md) — canonical filled-in spec.
3. [`packages/webkit/src/components/actions/button/button.vue`](./packages/webkit/src/components/actions/button/button.vue) — canonical implementation matching that spec.
4. [`.claude/rules/`](./.claude/rules/) — the constraints every component must respect.

### Packages

| Package                                                              | Description                                                    | CI                                                                                                                                                                                                                | Version                                                                                                               |
| -------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [@aziontech/icons](https://www.npmjs.com/package/@aziontech/icons)   | Azion and Prime icon fonts used across products.               | [![Package Icons](https://github.com/aziontech/webkit/actions/workflows/package-icons.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-icons.yml?query=branch%3Amain)    | [![npm version](https://img.shields.io/npm/v/@aziontech/icons.svg)](https://www.npmjs.com/package/@aziontech/icons)   |
| [@aziontech/theme](https://www.npmjs.com/package/@aziontech/theme)   | Theme configuration, semantic tokens, and styling foundations. | [![Package Theme](https://github.com/aziontech/webkit/actions/workflows/package-theme.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-theme.yml?query=branch%3Amain)    | [![npm version](https://img.shields.io/npm/v/@aziontech/theme.svg)](https://www.npmjs.com/package/@aziontech/theme)   |
| [@aziontech/webkit](https://www.npmjs.com/package/@aziontech/webkit) | Reusable UI components and design system utilities.            | [![Package Webkit](https://github.com/aziontech/webkit/actions/workflows/package-webkit.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-webkit.yml?query=branch%3Amain) | [![npm version](https://img.shields.io/npm/v/@aziontech/webkit.svg)](https://www.npmjs.com/package/@aziontech/webkit) |

### Apps

| App                                   | Description                                                                             | CI                                                                                                                                                                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [docs](./apps/docs)                   | Docs site for `@aziontech/webkit`: components, blocks and foundations from the files.   | [![Governance](https://github.com/aziontech/webkit/actions/workflows/governance.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/governance.yml?query=branch%3Amain)                      |
| [demos](./apps/demos)                 | Routed console flows on mock data, assembled from blocks with `webkit add`.             | [![Governance](https://github.com/aziontech/webkit/actions/workflows/governance.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/governance.yml?query=branch%3Amain)                      |
| [visual](./apps/visual)               | Styled visual regression (Playwright) over examples, blocks and demos.                  | [![Visual baselines](https://github.com/aziontech/webkit/actions/workflows/visual-baselines.yml/badge.svg)](https://github.com/aziontech/webkit/actions/workflows/visual-baselines.yml)                                    |
| [icons-gallery](./apps/icons-gallery) | Interactive gallery for Azion and Prime icons. Live: <https://icons-gallery.azion.app/> | [![App Icons Gallery](https://github.com/aziontech/webkit/actions/workflows/app-icons-gallery.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/app-icons-gallery.yml?query=branch%3Amain) |

### Getting started (contributors)

#### Prerequisites

- **Node.js `>= 24`** — the version lives in [`.nvmrc`](./.nvmrc) and is enforced by `engines` in the root `package.json`. With a version manager, `nvm use` (or `fnm use`) picks it up.
- **pnpm `11.x`** — the root `packageManager` field pins the exact version. Enable Corepack once and it installs that version for you:

```bash
corepack enable
```

#### Clone and install

```bash
git clone https://github.com/aziontech/webkit.git
cd webkit
pnpm install
```

Always install from the repository root: it links the workspace packages to each other and installs the Husky hooks (`commit-msg` and `pre-commit`) that guard every commit.

#### Run the docs site and the demos

The docs site in [`apps/docs`](./apps/docs) is the development playground: every component page
renders its examples (`packages/webkit/examples/<name>/`) live beside the exact source file, every
block page shows each state in a resizable frame, and the foundations pages read the theme.

```bash
pnpm docs:dev      # http://localhost:5173
pnpm demos:dev     # the routed demos (apps/demos)
```

A static build (`pnpm docs:build`, every route prerendered) lands in `apps/docs/dist`; preview it
with `pnpm docs:preview`. How pages are generated and how to deploy is in the
[docs site README](./apps/docs/README.md); the demos are described in
[`apps/demos/README.md`](./apps/demos/README.md).

#### Run the tests

Components ship a co-located `*.test.ts` run by **Vitest in browser mode** (real Chromium, never jsdom). The first run needs the browser installed:

```bash
pnpm --filter @aziontech/webkit exec playwright install chromium
pnpm webkit:test
```

Pixels are covered by a separate layer, with the real theme CSS: `apps/visual` (Playwright) serves the built docs site and demos and compares screenshots of the examples, blocks and demo routes, in light and dark at 390 and 1280 px, against the committed baselines.

```bash
pnpm docs:build && pnpm demos:build
pnpm visual:test
```

Baselines come only from the `mcr.microsoft.com/playwright:v1.62.0-noble` image (the CI job runs in it), so never commit screenshots taken outside it. The full testing contract — coverage, the matrix, regenerating baselines — is in [CONTRIBUTING.md](./CONTRIBUTING.md#testing).

#### Most used commands

```bash
# Docs site and demos
pnpm docs:dev               # Docs dev server
pnpm docs:build             # Static build, every route prerendered
pnpm docs:preview           # Preview the static build
pnpm demos:dev              # Demos dev server
pnpm demos:build            # Demos static build

# Icons
pnpm icons:build            # Generate icon artifacts
pnpm icons:validate         # Validate icon source
pnpm icons:gallery:serve    # Icons Gallery dev server

# Tests
pnpm webkit:test            # Unit suite (headless Chromium)
pnpm webkit:test:watch      # Unit suite in watch mode
pnpm webkit:test:ui         # Vitest UI (headed browser)
pnpm webkit:test:coverage   # v8 coverage report
pnpm visual:test            # Styled visual regression against the baselines

# Webkit quality gates
pnpm webkit:lint            # ESLint (max-warnings 0)
pnpm webkit:lint:style      # Stylelint
pnpm webkit:type-check      # vue-tsc --noEmit
pnpm webkit:type-coverage   # type-coverage >= 95%
pnpm webkit:format:check    # Prettier check

# Aggregate
pnpm governance             # Lint + type-check + format + audit
```

#### Troubleshooting

- **Stale or half-installed dependencies** — `pnpm install:reset` deletes `pnpm-lock.yaml` and `node_modules/`, then reinstalls from scratch.
- **pnpm aborts a script with a deps-verify error** (common when `node_modules` is symlinked, e.g. in a git worktree) — prefix the command with `PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false`.

### Development flow

New components follow a **spec-driven pipeline**: spec → scaffold → verify. The spec at `.specs/<name>.md` is the contract; the `.vue`, examples, and exports are generated from it.

1. Draft the spec with `/spec-create <name>`, then flip `status: draft` → `approved`.
2. Scaffold with `/component-create <name>`.
3. Verify with `/component-verify <name>` and `pnpm governance`.
4. Commit using Conventional Commits with a package scope (e.g. `feat(webkit): …`).
5. Open a pull request.

Changing, deprecating or removing a component: [component lifecycle](./CONTRIBUTING.md#component-lifecycle). Full workflow, commit-scope table, and review checklist: [CONTRIBUTING.md](./CONTRIBUTING.md). Non-negotiable rules: [`.claude/rules/`](./.claude/rules/).

### Claude Code commands for contributors

The slash commands above (`/spec-create`, `/component-create`, `/component-verify`) are [Claude Code](https://claude.com/claude-code) commands defined in [`.claude/commands/`](./.claude/commands/), which orchestrate lower-level skills in [`.claude/skills/`](./.claude/skills/) (spec-validate, component-scaffold, code-connect-write, echo-report, etc.).

If your tooling does not run these natively (Cursor, Copilot, plain ChatGPT with repo access), read the corresponding `.md` file under `.claude/commands/<name>.md` and follow the steps manually — each command is a documented procedure, not a black box. The constraints in [`.claude/rules/`](./.claude/rules/) apply regardless of which tool runs them; treat that directory as load-bearing context for any contribution.

## Related docs

- [Docs site guide](./apps/docs/README.md)
- [Demos guide](./apps/demos/README.md)
- [Theme package guide](./packages/theme/README.md)
- [Icons package guide](./packages/icons/README.md)
- [Webkit package guide](./packages/webkit/README.md)
- [webkit CLI reference](./packages/webkit/docs/toolkit/cli.md) — `init`, `doctor`, `report`, `canary`, `sync`
- [Contributing guide](./CONTRIBUTING.md) — workflow, commit conventions, review checklist
- [Contribution rules](./.claude/rules/) — dependencies, migration, styling, no-invention
- [Component specs](./.specs/) — source of truth for every component API

## License

MIT © Azion Technologies
