---
name: carousel
category: marketing
structure: composition
status: implemented
spec_version: 2
template: 2
checksum: ee8065eb67b6165dadf899de2b8df7a71e9f1406b9eda67ec823cf99205a6d1c
created: 2026-09-22
last_updated: 2026-11-12
---

# Carousel — Component Spec

## Purpose

A horizontally scrollable track of cards with snap points and a pair of step controls. It is built on native scrolling and CSS scroll snap rather than a carousel runtime, so it is draggable, swipeable and keyboard-scrollable by default, and it never moves on its own.

The unit is Carousel, then a `Carousel.Item` card, then its content — usually a `quote` or a `topic`. Two layouts, set on the root with `kind`: `strip` (the default) sets the cards edge to edge with no gutter — each draws its own hairline and the next one overlaps it by a pixel, so the row reads as one ruled strip; `cards` separates them with a gutter and rounds each one, so the row reads as a set of standalone cards. Each card takes its width from its own `size`, never from a class. The track fades at whichever end still has cards past it.

An optional `header` slot shares the row the step controls sit in: the band's title goes at the start and the controls move to the end, so a titled carousel needs no hand-built row around it.

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
- `topic` — the usual slide content.
- `scroll-area` — the console's styled scroll container; this one owns snap points and step controls.

## Best practices

- Never put essential content in a carousel. A slide past the first is content a reader may never see.
- Size the cards with `size` on `Carousel.Item` (`small` `var(--container-2xs)`, `medium` `var(--container-sm)`, `large` `var(--container-md)`; each capped at 85% of the viewport on phones). Never put width classes on the item: they fight its own width and the `no-style-override` lint rejects them.
- Put content straight into `Carousel.Item`, not inside another framed box. The item is already the card (border, surface, padding), and a second frame inside it draws two rules.
- Pick the layout with `kind`: `strip` for a ruled row of quotes or figures that reads as one surface, `cards` for standalone cards with a gutter (use-case cards, articles). Never add margins to the items to fake a gutter.
- Put the band's title in the `header` slot when the controls belong on the title row; the controls then sit at the row's end. For a whole titled band of overline/title/text cards use the `card-carousel` section instead of composing one.
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
  <Carousel
    kind="cards"
    aria-label="Customer stories"
  >
    <template #header>
      <h2>Customer stories</h2>
    </template>
    <template #controls>
      <Carousel.Previous />
      <Carousel.Next />
    </template>
    <Carousel.Item size="small">First slide</Carousel.Item>
    <Carousel.Item size="small">Second slide</Carousel.Item>
    <Carousel.Item size="small">Third slide</Carousel.Item>
  </Carousel>
</template>
```

## Sub-components

- `carousel-item/carousel-item.vue` — one card; a bordered, padded surface that is a snap point in the track, does not shrink and stretches its content to the row's tallest card. Prop `size?: CarouselItemSize` (`'small' | 'medium' | 'large'`, default `'medium'`) sets its width: `small` `var(--container-2xs)`, `medium` `var(--container-sm)`, `large` `var(--container-md)`, each at most 85% of the viewport below `sm`; carried as `data-size`. It reads the root's `kind` from the carousel context and carries it as `data-kind`: under `cards` it rounds its corners (`var(--shape-card)`) and drops the one-pixel overlap. `CarouselItemSize` is an exported type.
- `carousel-previous/carousel-previous.vue` — context-aware control that steps the track back; disables itself at the start.
- `carousel-next/carousel-next.vue` — context-aware control that steps the track forward; disables itself at the end.

## Props

| Prop        | Type           | Default   | Required | JSDoc                                                                                                                                 |
| ----------- | -------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaLabel` | `string`       | `''`      | false    | Accessible name for the scrollable track, announced before its contents.                                                              |
| `kind`      | `CarouselKind` | `'strip'` | false    | Layout of the row: `strip` sets the cards edge to edge as one ruled strip, `cards` separates them with a gutter and rounds each card. |

## Events

| _none_ | — | — |

## Slots

| Slot       | Scope | Notes                                                                                                                                    |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `default`  | —     | The slides, composed as `Carousel.Item` elements in reading order.                                                                       |
| `controls` | —     | The step controls, composed as `Carousel.Previous` and `Carousel.Next`; rendered above the track, at the row's end when a header is set. |
| `header`   | —     | Content at the start of the controls row, usually the band's title; the controls move to the row's end.                                  |

## States

