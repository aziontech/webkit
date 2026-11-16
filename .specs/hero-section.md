---
name: hero-section
category: section
structure: monolithic
status: implemented
spec_version: 12
created: 2026-11-05
last_updated: 2026-11-16
checksum: 1379e820c644a39ab849d0204444f7b3b1f264f04480c4c3ac2ffd30dec3e1ba
template: 2
---

# HeroSection — Component Spec

## Purpose

The opening band of a marketing page: the page `h1` with its overline, accent phrase, sentence and up to two actions, full width above the page column, with an optional client strip on the floor. It is a page section — the site places it from a `{ _id: 'hero-section', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button` and `illustration`, plus `flow-diagram` and `tag` for the topology and `section-container`, `section-module`, `registration-frame`, `card-grid`, `feature-item` and `section-gap` for the argument grid. `variant` picks the layout only: `center` fills a screen over a dot field with the copy centered, `title-band` is a padded band with the copy centered, `copy-beside-art` sets an illustration (or an `image`) beside the copy, sized from that illustration's own drawn bounds so it bleeds past the column edge and trims its empty top and bottom, and `copy-on-top-art` fills a screen with the copy centered over a scene in its `top` or `bottom` slot, unpadded so the scene reaches the band's edges, and draws a `FlowDiagram` topology from `levels` in the bottom window when neither slot is given, so page JSON can carry the scene as data; every layout takes the same copy, actions and client strip, and any layout can set a framed grid of arguments (`items`, three to a row, each a `FeatureItem`) under the band. The client strip's overline falls back to the locale catalog (`Proven on mission-critical workloads`).

## When to use

- Use HeroSection for every marketing page opening; pick the layout with `variant`.
- To open a home, solution, product, listing or contact page with its headline and main actions; add `items` for a grid of arguments under it, or `levels` with `variant="copy-on-top-art"` for a topology under the copy.
- Rendering page JSON, or you need a whole band with no custom content → the section (`hero-section`). Building an SFC by hand, needing slots, or nesting inside another band → the primitive (`hero`).
- Pick the layout by page type (azion.com):
  - Home and the product index page: `center` with the client marquee (`marqueeMarks`). No other page type opens with it.
  - Every product page: `title-band` with `size="large"`.
  - Compliance, Recognitions, Support, Careers and Resource Hub: `center-band`.
  - Blog: `title-band` with `size="medium"`, followed by a `small` `section-gap`.
  - Any other page: `title-band`.

## When NOT to use

- When the page exists to capture a lead and the form sits above the fold → use `hero-form-section`.
- `center` with the client marquee on any page other than Home and the product index page → use `title-band` (or `center-band` on the pages listed under When to use).
- In a hand-built SFC that needs slots HeroSection does not offer → use the `hero` primitive.
- For a band inside the page column → use `section-module` or a sibling section.

## Related

- `hero` — the band primitive every layout is rendered with.
- `hero-title` — the headline block rendered inside it.
- `hero-form-section` — the opening band with a lead form beside the copy.
- `flow-diagram` — the diagram primitive the `levels` topology is drawn with.
- `feature-item` — the icon, heading and sentence each argument of `items` is rendered with.

## Best practices

- Use `title-band` with `size="large"` for a product page and `size="medium"` for a page whose bands start right under the headline.
- Give `illustration` and `illustrationAriaLabel` only to the `copy-beside-art` layout; the other layouts ignore them.
- Leave `titleLength` at `short` for a headline of up to about 50 characters (about seven words): like azion.com, the `center`, `title-band` and `center-band` layouts set it on a narrower measure than the sentence under it, so "Certifications and Compliance" breaks over two lines. Use `long` for a headline of about 51 to 90 characters, which would run to three lines on the short measure. Rewrite a headline longer than about 90 characters; count the string as rendered, in each locale.
- Leave `headerOffset` at its default under `SiteHeaderSection`: it takes the bar's `--layout-header-height` out of a band that fills a screen, so the band fills exactly the first screen with it. Set it empty only on a page with no header above the band; never a literal length.

## Usage

```vue
<script setup>
  import HeroSection from '@aziontech/webkit/hero-section'
</script>

<template>
  <HeroSection
    variant="title-band"
    size="large"
    eyebrow="Cache"
    title="Deliver content fast, worldwide"
    description="Serve cached content close to users."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
  />
</template>
```

## Props

