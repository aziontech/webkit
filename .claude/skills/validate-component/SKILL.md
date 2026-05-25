---
name: validate-component
description: Run the project's pnpm checks (lint, type-check, type-coverage, dts build, storybook build) on the freshly-written component. Pure runner; never edits code.
status: active
last_updated: 2026-05-22
---

# Skill: validate-component

## Purpose

Confirm the scaffolded component compiles, lints, types, and builds. Surfaces failures to the orchestrator so the run can be marked degraded or rolled back.

## When to invoke

- Step 8 of `/component-create`, after `echo-reporter` confirmed parity.

## Inputs

- The list of files written this run (from the orchestrator's run log).
- No mutation of the codebase.

## Workflow

Run the five checks in this fixed order; stop on the first failure and surface it:

| # | Command | Failure means |
|---|---|---|
| 1 | `pnpm webkit:lint` | ESLint reports an error or warning that crosses the project threshold. |
| 2 | `pnpm webkit:type-check` | `vue-tsc` reports a TypeScript error in the component, its sub-components, or the consuming exports. |
| 3 | `pnpm webkit:type-coverage` | Type coverage below the threshold (project default: 95%). |
| 4 | `pnpm webkit:build:dts` | `.vue.d.ts` files fail to generate — usually a typing mistake. |
| 5 | `pnpm storybook:build` | The new `.stories.js` breaks the Storybook build. |

For each command, capture the exit code and the last 40 lines of stdout/stderr. Emit a table:

```markdown
| Check | Result | Detail |
|---|---|---|
| `pnpm webkit:lint` | ✅ pass | 0 warnings |
| `pnpm webkit:type-check` | ✅ pass | — |
| `pnpm webkit:type-coverage` | ✅ pass | 97.2% (threshold 95%) |
| `pnpm webkit:build:dts` | ✅ pass | declarations emitted |
| `pnpm storybook:build` | ✅ pass | build output OK |
```

If any row is ❌, include the last 40 lines of the tool's output below the table and stop.

## Outputs

- The Markdown table above + (on failure) the tail of the failing command's output.

## Rules

- **Do not** auto-fix lint failures. Surface them and stop — the user (or a follow-up sub-agent) decides whether to fix.
- **Do not** run `pnpm install`. If a dep is missing, surface that as the failure reason.
- **Do not** run `git`. Validation never touches the working tree.

## Fallbacks

- A script is missing from `package.json` → emit `BLOCKED: script <name> not found in root package.json`.
- A command hangs > 5 min → emit `BLOCKED: <command> timed out` and exit.

## Definition of Done

- [ ] Five rows in the table, each with ✅ or ❌.
- [ ] On failure, the failing command's tail is shown.
- [ ] No edits to the codebase.
- [ ] Exit code mirrors the result (0 = all pass, non-zero on any failure).
