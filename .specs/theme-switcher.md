---
name: theme-switcher
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5721-5138
  node_id: 5721:5138
checksum: 267f04e965b725c208edfd8ceec7307cc617aad2fd0c80ff29473b2387798758
created: 2026-07-13
last_updated: 2026-07-13
---

# Theme Switcher — Component Spec

## Purpose

A compact pill-shaped segmented control that lets the user pick the app color-theme mode — `system`, `dark`, or `light` — via three icon-only segments. It is a pure controlled input: it reflects and emits the selected mode with `v-model:value` and applies no global side effect itself (the app decides what each mode means). Unlike `switch` (a boolean toggle) or `tab-view` (view navigation), it is a fixed three-way single-select over the theme modes.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import ThemeSwitcher from '@aziontech/webkit/theme-switcher'

const theme = ref('system')
</script>

<template>
  <ThemeSwitcher v-model:value="theme" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `value` | `'system' \| 'dark' \| 'light'` | `'system'` | no | Selected theme mode. Bind with `v-model:value`. |
| `disabled` | `boolean` | `false` | no | Disables the whole control and applies disabled tokens. |
| `ariaLabel` | `string` | `'Theme'` | no | Accessible name for the icon-only segmented group. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:value` | `'system' \| 'dark' \| 'light'` | Emitted when the user selects a mode. Paired with `v-model:value`. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop on the root
- Selected segment carries `aria-checked="true"` and `data-state="active"`; unselected segments `aria-checked="false"` and `data-state="inactive"`
- A single `aria-hidden` indicator element renders the selection highlight (`var(--bg-selected)`) and slides to the active segment (position measured from the active segment's box); segments themselves stay transparent

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover / icon color change | `transition-colors duration-fast-02 ease-productive-entrance` | semantic (`animate.js`) | `motion-reduce:transition-none` |
| selection change | indicator slides between segments via `transition-transform duration-moderate-02 ease-productive-entrance` (position measured from the active segment) | semantic (`animate.js`) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| pill surface | `var(--bg-surface)` |
| pill border | `var(--border-default)` |
| selected segment surface | `var(--bg-selected)` |
| hover segment surface | `var(--bg-hover)` |
| icon color | `var(--text-default)` |
| disabled icon | `var(--text-disabled)` |
| gap / padding | `var(--spacing-xxs)` |
| ring | `var(--ring-color)` |
| ring offset | `var(--bg-canvas)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `--border-width-default` (0.8px) | native `border` (1px) | `TODO: tokenizar border-width` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on the focused segment.
- Keyboard map: `Tab` moves focus into the group (roving tabindex lands on the selected segment); `ArrowLeft`/`ArrowRight` (and `ArrowUp`/`ArrowDown`) move selection between segments; `Space`/`Enter` selects the focused segment.
- ARIA: root is `role="radiogroup"` with `aria-label` from `ariaLabel`; each segment is `role="radio"` with `aria-checked` and its own `aria-label` (`System` / `Dark` / `Light`); the glyph is `aria-hidden`. `aria-disabled` mirrors `disabled`.
- Each segment is wrapped in `@aziontech/webkit/tooltip` (`placement="bottom"`) surfacing its mode label (`System` / `Dark` / `Light`) on hover and keyboard focus; the tooltip owns its own `aria-describedby` wiring.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target: segments follow the compact Figma sizing (28px pill height, 28×20px segments) and are below the 40×40 px target; justified deviation for a dense global control, consistent with the design.

## Stories (Storybook)

- Default
- Disabled — only state story; the component has a single `kind` and a single `size`, so Types/Sizes are omitted.

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
</content>
</invoke>
