---
name: progress-bar
category: feedback
structure: monolithic
status: implemented
spec_version: 1
checksum: 1a7bc9bdc211ad0591a48082474922afe6e508a9b620c45ac30fe79ca782c6d7
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-870
  node_id: 479:870
created: 2026-06-26
last_updated: 2026-06-26
---

# Progress Bar — Component Spec

## Purpose

Communicates the progress of an ongoing task as a horizontal bar. Use it for a
determinate value within a range (`value` / `max`) or, when progress can't be
measured, as an indeterminate loading indicator. Unlike `skeleton` (placeholder
geometry) or `status-indicator` (discrete state), it expresses a continuous
quantity.

## Usage

```vue
<script setup>
import ProgressBar from '@aziontech/webkit/progress-bar'
</script>

<template>
  <ProgressBar :value="60" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `value` | `number` | `0` | no | Current progress, relative to `max`. |
| `max` | `number` | `100` | no | Upper bound; percentage = `value / max * 100`. |
| `shape` | `'rounded' \| 'flat'` | `'rounded'` | no | Track and fill corner-radius variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Bar height token. |
| `indeterminate` | `boolean` | `false` | no | Loading state; animates a sliding segment and ignores `value`. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `indeterminate`
- `data-shape` mirrors the `shape` prop: `rounded` | `flat`
- `data-size` mirrors the `size` prop: `small` | `medium` | `large`
- `data-indeterminate` is present while `indeterminate` is `true`

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| `value` change (determinate) | `transition-[width] duration-moderate-02 ease-productive-entrance` (width morph) | duration/curve aliases from `animate.js` (240ms · productive-entrance) | `motion-reduce:transition-none` |
| `indeterminate` (loading sweep) | `animate-progress-indeterminate` + `animate-progress-indeterminate-short` (two offset bars sweeping across the track via `inset-inline-start`/`inset-inline-end`) | semantic (2.1s · infinite) | `motion-reduce:animate-none` (static fill) |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| fill | `var(--primary)` |
| shape (rounded) | `var(--shape-elements)` |
| shape (flat) | `var(--shape-flat)` |

<!-- Height is a sizing utility, not a DESIGN.md token: small/medium/large → `h-2`/`h-3`/`h-4`
     (8/12/16px from `height.js`), per DESIGN.md § Sizing. The track surface is recorded in Theme gaps. -->

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `--bg-surface-raised` (track) | `var(--bg-surface-raised)` | `TODO: document --bg-surface-raised in .claude/docs/DESIGN.md § Colors` |

## Accessibility (WCAG 2.1 AA)

- Non-interactive: the bar is not focusable and takes no keyboard input.
- ARIA: root uses `role="progressbar"`. Determinate sets `aria-valuemin="0"`, `aria-valuemax="<max>"`, `aria-valuenow="<value>"`; indeterminate omits `aria-valuenow` and sets `aria-busy="true"`.
- Contrast ≥3:1 between the fill (`var(--primary)`) and the track (`var(--bg-surface-raised)`).
- `motion-reduce:transition-none` on the determinate width morph and `motion-reduce:animate-none` on the indeterminate animation (it falls back to a static fill under reduced motion).

## Stories (Storybook)

Composite stories render every variant of an axis side-by-side in a single frame;
the `Indeterminate` story is the state story for the `indeterminate` boolean.

- Default
- Shapes — composite story rendering `rounded` and `flat` side-by-side (the component's variant axis; stands in for `Types`).
- Sizes — composite story rendering `small`, `medium`, `large` side-by-side.
- Indeterminate — state story for the `indeterminate` prop.
- Simulation — interactive story: a button advances `value` in steps so the reviewer can see the fill's width transition animate on each `value` change. Justified because this motion (the determinate `transition-[width]`) only manifests on a live value change and cannot be shown by a static frame.

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
