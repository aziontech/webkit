---
name: multi-select
category: inputs
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3899-29362
  node_id: 3899:29362
checksum: d09abad86d8142fd46aeff9846f4ea43102244ec987b5d5a46b93c92a3d588de
created: 2026-06-25
last_updated: 2026-06-25
---

# MultiSelect — Component Spec

## Purpose

Select control specialised for choosing many options from a list. The trigger field mirrors `InputText`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a MultiSelect sits next to other form fields without visual drift. The dropdown is rendered via the native Popover API + CSS anchor positioning — no `@floating-ui` runtime. Every option row carries a checkbox indicator (the `Checkbox` webkit component), optionally a leading slot/icon and a trailing tag. Search and "Create new" footer are exposed as slots on `<MultiSelectContent>`. Unlike `Select` (which toggles between single and multi via a `multiple` prop), MultiSelect is multi-only: `modelValue` is always an array and the indicator is always a checkbox.

Aligned with Figma frame `3899:29362` (options panel). The trigger reuses the `InputText`/`Select` trigger visuals.

## Usage

```vue
<script setup>
import MultiSelect from '@aziontech/webkit/multi-select'
import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
import MultiSelectContent from '@aziontech/webkit/multi-select-content'
import MultiSelectGroup from '@aziontech/webkit/multi-select-group'
import MultiSelectOption from '@aziontech/webkit/multi-select-option'

const value = defineModel({ default: () => [] })
</script>

<template>
  <MultiSelect v-model="value" size="medium" placeholder="Select options">
    <MultiSelectTrigger />
    <MultiSelectContent>
      <MultiSelectGroup label="Group A">
        <MultiSelectOption value="opt-1">Option 1</MultiSelectOption>
        <MultiSelectOption value="opt-2">Option 2</MultiSelectOption>
      </MultiSelectGroup>
      <MultiSelectGroup label="Group B">
        <MultiSelectOption value="opt-3" icon="pi pi-heart">Option 3</MultiSelectOption>
      </MultiSelectGroup>
    </MultiSelectContent>
  </MultiSelect>
</template>
```

## Sub-components

