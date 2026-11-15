# Architecture Tabs

> The architecture band of a product page: a horizontal section title with one large button, over a row of up to five tabs whose active tab draws its named diagram the full width of the frame. It is a page section — the site places it from a `{ _id: 'architecture-tabs', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `frame-box`, `media-tabs` and `diagram`. The tabs advance on a timer that pauses under the pointer or keyboard focus and never runs under reduced motion; that state is owned by `media-tabs`.

- Import: `import ArchitectureTabs from '@aziontech/webkit/architecture-tabs'`
- Category: sections · Surface: site · Structure: monolithic
- API as JSON: [architecture-tabs.json](https://github.com/aziontech/webkit/blob/main/.specs/architecture-tabs.json)

## When to use

- Use ArchitectureTabs only when every tab shows a full-width official diagram (up to five tabs).
- To plot several architectures of one product, or one request across the platform, one diagram at a time.

## Do

- Keep to five tabs with `tabsSide` `top` or `bottom`, three with `start` or `end`; tabs past the limit are not rendered.
- Give every tab a `diagram` from the diagram library and a stable `value`.

## Don’t

- For features shown by an illustration each → use `feature-tabs`.
- For a scroll-driven walkthrough → use `feature-scroll`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-tabs](media-tabs.md) — the timed tab row this section renders through.
- [diagram](diagram.md) — the named architecture diagram each tab draws.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence beside the headline. |
| `tabsSide` | `ArchitectureTabsSide` | `'top'` | false | Side of the diagram the tabs sit on: `top`, `bottom`, `start` or `end`; start and end hold up to three tabs. |
| `tabs` | `ArchitectureTabsTab[]` | `[]` | false | The architectures, in order; each is `{ value, title, description, diagram, diagramAriaLabel? }` where `diagram` is the name of the diagram drawn while the tab is active and `diagramAriaLabel` replaces the description that diagram ships. |
| `autoplay` | `boolean` | `true` | false | Opens the next tab on a timer, with the composed tabs' visible pause control. |
| `autoplayInterval` | `number` | `6000` | false | Milliseconds each tab holds before the next one opens. |
| `primaryAction` | `SectionTitleAction` | `undefined` | false | Large button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent. |

## Assets

- Diagrams: every valid name is in [diagrams.md](../foundations/diagrams.md) (MCP `list_assets({ kind: "diagrams" })`). An unknown name draws nothing.

## States

- Visual states: `default`; the active tab, its progress and the timer are owned by `media-tabs`
- Empty: when `tabs` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set
- The timer holds each tab for `autoplayInterval` milliseconds (owned by `media-tabs`)

## Accessibility

- Visible focus: owned by `media-tabs` (the tabs) and `button`.
- Keyboard map: `Tab` reaches the button and the tab row; the tab row's keys are owned by `media-tabs`.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; each diagram carries the description its spec ships, or the tab's `diagramAriaLabel` when one is set.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `media-tabs` and `diagram`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the timer never runs under reduced motion (owned by `media-tabs`).
- Touch target ≥40×40 px: the large button and the tab rows.

## Examples

### Default

```vue
<script setup>
  import ArchitectureTabs from '@aziontech/webkit/architecture-tabs'

  const tabs = [
    {
      value: 'request-path',
      title: 'Request path',
      description:
        'A call crosses Firewall, the application and the function before it reaches a model.',
      diagram: 'ai-gateway'
    },
    {
      value: 'failover',
      title: 'Provider failover',
      description: 'When a provider degrades, the gateway moves to the next model on the alias.',
      diagram: 'ai-gateway-provider-failover',
      diagramAriaLabel:
        'A request falls back from a degraded model provider to the next model on the alias'
    },
    {
      value: 'costs',
      title: 'Cost routing',
      description: 'Premium tokens go only where they pay off; everyone else gets a lighter model.',
      diagram: 'ai-gateway-model-routing'
    },
    {
      value: 'latency',
      title: 'Latency routing',
      description: 'Real-time tasks run on AI Inference, close to the user, in under 30 ms.',
      diagram: 'ai-gateway-latency-routing'
    },
    {
      value: 'cache',
      title: 'Response cache',
      description:
        'A repeated prompt is answered from cache, with no model call and no tokens spent.',
      diagram: 'ai-gateway-response-cache'
    }
  ]

  const primaryAction = {
    label: 'Docs',
    href: '/product-preview',
    trailing: true
  }
</script>

<template>
  <ArchitectureTabs
    eyebrow="Routing"
    title="Every AI request through one control point"
    description="Every client calls one endpoint. Firewall stops abuse, then a function checks the key, routes the call, and logs it."
    tabs-side="bottom"
    :autoplay-interval="8000"
    :tabs="tabs"
    :primary-action="primaryAction"
  />
</template>
```
