---
name: input-password
category: inputs
structure: monolithic
status: implemented
spec_version: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10788&m=dev
  node_id: 3714:10788
checksum: 1d3c90da9350a44450dbd0ca74a8296a0dae01cfeb55acff1203e685358ccc76
created: 2026-06-16
last_updated: 2026-06-16
---

# Input Password — Component Spec

## Purpose

Single-line password input for forms. Renders a bordered field with a built-in visibility toggle button on the trailing edge that flips the native `type` between `password` and `text`. Shares the visual language of `InputText` (same heights, borders, focus ring, disabled treatment). The component is the field only — labels, helper text, and strength meters live in the wrapping form-field layer.

Aligned with Figma frame `3714:10788` (Webkit / InputPassword). Token mapping inferred from the `input-text` sibling because the Figma MCP read tools were unreachable during spec authoring; reconciliation must verify against the frame at scaffold time.

## Usage

```vue
<script setup>
import InputPassword from '@aziontech/webkit/inputs/input-password'
import { ref } from 'vue'

const password = ref('')
</script>

<template>
  <InputPassword
    v-model="password"
    placeholder="Enter your password"
    autocomplete="current-password"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string` | `undefined` | no | Two-way bound value of the field. |
| `placeholder` | `string` | `undefined` | no | Placeholder shown when the field is empty. |
| `maxLength` | `number` | `undefined` | no | Native `maxlength` — maximum number of characters allowed. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies disabled tokens. The toggle button inherits the disabled state. |
| `readonly` | `boolean` | `false` | no | Marks the field read-only; value is visible but not editable. Toggle button stays operable. |
| `required` | `boolean` | `false` | no | Marks the field as required; sets native `required` and `aria-required`. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component. |
| `invalid` | `boolean` | `false` | no | Applies the invalid border + ring tokens and sets `aria-invalid`. |
| `toggleable` | `boolean` | `true` | no | When true, renders the visibility toggle button on the trailing edge of the field. When false, the field behaves as a plain password input with no toggle and the `iconRight` slot becomes available. |
| `autocomplete` | `'current-password' \| 'new-password' \| 'off'` | `'current-password'` | no | Native `autocomplete` hint for password managers. Use `new-password` for sign-up and password-change flows. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `string` | Emitted on native `input` event with the new value. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `iconLeft` | — | Leading icon rendered inside the field, before the input. Hidden from assistive tech (`aria-hidden="true"`). |
| `iconRight` | — | Trailing icon rendered inside the field, after the input. **Only honored when `toggleable=false`** — the visibility toggle occupies this slot when enabled. Hidden from assistive tech (`aria-hidden="true"`). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`
- Single fixed height: 40px (large only)
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-required` mirrors the `required` prop; drives the warning-border treatment
- `data-has-icon-left` mirrors `$slots.iconLeft` presence
- `data-has-icon-right` mirrors `$slots.iconRight` presence (only relevant when `toggleable=false`)
- `data-toggleable` mirrors the `toggleable` prop
- `data-visible` on the root mirrors the internal visibility state (`true` when the password is revealed as plain text)
- `filled` is detected via the native `:not(:placeholder-shown)` selector — no JS state

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| state change (border/ring/bg) | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |
| toggle icon swap (visible ↔ hidden) | `transition-opacity duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | `.text-label-sm` |
| surface | `var(--bg-surface)` |
| surface (disabled) | `var(--bg-disabled)` |
| text | `var(--text-default)` |
| text (placeholder/muted) | `var(--text-muted)` |
| text (disabled) | `var(--text-disabled)` |
| border (default) | `var(--border-default)` |
| border (hover) | `var(--border-strong)` |
| border (invalid) | `var(--danger-border)` |
| border (required) | `var(--warning-border)` |
| ring (focus) | `var(--ring-color)` |
| spacing (padding-left) | `var(--spacing-md)` |
| spacing (padding-right) | `var(--spacing-xxs)` |
| spacing (gap between icon and input) | `var(--spacing-xs)` |
| shape | `var(--shape-elements)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` — applied via `focus-within` on the field wrapper so the ring covers the whole control including icon slots and the visibility toggle.
- Keyboard map: `Tab` focuses the input, then the visibility toggle button (when `toggleable=true`); `Enter` / `Space` on the toggle flips visibility; standard text-editing keys apply to the input.
- ARIA: the visibility toggle is a `<button type="button">` with `aria-pressed` reflecting the current visible state and an `aria-label` that switches between "Show password" and "Hide password"; `aria-invalid` is bound to the `invalid` prop; `aria-required` to the `required` prop; decorative icon slots and the eye glyph are `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including disabled state.
- `motion-reduce:transition-none` on every transition-bearing class.
- Touch target ≥40×40 px for both the input and the toggle button (the component renders at a single fixed height of 40px).
- The toggle button never submits the surrounding form (`type="button"`).

## Stories (Storybook)

- Default
- Toggle — justification: composite story rendering `toggleable=true` (default) and `toggleable=false` side by side; documents the built-in toggle behavior, which is the defining feature of this component vs `InputText`.
- IconLeft — justification: documents the `iconLeft` slot, which is the only icon slot honored when `toggleable=true`.
- Filled — justification: pre-populated `modelValue` shows the filled visual state and the masked rendering; not visible from the Default story.
- Invalid — justification: documents the `invalid` visual treatment, which is a top-level prop with distinct token bindings.
- MaxLength — justification: documents `maxLength` as a hard character cap; behavior is invisible from props alone and only observable while typing.
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
