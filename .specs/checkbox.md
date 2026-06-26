---
name: checkbox
category: inputs
structure: monolithic
status: implemented
spec_version: 3
checksum: b85ea39c250c1b4be764b637097684e6055cba30118a75d6ce0fc96619cbde98
created: 2026-05-22
last_updated: 2026-06-25
---
# Checkbox — Component Spec

## Purpose

Binary selection control. Supports single boolean (`binary: true`), single-value selection (matches `value` against `modelValue`), and array-based multi-select (used by `MultiSelect` and `DataTable` to drive bulk selection). The new `indeterminate` prop renders a third visual state (horizontal bar) without flipping `aria-checked` — used by parents that own a partial-selection summary (e.g. "select all" rows where some children are selected). Aligned with Figma frame `2027:7311`.

## Usage

```vue
<script setup>
import Checkbox from '@aziontech/webkit/checkbox'

const checked = defineModel({ default: false })
</script>

<template>
  <Checkbox v-model="checked" binary aria-label="Subscribe to newsletter" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `unknown` | `undefined` | no | Two-way bound value. Boolean in `binary` mode, scalar when paired with `value`, array when multi-selecting. |
| `value` | `unknown` | `undefined` | no | Identifier for this checkbox in non-binary mode. Compared against `modelValue` (or included in the array). |
| `binary` | `boolean` | `false` | no | When true, the checkbox toggles `modelValue` as a boolean (no `value` pairing). |
| `indeterminate` | `boolean` | `false` | no | Renders the indeterminate visual (horizontal bar). Does not affect `modelValue`; the parent owns the tri-state logic. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies disabled tokens. |
| `readonly` | `boolean` | `false` | no | Marks the field read-only; value is visible but cannot change via interaction. |
| `inputId` | `string` | `''` | no | Forwarded to the inner `<input id>` for label association. |
| `name` | `string` | `''` | no | HTML name for form submission. |
| `tabindex` | `number` | `0` | no | Forwarded to the inner `<input tabindex>`. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `unknown` | Fires on activation. Payload is the next boolean (binary mode) or the next array (multi mode) or the matched value (single-value mode). |

## Slots

The checkbox is a leaf primitive — no slots. Label/description live in `FieldCheckbox` wrappers.

| Slot | Scope | Notes |
|---|---|---|

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `checked`, `indeterminate`, `disabled`, `readonly`
- `data-state` on the root: `unchecked` | `checked` | `indeterminate`
- `data-checked` mirrors `isChecked` (legacy; kept for backwards compatibility with existing `data-[checked]:` styling)
- `data-indeterminate` mirrors the `indeterminate` prop
- `data-disabled` mirrors the `disabled` prop
- `data-readonly` mirrors the `readonly` prop

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| state change (border / bg / color) | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| surface (unchecked) | `var(--bg-surface)` |
| surface (checked) | `var(--primary)` |
| surface (indeterminate) | `var(--primary)` |
| surface (disabled) | `var(--bg-disabled)` |
| icon (checked / indeterminate) | `var(--primary-contrast)` |
| icon (disabled) | `var(--text-disabled)` |
| border (default) | `var(--border-default)` |
| border (checked) | `var(--primary)` |
| ring (focus) | `var(--ring-color)` |
| ring offset (focus) | `var(--bg-canvas)` |
| shape | `var(--shape-elements)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `--border-width-default` (0.8 px) | `border-[0.8px]` (Tailwind arbitrary) | TODO: catalog `--border-width-default` in DESIGN.md as a semantic primitive shared with Select / MultiSelect / Checkbox. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses; `Space` toggles. (The native `<input type="checkbox">` carries the semantics.)
- ARIA: native `<input type="checkbox">` is the source of truth. `aria-checked` is set to `'mixed'` when `indeterminate` is true (with `indeterminate` DOM property also set on the input). The wrapping `<span>` is decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none` on every transition-bearing class.
- Touch target — the `1.125rem` size is below 40×40 px; consumers should wrap with `FieldCheckbox` or expand the parent click area when the control sits on its own.

## Stories (Storybook)

- Default
- Indeterminate — justification: documents the tri-state visual (horizontal bar) and the `aria-checked="mixed"` semantics added in `spec_version: 3`. Not reachable from any other story.
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
