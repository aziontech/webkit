# Governance Pipeline Implementation

**Package:** @aziontech/webkit
**Framework:** Vue 3 + TypeScript
**CI/CD:** GitHub Actions
**Implemented:** 2026-04-13 · **Last refreshed:** 2026-07-28 (release-please model, current job set)

---

## Overview

This document details the implementation of the governance pipeline for the `@aziontech/webkit` Vue 3 component library. The pipeline enforces code quality, security, accessibility, and type safety standards on every commit and CI/CD run.

The construction standards themselves (props, styling, testing, …) are catalogued in [`STYLEGUIDE.md`](./STYLEGUIDE.md) and digested in [`GUIDELINES.md`](./GUIDELINES.md); the full process map is [`PROCESS.md`](./PROCESS.md). This document covers the **tooling**: what runs, where it runs, and why each piece exists.

---

## Table of Contents

1. [ESLint Configuration](#1-eslint-configuration)
2. [Stylelint Configuration](#2-stylelint-configuration)
3. [TypeScript Configuration](#3-typescript-configuration)
4. [Type Coverage](#4-type-coverage)
5. [Prettier Ignore](#5-prettier-ignore)
6. [Package Scripts](#6-package-scripts)
7. [Git Hooks](#7-git-hooks)
8. [GitHub Actions Workflow](#8-github-actions-workflow)
9. [Dependencies](#9-dependencies)

---

## 1. ESLint Configuration

**File:** root [`eslint.config.js`](../../../eslint.config.js) — the repo-wide flat config. `packages/webkit/eslint.config.js` is a one-line re-export of it, so running ESLint from the package resolves the exact same rule set.

### What Was Implemented

ESLint 9 flat config (`eslint.config.js`) with Vue 3 + TypeScript rules, migrated from the legacy `.eslintrc.*` format.

### Reasoning

| Rule/Feature                             | Reason                                                                                                                                                                                                                                                           |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ESLint 9 flat config**                 | ESLint 9+ requires the new `eslint.config.js` format. The legacy `.eslintrc.*` format is deprecated. This ensures forward compatibility.                                                                                                                         |
| **Hand-picked `vue/*` rules at `error`** | On top of `js.configs.recommended`, the config enables specific Vue rules (PascalCase component naming/casing, `no-v-html`, `require-default-prop`, `require-explicit-emits`, …) rather than spreading a preset — every enabled rule is deliberate and blocking. |
| **`@typescript-eslint`**                 | TypeScript-specific linting catches type errors at lint time rather than build time. `no-explicit-any` (error) prevents unsafe `any` usage that undermines type safety.                                                                                          |
| **`vue/no-v-html` (error)**              | Prevents XSS vulnerabilities. `v-html` allows arbitrary HTML injection which can lead to cross-site scripting attacks. Components should use text interpolation or sanitize HTML.                                                                                |
| **`vue/require-default-prop` (error)**   | Ensures all optional props have default values. This prevents `undefined` runtime errors and makes component behavior predictable. Required for zero warnings policy.                                                                                            |
| **`vue/require-explicit-emits` (error)** | Forces explicit declaration of emitted events via `defineEmits`. This improves component API documentation, enables IDE autocomplete, and catches typos in event names.                                                                                          |
| **`vuejs-accessibility` plugin**         | Vue-specific accessibility rules (not React's `jsx-a11y`). `alt-text`, `aria-props`, `aria-role`, `click-events-have-key-events` run at `error`. Critical for WCAG compliance.                                                                                   |
| **`simple-import-sort`**                 | Automatically sorts imports alphabetically. Prevents merge conflicts in teams, makes diffs cleaner, and improves code readability.                                                                                                                               |
| **`unused-imports`**                     | Removes unused imports during auto-fix. Dead imports increase bundle size and indicate incomplete refactoring.                                                                                                                                                   |
| **`import/no-duplicates`**               | Prevents importing the same module multiple times. Redundant imports can lead to initialization side effects running twice.                                                                                                                                      |
| **`no-console` (error)**                 | Prevents `console.log` in production code (only `console.warn` / `console.error` are allowed). Console statements can leak sensitive information and degrade performance.                                                                                        |
| **`no-debugger` (error)**                | Prevents `debugger` statements. These halt execution in production and should never be committed.                                                                                                                                                                |
| **`prefer-const` (error)**               | Enforces `const` for variables that are never reassigned. Signals intent clearly and prevents accidental reassignment.                                                                                                                                           |
| **`vue-eslint-parser`**                  | Parses `.vue` single-file components with `<script setup>` syntax. Required for Vue 3 Composition API support.                                                                                                                                                   |
| **`--max-warnings 0`**                   | Enforces zero warnings policy (set in the `lint` script). Warnings accumulate technical debt. By treating all warnings as errors, code quality is maintained consistently.                                                                                       |

### Zero Warnings Policy

All rules are set to `error` level. This enforces:

- No warnings pass silently
- Developers must fix issues immediately
- Code quality stays consistent over time
- Technical debt doesn't accumulate

---

## 2. Stylelint Configuration

**File:** root [`.stylelintrc.json`](../../../.stylelintrc.json) — the single repo-wide config (there is no per-package stylelint config).

### What Was Implemented

Stylelint configuration with SCSS support and Vue integration.

### Reasoning

| Rule/Feature                                                      | Reason                                                                                                                                                                                                       |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Stylelint setup**                                               | Component-local CSS is banned by the styling standard (styles live as Tailwind utilities on the root element), so the lintable CSS surface is deliberately small — but what exists is enforced from day one. |
| **`stylelint-config-standard-scss`**                              | SCSS-specific linting rules. Validates proper use of variables, mixins, functions, and nested syntax.                                                                                                        |
| **`stylelint-config-recommended-vue`**                            | Vue-specific CSS linting. Validates styles in `<style>` blocks of `.vue` files.                                                                                                                              |
| **`stylelint-order` plugin**                                      | Enforces alphabetical property ordering. Makes styles predictable and easier to scan. Reduces cognitive load when reviewing styles.                                                                          |
| **`selector-class-pattern`**                                      | Enforces `kebab-case` for CSS classes (`my-component`). Prevents inconsistent naming like `myComponent` or `MyComponent`. Matches Vue style guide recommendations.                                           |
| **`no-descending-specificity` (warn)**                            | Prevents specificity conflicts where later rules override earlier ones unexpectedly. Set to `warn` as this can be a design decision.                                                                         |
| **`declaration-block-no-duplicate-properties` (error)**           | Prevents accidental duplicate properties like `color: red; color: blue;`. Usually indicates copy-paste errors.                                                                                               |
| **`no-duplicate-selectors` (error)**                              | Prevents duplicate selectors in the same stylesheet. Indicates refactoring oversights.                                                                                                                       |
| **`property-no-vendor-prefix` / `value-no-vendor-prefix` (warn)** | Discourages manual vendor prefixes (`-webkit-`, `-moz-`). Autoprefixer (PostCSS) handles these automatically.                                                                                                |
| **`selector-max-id: 0`**                                          | Disallows ID selectors in CSS. Enforces component-scoped styles using classes. IDs create specificity issues and prevent reusability.                                                                        |
| **Tailwind at-rules allowed**                                     | `scss/at-rule-no-unknown` ignores Tailwind's at-rules (`source`, `theme`, `utility`, `custom-variant`, `plugin`, `reference`) so theme CSS lints cleanly.                                                    |

---

## 3. TypeScript Configuration

**Files:** root [`tsconfig.base.json`](../../../tsconfig.base.json) (shared strictness) + [`packages/webkit/tsconfig.json`](../tsconfig.json) (extends the base, adds declaration emit).

### What Was Implemented

Strict TypeScript shared across the monorepo, with the webkit package layering declaration-emit options on top.

### Reasoning

| Option                                                       | Where  | Reason                                                                                                                                                                                            |
| ------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`strict: true`**                                           | base   | Enables all strict type checking options.                                                                                                                                                         |
| **`noImplicitReturns: true`**                                | base   | Ensures all code paths return a value. Prevents functions that implicitly return `undefined` when a return type is expected. Catches missing return statements in branches.                       |
| **`noImplicitOverride: true`**                               | base   | Requires explicit `override` keyword when overriding inherited members. Prevents accidental overrides when base class methods change. Makes inheritance hierarchies clearer.                      |
| **`noUnusedLocals: true`**                                   | base   | Reports unused local variables. Indicates incomplete refactoring or dead code. Keeps codebase clean.                                                                                              |
| **`noUnusedParameters: true`**                               | base   | Reports unused function parameters. If a parameter is unused, it should be prefixed with `_` (e.g., `_event`) to indicate intentional. Prevents confusion about required vs. optional parameters. |
| **`noPropertyAccessFromIndexSignature: true`**               | webkit | Disallows accessing index signature properties with dot notation (`obj.property`). Requires bracket notation (`obj['property']`). Makes it explicit that the property is dynamically accessed.    |
| **`declaration` + `declarationMap` + `emitDeclarationOnly`** | webkit | The same tsconfig drives publish-time `.d.ts` emit (see [§8 — Build Job](#build-job-details)). CI validation runs `vue-tsc --noEmit`, so declarations are never built in dev or CI.               |

Test files (`*.test.ts`, `src/test/`) and Code Connect files (`*.figma.ts`) are excluded from the program — they are development artifacts, not part of the published type surface.

---

## 4. Type Coverage

**File:** [`packages/webkit/type-coverage.json`](../type-coverage.json)

### What Was Implemented

Type coverage configuration enforcing a 95% type safety threshold (the `type-coverage` script also passes `--at-least 95 --detail` explicitly).

### Reasoning

| Setting                                                                 | Reason                                                                                                                                                                                                         |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`atLeast: 95`**                                                       | Sets minimum type coverage to 95%. This means 95% of code must have explicit types rather than `any`. Balances strictness with pragmatism—allows 5% for complex third-party integrations or gradual migration. |
| **`strict: true`**                                                      | Enables strict type coverage checks. Counts only fully-typed code, not partially-typed.                                                                                                                        |
| **`detail: true`**                                                      | Provides detailed report showing which files/lines lack types. Helps developers understand exactly where to add types.                                                                                         |
| **`ignoreCatch: true`**                                                 | Ignores catch clause variables. TypeScript defaults catch variables to `any`, and typing them requires `unknown` with type guards. Too noisy for initial adoption.                                             |
| **`ignoreFiles: ["**/*.d.ts", "**/*.d.ts.map", "**/node_modules/**"]`** | Excludes declaration files (generated) and dependencies. Focus on project source code only.                                                                                                                    |

### Why Type Coverage Matters

- **Prevents `any` proliferation**: Without measurement, `any` usage spreads silently
- **Measurable metric**: Unlike "it feels typed", this gives concrete percentage
- **Gradual improvement**: Team can track progress over time (e.g., 85% → 90% → 95%)
- **Documentation**: Typed code is self-documenting

---

## 5. Prettier Ignore

**Files:** [`packages/webkit/.prettierignore`](../.prettierignore) + the root [`.prettierignore`](../../../.prettierignore)

### What Was Implemented

Prettier ignore files excluding generated/built files from formatting.

### Reasoning

| Pattern                     | Reason                                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`dist/`**                 | Build output shouldn't be formatted. Regenerated on each build anyway.                                                                                                                 |
| **`*.min.css`**             | Minified files are already processed. Formatting would break minification.                                                                                                             |
| **`node_modules/`**         | Third-party code. Not project source, shouldn't be modified.                                                                                                                           |
| **`*.d.ts`, `*.d.ts.map`**  | TypeScript declaration files are auto-generated by `vue-tsc`. Formatting them creates noise in diffs.                                                                                  |
| **`coverage/`**             | Test coverage reports are generated by test runners.                                                                                                                                   |
| **`storybook-static/`**     | Storybook static build output. Regenerated on each build.                                                                                                                              |
| **`catalog.json`**          | Generated by `scripts/build-catalog.mjs`; formatting a generated file would create drift against its generator.                                                                        |
| **`CHANGELOG.md`**          | Generated by release-please; never hand-formatted.                                                                                                                                     |
| **`lint-canaries/`** (root) | The canary fixtures are **deliberately** rule-breaking / mis-formatted and must keep failing their lints (see §8 — Lint Canary). A repo-wide `prettier --write` must never "fix" them. |

---

## 6. Package Scripts

**Files:** `/package.json` and `/packages/webkit/package.json`

### What Was Implemented

Comprehensive npm scripts for local development and CI/CD.

### Reasoning

#### Webkit Package Scripts — quality checks

| Script                                                    | Reason                                                                                                                   |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **`lint`**                                                | Runs ESLint with zero warnings policy (`--max-warnings 0`). Catches code quality issues before commit.                   |
| **`lint:fix`**                                            | Auto-fixes ESLint issues where possible. Saves developer time for formatting, import sorting, etc.                       |
| **`lint:style`**                                          | Runs Stylelint on CSS/SCSS/Vue files. Validates styles against standards.                                                |
| **`format`**                                              | Auto-formats all code with Prettier. Ensures consistent code style across team.                                          |
| **`format:check`**                                        | Checks formatting without modifying files. Used in CI to fail if code isn't formatted.                                   |
| **`type-check`**                                          | Runs `vue-tsc --noEmit`. Validates TypeScript types without generating declaration files. Faster than full build for CI. |
| **`type-coverage`**                                       | Reports type coverage percentage. Enforces 95% threshold. Gives measurable type safety metric.                           |
| **`test`** (+ `test:watch` / `test:coverage` / `test:ui`) | Vitest **browser mode** (Playwright Chromium) — the functional per-component suites required by the testing standard.    |

#### Webkit Package Scripts — governance gates

| Script              | Reason                                                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **`catalog:check`** | Rebuilds `catalog.json` and fails on any diff — the catalog can never drift from the exports map and specs.                            |
| **`size`**          | Bundle budget gate (`scripts/check-size.mjs`): builds each budgeted entry with Vite and compares gzipped output to `.size-limit.json`. |
| **`pack:check`**    | Fails if any `*.test.ts` / `src/test/**` file would ship in the npm tarball (publish safety).                                          |
| **`test:gate`**     | Fails if any root component lacks its co-located `<name>.test.ts` (test-existence gate; never grandfathered).                          |
| **`test:toolkit`**  | Unit tests for the adoption toolkit itself (ESLint rules, MCP, CLI, stylelint config).                                                 |
| **`authoring`**     | Construction-standard ratchet — no **new** authoring violations against the baseline (`authoring:update` re-baselines).                |
| **`doc-standards`** | Skill/agent doc-standards ratchet — no new out-of-standard `.claude` docs (`doc-standards:update` re-baselines).                       |
| **`smoke:consume`** | Scaffolds and builds a bare consumer app against the local package — proves `init` + a consumer build still work.                      |

#### Root Package Scripts

| Script               | Reason                                                                                                                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`prepare`**        | Runs `husky` to initialize Git hooks after `pnpm install`. Ensures hooks are set up on every machine.                                                                                                             |
| **`webkit:*`**       | Delegation scripts (`webkit:lint`, `webkit:type-check`, `webkit:format:check`, `webkit:test`, …) via `pnpm --filter webkit`, so any check runs from the repo root — these are the entry points CI calls.          |
| **`governance`**     | Unified command running all static checks: `webkit:lint` + `webkit:lint:style` + `webkit:format:check` + `webkit:type-check` + `webkit:type-coverage` + `security:audit`. Single command to reproduce CI locally. |
| **`security:audit`** | Runs plain **`pnpm audit`** — any severity fails (deliberately stricter than `--audit-level=high`). Accepted-risk overrides live in `pnpm-workspace.yaml`, not in a lowered threshold.                            |

### Design Decisions

1. **Separate commands vs. unified**:
   - Individual commands allow targeted fixes (e.g., just run `lint:fix`)
   - `governance` command provides one-stop validation for CI parity

2. **Root vs. package scripts**:
   - Root scripts use `pnpm --filter webkit` to delegate
   - Allows running governance from any directory in monorepo

---

## 7. Git Hooks

**Files:** `/.husky/pre-commit`, `/.husky/commit-msg`, `/package.json` (lint-staged config)

### What Was Implemented

Husky Git hooks: lint-staged on `pre-commit`, commitlint on `commit-msg`.

### Reasoning

| Aspect                          | Reason                                                                                                                                                                                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Husky setup**                 | Git hooks run automatically on `git commit`. Catches issues before they reach CI. Faster feedback loop than waiting for CI build.                                                                                                       |
| **lint-staged (`pre-commit`)**  | Only lints staged files (changed files in commit), not entire codebase. Dramatically faster than running full lint. Makes commits quick even in large codebases.                                                                        |
| **commitlint (`commit-msg`)**   | `commitlint --edit` validates the message against Conventional Commits with the repo's type enum. Since release-please computes releases from these types (squash-merged PR titles), an invalid type is a release bug, not a style nit. |
| **`--max-warnings 0` in hook**  | Enforces zero warnings policy in pre-commit. Developers must fix issues locally before pushing.                                                                                                                                         |
| **ESLint + Prettier together**  | ESLint fixes code quality, Prettier fixes formatting. Both run in sequence on staged `.js/.ts/.vue` files.                                                                                                                              |
| **Stylelint + Prettier on CSS** | Same dual approach for styles. Stylelint for rules, Prettier for formatting. Staged `.json/.md` files get Prettier alone.                                                                                                               |

### Performance Optimization

- **Staged files only**: lint-staged only processes files changed in the commit
- **Sequential execution**: ESLint → Prettier ensures fixes are formatted

### Do Not Skip Hooks

`git commit --no-verify` is **not** an accepted path in this repo (see the git-workflow rule): a commit that cannot pass commitlint is a commit with the wrong type, and a lint failure belongs fixed, not bypassed. CI re-runs every check anyway, so skipping only defers the failure.

---

## 8. GitHub Actions Workflow

**File:** [`/.github/workflows/governance.yml`](../../../.github/workflows/governance.yml)

### What Was Implemented

Comprehensive CI/CD pipeline with path-filtered gating, parallel execution, and sharded browser testing.

### Reasoning

#### Job Structure

| Job                  | Purpose                                                                                              | Runs                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **changes**          | `dorny/paths-filter` gate — computes `webkit` / `toolkit` / `tests` / `visual` / `canary` outputs    | always, first                         |
| **security**         | Dependency audit, secret detection, unused deps                                                      | `webkit` changes, parallel            |
| **lint-canary**      | Every deliberately-broken fixture in `lint-canaries/` must **still fail** its lint rule              | `canary` changes (lint configs moved) |
| **lint**             | ESLint (zero warnings), Stylelint, Prettier check                                                    | `webkit` changes, parallel            |
| **types**            | `vue-tsc --noEmit` + type coverage ≥ 95%                                                             | `webkit` changes, parallel            |
| **build**            | Publish-safety (`pack:check`) + bundle budget (`size`)                                               | after lint + types                    |
| **storybook**        | Storybook build verification                                                                         | after lint + types                    |
| **toolkit**          | Catalog drift, toolkit unit tests, authoring **ratchet**, test-existence gate, doc-standards ratchet | `toolkit` changes, parallel           |
| **smoke**            | Consumer smoke test — `init` + build a bare consumer app                                             | `visual`-scope changes                |
| **tests**            | **Vitest browser mode** (Playwright Chromium), 4 shards                                              | after lint + types                    |
| **visual**           | Storybook visual regression, 4 shards, diff artifacts uploaded on failure                            | after all build/test jobs             |
| **governance-check** | Summary gate ensuring all jobs passed (or cleanly skipped)                                           | `always()`, last                      |

#### Security Job Details

| Step                   | Reason                                                                                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **plain `pnpm audit`** | Checks for known vulnerabilities in npm dependencies. **Any severity fails** — the accepted-risk mechanism is explicit overrides in `pnpm-workspace.yaml`, never a lowered audit level. |
| **TruffleHog action**  | Scans the diff against the default branch for committed secrets (API keys, passwords, tokens), `--only-verified` to avoid false-positive noise.                                         |
| **depcheck**           | Detects unused dependencies in `package.json` (`--ignores="@types/*,eslint-*"`). Set to `continue-on-error: true` (informational).                                                      |

#### Lint Job Details

| Step               | Reason                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| **ESLint**         | Runs with `--max-warnings 0`. Enforces zero warnings policy in CI.         |
| **Stylelint**      | Validates CSS/SCSS in `.vue` files. Catches styling issues early.          |
| **Prettier check** | `--check` fails if files aren't formatted. Enforces consistent formatting. |

#### Lint Canary Job

The `lint-canaries/` fixtures each violate exactly one lint rule on purpose. The canary job runs them and fails if any fixture **stops** failing — catching a config regression (a rule accidentally disabled or weakened) that ordinary green builds would never surface. It triggers on changes to the lint configs themselves (`eslint.config.js`, `.stylelintrc.json`, `commitlint.config.js`, `.prettierrc.json`, …), the canaries, or the workflow.

#### Types Job Details

| Step                 | Reason                                                                               |
| -------------------- | ------------------------------------------------------------------------------------ |
| **TypeScript check** | `vue-tsc --noEmit` validates types without generating files. Faster than full build. |
| **Type coverage**    | Enforces 95% type safety threshold. Provides measurable type coverage.               |

#### Build Job Details

| Step                              | Reason                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Depends on lint + types**       | Only builds if linting and type checking pass. Prevents wasting CI time on broken code.                                                                                                                                                                                                                                                                                                                                                  |
| **Publish safety (`pack:check`)** | `npm pack --dry-run` must list **no** `*.test.ts` / `src/test/**` files — tests never ship to npm. `.d.ts` declarations are **not** built in this job: they are generated at publish time by the release workflow ([`package-webkit.yml`](../../../.github/workflows/package-webkit.yml) runs `vue-tsc --declaration --emitDeclarationOnly` immediately before `npm publish`, triggered by release-please's `release: published` event). |
| **Bundle budget (`size`)**        | Every budgeted export entry is compiled (Vite + plugin-vue, vue externalized) and its gzipped size compared against `.size-limit.json`. Budgets only ratchet down.                                                                                                                                                                                                                                                                       |

#### Tests Job Details (Vitest browser mode)

| Aspect                         | Reason                                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Real Chromium (Playwright)** | Focus, keyboard, layout, and `<Teleport>` behave for real — jsdom returns no-ops for exactly the behaviors that break in production. |
| **4 shards**                   | `vitest run --shard=N/4` in a matrix keeps wall-clock time flat as the suite grows.                                                  |
| **Playwright browser cache**   | `~/.cache/ms-playwright` keyed on the lockfile — skips the browser download on unchanged dependencies.                               |

#### Visual Job Details

| Aspect                        | Reason                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Runs after everything**     | Visual regression is the most expensive signal; it only runs once security/lint/types/build/storybook/tests are green.             |
| **4 shards**                  | Same wall-clock strategy as the tests job.                                                                                         |
| **Diff artifacts on failure** | The `__diff_output__` images upload as workflow artifacts (7-day retention) so a failure is reviewable without re-running locally. |

#### Storybook Job Details

| Step                        | Reason                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Build Storybook**         | Verifies documentation builds without errors. Catches Storybook-specific issues (missing stories, broken imports). |
| **Depends on lint + types** | Only builds Storybook if code is valid.                                                                            |

#### Governance Gate Job

| Aspect             | Reason                                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`if: always()`** | Runs even if previous jobs failed. Needed to report overall status.                                                                                                        |
| **Status check**   | Verifies all eleven upstream jobs succeeded (or were cleanly skipped by the path filter). Fails the PR if any job failed — the one required check branch protection needs. |

#### Trigger Strategy

| Trigger                     | Reason                                                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pull requests to `main`** | Catches issues in PRs before merge (`main` is the only integration branch — see the git-workflow rule).                                                                 |
| **Pushes to `main`**        | Double-checks even after PR merge. Catches direct commits (should be rare).                                                                                             |
| **`changes` gating job**    | Path filters short-circuit downstream jobs when nothing relevant moved, while the required checks stay registered (skipped counts as passed in the gate).               |
| **Concurrency group**       | A new push to a PR cancels the superseded run (8 Playwright-sharded jobs are expensive); pushes to `main` queue instead so every landed commit keeps a complete status. |

#### Performance Optimizations

1. **Parallel execution**: security, lint, types, toolkit run simultaneously
2. **Conditional builds**: build/storybook/tests/visual only run if upstream jobs pass
3. **`cache: 'pnpm'`** + Playwright browser cache → faster installs
4. **`--frozen-lockfile`**: Ensures reproducible builds. Fails if lockfile is outdated.
5. **Sharding (×4)** for the two browser-based suites
6. **PR concurrency cancellation** — superseded runs stop immediately

---

## 9. Dependencies

### What Was Installed

All governance dependencies installed at root level (`pnpm add -D -w`):

| Package                               | Version | Purpose                          |
| ------------------------------------- | ------- | -------------------------------- |
| **eslint**                            | ^9.39.3 | Core linter (v9 for flat config) |
| **@eslint/js**                        | ^9.x    | ESLint recommended config        |
| **eslint-plugin-vue**                 | ^9      | Vue 3 linting rules              |
| **@typescript-eslint/parser**         | ^8.58.2 | TypeScript parser for ESLint     |
| **@typescript-eslint/eslint-plugin**  | ^8.58.2 | TypeScript linting rules         |
| **@vue/eslint-config-typescript**     | ^14.7.0 | Vue + TypeScript preset config   |
| **eslint-plugin-import**              | ^2.32.0 | Import/export validation         |
| **eslint-plugin-simple-import-sort**  | ^13.0.0 | Alphabetical import sorting      |
| **eslint-plugin-unused-imports**      | ^4.4.1  | Remove unused imports            |
| **eslint-plugin-vuejs-accessibility** | ^2.5.0  | Vue a11y linting                 |
| **eslint-import-resolver-typescript** | ^4.4.4  | Resolve TypeScript imports       |
| **vue-eslint-parser**                 | ^10.4.0 | Parse `.vue` files               |
| **stylelint**                         | ^17.7.0 | CSS/SCSS linter                  |
| **stylelint-config-standard-scss**    | ^17.0.0 | SCSS standard rules              |
| **stylelint-config-recommended-vue**  | ^1.6.1  | Vue CSS rules                    |
| **stylelint-order**                   | ^8.1.1  | CSS property ordering            |
| **prettier**                          | ^3.9.4  | Formatting                       |
| **@commitlint/cli**                   | ^21.0.2 | Conventional Commit validation   |
| **husky**                             | ^9.1.7  | Git hooks                        |
| **lint-staged**                       | ^16.4.0 | Lint only staged files           |
| **type-coverage**                     | ^2.29.7 | Type coverage measurement        |

### Why Root Level Installation

1. **Monorepo structure**: Other packages may adopt governance later
2. **Version consistency**: Single version across all packages
3. **Deduplication**: pnpm shares dependencies across workspace
4. **Simpler CI**: One installation step for all tools

---

## Migration Notes

### ESLint 9 Flat Config

The migration from `.eslintrc.*` to `eslint.config.js` was required because:

- ESLint 9 dropped support for legacy config format
- Flat config is the new standard
- Better support for ESM modules
- Clearer plugin configuration

### Release Automation (2026-07)

The release pipeline moved from semantic-release (per-package `.releaserc` files) to **release-please** (Release-PR model): merging `feat`/`fix` PRs updates a pending Release PR; merging the Release PR tags versions and triggers the `package-*.yml` publish workflows, which build the `.d.ts` declarations and publish to npm. The type→bump mapping this implies is documented in `CONTRIBUTING.md` and enforced identically across commitlint, `release-please-config.json`, and the PR flows.

### Known Issues After Implementation (historical)

The initial ESLint run identified issues that needed manual fixing — missing prop defaults, undefined globals, console statements, missing return types, accessibility violations. These were expected (the pipeline started catching issues that were previously undetected) and have since been fixed; today the same classes of issue are blocked at commit and in CI.

---

## Testing the Implementation

### Local Testing

```bash
# Run the full static governance suite (mirrors the lint/types/security jobs)
pnpm run governance

# Individual checks
pnpm run webkit:lint
pnpm run webkit:type-check
pnpm run webkit:format:check
pnpm run security:audit

# Functional tests (Vitest browser mode)
pnpm run webkit:test

# Auto-fix issues
pnpm run webkit:lint:fix
pnpm run webkit:format
```

### Pre-commit Hook Test

```bash
# Make a change
echo "console.log('test')" >> packages/webkit/src/test.js
git add packages/webkit/src/test.js
git commit -m "test: pre-commit hook"

# pre-commit runs ESLint + Prettier on the staged file (fails on no-console);
# commit-msg validates the message with commitlint
```

### CI/CD Validation

1. Create a PR touching `packages/webkit/`
2. Navigate to Actions tab in GitHub
3. Verify the jobs run:
   - changes (first — path-filter gate)
   - security, lint, types, toolkit (✅ parallel)
   - lint-canary (when lint configs / canaries moved)
   - build, storybook, tests ×4 (⏳ after lint + types)
   - smoke (when visual-scope paths moved)
   - visual ×4 (⏳ after all build/test jobs)
   - governance-check (⏳ after all)

---

## Future Improvements

### Shipped Since First Write

| Improvement                 | Where it landed                                                      |
| --------------------------- | -------------------------------------------------------------------- |
| **Bundle size limits**      | `size` gate in the build job (`check-size.mjs` + `.size-limit.json`) |
| **Visual regression tests** | the sharded `visual` job                                             |
| **Functional test gate**    | the sharded `tests` job + `test:gate` existence check                |
| **Lint-config regression**  | the `lint-canary` job                                                |

### Still Open

| Improvement                | Benefit                         | Effort |
| -------------------------- | ------------------------------- | ------ |
| **ESLint cache**           | Faster subsequent lint runs     | Low    |
| **Prettier cache**         | Faster subsequent format checks | Low    |
| **Dead code detection**    | Find unused exports             | Medium |
| **Performance benchmarks** | Track bundle size over time     | Medium |

---

## Support & Troubleshooting

### Common Issues

#### ESLint Cache Corruption

```bash
rm -rf node_modules/.cache/eslint
```

#### Husky Not Running

```bash
pnpm run prepare  # Re-initialize hooks
```

#### Type Coverage Too Low

```bash
pnpm run webkit:type-coverage  # See detailed report
```

#### CI Job Failing Locally

```bash
pnpm run governance  # Reproduce locally before pushing
```

---

## Conclusion

This governance pipeline establishes a foundation for code quality, security, and maintainability. It catches issues early (pre-commit), provides fast feedback (parallel, path-filtered CI jobs), and enforces standards consistently (zero warnings policy, ratchets that only tighten).

The pipeline is **strict by default** but **configurable**—adjust rules as needed based on team feedback and project requirements.

**Key Benefits:**

✅ **Security**: Dependency audits (any severity), secret detection  
✅ **Quality**: Linting, formatting, type safety, functional browser tests  
✅ **Accessibility**: Vue-specific a11y rules  
✅ **Consistency**: Automated formatting, import sorting, lint canaries  
✅ **Performance**: Parallel CI jobs, path filtering, sharding, staged file linting  
✅ **Developer Experience**: Auto-fixing, clear error messages, one-command CI parity  
✅ **Maintainability**: Type coverage metrics, bundle budgets, no unused code

---

**Implemented by:** Claude Code
**Implemented:** 2026-04-13 · **Last refreshed:** 2026-07-28
**Package:** @aziontech/webkit
**Framework:** Vue 3 + TypeScript + Composition API