| Prop                    | Type                     | Default                         | Required | JSDoc                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ------------------------ | ------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`               | `HeroSectionVariant`     | `'title-band'`                  | false    | Layout of the band: `center` fills a screen over a dot field, `title-band` is a padded band, `center-band` is a large site-wide band with the copy centered, `compact-band` is a short site-wide band with the copy at the start, `copy-beside-art` sets an illustration or an image beside the copy, `copy-on-top-art` fills a screen with the copy centered over a scene in the `top` or `bottom` slot. |
| `size`                  | `HeroSectionSize`        | `'medium'`                      | false    | Vertical rhythm of the band; `large` is the opening a product page leads with.                                                                                                                                                                                                                                                                                                                            |
| `eyebrow`               | `string`                 | `''`                            | false    | Short overline above the headline.                                                                                                                                                                                                                                                                                                                                                                        |
| `titleHighlight`        | `string`                 | `''`                            | false    | Opening words of the headline, painted in the brand accent; reads as one sentence with `title`.                                                                                                                                                                                                                                                                                                           |
| `title`                 | `string`                 | `''`                            | false    | Page headline, rendered as the page `h1`; the band renders nothing when empty.                                                                                                                                                                                                                                                                                                                            |
| `description`           | `string`                 | `''`                            | false    | Sentence under the headline.                                                                                                                                                                                                                                                                                                                                                                              |
| `primaryAction`         | `SectionTitleAction`     | `undefined`                     | false    | First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link.                                                                                                                                                                                                                                                                                               |
| `secondaryAction`       | `SectionTitleAction`     | `undefined`                     | false    | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link.                                                                                                                                                                                                                                                                                      |
| `marqueeLabel`          | `string`                 | `''`                            | false    | Eyebrow above the client marquee; empty uses the locale catalog (`Proven on mission-critical workloads`).                                                                                                                                                                                                                                                                                                 |
| `marqueeMarks`          | `string[]`               | `[]`                            | false    | Registry names of the client marks on the band floor, in order; the marquee renders only when it has marks.                                                                                                                                                                                                                                                                                               |
| `illustration`          | `string`                 | `''`                            | false    | Registry name of the illustration set beside the copy in the `copy-beside-art` layout.                                                                                                                                                                                                                                                                                                                    |
| `illustrationAriaLabel` | `string`                 | `''`                            | false    | Accessible description of the illustration.                                                                                                                                                                                                                                                                                                                                                               |
| `image`                 | `HeroSectionImage`       | `undefined`                     | false    | Image set beside the copy in the `copy-beside-art` layout when no `illustration` is given; `{ src, alt, width, height }`. A portrait image (taller than wide) is drawn at half width, centered, below `md`.                                                                                                                                                                                               |
| `eyebrowPrefix`         | `HeroTitleEyebrowPrefix` | `'//'`                          | false    | Mark set before the eyebrow (`//`, `<>`, `</>`, or empty for none); drawn only with an eyebrow.                                                                                                                                                                                                                                                                                                           |
| `anchor`                | `string`                 | `''`                            | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                                                                                                                                                                                                                                            |
| `headerOffset`          | `string`                 | `'var(--layout-header-height)'` | false    | Height of the site header above the band, taken out of a band that fills a screen; defaults to the `SiteHeaderSection` bar's token, any CSS length, empty for a page with no header above it.                                                                                                                                                                                                             |
| `titleLength`           | `HeroSectionTitleLength` | `'short'`                       | false    | Length of the headline: `short` sets it on the site's narrow headline measure in the centered layouts, so a four-to-seven-word headline breaks over two balanced lines while the sentence under it keeps the full column; `long` lets the headline take the whole column.                                                                                                                                 |
| `plain`                 | `boolean`                | `false`                         | false    | Drops the dot texture of the `center` layout.                                                                                                                                                                                                                                                                                                                                                             |
| `levels`                | `HeroSectionLevel[]`     | `[]`                            | false    | Columns of the topology the `copy-on-top-art` layout draws under the copy when neither scene slot is given, left to right; each is `{ nodes }`, the cards top to bottom, each `{ eyebrow, icon, title, label, severity, lit? }`. A card without `title` is skipped.                                                                                                                                       |
| `items`                 | `HeroSectionItem[]`      | `[]`                            | false    | Arguments in a framed grid under the band, three to a row; each is `{ icon, title, description }`. The grid renders only when there are items.                                                                                                                                                                                                                                                            |

## Events

| _none_ | — | — |

## Slots

| Slot     | Scope | Notes                                                                                                                                                                  |
| -------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `top`    | —     | A scene in the window above the copy (`ConsoleMockup`, a diagram). The design sample's hero scenes render here.                                                        |
| `bottom` | —     | A scene in the window under the copy; it enters after the copy (`animate-content-enter`, off under reduced motion) and fades at the inline edges on narrow containers. |

## States

