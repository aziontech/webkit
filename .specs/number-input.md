---
name: number-input
category: input
structure: monolithic
status: implemented
spec_version: 5
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10789&m=dev
  node_id: 3714:10789
checksum: a2f61ef80c5db9e1ca822f5390b0c232e814b05e024ddc14582e5a6d99c078b7
created: 2026-06-22
last_updated: 2026-11-19
---

# Input Number — Component Spec

## Purpose

Numeric input field with optional increment/decrement spinner buttons. Use when the value is strictly numeric (counts, quantities, ports, thresholds, currency without formatting). Distinct from `input` because it enforces numeric type, supports `min`/`max`/`step`, and renders chevron-up/chevron-down controls on the trailing edge.

## When to use

- Capture a strictly numeric value (counts, quantities, ports, prices).

## When NOT to use

- The value is free text → use `input`.
- The user picks from a fixed set of numbers → use `select`.

## Related

- `input` — free-text sibling with the same field API.

## Best practices

- Set `min` / `max` / `step` to constrain input rather than validating after the fact.
- Use `inputmode="numeric"` semantics for mobile keyboards.
- Set `nullable` on an optional field (a port, a limit) so a cleared field stays unset (`null`) instead of falling back to `min ?? 0`.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import NumberInput from '@aziontech/webkit/number-input'

  const value = ref(1)
</script>

<template>
  <NumberInput
    v-model="value"
    :min="0"
    :max="100"
    :step="1"
    placeholder="Quantity"
  />
</template>
```

An optional field binds a `number | null` model and sets `nullable`:

```vue
<script setup>
  import { ref } from 'vue'
  import NumberInput from '@aziontech/webkit/number-input'

  const port = ref(null)
</script>

<template>
  <NumberInput
    v-model="port"
    nullable
    :min="1"
    :max="65535"
    placeholder="Default port"
  />
</template>
```

## Props

| Prop          | Type                             | Default     | Required | JSDoc                                                               |
| ------------- | -------------------------------- | ----------- | -------- | ------------------------------------------------------------------- |
| `placeholder` | `string`                         | `''`        | false    | Text shown when the input is empty.                                 |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'`  | false    | Size token; affects height, padding, and typography.                |
| `disabled`    | `boolean`                        | `false`     | false    | Disables interaction and applies disabled tokens.                   |
| `readonly`    | `boolean`                        | `false`     | false    | Marks the field as read-only; spinner buttons are inert.            |
| `invalid`     | `boolean`                        | `false`     | false    | Applies the invalid border/ring tokens.                             |
| `required`    | `boolean`                        | `false`     | false    | Marks the field as required for assistive tech.                     |
| `min`         | `number \| undefined`            | `undefined` | false    | Minimum allowed value; spinner stops at this bound.                 |
| `max`         | `number \| undefined`            | `undefined` | false    | Maximum allowed value; spinner stops at this bound.                 |
| `step`        | `number`                         | `1`         | false    | Increment used by the spinner buttons and arrow keys.               |
| `showButtons` | `boolean`                        | `true`      | false    | Renders the chevron-up/chevron-down spinner controls.               |
| `nullable`    | `boolean`                        | `false`     | false    | Lets a cleared field emit null instead of falling back to min or 0. |

## v-model

| Model     | Type                                        | Default | Emits               | Notes                                                                                                                                                                                                                                                                                                                                                                              |
| --------- | ------------------------------------------- | ------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `number` (`number \| null` with `nullable`) | `0`     | `update:modelValue` | The value via `defineModel`, clamped to `min`/`max`; updates on typing and on the spinner. A cleared field falls back to `min ?? 0`; with `nullable` it emits `null` and shows the placeholder, and the spinner on a `null` value starts at `min ?? 0` (clamped). The component is generic over `nullable`, so the model and `change` are typed `number` unless `nullable` is set. |

## Events

| Event    | Payload  | Notes                                                                                                                             |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `change` | `number` | Emitted when the user commits the value (blur or Enter). With `nullable` the payload is `null` when the field is committed empty. |

## Slots

| Slot       | Scope | Notes                                                                    |
| ---------- | ----- | ------------------------------------------------------------------------ |
| `leading`  | —     | Content rendered before the input (e.g. `$`). Both slots: `aria-hidden`. |
| `trailing` | —     | Content rendered after the input, before the spinner buttons (e.g. `%`). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`, `readonly`, `invalid`, `filled`, `empty` (a `nullable` field whose value is `null` shows the placeholder)
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-readonly` mirrors the `readonly` prop (no hover border, default cursor, as on `Input`)
- `data-size` mirrors the `size` prop
- The frame, its states, adornments and touch target are the private frame `Input` renders

## Motion & Animations

| Trigger                            | Animation / Transition                    | Token                    | Reduced-motion fallback         |
| ---------------------------------- | ----------------------------------------- | ------------------------ | ------------------------------- |
| state change (hover/focus/invalid) | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region             | Token (DESIGN.md)       |
| ------------------ | ----------------------- |
| typography         | `.text-label-sm`        |
| surface            | `var(--bg-surface)`     |
| text               | `var(--text-default)`   |
| placeholder        | `var(--text-muted)`     |
| spacing.x          | `var(--spacing-md)`     |
| shape              | `var(--shape-control)`  |
| ring               | `var(--ring-color)`     |
| ring-offset        | `var(--bg-canvas)`      |
| border             | `var(--border-default)` |
| border (hover)     | `var(--border-strong)`  |
| border (invalid)   | `var(--danger-border)`  |
| surface (disabled) | `var(--bg-disabled)`    |
| text (disabled)    | `var(--text-disabled)`  |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2` on `var(--input-ring-offset, var(--bg-canvas))`, as on `Input`
- Keyboard map: `Tab` focuses the input; `ArrowUp`/`ArrowDown` increment/decrement by `step`; `Home`/`End` jump to `min`/`max` when defined; `Enter` commits and emits `change`.
- Direction: the `<input>` renders `dir="auto"` (digits resolve to left-to-right inside right-to-left UI); a `dir` attribute overrides it.
- ARIA: `role="spinbutton"` on the input (native `<input type="number">` provides this); `aria-valuenow`, `aria-valuemin`, `aria-valuemax` mirror the props; `aria-invalid` mirrors `invalid`; `aria-required` mirrors `required`; spinner buttons have `aria-label` ("Increment" / "Decrement") and `tabindex="-1"` so keyboard users use arrow keys.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none` on animated state changes.
- Touch target: on a coarse pointer the two steppers sit side by side in an 80 px column (about 40 px each), and each carries an invisible `aria-hidden` child (`data-slot="touch-target"`) shown only under `pointer-coarse:` that extends its hit area to 44 px tall (the frame stops clipping on a coarse pointer so the hit area is not cut). On a fine pointer the steppers stay stacked at the drawn size; arrow keys are the primary interaction. The field also has `Input`'s touch target; a press on the frame focuses the input.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the stepper buttons point up and down and do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: the `<input>` renders `dir="auto"`; a `dir` attribute overrides it.

## Responsive

- Touch: on coarse pointers (`pointer-coarse:`) the typed text steps up to 16 px (`text-body-md`; `text-label-code-lg` in the code face), so iOS Safari does not zoom the page when the field takes focus; fine pointers keep the dense size.

## Examples

- Default
- Sizes — composite story rendering every `size` value side-by-side.
- Disabled
- Invalid — justified: invalid is a primary visual state in Figma (8 of 27 variants) and the consumer needs a copy-pasteable example with the danger border applied.
- Optional — justified: `nullable` changes the model contract (a cleared field emits `null`), and an optional port needs a copy-pasteable example of that contract.

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
