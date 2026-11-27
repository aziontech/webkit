---
name: component-validate
description: Run the project's pnpm checks (lint, type-check, type-coverage, server render of every example) on the freshly-written component. Pure runner; never edits code.
status: active
last_updated: 2026-11-23
scope: ui
enforced_by: [props, dependencies]
---

# Skill: component-validate

## Purpose

Confirm the scaffolded component compiles, lints, types, and builds. Surfaces failures to the orchestrator so the run can be marked degraded or rolled back.

## When to invoke

- Step 8 of `/component-create`, after `echo-reporter` confirmed parity.

## Inputs

- The list of files written this run (from the orchestrator's run log).
- No mutation of the codebase.

## Workflow

Run the five checks in this fixed order; stop on the first failure and surface it:

| #   | Command                                                                                                                 | Failure means                                                                                                                                                                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `pnpm lint:ui`                                                                                                          | ESLint reports an error or warning that crosses the project threshold.                                                                                                                                                                                                    |
| 2   | `pnpm typecheck:ui`                                                                                                     | `vue-tsc` reports a TypeScript error in the component, its sub-components, or the consuming exports.                                                                                                                                                                      |
| 3   | `pnpm check:ui:type-coverage`                                                                                           | Type coverage below the threshold (project default: 95%).                                                                                                                                                                                                                 |
| 4   | `pnpm --filter @aziontech/ui test:ssr`                                                                                  | An example of the new component does not render (or compile) with `vue/server-renderer`.                                                                                                                                                                                  |
| 5   | `pnpm --filter @aziontech/ui run gates -- --only exports,naming,authoring,tests,maintainability,assertions,look-alikes` | The component breaks a gate that needs no catalog rebuild or baseline: untyped export entry (run `build:exports`), a naming or authoring violation, no test, a size or complexity limit of `CODE_QUALITY.md` § 3.1, a forbidden type assertion, or a new look-alike pair. |

For each command, capture the exit code and the last 40 lines of stdout/stderr. Emit a table:

```markdown
| Check | Result | Detail |
|---|---|---|
| `pnpm lint:ui` | ✅ pass | 0 warnings |
| `pnpm typecheck:ui` | ✅ pass | — |
| `pnpm check:ui:type-coverage` | ✅ pass | 97.2% (threshold 95%) |
| `pnpm --filter @aziontech/ui test:ssr` | ✅ pass | every block and example rendered |
| `gates --only …` | ✅ pass | 7 of 7 gates passed |
```

This is the early check of a `/component-create` run. The full `pnpm --filter @aziontech/ui run gates` (catalog, llms, size, complete, baselines and the rest) runs in step 6 of `/component-new`, after the examples, the size budget and the catalog rebuild exist.

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
