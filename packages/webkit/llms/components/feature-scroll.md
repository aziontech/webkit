# Feature Scroll

> The walkthrough band of a product page: a large section title over one screen per feature. From the large breakpoint up the features scroll through a sticky stack — the copy advances while the illustration stays pinned in a framed, textured stage with one small action under each step; below it the same features are a three-column grid of media tiles. It is a page section — the site places it from a `{ _id: 'feature-scroll', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `card-grid`, `media-tile`, `illustration`, `sticky-stack`, `texture-material` and `button`.

- Import: `import FeatureScroll from '@aziontech/webkit/feature-scroll'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [feature-scroll.json](https://github.com/aziontech/webkit/blob/main/.specs/feature-scroll.json)

## When to use

- To walk through four to six capabilities of one product, each with a picture of its own.

## Do

- Four to six items; the stack needs enough steps to earn the scroll.
- Give every item an `illustration`; it is the pinned picture on large screens and the tile media on small ones.
- Keep `action` to a short label such as "Docs" — it sits under the step copy at the small size.

## Don’t

- For three reasons with no scroll story → use `feature-tiles`.
- For code-led steps → use `sticky-scroll-code`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [sticky-stack](sticky-stack.md) — the scroll engine the large layout runs on.
- [media-tile](media-tile.md) — the cell the small layout renders each feature with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the large section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `items` | `FeatureScrollItem[]` | `[]` | false | The features, in order; each is `{ title, description, illustration, action? }` where `illustration` is a registry name and `action` is `{ label, href, trailing? }` rendered as a small secondary button under the step. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.

## States

- Visual states: `default`
- Below the large breakpoint the features render as a three-column grid of media tiles; from it up they render as a sticky stack whose active step is `sticky-stack`'s own
- Empty: when `items` is empty the band renders nothing — not the header, not the frames

## Accessibility

- Visible focus: owned by the composed `button`.
- Keyboard map: `Tab` reaches each step's action; `Enter` follows it; the stack's own progression is scroll-driven and never traps focus.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the step headings are `sticky-stack`'s and `media-tile`'s; the texture layer and the pinned illustration are decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none motion-reduce:transform-none` — the step transition belongs to `sticky-stack`, which carries its own fallback; this band adds no motion.
- Touch target ≥40×40 px — the per-step action is a small `button` on the large layout only, where pointer precision is available.

## Examples

### Default

```vue
<script setup>
  import FeatureScroll from '@aziontech/webkit/feature-scroll'
</script>

<template>
  <FeatureScroll
    eyebrow="Workloads"
    title="Everything a workload does, one screen at a time"
    description="Scroll through the console a workload is run from: the list, the topology, the domains, the deploy and the rollout. Each screen is the one you get, not a picture of it."
    :items="[
      {
        title: 'Every workload on one list',
        description:
          'See each workload with its domain, status and last deployment, so what is live is never a question.',
        illustration: 'stay-in-control',
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Read the deployment topology',
        description:
          'The domains, the application and the firewall a workload serves, drawn as one chain.',
        illustration: 'global-network',
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Domains and TLS, handled',
        description:
          'Add a domain, get its certificate issued and renewed, and set the TLS floor without leaving the page.',
        illustration: 'dns-protection',
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Ship a version in seconds',
        description:
          'Build, upload, propagate and warm the cache, every step streamed as it happens until the version is live everywhere.',
        illustration: 'fastest-path-to-live-website',
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      },
      {
        title: 'Gradual rollouts and instant rollback',
        description:
          'Send a share of traffic to a new version, promote it to every data center once it holds, or roll back to the last one without a redeploy.',
        illustration: 'preview',
        action: {
          label: 'Docs',
          href: 'https://www.azion.com/en/documentation/products/workloads/',
          trailing: true
        }
      }
    ]"
  />
</template>
```
