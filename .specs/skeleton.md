---
name: skeleton
category: feedback
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-881
  node_id: 479:881
checksum: 5ebe624103f06c4dcdc3fac32789b74cc7fd48142bd277515151e8c6d44e5423
created: 2026-06-23
last_updated: 2026-06-26
---

# Skeleton — Component Spec

## Purpose

A loading placeholder that reserves the space of content while it loads, gently pulsing to signal activity. Use it in place of text lines, media, or avatars during fetches; unlike `status-indicator` (which communicates a settled state) the skeleton is a transient, decorative stand-in. Two geometries cover the common cases: a rounded rectangular block (`shape`) and a `circle` (for avatars / icons).

## Usage

```vue
<script setup>
import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <Skeleton width="240px" height="100px" />
  <Skeleton kind="circle" width="100px" height="100px" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `'shape' \| 'circle'` | `'shape'` | no | Geometry: a rounded rectangular block (`shape`) or a circle. |
| `width` | `string` | `'100%'` | no | CSS width (any length). |
| `height` | `string` | `'1rem'` | no | CSS height (any length); for a circle, set equal to `width`. |
| `animated` | `boolean` | `true` | no | Shimmer while loading; suppressed under reduced motion. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | Leaf placeholder; renders no content. |

## States

- Visual states: `default` (a single decorative placeholder; no hover/focus/active — it is not interactive)
- `data-kind` mirrors the `kind` prop (`shape` | `circle`)
- `data-animated` is present when `animated` is true (drives the shimmer)

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| while loading (`animated`) | `animate-shimmer` (linear gradient sweep over the fill) | `--animate-shimmer` (`animate.js`) + `@keyframes shimmer` (`semantic/animations.js`) | gated behind `motion-safe:` (no sweep) + `motion-reduce:animate-none` (static) |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| shape radius (`shape`) | `var(--shape-elements)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `--bg-surface-overlay` (skeleton fill, #4D4D4D dark / #FAFAFA light) | `bg-[var(--bg-surface-overlay)]` (real token, not yet in DESIGN.md) | `TODO: document --bg-surface-overlay in DESIGN.md` |
| shimmer animation | `animate-shimmer` (`--animate-shimmer` preset in `animate.js` + `@keyframes shimmer` in `semantic/animations.js`) | `TODO: document --animate-shimmer in DESIGN.md § Animations` |

## Accessibility (WCAG 2.1 AA)

- The skeleton is decorative: `aria-hidden="true"` so assistive tech skips it. The loading status is conveyed by the surrounding region (e.g. `aria-busy="true"` on the container the consumer owns), not by the placeholder itself.
- Not focusable, not interactive: no keyboard map, no focus ring.
- The shimmer is gated behind `motion-safe:` and `motion-reduce:animate-none` suppresses it for users who prefer reduced motion (static flat fill).

## Stories (Storybook)

This component has no `size` axis, so the canonical Sizes story does not apply.

- Default
- Types — composite story rendering both `kind` values (`shape`, `circle`) side-by-side.
- Static — `animated: false`; demonstrates the non-shimmering placeholder. Justified because `animated` is a distinct state of the component and the shimmer cannot be seen in a static screenshot.

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
