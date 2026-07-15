---
name: ui-craft
description: Umbrella entry for the UI-craft pack — build product UIs and prototypes on @aziontech/webkit with frontend taste and PRO UX. Explains the 3 principles, the 6 rules, the polish progression, and routes to baseline-ui, ux-heuristics, motion-polish, impeccable-polish, and delight.
status: active
last_updated: 2026-06-29
---

# Skill: ui-craft

## Purpose

Make UI built **on top of** `@aziontech/webkit` + `@aziontech/theme` look and feel like the design
system intended: technical, minimal, polished, PRO-UX-first. This is the entry point to a pack of
focused skills. It is for **consuming** apps and prototypes — composing screens from shipped
components and tokens — not for authoring the webkit primitives themselves (that pipeline is
`/spec-create` → `/component-create`).

## How to use

- `/ui-craft`
  Apply the principles and rules below to all UI work in this conversation, and route to the right
  child skill for the task at hand.
- `/ui-craft <file>`
  Run the full progression as a review of the file: `ux-heuristics` → `baseline-ui` → `motion-polish`
  → `impeccable-polish`, then (only if a moment earns it) `delight`. Output each child skill's
  findings under its own heading.

## The 3 principles

1. **Tech language.** This is infrastructure-grade product UI. Copy and visuals are precise, calm, and
   literal — not playful filler. No emoji-as-decoration, no marketing fluff inside the product.
2. **Minimal and polished.** Remove before you add. Every element earns its place. Restraint is the
   default; ornament is the exception that has to justify itself.
3. **PRO UX first.** Get the flow, states, and feedback right before any aesthetic or delight pass. A
   beautiful screen with a missing empty/error/loading state is not done.

## The 6 rules (non-negotiable)

1. **Use only components.** Compose from `@aziontech/webkit`. Don't hand-roll a button, input, modal,
   tooltip, or dropdown the system already ships.
2. **Use only design tokens** for typography, shape, and color — from `@aziontech/theme`
   (see [`DESIGN.md`](../../docs/DESIGN.md)). No HEX, no Tailwind palette, no raw values.
3. **Smooth animations with animate tokens** only — the `animate-*` utilities and the `duration-*` /
   `ease-*` / `curve` tokens. No external animation library, no inline `cubic-bezier`, no hardcoded ms.
4. **Never use typography outside the tokens.** Only the `text-*` classes from `texts.data.js`. No raw
   `text-xs/sm/base/lg`, no `leading-*`, no `tracking-*` overrides.
5. **Typography hierarchy is non-negotiable.** Never make a heading smaller than a label. Respect the
   scale order: `text-heading-* > text-body-* > text-label-* > text-overline-*`. Only tokens.
6. **Keep UI rhythm** with a consistent spacing rule — only the `--spacing-xxs … --spacing-xxl` scale,
   applied consistently for padding, gap, and margin.

## The progression

PRO UX first → Minimal & Polished → earned delight. Run the skills roughly in this order:

| Goal | Skill |
|---|---|
| Structure the flow: right component, states, feedback, heuristics | [`/ux-heuristics`](../ux-heuristics/SKILL.md) |
| Get async behavior right: lock the scope while running, toast request/API errors | [`/usability`](../usability/SKILL.md) |
| Build accessible forms: Cards+ItemGroups or Fields-separated, fieldset/legend, submit-time required/invalid | [`/form`](../form/SKILL.md) |
| Clean up slop: components-only, tokens-only, hierarchy, rhythm | [`/baseline-ui`](../baseline-ui/SKILL.md) |
| Make motion smooth with animate tokens only | [`/motion-polish`](../motion-polish/SKILL.md) |
| Final taste pass: hierarchy, rhythm, state completeness, balance | [`/impeccable-polish`](../impeccable-polish/SKILL.md) |
| Add an earned, restrained moment of delight | [`/delight`](../delight/SKILL.md) |

Don't jump to `motion-polish` or `delight` while `ux-heuristics` still flags missing states. Polish
amplifies a sound structure; it cannot rescue a broken one.

## When to invoke

- The user is building or reviewing a product screen / prototype that consumes `@aziontech/webkit`.
- The user asks for "polish", "make this feel better", "deslop", "is this good UX", "review this UI".
- You're about to write UI code on top of webkit and want the constraints loaded up front.

## References

- Token catalog (typography, spacing, color, shape, shadow, animations): [`DESIGN.md`](../../docs/DESIGN.md)
- Component import paths: `packages/webkit/package.json#exports`
  (e.g. `@aziontech/webkit/button`, `/icon-button`, `/dialog`, `/skeleton`, `/message`).
- Discipline rules these skills stay consistent with: [`styling.md`](../../rules/styling.md),
  [`dependencies.md`](../../rules/dependencies.md), [`no-invention.md`](../../rules/no-invention.md),
  [`migration.md`](../../rules/migration.md).
- Class-merge helper: `@aziontech/webkit/utils/cn`.

## Definition of Done

- [ ] The right child skill ran for the task (structure before polish).
- [ ] Every component is from `@aziontech/webkit`; every visual value is a token.
- [ ] Typography uses only `text-*` tokens with correct hierarchy; spacing uses only `--spacing-*`.
- [ ] Motion uses only animate tokens with `motion-reduce:*` escapes.
- [ ] Delight, if present, is a single earned moment — not noise.
