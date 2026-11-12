---
name: media-split-band
category: sections
structure: monolithic
status: implemented
spec_version: 2
template: 2
created: 2026-11-05
last_updated: 2026-11-12
checksum: f2accb5bd7746d83f0f1cccd8bf7f3ea49f7f12f4af081333b07b19bafb80b22
---

# MediaSplitBand — Component Spec

## Purpose

One claim beside its picture, on its own frame: the copy cell with its overline, headline and sentence on one side, and the media on a raised, pixel-textured surface on the other. It is a page section — the site places it from a `{ _id: 'media-split-band', props }` entry and binds `props` straight onto it — and it composes `section-module`, a framed `media-split`, `button`, `illustration`, `product-widget`, `diagram` and the webkit scene assets. The media is a scene, a product console widget, a request-flow diagram, an image (cover or framed) or an illustration; with one action the whole band links to it, with two the band stays unlinked.

## When to use

- To make one point beside one picture and move on (a values statement, a single product claim).

## When NOT to use

- For several claims stacked one after the other → use `media-split-stack`.
- For a claim beside a code sample → use `code-split`.

## Related

- `media-split` — the band primitive the section is rendered with.
- `media-split-stack` — the stacked sibling for a run of claims.

## Best practices

- Give the band exactly one media: `scene`, `widget` (a `ProductWidget` name), `diagram` (a `Diagram` name), `image` or `illustration`; when several are set the first of that order wins.
- On a product page prefer `widget` or `diagram`: they show the product itself. Do not drop to `media-split` and its `media` slot to place one.
- Set `image.framed` for a picture that is an object rather than a scene (a badge, a logo, a screenshot): it sits whole on a rounded, bordered plate inset in the cell instead of covering it.
- Use `size="large"` for a band that carries only its headline and description.
- Give an `image` its `width` and `height` so the page reserves its box before it loads.

## Usage

```vue
<script setup>
  import MediaSplitBand from '@aziontech/webkit/media-split-band'
</script>

<template>
  <MediaSplitBand
    eyebrow="Our values"
    title="Four values shape every role at Azion"
    description="Quality, Drive, Accountability, and Innovation."
    size="large"
    :scene="{ component: 'BrandGlobeScene' }"
  />
</template>
```

## Props

| Prop                    | Type                   | Default     | Required | JSDoc                                                                                                                                                                                             |
| ----------------------- | ---------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eyebrow`               | `string`               | `''`        | false    | Short overline above the headline.                                                                                                                                                                |
| `title`                 | `string`               | `''`        | false    | Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty.                                                                         |
| `description`           | `string`               | `''`        | false    | Paragraph under the headline.                                                                                                                                                                     |
| `size`                  | `MediaSplitBandSize`   | `'medium'`  | false    | Type scale of the copy; `large` sets the headline at heading-xl and centres the copy beside the media.                                                                                            |
| `scene`                 | `MediaSplitBandScene`  | `undefined` | false    | Scene drawn in the media cell, `{ component }` naming a webkit scene asset; wins over every other media.                                                                                          |
| `widget`                | `ProductWidgetName`    | `undefined` | false    | Name of the product console widget drawn in the media cell when no scene is set.                                                                                                                  |
| `diagram`               | `DiagramName`          | `undefined` | false    | Name of the request-flow diagram drawn in the media cell when neither a scene nor a widget is set.                                                                                                |
| `image`                 | `MediaSplitBandImage`  | `undefined` | false    | Picture drawn in the media cell when no scene, widget or diagram is set; `{ src, alt?, width?, height?, framed? }`, where `framed` sets it whole on a rounded plate instead of covering the cell. |
| `illustration`          | `string`               | `''`        | false    | Registry name of the illustration drawn in the media cell when no other media is set.                                                                                                             |
| `illustrationAriaLabel` | `string`               | `''`        | false    | Accessible name of the illustration; empty keeps it decorative.                                                                                                                                   |
| `primaryAction`         | `MediaSplitBandAction` | `undefined` | false    | First button under the copy; `{ label, href, trailing?, target? }`. When it is the only action, the whole band links to it.                                                                       |
| `secondaryAction`       | `MediaSplitBandAction` | `undefined` | false    | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. With two actions the band stays unlinked.                                                                        |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `size` is forwarded to the media split and drives its type scale and copy alignment
- Empty: when `title` is empty the band renders nothing but its root; with no media set the media cell is omitted
- With exactly one action the band is a link to that action's `href`; with none or two it is not a link
- Media precedence: `scene`, `widget`, `diagram`, `image`, `illustration`. A widget, a diagram and a framed image are inset from the cell's edges (`media-split`'s `mediaPadded`); a scene, a plain image (which covers the cell) and an illustration run flush
- A widget plays its beat while the pointer is over the band, and shows its finished state on touch and under reduced motion (owned by `product-widget`); it draws no collaborator cursor (`cursor` off), so the band reads as the product screen
- Scenes, widget and diagram load on demand (`defineAsyncComponent`)

## Motion & Animations

_none_

## Tokens

| Region                | Token (DESIGN.md)                                                |
| --------------------- | ---------------------------------------------------------------- |
| media cell fill       | `var(--bg-surface)`                                              |
| frame rules and marks | `var(--border-default)`                                          |
| framed image plate    | `var(--bg-canvas)`, `var(--border-default)`, `var(--shape-card)` |
| framed image inset    | `var(--spacing-md)`                                              |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `button` and `media-split`.
- Keyboard map: `Tab` moves through the actions, and through the media link when the band links.
- ARIA: the media split's `<section>` is the band's named region (`aria-label` from `title`), so the root is a plain `div`; the headline is its `h2`; an image is named by `alt`, an illustration by `illustrationAriaLabel`, and both are decorative when empty; a diagram is a `figure` named by the description its library entry carries; a widget is an inert, `aria-hidden` picture of the console, so the copy carries its meaning.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `media-split` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the scenes stop under reduced motion on their own.
- Touch target ≥40×40 px — the medium buttons meet it.

## Internationalization

- No built-in strings: every visible string arrives through props in the page's language. Widget and diagram text is product UI copy owned by `product-widget` and `diagram`.
- Formatting: none.

## Right-to-left

- Layout: logical utilities only (owned by `media-split`).
- Icons: a trailing chevron on an action mirrors (owned by `button`).
- Keyboard: unchanged.
- User data: none.

## Responsive

- Container queries: none; `media-split` stacks the media under the copy below `lg`.
- Narrow (≤ 640 px): one column; a widget, a diagram and a framed image scale down with the cell.
- Touch: a widget shows its finished state instead of the hover beat.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 11 KB gzip for `./media-split-band` (initial chunk only) in `.size-limit.json`; scenes, `product-widget` and `diagram` are async chunks.
- Runtime budget: none: static apart from the widget beat while hovered.
- Heavy parts: the scenes, `product-widget` and `diagram`, all lazy.

## Examples

- Default
- Product media — the band with a `ProductWidget`, then with a `Diagram` (justified: `widget` and `diagram` are render paths the default does not reach).

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
