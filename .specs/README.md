# `.specs/` — Component specs

This directory holds one Markdown spec per webkit-layer component. **A spec is a contract.** It is reviewed and approved **before any code is written**, and once approved it is the single source of truth that every sub-agent in `/component-create` must obey 1-to-1.

## Why specs exist

The previous workflow lived in a single monolithic skill (`skills/component-create.md`, 749 lines, since removed) and gave the agent full creative latitude to interpret the request. That created room for invention: props that weren't asked for, variants that weren't requested, helpers outside the request, phantom imports.

Specs collapse that latitude. The agent stops being an author and becomes a transcriber: the spec lists the props/events/slots/sub-components/tokens, and the generated `.vue` must match the spec exactly — nothing extra, nothing missing.

## Files in this directory

| Path | Purpose |
|---|---|
| `_template.md` | Canonical template — copy this to start a new spec. Defines the mandatory frontmatter + 9 body sections. |
| `_schema.json` | JSON Schema (Draft 2020-12) for the frontmatter. Validated by Ajv inside `spec-validator` and `enforce-spec-exists.mjs`. |
| `__fixtures__/` | Intentionally invalid specs used by the hook test suite. Their presence must make `spec-validator` fail. |
| `<name>.md` | One per component (e.g. `tooltip.md`, `card-banner.md`). Created by `/spec-create`. |

## Lifecycle

```
draft  ──/spec-create──▶  approved  ──/component-create──▶  implemented  ──ship──▶  locked
   │                          │                                  │                     │
   │                          │                                  │                     └─ Frozen. Edits require bumping spec_version.
   │                          │                                  └─ Files exist on disk. Spec checksum refreshed.
   │                          └─ spec-validator passed. checksum written. Ready for code generation.
   └─ Author/agent is still writing the spec. Code generation refuses to run.
```

- **`draft`** — being authored. `/component-create` refuses to run.
- **`approved`** — passed `spec-validator`; the body's sha256 is written to `checksum`. `/component-create` may now run.
- **`implemented`** — files have been written. `checksum` is refreshed; the spec stays editable for follow-up PRs.
- **`locked`** — once the component ships. `enforce-spec-exists.mjs` blocks every Write until the next `spec_version` is created.

## How to write a spec

Don't write one by hand for the first time. Run:

```
/spec-create <name>           # interactive — recommended
/spec-create <name> --figma <url>
```

The `spec-author` sub-agent will ask focused questions (kind options, sizes, events, slots, a11y, stories), cross-reference Design.md and any Figma URL you provide, and write `.specs/<name>.md` with `status: draft`.

Review the draft. Edit anything that's wrong. Then mark `status: approved` and re-run `/component-create` (which will call `spec-validator` and refuse to proceed if the body and the schema disagree).

## How specs are enforced

| Mechanism | Where it runs | What it blocks |
|---|---|---|
| `spec-validator` sub-agent | Step 1 of `/component-create` | Schema violations, missing JSDoc, kebab-case violations, unknown tokens, missing Constraints block. |
| `enforce-spec-exists.mjs` | PreToolUse hook on `Write` of any `<name>.vue` | Spec missing, `status ∉ {approved, implemented}`, body sha256 ≠ frontmatter checksum, status == `locked` without spec_version bump. |
| `validate-spec-compliance.mjs` | PostToolUse hook on `Write|Edit|MultiEdit` | `.vue` props/events/slots that don't match the spec table 1-to-1. |
| `echo-reporter` sub-agent | Step 7 of `/component-create` | Independent parser cross-check. Mismatch with the hook's parser → degraded run. |

## Legacy components

Components created **before** the spec-driven workflow live in
`.claude/hooks/_lib/legacy-components.json`. The two new hooks consult that
whitelist and bypass spec checks for them. **Backfilling specs for legacy
components is intentionally a separate task** — do not mix it with new-component
PRs.

## Editing rules (DO NOT)

- **Do not** delete `_template.md` or `_schema.json`.
- **Do not** edit a spec whose `status` is `locked`. Bump `spec_version` and create a new draft instead.
- **Do not** edit Design.md or COMPONENT_REQUIREMENTS.md to "match a spec" — the spec is wrong, fix the spec.
- **Do not** commit a spec with `status: draft` to `main`. Drafts are local working state.
