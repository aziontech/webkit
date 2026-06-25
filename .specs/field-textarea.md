---
name: field-textarea
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=602-890
  node_id: 602:890
checksum: af3a88985b0b6f200b0c4b0d3f3bc8078df5874c69941bb9a07e8650a7182f25
created: 2026-06-23
last_updated: 2026-06-23
---

# Field Textarea — Component Spec

## Purpose

Labeled multi-line text field — composes `Label`, `InputTextarea`, and `HelperText` into a single form-ready control. Sibling of `field-text` in the `inputs` category; differs by hosting `InputTextarea` (fixed `large` size, vertical resize, 80px min-height) instead of `InputText`.

## Usage

```vue
<script setup>
import FieldTextarea from '@aziontech/webkit/field-textarea'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <FieldTextarea
    v-model="value"
    name="message"
    label="Message"
    placeholder="Write your message"
    helperText="Up to 500 characters."
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string` | `''` | no | Two-way bound value of the underlying InputTextarea. |
| `name` | `string` | `''` | no | HTML name for the underlying textarea (form integration). |
| `label` | `string` | `''` | no | Text rendered inside the Label. When empty, the label row is omitted. |
| `placeholder` | `string` | `''` | no | Placeholder forwarded to the InputTextarea. |
| `helperText` | `string` | `''` | no | Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. |
| `disabled` | `boolean` | `false` | no | Disables the textarea and switches the helper to `kind=disabled` (lock icon). |
| `readonly` | `boolean` | `false` | no | Marks the textarea read-only; value is visible but not editable. Native pass-through. |
| `required` | `boolean` | `false` | no | Adds the Required tag to the Label and sets native required + aria-required on the textarea. |
| `invalid` | `boolean` | `false` | no | Switches the helper to `kind=invalid` and applies invalid border tokens on the textarea. |
| `inputId` | `string` | `''` | no | id for the native textarea; consumed by Label via `for` and by `aria-describedby` wiring. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `string` | v-model update. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus`, `filled`, `disabled`, `required` (warning border + warning helper text), `invalid` (danger border + danger helper text), `readonly`
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-required` mirrors the `required` prop
- `data-readonly` mirrors the `readonly` prop

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| field state change (border / background) | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| field focus padding | `transition-[padding] duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (label) | `.text-label-md` |
| typography (helper) | `.text-body-xs` |
| text (label) | `var(--text-default)` |
| text (helper) | `var(--text-muted)` |
| text (helper, disabled) | `var(--text-disabled)` |
| text (helper, required) | `var(--warning)` |
| text (helper, invalid) | `var(--danger)` |
| spacing (row gap) | `var(--spacing-xs)` |
| spacing (label gap) | `var(--spacing-xs)` |
| spacing (helper gap) | `var(--spacing-xs)` |
| shape | `var(--shape-elements)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: delegated to nested `InputTextarea` (border-color swap to `var(--ring-color)` on `:focus-within`).
- Keyboard map: `Tab` focuses the textarea; typing inserts text; `Enter` inserts a newline; `Shift+Tab` moves focus back.
- ARIA: label associated via `for` / `inputId`; `aria-invalid` mirrors `invalid`; `aria-required` mirrors `required`; helper text is associated to the textarea via `aria-describedby` when present.
- Contrast ≥4.5:1 (text) / ≥3:1 (border + icons), including the disabled state.
- `motion-reduce:transition-none` on animated state transitions inherited from `InputTextarea`.
- Touch target: field min-height ≥80px ensures adequate hit area.

## Stories (Storybook)

- Required — justified: `required` switches the border and helper text to the warning (yellow) tone; the story isolates that state.
- Invalid — justified: `invalid` switches the border and helper text to the danger (red) tone; the story isolates that state.

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
