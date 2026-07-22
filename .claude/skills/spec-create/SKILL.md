---
name: spec-create
description: Interactively draft `.specs/<name>.md` for a new webkit component. Owns the questions, the cross-reference with DESIGN.md and Figma, and the initial `status: draft` write. Never writes component code.
status: active
last_updated: 2026-05-22
scope: webkit
enforced_by: [no-invention, props, styling]
---

# Skill: spec-create

## Purpose

Produce a `.specs/<name>.md` that is complete enough for `spec-validator` to flip to `status: approved`. The user runs `/spec-create <name>` (optionally with `--figma <url>`); this skill drives the interaction.

## When to invoke

- The slash command `/spec-create` was used.
- The user said "I need a new component" / "criar componente" but there is no `.specs/<name>.md` yet, and `/component-create` was about to fail because of that.

## Inputs & mode

- `<name>` (kebab-case) — required in both modes.
- The **mode** is chosen by input:
  - **Mode A — Figma-driven:** `--figma <url>` is present. The frame is the source of truth.
  - **Mode B — Name + Category:** no `--figma`. The user is building without a design; `--category <name>` is required (ask + confirm if missing). This mode is **more blocking** — see below.

Confirm the mode with the user before drafting. If it's ambiguous which one they want, ask.

## Workflow — shared steps

1. **Argument parsing.** Reject if `<name>` is missing or not kebab-case. Reject if `.specs/<name>.md` already exists with `status ∈ {approved, implemented, locked}` (the user is editing the wrong file).
2. **Category.** Use the taxonomy in `.specs/_template.md` frontmatter. State the inferred/received category and **ask the user to confirm** (mandatory in Mode B — never assume).
3. **Structure decision.** Call `structure-decide` with the regions/answers. Default to `monolithic` when in doubt.
4. **Write the spec.** Copy `.specs/_template.md` to `.specs/<name>.md`, fill every section, frontmatter `status: draft`, `created`/`last_updated` = today, no `checksum`.
5. **Echo.** Print the path. Tell the user to review it, then run `/component-create <name>` (which calls `spec-validator`) or set `status: approved` and re-run.

## Mode A — Figma-driven (`--figma <url>`)

- **Figma discovery.** Delegate to `figma-discover` via the `figma-extractor` sub-agent. Use the returned JSON to pre-populate the Tokens section.
- **Token mapping.** Run `token-map` against the Figma output and DESIGN.md. Populate the Tokens table; flag Theme gaps.
- **Confirm, don't assume.** Show the extracted props/regions/states/tokens and ask the user to confirm/correct.
- **Ask only where the frame is silent:** behavior, keyboard map, focus/scroll-lock, event payloads, the story list.
- A genuinely un-expressible section may stay `TBD` + `status: draft` (documented as a Figma gap).

## Mode B — Name + Category (no Figma, blocking)

There is no ground truth, so **ask for everything and infer nothing.**

- **Always ask, one at a time,** in this order — never skip, never pre-fill: Purpose (1–3 sentences) → Props → Events → Slots → Sub-components (only if `structure: composition`) → States → Motion & Animations → Accessibility (focus trap? keyboard map? aria?) → Storybook stories.
  - **Props:** name, type literal/primitive, default, required, JSDoc one-liner. Repeat until the user says done. Default rule: an optional renderable string defaults to `''`, not `undefined`; reserve unquoted `undefined` for props where absence ≠ empty (`open`, `modelValue`, `src`); never record the quoted string `'undefined'`. See the Props rules comment in `.specs/_template.md`.
- **Tokens are mapped, never invented.** For every visual choice, map to a DESIGN.md token and **confirm it with the user**. A value with no token is a Theme gap the user must acknowledge — do not substitute a raw value.
- **No silent `TBD`.** If the user leaves a mandatory section unanswered, emit `BLOCKED: <section> unanswered` and write nothing. The manual path never produces a half-spec.

## Outputs

- `.specs/<name>.md` with `status: draft`.
- No component code, no exports entry, no story file.

## Rules

- Do **not** invent props/events/slots/tokens that the user (Mode B) or the frame (Mode A) did not state.
- Do **not** mark `status: approved` from this skill — that is `spec-validator`'s job and requires a real checksum.
- Never edit a spec with `status ∈ {approved, implemented, locked}`.
- **`TBD` is Mode-A only.** In Mode A, a section the frame cannot express may stay `TBD` + `status: draft`. In **Mode B there is no `TBD`** — an unanswered mandatory section means `BLOCKED:` and no write.

## Fallbacks

- **Mode A, Figma MCP failure:** do not silently infer. Tell the user the frame could not be read and offer to switch to **Mode B** (answer each section by hand) — do not "infer tokens from intent".
- **Mode B, user refuses/does not know a mandatory section:** emit `BLOCKED: <section> unanswered` and write nothing. The manual path never produces a half-spec.

## Definition of Done

- [ ] `.specs/<name>.md` exists.
- [ ] Frontmatter passes `_schema.json`.
- [ ] Every body section is present (some may be `TBD`).
- [ ] The Constraints — DO NOT block is copied verbatim from the template.
- [ ] The user has been told the next step (`/component-create <name>`).
