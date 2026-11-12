# Feature Tabs

> The feature walkthrough band of a product page: a left-aligned section title over up to three tabs on one side and the active tab's illustration on the other, closed by a small link under the frame. It is a page section — the site places it from a `{ _id: 'feature-tabs', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `media-tabs`, `illustration` and `mini-button`. The tabs advance on a timer that pauses under the pointer or keyboard focus and never runs under reduced motion; that state is owned by `media-tabs`.

- Import: `import FeatureTabs from '@aziontech/webkit/feature-tabs'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [feature-tabs.json](https://github.com/aziontech/webkit/blob/main/.specs/feature-tabs.json)

## When to use

- To walk through the two or three features behind one claim, one picture at a time, like Functions' Observability.

## Do

- Keep to three tabs; tabs past the limit are not rendered.
- Give every tab an `illustrationLabel` saying what its picture shows.

## Don’t

- For architectures drawn as diagrams across the full width → use `architecture-tabs`.
- For a scroll-driven walkthrough of more features → use `feature-scroll`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-tabs](media-tabs.md) — the timed tabs this section renders through.
- [illustration](illustration.md) — the scene each tab shows.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the left section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `tabs` | `FeatureTabsTab[]` | `[]` | false | The features, in order, at most three; each is `{ title, description, illustration, illustrationLabel? }` where `illustration` is a registry name and `illustrationLabel` its accessible name. |
| `primaryAction` | `FeatureTabsAction` | `undefined` | false | Small link under the frame; `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.

## States

- Visual states: `default`; the active tab, its progress and the timer are owned by `media-tabs`
- Empty: when `tabs` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; the link renders only when `primaryAction` is set

## Accessibility

- Visible focus: owned by `media-tabs` (the tabs) and `mini-button`.
- Keyboard map: `Tab` reaches the tabs and the link; the tabs' keys are owned by `media-tabs`.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; each illustration is named by its tab's `illustrationLabel`, or decorative when empty.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `media-tabs` and `mini-button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the timer never runs under reduced motion (owned by `media-tabs`).
- Touch target ≥40×40 px: the tab rows; the link is supplementary to them.

## Examples

### Default

```vue
<script setup>
  import FeatureTabs from '@aziontech/webkit/feature-tabs'

  const tabs = [
    {
      title: 'Trace',
      description:
        'The run as a waterfall: each step placed against the invocation it belongs to, nested where it nested.',
      illustration: 'live-debugging',
      illustrationLabel: 'A trace waterfall of one invocation'
    },
    {
      title: 'Logs',
      description:
        'Structured output on the same clock as the trace, filtered by level, searchable in place.',
      illustration: 'traffic-and-cost-bar-chart',
      illustrationLabel: 'Structured logs filtered by level'
    },
    {
      title: 'Request path',
      description:
        'The workload, application, function and connector it travelled, each captioned with the time spent there.',
      illustration: 'distributed-apis',
      illustrationLabel: 'The path a request took through the platform'
    }
  ]

  const primaryAction = {
    label: 'Open an invocation',
    href: '/product-preview',
    trailing: true
  }
</script>

<template>
  <FeatureTabs
    eyebrow="Observability"
    title="Inspect every run end-to-end"
    description="Every invocation of a function is traced on the platform itself — spans, logs and the path the request took. Nothing to configure, no storage to attach. Pick a document to open it."
    :tabs="tabs"
    :primary-action="primaryAction"
  />
</template>
```
