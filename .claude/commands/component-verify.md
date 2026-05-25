---
description: Re-run spec compliance + validators on an existing component without writing any files. Use to confirm a freshly-edited `.vue` still matches its spec.
argument-hint: <name>
---

You are running `/component-verify <name>`. **You do not write anything.** You re-execute the read-only phases of `/component-create` against an existing component.

**User input:** $ARGUMENTS

## What to do

1. Resolve `.specs/<name>.md`. If absent → exit with the path it expected.
2. Run `spec-validator` on the current spec content. Surface any failures.
3. Recompute `sha256(body)` and compare to frontmatter `checksum`. Mismatch → surface and exit.
4. Resolve the existing component dir at `packages/webkit/src/components/webkit/<category>/<name>/`. Missing → exit.
5. Spawn `echo-reporter` against the disk files. Surface its verdict (parity / mismatch / degraded).
6. Spawn `validate-component` (`pnpm webkit:lint`, type-check, type-coverage, dts build, storybook build).
7. Print a one-table summary: spec status, hook verdict, echo verdict, validation pass/fail.

## Rules

- **Read-only.** This command writes nothing — no specs, no `.vue`, no logs (other than a one-line summary in `.claude/logs/<run-id>.jsonl`).
- **No retries on failure.** Surface and exit. The user fixes the divergence (in the spec or in the `.vue`) and re-runs.
- **No sub-agent spawned that writes.** Forbidden: `scaffolder`, `storybook-writer`, `code-connect-writer`, `spec-author`, `spec-validator` (which writes the checksum — exception: run it in dry-mode where it returns the verdict without flipping `status`).
