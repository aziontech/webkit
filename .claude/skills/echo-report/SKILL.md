---
name: echo-report
description: Re-read every file written this run and diff its content against the spec. Independent parser (cross-check with `validate-spec-compliance.mjs`). Final defensive line.
status: active
last_updated: 2026-05-22
---

# Skill: echo-report

## Purpose

After scaffolding + storybook + code-connect have written files, this skill re-reads them from disk, re-parses `defineProps` / `defineEmits` / `defineSlots` / story exports / `.figma.ts` mappings, and produces a diff against the spec. If `validate-spec-compliance.mjs` (the PostToolUse hook) and this skill **disagree** on any artifact, the run is marked degraded and a human is asked to review.

Two parsers agreeing is the precision boost.

## When to invoke

- Step 7 of `/component-create`, after `code-connect-write` (or its skip).

## Inputs

- The list of files the orchestrator's run log says were written.
- The full text of `.specs/<name>.md`.
- The output of `validate-spec-compliance.mjs` for the same files (passed by the orchestrator).

## Workflow

1. **Re-read** every `<name>.vue`, every sub-component `.vue`, the `<Name>.stories.js`, and (if present) `<name>.figma.ts`.
2. **Independent parsing.** Do **not** call into `_lib/spec.mjs`. Parse with a hand-rolled regex/AST pass:
   - `defineProps<{...}>()` block → list of `{ name, type, optional, default }`.
   - `defineEmits<{ name: [args] }>()` → list of `{ name, payload }`.
   - `defineSlots<{ name(...): unknown }>()` → list of `{ name }`.
   - `defineOptions({ name: '...' })` → component name.
   - `provide(<Key>InjectionKey, ...)` / `inject(<Key>InjectionKey)` → composition marker.
   - Story file: `export const <Name>` names + their `args`.
   - `.figma.ts`: `figma.connect(<Component>, '...', { props: {...} })` keys.
3. **Diff against spec.**
   - Props in `.vue` ≠ spec.Props → block.
   - Events in `.vue` ≠ spec.Events → block.
   - Slots in `.vue` ≠ spec.Slots → block.
   - Sub-components: every `<name>-<part>.vue` matches spec.Sub-components.
   - Story exports ≠ spec.Stories → block.
   - `.figma.ts` enum keys ≠ spec.Props values → block.
4. **Animations cross-check.** The spec's `## Motion & Animations` section lists the expected `animate-*` / `transition-*` classes per state. Grep the `.vue` files:
   - Every animation class in the spec must appear at least once in the `.vue`.
   - Every animation class in the `.vue` must appear in the spec.
   - Each `animate-*` class on a transformable element must be paired with `motion-reduce:animate-none` or `motion-reduce:transition-none` (or have a same-line escape). Spec says `_none_` → zero `animate-*` / `transition-*` classes allowed.
5. **Cross-check with the hook.** Compare your diff with the `validate-spec-compliance.mjs` output. Same verdict → run continues. Different verdict → mark the run `degraded` and ask the user to investigate.
6. **Emit the final report** using the structure in [`COMPONENT_REQUIREMENTS.md`](../../../.claude/docs/COMPONENT_REQUIREMENTS.md) (Summary / Files created / Exports added / Tokens mapped / Theme gaps / Reused utilities / Pending items / Validation / Accessibility checklist / Usability checklist / Suggested next steps).

## Outputs

- A Markdown report.
- An exit code: `0` (parity), `1` (mismatch — blocks the run), `2` (parser disagreement — degraded run, asks human).

## Rules

- **Do not** use `_lib/spec.mjs`. The whole point is an independent parser.
- **Do not** edit any file. This is read-only.
- **Do not** swallow mismatches. Every mismatch is surfaced verbatim.

## Fallbacks

- A file the orchestrator says was written is missing on disk → emit `BLOCKED: file <path> missing`.
- A parser disagrees with the hook on a single field → mark `degraded` and ask for review; do not flip the verdict silently.

## Definition of Done

- [ ] Every file written this run was re-read from disk.
- [ ] Diff against the spec produced.
- [ ] Animations cross-check performed.
- [ ] Cross-check with `validate-spec-compliance.mjs` produced.
- [ ] Final report emitted with the canonical section structure.
- [ ] Exit code reflects the outcome.
