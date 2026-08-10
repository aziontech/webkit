---
name: hint
category: inputs
structure: monolithic
status: implemented
spec_version: 1
checksum: 3eef5bcfb41626dae8714fcbaad1a169ab9a5f18190e9bd89848ab6682017d3e
created: 2026-08-10
last_updated: 2026-08-10
---

# Hint — Component Spec

## Purpose

Small info affordance — a muted `pi pi-info-circle` glyph on a focusable button — that reveals one short explanation on hover or focus, through `Tooltip`. It is the standard way to attach a "why does this matter?" note to a field name without spending a line of vertical space on it, and it is what `Label`'s `hint` prop renders.

## When to use

- A field, switch or setting whose name is clear but whose consequence is not (what "Sensitive" does to a stored value).
- A short, self-contained sentence — one that reads fine in a tooltip and is not needed to complete the field.
- Beside a label, a section heading, or a table column header, where a permanent line of helper text would add noise.

## When NOT to use

- Guidance the user needs while typing, or any validation message → use `helper-text` (it stays on screen and is wired with `aria-describedby`).
- More than a sentence, links, or formatted content → use `popover`, which is dismissible and can hold real content.
- A plain description of an action already labelled by a control → use `tooltip` directly on that control.

## Related

- `tooltip` — the overlay `Hint` composes; reach for it when the trigger is an existing control rather than a standalone info glyph.
- `helper-text` — persistent guidance under a field; the right choice when the text must always be visible.
- `label` — renders `Hint` from its own `hint` prop, so a field name and its note stay one component.

## Best practices

- One sentence, ending in a period. If it needs two, it belongs in `helper-text` or a `popover`.
- Never hide required information behind a hint — hover is not discoverable on touch, so treat it as an enhancement.
- The `text` doubles as the button's accessible name, so write it as prose a screen reader can read verbatim.
- Place it immediately after the thing it explains, not at the end of a row.

## Usage

```vue
<script setup>
  import Hint from '@aziontech/webkit/hint'
</script>

<template>
  <Hint text="Values are encrypted at rest and never displayed again after saving." />
</template>
```

## Props

| Prop        | Type                                               | Default | Required | JSDoc                                                                         |
| ----------- | -------------------------------------------------- | ------- | -------- | ----------------------------------------------------------------------------- |
| `text`      | `string`                                           | `''`    | yes      | Guidance text revealed on hover or focus; also the trigger's accessible name. |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left' \| 'auto'` | `'top'` | no       | Anchor side of the tooltip relative to the glyph.                             |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`
- `data-state` values (on the root, owned by `Tooltip`): `open` | `closed`
- `data-placement` (on the root, owned by `Tooltip`): `top` | `right` | `bottom` | `left`

## Motion & Animations

| Trigger                     | Animation / Transition                    | Token  | Reduced-motion fallback         |
| --------------------------- | ----------------------------------------- | ------ | ------------------------------- |
| hover / focus (glyph color) | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

The tooltip's own open/close motion belongs to `tooltip` and is specified there.

## Tokens

| Region           | Token (DESIGN.md)     |
| ---------------- | --------------------- |
| glyph typography | `.text-body-xs`       |
| color (rest)     | `var(--text-muted)`   |
| color (hover)    | `var(--text-default)` |
| radius           | `var(--shape-button)` |
| focus ring       | `var(--ring-color)`   |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The trigger is a native `<button type="button">`, so it is in the tab order and the tooltip opens on `focus` as well as hover (`Tooltip` opens on `focusin`).
- The glyph is decorative (`aria-hidden="true"`); the button's accessible name is the `text` prop, so the hint is reachable by screen readers that never see the tooltip.
- Keyboard map: `Tab` moves focus to the glyph and opens the tooltip; `Escape` closes it (owned by `Tooltip`); the button has no activation behaviour.
- The button's default action is prevented on click, so a `Hint` rendered inside a `<label>` never toggles the labelled control.
- Contrast ≥4.5:1 between `var(--text-muted)` and `var(--bg-canvas)`; the focus ring uses `var(--ring-color)` at 2px with an offset.
- Touch target: the glyph is a 20×20 px affordance placed inline with 12 px label text; it is an enhancement, never the only path to the information.

## Stories (Storybook)

- Default
- Placements — composite story over the `placement` axis, rendering the four anchors side by side (closed; each one opens on hover, never forced open). Justified because `placement` is the component's only variant axis and one canvas covering all four anchors is its primary documentation surface.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=label]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
