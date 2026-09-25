---
name: carousel
category: marketing
structure: composition
status: implemented
spec_version: 1
checksum: 4bd541c2a16d2e545f4e0873677428a221903790d571d3c64ccf191ed735dad1
created: 2026-09-22
last_updated: 2026-09-24
---

# Carousel — Component Spec

## Purpose

A horizontally scrollable track of slides with snap points and a pair of step controls. It is built on native scrolling and CSS scroll snap rather than a carousel runtime, so it is draggable, swipeable and keyboard-scrollable by default, and it never moves on its own.

## When to use

- When a set of cards, quotes, logos or figures is longer than the row it sits in and the reader chooses how far to go.
- For a peek-and-swipe row on narrow screens where a grid would stack into a very long column.
- Whenever the content is browsable rather than essential — a reader must never have to scroll a carousel to reach something they need.

## When NOT to use

- For content the reader must see → lay it out as a grid; anything past the first slide can be missed.
- For a vertical list → use `item` with `ItemGroup`.
- For a framed grid of unequal cells → use `bento-grid`.
- For a set of figures that fits the row → use `big-numbers` or `logo-wall`, which wrap instead of scrolling.

## Related

- `bento-grid` — the framed grid, when everything should be visible at once.
- `logo-wall` — a wrapping grid of marks; reach for the carousel only when the wall is too long.
- `feature-card` — the usual slide content.
- `scroll-area` — the console's styled scroll container; this one owns snap points and step controls.

## Best practices

- Never put essential content in a carousel. A slide past the first is content a reader may never see.
- Size the slides on `Carousel.Item` with your own width classes — the item is deliberately unsized so a page can show one slide on mobile and three on desktop.
- Set `--carousel-gap` on the root to change the space between slides; left alone it is `var(--spacing-md)`. A band whose slides carry their own borders sets it to `0` so the borders meet instead of floating apart.
- Keep a partial slide visible at the trailing edge on narrow screens; a peek is what tells a reader the track scrolls at all.
- The track is dragged with the pointer as well as scrolled. A mouse gets a grab cursor and drags the row directly; touch and pen keep native scrolling and its momentum, which is already better than anything a handler would impose.
- Always name the carousel with `ariaLabel`. "Customer stories" tells a screen-reader user what they are about to scroll through; an unnamed scroll region does not.
- The track never advances on its own, and it must not be made to. Auto-advancing content needs a pause control under WCAG 2.2.2 and steals reading time from everyone.

## Usage

```vue
<script setup>
import Carousel from '@aziontech/webkit/carousel'
</script>

<template>
  <Carousel aria-label="Customer stories">
    <template #controls>
      <Carousel.Previous />
      <Carousel.Next />
    </template>
    <Carousel.Item class="w-72">First slide</Carousel.Item>
    <Carousel.Item class="w-72">Second slide</Carousel.Item>
    <Carousel.Item class="w-72">Third slide</Carousel.Item>
  </Carousel>
</template>
```

## Sub-components

- `carousel-item/carousel-item.vue` — one slide; a snap point in the track that does not shrink and takes its width from the consumer.
- `carousel-previous/carousel-previous.vue` — context-aware control that steps the track back; disables itself at the start.
- `carousel-next/carousel-next.vue` — context-aware control that steps the track forward; disables itself at the end.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `ariaLabel` | `string` | `''` | false | Accessible name for the scrollable track, announced before its contents. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The slides, composed as `Carousel.Item` elements in reading order. |
| `controls` | — | The step controls, composed as `Carousel.Previous` and `Carousel.Next`; rendered above the track. |

## States

- Visual states: `default`, plus `hover` / `focus-visible` / `disabled` on each step control
- `data-scrollable` is present on the root while the track overflows its row; a track that fits renders no controls to press
- The track carries `data-scrollable` too, which is what gives it the grab cursor; a track that fits shows the ordinary pointer, because there is nothing to drag
- `data-dragging` is on the track for the length of a mouse drag: the cursor closes, snapping and smooth scrolling stand down so the row tracks the pointer exactly, and text selection is suppressed
- A drag that travels more than a few pixels swallows the click it ends on, so releasing over a link inside a slide does not follow it
- Each control carries `disabled` at its end of the track, so a reader is never offered a step that does nothing
- The track is focusable and shows the focus ring, because a scrollable region must be reachable by keyboard

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| step control pressed | `scroll-smooth` on the track | native smooth scrolling | `motion-reduce:scroll-auto` (jumps instantly) |
| control hover / focus | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| pointer drag | none — the track follows the pointer 1:1 (`data-[dragging]:scroll-auto` stands the smooth scroll down) | — | unaffected; the drag is direct manipulation, not motion |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| control surface | `var(--bg-surface)` |
| control border | `var(--border-default)` |
| control glyph | `var(--text-muted)` |
| control glyph (hover) | `var(--text-default)` |
| control shape | `var(--shape-button)` |
| spacing (slide gap) | `var(--spacing-md)`, as the fallback of `--carousel-gap` — a band that wants its slides flush sets that property to `0` on the root |
| spacing (controls gap) | `var(--spacing-sm)` |
| spacing (controls to track) | `var(--spacing-lg)` |
| ring | `var(--ring-color)` |
| focus ring offset | `var(--bg-canvas)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the track and both controls carry `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` reaches the controls and the track itself; with the track focused the arrow keys scroll it natively, and `Enter` / `Space` on a control steps one slide. No custom key handler replaces native scrolling. Pointer dragging is an addition for mice, never the only way to move the track — the keyboard, the wheel, touch and the step controls all still reach every slide.
- ARIA: the root is a `<section>` with `aria-roledescription="carousel"` named by `ariaLabel`; the track is a `<ul>` of `<li>` slides carrying `tabindex="0"` so the scrollable region is keyboard-reachable (WCAG 2.1.1); each control is a real `<button>` with its own `ariaLabel` and the native `disabled` state at its end of the track.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the control glyph is `var(--text-muted)` on `var(--bg-surface)` and darkens to `var(--text-default)` on hover; slide content carries its own colours.
- `motion-reduce:scroll-auto` on the track and `motion-reduce:transition-none` on the controls. The track never auto-advances, so WCAG 2.2.2 (pause, stop, hide) does not apply by construction.
- Touch target ≥40×40 px — each step control is a 40×40 button.

## Stories (Storybook)

- Default
- Peek — narrow slides that overflow the row so the track scrolls and both controls are live (justified: a carousel whose content fits shows no scrolling and no enabled control, so the default alone never exercises the component's purpose)

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
