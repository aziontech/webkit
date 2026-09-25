---
name: media-tile
category: marketing
structure: monolithic
status: implemented
spec_version: 1
checksum: 34f39ec8364cfca7c339d193e6f0c5d89e84531db422ea77cf7e035ddc593885
created: 2026-09-25
last_updated: 2026-09-25
---

# Media Tile — Component Spec

## Purpose

One cell of a media band: a scene above, and under it a run-in caption whose lead names what the scene shows and whose sentence continues on the same line, so a row of tiles reads as one paragraph of claims under one row of panels. It comes in two registers. `frame` draws the page's frame language around the media alone — never around the copy — which is what lets the captions sit on the page column with no rules between them. `plain` draws no rules at all: the tile is itself the cell, filled and inset, for a `card-grid` in its `divider` register where the grid's own hairlines separate the columns.

## When to use

- For a row of three or four scenes that each need one sentence of explanation, laid out by `card-grid` in its `gap` register (`frame`) or its `divider` register (`plain`).
- When the claim is a label for the picture above it (`AI workloads.`, `Middleware.`) rather than a section heading in its own right.
- When the media should carry the page's frame language — hairline rules and corner marks — and the copy should not (`frame`).
- For a full-bleed band whose columns are separated by the grid's own hairlines, where a frame per cell would double every rule (`plain`).

## When NOT to use

- When the claim deserves a heading and a place in the document outline → use `topic`, which leads with a real `h2`/`h3`.
- When the tile is a padded surface card with a glyph, an eyebrow and a link → use `feature-card`.
- For one scene beside a block of copy across the full band → use `media-split`.
- For a mosaic whose cells claim different numbers of columns → use `bento-grid`.
- For the grid that lays the tiles out, or a framed cell that wraps media *and* copy together → use `card-grid`.

## Related

- `card-grid` — the grid that lays a row of tiles out; use its `gap` register, whose gutters keep every tile's frame its own.
- `topic` — the heading-led claim, for a band whose items belong in the outline.
- `feature-card` — the padded surface card, for a claim that carries a glyph and a link.
- `media-split` — one scene beside one block of copy, across the whole band.
- `frame-box` — the frame this tile draws around its media.
- `illustration` — the scene the frame usually holds; unnamed, it renders the placeholder that reserves a tile's space.

## Best practices

- End the lead with a full stop. It runs into the sentence that follows it, so the stop is what separates them — the component adds no punctuation of its own.
- Keep the lead to one or two words. It is a label for the panel above it, and a long lead swallows the first line of the sentence.
- Give every tile in a band a caption of roughly the same length. The frames are equalised by the grid row; ragged captions are what make a band look uneven.
- Reach for `padded` off when the media is an exported asset that already carries its own air, or when it should run to the cell's edges so a list or a table reads as continuing past them. A composed scene wants the inset.
- Pair the register with the grid. `frame` belongs in `card-grid`'s `gap` register, whose gutters keep every frame its own; the `divider` register would rule the captions as well as the panels. `plain` belongs in the `divider` register, where the grid draws every rule and the tile fills its own background so the gap has something to show through.
- Do not put a `frame` tile in a `divider` grid. The grid's hairline and the frame's rule then sit a padding apart, and the band reads as two competing grids.
- Leave the media slot empty while a scene is still being drawn: the frame holds the tile's floor height, so the band keeps its rhythm instead of collapsing.

## Usage

```vue
<script setup>
import CardGrid from '@aziontech/webkit/card-grid'
import Illustration from '@aziontech/webkit/illustration'
import MediaTile from '@aziontech/webkit/media-tile'
</script>

<template>
  <CardGrid
    kind="gap"
    :columns="4"
  >
    <MediaTile
      title="AI workloads."
      description="Run tasks with reduced latency and higher concurrency, delivering faster, scalable results for all users."
    >
      <template #media>
        <Illustration name="ai-applications" />
      </template>
    </MediaTile>

    <MediaTile
      title="Business-critical APIs."
      description="Ensure fast, resilient API responses under heavy traffic, keeping experiences smooth and consistent."
    >
      <template #media>
        <Illustration name="modern-frontends" />
      </template>
    </MediaTile>
  </CardGrid>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `MediaTileKind` | `'frame'` | false | Register of the tile: `frame` draws the page's frame around the media alone, `plain` draws no rules and makes the tile itself the cell a `divider` grid separates. |
| `title` | `string` | `—` | true | The caption's run-in lead, naming what the panel above it shows. |
| `description` | `string` | `''` | false | The sentence continuing the caption after the lead; overridden by the default slot. |
| `src` | `string` | `''` | false | URL of the tile's media image; ignored when the `media` slot is filled. |
| `alt` | `string` | `''` | false | Alternative text describing what the image shows; empty keeps it decorative. |
| `padded` | `boolean` | `true` | false | Inset the media — inside the frame in the `frame` register, from the cell's edges in `plain`. Turn it off for an asset that should run to the cell's edges; the caption keeps its own inset either way. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The caption body after the lead; replaces the `description` prop. |
| `media` | — | The scene the frame holds; replaces the `src` image. |

## States

- Visual states: `default`
- `data-kind` carries the register, and is what moves the inset from the frame to the tile
- `data-media` mirrors whether the frame holds any media
- `data-padded` mirrors the `padded` prop
- `data-described` mirrors whether the caption carries a body after its lead
- Empty: a tile with no media still draws its frame at the tile's floor height, so a band whose scene is not drawn yet keeps its rhythm instead of collapsing

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| frame rule | `var(--border-default)` |
| frame fill | `var(--bg-canvas)` |
| media inset (`padded`, `frame`) | `var(--spacing-xl)` |
| cell inset (`padded`, `plain`) | `var(--spacing-lg)` |
| gap, frame to caption | `var(--spacing-lg)` |
| caption typography | `.text-body-md` |
| caption lead ink | `var(--text-default)` |
| caption body ink | `var(--text-muted)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the tile carries no control of its own; anything composed into its media keeps its own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the tile is static content and takes no focus, so `Tab` order runs through whatever a band composes around it.
- ARIA: the caption is one paragraph whose lead is a `strong`, so the lead is read in flow rather than announced as a heading — the band's `section-title` carries the outline. An image given no `alt` is marked `aria-hidden="true"` and stays decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the lead takes `var(--text-default)` and the body `var(--text-muted)`, both measured against the page canvas the band sits on.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, the tile declares no interactive control.

## Stories (Storybook)

- Default
- Kinds — composite story rendering both registers side-by-side (justified: `frame` and `plain` are the same tile drawn with and without the page's rules, legible only in comparison).
- Unpadded — the `padded: false` state (an args delta of the one boolean the component declares).
- Band — composite story rendering four tiles inside a `card-grid`. **Justified addition:** the tile exists for a row, and its proportions only read against its neighbours — one tile alone shows neither the caption baseline the grid row equalises nor the gutter that keeps each frame its own.

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
