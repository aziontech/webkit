# Contributing to Azion UI

Thanks for working on Azion UI. This document covers how to propose changes that pass review and ship cleanly.

## Before you start

- Read the [README](./README.md) for repo layout and the consumer-facing API.
- Owner decisions are tracked in [`contributing/docs/DECISIONS.md`](./contributing/docs/DECISIONS.md), one row each with its status and where it lives; a change that records or implements one adds or updates its row in the same change.
- Skim [`contributing/rules/`](./contributing/rules/) — these are non-negotiable:
  - [`dependencies.md`](./contributing/rules/dependencies.md) — no external positioning or animation libs.
  - [`styling.md`](./contributing/rules/styling.md) — classes on the root, no JS class presets.
  - [`migration.md`](./contributing/rules/migration.md) — never inherit, always rewrite.
  - [`no-invention.md`](./contributing/rules/no-invention.md) — the spec is the contract.

## Where things live

Development material and the material Azion UI ships to apps never mix:

- **Ships to apps** (in the npm package): `packages/*`, plus the AI bundle at the root — `skills/`,
  `rules/` (`scope: general`), `agents/` (the app agents) and `fragments/` (the `AGENTS.md` block).
- **For Azion UI development only**: `contributing/` (agents, commands, hooks, contributor rules and skills
  such as the mandatory `ui-craft` review, and the process docs `PROCESS.md`, `DOC_LINTS.md`,
  `OVERVIEW_LINT.md`, `OVERVIEW_TESTS.md`, `GOVERNANCE_IMPLEMENTATION.md`), `.specs/`,
  `apps/docs/` (docs site), `apps/demos/`, `apps/visual/` (styled visual suite), `lint-canaries/`
  and `.github/`.

Agents of any vendor start at the root [`AGENTS.md`](./AGENTS.md).

## Local setup

```bash
# Node >= 24, pnpm 11.x (corepack will install the pinned version)
pnpm install
pnpm dev:docs      # components, blocks, foundations from the files
pnpm dev:demos     # routed flows assembled from blocks
```

## Component lifecycle

Every Azion UI component goes through the same four stages: **Add**, **Change**, **Deprecate** and
**Remove**. Each stage has one path, and the machine gates make it the only path through CI. The
spec at `.specs/<name>.md` is the contract at every stage: it changes first, and the code follows.

### Add

