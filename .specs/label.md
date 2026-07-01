---
name: label
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=562-6660
  node_id: 562:6660
checksum: 744bbcf186cef0f22e6259417644544988325d4d720b62a0ab2acd7ea2e6b6b7
created: 2026-06-15
last_updated: 2026-06-15
---

# Label — Component Spec

## Purpose

Form-field label that pairs descriptive text with an optional required indicator. Renders a native `<label>` element so consumers can associate it with any input via the standard `for` attribute. Use it above (or beside) any input control in the `inputs` category to communicate the field name and whether it must be filled. The required indicator is rendered inline as `* (Required)` — the `*` in the primary orange followed by the parenthesized word "(Required)" in muted text — replacing the older `Tag` badge for a lighter typographic signal.

## Usage

```vue
<script setup>
import Label from '@aziontech/webkit/label'
import InputText from '@aziontech/webkit/input-text'
</script>

<template>
  <Label for="email" value="Email" required />
  <InputText id="email" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `value` | `string` | `''` | no | Fallback text when the default slot is empty. |
| `required` | `boolean` | `false` | no | Appends an inline required indicator (`<span aria-hidden>*</span> (Required)`) next to the label text. The `*` uses `var(--primary)`; "(Required)" inherits `var(--text-muted)`. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Label text; falls back to `value` prop when empty. |

## States

- Visual states: `default`, `required`
- `data-required` mirrors the `required` prop

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | `.text-label-sm` |
| color (text) | `var(--text-default)` |
| color (required indicator "(Required)") | `var(--text-muted)` |
| color (required indicator "*") | `var(--primary)` |
| gap (required variant) | `var(--spacing-xxs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `Components/Form Field/Label` (Sora 12 / weight 400 / lh 1.3) | `.text-label-sm` (12px / lh 1.5 / weight 500) | `TODO: tokenizar text-form-label semantic class to match Figma weight 400 + lh 1.3` |

## Accessibility (WCAG 2.1 AA)

- Root is a native `<label>` element; consumers pass `for="<input-id>"` via attrs to associate it with the corresponding control.
- Keyboard map: not focusable (decorative wrapper for native `<label>` semantics); clicking the label focuses the associated input via native browser behavior.
- ARIA: the required indicator is inline text (`* (Required)`). The `*` character is decorative and marked `aria-hidden="true"` so screen readers announce only "(Required)" together with the label text. Consumers that wire the input with `aria-required="true"` keep the programmatic state in sync.
- Contrast ≥4.5:1 between `var(--text-default)` and `var(--bg-canvas)`; the warning tag inherits its own contrast guarantees.
- `motion-reduce:transition-none motion-reduce:transform-none` not applicable (no motion).
- Touch target: label itself is non-interactive; the associated input owns the ≥40×40 px target.

## Stories (Storybook)

- Default
- Required — args delta is `{ required: true }`; justified because the `required` prop is the only variant axis (the spec declares no `kind` and no `size`) and the Default vs Required side-by-side comparison is the component's primary documentation surface.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
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
