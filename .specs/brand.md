---
name: brand
category: content
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=587-3946
  node_id: 587:3946
checksum: 62d98081182fc1883def54d3bfaea330a30141becc0ecc3e31cdca35e26e7f8d
created: 2026-07-13
last_updated: 2026-07-13
---

# Brand — Component Spec

## Purpose

The Azion brand logo, rendered as an inline SVG lockup. A single `kind` prop selects the lockup: `default` (the AZION wordmark) for standard surfaces, `reduced` (the "A" glyph) for compact headers and tight spaces, and `extended` (the AZION wordmark with the "move to the edge technologies®" tagline) for marketing-oriented layouts. It consolidates the loose `@aziontech/webkit/svg/azion/*` assets — which remain individually importable — behind one component.

## Usage

```vue
<script setup>
import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <Brand kind="default" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `'default' \| 'reduced' \| 'extended'` | `'default'` | no | Brand lockup to render: `default` (AZION wordmark), `reduced` (the "A" glyph for tight spaces), `extended` (wordmark with the "move to the edge technologies®" tagline). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Size token; sets the lockup height (16 / 24 / 32 px) while width scales automatically so each `kind` keeps its own aspect ratio. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop
- `data-size` mirrors the `size` prop

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| brand mark (SVG fill, asset-owned) | `var(--primary)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| brand orange (`#F3652B`) | hardcoded HEX inside the `svg/azion/*` assets | `TODO: tokenizar the brand assets to `var(--primary)`` |

## Accessibility (WCAG 2.1 AA)

- The root carries `role="img"` and a default `aria-label` (`Azion`) so the logo has an accessible name; consumers may override the label via a passed `aria-label`.
- Non-interactive: the logo is not focusable and emits no events; the inner SVG is presentational.
- Contrast ≥3:1 for the brand mark against its background (large graphic).
- `motion-reduce` not applicable — the component is static.

## Stories (Storybook)

- Default
- Types — composite story rendering every `kind` value (`default`, `reduced`, `extended`) side-by-side.
- Sizes — composite story rendering every `size` value (`small`, `medium`, `large`) side-by-side.

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
- Do not add bespoke Storybook stories beyond Default + Types + Sizes for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