- Visual states: `default`
- `data-variant` mirrors the `variant` prop and drives the hero's height, width, backdrop and the copy alignment
- `data-title-measure="narrow"` on the root when the headline is set on the narrow measure (`titleLength: 'short'` in the `center`, `title-band` and `center-band` layouts); the headline then caps at `--container-lg` while the description keeps the column
- Empty: when `title` is empty the band renders nothing but its root
- The client strip renders only when `marqueeMarks` has marks; each action renders only with a label and a link; the art renders only in the `copy-beside-art` layout with `illustration` or `image` set (`illustration` wins when both are given)
- `copy-beside-art` art bounds: a registered illustration whose drawn area is known (the `azion-to-*` comparisons and the solution illustrations) takes a width, a bleed past the column's end edge and a top and bottom trim computed from where it is drawn on its canvas, set as `--hero-section-art-width`, `--hero-section-art-bleed`, `--hero-section-art-trim-top` and `--hero-section-art-trim-bottom` on the art box from `md` up; any other illustration keeps the default bounds (161.45 % wide, 35.73 % bleed, no trim); an `image` fills the media column. Below `md` the art takes the column width
- `data-orientation="portrait"` on an `image` taller than it is wide
- Topology: in `copy-on-top-art` with no `top` or `bottom` slot, `levels` draws a `FlowDiagram` in the bottom window, one column per level and one card per node with a title; a level left with no card is dropped, and with none left the window is not drawn. A lit node carries `data-lit` and a brand glow. Other layouts ignore `levels`, and a slotted scene wins over it
- Argument grid: `items` renders a framed three-column `CardGrid` of `FeatureItem`s (headings at level 2) inside a site-wide `SectionContainer` under the hero, closed by a hatched `SectionGap`; only with a title and at least one item

## Motion & Animations

- `animate-content-enter` with `[--content-enter-delay:120ms]` on the `bottom` scene window, so the scene settles in after the copy; `motion-reduce:animate-none` on the same class string.
- `transition-colors duration-moderate-01 ease-productive-entrance` on each topology card's border (hover and focus inside); `motion-reduce:transition-none` on the same class string.

## Tokens

| Region               | Token (DESIGN.md)                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| anchor scroll offset | `var(--spacing-2xl)`                                                                                                                                     |
| topology card        | `var(--bg-surface)`, `var(--border-default)`, `var(--border-strong)` on hover, `var(--primary)` on the lit card, `var(--shadow-xs)`, `var(--shape-card)` |
| topology card text   | `var(--text-muted)`, `var(--text-default)`                                                                                                               |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `button`.
- Keyboard map: `Tab` moves through the actions; the client strip is not focusable.
- ARIA: the hero `<section>` is named by the full headline (`aria-label`); the headline is the page `h1`; the illustration is named by `illustrationAriaLabel`, decorative when empty; an `image` carries its `alt`. The topology cards are static text (eyebrow, title, status tag), not focusable; each argument heading is an `h2` under the page `h1`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `hero-title` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the client strip stops under reduced motion in `marquee`.
- Touch target ≥40×40 px — the large buttons meet it.

## Internationalization

| Key                         | English source                       | Override prop  |
| --------------------------- | ------------------------------------ | -------------- |
| `heroSection.carouselLabel` | Proven on mission-critical workloads | `marqueeLabel` |

- Formatting: none; every other text is a prop from the page JSON.

## Right-to-left

- Layout: logical utilities only; in `copy-beside-art` the art bleeds past the end edge (`-me-`) and moves to the start side under `dir="rtl"`.
- Icons: the action chevrons mirror with `button`; illustrations, images and client marks are not mirrored.
- Keyboard: no arrow-key handling.
- User data: none.

## Responsive

- Container queries: the `bottom` scene window reads its container (`@max-2xl` fades its inline edges); the layouts switch at viewport breakpoints.
- Narrow (below `md`): in `copy-beside-art` the copy centres and stacks over the art, which takes the column width with no bleed or trim; a portrait image takes half the width, centered.
- Touch: the large buttons meet 40 px; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the art bleed applies from `md` only and is clipped by the hero.

## Performance

- Bundle budget: the `.size-limit.json` entry `hero-section` (entry chunk only: each illustration, the `levels` topology and the `items` grid are their own async chunks, loaded only when drawn); 7.57 KB measured.
- Runtime budget: none: static; the art bounds are computed once per illustration name.
- Heavy parts: the illustration loads on demand through `illustration`; the `FlowDiagram` topology and the argument grid are async internal parts (`parts/`); images decode asynchronously.

## Examples

- Default
- Types — composite story rendering every `variant` stacked.
- Image — justification: `image` is a part no other example shows (an image beside the copy instead of an illustration, with a custom `eyebrowPrefix`).
- Topology — justification: `levels` is a part no other example shows (the `copy-on-top-art` scene drawn from data).
- Arguments — justification: `items` is a part no other example shows (the argument grid under the band).

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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
