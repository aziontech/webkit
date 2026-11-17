# Media Split Stack Section

> A run of large media-split bands that pile up under the site header as the page scrolls, each a centered claim with an outlined "learn more" button beside its picture, the whole band linking through. An optional centered section title at the medium size opens the run, as the run headers of the live product pages do. It is a page section — the site places it from a `{ _id: 'media-split-stack-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `section-stack`, `media-split`, `illustration`, `console-mockup` and `button`. Every band has a picture, and it is a drawn asset: a registered `scene`, a `ConsoleMockup` console mock (`widget`, itself a registered scene), or a registry `illustration`. The band type is a union that requires one of them; request-flow diagrams and code do not go in a media band. Every band sets its picture at the closing end, so the run reads down one edge.

- Import: `import MediaSplitStackSection from '@aziontech/webkit/media-split-stack-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [media-split-stack-section.json](media-split-stack-section.json)

## When to use

- Use MediaSplitStackSection for a run of linked claims that pile up as the reader scrolls.
- To list the solution areas or the claims of a page, one large band each, with a link through to its own page.

## Do

- Give every band one picture: `scene`, `widget` (a `ConsoleMockup` name — the product's console screen), or `illustration` (a name of the illustration registry, with `illustrationLabel`); a band takes no picture URL. The type requires one; when several are set the first in that order wins. Page JSON is untyped, so a band with none renders without its media cell, logs a development warning, and fails the site-composition check (`test/standards/site-composition.test.mjs`). A `Diagram` scene counts as none.
- Give every band an `action`; it is both the button and the link the whole band follows.

## Don’t

- For a single claim beside its picture or scene → use `media-split-section`.
- For a request-flow diagram → use `console-showcase-section` with `variant: 'diagram'`; for code → use `feature-scroll-section`.
- For small reasons in a grid → use `feature-tiles-section`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [section-stack](section-stack.md) — the sticky run the bands pile up in.
- [media-split](media-split.md) — the band each entry renders through.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the run so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Eyebrow above the section title. |
| `title` | `string` | `''` | false | Headline of the run, rendered by the medium centered section title as its `h2`; the run renders no header when empty, and with a header each band's headline drops to an `h3`. |
| `description` | `string` | `''` | false | Supporting sentence under the section title. |
| `bands` | `MediaSplitStackSectionBand[]` | `[]` | false | The bands, in order; each is `{ title, description, eyebrow?, href?, action? }` plus its required picture, one of `scene`, `widget` or `illustration` (with `illustrationLabel?`), where `eyebrow` is the band's overline, `href` the link the whole band follows (falling back to the action's), `scene` a webkit scene asset other than `Diagram`, `widget` a `ConsoleMockup` name, `illustration` a name of the illustration registry, and `action` `{ label, href }` the outlined button. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Diagrams: every valid name is in [diagrams.md](../foundations/diagrams.md) (MCP `list_assets({ kind: "diagrams" })`). An unknown name draws nothing.

## States

- Visual states: `default`; hovering a linked band reveals its link affordance (owned by `media-split`)
- Empty: when `bands` is empty the run renders nothing — not the header, not the stack
- The header renders only when `title` is set; a band renders its button only when it has an `action`, links as a whole to its `href` (or its action's when it has none), and renders its media cell only when it has a picture; a band's `eyebrow` sits above its headline
- Band headlines are `h2` when the run has no header and `h3` under the section title, so the outline never repeats a level
- Media precedence per band: `scene`, then `widget`, then `illustration`. A widget is inset from the cell's edges (`media-split`'s `mediaPadded`); a scene and an illustration run flush
- A widget plays its beat while the pointer is over its band (`hover`), and shows its finished state on touch and under reduced motion (owned by `console-mockup`); it draws no collaborator cursor (`cursor` off), so the band reads as the product screen
- The widget loads on demand (`defineAsyncComponent`): a run that uses none never downloads it

## Accessibility

- Visible focus: owned by `button` and `media-split`'s media link.
- Keyboard map: `Tab` reaches each band's media link and button; `Enter` follows them.
- ARIA: the run is a `<section>` named by its title (`aria-label`) when one is set; each band is `media-split`'s own section named by the band's title, with its headline as an `h3` under the run's `h2` (an `h2` when the run has no title); illustrations are named by `illustrationLabel`, or decorative when empty; a widget is an inert, `aria-hidden` picture of the console, so the band's copy carries its meaning.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `media-split` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the run adds no motion.
- Touch target ≥40×40 px: the medium buttons and the band links.

## Right-to-left

- Layout: logical utilities only; the closing end follows the reading direction (owned by `media-split`).
- Icons: the button's trailing chevron mirrors (owned by `button`).
- Keyboard: unchanged.
- User data: none.

## Internationalization

- No built-in strings: every visible string arrives through props in the page's language. Widget text is product UI copy owned by `console-mockup`.
- Formatting: none.

## Responsive

- Container queries: none; `media-split` stacks the media under the copy below `lg`.
- Narrow (≤ 640 px): one column per band; a widget and an illustration scale down with the cell.
- Touch: a widget shows its finished state instead of the hover beat; the whole band stays one link.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import MediaSplitStackSection from '@aziontech/webkit/media-split-stack-section'

  const bands = [
    {
      illustration: 'quick-start-with-templates',
      eyebrow: 'Web applications',
      title: 'Modern applications',
      description: 'Build static sites, run serverless applications, or modernize legacy systems.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/web-apps/'
      }
    },
    {
      illustration: 'improve-application-performance-and-reliability',
      eyebrow: 'Performance',
      href: '/en/solutions/performance/overview/',
      title: 'Optimized workloads',
      description:
        'Speed up applications, deliver content through the CDN, and process images on demand.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/performance/'
      }
    },
    {
      scene: { component: 'ConsoleMockup', props: { name: 'ai-inference-model' } },
      illustration: 'ai-applications',
      eyebrow: 'AI Inference',
      title: 'AI applications',
      description:
        'Build and deploy AI agents and AI-powered applications on a distributed platform, with inference close to users.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/ai/'
      }
    },
    {
      illustration: 'automate-threat-mitigation',
      title: 'Protected applications and APIs',
      description:
        'Protect web applications and APIs (WAAP), manage bots, and enforce programmable security policies at scale.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/security/'
      }
    },
    {
      illustration: 'content-and-media-delivery',
      title: 'Media and streaming content',
      description:
        'Stream video and deliver large files at low latency to audiences of any size, with media processed close to viewers.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/streaming/'
      }
    }
  ]
</script>

<template>
  <MediaSplitStackSection
    eyebrow="Solutions"
    title="One platform for every workload you run"
    description="Pick the outcome you need; the same distributed platform serves it."
    :bands="bands"
  />
</template>
```

### Product media

```vue
<script setup>
  import MediaSplitStackSection from '@aziontech/webkit/media-split-stack-section'

  const bands = [
    {
      widget: 'data-stream-source',
      title: 'Unified data collection',
      description:
        'Collect event data from Applications, Functions, WAF Events, and Activity History from one configuration.',
      action: { label: 'Learn more', href: '/en/products/data-stream/' }
    },
    {
      illustration: 'real-time-metrics-error-rate',
      illustrationLabel: 'A chart of the error rate over time',
      title: 'Error rates as they happen',
      description:
        'Chart the error rate of every application and catch a failing deploy seconds after it ships.',
      action: { label: 'Learn more', href: '/en/products/real-time-metrics/' }
    }
  ]
</script>

<template>
  <MediaSplitStackSection :bands="bands" />
</template>
```
