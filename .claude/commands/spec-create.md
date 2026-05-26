---
description: Draft a `.specs/<name>.md` for a new webkit component interactively. Status starts at `draft`; review the file, mark `status: approved`, then run `/component-create <name>`.
argument-hint: <name> [--category <category>] [--figma <url>]
---

You are creating a new component spec for `.specs/<name>.md`. Follow the `spec-create` skill in `.claude/skills/spec-create/SKILL.md` exactly.

**User input:** $ARGUMENTS

## What to do

1. **Read the skill and the foundations:**
   - [`.claude/skills/spec-create/SKILL.md`](.claude/skills/spec-create/SKILL.md) — full workflow.
   - [`.specs/_template.md`](.specs/_template.md) — copy this body structure.
   - [`.specs/_schema.json`](.specs/_schema.json) — frontmatter contract.
   - [`.claude/rules/no-invention.md`](.claude/rules/no-invention.md), [`naming.md`](.claude/docs/COMPONENT_REQUIREMENTS.md), [`tokens.md`](.claude/docs/DESIGN.md), [`accessibility.md`](.claude/docs/COMPONENT_REQUIREMENTS.md), [`bem-testid.md`](.claude/docs/COMPONENT_REQUIREMENTS.md).
   - [`.claude/docs/DESIGN.md`](.claude/docs/DESIGN.md) — design tokens (authoritative).

2. **Parse the arguments.** Required: `<name>` (kebab-case). Optional: `--category`, `--figma`. If the name is missing or invalid, ask the user.

3. **Refuse to overwrite** any existing `.specs/<name>.md` whose `status ∈ {approved, implemented, locked}`.

4. **Invoke the `spec-author` sub-agent** with the universal envelope from `.claude/agents/_README.md`. Pass it the user's arguments and ask it to:
   - Infer the category if not provided; confirm with the user.
   - Optionally run `figma-extractor` + `token-mapper` (when `--figma` is set) to pre-fill the Tokens section.
   - Ask focused questions about Props / Events / Slots / Sub-components (only when composition) / States / Motion & Animations / Accessibility / Stories.
   - Write `.specs/<name>.md` with `status: draft`.

5. **Echo the result** with the path to the new spec and tell the user: review it, edit anything wrong, then run `/component-create <name>`. `spec-validator` will flip `status: draft → approved` automatically when the spec is valid.

## Hard rules

- **One file only.** This command writes nothing besides `.specs/<name>.md`. No `.vue`, no `package.json`, no story file.
- **Status starts at `draft`.** Only `spec-validator` may flip to `approved` — and only after the body satisfies every rule.
- **Stories are minimal.** Default lists only Default + per `kind` + per `size` + Disabled. Adding LightDark/Accessibility (play)/Playground requires explicit justification in the spec.
- **Animations come from `packages/theme/src/tokens/semantic/animations.js`.** No component-local `@keyframes`. Every motion class pairs with `motion-reduce:*`.
- **If anything is ambiguous,** the agent emits `BLOCKED: <reason>` and writes nothing.
