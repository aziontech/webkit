---
description: Draft a `.specs/<name>.md` for a new webkit component interactively. Status starts at `draft`; review the file, mark `status: approved`, then run `/component-create <name>`.
argument-hint: [<name>] [--category <category>] [--figma <url>]
---

You are creating a new component spec for `.specs/<name>.md`. Follow the `spec-create` skill in `contributing/skills/spec-create/SKILL.md` exactly.

**User input:** $ARGUMENTS

## Two modes — pick one up front

`spec-create` has **two distinct paths**. Detect the mode from the arguments (and confirm with the user before drafting):

- **Mode A — Figma-driven** (`--figma <url>` present). The Figma frame is the source of truth: extract tokens/regions/states, map them to TOKENS.md, and ask the user only where the frame is silent (behavior, a11y intent, example list). The component **name** is derived from the frame's component name (normalized to kebab, confirmed with the user); passing `<name>` is **optional** here and, when given, overrides the frame.
- **Mode B — Name + Category** (no `--figma`; the user is building **without** a design). There is **no** ground truth, so invention risk is highest. This mode is deliberately **more blocking**: it **always asks** about every section, one at a time, **never infers** props/events/tokens, and refuses to write until each mandatory section has a real answer (**no silent `TBD`**). `--category` is required here (ask + confirm if missing).

If `--figma` is absent, you are in **Mode B** — do not quietly infer from intent. If both a URL and "no figma" intent are ambiguous, ask which mode the user wants before proceeding.

## What to do

1. **Read the skill and the foundations:**
   - [`contributing/skills/spec-create/SKILL.md`](../skills/spec-create/SKILL.md) — full workflow.
   - [`.specs/_template.md`](../../.specs/_template.md) — copy this body structure.
   - [`.specs/_schema.json`](../../.specs/_schema.json) — frontmatter contract.
   - [`contributing/rules/no-invention.md`](../rules/no-invention.md), [`naming.md`](../rules/naming.md), [`prop-vocabulary.md`](../rules/prop-vocabulary.md), [`accessibility.md`](../rules/accessibility.md), [`testid.md`](../rules/testid.md), [`event-payloads.md`](../rules/event-payloads.md).
   - [`contributing/docs/TOKENS.md`](../docs/TOKENS.md) — design tokens (authoritative).
   - [`contributing/docs/CODE_QUALITY.md`](../docs/CODE_QUALITY.md) § 3 — the size limits, the list state contract, `disabledReason`, `options` as data and the extension points the API must plan for.

2. **Parse the arguments.** `<name>` (kebab-case) is **required in Mode B**; in **Mode A it is optional** — when omitted it is derived from the frame's component name (normalized + confirmed), and a passed `<name>` overrides. **If the frame has no usable name, ask the user.** Optional: `--category`, `--figma`. If the name is missing in Mode B (no `--figma`), ask the user.

3. **Refuse to overwrite** any existing `.specs/<name>.md` whose `status ∈ {approved, implemented, locked}`.

4. **Invoke the `spec-creator` sub-agent** with the universal envelope from `contributing/agents/_README.md`. Pass it the user's arguments, the **mode** (A or B), and ask it to:
   - **Mode A (Figma):** run `figma-extractor` + `token-mapper` to pre-fill Tokens/regions/states; confirm the extracted values with the user; ask only about behavior/a11y/examples the frame cannot express. Derive the component **name** from the frame's `component_name` (normalize to kebab, confirm) unless `<name>` was passed (which overrides); **if the frame has no usable name, ask the user for it.** Infer the category from the frame + confirm.
   - **Mode B (Name + Category):** ask about **every** section, one at a time — Purpose / When to use / When NOT to use / Props / Events / Slots / Sub-components (only when composition) / States / Motion & Animations / Accessibility / Internationalization / Right-to-left / Responsive / Performance / Examples — and **map each token to TOKENS.md with the user, never infer**. Confirm the category first. If the user leaves any mandatory section unanswered, emit `BLOCKED:` and write nothing (**no silent `TBD`** in this mode).
   - Write `.specs/<name>.md` with `status: draft`.

5. **Echo the result** with the path to the new spec and tell the user: review it, edit anything wrong, then run `/component-create <name>`. `spec-validator` will flip `status: draft → approved` automatically when the spec is valid.

## Hard rules

- **One file only.** This command writes nothing besides `.specs/<name>.md`. No `.vue`, no `package.json`, no test, no example file.
- **Status starts at `draft`.** Only `spec-validator` may flip to `approved` — and only after the body satisfies every rule.
- **Examples are minimal.** The list holds only Default + per `variant` + per `size` + Disabled. Any other example needs an explicit justification in the spec. Default comes first (it becomes `default.vue`); names follow `contributing/rules/naming.md` § 4.
- **Animations come from `packages/theme/src/tokens/primitives/animations/animate.js` (keyframes in the sibling `keyframes.js`).** No component-local `@keyframes`. Every motion class pairs with `motion-reduce:*`.
- **If anything is ambiguous,** the agent emits `BLOCKED: <reason>` and writes nothing.
- **Mode B is stricter than Mode A.** Without a Figma source there is nothing to fall back on, so: never infer a prop/event/slot/token; ask for each; and refuse to write (`BLOCKED:`) rather than leave a mandatory section as `TBD`. `TBD` + `status: draft` is tolerated only in Mode A when the frame genuinely cannot express a section.
