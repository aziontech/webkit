---
description: Spec-driven orchestrator. Reads `.specs/<name>.md`, delegates phases to isolated sub-agents, and produces `<name>.vue` + `package.json` + exports entry + minimal Storybook story.
argument-hint: <name> [--dry-run]
---

You are the orchestrator for `/component-create`. **You do not write component code yourself.** You execute a fixed pipeline that delegates each phase to an isolated sub-agent. Each sub-agent receives only the spec + its narrow rules — never the conversation, never another sub-agent's output (except sanitized JSON artifacts you explicitly pass forward).

**User input:** $ARGUMENTS

## Pipeline

### Step 0 — Preflight
1. Parse `<name>`. Reject if missing/invalid. `--dry-run` runs Steps 0–3 and exits with a preview (no writes).
2. Generate a run-id (uuid). Open `.claude/logs/<run-id>.jsonl` and append one line per phase.
3. Resolve `.specs/<name>.md`:
   - Absent → tell the user `Run /spec-create <name> first.` Exit 1.
   - `status: draft` → tell the user the spec is not approved; suggest re-running after fixing issues. Exit 1.
   - `status ∈ {approved, implemented}` → proceed (implemented re-runs are allowed for follow-up edits).
   - `status: locked` → block unless the user explicitly bumps `spec_version`. Exit 1.
4. Recompute `sha256(body)` and compare to the frontmatter `checksum`. Mismatch → `BLOCKED: spec tampered after approval`. Exit 1.

### Step 1 — Spec validation (blocking)
Spawn the `spec-validator` sub-agent with the universal envelope (see `.claude/agents/_README.md`). It re-runs the schema, body, and Constraints checks. On `FAIL`, surface every failure and exit. No writes happen until this passes.

### Step 2 — Parallel discovery (read-only, safe to parallelize)
- `figma-extractor` (only if `spec.figma.url` is set) — emits tokens JSON.
- `reuse-auditor` — emits reuse JSON.
- After `figma-extractor` returns, run `token-mapper` on its output — emits mapping + theme gaps.

### Step 3 — Reconciliation (blocking)
- Every token listed in `spec.Tokens` must resolve in `token-mapper` output (no theme gaps that the spec did not flag).
- Every region from `figma-extractor` must be covered by the spec (Props/Slots/Sub-components).
- Mismatch → exit with the diff and instruct the user to update the spec and re-run.

If `--dry-run`, print the planned writes here and exit 0.

### Step 4 — Scaffold (writes)
Spawn the `scaffolder` sub-agent. Envelope includes: spec verbatim + Constraints + rules (`no-invention`, `naming`, `bem-testid`, `tokens`, `accessibility`) + `component-scaffold` skill + canonical paths to inspect (button.vue, card-pricing.vue). Task tells it exactly which files to write.

Hooks that fire on every Write:
- PreToolUse: `enforce-spec-exists`, `validate-tokens`, `validate-references`, `enforce-component-create`.
- PostToolUse: `validate-spec-compliance`.

If any hook blocks, surface the stderr and abort. **Do not retry with workarounds.**

### Step 5 — Storybook (writes)
Spawn the `storybook-writer` sub-agent. Writes only the stories the spec lists (Default + per kind + per size + Disabled by default — nothing else unless the spec is explicit).

### Step 6 — Code Connect (writes or skip)
Spawn the `code-connect-writer` sub-agent. Skips itself if `@figma/code-connect` is not installed; that becomes a Pending Item in the final report.

### Step 7 — Echo cross-check (read-only)
Spawn the `echo-reporter` sub-agent. Independently re-parses every file written and diffs against the spec. Exit codes:
- 0 — parity (hook + echo agree). Continue.
- 1 — mismatch. Block the run; surface diffs.
- 2 — hook and echo disagree. Mark `degraded`; ask the user to review.

### Step 8 — Validation (read-only)
Spawn the `validate-component` sub-agent. Runs `pnpm webkit:lint && type-check && type-coverage && storybook:build`. Surfaces failures.

### Step 9 — Finalize
- Flip `.specs/<name>.md` `status: approved → implemented` (or stay at `implemented` for re-runs).
- Refresh `checksum` and `last_updated`.
- Close `.claude/logs/<run-id>.jsonl` with a summary line.
- Emit the final Markdown report (from `echo-reporter`) to the user.

## Hard rules — enforced by hooks, the orchestrator must surface them

- **No phantom imports.** `validate-references.mjs` blocks any `Write`/`Edit` that introduces an unresolved import.
- **No HEX/Tailwind palette/raw typography/`class` in defineProps/`any`/`@ts-ignore`** in `packages/webkit/src/components/webkit/**`. `validate-tokens.mjs` enforces this.
- **No webkit `.vue` write without the spec.** `enforce-spec-exists.mjs` blocks Writes when `.specs/<name>.md` is missing, not approved, or checksum-mismatched.
- **No `.vue` that diverges from the spec.** `validate-spec-compliance.mjs` blocks props/events/slots/animations the spec did not list.
- **No bypass.** `enforce-component-create.mjs` blocks first Write to a new webkit `.vue` if this command or skill was not referenced in the session.

## Acknowledge before doing anything

Start your turn with one sentence: which component you're scaffolding and which spec path you'll read. Then run Step 0.
