# Media Split Section

> One claim beside its picture, on its own frame: the copy cell with its overline, headline and sentence on one side, and the media on a raised, pixel-textured surface on the other. It is a page section — the site places it from a `{ _id: 'media-split-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, a framed `media-split`, `button`, `code-block`, `illustration`, `console-mockup`, `diagram` and the webkit scene assets. The media is a scene, a code sample (one file or a tab strip of files), a product console widget, a request-flow diagram, an image (cover or framed) or an illustration; with one action the whole band links to it (unless `linked` is off), with two the band stays unlinked. The media sits beside the copy, or under it when `orientation` is `vertical`.

- Import: `import MediaSplitSection from '@aziontech/webkit/media-split-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [media-split-section.json](https://github.com/aziontech/webkit/blob/main/.specs/media-split-section.json)

## When to use

- Rendering page JSON, or you need a whole band with no custom content → the section (`media-split-section`). Building an SFC by hand, needing slots, or nesting inside another band → the primitive (`media-split`).
- Use MediaSplitSection for one marketing claim beside its picture, scene or code.
- To make one point beside one picture and move on (a values statement, a single product claim).
- To set a claim beside the code that delivers it (`codeTabs`), with the files in a tab strip.

## Do

- Give the band exactly one media: `scene`, `codeTabs`, `widget` (a `ConsoleMockup` name), `diagram` (a `Diagram` name), `image` or `illustration`; when several are set the first of that order wins.
- A code sample holds controls of its own (tabs, copy), so the band never links to its lone action while it shows code; give it a `variant: 'ghost'` action for a quiet "Learn more".
- On a product page prefer `widget` or `diagram`: they show the product itself. Do not drop to `media-split` and its `media` slot to place one.
- Set `image.framed` for a picture that is an object rather than a scene (a badge, a logo, a screenshot): it sits whole on a rounded, bordered plate inset in the cell instead of covering it.
- Use `size="large"` for a band that carries only its headline and description.
- Use `orientation="vertical"` for a wide scene that needs the full width of the frame under the copy.
- Turn `linked` off when the media holds controls of its own, so a click in it is not taken as a click on the band.
- Set `anchor` when another part of the page links to the band.
- Give an `image` its `width` and `height` so the page reserves its box before it loads.

## Don’t

