---
name: spec-create
description: Interactively draft `.specs/<name>.md` for a new webkit component. Owns the questions, the cross-reference with DESIGN.md and Figma, and the initial `status: draft` write. Never writes component code.
status: active
last_updated: 2026-05-22
---

# Skill: spec-create

## Purpose

Produce a `.specs/<name>.md` that is complete enough for `spec-validator` to flip to `status: approved`. The user runs `/spec-create <name>` (optionally with `--figma <url>`); this skill drives the interaction.

## When to invoke

- The slash command `/spec-create` was used.
- The user said "I need a new component" / "criar componente" but there is no `.specs/<name>.md` yet, and `/component-create` was about to fail because of that.

## Inputs

- `<name>` (kebab-case) — required.
- `--figma <url>` — optional but strongly recommended.
- `--category <name>` — optional; if absent the skill infers from name/figma and asks the user to confirm.

## Workflow

1. **Argument parsing.** Reject if `<name>` is missing or not kebab-case. Reject if `.specs/<name>.md` already exists with `status ∈ {approved, implemented, locked}` (the user is editing the wrong file).
2. **Category inference.** Use the taxonomy in `.specs/_template.md` frontmatter. If a Figma URL is provided, look at the frame title and the surrounding pages for context. Always state the inferred category and ask the user to confirm.
3. **Figma discovery (optional but preferred).** If `--figma` is set, delegate to the `figma-discover` skill via the `figma-extractor` sub-agent. Use the returned token JSON to pre-populate the Tokens section.
4. **Token mapping.** Run the `token-map` skill against the Figma output and DESIGN.md. Populate the Tokens table; flag Theme gaps.
5. **Interactive questions.** Ask the user, in this order:
   - Purpose (1–3 sentences).
   - Props: name, type literal/primitive, default, required, JSDoc one-liner. Repeat until the user says done.
   - Events.
   - Slots.
   - Sub-components (only if `structure: composition`).
   - Storybook stories (the mandatory list + any extras).
   - Accessibility specifics (focus trap? keyboard map? aria attributes?).
6. **Structure decision.** Call the `structure-decide` skill with the regions identified in Figma + the answers above. Default to `monolithic` when in doubt.
7. **Write the spec.** Copy `.specs/_template.md` to `.specs/<name>.md` and fill every section. Frontmatter `status: draft`, `created` = today, `last_updated` = today, no `checksum` yet.
8. **Echo.** Print the path of the file written. Tell the user to review it and then run either `/component-create <name>` (which calls `spec-validator` first) or to set `status: approved` manually and re-run.

## Outputs

- `.specs/<name>.md` with `status: draft`.
- No component code, no exports entry, no story file.

## Rules

- Do **not** invent props/events/slots that the user did not state.
- Do **not** write the spec until every mandatory section has a real answer. If the user is unsure about a section, write `TBD` and keep `status: draft`.
- Do **not** mark `status: approved` from this skill — that is `spec-validator`'s job and requires a real checksum.
- Never edit a spec with `status ∈ {approved, implemented, locked}`.

## Fallbacks

- Figma MCP failure: continue without it, but explicitly tell the user "no Figma; tokens will be inferred from intent" and add this caveat to the Purpose section.
- User refuses to answer a section: write `TBD` and keep `status: draft`. The spec is incomplete; nothing downstream will run.

## Definition of Done

- [ ] `.specs/<name>.md` exists.
- [ ] Frontmatter passes `_schema.json`.
- [ ] Every body section is present (some may be `TBD`).
- [ ] The Constraints — DO NOT block is copied verbatim from the template.
- [ ] The user has been told the next step (`/component-create <name>`).
