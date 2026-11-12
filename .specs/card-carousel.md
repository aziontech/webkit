---
name: card-carousel
category: sections
structure: monolithic
status: approved
spec_version: 1
template: 2
checksum: 736d5d2d3f65c6f89832740fbff986a4ede2ba0527fd7c8e384b3df27dc5be19
created: 2026-11-12
last_updated: 2026-11-12
---

# CardCarousel — Component Spec

## Purpose

The titled card-carousel band of a product or solution page: a section title on the start of the row with the previous/next controls at its end, over a horizontally scrolling track of standalone cards. Each card is an optional overline (the category), a heading, a sentence and, when it links somewhere, a mono link label closed by an arrow ("See example", "See solution"). The band answers "see how to use", "industries", "orchestration with control" on azion.com product pages, where the cases outnumber the row.

It is a page section — the site places it from a `{ _id: 'card-carousel', props }` entry and binds `props` straight onto it — so its whole API is the props below. It composes `carousel` (`kind="cards"`, its `header` slot, `size="medium"` items and its step controls), `section-title` and `overline`, and owns only the card's inner layout.

## When to use

- Four or more cases, industries or examples of equal weight that do not all need to be seen: the reader steps through them.
- When each case is a short card (overline, heading, one or two sentences) that may link to its own page or example.

## When NOT to use

- When every case must be visible, or there are three or six of equal weight → use `use-case-links` (linked grid) or `use-cases` (grid with one action).
- For a quote or testimonial row → use `quote-carousel` or `client-quotes`.
- For numbered principles pinned while the page scrolls → use `sticky-carousel`.
- For articles with images → use `article-cards`.

## Related

- `carousel` — the primitive this band composes; reach for it directly only for a non-card row.
- `use-case-links` — the same content as a static, fully visible grid.
- `sticky-carousel` — numbered dark cards pinned on scroll.

## Best practices

- Give the band a `title`; its arrows sit on the title row, and the title names the row for assistive technology.
- Keep each card to a heading and one or two sentences, so the row height stays even.
- Use `eyebrow` on every card or on none; a row where some cards carry an overline reads as ragged.
- Give every card a `linkLabel` when every card has an `href`, and none when none does. The label is a visual cue; the card heading is the link.
- Pass as many cards as the content has; the track scrolls, so the count never has to fill the row.

## Usage

```vue
<script setup>
  import CardCarousel from '@aziontech/webkit/card-carousel'
</script>

<template>
  <CardCarousel
    title="See how to use"
    :items="[
      {
        eyebrow: 'E-commerce',
        title: 'E-commerce product image optimization',
        description: 'Serve product images at the right size and format for each device.',
        href: '/docs/image-processor/ecommerce',
        linkLabel: 'See example'
      },
      {
        eyebrow: 'Media',
        title: 'News and media site responsive images',
        description: 'Deliver article images that load instantly on any device.',
        href: '/docs/image-processor/media',
        linkLabel: 'See example'
      }
    ]"
  />
</template>
```

## Props

