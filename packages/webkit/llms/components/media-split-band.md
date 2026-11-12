# Media Split Band

> One claim beside its picture, on its own frame: the copy cell with its overline, headline and sentence on one side, and the media on a raised, pixel-textured surface on the other. It is a page section — the site places it from a `{ _id: 'media-split-band', props }` entry and binds `props` straight onto it — and it composes `section-module`, a framed `media-split`, `button`, `illustration`, `product-widget`, `diagram` and the webkit scene assets. The media is a scene, a product console widget, a request-flow diagram, an image (cover or framed) or an illustration; with one action the whole band links to it, with two the band stays unlinked.

- Import: `import MediaSplitBand from '@aziontech/webkit/media-split-band'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [media-split-band.json](https://github.com/aziontech/webkit/blob/main/.specs/media-split-band.json)

## When to use

- To make one point beside one picture and move on (a values statement, a single product claim).

## Do

- Give the band exactly one media: `scene`, `widget` (a `ProductWidget` name), `diagram` (a `Diagram` name), `image` or `illustration`; when several are set the first of that order wins.
- On a product page prefer `widget` or `diagram`: they show the product itself. Do not drop to `media-split` and its `media` slot to place one.
- Set `image.framed` for a picture that is an object rather than a scene (a badge, a logo, a screenshot): it sits whole on a rounded, bordered plate inset in the cell instead of covering it.
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
| `scene` | `MediaSplitBandScene` | `undefined` | false | Scene drawn in the media cell, `{ component }` naming a webkit scene asset; wins over every other media. |
| `widget` | `ProductWidgetName` | `undefined` | false | Name of the product console widget drawn in the media cell when no scene is set. |
| `diagram` | `DiagramName` | `undefined` | false | Name of the request-flow diagram drawn in the media cell when neither a scene nor a widget is set. |
| `image` | `MediaSplitBandImage` | `undefined` | false | Picture drawn in the media cell when no scene, widget or diagram is set; `{ src, alt?, width?, height?, framed? }`, where `framed` sets it whole on a rounded plate instead of covering the cell. |
| `illustration` | `string` | `''` | false | Registry name of the illustration drawn in the media cell when no other media is set. |
| `illustrationAriaLabel` | `string` | `''` | false | Accessible name of the illustration; empty keeps it decorative. |
| `primaryAction` | `MediaSplitBandAction` | `undefined` | false | First button under the copy; `{ label, href, trailing?, target? }`. When it is the only action, the whole band links to it. |
| `secondaryAction` | `MediaSplitBandAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. With two actions the band stays unlinked. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Diagrams: every valid name is in [diagrams.md](../foundations/diagrams.md) (MCP `list_assets({ kind: "diagrams" })`). An unknown name draws nothing.

## States

- Visual states: `default`
- `size` is forwarded to the media split and drives its type scale and copy alignment
- Empty: when `title` is empty the band renders nothing but its root; with no media set the media cell is omitted
- With exactly one action the band is a link to that action's `href`; with none or two it is not a link
- Media precedence: `scene`, `widget`, `diagram`, `image`, `illustration`. A widget, a diagram and a framed image are inset from the cell's edges (`media-split`'s `mediaPadded`); a scene, a plain image (which covers the cell) and an illustration run flush
- A widget plays its beat while the pointer is over the band, and shows its finished state on touch and under reduced motion (owned by `product-widget`); it draws no collaborator cursor (`cursor` off), so the band reads as the product screen
- Scenes, widget and diagram load on demand (`defineAsyncComponent`)

## Accessibility

- Visible focus: owned by `button` and `media-split`.
- Keyboard map: `Tab` moves through the actions, and through the media link when the band links.
- ARIA: the media split's `<section>` is the band's named region (`aria-label` from `title`), so the root is a plain `div`; the headline is its `h2`; an image is named by `alt`, an illustration by `illustrationAriaLabel`, and both are decorative when empty; a diagram is a `figure` named by the description its library entry carries; a widget is an inert, `aria-hidden` picture of the console, so the copy carries its meaning.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `media-split` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the scenes stop under reduced motion on their own.
- Touch target ≥40×40 px — the medium buttons meet it.

## Right-to-left

- Layout: logical utilities only (owned by `media-split`).
- Icons: a trailing chevron on an action mirrors (owned by `button`).
- Keyboard: unchanged.
- User data: none.

## Internationalization

- No built-in strings: every visible string arrives through props in the page's language. Widget and diagram text is product UI copy owned by `product-widget` and `diagram`.
- Formatting: none.

## Responsive

- Container queries: none; `media-split` stacks the media under the copy below `lg`.
- Narrow (≤ 640 px): one column; a widget, a diagram and a framed image scale down with the cell.
- Touch: a widget shows its finished state instead of the hover beat.
- Reflow: no horizontal scroll at 320 px.

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

### Product media

```vue
<script setup>
  import MediaSplitBand from '@aziontech/webkit/media-split-band'
</script>

<template>
  <MediaSplitBand
    eyebrow="Real-Time Events"
    title="Filter every request as it happens"
    description="Narrow the event stream by status, path or country, and read the matching requests seconds after they arrive."
    widget="real-time-events-filter"
    :primary-action="{
      label: 'Learn more',
      href: '/en/products/real-time-events/',
      trailing: true
    }"
  />
  <MediaSplitBand
    eyebrow="Cache"
    title="Serve repeat requests from the nearest location"
    description="Cached responses never travel back to your origin, so it handles a fraction of the traffic."
    diagram="cache"
  />
</template>
```