An issue from **New component** (`.github/ISSUE_TEMPLATE/new-component.yml`) → `/component-new <issue>`
→ spec as `draft` → review by a second agent (`spec-reviewer`), which flips it to `approved` with a
checksum → build (component, test, examples) → machine gates → `ui-craft` review → usage check →
PR. Each step stops the run on failure. The steps, owners and commands are in
[Adding a component or block (AI flow)](#adding-a-component-or-block-ai-flow). When the PR is
built, the spec moves to `implemented`.

### Preview and GA

Every new component and block ships as **preview**; the owner marks it **GA** by hand. The field
is `stability`, separate from the spec `status` (which tracks the authoring pipeline):

| Where                           | Preview                  | GA                               |
| ------------------------------- | ------------------------ | -------------------------------- |
| Component: `.specs/<name>.md`   | `stability: preview`     | `stability: ga`, or no field     |
| Block: `blocks/<id>/block.json` | `"stability": "preview"` | `"stability": "ga"`, or no field |

- **Preview**: the API (props, events, slots, models, parts, exports) may still change in a minor
  release. Name the change in the commit body; no `!`, no `BREAKING CHANGE:`, no codemod and no
  deprecation cycle. `api-diff` and `check:migrations` exempt the part. The catalog, the llms
  pages, the MCP (`stability: "preview"` with a note) and the docs site (a Preview tag) mark it, so
  agents and readers know the API is not frozen yet.
- **GA**: the API is frozen. Change it under [Change](#change) and remove it only through
  [Deprecate](#deprecate) and [Remove](#remove). Every part that existed before 2026-11-23 is GA.
- **Promote** a part with one PR titled `feat(ui): promote <Name> to GA`: set `stability: ga`
  in its spec (or block.json) and rebuild the catalog and llms pages. Only the owner approves it.
  A part's sub-components follow their root.
- **Never demote** GA to preview: `api-diff` fails, because it would unfreeze a stable API.

### Change

An issue from **Change a component** (`.github/ISSUE_TEMPLATE/change-component.yml`), or
**Visual bug** (`visual-bug.yml`) for a look that is wrong today. The change runs the same flow
from step 2, with the existing spec:

- **Non-breaking** (a new prop, event, slot, state or example; a fix). Edit the spec first, then
  the code. Bump `spec_version` for any API change, and move the spec to `template: 2`. The
  spec stays `implemented`; recompute its `checksum` after the edit:
  ```bash
  node -e "import('./contributing/hooks/lib/spec.mjs').then((m) => console.log(m.bodyChecksum(m.parseSpecFile('.specs/<name>.md').body)))"
  ```
  The PR title is `feat(ui): …` for an addition (minor) or `fix(ui): …` for a fix (patch).
- **Breaking** (a removed or renamed prop, event, slot, value or export; a changed default or
  payload). Put `!` in the PR title (`feat(ui)!: …`): merges are squashed, so the title is the
  commit release-please reads, and it cuts a major. Ship a codemod entry in
  `packages/ui/src/cli/migrations/` (the `azion-ui migrate` map), or, when no codemod can do it,
  a new line naming the component in the migration guide (`packages/ui/MIGRATION_V6.md` for
  the current major). Bump `spec_version` too. Prefer a deprecation cycle (below) to a direct
  break.

### Deprecate

Follow [`contributing/rules/deprecation.md`](./contributing/rules/deprecation.md). 6.0 was the one clean
break: it removed every old name outright, and apps migrate once with `MIGRATION_V6.md` and
`azion-ui migrate`. From 6.0 on, a removal goes through this cycle:

1. Mark the part `@deprecated` in its JSDoc (a prop) or on `defineOptions` (a component), naming
   the **replacement** and the **removal version**:
   ```ts
   /** @deprecated since 6.2 — use `variant` instead. Removed in 7.0. */
   ```
2. For a whole component, set `deprecated: true` and `replaced_by: <name>` in the spec frontmatter.
   `build:catalog` carries the flag to `catalog.json`, the MCP steers agents off it, and the
   `azion-ui/no-deprecated-component` lint flags consumers that still import it.
3. Keep the part working, unchanged, for at least one major cycle. Marking is a `feat` or `fix`,
   never a major.

### Remove

Only after one major cycle in the deprecated state. Removal is a major: `!` in the PR title and a
`BREAKING CHANGE:` footer. Remove everything together in one PR: the spec, the `.vue` and its
test, the examples, the `package.json#exports` entries (and `-root`), the `.size-limit.json`
entry and the visual baselines; regenerate the catalog and the llms pages; ship the codemod entry
or the migration note that moves consumers to the replacement.

### What must ship with a component

| Ships with the component                                                                                                                            | Checked by                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Spec `.specs/<name>.md`, `approved` then `implemented`, checksum matching the body                                                                  | `spec-integrity` (checksum and status, in CI), `spec-status` (no draft), `spec-template`, `complete` (status) |
| The `.vue`, matching the spec 1-to-1                                                                                                                | hooks (`enforce-spec-exists`, `validate-spec-compliance`), `authoring`                                        |
| `<name>.test.ts` next to the root `.vue`                                                                                                            | `tests` (`check:tests`) and the `enforce-test-exists` hook                                                    |
| Examples in `packages/ui/examples/<name>/`, at least one per example the spec lists, the first `default.vue`                                        | `complete`, `naming` (`example-file`)                                                                         |
| `package.json#exports` entry in the typed shape (`pnpm --filter @aziontech/ui build:exports`), plus `<name>-root` for a compound                    | `exports`, `complete`                                                                                         |
| `.size-limit.json` entry with the spec's `## Performance` budget                                                                                    | `complete`; `size` measures it                                                                                |
| Every built-in string of the spec's `## Internationalization` as a key in `src/locales/en.ts`, `pt-BR.ts` and `es.ts`                               | `toolkit` (`test/standards/i18n-catalogs.test.mjs`)                                                           |
| An owner in `src/eslint-plugin/owners.json` for each native control or ARIA widget role it renders                                                  | `quality-lint` (`azion-ui/no-unowned-element`)                                                                |
| Files, functions and props within the [`CODE_QUALITY.md`](./contributing/docs/CODE_QUALITY.md) § 3.1 limits; no new look-alike pair at 35 % or more | `maintainability`, `look-alikes`, `duplication`, `assertions`                                                 |
| Regenerated `catalog.json`, `catalog/` and `llms/` (`build:catalog` writes all three)                                                               | `catalog`, `llms`                                                                                             |
| The visual baseline of the first example (`apps/visual/baselines/examples/<name>/<stem>--light-1280.png`, from `/baselines-regenerate`)             | `complete`; the `visual` job compares light and dark                                                          |

Two more gates hold the Change and Remove stages to their rules:

- `api-diff` compares the public API (exports, props, events, slots, models, sub-components)
  with the PR's base branch. A breaking change fails without `!` in the PR title and a
  migration: a codemod entry, or a new line naming the component in
  `packages/ui/MIGRATION_V<N>.md`. Any API change, breaking or not, fails without a
  `spec_version` bump in that component's spec. A preview part is exempt from the `!` and the
  migration (see [Preview and GA](#preview-and-ga)); GA → preview fails. Run it locally with
  `PR_TITLE='feat(ui)!: …' pnpm --filter @aziontech/ui run check:api-diff`.
- The PR title must pass commitlint; CI checks it.
- A `locked` spec passes CI but blocks edits to its component: bump `spec_version`, set it back
  to `approved`, re-validate, then edit. A shipped component's spec never goes back to `draft`.
- The bundle budget only goes down. A PR that raises a limit in `.size-limit.json` needs a
  `Budget-raise: <entry> <old> → <new> (measured <n>): <reason>` line per raised entry, in its body or in `packages/ui/docs/reviews/size-budgets-*.md`.

### For designers

You do not need to write code or run anything. You file an issue, and you review images.

1. **File the right form** (GitHub, **New issue**):
   - **New component**: a component that does not exist yet. Paste the Figma frame in the
     **Figma URL** field when there is one; the spec is then drafted from the design.
   - **Change a component**: a new option, state or look for an existing component. Say whether
     current screens would change without being edited (breaking); "unsure" is fine.
   - **Visual bug**: a component that does not look the way it was designed. Give the page, the
     theme, the window width and a screenshot.
2. **What happens next.** An agent picks up the issue, writes or updates the spec, builds the
   change, runs every gate and opens a pull request that links the issue. If it cannot go on, it
   asks its question on the issue.
3. **Where to review.**
   - The **Screenshots** section of the PR: light, dark, right to left, 320 px and 1920 px.
   - The docs site of the branch: the component page and each example, in light and dark. Run
     `pnpm dev:docs` on the branch, or ask on the PR for the pages you want to see; a hosted
     preview per PR is not set up yet.
   - The visual baselines. When the PR changes them, its checks include **Visual baseline
     review**: open the job summary and download `visual-baseline-review`, a page with every
     changed screenshot before and after, side by side. When a comparison fails, the summary of
     the failed shard links the Playwright report with the expected, actual and diff images.
4. **What approval means.** Approving the PR says the change matches the design in both themes and
   at every width the screenshots cover, and that every changed screenshot is intended. Ask for
   changes in a PR comment; the agent fixes them and pushes. Nobody edits the code by hand.

## Adding a component or block (AI flow)

Every component and block made from now on is built by agents through one flow, from a request to
a pull request. The machine gates make a correct component the only path through CI; the head of
design opens the request and approves the merge, and nobody edits the code by hand in between.

1. **Request.** Open an issue from **New component** or **New block**
   (`.github/ISSUE_TEMPLATE/`): intent, benchmark links (Cloudscape `index.html.md`, shadcn page),
   where it is used, surface (`app` / `site` / `docs`), acceptance criteria.
2. **Run the flow.** An agent runs `/component-new <issue>` (`contributing/commands/component-new.md`) or
   `/block-new <issue>` (`contributing/commands/block-new.md`). Each step stops the run on
   failure:

   | Step | What happens                                                                                                                            | Owner                             |
   | ---- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
   | 1    | Read the issue                                                                                                                          | orchestrator                      |
   | 2    | Research the benchmarks; check the catalog for reuse (`reuse-audit`, MCP `search_components` / `search_blocks`, `catalog.json#aliases`) | orchestrator, `reuse-auditor`     |
   | 3    | Spec as `draft` (`spec-create`, template 2) or, for a block, the block brief                                                            | `spec-creator`                    |
   | 4    | Review by a second agent with a fixed checklist; approval flips the spec to `approved` with a checksum                                  | `spec-reviewer`, `spec-validator` |
   | 5    | Build: component, test, examples (`packages/ui/examples/<name>/`) — or `block.json` + `.vue` + `variants/`                              | `/component-create` sub-agents    |
   | 6    | Machine gates (below)                                                                                                                   | orchestrator                      |
   | 7    | `ui-craft` review on the component, its examples and every block that uses it                                                           | orchestrator                      |
   | 8    | Usage check: a fresh agent session must pick the new piece through the MCP                                                              | `check-usage.mjs`                 |
   | 9    | PR from `.github/pull_request_template.md`: gate table, `ui-craft` report, usage report, screenshots                                    | `/pr-open`                        |

3. **Review.** The head of design approves the PR; a rejection goes back to step 3 or 5 with the
   comments, never to a human fix.

**Fixed usage tasks.** `packages/ui/scripts/usage-tasks.json` holds intent-only tasks a product
team would write (a token with an expiry time, a maintenance window, a phone number, cache settings,
resource tags, a deployments list, a sign-in code) and the component a fresh agent must reach for.
Run each before a release with `node scripts/check-usage.mjs --task <id>` (or the Usage check
workflow with `task`); `--list-tasks` prints them. Each run is a paid agent session, so they are
not part of CI. A task that fails means a skill, the search or a block does not lead to the
component: fix that, not the prompt.

**Machine gates.** One local runner prints the table the PR pastes:

```bash
pnpm --filter @aziontech/ui run gates            # all fast gates, in order, pass/fail table
pnpm --filter @aziontech/ui run gates -- --only naming,catalog --bail
```

The list of gates is `GATES` in
[`packages/ui/scripts/run-gates.mjs`](./packages/ui/scripts/run-gates.mjs); read it there
rather than here. In short: the generated files in sync (catalog, llms, runtime `.d.ts`, typed
exports), naming, migrations and the public API diff, the marketing inventory, blocks, the examples'
consumer lint, cited names, the spec status, integrity and template, the authoring and authoring-docs
ratchets, Do / Don't docs Markdown, a test per component, the bundle budget, `complete` (with the
size ratchet), look-alikes, duplication, maintainability, type assertions, `lint:quality`, the hook
and toolkit tests (`test:toolkit` also builds the icon font and fails when an official Azion product
or Solution has no `az az-<name>` icon, and checks that every locale catalog has every key). From the
repository root, with the same commands as CI, it also runs the MCP, theme and icons package tests and
the icons manifest, `test:docs`, Stylelint, the lint canaries, the tests TypeScript check
(`typecheck:ui:tests`), the Prettier check (`check:ui:format`), knip (`check:unused`),
`check:versions`, `check:spelling` and the workflow linters. The Husky `pre-push` hook runs the gates
with `--bail`, so a push cannot skip them; set `AZION_UI_GATES_DONE=1` for one push when you have just
run them yourself. The `toolkit` job of
`.github/workflows/governance.yml` runs the same commands on **every** PR, except `check:size`, which
runs in the `build` job; the lint, type, size, Vitest browser (including
`src/test/copyable-sfcs.test.ts`, which mounts every block and example) jobs run when
`packages/ui` changes; the docs/demos build and the styled visual job run when `packages/` or
`apps/docs`, `apps/demos`, `apps/visual` change.

What runs only in CI is listed, with the reason, in `CI_ONLY` in
`packages/ui/test/standards/run-gates.test.mjs`: the docs type check, `check:pack`, the audit, the docs and
demos builds, the consumer-app checks, and the browser and visual suites. That test fails when CI
gains a step that is neither a gate nor listed there.

**Spec template 2.** New specs carry `template: 2` and four more sections: `Internationalization`,
`Right-to-left`, `Responsive` and `Performance`. `check:spec-template`, `spec-validate` and the
`enforce-spec-exists` hook require them on template-2 specs and on every spec created on or after
2026-11-12; the specs that predate it stay valid.

**Usage check (opt-in, paid).** Step 8 proves an agent that knows nothing about the new piece
finds it:

```bash
pnpm --filter @aziontech/ui run check:usage -- date-picker "Let users pick the start and end of a billing period" --report usage-report.md
pnpm --filter @aziontech/ui run check:usage -- auth/auth-sign-in "A sign-in screen for the console" --dry-run
```

It packs the three packages, creates a clean Vite + Vue app in a temp dir, runs
`npx @aziontech/ui init --yes`, points the app's `.mcp.json` at the packed MCP server (`@aziontech/ui-mcp`), and runs
`claude -p "<prompt>" --permission-mode acceptEdits --allowedTools <list> --max-turns 40
--output-format json --mcp-config .mcp.json --strict-mcp-config` there; the list is
`USAGE_ALLOWED_TOOLS` in `scripts/check-usage.mjs` (the file tools, the `azion-ui` MCP server and
`npx @aziontech/ui`), so the session never runs with permissions skipped. It passes when a generated `src/**/*.vue`
imports the component (for a block: at least 80 % of the components its primary SFC imports) and
`azion-ui doctor` passes. It needs the `claude` CLI and an API key and costs one agent session, so
it is not in the PR pipeline: run it locally or through the **Usage check** workflow
(`.github/workflows/usage-check.yml`, manual dispatch, `ANTHROPIC_API_KEY` secret). `--dry-run`
only resolves the target and prints the plan.

**Changing, deprecating or removing a component**: see [Component lifecycle](#component-lifecycle).

## The spec-driven pipeline

Every new component starts as a spec at `.specs/<name>.md`. The spec is the contract; the `.vue`, examples, and exports are derived from it. These are the commands the AI flow above calls in steps 3 to 5.

1. **Draft the spec** — `/spec-create <name>` writes `.specs/<name>.md` with `status: draft`. Review and flip to `status: approved`.
2. **Scaffold** — `/component-create <name>` writes the `.vue`, the `packages/ui/package.json#exports` entry, and the examples in `packages/ui/examples/<name>/`. It will refuse to add props, events, or slots that are not in the spec.
3. **Verify** — `/component-verify <name>` re-runs spec compliance and validators without touching files.

The spec template lives at [`.specs/_template.md`](./.specs/_template.md). The Constraints block is verbatim by design — do not edit it.

### Editing an existing component

Spec first, then code; a shipped spec stays `implemented`. The steps, including the `checksum` and
`spec_version` bump, are in [Component lifecycle, Change](#change). Then re-run
`/component-verify <name>`.

### Legacy components

Components in [`contributing/hooks/lib/legacy-components.json`](./contributing/hooks/lib/legacy-components.json) predate the pipeline. When migrating one under enforcement, rewrite the spec from scratch (see [`migration.md`](./contributing/rules/migration.md)) — do not paste from the legacy file.

## What to update when Azion UI changes

You only write the source. `build:catalog` and the package's `prepack` generate what AI agents read
(`catalog.json`, its `blocks`, the packaged `skills/` and `rules/`), and CI fails the PR when the
source and the generated files disagree. Nobody rewrites the AI files by hand.

| When you…                                         | You write                                                                                                               | Generated                                      | CI gate                                                                |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| Create or change a component or a section         | `.specs/<name>.md` (with Purpose, When to use, When NOT to use), the `.vue` and its examples                            | `catalog.json` imports, with docs and examples | `check:catalog` (fails on a missing doc section), hooks                |
| Create or change a block in `packages/ui/blocks/` | `block.json` (`intents` in English and pt-BR, `skills`, `files`), the `.vue`, `sample.ts`, `variants/`, `guidelines.md` | `catalog.json` `blocks`                        | `check:blocks` (G1)                                                    |
| Rename, deprecate or remove a component           | The spec, with `deprecated: true` / `replaced_by`                                                                       | The catalog                                    | `cited-names` (G2)                                                     |
| Create or change a skill or a rule                | `skills/<name>/SKILL.md` or `rules/<name>.md` at the repo root                                                          | The copy in the package (`prepack`)            | `cited-names` (G2), `authoring-docs`, `docs-markdown`, invariant tests |
| Change a token                                    | `packages/theme`                                                                                                        | Tokens in the catalog                          | `validate-tokens`                                                      |
| Open a new spec                                   | The spec in `status: draft`, `template: 2`, only on your branch                                                         | —                                              | `spec-status` (G3): no draft lands on `main`; `check:spec-template`    |
| Release a version                                 | Nothing                                                                                                                 | The release, by release-please                 | —                                                                      |

After any of these, run `pnpm --filter @aziontech/ui build:catalog` and commit `catalog.json`,
`catalog/` and `llms/` (the same script writes the llms pages). After adding or moving an export, run
`pnpm --filter @aziontech/ui build:exports` first: it writes the typed `{ "types", "default" }`
shape and `typesVersions` that the `exports` gate checks.
A block's SFC must pass the consumer lint; legacy findings are frozen in
`packages/ui/scripts/blocks-baseline.json` and can only go down
(`pnpm --filter @aziontech/ui run check:blocks --update` after fixing some). A block also
follows the data contract (`contributing/commands/block-new.md`, "The data contract"): typed props in,
events out, sample records in `sample.ts` (listed in `block.json` `files`), and variants that
import the primary instead of copying it. Blocks not yet on it are frozen in
`packages/ui/scripts/blocks-data-baseline.json`, which the same `--update` shrinks.

## Quality gates

Before opening a PR, all of these must pass:

```bash
pnpm lint:ui            # ESLint, max-warnings 0
pnpm lint:ui:style      # Stylelint
pnpm typecheck:ui      # vue-tsc --noEmit
pnpm check:ui:type-coverage   # type-coverage >= 95%
pnpm check:ui:format    # Prettier
pnpm --filter @aziontech/ui test:ssr   # renders every block and example (SFC compile errors invisible to vue-tsc)
pnpm build:docs             # the docs site, every route prerendered
```

Or the aggregate:

```bash
pnpm gates             # lint + Stylelint + format check + every typecheck + type coverage + audit
```

The `governance` workflow runs on every push to `main` — its status is the badge at the top of the README.

The `complete` gate (`pnpm --filter @aziontech/ui run check:complete`) fails when a root component lacks an export (or a `-root` export for an `index.ts` compound), a `.size-limit.json` entry, its examples, a visual baseline for its first example, or still has a spec in `status: approved`; current debt lives in `packages/ui/scripts/complete-baseline.json`, which only shrinks. `check:size-ratchet` fails a PR that raises a size limit unless each raised entry has its own `Budget-raise: <name> <old> → <new> (measured <n>): <reason>` line, in the PR body or in `packages/ui/docs/reviews/size-budgets-*.md`.

## Testing

Azion UI ships a co-located `*.test.ts` per component, run in **Vitest browser mode** (real Chromium — never jsdom). See [`contributing/rules/testing.md`](./contributing/rules/testing.md).

```bash
pnpm test:browser-webkit                              # whole suite (headless Chromium)
pnpm --filter @aziontech/ui test:ui       # interactive UI (headed browser)
pnpm --filter @aziontech/ui test:coverage # v8 coverage report
```

The first run installs the browser: `pnpm --filter @aziontech/ui exec playwright install chromium`.

If pnpm aborts with a deps-verify error (common when `node_modules` is symlinked, e.g. a git worktree), prefix the command:

```bash
PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm test:browser-webkit
```

Tests never ship to npm — `packages/ui/package.json#files` excludes them, asserted in CI by `pnpm check:pack`.

A test that fails for a known reason (a pre-existing failure, or a flake that passes alone) is
listed in [`contributing/docs/KNOWN_FAILURES.md`](./contributing/docs/KNOWN_FAILURES.md) with how to re-run
it. Check there before treating a red test as your regression, and add or remove the row in the
commit that finds or fixes it.

### Visual regression (styled, Playwright)

The unit suite above runs on an **unstyled** DOM (no Tailwind) and owns behavior/structure/ARIA.
Pixels are owned by [`apps/visual`](./apps/visual/README.md): Playwright serves the built docs
site and demos and screenshots them **with the real theme CSS** — the first example of every
component (`/frame/example/<dir>/<file>`) in light and dark at 1280 px and light at 390 px, the primary
state of every block (`/frame/block/<id>/<state>`) in light and dark at 1280 px and dark at 390 px, every
state of the AI blocks (light, dark, 320 px, right to left), every demo route (plus the demo flows
end to end) and the geometry checks in `tests/geometry.spec.ts`.

```bash
pnpm build:docs && pnpm build:demos
pnpm test:visual             # compare with apps/visual/baselines
```

**Add an example and you are done**: the docs page and its visual test follow from
`packages/ui/examples/<name>/`, and a new block from `packages/ui/blocks/`. The only manual
step is the baseline. Baselines are committed and are valid only when taken in
`mcr.microsoft.com/playwright:v1.62.0-noble` (the image the CI `visual` job runs in): dispatch
`.github/workflows/visual-baselines.yml` with `update_baselines=true`
(`pnpm update:baselines`), review the `visual-baselines` artifact and commit it
(`/baselines-regenerate`). Failed comparisons upload the Playwright report (with diffs) as an artifact.

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/). Merges to `main` are **squash merges**, and [release-please](https://github.com/googleapis/release-please) parses the squashed commit — the **PR title** — to compute version bumps and changelogs through its Release PR, so the scope and type matter.

| Type                                        | When                                                                                                           | Release |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------- |
| `feat`                                      | New component, new prop/event/slot, new public export                                                          | minor   |
| `fix`                                       | Bug fix, accessibility correction, visual regression — anything that must ship (incl. urgent production fixes) | patch   |
| `chore`                                     | Tooling, dependency bumps, internal cleanup                                                                    | none    |
| `docs`                                      | README, spec body, JSDoc                                                                                       | none    |
| `style`                                     | Formatting / whitespace only                                                                                   | none    |
| `refactor`                                  | Internal restructure with no API change                                                                        | none    |
| `perf`                                      | Performance improvement (use `fix` if it must ship on its own)                                                 | none    |
| `test`                                      | Test additions or changes                                                                                      | none    |
| `ci`                                        | CI/CD pipeline changes                                                                                         | none    |
| `revert`                                    | Reverting a prior commit                                                                                       | none    |
| `!` after type or `BREAKING CHANGE:` footer | Removed/renamed prop, event, slot, or export                                                                   | major   |

Types marked **none** never release on their own — they ride along in the next release cut by a `feat`/`fix`. Release-please cannot be configured to change this mapping; the full contract is [`contributing/rules/release-types.md`](./contributing/rules/release-types.md).

### Alert shape

The commit parser accepts these forms:

```text
fix(ui): [ENG-1231] commit message
fix(ui): commit message
fix: commit message
```

- **The header starts with the bare type.** A leading ticket tag (`[NO-ISSUE] fix(ui): …` — the pre-2026-07 convention) is unparseable by release-please, so the merge would silently release **nothing**; commitlint rejects it (`header-no-leading-ticket`).
- **Ticket tag** — only when a tracking ticket exists: `[<PROJECT>-<NUMBER>]` (e.g. `[ENG-1231]`) at the start of the **subject**, right after the colon. **No ticket → no tag** — never write `[NO-ISSUE]`; it is dead characters in the 100-char budget and in changelogs, and commitlint rejects it (`subject-ticket-tag`, which also rejects malformed tags like `[eng-123]`). The tag is part of the subject, so it appears in changelogs.
- **Scope** is the package name without the namespace: `ui`, `theme`, `icons`.
- **Breaking changes** use either the `!` marker (`feat(ui)!: …`) or a `BREAKING CHANGE:` footer.

Examples:

- `feat(ui): [ENG-1231] add DropdownMenu component`
- `fix(theme): correct --ring-color for dark mode`
- `chore(icons): regenerate after source update`
- `feat(ui)!: drop deprecated tone prop on Button`

Stay scoped: one package per commit when possible. Mixed-scope commits should use the broadest affected scope.

> Note: release-please also gates by file path. A commit must touch files under `packages/<scope>/` to count toward that package's release. A `fix(ui): …` commit that only edits theme files will not trigger an Azion UI release.

### Local enforcement

A husky `commit-msg` hook runs `@commitlint/cli` against [`commitlint.config.js`](./commitlint.config.js). A malformed message is rejected at commit time with a pointer to the failing rule. Because merges are squashed, keep the **PR title** commitlint-valid too — it is the commit release-please actually parses.

The config also enforces:

- The header **starts with the bare type** — its pattern now matches release-please's parser exactly. A leading `[TICKET]` tag is rejected with a pointer to the new form (`header-no-leading-ticket`), and a subject-leading tag must be a well-formed real ticket (`[ABC-123]` + space + text); `[NO-ISSUE]` is rejected — omit the tag instead (`subject-ticket-tag`).
- `type` must be one of: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `ci`, `revert`. Only `feat` (minor) and `fix` (patch) produce a release; every other type is accepted for hygiene and produces **no** version bump on its own. Breaking changes use the `!` marker or `BREAKING CHANGE:` footer and produce a `major` release on any type. (`hotfix` was removed 2026-07-26 — release-please never released it; use `fix`.)
- `type` and `scope` must be lower-case.
- `subject` cannot be empty.
- Header (full first line) cannot exceed 100 characters.

### Signed commits

Every commit that lands on `main` must carry a **verified signature**. The repository ruleset (`Protected branchs`) enforces it server-side, so an unsigned commit makes a PR unmergeable even when it is approved and every check is green — GitHub reports the merge as blocked with no failing gate to point at.

Commits **GitHub** creates for you are already signed with its own key: web-UI edits, the **Update branch** button, and the squash commit produced on merge. Commits you create locally are signed only if you configure signing, so this is a one-time setup on every machine you commit from.

#### One-time setup (SSH signing)

SSH signing reuses the key you already push with, so it is the shortest path. It needs **git 2.34+** (`git --version`):

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

Then register that **same public key a second time** on GitHub, under [SSH and GPG keys](https://github.com/settings/keys) → **New SSH key** → **Key type: `Signing Key`**. An authentication key does not verify signatures: without the signing-key entry your commits are signed but arrive as _Unverified_, which the ruleset rejects exactly like an unsigned one. Registering the key re-verifies existing commits retroactively, so a branch you pushed before adding it does not need to be re-signed. The commit e-mail (`git config user.email`) must be a verified e-mail on your GitHub account.

> **macOS:** on git < 2.34, `gpg.format ssh` fails hard — `error: unsupported value for gpg.format: ssh` on _every_ git command, including `git status`. The usual cause is a stale `/usr/local/bin/git` (from the git-scm installer) shadowing the newer `/usr/bin/git` in `PATH`. Diagnose with `git --version` and `which -a git`; fix by installing a current git (`brew install git`) or removing the stale symlink.

#### Checking your own signatures locally

Verifying locally is a separate concern from GitHub's verification: `git log --show-signature` needs to be told which keys to trust, or it reports `gpg.ssh.allowedSignersFile needs to be configured and exist` and prints `No signature` for a commit that is in fact signed. GitHub never reads this file (it verifies against the key you registered), so the step is optional — but without it you cannot inspect your own signatures:

```bash
mkdir -p ~/.config/git
echo "$(git config user.email) $(cat ~/.ssh/id_ed25519.pub)" >> ~/.config/git/allowed_signers
git config --global gpg.ssh.allowedSignersFile ~/.config/git/allowed_signers
```

The check that needs no configuration at all is the commit object itself — a signed commit carries a `gpgsig` header:

```bash
git cat-file commit HEAD | head -6
```

Pushed commits show a **Verified** badge on GitHub once the signing key is registered.

#### Recovering a branch that already has unsigned commits

A signature is part of the commit object, so an existing branch has to be rewritten. Closing and reopening the PR, or opening a new PR from the same commits, changes nothing.

```bash
# one commit
git commit --amend --no-edit -S

# several commits — re-signs every commit on top of main
git rebase --exec 'git commit --amend --no-edit -S' origin/main

git push --force-with-lease
```

Two consequences worth planning for: the rewrite **dismisses existing approvals** (the ruleset sets `dismiss_stale_reviews_on_push`), so the PR needs review again; and `--no-verify` does not help here — it skips commitlint without producing a signature.

## Pull requests

- Title mirrors the lead commit (Conventional Commits). Merges are squashed, so the **PR title is the commit** release-please parses — its type decides the release.
- Body explains the **why** — screenshots for visual changes, before/after for behavior changes.
- Link the spec (`.specs/<name>.md`) for component PRs.
- One feature per PR. Refactors and cleanups go in their own PRs.
- All CI checks green before requesting review.

## Code review expectations

Reviewers will look for:

1. **Spec compliance.** Every prop/event/slot in the `.vue` is in the spec. Nothing extra.
2. **Token usage.** No HEX literals, no raw Tailwind palette (`bg-blue-500`), no inline `@keyframes`. Tokens only — see [`contributing/rules/styling.md`](./contributing/rules/styling.md).
3. **No invented dependencies.** Imports resolve; no `floating-ui`, `popper`, `gsap`, `framer-motion`, etc.
4. **Accessibility.** Keyboard paths, focus rings, `motion-reduce:*` fallbacks for any motion.
5. **Example coverage.** The states listed in the spec each appear in an example.

## Reporting bugs

Open an [issue](https://github.com/aziontech/webkit/issues/new) with:

- Affected package and version (`@aziontech/ui@x.y.z`).
- Vue version and bundler (Vite/webpack/etc.).
- Minimal reproduction — an example SFC (like those in `packages/ui/examples/`) or a CodeSandbox is ideal.
- Expected vs. actual behavior.

## Releasing

Releases are automated by [release-please](https://github.com/googleapis/release-please) ([`release-please.yml`](./.github/workflows/release-please.yml)) — the Release PR model. Merging `feat` / `fix` / breaking commits to `main` creates or updates a pending **Release PR** (version bumps + changelogs); merging that Release PR creates the release. The four packages share one version: one Release PR bumps all four `package.json` files and the root [`CHANGELOG.md`](./CHANGELOG.md) together, and merging it creates one `vX.Y.Z` tag and one GitHub Release. The same job then dispatches the four publish workflows from `main` with that tag (a release published by hand fires them through `release: published`):

- [`publish-icons.yml`](./.github/workflows/publish-icons.yml) → `@aziontech/icons`
- [`publish-theme.yml`](./.github/workflows/publish-theme.yml) → `@aziontech/theme`
- [`publish-ui.yml`](./.github/workflows/publish-ui.yml) → `@aziontech/ui`
- [`publish-ui-mcp.yml`](./.github/workflows/publish-ui-mcp.yml) → `@aziontech/ui-mcp`

Each of them calls one shared workflow, [`release-package.yml`](./.github/workflows/release-package.yml), which runs in the `npm` GitHub environment, so it waits for a required reviewer to approve the deployment before it gets an npm token. A publish run only starts from `main` or from a release tag of its own package, and it refuses a tag whose commit is not on `main`. It packs the tarball once, writes an SBOM of what a consumer installs (Syft, SPDX and CycloneDX), stops on a high or critical vulnerability (Grype), signs the tarball (Cosign, keyless), publishes that exact tarball with npm provenance, and attaches the SBOM, the signature bundle and `SHA256SUMS` to the GitHub Release.

[`security.yml`](./.github/workflows/security.yml) runs the Azion security scan on every pull request to `main`, on `main` and every week: Gitleaks over the full history, osv-scanner over the lockfiles and Semgrep. A reviewed Gitleaks finding goes in `.gitleaksignore`, which `@aziontech/security-office` owns. The repository follows the Azion Engineering Playbook compliance checks. The one waiver, in `.azion-compliance.yml`, covers the per-package tags made before the switch to one version (`@aziontech/ui@5.13.0` and older), which stay as they are; every new tag is `vX.Y.Z`. `release-please-config.json` sets `last-release-sha` to the 5.13.0 release commit so the first shared changelog starts there: move it to the last 5.x release commit if `main` releases again before 6.0 merges, and delete it once `v6.0.0` is out. Report a vulnerability as described in [`SECURITY.md`](./SECURITY.md).

There is no manual release step. If you need a merge that does not produce a release, use `chore:` or `docs:` (no version bump).

## Questions

Open a draft PR or a GitHub issue; tag a code owner from [`CODEOWNERS`](./CODEOWNERS).
