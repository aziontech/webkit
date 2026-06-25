---
name: field-text
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=536-22
  node_id: 536:22
checksum: f42720d41e452876ff8c867f8ab2a37cf4ae6ea2c2b1d82aa258f653507d72d1
created: 2026-06-15
last_updated: 2026-06-15
---
# Field Text — Component Spec

## Purpose

Form field for free-text input that composes `Label`, `InputText`, and `HelperText` into a single vertical stack with consistent spacing. Use it whenever a text input needs a visible label or helper/error message — i.e. virtually every form field outside of inline editing. Aligned with Figma frame `536:22` (FieldText) and acts as the canonical wrapper for `InputText` in form contexts.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import FieldText from '@aziontech/webkit/inputs/field-text'

const email = ref('')
</script>

<template>
  <FieldText
    v-model="email"
    label="Email"
    placeholder="you@example.com"
    helper-text="We'll never share your email."
    required
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string` | `''` | no | Two-way bound value of the underlying `InputText`. |
| `label` | `string` | `''` | no | Text rendered inside the `Label`. When empty, the label row is omitted. |
| `placeholder` | `string` | `''` | no | Placeholder forwarded to the `InputText`. |
| `helperText` | `string` | `''` | no | Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted **except** when `disabled` is true — in that case the component falls back to a default disabled message so the lock icon always has matching copy. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Size forwarded to the `InputText`. Heights: small=28px, medium=32px, large=40px. |
| `disabled` | `boolean` | `false` | no | Disables the input and switches the helper to `kind="disabled"` (lock icon). |
| `readonly` | `boolean` | `false` | no | Marks the input read-only; value is visible but not editable. Native pass-through. |
| `required` | `boolean` | `false` | no | Adds the `Required` tag to the `Label` and sets native `required` + `aria-required` on the input. |
| `invalid` | `boolean` | `false` | no | Switches the helper to `kind="invalid"` and applies invalid border/ring tokens on the input. |
| `inputId` | `string \| null` | `null` | no | id for the native input; consumed by `Label` via `for` and by `aria-describedby` wiring. |
| `name` | `string \| null` | `null` | no | HTML name for the underlying input (form + vee-validate integration). |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `string` | Re-emitted from the underlying `InputText` on every input event. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `iconLeft` | — | Forwarded to the underlying `InputText#iconLeft` slot. |
| `iconRight` | — | Forwarded to the underlying `InputText#iconRight` slot. |

## States

- Visual states: `default`, `required`, `invalid`, `disabled`
- `data-required` mirrors the `required` prop
- `data-invalid` mirrors the `invalid` prop
- `data-disabled` mirrors the `disabled` prop
- `data-size` mirrors the `size` prop

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| _none_ — motion is owned by the underlying `InputText` | — | — | — |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| gap (between label / input / helper rows) | `var(--spacing-xs)` |

(Typography and color tokens are owned by the children — `Label`, `InputText`, `HelperText` — and not redeclared here.)

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- The `Label`'s native `<label>` is wired to the input via `for="<inputId>"`; when the consumer omits `inputId`, the component auto-generates one (via `useId()` or equivalent) so the association still works.
- When `helperText` is set, the input receives `aria-describedby="<helperId>"` so assistive tech announces the helper alongside the value.
- When `required`, the input receives native `required` + `aria-required="true"`; the visual asterisk/Required tag lives on the `Label`.
- When `invalid`, the input receives `aria-invalid="true"` and the helper switches color tokens to `var(--danger-contrast)` — the helper text remains the human-readable error message.
- When `disabled`, the input is disabled, the helper switches to `kind="disabled"` (lock icon) — if `helperText` is empty, the component falls back to the default disabled message `'This field is locked.'` so the lock icon never appears alone — and the label dims via inherited `var(--text-muted)`.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including all derived states.
- Touch target: the underlying `InputText` owns the ≥40×40 px hit area at `size="large"`.

## Stories (Storybook)

- Default
- Sizes — composite story rendering all three sizes side by side.
- Required — `required: true`; documents the Label's Required tag plus the input's `aria-required` wiring.
- Invalid — `invalid: true` with a sample `helperText`; documents the danger-tokened helper and invalid input border.
- Disabled — `disabled: true`; documents the lock-icon helper and disabled input tokens.
- Icons — composite story forwarding `#iconLeft` and `#iconRight` slots (with `pi pi-globe` + `pi pi-times`), to document the slot forwarding to the underlying `InputText`.

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
