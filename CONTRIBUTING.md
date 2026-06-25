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
2. **Scaffold** — `/component-create <name>` writes the `.vue`, its local `package.json`, the `packages/webkit/package.json#exports` entry, and a minimal `.stories.js`. It will refuse to add props, events, or slots that are not in the spec.
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

## Commit convention

We use [Conventional Commits](https://www.conventionalcommits.org/). `semantic-release` parses commit messages to compute version bumps and changelogs, so the scope and type matter.

| Type | When | Bump |
|---|---|---|
| `feat` | New component, new prop/event/slot, new public export | minor |
| `fix` | Bug fix, accessibility correction, visual regression | patch |
| `hotfix` | Urgent production fix | patch |
| `chore` | Tooling, dependency bumps, internal cleanup | patch |
| `docs` | README, spec body, JSDoc | patch |
| `style` | Formatting / whitespace only | patch |
| `refactor` | Internal restructure with no API change | patch |
| `perf` | Performance improvement | patch |
| `test` | Test additions or changes | none |
| `ci` | CI/CD pipeline changes | none |
| `revert` | Reverting a prior commit | none |
| `!` after type or `BREAKING CHANGE:` footer | Removed/renamed prop, event, slot, or export | major |

### Message shape

The commit-analyzer regex in every `.releaserc` accepts these forms:

```text
[NO-ISSUE] fix(webkit): commit message
[ENG-1231] fix(webkit): commit message
fix(webkit): commit message
fix: commit message
```

- **Ticket prefix** is optional. Use `[NO-ISSUE]` when there is no tracking ticket, or `[<PROJECT-NUMBER>]` (e.g. `[ENG-1231]`) otherwise.
- **Scope** is the package name without the namespace: `webkit`, `theme`, `icons`.
- **Breaking changes** use either the `!` marker (`feat(webkit)!: …`) or a `BREAKING CHANGE:` footer.

Examples:

- `[ENG-1231] feat(webkit): add Dropdown component`
- `[NO-ISSUE] fix(theme): correct --ring-color for dark mode`
- `chore(icons): regenerate after source update`
- `feat(webkit)!: drop deprecated tone prop on Button`

Stay scoped: one package per commit when possible. Mixed-scope commits should use the broadest affected scope.

> Note: the analyzer also gates by file path. A commit must touch files under `packages/<scope>/` for that package's `semantic-release` workflow to consider it. A `fix(webkit): …` commit that only edits theme files will not trigger a webkit release.

### Local enforcement

A husky `commit-msg` hook runs `@commitlint/cli` against [`commitlint.config.js`](./commitlint.config.js), which mirrors the regex in every `.releaserc`. A malformed message is rejected at commit time with a pointer to the failing rule — you cannot accidentally land a commit that the release analyzer would silently drop.

The config also enforces:

- `type` must be one of: `feat`, `fix`, `hotfix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `ci`, `revert`. Every type is enumerated in each `.releaserc` `releaseRules`: the first eight produce a release (`feat` → minor, the rest → patch); `test`, `ci`, `revert` carry `release: false` for hygiene and produce no version bump. Breaking changes use the `!` marker or `BREAKING CHANGE:` footer and produce a `major` release.
- `type` and `scope` must be lower-case.
- `subject` cannot be empty.
- Header (full first line) cannot exceed 100 characters.

## Pull requests

- Title mirrors the lead commit (Conventional Commits).
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

Releases are automated by `semantic-release` on merge to `main`. There is no manual release step. Three workflows publish independently:

- [`package-icons.yml`](./.github/workflows/package-icons.yml) → `@aziontech/icons`
- [`package-theme.yml`](./.github/workflows/package-theme.yml) → `@aziontech/theme`
- [`package-webkit.yml`](./.github/workflows/package-webkit.yml) → `@aziontech/webkit`

If you need a merge that does not produce a release, use `chore:` or `docs:` (no version bump).

## Questions

Open a draft PR or a GitHub issue; tag a CODEOWNER from [`.github/CODEOWNERS`](./.github/CODEOWNERS).
