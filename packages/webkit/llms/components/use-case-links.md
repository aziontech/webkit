# Use Case Links

> The use-case directory band of a solution page: a left-aligned section title over a divider grid of linked topics, one per use case, each an icon, a heading and a sentence that link to the page that explains it — or, when the items carry no `href`, a plain grid of the same topics with nothing to follow. It is a page section — the site places it from a `{ _id: 'use-case-links', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `section-title`, `frame-box`, `card-grid` and `topic` rather than owning anatomy of its own.

- Import: `import UseCaseLinks from '@aziontech/webkit/use-case-links'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [use-case-links.json](https://github.com/aziontech/webkit/blob/main/.specs/use-case-links.json)

## When to use

- When every use case has its own page and the band's job is to route the reader there.
- For three or six use cases of equal weight, in a three-column grid.
- For a link-less use-case grid under a left-aligned title (the KV Store page's "Use cases"): leave out every `href`.

## Do

- Keep the count a multiple of three so the divider grid closes cleanly.
- Link every item or none: an item without `href` renders as a plain topic (no link, no arrow), and a band that mixes both reads as broken.
- Keep `description` to one sentence; the row height follows the longest cell.

## Don’t

- When the use cases carry no link and the band leads with one call to action → use `use-cases`.
- For features with artwork → use `feature-tiles`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [use-cases](use-cases.md) — the sibling band with a title cell and one action instead of a link per case.
- [topic](topic.md) — the linked icon-heading-sentence cell each use case is rendered with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the left-aligned section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `items` | `UseCaseLinksItem[]` | `[]` | false | The use cases rendered as linked topics in a three-column divider grid, in order; each item is `{ icon, title, description, href? }`; an item without `href` renders as a plain, unlinked topic. |

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; `eyebrow` and `description` ride with it
- An item with an `href` is a link (the whole cell, with the topic's link cue); an item without one is a plain topic, so a band with no `href` at all has no links

## Accessibility

- Visible focus: owned by the composed `topic`, whose link carries the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: `Tab` moves between the use-case links; `Enter` follows one.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2` and each use case is a `topic` with an `h3`, so the outline reads band → use cases.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): typography and colours belong to `section-title` and `topic`.
- `motion-reduce:transition-none motion-reduce:transform-none` — `topic`'s hover carries its own fallback; this band adds no motion.
- Touch target ≥40×40 px — each topic link spans its whole cell.

## Examples

### Default

```vue
<script setup>
  import UseCaseLinks from '@aziontech/webkit/use-case-links'
</script>

<template>
  <UseCaseLinks
    eyebrow="Use Cases"
    title="What teams use Application Accelerator for"
    description="Cache what standard CDN caching cannot, with the methods, query strings and cookies you choose."
    :items="[
      {
        icon: 'pi pi-code',
        title: 'Accelerate REST and GraphQL APIs',
        description:
          'Cache API responses with query string and cookie-based segmentation for faster client applications.',
        href: 'https://www.azion.com/en/solutions/api-gateway/'
      },
      {
        icon: 'pi pi-shopping-cart',
        title: 'Optimize product catalogs',
        description:
          'Segment listings by category, region, and user preferences with cache key rules.',
        href: 'https://www.azion.com/en/solutions/application-acceleration/'
      },
      {
        icon: 'ai ai-layers',
        title: 'Personalize multi-tenant apps',
        description: 'Serve tenant-specific content with cookie-based cache variation rules.',
        href: 'https://www.azion.com/en/documentation/'
      },
      {
        icon: 'ai ai-live-ingest',
        title: 'Stream content faster',
        description:
          'Cache playlists and user preferences while serving browsing content efficiently.',
        href: 'https://www.azion.com/en/documentation/'
      },
      {
        icon: 'pi pi-bolt',
        title: 'Reduce API latency',
        description: 'Short TTLs for rapidly changing data endpoints and real-time applications.',
        href: 'https://www.azion.com/en/documentation/products/build/applications/application-accelerator/'
      },
      {
        icon: 'pi pi-user',
        title: 'Deliver personalized experiences',
        description:
          'Cache user-specific content with session-based cookie variation for tailored delivery.',
        href: 'https://www.azion.com/en/documentation/'
      }
    ]"
  />
</template>
```

### Without links

```vue
<script setup>
  import UseCaseLinks from '@aziontech/webkit/use-case-links'
</script>

<template>
  <UseCaseLinks
    eyebrow="Use Cases"
    title="What teams keep in KV Store"
    :items="[
      {
        icon: 'pi pi-lock',
        title: 'Session management and authentication',
        description:
          'Store user sessions, authentication tokens, and login states close to users for fast authentication.'
      },
      {
        icon: 'pi pi-sliders-h',
        title: 'Feature flags and configuration',
        description:
          'Synchronize feature flags and application configuration globally with low latency.'
      },
      {
        icon: 'pi pi-gauge',
        title: 'API rate limiting and quotas',
        description:
          'Implement sliding window rate limits, token quotas, and access rules with fast lookups.'
      },
      {
        icon: 'pi pi-chart-bar',
        title: 'Global counters and analytics',
        description:
          'Count pageviews, inventory levels, and API usage in real time with distributed counters.'
      },
      {
        icon: 'pi pi-ban',
        title: 'Bad actor tracking and security lists',
        description:
          'Store IP addresses and threat signatures to block attackers in real time.'
      },
      {
        icon: 'pi pi-shopping-cart',
        title: 'Carts and personalization',
        description: 'Keep carts and user preferences one fast read away from every visitor.'
      }
    ]"
  />
</template>
```
