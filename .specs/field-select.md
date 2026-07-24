---
name: field-select
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=536-22
  node_id: 536:22
checksum: 4dfbb39bbec8d2ef0f8ecab7d8ca38cf4bb084a5aa6caf745d187fd5f0ad5a9f
created: 2026-07-22
last_updated: 2026-07-22
---
# Field Select — Component Spec

## Purpose

Form field wrapper for `Select` that composes `Label`, `Select` (with its `Trigger` + `Content` + `Option` sub-components), and `HelperText` into a single vertical stack with consistent spacing. Use it whenever a select needs a visible label or helper/error message — mirroring `FieldText`'s role for text inputs. Options are supplied via a data prop (`options: { value, label }[]`) so the field owns the rendering; consumers who need slot-based composition can drop to the underlying `Select` compound directly.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import FieldSelect from '@aziontech/webkit/field-select'

const region = ref('')
const options = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' }
]
</script>

<template>
  <FieldSelect
    v-model="region"
    label="Region"
    placeholder="Choose a region"
    helper-text="Choose the closest region for lowest latency."
    :options="options"
    required
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `options` | `Array<{ value: unknown; label: string; disabled?: boolean }>` | `[]` | no | Options rendered inside the dropdown. When empty, the dropdown renders no options. |
| `label` | `string` | `''` | no | Text rendered inside the `Label`. When empty, the label row is omitted. |
| `placeholder` | `string` | `''` | no | Placeholder shown on the trigger when nothing is selected. |
| `helperText` | `string` | `''` | no | Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted **except** when `disabled` is true — in that case the component falls back to the default disabled message so the lock icon always has matching copy. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Size forwarded to the `Select` trigger. Heights: small=28px, medium=32px, large=40px. |
| `multiple` | `boolean` | `false` | no | Switches the component to multi-select; `modelValue` becomes an array. |
| `disabled` | `boolean` | `false` | no | Disables the select and switches the helper to `kind="disabled"` (lock icon). |
| `readonly` | `boolean` | `false` | no | Marks the select read-only; value is visible but the dropdown is locked. |
| `required` | `boolean` | `false` | no | Adds the `Required` tag to the `Label` and sets `aria-required` on the trigger. |
| `invalid` | `boolean` | `false` | no | Switches the helper to `kind="invalid"` and applies invalid border/ring tokens on the trigger. |
| `inputId` | `string` | `''` | no | id for the trigger; consumed by `Label` via `for` and by `aria-describedby` wiring. When empty, the component auto-generates an id via `useId()`. |

## v-model

| Model | Type | Default | Emits | Notes |
|---|---|---|---|---|
| `v-model` | `string \| number \| unknown[]` | `undefined` | `update:modelValue` | Two-way bound selection via `defineModel`. Scalar in single mode; array in multi mode. |

## Events

_No plain events — activation flows through `v-model`._

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Optional override for the rendered options. When absent, the component renders one `Select.Option` per entry in `options`. |

## States

- Visual states: `default`, `required`, `invalid`, `disabled`, `readonly`
- `data-required` mirrors the `required` prop
- `data-invalid` mirrors the `invalid` prop
- `data-disabled` mirrors the `disabled` prop
- `data-readonly` mirrors the `readonly` prop
- `data-size` mirrors the `size` prop

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| _none_ — motion is owned by the underlying `Select` | — | — | — |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| gap (between label / select / helper rows) | `var(--spacing-xs)` |

(Typography and color tokens are owned by the children — `Label`, `Select`, `HelperText` — and not redeclared here.)

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- The `Label`'s native `<label>` is wired to the trigger via `for="<inputId>"`; when the consumer omits `inputId`, the component auto-generates one so the association still works.
- When `helperText` is set (or `disabled` falls back to the locked message), the trigger receives `aria-describedby="<helperId>"` so assistive tech announces the helper alongside the value.
- When `required`, the trigger receives `aria-required="true"`; the visual asterisk/Required tag lives on the `Label`.
- When `invalid`, the trigger receives `aria-invalid="true"` and the helper switches color tokens to the danger family — the helper text remains the human-readable error message.
- When `disabled`, the trigger is disabled, the helper switches to `kind="disabled"` (lock icon) — if `helperText` is empty, the component falls back to the default disabled message `'This field is locked.'` so the lock icon never appears alone — and the label dims via inherited `var(--text-muted)`.
- Keyboard model is owned by the underlying `Select`: Enter/Space/ArrowDown open the dropdown; Arrow keys move focus among options; Enter/Space commit; Escape closes and returns focus to the trigger.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including all derived states.
- Touch target: the underlying `Select` trigger owns the ≥40×40 px hit area at `size="large"`.

## Stories (Storybook)

- Default
- Sizes — composite story rendering all three sizes side by side.
- Required — `required: true`; documents the Label's Required tag plus the trigger's `aria-required` wiring.
- Invalid — `invalid: true` with a sample `helperText`; documents the danger-tokened helper and invalid trigger border.
- Disabled — `disabled: true`; documents the lock-icon helper and disabled trigger tokens.
- Multiple — `multiple: true`; documents the multi-select variant with joined labels on the trigger.

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
