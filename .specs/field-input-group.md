---
name: field-input-group
category: inputs
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-3395
  node_id: 2027:3395
checksum: 90f088a90def23016c578d3b57a2808a1571a9ba98763db8756ac707281a6129
created: 2026-06-25
last_updated: 2026-06-25
---

# Field Input Group — Component Spec

## Purpose

Inline text field that attaches prepend and append decoration directly inside the field border — for units, currency symbols, or trailing action elements. Use it over `input-text` when the value needs adjacent fixed content; it carries the same label, helper text, disabled, readonly, and invalid affordances as the other `field-*` inputs.

## Usage

```vue
<script setup>
import FieldInputGroup from '@aziontech/webkit/field-input-group'
</script>

<template>
  <FieldInputGroup
    v-model="amount"
    label="Amount"
    placeholder="0.00"
    helper-text="Monthly spend in USD"
  >
    <template #prepend>$</template>
    <template #append>USD</template>
  </FieldInputGroup>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string` | `undefined` | no | Text value for v-model. |
| `label` | `string` | `''` | no | Label text shown above the field. |
| `helperText` | `string` | `''` | no | Helper text shown below the field; muted, or locked when disabled. |
| `placeholder` | `string` | `''` | no | Placeholder text for the native input. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | no | Makes the input read-only. |
| `invalid` | `boolean` | `false` | no | Applies danger border and danger helper text. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `string` | v-model; fires on native input. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `prepend` | — | Decoration attached inside the leading edge of the field. |
| `append` | — | Decoration attached inside the trailing edge of the field. |

## States

- Visual states: `default`, `hover`, `focus-within`, `disabled`, `invalid`
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (label) | `.text-label-sm` |
| typography (input) | `.text-body-md` |
| typography (helper) | `.text-body-sm` |
| typography (prepend/append) | `.text-body-md` |
| text | `var(--text-default)` |
| text (muted) | `var(--text-muted)` |
| text (disabled) | `var(--text-disabled)` |
| surface | `var(--bg-surface)` |
| surface (disabled) | `var(--bg-disabled)` |
| border | `var(--border-default)` |
| border (invalid) | `var(--danger-border)` |
| danger text | `var(--danger)` |
| ring | `var(--ring-color)` |
| ring offset | `var(--bg-canvas)` |
| shape | `var(--shape-elements)` |
| spacing (gap) | `var(--spacing-xs)` |
| spacing (input x) | `var(--spacing-sm)` |
| spacing (segment x) | `var(--spacing-sm)` |
| spacing (helper gap) | `var(--spacing-xxs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-within:ring-2 focus-within:ring-[var(--ring-color)] focus-within:ring-offset-1 focus-within:ring-offset-[var(--bg-canvas)]` on the field shell.
- Keyboard map: `Tab` focuses the input; typing edits the value.
- ARIA: label associated to the input via `for` / `id` (`useId`); `aria-invalid` set when `invalid`; helper text linked via `aria-describedby` when present.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled and invalid states.
- Touch target ≥40×40 px via the field height.

## Stories (Storybook)

- Default — the labelled field with helper text. Baseline render.
- WithPrependAppend — the `prepend` and `append` slots filled side by side; the slots are the component's defining feature and have no single-value composite axis, so one story demonstrates both at once.
- Disabled — `disabled` is a mutually-exclusive boolean state that swaps surface tokens and shows the lock affordance before the helper text.
- Invalid — `invalid` is a mutually-exclusive boolean state that applies the danger border and danger helper text.

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
