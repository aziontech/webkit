---
name: media-split-stack
category: sections
structure: monolithic
status: implemented
spec_version: 2
template: 2
created: 2026-11-05
last_updated: 2026-11-12
checksum: e38557d13eded04e56a919191b3d4100810c9be8b620414202b52f9aecef1bf3
---

# MediaSplitStack — Component Spec

## Purpose

A run of large media-split bands that pile up under the site header as the page scrolls, each a centered claim with an outlined "learn more" button beside its picture, the whole band linking through. An optional large centered section title opens the run. It is a page section — the site places it from a `{ _id: 'media-split-stack', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `band-stack`, `media-split`, `illustration`, `product-widget`, `diagram` and `button`. A band's picture is one of four things: a `ProductWidget` console mock (`widget`), a `Diagram` request-flow figure (`diagram`), a registry `illustration`, or an `image` URL, plain or `imageFramed` on its own plate. `kind` picks the layout only: `media-end` sets every picture at the closing end, `alternating` starts it at the opening end and swaps sides band by band; the bands keep the same shape in both.

## When to use

- To list the solution areas or the claims of a page, one large band each, with a link through to its own page.

## When NOT to use

- For a single claim beside its media → use `media-split` directly.
- For small reasons in a grid → use `feature-tiles`.

## Related

- `band-stack` — the sticky run the bands pile up in.
- `media-split` — the band each entry renders through.

## Best practices

- Give a band one picture: `widget` (a `ProductWidget` name — the product's console screen), `diagram` (a `Diagram` name — its request flow), `illustration` (a registry name, with `illustrationLabel`) or `image` (a URL, with `imageAlt` when it says something). When several are set the first in that order wins; a band with none renders without its media cell.
- Prefer `widget` or `diagram` on a product page: they show the product itself, where an illustration only evokes it. Do not drop to `media-split` and its `media` slot to place one.
- Set `imageFramed` for a picture that is an object rather than a scene — a badge, a logo, a screenshot: it sits whole on a rounded, bordered plate inset in the cell. A plain `image` is scaled to fit the cell and never overflows it.
- Give every band an `action`; it is both the button and the link the whole band follows.

## Usage

```vue
<script setup>
  import MediaSplitStack from '@aziontech/webkit/media-split-stack'
</script>

<template>
  <MediaSplitStack
    kind="alternating"
    eyebrow="Managed Infrastructure"
    title="Stop managing regions and capacity by hand"
    :bands="[
      {
        title: 'Run closer to users',
        description: 'Handle requests close to users.',
        illustration: 'fastest-path-to-live-website',
        illustrationLabel: 'Requests served from the nearest data center',
        action: { label: 'Learn more', href: '/products/application-accelerator' }
      }
    ]"
  />
</template>
```

## Props

| Prop      | Type                    | Default       | Required | JSDoc                                                                                                                                                                                                                                                                                                                                                                      |
| --------- | ----------------------- | ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`    | `MediaSplitStackKind`   | `'media-end'` | false    | Layout of the run: `media-end` sets every picture at the closing end, `alternating` starts it at the opening end and swaps sides band by band.                                                                                                                                                                                                                             |
| `eyebrow` | `string`                | `''`          | false    | Overline above the section title.                                                                                                                                                                                                                                                                                                                                          |
| `title`   | `string`                | `''`          | false    | Headline of the run, rendered by the large centered section title as its `h2`; the run renders no header when empty.                                                                                                                                                                                                                                                       |
| `bands`   | `MediaSplitStackBand[]` | `[]`          | false    | The bands, in order; each is `{ title, description, widget?, diagram?, image?, imageAlt?, imageFramed?, illustration?, illustrationLabel?, action? }` where `widget` is a `ProductWidget` name, `diagram` a `Diagram` name, `image` a picture URL, `illustration` a registry name, and `action` `{ label, href }` the outlined button and the link the whole band follows. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; hovering a linked band reveals its link affordance (owned by `media-split`)
- `data-kind` mirrors the `kind` prop
- Empty: when `bands` is empty the run renders nothing — not the header, not the stack
- The header renders only when `title` is set; a band renders its button and its link only when it has an `action`, and its media cell only when it has a picture
- Media precedence per band: `widget`, then `diagram`, then `illustration`, then `image`. A widget or a diagram is inset from the cell's edges (`media-split`'s `mediaPadded`), and so is a framed image; an illustration and a plain image run flush
- A widget plays its beat while the pointer is over its band (`hover`), and shows its finished state on touch and under reduced motion (owned by `product-widget`); it draws no collaborator cursor (`cursor` off), so the band reads as the product screen
- Widget and diagram load on demand (`defineAsyncComponent`): a run that uses neither never downloads them

## Motion & Animations

_none_

## Tokens

| Region               | Token (DESIGN.md)                                                 |
| -------------------- | ----------------------------------------------------------------- |
| band rules and marks | `var(--border-default)`                                           |
| framed image plate   | `var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)` |
| framed image inset   | `var(--spacing-md)`                                               |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `button` and `media-split`'s media link.
- Keyboard map: `Tab` reaches each band's media link and button; `Enter` follows them.
- ARIA: the run is a `<section>` named by its title (`aria-label`) when one is set; each band is `media-split`'s own section named by the band's title, with its headline as an `h2`; illustrations are named by `illustrationLabel` and images by `imageAlt`, or decorative when empty; a diagram is a `figure` named by the description its library entry carries; a widget is an inert, `aria-hidden` picture of the console, so the band's copy carries its meaning.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `media-split` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the run adds no motion.
- Touch target ≥40×40 px: the medium buttons and the band links.

## Internationalization

- No built-in strings: every visible string arrives through props in the page's language. Widget and diagram text is product UI copy owned by `product-widget` and `diagram`.
- Formatting: none.

## Right-to-left

- Layout: logical utilities only; `alternating` swaps the media side with the reading direction (owned by `media-split`).
- Icons: the button's trailing chevron mirrors (owned by `button`).
- Keyboard: unchanged.
- User data: none.

## Responsive

- Container queries: none; `media-split` stacks the media under the copy below `lg`.
- Narrow (≤ 640 px): one column per band; a widget, a diagram and a framed image scale down with the cell.
- Touch: a widget shows its finished state instead of the hover beat; the whole band stays one link.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 12 KB gzip for `./media-split-stack` (initial chunk only) in `.size-limit.json`; `product-widget` and `diagram` are async chunks loaded only by a band that uses them.
- Runtime budget: none: static apart from the widget beat, which runs only while its band is hovered.
- Heavy parts: `product-widget` (each widget is its own chunk) and `diagram`, both lazy.

## Examples

- Default
- Types — composite story rendering both `kind` values stacked.
- Product media — bands whose pictures are a `ProductWidget`, a `Diagram` and a framed image (justified: `widget`, `diagram` and `imageFramed` are three render paths the default does not reach).

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
