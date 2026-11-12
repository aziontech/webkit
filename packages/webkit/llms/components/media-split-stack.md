# Media Split Stack

> A run of large media-split bands that pile up under the site header as the page scrolls, each a centered claim with an outlined "learn more" button beside its picture, the whole band linking through. An optional large centered section title opens the run. It is a page section — the site places it from a `{ _id: 'media-split-stack', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `band-stack`, `media-split`, `illustration` and `button`. `kind` picks the layout only: `media-end` sets every picture at the closing end, `alternating` starts it at the opening end and swaps sides band by band; the bands keep the same shape in both.

- Import: `import MediaSplitStack from '@aziontech/webkit/media-split-stack'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [media-split-stack.json](https://github.com/aziontech/webkit/blob/main/.specs/media-split-stack.json)

## When to use

- To list the solution areas or the claims of a page, one large band each, with a link through to its own page.

## Do

- Give a band either `image` (a URL, with `imageAlt` when it says something) or `illustration` (a registry name, with `illustrationLabel`), not both; a band with neither renders without its media cell.
- Give every band an `action`; it is both the button and the link the whole band follows.

## Don’t

- For a single claim beside its media → use `media-split` directly.
- For small reasons in a grid → use `feature-tiles`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [band-stack](band-stack.md) — the sticky run the bands pile up in.
- [media-split](media-split.md) — the band each entry renders through.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `MediaSplitStackKind` | `'media-end'` | false | Layout of the run: `media-end` sets every picture at the closing end, `alternating` starts it at the opening end and swaps sides band by band. |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the run, rendered by the large centered section title as its `h2`; the run renders no header when empty. |
| `bands` | `MediaSplitStackBand[]` | `[]` | false | The bands, in order; each is `{ title, description, image?, imageAlt?, illustration?, illustrationLabel?, action? }` where `image` is a picture URL, `illustration` a registry name, and `action` `{ label, href }` the outlined button and the link the whole band follows. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.

## States

- Visual states: `default`; hovering a linked band reveals its link affordance (owned by `media-split`)
- `data-kind` mirrors the `kind` prop
- Empty: when `bands` is empty the run renders nothing — not the header, not the stack
- The header renders only when `title` is set; a band renders its button and its link only when it has an `action`, and its media cell only when it has a picture

## Accessibility

- Visible focus: owned by `button` and `media-split`'s media link.
- Keyboard map: `Tab` reaches each band's media link and button; `Enter` follows them.
- ARIA: the run is a `<section>` named by its title (`aria-label`) when one is set; each band is `media-split`'s own section named by the band's title, with its headline as an `h2`; illustrations are named by `illustrationLabel` and images by `imageAlt`, or decorative when empty.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `media-split` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the run adds no motion.
- Touch target ≥40×40 px: the medium buttons and the band links.

## Examples

### Default

```vue
<script setup>
  import MediaSplitStack from '@aziontech/webkit/media-split-stack'
  import quickStartWithTemplates from '@aziontech/webkit/assets/quick-start-with-templates.svg'

  const bands = [
    {
      image: quickStartWithTemplates,
      title: 'Modern applications',
      description: 'Build static sites, run serverless applications, or modernize legacy systems.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/web-apps/'
      }
    },
    {
      illustration: 'improve-application-performance-and-reliability',
      title: 'Optimized workloads',
      description:
        'Speed up applications, deliver content through the CDN, and process images on demand.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/performance/'
      }
    },
    {
      illustration: 'ai-applications',
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
  <MediaSplitStack
    kind="media-end"
    :bands="bands"
  />
</template>
```

### Types

```vue
<script setup>
  import MediaSplitStack from '@aziontech/webkit/media-split-stack'
  import quickStartWithTemplates from '@aziontech/webkit/assets/quick-start-with-templates.svg'

  const solutionBands = [
    {
      image: quickStartWithTemplates,
      title: 'Modern applications',
      description: 'Build static sites, run serverless applications, or modernize legacy systems.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/web-apps/'
      }
    },
    {
      illustration: 'improve-application-performance-and-reliability',
      title: 'Optimized workloads',
      description:
        'Speed up applications, deliver content through the CDN, and process images on demand.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/performance/'
      }
    },
    {
      illustration: 'ai-applications',
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

  const networkBands = [
    {
      title: 'Run closer to users',
      description:
        'Handle requests close to users instead of sending everything back to a few central regions. That cuts latency, absorbs spikes automatically, and reduces backhaul.',
      illustration: 'fastest-path-to-live-website',
      illustrationLabel: 'Requests served from the data center nearest the user',
      action: {
        label: 'Learn more',
        href: '/en/products/application-accelerator/'
      }
    },
    {
      title: 'Keep delivery, logic, and data in one place',
      description:
        'Run delivery, execution, and data on one platform. APIs and dynamic applications get real-time request handling, origin protection, and state kept next to the code with KV Store.',
      illustration: 'runtime',
      illustrationLabel: 'Delivery, execution and data served from one platform',
      action: {
        label: 'Learn more',
        href: '/en/products/kv-store/'
      }
    },
    {
      title: 'Get better routes and more stable delivery',
      description:
        'Traffic enters inside ISP last-mile networks and connects through IXPs, peering, and Tier 1 transit. Fewer hops mean better routes and stable delivery during traffic spikes, upstream issues, and regional incidents.',
      illustration: 'distributed-apis',
      illustrationLabel: 'Entry points inside ISP networks, connected through IXPs and transit',
      action: {
        label: 'Learn more',
        href: '/en/products/load-balancer/'
      }
    },
    {
      title: 'Stop attack traffic earlier',
      description:
        'Block attack traffic in the delivery path, before it reaches your origin. Deploy code and policies and let the platform handle scaling, execution, and traffic steering. Your team manages fewer regions, less capacity, and fewer scaling rules.',
      illustration: 'automate-threat-mitigation',
      illustrationLabel: 'Attack traffic stopped in the delivery path, before the origin',
      action: {
        label: 'Learn more',
        href: '/en/products/ddos-protection/'
      }
    }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <MediaSplitStack
      kind="media-end"
      :bands="solutionBands"
    />
    <MediaSplitStack
      kind="alternating"
      eyebrow="Managed Infrastructure"
      title="Stop managing regions and capacity by hand"
      :bands="networkBands"
    />
  </div>
</template>
```