| Prop          | Type                 | Default | Required | JSDoc                                                                                                                           |
| ------------- | -------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`      | `string`             | `''`    | false    | In-page id set on the band so a hash link can target it.                                                                        |
| `eyebrow`     | `string`             | `''`    | false    | Overline above the band title.                                                                                                  |
| `title`       | `string`             | `''`    | false    | Headline of the band, rendered as its `h2` at the start of the row the step controls end; the band renders no title when empty. |
| `description` | `string`             | `''`    | false    | Supporting sentence under the headline.                                                                                         |
| `items`       | `CardCarouselItem[]` | `[]`    | false    | The cards, in order; each is `{ eyebrow?, title, description, href?, linkLabel? }`, and a card with `href` links to it.         |
| `ariaLabel`   | `string`             | `''`    | false    | Accessible name of the card row; defaults to the title.                                                                         |

`CardCarouselItem` is an exported type: `eyebrow?: string` (the card's overline, its category), `title: string` (its `h3`), `description: string`, `href?: string` (the card links here; the heading is the link and the whole card is its hit area), `linkLabel?: string` (the mono label closed by an arrow at the foot of a linked card; ignored without `href`).

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; each linked card has `hover` (the arrow nudges toward the end edge, the label brightens) and `focus-visible` (an inset ring on the whole card).
- Empty: with no `items` the band renders nothing — no title, no controls.
- Untitled: with no `title` the controls sit alone at the start of the row (the carousel's own layout) and the row is named by `ariaLabel` only.
- Unlinked card: without `href` the card is a plain card with no hover state and no link label.
- The step controls carry `disabled` at each end of the track, from the carousel; a row that fits shows both disabled.
- `loading`, `error`, `disabled`, `readonly`, `invalid`, `open`: the band cannot be in these states; it renders static content from props.

## Motion & Animations

| Trigger              | Animation / Transition                                                              | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                     |
| -------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------- |
| linked card hover    | `transition-[translate] duration-moderate-02 ease-expressive-entrance` on the arrow | catalog duration and easing                       | `motion-reduce:transition-none`             |
| linked card hover    | `transition-colors duration-fast-02 ease-productive-entrance` on the link label     | catalog duration and easing                       | `motion-reduce:transition-none`             |
| step control pressed | the carousel's native smooth scroll                                                 | owned by `carousel`                               | `motion-reduce:scroll-auto` (in `carousel`) |

## Tokens

| Region                              | Token (DESIGN.md)                                                         |
| ----------------------------------- | ------------------------------------------------------------------------- |
| band inset                          | `var(--spacing-lg)`                                                       |
| card surface, border, shape, gutter | owned by `carousel` (`kind="cards"`)                                      |
| card stack gap                      | `var(--spacing-sm)`                                                       |
| link label gap above                | `var(--spacing-lg)`                                                       |
| card heading                        | `.text-heading-sm`, `var(--text-default)`                                 |
| card copy                           | `.text-body-md`, `var(--text-muted)`                                      |
| link label                          | `.text-overline-sm`, `var(--text-muted)` → `var(--text-default)` on hover |
| link arrow                          | `var(--text-primary)`                                                     |
| focus ring                          | `var(--ring-color)`                                                       |
| card overline                       | owned by `overline`                                                       |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Pattern: the WAI-ARIA APG carousel (`aria-roledescription="carousel"`, named region) from `carousel`; the band root is a plain container so the row is the one named region, named by `ariaLabel` or the title.
- Outline: the title is the section title's `h2`; each card heading is an `h3`.
- Links: on a linked card the `h3` holds the anchor, so the link's name is the card title; a stretched `::after` makes the whole card its hit area. The link label and its arrow are `aria-hidden` decoration.
- Keyboard map: `Tab` reaches the previous control, the next control, the track (arrow keys scroll it natively) and each card link in order; `Enter` / `Space` on a control steps one card; `Enter` on a card link follows it. A card that scrolls into focus is brought into view by the browser.
- Visible focus: card links draw `focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)` around the whole card; the controls and track carry the carousel's ring.
- Contrast ≥4.5:1: copy is `var(--text-muted)` on `var(--bg-surface)`; the link label is `var(--text-muted)` at rest; the arrow is `var(--text-primary)` (≥3:1 as a graphic).
- `motion-reduce:transition-none` on every transition; the track never auto-advances (WCAG 2.2.2 does not apply).
- Touch target ≥40×40 px: the controls are 40×40; a card link spans its whole card.

## Internationalization

- No built-in strings: every visible string is marketing copy and arrives through props in the page's language. The control names and the `carousel` role description come from `carousel`'s own locale group (en, pt-BR, es).
- Formatting: none.

## Right-to-left

- Layout: logical utilities only; the title row keeps the title at the start edge and the controls at the end edge.
- Icons: the link arrow (`pi pi-arrow-right`) mirrors under `rtl:-scale-x-100` and its hover nudge runs toward the end edge (`rtl:group-hover/card:-translate-x-0.5`); the carousel's chevrons mirror in `carousel`.
- Keyboard: the next control steps toward the end edge in both directions (`carousel`).
- User data: none.

## Responsive

- Container queries: none; the cards have a fixed width (`size="medium"`, `var(--container-sm)`) and the track scrolls.
- Narrow (≤ 640 px): each card is 85% of the viewport wide, so one card fills a phone and the next peeks; the title wraps inside its cell while the controls stay on its row.
- Touch: the track swipes natively; the hover nudge is decoration only, and every card stays a full-card link on touch.
- Reflow: the page never scrolls sideways at 320 px; only the track does, which is the component's purpose (WCAG 1.4.10 exception for a carousel).

## Performance

- Bundle budget: 7.5 KB gzip for `./card-carousel` in `.size-limit.json` (measured + headroom).
- Runtime budget: none: static; the carousel adds one passive scroll listener and one `ResizeObserver`.
- Heavy parts: none.

## Examples

- Default — six use-case cards with an overline, a heading, a sentence and a "See example" link, under an eyebrowed title.
- Plain cards — industries without overline or link (justified: the unlinked card is a separate render path with no hover state and no link label).

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
