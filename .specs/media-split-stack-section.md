---
name: media-split-stack-section
category: section
structure: monolithic
status: implemented
spec_version: 10
template: 2
created: 2026-11-05
last_updated: 2026-11-24
checksum: 3647c76d97a79c16dc719202142a0f993685381f4f8fcd2f364e5bb07419ca2d
---

# MediaSplitStackSection — Component Spec

## Purpose

A run of large media-split bands that pile up under the site header as the page scrolls, each a centered claim with an outlined "learn more" button beside its picture, the whole band linking through. An optional centered section title at the medium size opens the run, as the run headers of the live product pages do. It is a page section — the site places it from a `{ _id: 'media-split-stack-section', props }` entry and binds `props` straight onto it — and it composes `module`, `module-header`, `split-stack`, `media-split`, `illustration`, `console-mockup` and `button`. Every band has a picture, and it is a drawn asset: a registered `scene`, a `ConsoleMockup` console mock (`widget`, itself a registered scene), or a registry `illustration`. The band type is a union that requires one of them; request-flow diagrams and code do not go in a media band. Every band sets its picture at the closing end, so the run reads down one edge.

## When to use

- Use MediaSplitStackSection for a run of linked claims that pile up as the reader scrolls.
- To list the solution areas or the claims of a page, one large band each, with a link through to its own page.

## When NOT to use

- For a single claim beside its picture or scene → use `media-split-section`.
- For a request-flow diagram → use `console-showcase-section` with `variant: 'diagram'`; for code → use `feature-scroll-section`.
- For small reasons in a grid → use `feature-tiles-section`.

## Related

- `split-stack` — the sticky run the bands pile up in.
- `media-split` — the band each entry renders through.

## Best practices

- Give every band one picture: `scene`, `widget` (a `ConsoleMockup` name — the product's console screen), or `illustration` (a name of the illustration registry, with `illustrationLabel`); a band takes no picture URL. The type requires one; when several are set the first in that order wins. Page JSON is untyped, so a band with none renders without its media cell, logs a development warning, and fails the site-composition check (`test/standards/site-composition.test.mjs`). A `Diagram` scene counts as none.
- Give every band an `action`; it is both the button and the link the whole band follows.

## Usage

```vue
<script setup>
  import MediaSplitStackSection from '@aziontech/webkit/media-split-stack-section'
</script>

<template>
  <MediaSplitStackSection
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

| Prop          | Type                           | Default | Required | JSDoc                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------- | ------------------------------ | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`      | `string`                       | `''`    | false    | In-page id set on the run so a `#hash` link can scroll to it.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `eyebrow`     | `string`                       | `''`    | false    | Eyebrow above the section title.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `title`       | `string`                       | `''`    | false    | Headline of the run, rendered by the medium centered section title as its `h2`; the run renders no header when empty, and with a header each band's headline drops to an `h3`.                                                                                                                                                                                                                                                                                                                |
| `description` | `string`                       | `''`    | false    | Supporting sentence under the section title.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `bands`       | `MediaSplitStackSectionBand[]` | `[]`    | false    | The bands, in order; each is `{ title, description, eyebrow?, href?, action? }` plus its required picture, one of `scene`, `widget` or `illustration` (with `illustrationLabel?`), where `eyebrow` is the band's overline, `href` the link the whole band follows (falling back to the action's), `scene` a webkit scene asset other than `Diagram`, `widget` a `ConsoleMockup` name, `illustration` a name of the illustration registry, and `action` `{ label, href }` the outlined button. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; hovering a linked band reveals its link affordance (owned by `media-split`)
- Empty: when `bands` is empty the run renders nothing — not the header, not the stack
- The header renders only when `title` is set; a band renders its button only when it has an `action`, links as a whole to its `href` (or its action's when it has none), and renders its media cell only when it has a picture; a band's `eyebrow` sits above its headline
- Band headlines are `h2` when the run has no header and `h3` under the section title, so the outline never repeats a level
- Media precedence per band: `scene`, then `widget`, then `illustration`. A widget is inset from the cell's edges (`media-split`'s `mediaPadded`); a scene and an illustration run flush
- A widget plays its beat while the pointer is over its band (`hover`), and shows its finished state on touch and under reduced motion (owned by `console-mockup`); it draws no collaborator cursor (`cursor` off), so the band reads as the product screen
- The widget loads on demand (`defineAsyncComponent`): a run that uses none never downloads it

## Motion & Animations

_none_

## Tokens

| Region               | Token (TOKENS.md)       |
| -------------------- | ----------------------- |
| band rules and marks | `var(--border-default)` |
| anchor scroll offset | `var(--spacing-2xl)`    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `button` and `media-split`'s media link.
- Keyboard map: `Tab` reaches each band's media link and button; `Enter` follows them.
- ARIA: the run is a `<section>` named by its title (`aria-label`) when one is set; each band is `media-split`'s own section named by the band's title, with its headline as an `h3` under the run's `h2` (an `h2` when the run has no title); each band's action is named by its label and the band's title (`Learn more, Edge Functions`), so five "Learn more" links read apart, and the band's media link, which repeats the action's destination, leaves the tab order; illustrations are named by `illustrationLabel`, or decorative when empty; a widget is an inert, `aria-hidden` picture of the console, so the band's copy carries its meaning.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `module-header`, `media-split` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the run adds no motion.
- Touch target ≥40×40 px: the medium buttons and the band links.

## Internationalization

- No built-in strings: every visible string arrives through props in the page's language. Widget text is product UI copy owned by `console-mockup`.
- Formatting: none.

## Right-to-left

- Layout: logical utilities only; the closing end follows the reading direction (owned by `media-split`).
- Icons: the button's trailing chevron mirrors (owned by `button`).
- Keyboard: unchanged.
- User data: none.

## Responsive

- Container queries: none; `media-split` stacks the media under the copy below `lg`.
- Narrow (≤ 640 px): one column per band; a widget and an illustration scale down with the cell.
- Touch: a widget shows its finished state instead of the hover beat; the whole band stays one link.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 12 KB gzip for `./media-split-stack-section` (initial chunk only) in `.size-limit.json`; `console-mockup` is an async chunk loaded only by a band that uses it.
- Runtime budget: none: static apart from the widget beat, which runs only while its band is hovered.
- Heavy parts: `console-mockup` (each widget is its own chunk), lazy.

## Examples

- Default — carries a section `description`, a band `eyebrow`, a band `href` distinct from its button and a live `scene`.
- Product media — bands whose pictures are a `ConsoleMockup` and a registry `illustration` with its label (justified: `widget` is a render path the default does not reach).

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
