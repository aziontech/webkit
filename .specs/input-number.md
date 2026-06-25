---
name: input-number
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10789&m=dev
  node_id: 3714:10789
checksum: 8449ce81cf99775068ba3af50021f6da330a39244f31afaf9bd2c578f546aa14
created: 2026-06-22
last_updated: 2026-06-22
---

# Input Number — Component Spec

## Purpose

Numeric input field with optional increment/decrement spinner buttons. Use when the value is strictly numeric (counts, quantities, ports, thresholds, currency without formatting). Distinct from `input-text` because it enforces numeric type, supports `min`/`max`/`step`, and renders chevron-up/chevron-down controls on the trailing edge.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import InputNumber from '@aziontech/webkit/input-number'

const value = ref(1)
</script>

<template>
  <InputNumber v-model="value" :min="0" :max="100" :step="1" placeholder="Quantity" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `number` | `0` | no | v-model value (always numeric; cleared input falls back to `min ?? 0`). |
| `placeholder` | `string` | `''` | no | Text shown when the input is empty. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | no | Marks the field as read-only; spinner buttons are inert. |
| `invalid` | `boolean` | `false` | no | Applies the invalid border/ring tokens. |
| `required` | `boolean` | `false` | no | Marks the field as required for assistive tech. |
| `min` | `number \| null` | `null` | no | Minimum allowed value; spinner stops at this bound. |
| `max` | `number \| null` | `null` | no | Maximum allowed value; spinner stops at this bound. |
| `step` | `number` | `1` | no | Increment used by the spinner buttons and arrow keys. |
| `showButtons` | `boolean` | `true` | no | Renders the chevron-up/chevron-down spinner controls. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `number` | Emitted on every value change (typing or spinner). |
| `change` | `number` | Emitted when the user commits the value (blur or Enter). |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `prefix` | — | Content rendered before the input (e.g. `R$`). |
| `suffix` | — | Content rendered after the input, before the spinner buttons (e.g. `%`). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`, `invalid`, `filled`
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-size` mirrors the `size` prop

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| state change (hover/focus/invalid) | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | `.text-label-sm` |
| surface | `var(--bg-surface)` |
| text | `var(--text-default)` |
| placeholder | `var(--text-muted)` |
| spacing.x | `var(--spacing-md)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |
| ring-offset | `var(--bg-canvas)` |
| border | `var(--border-default)` |
| border (hover) | `var(--border-strong)` |
| border (invalid) | `var(--danger-border)` |
| border (required) | `var(--warning-border)` |
| surface (disabled) | `var(--bg-disabled)` |
| text (disabled) | `var(--text-disabled)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses the input; `ArrowUp`/`ArrowDown` increment/decrement by `step`; `Home`/`End` jump to `min`/`max` when defined; `Enter` commits and emits `change`.
- ARIA: `role="spinbutton"` on the input (native `<input type="number">` provides this); `aria-valuenow`, `aria-valuemin`, `aria-valuemax` mirror the props; `aria-invalid` mirrors `invalid`; `aria-required` mirrors `required`; spinner buttons have `aria-label` ("Increment" / "Decrement") and `tabindex="-1"` so keyboard users use arrow keys.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none` on animated state changes.
- Touch target ≥40×40 px on the large size; spinner buttons remain ≥24×24 px on `small`/`medium` per Figma — justified because arrow keys provide the primary interaction.

## Stories (Storybook)

- Default
- Sizes — composite story rendering every `size` value side-by-side.
- Disabled
- Invalid — justified: invalid is a primary visual state in Figma (8 of 27 variants) and the consumer needs a copy-pasteable example with the danger border applied.

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
