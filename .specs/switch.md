---
name: switch
category: inputs
structure: monolithic
status: implemented
spec_version: 8
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-1247
  node_id: 2027:1247
checksum: 4e2f98d5b3795d3e85a2babd10fb26195d0cc00b8118c429fab9181ad7a8cf23
created: 2026-05-22
last_updated: 2026-06-23
---

# Switch — Component Spec

## Purpose

Control-only pill toggle `Switch` (36×20 px). Two visual types: `default` (plain handle) and `privacy` (handle carries a `pi-lock` / `pi-lock-open` icon mirroring the toggled state). No label or description — use `FieldSwitch` / `FieldSwitchBlock` for labeled layouts.

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
| `modelValue` | `boolean` | `false` | no | Toggled-on state. Bind with `v-model="value"`. Mirrors the Figma `modelValue` variant. |
| `kind` | `'default' \| 'privacy'` | `'default'` | no | Visual variant. `privacy` renders a lock icon inside the handle (closed when off, open when on). |
| `focused` | `boolean` | `false` | no | Forces the focused visual state regardless of keyboard focus. Mirrors the Figma `focused` variant. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `boolean` | Emitted when the user toggles the switch. Paired with `v-model`. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `checked`
- `data-checked` mirrors the `modelValue` prop (toggled-on state)
- `data-focused` mirrors the `focused` prop and applies the same ring tokens as `:focus-visible`
- `data-kind` mirrors the `type` prop (`default` | `privacy`)
- Hover applies an inset `var(--bg-hover)` overlay on both off and on tracks

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
| track (on) — background | `var(--success-contrast)` |
| track (hover) — overlay | `var(--bg-hover)` (applies to both off and on tracks) |
| focus-visible / `data-focused` ring | `var(--ring-color)` |
| shape | `rounded-full` (Tailwind native; pill — DESIGN.md § Shapes does not gate `rounded-full`) |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| handle fill (off) — Figma `--surface-300` (#b2b2b2) | inline `bg-[var(--text-muted)]` (closest semantic) | `TODO: introduce semantic --fg-handle (or equivalent) in DESIGN.md` |
| handle fill (on) — dark contrast over `--success-contrast` | inline `bg-[var(--bg-canvas)]` (closest semantic) | `TODO: introduce semantic --fg-handle-on in DESIGN.md` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`. The same ring is applied when `focused` is `true` (`data-[focused]` mirror).
- Keyboard map: `Tab` focuses; `Space` / `Enter` toggles.
- ARIA: `role="switch"` on the root; `aria-checked` mirrors `data-checked`. The lock icon in `type="privacy"` is decorative — `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target: the control itself is 36×20 — the consumer is responsible for placing it inside a ≥40×40 hit area (typically via `FieldSwitch`). The component still exposes a clickable root.

## Stories (Storybook)

- Default
- Types — composite story rendering `type='default'` and `type='privacy'` side-by-side, each in both off and on states.

<!-- Sizes is omitted: the component has no `size` prop (Figma documents a single 36×20 size). -->
<!-- Disabled is omitted: the component has no `disabled` prop (Figma 2027:1247 documents no disabled variant; consumers like FieldSwitch own the disabled visual at the wrapper level). -->

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
