---
name: spec-validate
description: Validate a `.specs/<name>.md` against the schema, the body section rules, and the Constraints block. Writes the checksum and flips status from draft to approved when valid.
status: active
last_updated: 2026-05-22
---

# Skill: spec-validate

## Purpose

Decide whether a spec is good enough to drive code generation. The `spec-validator` sub-agent runs this skill at Step 1 of `/component-create`. Validation must be **deterministic** — same spec, same verdict.

## When to invoke

- Step 1 of `/component-create <name>` (orchestrator passes the spec content).
- `/component-verify <name>` (manual re-check).
- Hook test suite (against `.specs/__fixtures__/*`).

## Inputs

- The full text of `.specs/<name>.md` (frontmatter + body).
- `.specs/_schema.json` (frontmatter schema).
- `.claude/docs/DESIGN.md` (to verify Token references).

## Workflow

1. **Parse frontmatter.** Run Ajv against `_schema.json`. Any violation → fail with the Ajv error path.
2. **Parse body sections.** Use `.claude/hooks/_lib/spec.mjs` to extract the Props / Events / Slots / Sub-components / Tokens tables. Fail if any mandatory section is absent or contains only `TBD`.
3. **Check Props table.** Each row must have all five cells filled. Boolean prop names must not start with `is`/`has`. Visual variant prop must be named `kind`. Size prop must be named `size`. JSDoc cell must not be empty. The Default cell must NOT be the string literal `'undefined'` or `'null'` (the quoted text, not the JS value `undefined`): for an optional text prop use `''`, for a genuinely absence-meaningful prop (`open`, `modelValue`, `src`) use unquoted `undefined`. Fail with `FAIL: prop <name> Default is the string 'undefined'; use '' or unquoted undefined` (helper: `defaultCellIsStringUndefined` in `.claude/hooks/_lib/spec.mjs`).
4. **Check Events table.** Event names must be kebab-case OR `update:<prop>`. Payloads must be a TypeScript type (no `any`, no empty).
5. **Check Slots table.** Slot names must be kebab-case. Scope must be `—` or a typed object.
6. **Check Sub-components.** If `structure: composition`, the Sub-components section must list at least the root + one sub-component. If `structure: monolithic`, the section must be absent.
7. **Check Tokens.** Every "Token (DESIGN.md)" cell must match one of:
   - A generated class starting with `.text-` and present in DESIGN.md.
   - A `var(--*)` that exists in DESIGN.md.
   No HEX, no RGB, no Tailwind palette, no external color utility.
8. **Check Constraints block.** The "## Constraints — DO NOT" section must be present and must contain at least the bullets from `.specs/_template.md` (verbatim text check on the canonical bullets).
9. **Write checksum.** If all checks pass and the input had `status: draft`, compute `sha256(body)` (everything after the closing `---` of the frontmatter), write it to the `checksum` field, and flip `status: approved`. Refresh `last_updated`.
10. **Emit verdict.** Print `OK` or a list of failures (one per line, with the failing line number).

## Outputs

- Updated `.specs/<name>.md` (only when input was `draft` and all checks passed).
- A verdict line: `OK` or `FAIL: <reason>` (one per failure).

## Rules

- **Do not** alter the spec body. Only frontmatter (`status`, `checksum`, `last_updated`) may change, and only when all checks pass.
- **Do not** approve a spec whose status is already `approved`, `implemented`, or `locked` — leave it alone, return `OK` (or `FAIL` if body diverges from checksum).
- **Do not** echo DESIGN.md back to the user — just verify references.

## Fallbacks

- If Ajv is not available (shouldn't happen — installed via `pnpm`), exit with `FAIL: ajv missing; install dev dep`.
- If DESIGN.md is missing, exit with `FAIL: DESIGN.md not found at .claude/docs/DESIGN.md`.

## Definition of Done

- [ ] Frontmatter passes `_schema.json`.
- [ ] Every body section is present and non-`TBD`.
- [ ] Every Tokens entry resolves in DESIGN.md.
- [ ] Constraints block contains the canonical bullets.
- [ ] On success: `status: approved` with a valid checksum.
- [ ] On failure: nothing written; reasons printed; exit non-zero.
