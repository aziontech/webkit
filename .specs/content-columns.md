---
name: content-columns
category: marketing
structure: monolithic
status: implemented
spec_version: 2
checksum: ad0e33278aa3adc108d03d744ddac337a3d96d14f159c93ebd69eac75f3f34f0
created: 2026-09-22
last_updated: 2026-09-25
---

# Content Columns — Component Spec

## Purpose

A titled band whose body is two or three columns of short copy, drawn in one hairline `card-grid` so the columns read as a single surface. It is the plainest way to state a few parallel points under one section header.

## When to use

- For two or three parallel points that carry equal weight under one section heading.
- When each point is a short title and a sentence — no icon, no media, no link.
- As the body of a product or platform section that needs structure but not tiles.

## When NOT to use

- When the points are unequal and one deserves the full width → use `bento-grid`.
- When each point needs an icon, a link or its own surface → use `feature-card` in a grid the page owns.
- For measured figures → use `big-numbers`.
- For one point paired with a picture → use `media-split`.

## Related

- `bento-grid` — the same collapsed-rule grid with unequal, slot-composed cells.
- `feature-card` — the richer unit when a point needs an icon or a destination.
- `section-title` — the header this band renders above its columns.
- `big-numbers` — the numeric sibling of this grid.

## Best practices

- The band draws no frame of its own: the rule and the corner marks belong to the `section-module` or `frame-box` that the page assembles it into, so a band placed in a framed column never lands a second hairline on the column's own.

- Keep every column to a title and one or two sentences; the grid stretches to the tallest, so one long column pads the rest.
- Use three columns for three peers and two for a contrast; four points want `bento-grid` or a card grid instead.
- Write the column titles in parallel grammar — they are read across, not down.
- Leave `title` out when the band sits directly under another header; two headings in a row is one too many.

## Usage

```vue
<script setup>
import ContentColumns from '@aziontech/webkit/content-columns'
</script>

<template>
  <ContentColumns
    eyebrow="How it works"
    title="Three things happen on every request."
    :columns="3"
    :items="[
      { title: 'Routed', description: 'The request lands at the location closest to the user.' },
      { title: 'Executed', description: 'Your code runs there, with no cold region to warm up.' },
      { title: 'Cached', description: 'The response is held at that edge for the next request.' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `items` | `ContentColumnItem[]` | `[]` | false | The columns, in reading order; each item is `{ title, description }`. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2` above the columns. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `columns` | `2 \| 3` | `3` | false | How many columns the grid holds from the medium breakpoint up; below it the columns stack. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-columns` mirrors the `columns` prop and drives the grid from the medium breakpoint up
- Below `md` the grid is a single column in DOM order, so the points are read in the order they are written
- Empty: when `items` is empty the band renders no grid and no rules, so an unfilled band leaves no empty frame

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (column title) | `.text-heading-sm` |
| typography (column body) | `.text-body-sm` |
| column title text | `var(--text-default)` |
| column body text | `var(--text-muted)` |
| grid rules and marks | `var(--border-default)` |
| column surface | `var(--bg-surface)` |
| spacing (column padding) | `var(--spacing-xl)` |
| spacing (column stack) | `var(--spacing-sm)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the band is static copy and holds no interactive control.
- Keyboard map: none of its own; the band contains no focusable element and is skipped by `Tab`.
- ARIA: the band is a `<section>` labelled by its `h2` when `title` is set; each column title is an `h3`, so the columns nest correctly under the band's heading and the document outline stays honest.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): column titles are `var(--text-default)`; bodies use `var(--text-muted)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the band is static.
- Touch target ≥40×40 px — not applicable, no interactive target.

## Stories (Storybook)

- Default
- Columns — composite story rendering both `columns` values one under the other

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
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
