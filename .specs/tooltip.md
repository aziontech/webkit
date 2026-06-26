---
name: tooltip
category: overlay
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4281-4543
  node_id: 4281:4543
checksum: b13da90c2c3e4c4965169d7174bd83fb0bfcaf1b437c35a03e47e4b53926a39e
created: 2026-06-02
last_updated: 2026-06-02
---

# Tooltip — Component Spec

## Purpose

Surfaces a short hint anchored to a trigger element when the user hovers, focuses, or long-presses it. Use for icon-only buttons, abbreviations, or any control whose meaning is not obvious from its label alone. **Not** for rich content or interactive children — use `overlay/popover` instead.

## Usage

```vue
<script setup>
import Tooltip from '@aziontech/webkit/overlay/tooltip'
import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <Tooltip text="Delete" placement="top">
    <IconButton icon="pi pi-trash" aria-label="Delete" />
  </Tooltip>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `text` | `string` | `''` | yes | Plain text shown inside the tooltip. |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | no | Anchor side relative to the trigger. |
| `delay` | `number` | `200` | no | Hover-open delay in milliseconds. |
| `disabled` | `boolean` | `false` | no | Disables tooltip activation. |
| `open` | `boolean` | `undefined` | no | Controlled open state. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `false` | no | Initial open state when uncontrolled. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:open` | `boolean` | v-model:open. Fires on open and close. |
| `show` | `void` | Emitted right after the open transition starts. |
| `hide` | `void` | Emitted right after the close transition starts. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The trigger element. Tooltip anchors to its bounding box. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `data-state` values: `open` | `closed`
- `data-disabled` mirrors the `disabled` prop
- `data-placement`: `top` | `right` | `bottom` | `left`

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| open | `animate-popup-scale-in` | semantic (150ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| close | `animate-popup-scale-out` | semantic (110ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |

`--popup-origin` is set per instance based on `placement` (e.g. `top` → `bottom center`).

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (label) | `.text-body-sm` |
| surface | `var(--bg-surface)` |
| text | `var(--text-default)` |
| border | `var(--border-muted)` |
| padding | `var(--spacing-xs)` |
| max-width | `var(--container-3xs)` |
| shape | `var(--shape-elements)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `bg-contrast` | `bg-[var(--bg-surface)]` | `TODO: tokenizar` (add `--bg-contrast` to DESIGN.md when contrast surface diverges) |
| `text-contrast` | `text-[var(--text-default)]` | `TODO: tokenizar` (add `--text-contrast` to DESIGN.md when contrast text diverges) |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on the trigger wrapper.
- Keyboard map: `Tab` focuses the trigger → tooltip opens; `Escape` closes; tooltip never traps focus.
- ARIA: `role="tooltip"` on the panel; the trigger references the panel via `aria-describedby`. `aria-hidden="true"` when `data-state="closed"`.
- Contrast ≥4.5:1 — text against surface verified in both light and dark modes.
- `motion-reduce:animate-none` on the panel; reduced-motion users get instant show/hide.
- Touch target ≥40×40 px on the trigger (the consumer's responsibility — flag in docs).

## Stories (Storybook)

- Default — tooltip rendered **closed**; viewer hovers/focuses the trigger to see it open.
- Placements — composite story with all four placements (top/right/bottom/left) side-by-side; each instance defaults to **closed**.
- Disabled — trigger present, tooltip activation no-op.

## Constraints — DO NOT

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
