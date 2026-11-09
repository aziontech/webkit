---
name: radio-button
category: inputs
structure: monolithic
status: implemented
spec_version: 3
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7554
  node_id: 2027:7554
checksum: 88c061595b00e10475f10ee3f79554926a9cfe95903581c91cc8b0f77ae41116
created: 2026-05-22
last_updated: 2026-11-09
---
# Radio Button — Component Spec

## Purpose

Atomic exclusive-choice control only — the circular radio input from Figma (no label, description, or helper). Use `FieldRadio` or `FieldRadioBlock` for labeled layouts.

## When to use

- One choice from a small set of mutually exclusive options whose labels are laid out separately (a table row, a custom option row).
- A custom radio layout that the `field-radio` and `field-radio-block` shapes do not cover.

## When NOT to use

- A radio option in a form that needs its own label, description, or helper text → use `field-radio`.
- Options that need visual weight, such as plans or tiers → use `field-radio-block`, or `box-grid-selection` for a horizontal grid of cards.
- More than one option may be selected → use `checkbox`.
- The options are many or loaded from data → use `select`.

## Related

- `field-radio` — radio with label, description, and disabled helper; the default inside forms.
- `field-radio-block` — card-style radio option with a selected border and background.
- `box-grid-selection` — horizontal grid of selectable cards with its own model.
- `checkbox` — the multi-pick counterpart.
- `select` — single choice from a dropdown when the options do not fit inline.

## Best practices

- Bind every radio in a group to the same `v-model` and give them the same `name`; each one emits its own `value` when selected.
- `value` and `modelValue` are strings; map numeric or object ids to strings before binding.
- Give each radio an accessible name: point a `label` element's `for` at `inputId`, or pass `aria-label`.
- Wrap the group in a `fieldset` with a `legend` so the question itself is announced.

## Usage

```vue
<script setup>
import RadioButton from '@aziontech/webkit/radio-button'
import { ref } from 'vue'

const billing = ref('monthly')
</script>

<template>
  <fieldset>
    <legend>Billing cycle</legend>
    <RadioButton
      v-model="billing"
      name="billing"
      value="monthly"
      input-id="billing-monthly"
      aria-label="Monthly"
    />
    <RadioButton
      v-model="billing"
      name="billing"
      value="yearly"
      input-id="billing-yearly"
      aria-label="Yearly"
    />
  </fieldset>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string` | `undefined` | false | Selected value for v-model. |
| `value` | `string` | `undefined` | false | Option value for this radio instance. |
| `name` | `string` | `undefined` | false | HTML name shared across a mutually exclusive group. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `inputId` | `string` | `undefined` | false | id for the native input; links label to control. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `string` | v-model. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop
- `data-checked` mirrors selected state

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| state change | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| surface | `var(--bg-surface)` |
| primary | `var(--primary)` |
| primary contrast | `var(--primary-contrast)` |
| disabled surface | `var(--bg-disabled)` |
| text (disabled indicator) | `var(--text-disabled)` |
| border | `var(--border-default)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses native input; `Space` selects within group.
- ARIA: native `type="radio"` input with `aria-checked`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

- Default
- Disabled

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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
