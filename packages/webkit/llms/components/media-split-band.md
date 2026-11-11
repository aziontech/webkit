# Media Split Band

> One claim beside its picture, on its own frame: the copy cell with its overline, headline and sentence on one side, and the media on a raised, pixel-textured surface on the other. It is a page section — the site places it from a `{ _id: 'media-split-band', props }` entry and binds `props` straight onto it — and it composes `section-module`, a framed `media-split`, `button`, `illustration` and the webkit scene assets. The media is a scene, an image or an illustration; with one action the whole band links to it, with two the band stays unlinked.

- Import: `import MediaSplitBand from '@aziontech/webkit/media-split-band'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [media-split-band.json](https://github.com/aziontech/webkit/blob/main/.specs/media-split-band.json)

## When to use

- To make one point beside one picture and move on (a values statement, a single product claim).

## Do

- Give the band exactly one media: `scene`, `image` or `illustration`; when several are set the first of that order wins.
- Use `size="large"` for a band that carries only its headline and description.
- Give an `image` its `width` and `height` so the page reserves its box before it loads.

## Don’t

- For several claims stacked one after the other → use `media-split-stack`.
- For a claim beside a code sample → use `code-split`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-split](media-split.md) — the band primitive the section is rendered with.
- [media-split-stack](media-split-stack.md) — the stacked sibling for a run of claims.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Paragraph under the headline. |
| `size` | `MediaSplitBandSize` | `'medium'` | false | Type scale of the copy; `large` sets the headline at heading-xl and centres the copy beside the media. |
| `scene` | `MediaSplitBandScene` | `undefined` | false | Scene drawn in the media cell, `{ component }` naming a webkit scene asset; wins over `image` and `illustration`. |
| `image` | `MediaSplitBandImage` | `undefined` | false | Picture drawn in the media cell when no scene is set; `{ src, alt?, width?, height? }`. |
| `illustration` | `string` | `''` | false | Registry name of the illustration drawn in the media cell when neither a scene nor an image is set. |
| `illustrationAriaLabel` | `string` | `''` | false | Accessible name of the illustration; empty keeps it decorative. |
| `primaryAction` | `MediaSplitBandAction` | `undefined` | false | First button under the copy; `{ label, href, trailing?, target? }`. When it is the only action, the whole band links to it. |
| `secondaryAction` | `MediaSplitBandAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. With two actions the band stays unlinked. |

## States

- Visual states: `default`
- `size` is forwarded to the media split and drives its type scale and copy alignment
- Empty: when `title` is empty the band renders nothing but its root; with no media set the media cell is omitted
- With exactly one action the band is a link to that action's `href`; with none or two it is not a link

## Accessibility

- Visible focus: owned by `button` and `media-split`.
- Keyboard map: `Tab` moves through the actions, and through the media link when the band links.
- ARIA: the media split's `<section>` is the band's named region (`aria-label` from `title`), so the root is a plain `div`; the headline is its `h2`; an image is named by `alt`, an illustration by `illustrationAriaLabel`, and both are decorative when empty.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `media-split` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the scenes stop under reduced motion on their own.
- Touch target ≥40×40 px — the medium buttons meet it.

## Examples

### Default

```vue
<script setup>
  import MediaSplitBand from '@aziontech/webkit/media-split-band'
</script>

<template>
  <MediaSplitBand
    eyebrow="Our values"
    title="Four values shape every role at Azion"
    description="Quality, Drive, Accountability, and Innovation. They guide how we work every day: we set high standards and measure what we deliver, take on hard problems with persistence, own our commitments and mistakes, and use AI and new technology to solve problems in new ways. Together, they help us earn and keep the trust of our customers."
    size="large"
    :scene="{ component: 'BrandGlobeScene' }"
  />
</template>
```