- For several claims stacked one after the other → use `media-split-stack-section`.
- For a full-width terminal session with no copy column → use `cli-terminal`.
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
| `scene` | `MediaSplitSectionScene` | `undefined` | false | Scene drawn in the media cell, `{ component, props? }` naming a webkit scene asset and the props bound onto it; wins over every other media. |
| `codeTabs` | `MediaSplitSectionCodeTab[]` | `[]` | false | Files of the code sample drawn in the media cell when no scene is set, in order; each is `{ label, value, code, language?, fileName?, fileIcon?, icon? }` where `icon` is a mark beside the tab label. A tab without `code` is skipped. |
| `defaultFile` | `string` | `''` | false | value` of the code tab open first; empty, or a value no tab carries, opens the first tab. |
| `copyAriaLabel` | `string` | `''` | false | Accessible name of the code sample's copy button; empty keeps the code block's own. |
| `widget` | `ConsoleMockupName` | `undefined` | false | Name of the product console widget drawn in the media cell when neither a scene nor code is set. |
| `diagram` | `DiagramName` | `undefined` | false | Name of the request-flow diagram drawn in the media cell when neither a scene nor a widget is set. |
| `image` | `MediaSplitSectionImage` | `undefined` | false | Picture drawn in the media cell when no scene, widget or diagram is set; `{ src, alt?, width?, height?, framed? }`, where `framed` sets it whole on a rounded plate instead of covering the cell. |
| `illustration` | `string` | `''` | false | Registry name of the illustration drawn in the media cell when no other media is set. |
| `illustrationAriaLabel` | `string` | `''` | false | Accessible name of the illustration; empty keeps it decorative. |
| `primaryAction` | `MediaSplitSectionAction` | `undefined` | false | First button under the copy; `{ label, href, trailing?, icon?, target?, variant? }`. When it is the only action it renders outlined with a trailing chevron, and the whole band links to it (not over code); `variant` overrides the drawn variant. |
| `secondaryAction` | `MediaSplitSectionAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, icon?, target?, variant? }`. With two actions the band stays unlinked. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Diagrams: every valid name is in [diagrams.md](../foundations/diagrams.md) (MCP `list_assets({ kind: "diagrams" })`). An unknown name draws nothing.

## States

- Visual states: `default`
- `size` is forwarded to the media split and drives its type scale and copy alignment
- Empty: when `title` is empty the band renders nothing but its root; with no media set the media cell is omitted
- With exactly one action the band is a link to that action's `href` (unless `linked` is `false`), and that lone action renders as an outlined button closed by the trailing chevron; with two the first is secondary, the second outlined, and the band is not a link
- `size="medium"` aligns the copy to the top of the media, `size="large"` centres it
- `orientation` and `texture` are forwarded to the media split
- Media precedence: `scene`, `codeTabs`, `widget`, `diagram`, `image`, `illustration`. Code, a widget, a diagram and a framed image are inset from the cell's edges (`media-split`'s `mediaPadded`); a scene, a plain image (which covers the cell) and an illustration run flush
- A widget plays its beat while the pointer is over the band, and shows its finished state on touch and under reduced motion (owned by `console-mockup`); it draws no collaborator cursor (`cursor` off), so the band reads as the product screen
- Scenes, code block, widget and diagram load on demand (`defineAsyncComponent`)
- Code: the sample opens on `defaultFile` (or the first tab), numbers its lines and types them in once; the band does not link to a lone action while it shows code
- An action's `variant` (`secondary`, `outline`, `ghost`) wins over the drawn default; an action's `icon` is drawn before the label when it has no trailing chevron

## Accessibility

- Visible focus: owned by `button` and `media-split`.
- Keyboard map: `Tab` moves through the actions, and through the media link when the band links; over code it moves through the code block's tabs and copy button (owned by `code-block`).
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

- No built-in strings: every visible string arrives through props in the page's language. Widget and diagram text is product UI copy owned by `console-mockup` and `diagram`.
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
  import MediaSplitSection from '@aziontech/webkit/media-split-section'
</script>

<template>
  <MediaSplitSection
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
    eyebrow="Cache"
    title="Serve repeat requests from the nearest location"
    description="Cached responses never travel back to your origin, so it handles a fraction of the traffic."
    diagram="cache"
  />
</template>
```

### Code

```vue
<script setup>
  import MediaSplitSection from '@aziontech/webkit/media-split-section'

  const codeTabs = [
    {
      label: 'cache-settings.json',
      value: 'cache-settings',
      language: 'json',
      code: '{\n  "cache_settings": {\n    "name": "api-cache",\n    "browser_cache_settings": {\n      "ttl": 60\n    },\n    "cdn_cache_settings": {\n      "ttl": 30\n    },\n    "cache_key": {\n      "query_string": "whitelist",\n      "query_string_fields": ["user_id", "category"],\n      "cookie": "whitelist",\n      "cookie_names": ["session_id", "region"]\n    },\n    "methods": ["GET", "POST", "OPTIONS"],\n    "stale_cache": true\n  }\n}',
      fileName: 'cache-settings.json',
      fileIcon: 'ai ai-json'
    }
  ]

  const primaryAction = {
    label: 'Learn more',
    href: 'https://www.azion.com/en/documentation/products/build/applications/application-accelerator/',
    trailing: true,
    variant: 'ghost'
  }
</script>

<template>
  <MediaSplitSection
    title="From basic caching to advanced acceleration"
    description="Application Accelerator extends Cache with protocol optimizations and advanced cache rules for dynamic content."
    :code-tabs="codeTabs"
    copy-aria-label="Copy the cache settings sample"
    :primary-action="primaryAction"
  />
</template>
```