- Visual states: `default`, plus `hover` / `focus-visible` / `disabled` on each step control
- `data-kind` (`strip` | `cards`) is on the root, the track and every item; under `cards` the track gaps its items by `var(--spacing-md)` and each item is rounded
- The row above the track renders only when `header` or `controls` is filled; with a header it spreads the header to the start and the controls to the end, without one the controls sit at the start
- `data-scrollable` is present on the root while the track overflows its row; a track that fits renders no controls to press
- `data-can-scroll-prev` / `data-can-scroll-next` are on the root and the track while the track has content past its start / end edge. The track fades only the edge that continues, over 12% of its own width, so the row at rest fades on the right alone
- The fade stands down while the track has keyboard focus, so the focus ring it would otherwise mask is fully visible
- The track carries `data-scrollable` too, which is what gives it the grab cursor; a track that fits shows the ordinary pointer, because there is nothing to drag
- `data-dragging` is on the track for the length of a mouse drag: the cursor closes, snapping and smooth scrolling stand down so the row tracks the pointer exactly, and text selection is suppressed
- A drag that travels more than a few pixels swallows the click it ends on, so releasing over a link inside a slide does not follow it
- Each control carries `disabled` at its end of the track, so a reader is never offered a step that does nothing
- The track is focusable and shows the focus ring, because a scrollable region must be reachable by keyboard

## Motion & Animations

| Trigger               | Animation / Transition                                                                                 | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------- |
| step control pressed  | `scroll-smooth` on the track                                                                           | native smooth scrolling                           | `motion-reduce:scroll-auto` (jumps instantly)           |
| control hover / focus | `transition-colors duration-150 ease-out`                                                              | inline (matches catalog)                          | `motion-reduce:transition-none`                         |
| pointer drag          | none — the track follows the pointer 1:1 (`data-[dragging]:scroll-auto` stands the smooth scroll down) | —                                                 | unaffected; the drag is direct manipulation, not motion |

## Tokens

| Region                      | Token (DESIGN.md)                                                      |
| --------------------------- | ---------------------------------------------------------------------- |
| control surface             | `var(--bg-surface)`                                                    |
| control border              | `var(--border-default)`                                                |
| control glyph               | `var(--text-muted)`                                                    |
| control glyph (hover)       | `var(--text-default)`                                                  |
| control shape               | `var(--shape-button)`                                                  |
| card surface                | `var(--bg-surface)`                                                    |
| card border                 | `var(--border-default)`                                                |
| card padding                | `var(--spacing-xl)`                                                    |
| card shape (`cards`)        | `var(--shape-card)`                                                    |
| gutter (`cards`)            | `var(--spacing-md)`                                                    |
| card width                  | `var(--container-2xs)` / `var(--container-sm)` / `var(--container-md)` |
| spacing (controls gap)      | `var(--spacing-sm)`                                                    |
| spacing (controls to track) | `var(--spacing-lg)`                                                    |
| ring                        | `var(--ring-color)`                                                    |
| focus ring offset           | `var(--bg-canvas)`                                                     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the track and both controls carry `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` reaches the controls and the track itself; with the track focused the arrow keys scroll it natively, and `Enter` / `Space` on a control steps one slide. No custom key handler replaces native scrolling. Pointer dragging is an addition for mice, never the only way to move the track — the keyboard, the wheel, touch and the step controls all still reach every slide.
- ARIA: the root is a `<section>` with `aria-roledescription="carousel"` named by `ariaLabel`; the track is a `<ul>` of `<li>` slides carrying `tabindex="0"` so the scrollable region is keyboard-reachable (WCAG 2.1.1); each control is a real `<button>` with its own `ariaLabel` and the native `disabled` state at its end of the track.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the control glyph is `var(--text-muted)` on `var(--bg-surface)` and darkens to `var(--text-default)` on hover; slide content carries its own colours.
- `motion-reduce:scroll-auto` on the track and `motion-reduce:transition-none` on the controls. The track never auto-advances, so WCAG 2.2.2 (pause, stop, hide) does not apply by construction.
- Touch target ≥40×40 px — each step control is a 40×40 button.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the previous/next chevrons mirror (`rtl:-scale-x-100`).
- Keyboard and buttons: next scrolls toward the end edge; the scroll sign is inverted under `dir="rtl"` (`useDirection(track)`), and progress reads `Math.abs(scrollLeft)` because `scrollLeft` is zero or negative under `rtl`.
- Edge fades: the start/end masks follow the reading direction.
- User data: none.

## Internationalization

- Built-in strings: the root's `aria-roledescription` and the two controls' default names come from the `carousel` locale group (en, pt-BR, es). Slide content arrives through slots in the page's language.

## Responsive

- The track scrolls at every width; below `sm` every item size is capped at 85% of the viewport, so one card fills a phone with the next one peeking.
- The header row keeps the controls on the same line as the header at every width; a long header wraps inside its own cell.

## Performance

- Native scrolling and CSS scroll snap; one scroll listener (passive), one `ResizeObserver` and three window pointer listeners, all released on scope dispose.
- Bundle budget: `carousel-root` 3.85 KB gzip in `.size-limit.json`.

## Examples

- Default
- Peek — narrow quote cards that overflow the row so one lands under the trailing fade (justified: a carousel whose content fits shows no scrolling and no enabled control, so the default alone never exercises the component's purpose)
- Titled cards — `kind="cards"` with the band's title in the `header` slot and the controls at the end of the title row (justified: the header slot and the card layout are the two behaviours the default does not show)

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
