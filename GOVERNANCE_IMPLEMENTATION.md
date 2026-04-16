# Governance Pipeline Implementation

**Date:** 2026-04-13
**Package:** @aziontech/webkit
**Framework:** Vue 3 + TypeScript
**CI/CD:** GitHub Actions

---

## Overview

This document details the implementation of a comprehensive governance pipeline for the `@aziontech/webkit` Vue 3 component library. The pipeline enforces code quality, security, accessibility, and type safety standards on every commit and CI/CD run.

---

## Table of Contents

1. [ESLint Configuration](#1-eslint-configuration)
2. [Stylelint Configuration](#2-stylelint-configuration)
3. [TypeScript Configuration](#3-typescript-configuration)
4. [Type Coverage](#4-type-coverage)
5. [Prettier Ignore](#5-prettier-ignore)
6. [Package Scripts](#6-package-scripts)
7. [Pre-commit Hooks](#7-pre-commit-hooks)
8. [GitHub Actions Workflow](#8-github-actions-workflow)
9. [Dependencies](#9-dependencies)

---

## 1. ESLint Configuration

**File:** `/packages/webkit/eslint.config.js`

### What Was Implemented

Migrated from `.eslintrc.*` to ESLint 9 flat config format (`eslint.config.js`) with comprehensive Vue 3 + TypeScript rules.

### Reasoning

| Rule/Feature | Reason |
|-------------|--------|
| **ESLint 9 flat config** | ESLint 9+ requires the new `eslint.config.js` format. The legacy `.eslintrc.*` format is deprecated and will be removed in future versions. This ensures forward compatibility. |
| **`vue/vue3-recommended`** | Provides Vue 3 Composition API-specific rules. Upgraded from `essential` to `recommended` for stricter enforcement of Vue best practices (e.g., proper lifecycle hooks, template syntax). |
| **`@typescript-eslint`** | TypeScript-specific linting catches type errors at lint time rather than build time. Rules like `no-explicit-any` prevent unsafe `any` usage that undermines type safety. |
| **`vue/no-v-html` (error)** | Prevents XSS vulnerabilities. `v-html` allows arbitrary HTML injection which can lead to cross-site scripting attacks. Components should use text interpolation or sanitize HTML. |
| **`vue/require-default-prop` (error)** | Ensures all optional props have default values. This prevents `undefined` runtime errors and makes component behavior predictable. Required for zero warnings policy. |
| **`vue/require-explicit-emits` (error)** | Forces explicit declaration of emitted events via `defineEmits`. This improves component API documentation, enables IDE autocomplete, and catches typos in event names. |
| **`vuejs-accessibility` plugin** | Vue-specific accessibility rules (not React's `jsx-a11y`). Catches a11y violations like missing alt text, improper ARIA attributes, and click handlers without keyboard support. Critical for WCAG compliance. |
| **`simple-import-sort`** | Automatically sorts imports alphabetically. Prevents merge conflicts in teams, makes diffs cleaner, and improves code readability. |
| **`unused-imports`** | Removes unused imports during auto-fix. Dead imports increase bundle size and indicate incomplete refactoring. |
| **`import/no-duplicates`** | Prevents importing the same module multiple times. Redundant imports can lead to initialization side effects running twice. |
| **`no-console` (error)** | Prevents `console.log` statements in production code. Console statements can leak sensitive information and degrade performance. Developers should use proper logging libraries or remove debug code. |
| **`no-debugger` (error)** | Prevents `debugger` statements. These halt execution in production and should never be committed. |
| **`prefer-const` (error)** | Enforces `const` for variables that are never reassigned. Signals intent clearly and prevents accidental reassignment. |
| **`vue-eslint-parser`** | Parses `.vue` single-file components with `<script setup>` syntax. Required for Vue 3 Composition API support. |
| **`--max-warnings 0`** | Enforces zero warnings policy. Warnings accumulate technical debt. By treating all warnings as errors, code quality is maintained consistently. |

### Zero Warnings Policy

All rules are set to `error` level. This enforces:
- No warnings pass silently
- Developers must fix issues immediately
- Code quality stays consistent over time
- Technical debt doesn't accumulate

---

## 2. Stylelint Configuration

**File:** `/packages/webkit/.stylelintrc.json`

### What Was Implemented

Stylelint configuration with SCSS support and Vue integration.

### Reasoning

| Rule/Feature | Reason |
|-------------|--------|
| **Stylelint setup** | Although current CSS usage is minimal (`country-flags.css` only), this future-proofs the codebase. As the component library grows, CSS rules will be enforced from day one. |
| **`stylelint-config-standard-scss`** | SCSS-specific linting rules. Validates proper use of variables, mixins, functions, and nested syntax. |
| **`stylelint-config-recommended-vue`** | Vue-specific CSS linting. Validates styles in `<style>` blocks of `.vue` files. |
| **`stylelint-order` plugin** | Enforces alphabetical property ordering. Makes styles predictable and easier to scan. Reduces cognitive load when reviewing styles. |
| **`selector-class-pattern`** | Enforces `kebab-case` for CSS classes (`my-component`). Prevents inconsistent naming like `myComponent` or `MyComponent`. Matches Vue style guide recommendations. |
| **`no-descending-specificity` (warn)** | Prevents specificity conflicts where later rules override earlier ones unexpectedly. Set to `warn` initially as this can be a design decision. |
| **`declaration-block-no-duplicate-properties` (error)** | Prevents accidental duplicate properties like `color: red; color: blue;`. Usually indicates copy-paste errors. |
| **`no-duplicate-selectors` (error)** | Prevents duplicate selectors in the same stylesheet. Indicates refactoring oversights. |
| **`property-no-vendor-prefix` (warn)** | Discourages manual vendor prefixes (`-webkit-`, `-moz-`). Autoprefixer (PostCSS) should handle these automatically. |
| **`selector-max-id: 0`** | Disallows ID selectors in CSS. Enforces component-scoped styles using classes. IDs create specificity issues and prevent reusability. |

---

## 3. TypeScript Configuration

**File:** `/packages/webkit/tsconfig.json`

### What Was Implemented

Enhanced TypeScript strictness with additional compiler options.

### Reasoning

| Option | Reason |
|--------|--------|
| **`noImplicitReturns: true`** | Ensures all code paths return a value. Prevents functions that implicitly return `undefined` when a return type is expected. Catches missing return statements in branches. |
| **`noImplicitOverride: true`** | Requires explicit `override` keyword when overriding inherited members. Prevents accidental overrides when base class methods change. Makes inheritance hierarchies clearer. |
| **`noPropertyAccessFromIndexSignature: true`** | Disallows accessing index signature properties with dot notation (`obj.property`). Requires bracket notation (`obj['property']`). Makes it explicit that the property is dynamically accessed. |
| **`noUnusedLocals: true`** | Reports unused local variables. Indicates incomplete refactoring or dead code. Keeps codebase clean. |
| **`noUnusedParameters: true`** | Reports unused function parameters. If a parameter is unused, it should be prefixed with `_` (e.g., `_event`) to indicate intentional. Prevents confusion about required vs. optional parameters. |
| **`strict: true` (existing)** | Enables all strict type checking options. Already present, but now supplemented with additional checks above. |

---

## 4. Type Coverage

**File:** `/packages/webkit/type-coverage.json`

### What Was Implemented

Type coverage configuration enforcing 95% type safety threshold.

### Reasoning

| Setting | Reason |
|---------|--------|
| **`atLeast: 95`** | Sets minimum type coverage to 95%. This means 95% of code must have explicit types rather than `any`. Balances strictness with pragmatism—allows 5% for complex third-party integrations or gradual migration. |
| **`strict: true`** | Enables strict type coverage checks. Counts only fully-typed code, not partially-typed. |
| **`detail: true`** | Provides detailed report showing which files/lines lack types. Helps developers understand exactly where to add types. |
| **`ignoreCatch: true`** | Ignores catch clause variables. TypeScript defaults catch variables to `any`, and typing them requires `unknown` with type guards. Too noisy for initial adoption. |
| **`ignoreFiles: ["**/*.d.ts", "**/node_modules/**"]`** | Excludes declaration files and dependencies. Focus on project source code only. |

### Why Type Coverage Matters

- **Prevents `any` proliferation**: Without measurement, `any` usage spreads silently
- **Measurable metric**: Unlike "it feels typed", this gives concrete percentage
- **Gradual improvement**: Team can track progress over time (e.g., 85% → 90% → 95%)
- **Documentation**: Typed code is self-documenting

---

## 5. Prettier Ignore

**File:** `/packages/webkit/.prettierignore`

### What Was Implemented

Prettier ignore file to exclude generated/built files from formatting.

### Reasoning

| Pattern | Reason |
|---------|--------|
| **`dist/`** | Build output shouldn't be formatted. Regenerated on each build anyway. |
| **`*.min.css`** | Minified files are already processed. Formatting would break minification. |
| **`node_modules/`** | Third-party code. Not project source, shouldn't be modified. |
| **`*.d.ts`, `*.d.ts.map`** | TypeScript declaration files are auto-generated by `vue-tsc`. Formatting them creates noise in diffs. |
| **`coverage/`** | Test coverage reports are generated by test runners. |
| **`storybook-static/`** | Storybook static build output. Regenerated on each build. |

---

## 6. Package Scripts

**Files:** `/package.json` and `/packages/webkit/package.json`

### What Was Implemented

Comprehensive npm scripts for local development and CI/CD.

### Reasoning

#### Webkit Package Scripts

| Script | Reason |
|--------|--------|
| **`lint`** | Runs ESLint with zero warnings policy (`--max-warnings 0`). Catches code quality issues before commit. |
| **`lint:fix`** | Auto-fixes ESLint issues where possible. Saves developer time for formatting, import sorting, etc. |
| **`lint:style`** | Runs Stylelint on CSS/SCSS/Vue files. Validates styles against standards. |
| **`format`** | Auto-formats all code with Prettier. Ensures consistent code style across team. |
| **`format:check`** | Checks formatting without modifying files. Used in CI to fail if code isn't formatted. |
| **`type-check`** | Runs `vue-tsc --noEmit`. Validates TypeScript types without generating declaration files. Faster than full build for CI. |
| **`type-coverage`** | Reports type coverage percentage. Enforces 95% threshold. Gives measurable type safety metric. |

#### Root Package Scripts

| Script | Reason |
|--------|--------|
| **`prepare`** | Runs `husky` to initialize Git hooks after `pnpm install`. Ensures hooks are set up on every machine. |
| **`governance`** | Unified command running all checks: `lint`, `type-check`, `format:check`, `security:audit`. Single command for full validation. |
| **`security:audit`** | Runs `pnpm audit --audit-level=high`. Checks for known vulnerabilities in dependencies. |

### Design Decisions

1. **Separate commands vs. unified**:
   - Individual commands allow targeted fixes (e.g., just run `lint:fix`)
   - `governance` command provides one-stop validation for CI

2. **Root vs. package scripts**:
   - Root scripts use `pnpm --filter webkit` to delegate
   - Allows running governance from any directory in monorepo

---

## 7. Pre-commit Hooks

**Files:** `/.husky/pre-commit`, `/package.json` (lint-staged config)

### What Was Implemented

Husky Git hooks with lint-staged configuration.

### Reasoning

| Aspect | Reason |
|--------|--------|
| **Husky setup** | Git hooks run automatically on `git commit`. Catches issues before they reach CI. Faster feedback loop than waiting for CI build. |
| **lint-staged** | Only lints staged files (changed files in commit), not entire codebase. Dramatically faster than running full lint. Makes commits quick even in large codebases. |
| **`--max-warnings 0` in hook** | Enforces zero warnings policy in pre-commit. Developers must fix issues locally before pushing. |
| **ESLint + Prettier together** | ESLint fixes code quality, Prettier fixes formatting. Both run in sequence on staged files. |
| **Stylelint + Prettier on CSS** | Same dual approach for styles. Stylelint for rules, Prettier for formatting. |

### Performance Optimization

- **Staged files only**: lint-staged only processes files changed in the commit
- **Cache support**: ESLint and Prettier support `--cache` flag (not used yet, can be added)
- **Sequential execution**: ESLint → Prettier ensures fixes are formatted

### Skip Hooks (Emergency)

```bash
git commit --no-verify -m "emergency fix"
```

Use sparingly—only for genuine emergencies.

---

## 8. GitHub Actions Workflow

**File:** `/.github/workflows/governance.yml`

### What Was Implemented

Comprehensive CI/CD pipeline with parallel job execution.

### Reasoning

#### Job Structure

| Job | Purpose | Parallel? |
|-----|---------|-----------|
| **security** | Dependency audit, secret detection, unused deps | ✅ Yes |
| **lint** | ESLint, Stylelint, Prettier checks | ✅ Yes |
| **types** | TypeScript check, type coverage | ✅ Yes |
| **build** | Type declarations, pack dry run | ❌ After lint+types |
| **storybook** | Storybook build verification | ❌ After lint+types |
| **governance-check** | Summary gate ensuring all jobs passed | ❌ After all |

#### Security Job Details

| Step | Reason |
|------|--------|
| **`pnpm audit --audit-level=high`** | Checks for known vulnerabilities in npm dependencies. `high` level catches critical security issues. |
| **Gitleaks action** | Scans codebase for accidentally committed secrets (API keys, passwords, tokens). Prevents credential leaks. |
| **depcheck** | Detects unused dependencies in `package.json`. Reduces bundle size and attack surface. Set to `continue-on-error: true` initially (informational). |

#### Lint Job Details

| Step | Reason |
|------|--------|
| **ESLint** | Runs with `--max-warnings 0`. Enforces zero warnings policy in CI. |
| **Stylelint** | Validates CSS/SCSS in `.vue` files. Catches styling issues early. |
| **Prettier check** | `--check` fails if files aren't formatted. Enforces consistent formatting. |

#### Types Job Details

| Step | Reason |
|------|--------|
| **TypeScript check** | `vue-tsc --noEmit` validates types without generating files. Faster than full build. |
| **Type coverage** | Enforces 95% type safety threshold. Provides measurable type coverage. |

#### Build Job Details

| Step | Reason |
|------|--------|
| **Depends on lint + types** | Only builds if linting and type checking pass. Prevents wasting CI time on broken code. |
| **Build type declarations** | `vue-tsc --declaration --emitDeclarationOnly`. Generates `.d.ts` files for TypeScript consumers. |
| **Pack dry run** | Validates package can be published. Catches packaging issues early. |

#### Storybook Job Details

| Step | Reason |
|------|--------|
| **Build Storybook** | Verifies documentation builds without errors. Catches Storybook-specific issues (missing stories, broken imports). |
| **Depends on lint + types** | Only builds Storybook if code is valid. |

#### Governance Gate Job

| Aspect | Reason |
|--------|--------|
| **`if: always()`** | Runs even if previous jobs failed. Needed to report overall status. |
| **Status check** | Verifies security, lint, types, and build all succeeded. Fails the PR if any job failed. |

#### Trigger Strategy

| Trigger | Reason |
|---------|--------|
| **Pull requests to main** | Catches issues in PRs before merge. Prevents broken code on main. |
| **Pushes to main** | Double-checks even after PR merge. Catches direct commits to main (should be rare). |
| **Path filter: `packages/webkit/**`** | Only runs when webkit package changes. Saves CI resources. Doesn't run on unrelated changes. |

#### Performance Optimizations

1. **Parallel execution**: Security, lint, types run simultaneously → 3-5 min total instead of 10-15 min sequential
2. **Conditional builds**: Build/Storybook only run if lint+types pass
3. **`cache: 'pnpm'`**: Uses GitHub Actions cache for pnpm dependencies → faster installs
4. **`--frozen-lockfile`**: Ensures reproducible builds. Fails if lockfile is outdated.

---

## 9. Dependencies

### What Was Installed

All dependencies installed at root level (`pnpm add -D -w`):

| Package | Version | Purpose |
|---------|---------|---------|
| **eslint** | ^9.39.3 | Core linter (v9 for flat config) |
| **@eslint/js** | ^9.x | ESLint recommended config |
| **eslint-plugin-vue** | ^9 | Vue 3 linting rules |
| **@typescript-eslint/parser** | ^8.58.2 | TypeScript parser for ESLint |
| **@typescript-eslint/eslint-plugin** | ^8.58.2 | TypeScript linting rules |
| **@vue/eslint-config-typescript** | ^14.7.0 | Vue + TypeScript preset config |
| **eslint-plugin-import** | ^2.32.0 | Import/export validation |
| **eslint-plugin-simple-import-sort** | ^13.0.0 | Alphabetical import sorting |
| **eslint-plugin-unused-imports** | ^4.4.1 | Remove unused imports |
| **eslint-plugin-vuejs-accessibility** | ^2.5.0 | Vue a11y linting |
| **eslint-import-resolver-typescript** | ^4.4.4 | Resolve TypeScript imports |
| **vue-eslint-parser** | ^10.4.0 | Parse `.vue` files |
| **stylelint** | ^17.7.0 | CSS/SCSS linter |
| **stylelint-config-standard-scss** | ^17.0.0 | SCSS standard rules |
| **stylelint-config-recommended-vue** | ^1.6.1 | Vue CSS rules |
| **stylelint-order** | ^8.1.1 | CSS property ordering |
| **husky** | ^9.1.7 | Git hooks |
| **lint-staged** | ^16.4.0 | Lint only staged files |
| **type-coverage** | ^2.29.7 | Type coverage measurement |

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

### Known Issues After Implementation

The initial ESLint run identified issues that need manual fixing:

1. **Missing prop defaults**: Add `withDefaults` to Vue components
2. **Undefined globals**: Add global type declarations for `fetch`, `setTimeout`, `ResizeObserver`
3. **Console statements**: Remove or use proper logging
4. **Missing return types**: Add TypeScript return types to functions
5. **Accessibility violations**: Add keyboard event handlers

These are expected—the governance pipeline is now catching issues that were previously undetected.

---

## Testing the Implementation

### Local Testing

```bash
# Run full governance suite
pnpm run governance

# Individual checks
pnpm run lint
pnpm run type-check
pnpm run format:check
pnpm run security:audit

# Auto-fix issues
pnpm run lint:fix
pnpm run format
```

### Pre-commit Hook Test

```bash
# Make a change
echo "console.log('test')" >> packages/webkit/src/test.js
git add packages/webkit/src/test.js
git commit -m "test: pre-commit hook"

# Hook will run ESLint and Prettier
# Commit will fail if issues found
```

### CI/CD Validation

1. Create a PR touching `packages/webkit/`
2. Navigate to Actions tab in GitHub
3. Verify all 6 jobs run:
   - security (✅ parallel)
   - lint (✅ parallel)
   - types (✅ parallel)
   - build (⏳ after lint+types)
   - storybook (⏳ after lint+types)
   - governance-check (⏳ after all)

---

## Future Improvements

### Potential Additions

| Improvement | Benefit | Effort |
|-------------|---------|--------|
| **ESLint cache** | Faster subsequent lint runs | Low |
| **Prettier cache** | Faster subsequent format checks | Low |
| **Bundle size limits** | Prevent bundle bloat | Medium |
| **Dead code detection** | Find unused exports | Medium |
| **Visual regression tests** | Catch UI changes | High |
| **Performance benchmarks** | Track bundle size over time | Medium |

### Configuration Tuning

As the team adapts to the pipeline:

1. **Adjust rule severity**: Move some `error` rules to `warn` if too strict
2. **Type coverage threshold**: Start at 95%, adjust based on reality
3. **Add eslint-disable comments**: For intentional exceptions
4. **Extend import patterns**: Add custom import order rules

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
pnpm run type-coverage  # See detailed report
```

#### CI Job Failing Locally
```bash
pnpm run governance  # Reproduce locally before pushing
```

---

## Conclusion

This governance pipeline establishes a foundation for code quality, security, and maintainability. It catches issues early (pre-commit), provides fast feedback (parallel CI jobs), and enforces standards consistently (zero warnings policy).

The pipeline is **strict by default** but **configurable**—adjust rules as needed based on team feedback and project requirements.

**Key Benefits:**

✅ **Security**: Dependency audits, secret detection  
✅ **Quality**: Linting, formatting, type safety  
✅ **Accessibility**: Vue-specific a11y rules  
✅ **Consistency**: Automated formatting, import sorting  
✅ **Performance**: Parallel CI jobs, staged file linting  
✅ **Developer Experience**: Auto-fixing, clear error messages  
✅ **Maintainability**: Type coverage metrics, no unused code  

---

**Implemented by:** Claude Code
**Date:** 2026-04-13
**Package:** @aziontech/webkit
**Framework:** Vue 3 + TypeScript + Composition API