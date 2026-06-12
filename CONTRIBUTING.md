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
| `chore` | Tooling, dependencies, internal refactors | none |
| `docs` | README, spec body, JSDoc | none |
| `refactor` | Internal restructure with no API change | none |
| `BREAKING CHANGE:` (footer) | Removed/renamed prop, event, slot, or export | major |

Scope is the package name without the namespace:

- `feat(webkit): add Dropdown component`
- `fix(theme): correct --ring-color for dark mode`
- `chore(icons): regenerate after source update`
- `feat(webkit): drop deprecated tone prop on Button`
  `BREAKING CHANGE: Button no longer accepts tone; use kind instead.`

Stay scoped: one package per commit when possible. Mixed-scope commits should use the broadest affected scope.

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
