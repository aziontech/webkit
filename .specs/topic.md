---
name: topic
category: marketing
structure: monolithic
status: approved
spec_version: 1
checksum: e5c2f4897eb9a1ec31376244d76ee97f426224dccec1724f32fa8a810dbfb4bf
created: 2026-09-24
last_updated: 2026-09-26
---

# Topic — Component Spec

## Purpose

One claim stated in three parts: a glyph, a short headline it shares a line with, and a sentence under them that explains it. It is the repeated unit of a marketing claim grid — the content of a cell, not the cell itself, so it carries no surface, no padding and no rules of its own and reads the same dropped into a `card-grid` cell, a `bento-grid` cell, or a column the page lays out by hand. Given an `href` the whole claim becomes the link, and its headline closes on a trailing arrow, so a band of claims needs no separate row of "learn more" controls.

## When to use

- For each cell of a "what you get" band: a row of equal claims under a section's headline.
- Inside `CardGrid.Cell` or `BentoGrid.Cell`, where the grid owns the frame and the fill and the topic owns only the copy.
- Whenever a claim is glyph-led and one sentence long, repeated three to six times across a band.

## When NOT to use

- For a tile with its own border and surface → keep the topic and put it in a `CardGrid.Cell`, which draws the frame and the fill.
- For a claim that carries an eyebrow, a media region or a button → use `media-split`.
- For the headline that opens the whole section → use `section-title`.
- For a measured figure with a unit → use `big-numbers`.
- For a console list row with media and actions → use `item`.

## Related

- `card-grid` — the equal-cell grid a topic is usually repeated in; its `frame` register gives each topic a real `frame-box` cell.
- `bento-grid` — the unequal-cell mosaic, when one claim deserves more room than the rest.
- `section-title` — the headline that opens the band a row of topics sits in.

## Best practices

- Let the cell own the surface. A topic paints no background and adds no padding, so put it inside `CardGrid.Cell` / `BentoGrid.Cell` (or a padded cell the page owns) rather than giving the topic a fill.
- Keep `headingLevel` in step with the page outline: `2` when the band has no headline of its own and these are the first sub-headings under the `h1`, `3` when a `section-title` has already opened the section. The level is the outline; the size is fixed at `heading-xs`.
- Keep the description to one sentence. The glyph carries the recognition, the headline carries the claim, and a second sentence turns a scannable grid into a wall of prose.
- Drop `icon` for a band whose claims are not glyph-led rather than reaching for a decorative glyph that says nothing.
- Give the claim an `href` rather than composing a button under it. A grid of six claims that each close on their own "Learn more" reads as six calls to action instead of six claims, and the button is a second target for the destination the claim already points at.

## Usage

```vue
<script setup>
import Topic from '@aziontech/webkit/topic'
</script>

<template>
  <Topic
    icon="ai ai-edge-nodes"
    title="Consistent global speed"
    description="Serve content and run web apps across hundreds of locations with median latency under 30 ms. No infra to manage."
    href="/products/edge-application"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `—` | true | The claim, rendered as the topic's heading. |
| `description` | `string` | `''` | false | One sentence explaining the claim; overridden by the default slot. |
| `icon` | `string` | `''` | false | Icon class for the glyph that leads the headline. |
| `href` | `string` | `''` | false | When set, the whole claim renders as an anchor link to this URL and its headline closes on a trailing arrow. |
| `headingLevel` | `TopicHeadingLevel` | `2` | false | Level of the heading element. Keep `2` when the band has no headline of its own; drop it to `3` when a `section-title` has already opened the section, so the document outline stays in order. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Description body; replaces the `description` prop when provided. |

## States

- Visual states: `default`, and `hover` / `focus-visible` when `href` is set
- `data-icon` mirrors whether a glyph is rendered, so a band can style the glyph-less case
- `data-described` mirrors whether a description is rendered, from either the prop or the slot
- `data-linked` present when the claim carries an `href`
- The root element switches between `<a>` and `<div>` on the `href` data prop, never on an `as` string — so the whole claim is the target, not a control composed under it
- The heading element follows `headingLevel`; its size does not change with it

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover / focus on a linked claim | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| hover on a linked claim (its arrow) | `transition-[translate] duration-moderate-02 ease-expressive-entrance` | `--duration-moderate-02`, `--ease-expressive-entrance` | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (heading) | `.text-heading-xs` |
| typography (description) | `.text-body-sm` |
| typography (glyph size) | `.text-heading-xs` — the glyph sits on the headline's line, so it takes the headline's size |
| typography (trailing arrow) | `.text-body-xs` |
| glyph | `var(--primary)` |
| heading ink | `var(--text-default)` |
| heading ink (linked, hover) | `var(--primary)` |
| description ink | `var(--text-muted)` |
| focus ring | `var(--ring-color)` on `var(--bg-canvas)` |
| spacing (headline row to sentence) | `var(--spacing-sm)` |
| spacing (glyph to headline) | `var(--spacing-xs)` |
| spacing (headline to arrow) | `var(--spacing-xxs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the linked root carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`. Without an `href` the topic holds no interactive control of its own.
- Keyboard map: `Tab` reaches the linked claim and `Enter` follows it — the anchor's own behaviour, no handler of our own. Unlinked, the topic is static content and `Tab` passes through whatever the description slot contains.
- ARIA: both glyphs are decorative and carry `aria-hidden="true"` — the leading icon and the trailing arrow — so the link's accessible name is the headline and the sentence, the copy a reader sees. `headingLevel` is what keeps the document outline in order (axe `heading-order`); the heading stays a heading inside the anchor.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): `var(--text-default)` for the heading, `var(--text-muted)` for the description, `var(--primary)` for the glyph and for the hovered headline — all against the fill the surrounding cell provides.
- `motion-reduce:transition-none` on both transitions a linked claim carries.
- Touch target ≥40×40 px — the whole claim is the target, so it is the cell's own height; a topic is never smaller than its heading plus its sentence.

## Stories (Storybook)

- Default
- WithoutIcon — the glyph-less state (mutually-exclusive state of the `icon` prop)
- Linked — the `href` state, where the whole claim is the link and its headline closes on an arrow (mutually-exclusive state of the `href` prop)
- InGrid — a row of topics inside a `card-grid` `divider` register (justified: the component is the content of a grid cell and carries no surface of its own, so a single topic on bare canvas does not show what it is for; this is the only story where the division of labour between grid, cell and topic is legible)

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
