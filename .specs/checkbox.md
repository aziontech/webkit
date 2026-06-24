---
name: checkbox
category: inputs
structure: monolithic
status: approved
spec_version: 3
checksum: fc610ab0930da58bac5c91f25e9e06bfaee49a4693a16f840563c0ee9dc4063a
created: 2026-05-22
last_updated: 2026-06-24
---

# Checkbox — Component Spec

## Purpose

Square checkbox control only — the box, the native input, and the check glyph, with no label or description chrome. Use it when you compose your own label, or reach for `FieldCheckbox` / `FieldCheckboxBlock` when you want built-in text. Supports a single boolean (`binary`) or collecting a `value` into an array model.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import Checkbox from '@aziontech/webkit/checkbox'

const accepted = ref(false)
</script>

<template>
  <label class="inline-flex items-center gap-[var(--spacing-2)]">
    <Checkbox v-model="accepted" binary input-id="accept-terms" />
    Accept terms
  </label>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `unknown` | `undefined` | no | Bound value: a boolean in `binary` mode, otherwise the array/value the control reflects. |
| `value` | `unknown` | `undefined` | no | This checkbox's value, added to or removed from the model array when not `binary`. |
| `binary` | `boolean` | `false` | no | Toggles a single boolean instead of collecting `value` into an array. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | no | Prevents changes while the control stays focusable. |
| `inputId` | `string` | `undefined` | no | Forwarded to the native input `id`; pair with an external label's `for`. |
| `name` | `string` | `undefined` | no | HTML name for form submission. |
| `tabindex` | `number` | `undefined` | no | Tab order for the native input. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `unknown` | Emitted on toggle; payload is the next boolean (`binary`) or the updated value array. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `readonly`, `checked`
- `data-checked` mirrors the checked state
- `data-disabled` mirrors the `disabled` prop
- `data-readonly` mirrors the `readonly` prop

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover / active state change | `transition-opacity duration-fast-02 ease-productive-entrance` on the hover/active ghost overlays | semantic (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| surface | `var(--bg-surface)` |
| border | `var(--border-default)` |
| checked surface | `var(--primary)` |
| checked glyph | `var(--primary-contrast)` |
| shape | `var(--shape-button)` |
| hover overlay | `var(--bg-hover)` |
| active overlay | `var(--bg-active)` |
| disabled surface | `var(--bg-disabled)` |
| disabled glyph | `var(--text-disabled)` |
| ring | `var(--ring-color)` |
| ring offset | `var(--bg-canvas)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: descendant native input drives the ring — `has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--ring-color)] has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses the native input; `Space` toggles checked state (native checkbox behavior).
- ARIA: renders a real `<input type="checkbox">` with `aria-checked`; control-only, so associate copy via `inputId` + an external label `for`, or use `FieldCheckbox`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none` on the animated ghost overlays.
- Touch target: the box is 1.125rem (18px) — justified deviation for a control-only primitive; the larger ≥40×40 px hit area is provided by the field wrappers (`FieldCheckbox` / `FieldCheckboxBlock`) or the consumer's label.

## Stories (Storybook)

- Default
- Disabled — demonstrates the `disabled` prop (checked and unchecked).

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
