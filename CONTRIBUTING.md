# Contributing to Azion Webkit

Thanks for working on Webkit. This document covers how to propose changes that pass review and ship cleanly.

## Before you start

- Read the [README](./README.md) for repo layout and the consumer-facing API.
- Skim [`.claude/rules/`](./.claude/rules/) — these are non-negotiable:
  - [`dependencies.md`](./.claude/rules/dependencies.md) — no external positioning or animation libs.
  - [`styling.md`](./.claude/rules/styling.md) — classes on the root, no JS class presets.
  - [`migration.md`](./.claude/rules/migration.md) — never inherit, always rewrite.
  - [`no-invention.md`](./.claude/rules/no-invention.md) — the spec is the contract.

## Local setup

```bash
# Node >= 22.18.0, pnpm 10.x (corepack will install the pinned version)
pnpm install
pnpm storybook:dev
```

## The spec-driven pipeline

Every new component starts as a spec at `.specs/<name>.md`. The spec is the contract; the `.vue`, story, and exports are derived from it.

1. **Draft the spec** — `/spec-create <name>` writes `.specs/<name>.md` with `status: draft`. Review and flip to `status: approved`.
2. **Scaffold** — `/component-create <name>` writes the `.vue`, the `packages/webkit/package.json#exports` entry, and a minimal `.stories.js`. It will refuse to add props, events, or slots that are not in the spec.
3. **Verify** — `/component-verify <name>` re-runs spec compliance and validators without touching files.

The spec template lives at [`.specs/_template.md`](./.specs/_template.md). The Constraints block is verbatim by design — do not edit it.

### Editing an existing component

- Update the spec first; `status` must remain `approved` and the `checksum` will be recomputed by `spec-validate`.
- Re-run `/component-verify <name>` and the relevant `pnpm webkit:*` gates.

### Legacy components

Components in [`.claude/hooks/_lib/legacy-components.json`](./.claude/hooks/_lib/legacy-components.json) predate the pipeline. When migrating one under enforcement, rewrite the spec from scratch (see [`migration.md`](./.claude/rules/migration.md)) — do not paste from the legacy file.

## Quality gates

Before opening a PR, all of these must pass:

```bash
pnpm webkit:lint            # ESLint, max-warnings 0
pnpm webkit:lint:style      # Stylelint
pnpm webkit:type-check      # vue-tsc --noEmit
pnpm webkit:type-coverage   # type-coverage >= 95%
pnpm webkit:format:check    # Prettier
pnpm storybook:build        # Catches SFC compile errors invisible to vue-tsc
```

Or the aggregate:

```bash
pnpm governance             # lint + type-check + format:check + security:audit
```

The `governance` workflow runs on every push to `main` — its status is the badge at the top of the README.

## Testing

Webkit ships a co-located `*.test.ts` per component, run in **Vitest browser mode** (real Chromium — never jsdom). See [`.claude/rules/testing.md`](./.claude/rules/testing.md).

```bash
pnpm webkit:test                              # whole suite (headless Chromium)
pnpm --filter @aziontech/webkit test:ui       # interactive UI (headed browser)
pnpm --filter @aziontech/webkit test:coverage # v8 coverage report
```

The first run installs the browser: `pnpm --filter @aziontech/webkit exec playwright install chromium`.

If pnpm aborts with a deps-verify error (common when `node_modules` is symlinked, e.g. a git worktree), prefix the command:

```bash
PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm webkit:test
```

Tests never ship to npm — `packages/webkit/package.json#files` excludes them, asserted in CI by `pnpm pack:check`.

### Visual regression (Storybook test-runner)

The unit suite above runs on an **unstyled** DOM (no Tailwind) and owns behavior/structure/ARIA. Pixels are owned by the visual layer: `@storybook/test-runner` visits every story in the built Storybook, screenshots `#storybook-root` and compares against committed baselines (`jest-image-snapshot`). Config: [`apps/storybook/.storybook/test-runner.js`](./apps/storybook/.storybook/test-runner.js).

```bash
pnpm storybook:test:visual                    # build + serve dist + compare (one-shot)
pnpm --filter storybook run test:visual       # compare against a running `storybook:dev`
pnpm --filter storybook run test:visual:update# regenerate LOCAL baselines
```

Baselines are **per-platform** (font rasterization differs): `apps/storybook/.storybook/test-visual/__image_snapshots__/linux/` is the CI contract and is committed; `darwin/` is local-only and gitignored. To bootstrap or intentionally update the committed baselines, run the **Visual Regression @ Storybook** workflow manually with `update_baselines=true`, download the `visual-baselines-linux` artifact and commit its contents — never commit baselines generated on macOS. Failed comparisons write annotated diffs to `test-visual/__diff_output__/` (uploaded as a CI artifact).

