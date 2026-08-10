---
name: switch
category: inputs
structure: monolithic
status: implemented
spec_version: 9
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-1247
  node_id: 2027:1247
checksum: 27bebab1033431270b3433f3c7bb150e547285b6e5dfcf20c7121487487e70fc
created: 2026-05-22
last_updated: 2026-07-31
---

# Switch — Component Spec

## Purpose

Control-only pill toggle `Switch` (36×20 px). Two visual types: `default` (plain handle) and `privacy` (handle carries a `pi-lock` / `pi-lock-open` icon mirroring the toggled state). No label or description — use `FieldSwitch` / `FieldSwitchBlock` for labeled layouts, or place it bare where the label already exists outside the control (an ItemGroup row names the field with `Item.Title`). Because the bare form has no wrapper to defer to, the control owns its own `disabled` state.

## Usage

```vue
<script setup>
import Switch from '@aziontech/webkit/switch'
import { ref } from 'vue'

const enabled = ref(false)
</script>

<template>
  <Switch v-model="enabled" kind="default" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `boolean` | `false` | no | Toggled-on state. Bind with `v-model="value"`. Mirrors the Figma checked/on variant. |
| `kind` | `'default' \| 'privacy'` | `'default'` | no | Visual variant. `privacy` renders a lock icon inside the handle (closed when off, open when on). |
| `focused` | `boolean` | `false` | no | Forces the focused visual state regardless of keyboard focus. Mirrors the Figma `focused` variant. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies the disabled tokens. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `boolean` | Emitted when the user toggles the switch. Paired with `v-model`. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `checked`, `disabled`
- `data-checked` mirrors the `modelValue` prop (toggled-on state)
- `data-focused` mirrors the `focused` prop and applies the same ring tokens as `:focus-visible`
- `data-kind` mirrors the `type` prop (`default` | `privacy`)
- `data-disabled` mirrors the `disabled` prop; the root is also natively `<button disabled>`, so it leaves the tab order and neither click nor `Space`/`Enter` emits `update:modelValue`. The disabled treatment is the `--bg-disabled` track + `--text-disabled` handle + `cursor-not-allowed` — token surfaces, never an opacity wash. It wins over the checked tokens, so a disabled switch reads locked in both the off and on positions.
- Hover applies an inset `var(--bg-hover)` overlay on both off and on tracks; disabled suppresses that overlay (`data-[disabled]:hover:shadow-none`) while keeping the element hit-testable so `cursor-not-allowed` is what the pointer shows

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| track color change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| handle slide | `transition-transform duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none motion-reduce:transform-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| track (off) — background | `var(--bg-surface)` |
| track (off) — border | `var(--border-default)` |
| track (on) — background | `var(--accent)` |
| handle (off) — fill | `var(--text-muted)` |
| handle (on) — fill | `var(--color-base-white)` (theme-independent white knob on the `--accent` track) |
| lock icon (off) | `var(--bg-surface)` |
| lock icon (on) | `var(--color-base-black)` (theme-independent black on the white knob; both stay fixed across themes) |
| track (hover) — overlay | `var(--bg-hover)` (applies to both off and on tracks) |
| track (disabled) — background | `var(--bg-disabled)` (over the checked `--accent`, so on/off read the same when locked) |
| track (disabled) — border | `var(--border-default)` |
| handle (disabled) — fill | `var(--text-disabled)` |
| disabled — cursor | `cursor-not-allowed` |
| focus-visible / `data-focused` ring | `var(--ring-color)` |
| shape — track | `rounded-(--shape-elements)` (6px) |
| shape — handle | `rounded-(--radius)` (4px — concentric with the track: track 6px − `px-0.5` inset 2px) |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| handle fill (off) — Figma `--surface-300` (#b2b2b2) | inline `bg-(--text-muted)` (closest semantic) | `TODO: introduce semantic --fg-handle (or equivalent) in DESIGN.md` |
| handle fill (on) — fixed white knob over `--accent` (must not flip with theme) | inline `bg-(--color-base-white)` + lock icon `text-(--color-base-black)` (base primitives, intentionally theme-independent) | `TODO: introduce semantic --fg-handle-on / --fg-handle-on-contrast in DESIGN.md` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`. The same ring is applied when `focused` is `true` (`data-[focused]` mirror).
- Keyboard map: `Tab` focuses; `Space` / `Enter` toggles. When `disabled`, the native `<button disabled>` root is skipped by `Tab` and both keys are inert.
- ARIA: `role="switch"` on the root; `aria-checked` mirrors `data-checked`; `aria-disabled` mirrors `data-disabled`. The lock icon in `type="privacy"` is decorative — `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target: the control itself is 36×20 — the consumer is responsible for placing it inside a ≥40×40 hit area (typically via `FieldSwitch`). The component still exposes a clickable root.

## Stories (Storybook)

- Default
- Types — composite story rendering `type='default'` and `type='privacy'` side-by-side, each in both off and on states.
- Disabled — the mutually-exclusive `disabled` state, rendered in both the off and on positions (the locked visual must not depend on `modelValue`).

<!-- Sizes is omitted: the component has no `size` prop (Figma documents a single 36×20 size). -->
<!-- `disabled` was added in spec_version 9. It was previously omitted on the grounds that "consumers like FieldSwitch own the disabled visual at the wrapper level", but a switch is also used bare wherever the label lives outside it (an ItemGroup row, where `Item.Title` is the label) — there the consumer had no wrapper to own the visual, so `:disabled` blocked interaction natively while the control still looked live. Owning `disabled` here is what makes the lock visible at every call site instead of only inside `FieldSwitch`. -->

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
