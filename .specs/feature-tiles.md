---
name: feature-tiles
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-04
checksum: 879e0cf8fc4e693138403df77794642476e21d32c4f74e26501785c57cbfc5bf
---
# FeatureTiles — Component Spec

## Purpose

The reasons band of a marketing page: an optional centered section title over a frame grid of media tiles, each an image or an illustration above a short heading and a sentence. It is a page section — the site places it from a `{ _id: 'feature-tiles', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `card-grid`, `media-tile` and `illustration`. `kind` picks the layout only: `artwork` is four columns with marks on every corner, `illustrated` is three columns with marks on the bottom rule; the tiles keep the same shape in both.

## When to use

- To state three or four reasons to buy, each with a picture, under a product or pricing argument.

## When NOT to use

- For linked use cases → use `use-case-links`.
- For a scroll-driven walkthrough with one screen per feature → use `feature-scroll`.

## Related

- `media-tile` — the picture-over-copy cell each tile is rendered with.
- `feature-widgets` — the sibling band whose cells carry an action each.
- `sections` — the registry compound that renders this block from a page's `sections[]` JSON.

## Best practices

- Match the tile count to the kind: four tiles for `artwork`, three for `illustrated`.
- Give a tile either `image` (a URL) or `illustration` (a registry name), not both; `scale` only matters with `illustration`.
- Leave `title` empty to drop the header when the band sits under a hero that already states it; set `anchor` when a link above scrolls to the band.

## Usage

```vue
<script setup>
import FeatureTiles from '@aziontech/webkit/sections/feature-tiles'
</script>

<template>
  <FeatureTiles
    kind="artwork"
    eyebrow="Why Azion"
    title="From commit to live traffic, on one platform"
    description="Build, ship, and run an application on the same platform that serves it."
    :tiles="[
      { image: '/illustrations/branches.svg', title: 'Build at AI speed.', description: 'Go from commit to a live URL in minutes.' },
      { image: '/illustrations/personal-tokens.svg', title: 'Secure by default.', description: 'Every workload runs in its own isolated environment.' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `FeatureTilesKind` | `'artwork'` | false | Layout of the grid: `artwork` is four columns with marks on every corner, `illustrated` three columns with marks on the bottom rule. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the centered section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `tiles` | `FeatureTilesTile[]` | `[]` | false | The tiles rendered as frame cells, in order; each is `{ title, description, image?, illustration?, scale? }` where `image` is a picture URL, `illustration` a registry name drawn fluid, and `scale` its media scale. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop and drives the column count and the frame marks
- Empty: when `tiles` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| cell fill | `var(--bg-canvas)` |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: nothing in the band is interactive.
- Keyboard map: none.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2` and each tile's heading is `media-tile`'s; illustrations are decorative and named by the tile's heading.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title` and `media-tile`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — not applicable, nothing is interactive.

## Stories (Storybook)

- Default
- Types — composite story rendering both `kind` values stacked.

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