Opt a story out of the snapshot (it is still visited for render errors) with `parameters: { visual: false }`.

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/). Merges to `main` are **squash merges**, and [release-please](https://github.com/googleapis/release-please) parses the squashed commit — the **PR title** — to compute version bumps and changelogs through its Release PR, so the scope and type matter.

| Type | When | Release |
|---|---|---|
| `feat` | New component, new prop/event/slot, new public export | minor |
| `fix` | Bug fix, accessibility correction, visual regression — anything that must ship (incl. urgent production fixes) | patch |
| `chore` | Tooling, dependency bumps, internal cleanup | none |
| `docs` | README, spec body, JSDoc | none |
| `style` | Formatting / whitespace only | none |
| `refactor` | Internal restructure with no API change | none |
| `perf` | Performance improvement (use `fix` if it must ship on its own) | none |
| `test` | Test additions or changes | none |
| `ci` | CI/CD pipeline changes | none |
| `revert` | Reverting a prior commit | none |
| `!` after type or `BREAKING CHANGE:` footer | Removed/renamed prop, event, slot, or export | major |

Types marked **none** never release on their own — they ride along in the next release cut by a `feat`/`fix`. Release-please cannot be configured to change this mapping; the full contract is [`.claude/rules/release-types.md`](./.claude/rules/release-types.md).

### Message shape

The commit parser accepts these forms:

```text
fix(webkit): [NO-ISSUE] commit message
fix(webkit): [ENG-1231] commit message
fix(webkit): commit message
fix: commit message
```

- **The header starts with the bare type.** A leading ticket tag (`[NO-ISSUE] fix(webkit): …` — the pre-2026-07 convention) is unparseable by release-please, so the merge would silently release **nothing**; commitlint rejects it (`header-no-leading-ticket`).
- **Ticket tag** is optional and lives at the start of the **subject**, right after the colon. Use `[NO-ISSUE]` when there is no tracking ticket, or `[<PROJECT>-<NUMBER>]` (e.g. `[ENG-1231]`) otherwise. A malformed tag (`[eng-123]`, or no text after it) is rejected (`subject-ticket-tag`). The tag is part of the subject, so it appears in changelogs.
- **Scope** is the package name without the namespace: `webkit`, `theme`, `icons`.
- **Breaking changes** use either the `!` marker (`feat(webkit)!: …`) or a `BREAKING CHANGE:` footer.

Examples:

- `feat(webkit): [ENG-1231] add Dropdown component`
- `fix(theme): [NO-ISSUE] correct --ring-color for dark mode`
- `chore(icons): regenerate after source update`
- `feat(webkit)!: drop deprecated tone prop on Button`

Stay scoped: one package per commit when possible. Mixed-scope commits should use the broadest affected scope.

> Note: release-please also gates by file path. A commit must touch files under `packages/<scope>/` to count toward that package's release. A `fix(webkit): …` commit that only edits theme files will not trigger a webkit release.

### Local enforcement

A husky `commit-msg` hook runs `@commitlint/cli` against [`commitlint.config.js`](./commitlint.config.js). A malformed message is rejected at commit time with a pointer to the failing rule. Because merges are squashed, keep the **PR title** commitlint-valid too — it is the commit release-please actually parses.

The config also enforces:

- The header **starts with the bare type** — its pattern now matches release-please's parser exactly. A leading `[TICKET]` tag is rejected with a pointer to the new form (`header-no-leading-ticket`), and a subject-leading tag must be well-formed `[NO-ISSUE]` / `[ABC-123]` followed by a space and text (`subject-ticket-tag`).
- `type` must be one of: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `ci`, `revert`. Only `feat` (minor) and `fix` (patch) produce a release; every other type is accepted for hygiene and produces **no** version bump on its own. Breaking changes use the `!` marker or `BREAKING CHANGE:` footer and produce a `major` release on any type. (`hotfix` was removed 2026-07-26 — release-please never released it; use `fix`.)
- `type` and `scope` must be lower-case.
- `subject` cannot be empty.
- Header (full first line) cannot exceed 100 characters.

## Pull requests

- Title mirrors the lead commit (Conventional Commits). Merges are squashed, so the **PR title is the commit** release-please parses — its type decides the release.
- Body explains the **why** — screenshots for visual changes, before/after for behavior changes.
- Link the spec (`.specs/<name>.md`) for component PRs.
- One feature per PR. Refactors and cleanups go in their own PRs.
- All CI checks green before requesting review.

## Code review expectations

Reviewers will look for:

1. **Spec compliance.** Every prop/event/slot in the `.vue` is in the spec. Nothing extra.
2. **Token usage.** No HEX literals, no raw Tailwind palette (`bg-blue-500`), no inline `@keyframes`. Tokens only — see [`.claude/rules/styling.md`](./.claude/rules/styling.md).
3. **No invented dependencies.** Imports resolve; no `floating-ui`, `popper`, `gsap`, `framer-motion`, etc.
4. **Accessibility.** Keyboard paths, focus rings, `motion-reduce:*` fallbacks for any motion.
5. **Storybook coverage.** The states listed in the spec each have a story.

## Reporting bugs

Open an [issue](https://github.com/aziontech/webkit/issues/new) with:

- Affected package and version (`@aziontech/webkit@x.y.z`).
- Vue version and bundler (Vite/webpack/etc.).
- Minimal reproduction — a Storybook story or a CodeSandbox is ideal.
- Expected vs. actual behavior.

## Releasing

Releases are automated by [release-please](https://github.com/googleapis/release-please) ([`release-please.yml`](./.github/workflows/release-please.yml)) — the Release PR model. Merging `feat` / `fix` / breaking commits to `main` creates or updates a pending **Release PR** (version bumps + changelogs); merging that Release PR creates the per-package tags and GitHub Releases, which trigger the publish workflows via `release: published`:

- [`package-icons.yml`](./.github/workflows/package-icons.yml) → `@aziontech/icons`
- [`package-theme.yml`](./.github/workflows/package-theme.yml) → `@aziontech/theme`
- [`package-webkit.yml`](./.github/workflows/package-webkit.yml) → `@aziontech/webkit`

There is no manual release step. If you need a merge that does not produce a release, use `chore:` or `docs:` (no version bump).

## Questions

Open a draft PR or a GitHub issue; tag a CODEOWNER from [`.github/CODEOWNERS`](./.github/CODEOWNERS).
