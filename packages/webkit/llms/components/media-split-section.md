# Media Split Section

> One claim beside its picture, on its own frame: the copy cell with its overline, headline and sentence on one side, and the media on a raised, pixel-textured surface on the other. It is a page section — the site places it from a `{ _id: 'media-split-section', props }` entry and binds `props` straight onto it — and it composes `module`, a framed `media-split`, `button`, `illustration`, `console-mockup` and the webkit scene assets. The media is required and is a drawn asset: an illustration (a name of the illustration registry) or a registered scene, of which a product console widget (`widget`) is one; request-flow diagrams and code do not go in a media band; with one action the whole band links to it (unless `linked` is off), with two the band stays unlinked. The media sits beside the copy, or under it when `orientation` is `vertical`.

- Import: `import MediaSplitSection from '@aziontech/webkit/media-split-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [media-split-section.json](media-split-section.json)

## When to use

- Rendering page JSON, or you need a whole band with no custom content → the section (`media-split-section`). Building an SFC by hand, needing slots, or nesting inside another band → the primitive (`media-split`).
- Use MediaSplitSection for one marketing claim beside its picture or scene.
- To make one point beside one picture and move on (a values statement, a single product claim).

## Do

- Give the band exactly one media: `scene`, `widget` (a `ConsoleMockup` name) or `illustration` (a registry name); when several are set the first of that order wins. A band with a title and no media logs a development warning, and the site-composition check (`test/standards/site-composition.test.mjs`) fails it in the shipped page JSON. A `Diagram` scene counts as no media.
- Use `size="large"` for a band that carries only its headline and description.
- Use `orientation="vertical"` for a wide scene that needs the full width of the frame under the copy.
- Turn `linked` off when the media holds controls of its own, so a click in it is not taken as a click on the band.
- Set `anchor` when another part of the page links to the band.
- Name a registry scene in `illustration` for art; the band takes no picture URL.

## Don’t

- For several claims stacked one after the other → use `media-split-stack-section`.
- For a claim beside the code that delivers it → use `feature-scroll-section` (each item's `code`); a media band shows no code.
- For a request-flow diagram → use `console-showcase-section` with `variant: 'diagram'` (the diagram as its `scene`) or `architecture-tabs-section`; a media band shows no diagram.
- For a full-width terminal session with no copy column → use `cli-terminal-section`.
- For copy beside one piece of media in a hand-built SFC that needs the `media` slot → use `media-split`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-split](media-split.md) — the band primitive the section is rendered with.
- [media-split-stack-section](media-split-stack-section.md) — the stacked sibling for a run of claims.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the media split as its `h2` and naming its region; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Paragraph under the headline. |
| `size` | `MediaSplitSectionSize` | `'medium'` | false | Type scale of the copy; `large` sets the headline at heading-xl and centres the copy beside the media, `medium` aligns it to the top of the media. |
| `orientation` | `MediaSplitSectionOrientation` | `'horizontal'` | false | Axis the band splits on; `vertical` stacks the media under the copy for a wide scene. |
| `texture` | `TextureVariant` | `'pixelate'` | false | Texture painted under the media: `dots`, `grid`, `lines`, `dither`, `pixelate` or `none`. |
| `linked` | `boolean` | `true` | false | Links the whole band to a lone action; turn it off when the media holds controls of its own. |
| `scene` | `MediaSplitSectionScene` | `undefined` | false | Scene drawn in the media cell, `{ component, props? }` naming a webkit scene asset other than `Diagram` and the props bound onto it; wins over every other media. |
| `widget` | `ConsoleMockupName` | `undefined` | false | Name of the product console widget drawn in the media cell when no scene is set. |
| `illustration` | `string` | `''` | false | Registry name of the illustration drawn in the media cell when neither a scene nor a widget is set. |
| `illustrationAriaLabel` | `string` | `''` | false | Accessible name of the illustration; empty keeps it decorative. |
| `primaryAction` | `MediaSplitSectionAction` | `undefined` | false | First button under the copy; `{ label, href, trailing?, icon?, target?, variant? }`. When it is the only action it renders outlined with a trailing chevron, and the whole band links to it; `variant` overrides the drawn variant. |
| `secondaryAction` | `MediaSplitSectionAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, icon?, target?, variant? }`. With two actions the band stays unlinked. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Diagrams: every valid name is in [diagrams.md](../foundations/diagrams.md) (MCP `list_assets({ kind: "diagrams" })`). An unknown name draws nothing.

## States

- Visual states: `default`
- `size` is forwarded to the media split and drives its type scale and copy alignment
- Empty: when `title` is empty the band renders nothing but its root; with no media set (or only a `Diagram` scene) the media cell is omitted and one development warning names the band
- With exactly one action the band is a link to that action's `href` (unless `linked` is `false`), and that lone action renders as an outlined button closed by the trailing chevron; with two the first is secondary, the second outlined, and the band is not a link
- `size="medium"` aligns the copy to the top of the media, `size="large"` centres it
- `orientation` and `texture` are forwarded to the media split
- Media precedence: `scene`, `widget`, `illustration`. A widget is inset from the cell's edges (`media-split`'s `mediaPadded`); a scene and an illustration run flush
- A widget plays its beat while the pointer is over the band, and shows its finished state on touch and under reduced motion (owned by `console-mockup`); it draws no collaborator cursor (`cursor` off), so the band reads as the product screen
- Scenes and the widget load on demand (`defineAsyncComponent`)
- An action's `variant` (`secondary`, `outline`, `ghost`) wins over the drawn default; an action's `icon` is drawn before the label when it has no trailing chevron

## Accessibility

- Visible focus: owned by `button` and `media-split`.
- Keyboard map: `Tab` moves through the actions, and through the media link when the band links.
- ARIA: the media split's `<section>` is the band's named region (`aria-label` from `title`), so the root is a plain `div`; the headline is its `h2`; an illustration is named by `illustrationAriaLabel`, and is decorative when empty; a widget is an inert, `aria-hidden` picture of the console, so the copy carries its meaning.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `media-split` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the scenes stop under reduced motion on their own.
- Touch target ≥40×40 px — the actions are `large` (40 px) buttons.

## Right-to-left

- Layout: logical utilities only (owned by `media-split`).
- Icons: a trailing chevron on an action mirrors (owned by `button`).
- Keyboard: unchanged.
- User data: none.

## Internationalization

- No built-in strings: every visible string arrives through props in the page's language. Widget text is product UI copy owned by `console-mockup`.
- Formatting: none.

## Responsive

- Container queries: none; `media-split` stacks the media under the copy below `lg`.
- Narrow (≤ 640 px): one column; a widget and an illustration scale down with the cell.
- Touch: a widget shows its finished state instead of the hover beat.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import MediaSplitSection from '@aziontech/webkit/media-split-section'

  const DESCRIPTION =
    'Quality, Drive, Accountability, and Innovation. They guide how we work every ' +
    'day: we set high standards and measure what we deliver, take on hard problems with persistence, own our commitments and mistakes, and use AI and new technology to solve problems in ' +
    'new ways. Together, they help us earn and keep the trust of our customers.'
</script>

<template>
  <MediaSplitSection
    eyebrow="Our values"
    title="Four values shape every role at Azion"
    :description="DESCRIPTION"
    size="large"
    :scene="{ component: 'BrandGlobeScene' }"
  />
</template>
```

### Product media

```vue
<script setup>
  import MediaSplitSection from '@aziontech/webkit/media-split-section'
</script>

<template>
  <MediaSplitSection
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
  <MediaSplitSection
    eyebrow="Real-Time Metrics"
    title="Read every status code as it lands"
    description="Chart status codes per application and spot a failing deploy seconds after it ships."
    illustration="real-time-metrics-status-codes"
    illustration-aria-label="A chart of response status codes over time"
  />
</template>
```

### Vertical

```vue
<script setup>
  import MediaSplitSection from '@aziontech/webkit/media-split-section'
</script>

<template>
  <MediaSplitSection
    anchor="topology"
    eyebrow="Workloads"
    title="Read the whole request path on one screen"
    description="The domains, the application and the firewall a workload serves, drawn as one chain you can follow from left to right."
    orientation="vertical"
    texture="dots"
    :linked="false"
    :scene="{ component: 'ConsoleMockup', props: { name: 'workload-topology' } }"
    :primary-action="{ label: 'Docs', href: '/docs/workloads' }"
  />
</template>
```