- `multi-select-trigger/multi-select-trigger.vue` — Bordered trigger field with optional left icon slot, selected-value label (comma-joined labels or count, see `displayValue`), and chevron-down. Mirrors `InputText` size/state visuals.
- `multi-select-content/multi-select-content.vue` — Popover panel rendered via the native Popover API + CSS anchor positioning; exposes `#search` and `#footer` slots and scrolls its option list when content exceeds `max-h-[320px]`.
- `multi-select-group/multi-select-group.vue` — Section wrapper for a labelled group of options; renders an overline-style heading when `label` is set.
- `multi-select-option/multi-select-option.vue` — Selectable option row with a checkbox indicator (the `Checkbox` webkit component), an optional `icon` (PrimeIcons), an optional leading `#left` slot, the option label, and an optional trailing `#tag` slot.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `unknown[]` | `() => []` | no | Two-way bound selection. Always an array; each item is the `value` of a selected `<MultiSelectOption>`. |
| `open` | `boolean` | `undefined` | no | Controlled open state for the dropdown. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `false` | no | Initial open state when uncontrolled. |
| `placeholder` | `string` | `''` | no | Trigger placeholder shown when no option is selected. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Size token; affects trigger height (small=28px, medium=32px, large=40px) matching `InputText`. |
| `disabled` | `boolean` | `false` | no | Disables the trigger and prevents opening; applies disabled tokens. |
| `readonly` | `boolean` | `false` | no | Marks the field read-only; the current selection is visible but the dropdown cannot open. |
| `required` | `boolean` | `false` | no | Marks the field as required; sets `aria-required` on the trigger. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component. |
| `invalid` | `boolean` | `false` | no | Applies the invalid border + ring tokens and sets `aria-invalid` on the trigger. |
| `displayValue` | `(value: unknown[]) => string` | `undefined` | no | Custom formatter used by the trigger to render the selected labels; receives the current `modelValue` array. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `unknown[]` | Fires when an option is toggled; payload is the next selection array. |
| `update:open` | `boolean` | Fires when the dropdown opens or closes. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Composition slot; receives `<MultiSelectTrigger>` and `<MultiSelectContent>` (and the option tree inside it). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`, `opened`
- `data-state` on the root and trigger: `open` | `closed`
- `data-size` on the trigger mirrors the `size` prop
- `data-disabled`, `data-invalid`, `data-required`, `data-readonly`, `data-filled` mirror the matching props (or the selection state for `data-filled`)
- `data-selected` on `<MultiSelectOption>` when the option's value is part of the current selection

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| dropdown open / close (on `MultiSelectContent` only) | popup scale-in / scale-out semantic utilities from `animations.js` | semantic (150ms in / 110ms out · cubic-bezier) | reduced-motion fallback via the matching `motion-reduce` utility |
| trigger state change (border/ring/bg) | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| checkbox indicator check/uncheck | inherits from `Checkbox` webkit component | inherits from `Checkbox` | inherits from `Checkbox` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (trigger, option label) | `.text-label-sm` |
| typography (group heading) | `.text-overline-xs` |
| surface (trigger) | `var(--bg-surface)` |
| surface (trigger disabled) | `var(--bg-disabled)` |
| surface (panel) | `var(--bg-surface)` |
| surface (option hover) | `var(--bg-hover)` |
| surface (option selected) | `var(--bg-selected)` |
| text | `var(--text-default)` |
| text (placeholder, group heading) | `var(--text-muted)` |
| text (disabled) | `var(--text-disabled)` |
| border (default) | `var(--border-default)` |
| border (hover) | `var(--border-strong)` |
| border (invalid) | `var(--danger-border)` |
| ring (focus) | `var(--ring-color)` |
| ring (invalid focus) | `var(--danger)` |
| spacing (trigger horizontal padding) | `var(--spacing-sm)` |
| spacing (panel padding) | `var(--spacing-xxs)` |
| spacing (option padding) | `var(--spacing-xs)` |
| spacing (option gap) | `var(--spacing-xs)` |
| shape | `var(--shape-elements)` |
| shadow (panel) | `var(--shadow-xs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on trigger and on every option row.
- Keyboard map (trigger): `Tab` focuses; `Space`/`Enter`/`ArrowDown` opens the panel; `Escape` closes it.
- Keyboard map (open panel): `ArrowDown`/`ArrowUp` move active option; `Home`/`End` jump to first/last; `Enter`/`Space` toggles the active option's selection without closing the panel; `Escape` closes; `Tab` closes and moves focus to the next form control.
- ARIA: trigger uses `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded` bound to open state, `aria-controls` pointing to the content element. Content uses `role="listbox"` with `aria-multiselectable="true"`. Each option uses `role="option"` with `aria-selected` mirroring its selection. Decorative icons (`pi pi-chevron-down`, `pi-heart`, etc.) are `aria-hidden="true"`. The checkbox indicator is decorative for screen readers (the `role="option"` + `aria-selected` carries the semantic); the inner `Checkbox` is `aria-hidden="true"`.
- `aria-invalid` and `aria-required` on the trigger mirror the matching props.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none motion-reduce:animate-none` on every transition/animation-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are documented as dense-layout-only (consistent with `InputText`).

## Stories (Storybook)

- Default
- Sizes — composite story rendering all three sizes side by side (canonical composite per `storybook-write` skill).
- WithGroups — justification: documents the `<MultiSelectGroup label="…">` heading anatomy from Figma `3899:29362` (Group region), which is not reachable from Default.
- WithSearchAndFooter — justification: documents the `#search` and `#footer` slots on `<MultiSelectContent>` (Top/Bottom regions in Figma `3899:29362`), which are slot-only and invisible from Default.
- WithOptionExtras — justification: documents the `icon`, `#left`, and `#tag` slots on `<MultiSelectOption>` in one composite frame.
- LongList — justification: documents the panel's internal scroll behaviour (options list wrapped in `ScrollArea`) when the option count exceeds the `max-h-80` viewport; not reachable from any other story.
- Filled — justification: pre-populated `modelValue` array shows the filled visual state (checkbox indicators in their checked state for the selected rows), which is implicit (no prop).
- Invalid — justification: documents the `invalid` visual treatment, which is a top-level prop with distinct token bindings.
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
