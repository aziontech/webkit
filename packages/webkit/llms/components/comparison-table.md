# Comparison Table

> The capability-by-capability comparison of Azion with one competitor on a migration landing page: a left section title over a framed table whose header row (the capability column, the Azion brand and the competitor logo) stays pinned while the page scrolls. Each category opens with a heading row; each cell is a support glyph — full, partial or none — named by a tooltip and by screen-reader text, and a capability with a definition carries an info button that opens it in a popover. It is a page section — the site places it from a `{ _id: 'comparison-table', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `brand`, `popover`, `icon-button` and `tooltip`.

- Import: `import ComparisonTable from '@aziontech/webkit/comparison-table'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [comparison-table.json](https://github.com/aziontech/webkit/blob/main/.specs/comparison-table.json)

## When to use

- On a "Azion vs X" page, to lay one competitor against Azion across a few categories of capabilities.

## Do

- Give every row a `definition`; the info popover is where a reader learns what the capability means.
- Ship both `competitor.logo` (dark theme) and `competitor.logoLight` (light theme); with one file it shows in both, with none the name shows as text.
- Keep `caption` equal to the title; it is the table's accessible name.

## Don’t

- To compare Azion's own plans → use `compare-plans`.
- To compare support tiers → use `compare-support-tiers`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [compare-plans](compare-plans.md) — the plan-by-plan matrix of Pricing.
- [tooltip](tooltip.md) — names each support glyph on hover and focus.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the section title as its `h2` and naming the band; no header renders when empty. |
| `caption` | `string` | `''` | false | Screen-reader caption naming the table. |
| `columnLabel` | `string` | `''` | false | Heading of the capability column. |
| `fullLabel` | `string` | `''` | false | Tooltip and screen-reader text of a full-support cell. |
| `partialLabel` | `string` | `''` | false | Tooltip and screen-reader text of a partial-support cell. |
| `noneLabel` | `string` | `''` | false | Tooltip and screen-reader text of an unsupported cell. |
| `competitor` | `ComparisonTableCompetitor` | `—` | true | The platform compared with Azion; `{ name, logo?, logoLight? }` where `logo` is the dark-theme file and `logoLight` the light-theme one. |
| `groups` | `ComparisonTableGroup[]` | `[]` | false | The categories, in order; each is `{ title, rows }` and a row is `{ capability, definition?, azion?, competitor? }` with each level `full`, `partial` or `none` (missing reads as `none`). |

## States

- Visual states: `default`
- A support cell is one of `full`, `partial` or `none`, mirrored on the glyph's `data-support`
- Without a competitor logo the header shows the competitor name as text
- Empty: when `groups` is empty the band renders nothing but its root — no header, no table

## Accessibility

- Visible focus: owned by the composed `icon-button` and `tooltip` triggers.
- Keyboard map: `Tab` reaches each definition's info button; `Enter` / `Space` opens its popover and `Esc` closes it (owned by `popover`).
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the table carries a `caption`, `scope="col"` heads, a `scope="colgroup"` head per category and a `scope="row"` head per capability, so each value is announced with its row and column. The glyphs are `aria-hidden` and every cell carries its level as `sr-only` text; each logo has the platform name as `alt`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text and glyph colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the popover and tooltip carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the info button is a small `icon-button`, a secondary affordance next to the capability name.

## Examples

### Default

```vue
<script setup>
  import ComparisonTable from '@aziontech/webkit/comparison-table'
  import cloudflareExtendedColor from '@aziontech/webkit/assets/cloudflare-extended-color.svg'
  import cloudflareExtendedReversed from '@aziontech/webkit/assets/cloudflare-extended-reversed.svg'

  const competitor = {
    name: 'Cloudflare',
    logo: cloudflareExtendedReversed,
    logoLight: cloudflareExtendedColor
  }

  const groups = [
    {
      title: 'Architecture and resilience',
      rows: [
        {
          capability: 'Unified platform',
          definition:
            'Delivery, compute, storage, and security run on one platform with one configuration model.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Global network',
          definition: 'How many locations serve traffic close to end users.',
          azion: 'partial',
          competitor: 'full'
        },
        {
          capability: 'Same routing on every plan',
          definition:
            'Whether lower-tier traffic is moved to other locations first when a data center runs short of capacity.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Load balancing and failover',
          definition:
            'Steering traffic away from unhealthy origins or locations, included on every plan.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Instant cache purge',
          definition: 'Removing cached content from every location within seconds.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Support and services',
      rows: [
        {
          capability: 'Enterprise response time',
          definition: 'How fast a support engineer answers a critical, production-down ticket.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: '24×7 critical support',
          definition: 'Round-the-clock coverage for business-critical outages.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Professional services',
          definition: 'Specialists who plan and run migrations and architecture changes.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Security',
      rows: [
        {
          capability: 'Web application firewall',
          definition: 'Managed rules that block attacks on applications and APIs.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'DDoS protection',
          definition:
            'Absorbing volumetric and application-layer attacks before they reach the origin.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Bot management',
          definition:
            'Detecting and blocking automated traffic, available without an Enterprise contract.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Zero Trust (SASE)',
          definition: 'Verifying every user and device before granting access to internal apps.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Compute',
      rows: [
        {
          capability: 'Serverless functions',
          definition: 'Running application code at the edge on web standards.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'AI inference',
          definition: 'Running AI models on the provider’s network, close to users.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Observability',
      rows: [
        {
          capability: 'Real-time metrics',
          definition: 'Live traffic, performance, and security dashboards.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Log streaming',
          definition: 'Sending logs in real time to your SIEM or data lake, on every plan.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Ingest, catalog & query',
          definition:
            'Streaming events into storage, organizing them as tables, and querying them with SQL.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Object storage',
          definition: 'S3-compatible storage for files and objects.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'SQL database',
          definition: 'A relational database replicated close to users.',
          azion: 'full',
          competitor: 'full'
        }
      ]
    },
    {
      title: 'Commercial',
      rows: [
        {
          capability: 'Predictable pricing',
          definition: 'Knowing in advance what a month of traffic and compute will cost.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Committed-use discounts',
          definition: 'Lower rates in exchange for a reserved volume or term.',
          azion: 'full',
          competitor: 'partial'
        },
        {
          capability: 'Every feature on every plan',
          definition: 'No product or feature locked behind an Enterprise contract.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    }
  ]
</script>

<template>
  <ComparisonTable
    eyebrow="Comparison"
    title="How Azion compares with Cloudflare"
    caption="How Azion compares with Cloudflare"
    column-label="Capability"
    full-label="Full support"
    partial-label="Partial support"
    none-label="Not available"
    :competitor="competitor"
    :groups="groups"
  />
</template>
```
