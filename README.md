<h1 align="center">Azion UI Monorepo</h1>

<p align="center">
  <a href="https://github.com/aziontech/webkit/actions/workflows/governance.yml?query=event%3Apull_request"><img src="https://github.com/aziontech/webkit/actions/workflows/governance.yml/badge.svg?event=pull_request" alt="Governance"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/node-%3E%3D24-brightgreen" alt="Node >=24">
  <img src="https://img.shields.io/badge/pnpm-11.x-orange" alt="pnpm 11.x">
  <img src="https://img.shields.io/badge/Vue-3.5%2B-42b883" alt="Vue 3.5+">
</p>

The shared front-end foundation for Azion products. Azion UI ships the Vue components, design tokens, and icon fonts that keep Console, Marketplace, and partner surfaces visually and behaviorally consistent.

> Upgrading a 5.x app? The package is now `@aziontech/ui` and its MCP server `@aziontech/ui-mcp`: run `npx @aziontech/ui migrate v6` ([MIGRATION_V6.md § 0](./packages/ui/MIGRATION_V6.md#0-the-package-is-now-aziontechui)).

## The goal: an agentic AI Azion UI

Azion UI is built so that **AI agents build Azion screens, and people review them**. Every part of
the package exists to make an agent's first attempt correct:

- **Agents find the right piece instead of guessing.** The `azion-ui` MCP server, `catalog.json` and
  `azion-ui search` answer "which component or screen fits this job" from the real package.
- **Agents start from reviewed screens, not from scratch.** Blocks (`azion-ui add <block-id>`) are
  finished, accessible screens an agent copies and only changes the content of.
- **Machines check the result, not reviewers' memory.** Lint rules, `azion-ui check`, type checks
  and browser tests reject off-standard code in the agent's own loop, before a person looks at it.
- **One way to do each thing.** Same prop names, event shapes and file layout everywhere, so what
  an agent learns from one component holds for all of them.

Old or unused parts are removed rather than kept for compatibility. Breaking changes ship as a new
major version (v6), with `azion-ui migrate` to move existing apps across.

Every component follows one [component lifecycle](./CONTRIBUTING.md#component-lifecycle) — Add, Change, Deprecate, Remove — spec first, enforced by CI gates.

## For AI agents: start here

Creating or changing Azion UI itself? Skip to [Changing Azion UI](#changing-azion-ui-contribute). Building
a screen or an app with Azion UI? Follow these steps.

1. Run `npx @aziontech/ui init`. It installs the `azion-ui` MCP server, the lint, the skills and
   rules (in `.agents/`), and writes the Azion UI block into `AGENTS.md`.
2. A whole screen (login, signup, settings, a list, a create flow): start from a block.
   `npx @aziontech/ui search <the screen in plain words>`, then
   `npx @aziontech/ui add <block-id>` (`--variant <state>` for another state). It copies the
   reviewed SFC into your views, checks its imports against the installed version, records it in
   `azion-ui.blocks.json` and prints the route to add. Change only the content. Do not build the
   screen from scratch. (The MCP gives an agent the same blocks: `search_blocks`, `get_block`.) Blocks are grouped by job (`<account|ai|auth|create|dashboard|detail|edit|settings|state|view|shell|top-bar>/…`),
   one per job with its states as variants; an id from before v6 still resolves, with a `note`
   naming the new one.
3. A single piece: `suggest_component`, then `get_component`.
4. Follow the `azion-ui-usage` skill, which points to the skill for each case. Building a console:
   read [`azion-ui-navigation`](./skills/azion-ui-navigation/SKILL.md) before the first screen. It fixes
   the shell, the navigation levels and where a drawer may open (never as the way into a resource).
5. Before you hand it over: `npx @aziontech/ui check` (the CI gate: setup, v5 names, imports,
   lint, blocks drifting from the canonical copy) and the `azion-ui-verify` skill.

Rules for this path: [`skills/`](./skills/) and [`rules/`](./rules/). Do not use `contributing/`,
`.specs/` or `apps/` to build screens; they belong to the people who maintain Azion UI.

## Building with Azion UI (consume)

The path for apps and screens that use the packages. AI agents start with the blocks in the `azion-ui` MCP (above); agents without the MCP read `node_modules/@aziontech/ui/llms/llms.txt`, a page per block, component and foundation.

### Use in your app

The `ui` CLI ships inside the `@aziontech/ui` package — there is no separate CLI to install. One command adopts the design system in an existing project:

```bash
npx @aziontech/ui init
```

`init` reads the project before it writes anything, never clobbers a file, and is safe to re-run. It records `@aziontech/ui`, `@aziontech/theme` and `@aziontech/icons` (plus the lint peers) in `package.json`, writes the ESLint, Stylelint and PostCSS configs, creates `src/azion-ui.css` as the single CSS entry (with `src/azion-ui.sources.css`, the Azion UI files the app imports, so the stylesheet holds only their classes; init adds the `@aziontech/ui/vite-plugin` plugin to `vite.config` to keep that list current), registers the Azion UI MCP server in `.mcp.json` so AI tools get the component catalog, adds a lint-on-commit hook, and prepends the entry imports to `src/main.*`. Preview the whole plan with `--dry-run`, and use `-y` for CI or scripted runs.

`init` records the dependencies but does not install them — run your package manager afterwards, then confirm the wiring:

```bash
pnpm install
npx @aziontech/ui doctor
```

`doctor` writes nothing and exits non-zero on a broken setup, so it also works as a CI gate. To pull in a newer Azion UI's agent files (`.agents/` and the `AGENTS.md` block) later, run `npx @aziontech/ui sync` (`--check` reports drift without writing). Full flag reference: [`packages/ui/docs/toolkit/CLI.md`](./packages/ui/docs/toolkit/CLI.md).

Once the project is wired, import components by path:

```vue
<script setup>
  import Button from '@aziontech/ui/button'
</script>

<template>
  <Button
    variant="primary"
    label="Button"
    icon="az az-arrow-right"
  />
  <Button
    variant="secondary"
    label="Button"
    icon="az az-arrow-right"
  />
  <Button
    variant="outline"
    label="Button"
    icon="az az-arrow-right"
  />
  <Button
    variant="ghost"
    label="Button"
    icon="az az-arrow-right"
  />
  <Button
    variant="danger"
    label="Button"
    icon="az az-trash"
  />

  <!-- state buttons -->
  <Button
    variant="outline"
    label="Button"
    disabled
  />
  <Button
    variant="outline"
    label="Button"
    loading
  />
</template>
```

**Peer requirements**

- Vue `^3.5.x`
- A Tailwind-aware build (the design tokens compile to CSS variables and Tailwind utilities)

### Live previews

- **Docs site** — `apps/docs` (`pnpm dev:docs`) — every component's API and examples beside their source, every block in every state, the foundations. Publishing it at <https://design.azion.com/> is pending (ROADMAP M2.10).
- **Icon catalog** — <https://icons-gallery.azion.app/> — Searchable browser for the icon sets of `@aziontech/icons`.

Run them locally with `pnpm dev:docs`, `pnpm dev:demos` and `pnpm dev:icons-gallery`.

## Changing Azion UI (contribute)

The path for people and agents who maintain the design system itself.

Every component moves through one practice, the
[component lifecycle](./CONTRIBUTING.md#component-lifecycle): **Add** (an issue, `/component-new`, a
spec reviewed by a second agent, the build, the gates, the `ui-craft` review, the usage check, a
PR), **Change** (spec first, then code; a breaking change carries `!` in the PR title and a
migration), **Deprecate** (`@deprecated` naming the replacement and the removal version, kept for
one major) and **Remove** (a major, with everything the component shipped removed together).
Designers file the issue forms and review screenshots: see
[For designers](./CONTRIBUTING.md#for-designers).

1. Read [`contributing/AGENTS.md`](./contributing/AGENTS.md).
2. Every component starts from a spec in `.specs/`, through `/component-new`.
3. Every block in `packages/ui/blocks/` is a screen agents copy and every folder in
   `packages/ui/examples/` documents a component. Changed one? Run
   `pnpm --filter @aziontech/ui build:catalog`; the docs page and the styled visual test follow
   from the files.
4. Before the PR: "What to update when Azion UI changes", in [CONTRIBUTING.md](./CONTRIBUTING.md).

### What is in this repository

- `@aziontech/ui`: Vue component library and UI building blocks.
- `@aziontech/theme`: design token system, CSS variables, and Tailwind integration.
- `@aziontech/icons`: the Azion icon font and colored brand icons as CSS/woff2 assets.
- `@aziontech/ui-mcp`: the MCP server that gives AI tools the Azion UI catalog (`npx -y @aziontech/ui-mcp@^6`).
- Docs site (`apps/docs`), demos (`apps/demos`) and the styled visual suite (`apps/visual`).
- Icons Gallery app for icon exploration and QA.

### Workspace structure

```text
azion-ui/
├── apps/
│   ├── docs/           # Docs site: components, blocks, foundations (vite-ssg)
│   ├── demos/          # Routed flows assembled from blocks with `azion-ui add`
│   ├── visual/         # Playwright visual suite with the real theme CSS
│   └── icons-gallery/  # Interactive icon browser
├── packages/
│   ├── Azion UI/         # Reusable Vue components
│   ├── theme/          # Tokens and theme styles
│   └── icons/          # Icon generation and distribution
├── .specs/             # Component specs (source of truth for the API)
├── package.json        # Root workspace scripts
└── pnpm-workspace.yaml
```

**Internal dependencies:** `icons` is standalone. `theme` has no internal deps. `ui` depends on `theme`. Apps depend on all three.

### How to read this repo

If you are new (human or AI), open these in order — together they describe the entire shape of a component:

1. [`.specs/_template.md`](./.specs/_template.md) — the spec format every component conforms to.
2. [`.specs/button.md`](./.specs/button.md) — canonical filled-in spec.
3. [`packages/ui/src/components/action/button/button.vue`](./packages/ui/src/components/action/button/button.vue) — canonical implementation matching that spec.
4. [`contributing/rules/`](./contributing/rules/) — the constraints every component must respect.

### Packages

| Package                                                              | Description                                                    | CI                                                                                                                                                                                                                      | Version                                                                                                               |
| -------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [@aziontech/icons](https://www.npmjs.com/package/@aziontech/icons)   | The Azion icon font used across products.                      | [![Publish Icons](https://github.com/aziontech/webkit/actions/workflows/publish-icons.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/publish-icons.yml?query=branch%3Amain)          | [![npm version](https://img.shields.io/npm/v/@aziontech/icons.svg)](https://www.npmjs.com/package/@aziontech/icons)   |
| [@aziontech/theme](https://www.npmjs.com/package/@aziontech/theme)   | Theme configuration, semantic tokens, and styling foundations. | [![Publish Theme](https://github.com/aziontech/webkit/actions/workflows/publish-theme.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/publish-theme.yml?query=branch%3Amain)          | [![npm version](https://img.shields.io/npm/v/@aziontech/theme.svg)](https://www.npmjs.com/package/@aziontech/theme)   |
| [@aziontech/ui](https://www.npmjs.com/package/@aziontech/ui)         | Reusable UI components and design system utilities.            | [![Publish Azion UI](https://github.com/aziontech/webkit/actions/workflows/publish-ui.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/publish-ui.yml?query=branch%3Amain)             | [![npm version](https://img.shields.io/npm/v/@aziontech/ui.svg)](https://www.npmjs.com/package/@aziontech/ui)         |
| [@aziontech/ui-mcp](https://www.npmjs.com/package/@aziontech/ui-mcp) | MCP server that gives AI tools the Azion UI catalog.           | [![Publish Azion UI MCP](https://github.com/aziontech/webkit/actions/workflows/publish-ui-mcp.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/publish-ui-mcp.yml?query=branch%3Amain) | [![npm version](https://img.shields.io/npm/v/@aziontech/ui-mcp.svg)](https://www.npmjs.com/package/@aziontech/ui-mcp) |

### Apps

| App                                   | Description                                                                       | CI                                                                                                                                                                                                                                  |
| ------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [docs](./apps/docs)                   | Docs site for `@aziontech/ui`: components, blocks and foundations from the files. | [![Governance](https://github.com/aziontech/webkit/actions/workflows/governance.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/governance.yml?query=branch%3Amain)                               |
| [demos](./apps/demos)                 | Routed console flows on mock data, assembled from blocks with `azion-ui add`.     | [![Governance](https://github.com/aziontech/webkit/actions/workflows/governance.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/governance.yml?query=branch%3Amain)                               |
| [visual](./apps/visual)               | Styled visual regression (Playwright) over examples, blocks and demos.            | [![Visual baselines](https://github.com/aziontech/webkit/actions/workflows/visual-baselines.yml/badge.svg)](https://github.com/aziontech/webkit/actions/workflows/visual-baselines.yml)                                             |
| [icons-gallery](./apps/icons-gallery) | Interactive gallery for Azion icons. Live: <https://icons-gallery.azion.app/>     | [![Deploy icons gallery](https://github.com/aziontech/webkit/actions/workflows/deploy-icons-gallery.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/deploy-icons-gallery.yml?query=branch%3Amain) |

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
cd Azion UI
pnpm install
```

Always install from the repository root: it links the workspace packages to each other and installs the Husky hooks (`commit-msg` and `pre-commit`) that guard every commit.

#### Run the docs site and the demos

The docs site in [`apps/docs`](./apps/docs) is the development playground: every component page
renders its examples (`packages/ui/examples/<name>/`) live beside the exact source file, every
block page shows each state in a resizable frame, and the foundations pages read the theme.

```bash
pnpm dev:docs      # http://localhost:5173
pnpm dev:demos     # the routed demos (apps/demos)
```

A static build (`pnpm build:docs`, every route prerendered) lands in `apps/docs/dist`; preview it
with `pnpm preview:docs`. How pages are generated and how to deploy is in the
[docs site README](./apps/docs/README.md); the demos are described in
[`apps/demos/README.md`](./apps/demos/README.md).

#### Run the tests

Components ship a co-located `*.test.ts` run by **Vitest in browser mode** (real Chromium, never jsdom). The first run needs the browser installed:

```bash
pnpm --filter @aziontech/ui exec playwright install chromium
pnpm test:browser-webkit
```

Pixels are covered by a separate layer, with the real theme CSS: `apps/visual` (Playwright) serves the built docs site and demos and compares screenshots of the examples, blocks and demo routes, in light and dark at 390 and 1280 px, against the committed baselines.

```bash
pnpm build:docs && pnpm build:demos
pnpm test:visual
```

Baselines come only from the `mcr.microsoft.com/playwright:v1.62.0-noble` image (the CI job runs in it), so never commit screenshots taken outside it. The full testing contract — coverage, the matrix, regenerating baselines — is in [CONTRIBUTING.md](./CONTRIBUTING.md#testing).

#### Most used commands

```bash
# Docs site and demos
pnpm dev:docs               # Docs dev server
pnpm build:docs             # Static build, every route prerendered
pnpm preview:docs           # Preview the static build
pnpm dev:demos              # Demos dev server
pnpm build:demos            # Demos static build

# Icons
pnpm build:icons            # Generate icon artifacts
pnpm check:icons         # Validate icon source
pnpm dev:icons-gallery    # Icons Gallery dev server

# Tests
pnpm test:browser-webkit            # Unit suite (headless Chromium)
pnpm test:ui:watch      # Unit suite in watch mode
pnpm test:ui:ui         # Vitest UI (headed browser)
pnpm test:ui:coverage   # v8 coverage report
pnpm test:visual            # Styled visual regression against the baselines

# Azion UI quality gates
pnpm lint:ui            # ESLint (max-warnings 0)
pnpm lint:ui:style      # Stylelint
pnpm typecheck:ui      # vue-tsc --noEmit
pnpm check:ui:type-coverage   # type-coverage >= 95%
pnpm check:ui:format    # Prettier check

# Aggregate
pnpm gates             # Lint + type-check + format + audit
```

#### Troubleshooting

- **Stale or half-installed dependencies** — `pnpm clean:install` deletes `pnpm-lock.yaml` and `node_modules/`, then reinstalls from scratch.
- **pnpm aborts a script with a deps-verify error** (common when `node_modules` is symlinked, e.g. in a git worktree) — prefix the command with `PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false`.

### Development flow

New components follow a **spec-driven pipeline**: spec → scaffold → verify. The spec at `.specs/<name>.md` is the contract; the `.vue`, examples, and exports are generated from it.

1. Draft the spec with `/spec-create <name>`, then flip `status: draft` → `approved`.
2. Scaffold with `/component-create <name>`.
3. Verify with `/component-verify <name>` and `pnpm gates`.
4. Commit using Conventional Commits with a package scope (e.g. `feat(ui): …`).
5. Open a pull request.

Changing, deprecating or removing a component: [component lifecycle](./CONTRIBUTING.md#component-lifecycle). Full workflow, commit-scope table, and review checklist: [CONTRIBUTING.md](./CONTRIBUTING.md). Non-negotiable rules: [`contributing/rules/`](./contributing/rules/).

### Claude Code commands for contributors

The slash commands above (`/spec-create`, `/component-create`, `/component-verify`) are [Claude Code](https://claude.com/claude-code) commands defined in [`contributing/commands/`](./contributing/commands/), which orchestrate lower-level skills in [`contributing/skills/`](./contributing/skills/) (spec-validate, component-scaffold, code-connect-write, echo-report, etc.).

If your tooling does not run these natively (Cursor, Copilot, plain ChatGPT with repo access), read the corresponding `.md` file under `contributing/commands/<name>.md` and follow the steps manually — each command is a documented procedure, not a black box. The constraints in [`contributing/rules/`](./contributing/rules/) apply regardless of which tool runs them; treat that directory as load-bearing context for any contribution.

## Related docs

- [Docs site guide](./apps/docs/README.md)
- [Demos guide](./apps/demos/README.md)
- [Theme package guide](./packages/theme/README.md)
- [Icons package guide](./packages/icons/README.md)
- [Azion UI package guide](./packages/ui/README.md)
- [Azion UI CLI reference](./packages/ui/docs/toolkit/CLI.md) — `init`, `doctor`, `report`, `canary`, `sync`
- [Contributing guide](./CONTRIBUTING.md) — workflow, commit conventions, review checklist
- [Contribution rules](./contributing/rules/) — dependencies, migration, styling, no-invention
- [Component specs](./.specs/) — source of truth for every component API

## License

MIT © Azion Technologies
