---
description: Draft a `.specs/<name>.md` for a new webkit component interactively. Status starts at `draft`; review the file, mark `status: approved`, then run `/component-create <name>`.
argument-hint: <name> [--category <category>] [--figma <url>]
---

You are creating a new component spec for `.specs/<name>.md`. Follow the `spec-create` skill in `.claude/skills/spec-create/SKILL.md` exactly.

**User input:** $ARGUMENTS

## Two modes — pick one up front

`spec-create` has **two distinct paths**. Detect the mode from the arguments (and confirm with the user before drafting):

- **Mode A — Figma-driven** (`--figma <url>` present). The Figma frame is the source of truth: extract tokens/regions/states, map them to DESIGN.md, and ask the user only where the frame is silent (behavior, a11y intent, story list).
- **Mode B — Name + Category** (no `--figma`; the user is building **without** a design). There is **no** ground truth, so invention risk is highest. This mode is deliberately **more blocking**: it **always asks** about every section, one at a time, **never infers** props/events/tokens, and refuses to write until each mandatory section has a real answer (**no silent `TBD`**). `--category` is required here (ask + confirm if missing).

If `--figma` is absent, you are in **Mode B** — do not quietly infer from intent. If both a URL and "no figma" intent are ambiguous, ask which mode the user wants before proceeding.

## What to do

1. **Read the skill and the foundations:**
   - [`.claude/skills/spec-create/SKILL.md`](.claude/skills/spec-create/SKILL.md) — full workflow.
   - [`.specs/_template.md`](.specs/_template.md) — copy this body structure.
   - [`.specs/_schema.json`](.specs/_schema.json) — frontmatter contract.
   - [`.claude/rules/no-invention.md`](.claude/rules/no-invention.md), [`naming.md`](.claude/docs/COMPONENT_REQUIREMENTS.md), [`tokens.md`](.claude/docs/DESIGN.md), [`accessibility.md`](.claude/docs/COMPONENT_REQUIREMENTS.md), [`bem-testid.md`](.claude/docs/COMPONENT_REQUIREMENTS.md).
   - [`.claude/docs/DESIGN.md`](.claude/docs/DESIGN.md) — design tokens (authoritative).

2. **Parse the arguments.** Required: `<name>` (kebab-case). Optional: `--category`, `--figma`. If the name is missing or invalid, ask the user.

3. **Refuse to overwrite** any existing `.specs/<name>.md` whose `status ∈ {approved, implemented, locked}`.

4. **Invoke the `spec-author` sub-agent** with the universal envelope from `.claude/agents/_README.md`. Pass it the user's arguments, the **mode** (A or B), and ask it to:
   - **Mode A (Figma):** run `figma-extractor` + `token-mapper` to pre-fill Tokens/regions/states; confirm the extracted values with the user; ask only about behavior/a11y/stories the frame cannot express. Infer the category from the frame + confirm.
   - **Mode B (Name + Category):** ask about **every** section, one at a time — Purpose / Props / Events / Slots / Sub-components (only when composition) / States / Motion & Animations / Accessibility / Stories — and **map each token to DESIGN.md with the user, never infer**. Confirm the category first. If the user leaves any mandatory section unanswered, emit `BLOCKED:` and write nothing (**no silent `TBD`** in this mode).
   - Write `.specs/<name>.md` with `status: draft`.

5. **Echo the result** with the path to the new spec and tell the user: review it, edit anything wrong, then run `/component-create <name>`. `spec-validator` will flip `status: draft → approved` automatically when the spec is valid.

## Hard rules

- **One file only.** This command writes nothing besides `.specs/<name>.md`. No `.vue`, no `package.json`, no story file.
- **Status starts at `draft`.** Only `spec-validator` may flip to `approved` — and only after the body satisfies every rule.
- **Stories are minimal.** Default lists only Default + per `kind` + per `size` + Disabled. Adding LightDark/Accessibility (play)/Playground requires explicit justification in the spec.
- **Animations come from `packages/theme/src/tokens/semantic/animations.js`.** No component-local `@keyframes`. Every motion class pairs with `motion-reduce:*`.
- **If anything is ambiguous,** the agent emits `BLOCKED: <reason>` and writes nothing.
- **Mode B is stricter than Mode A.** Without a Figma source there is nothing to fall back on, so: never infer a prop/event/slot/token; ask for each; and refuse to write (`BLOCKED:`) rather than leave a mandatory section as `TBD`. `TBD` + `status: draft` is tolerated only in Mode A when the frame genuinely cannot express a section.
