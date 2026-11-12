---
name: textarea
category: inputs
structure: monolithic
status: implemented
spec_version: 4
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4722-6730
  node_id: 4722:6730
checksum: 9dc5f3fe25e89a34eebcd9502f23ce9fb933396df07ccd0894bdb575eed8d6c8
created: 2026-06-23
last_updated: 2026-11-12
---

# Textarea — Component Spec

## Purpose

Collects multi-line free-form text from the user. Sibling of `input` in the `inputs` category; renders a fixed-size (`large`) multi-line field with a minimum height of 80px. The resize axis is controlled by the `resizable` prop (defaults to `vertical`). Native textarea attributes (`rows`, `maxlength`, `name`, etc.) flow through via attribute fallthrough.

## When to use

- Capture multiple lines of free-form text (descriptions, comments, messages).

## When NOT to use

- The value is a single line → use `input`.
- The value is strictly numeric → use `number-input`.

## Related

- `input` — single-line sibling with the same field API.

## Best practices

- Give it a sensible default size; avoid auto-growing beyond the viewport.
- Wrap it in a `Field` for the label, description and error.
- Do not restyle a read-only textarea (dashed border, transparent fill): it is the same filled field, made non-editable; the reason belongs in the field's description.

## Usage

```vue
<script setup>
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Textarea
    v-model="value"
    placeholder="Write your message"
  />

  <!-- Lock the field height, or allow horizontal/both-axes drag -->
  <Textarea
    v-model="value"
    placeholder="Fixed size"
    resizable="none"
  />
  <Textarea
    v-model="value"
    placeholder="Any direction"
    resizable="both"
  />
</template>
```

## Props

| Prop          | Type                                             | Default      | Required | JSDoc                                                                                                                                                                                                                                                                |
| ------------- | ------------------------------------------------ | ------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modelValue`  | `string`                                         | `''`         | false    | Bound value (v-model).                                                                                                                                                                                                                                               |
| `placeholder` | `string`                                         | `''`         | false    | Placeholder shown when the field is empty.                                                                                                                                                                                                                           |
| `disabled`    | `boolean`                                        | `false`      | false    | Disables interaction and applies disabled tokens.                                                                                                                                                                                                                    |
| `readonly`    | `boolean`                                        | `false`      | false    | Marks the field read-only: the value is visible, focusable and copyable but not editable. Keeps the filled field (surface and solid border) with no hover border and a default cursor (`data-readonly`), the same look as `Input`; distinct from the disabled field. |
| `invalid`     | `boolean`                                        | `false`      | false    | Applies invalid styling and sets `aria-invalid`. Combined with `required`, switches to warning border tone.                                                                                                                                                          |
| `required`    | `boolean`                                        | `false`      | false    | Marks the field as required and sets `aria-required`.                                                                                                                                                                                                                |
| `resizable`   | `'vertical' \| 'horizontal' \| 'both' \| 'none'` | `'vertical'` | false    | Which axes the user can drag to resize the field. `none` locks the size; `vertical` keeps the default behavior.                                                                                                                                                      |

## Events

| Event               | Payload  | Notes           |
| ------------------- | -------- | --------------- |
| `update:modelValue` | `string` | v-model update. |

## Slots

_No slots._

## States

- Visual states: `default`, `hover`, `focus`, `filled`, `disabled`, `required` (warning border), `invalid` (danger border), `readonly`
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors the `invalid` prop
- `data-required` mirrors the `required` prop
- `data-readonly` mirrors the `readonly` prop: a read-only textarea keeps the editable field's fill (`var(--bg-surface)`) and solid `var(--border-default)` border, as `Input` does and the design sample draws it; it only drops the hover border and takes a default cursor. The value keeps `var(--text-default)` and the textarea stays focusable. Why the value cannot change is said by the field's description, not by a different chrome.
- `data-filled` mirrors whether `modelValue` is non-empty
- `data-resize` on the native `<textarea>` mirrors the `resizable` prop and drives the `resize-*` Tailwind variant

## Motion & Animations

| Trigger                          | Animation / Transition                    | Token  | Reduced-motion fallback         |
| -------------------------------- | ----------------------------------------- | ------ | ------------------------------- |
| state change (border/background) | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region                 | Token (DESIGN.md)             |
| ---------------------- | ----------------------------- |
| typography             | `.text-body-xs`               |
| surface                | `var(--bg-surface)`           |
| surface (hover, empty) | `var(--bg-surface-raised)`    |
| surface (disabled)     | `var(--bg-disabled)`          |
| text                   | `var(--text-default)`         |
| text (placeholder)     | `var(--text-muted)`           |
| text (disabled)        | `var(--text-disabled)`        |
| border                 | `var(--border-default)`       |
| border (hover)         | `var(--border-strong)`        |
| border (focus)         | `var(--ring-color)`           |
| border (required)      | `var(--warning-border)`       |
| border (invalid)       | `var(--danger-border)`        |
| border width           | `var(--border-width-default)` |
| spacing (padding)      | `var(--spacing-sm)`           |
| shape                  | `var(--shape-elements)`       |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: on `:focus`, a `ring-2` shadow in `var(--ring-color)` plus a `ring-offset-2` in `var(--bg-canvas)` render around the field; the color transition respects `motion-reduce:transition-none`.
- Keyboard map: `Tab` focuses; typing inserts text; `Enter` inserts a newline; `Shift+Tab` moves focus to the previous element.
- Direction: the `<textarea>` renders `dir="auto"` so a value typed in another script keeps its own direction inside right-to-left UI; a `dir` attribute overrides it.
- ARIA: root is a native `<textarea>`; `aria-invalid` mirrors `invalid`; `aria-required` mirrors `required`; `aria-disabled` mirrors `disabled` when applicable.
- Contrast ≥4.5:1 (text) / ≥3:1 (border + icons), including disabled state.
- `motion-reduce:transition-none` on animated state transitions.
- Touch target: field min-height ≥80px ensures adequate hit area.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none.
- Keyboard: no horizontal arrow-key logic.
- User data: the `<textarea>` renders `dir="auto"`; a `dir` attribute overrides it.

## Examples

- Default
- Disabled
- Invalid — justified: `invalid` is a distinct visual state coming from the Figma spec that consumers need to verify in isolation.
- Required — justified: `required` swaps the border to the warning (yellow) token and must be verifiable in isolation.
- ReadOnly — justified: the `readonly` look (filled, non-editable, no hover border) is a top-level prop and not visible from the other examples; shown as a generated value inside a `Field` whose description says why it cannot change.
- Resizable — justified: `resizable` exposes four discrete axis modes (`vertical`, `horizontal`, `both`, `none`); the composite story renders each side by side so the drag-handle affordance and the resulting `resize-*` CSS behavior are verifiable in a single frame.

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
