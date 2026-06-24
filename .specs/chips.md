---
name: chips
category: inputs
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=476-948
  node_id: 476:948
checksum: 77ea605007a81a26ff8c043a54f35472e4920fd792e76ca92ff969ddf0de46af
created: 2026-06-23
last_updated: 2026-06-24
---

# Chips — Component Spec

## Purpose

A Chip is a compact, self-contained token that labels a discrete value the user has applied — most often a removable filter on a data view. Unlike `tag` (a read-only status/category badge with severity color coding), a Chip carries no severity and exposes an optional trailing remove control: when `removable` is set, it renders a real `<button>` that emits `remove`, so the consumer can drop the value from a collection. This is the token consumed by the data table's `#filters` slot (`<Chip :label="f.label" removable @remove="dropFilter(f)" />`): each active filter becomes one removable Chip, and dismissing it removes that filter. Reach for a Chip when a value is user-applied and dismissible; reach for `tag` when it is a static status or category indicator.

## Usage

```vue
<script setup>
import Chip from '@aziontech/webkit/chips'
</script>

<template>
  <Chip label="Active" size="medium" removable @remove="onRemove" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `'undefined'` | no | Fallback text when the default slot is empty. |
| `size` | `'small' \| 'medium'` | `'medium'` | no | Size token; `medium` is 24px tall, `small` is 20px. |
| `removable` | `boolean` | `false` | no | When true, renders a trailing remove button that emits `remove`. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `remove` | `MouseEvent` | Fires when `removable` is true and the remove button is activated (click / Enter / Space). |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Chip content; falls back to `label` when empty. |

## States

- Visual states: `default`, `hover`, `focus-visible` (on the remove button), `active`
- `data-size` mirrors the `size` prop (`small` | `medium`)
- `data-removable` is present when the `removable` prop is true
- The root is a non-interactive container; only the remove button is focusable, and it shows a visible focus ring on `focus-visible`.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| remove button hover/focus state change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| surface | `var(--bg-surface)` (Figma uses the raised surface variant — see Theme gaps) |
| border (color) | `var(--border-default)` |
| shape | `var(--shape-elements)` |
| elevation | `var(--shadow-sm)` |
| typography (medium) | `.text-label-md` + `leading-none` (Figma Typography/Label/md, 14px) |
| typography (small) | `.text-label-sm` + `leading-none` (Figma Typography/Label/sm, 12px) |
| text | `var(--text-default)` |
| spacing (medium padding) | `var(--spacing-sm)` / `var(--spacing-xs)` |
| spacing (small padding) | `var(--spacing-xs)` / `var(--spacing-xxs)` |
| spacing (label↔icon gap) | `var(--spacing-xxs)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| raised surface `var(--bg-surface-raised)` | `var(--bg-surface-raised)` (exists in the theme; not yet catalogued in DESIGN.md) | `TODO: catalogar --bg-surface-raised em DESIGN.md` |
| border width `var(--border-width-default)` | `var(--border-width-default)` (exists in the theme; not yet catalogued in DESIGN.md; already used by `tag.vue`) | `TODO: catalogar --border-width-default em DESIGN.md` |
| label↔icon gap `6px` | `var(--spacing-xxs)` (4px) | `TODO: tokenizar gap de 6px se virar recorrente` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the remove button uses `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`.
- Keyboard map: the root is not focusable; `Tab` focuses the remove button (when `removable`), `Enter`/`Space` activates it and emits `remove`.
- ARIA: the root is a non-interactive `<span>` container; the remove control is a real `<button type="button">` with `aria-label="Remove"`; the `pi pi-times` glyph is `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the remove icon.
- `motion-reduce:transition-none` on the remove button's color transition.
- Touch target: justified deviation — the chip height is 20–24px, so the remove button's touch target is below 40×40 px. This matches the design (the Chip is a compact inline token, not a primary action), and the larger surrounding chip remains the visible affordance.

## Stories (Storybook)

- Default — the baseline Chip with `label`.
- Sizes — composite story rendering `small` and `medium` side by side, justified because `size` is a real axis with two values.
- Removable — args delta `removable: true`, wiring the `remove` event to the Actions panel; justified because `removable` is a real boolean state that changes the rendered anatomy (adds the trailing remove button) and the emitted event.

Types/Sizes canonical note: there is no `kind`/`severity` axis on Chip, so the `Types` story is omitted.

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
