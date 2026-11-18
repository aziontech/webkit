# Competitor Comparison Section

> The capability-by-capability comparison of Azion with one competitor on a migration landing page: a left section title over a framed table whose header row (the capability column, the Azion brand and the competitor logo) stays pinned while the page scrolls. Each category opens with a heading row; each cell is a support glyph — full, partial or none — named by a tooltip and by screen-reader text, and a capability with a definition carries an info button that opens it in a popover. It is a page section — the site places it from a `{ _id: 'competitor-comparison-section', props }` entry and binds `props` straight onto it — and it composes `module`, `module-header`, `registration-frame`, `brand`, `popover`, `icon-button` and `tooltip`.

- Import: `import CompetitorComparisonSection from '@aziontech/webkit/competitor-comparison-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [competitor-comparison-section.json](competitor-comparison-section.json)

## When to use

- Use CompetitorComparisonSection to compare Azion with one competitor, on an "Azion vs X" page, across a few categories of capabilities.

## Do

- Give every row a `definition`; the info popover is where a reader learns what the capability means.
- Pass the competitor's entry from `@aziontech/webkit/assets/competitor-registry` (`competitor('Akamai')`): its `logo` and `logoLight` render on first paint, server render included.
- With only a `name`, the band looks the name up in the competitor registry once the page is interactive (the registry loads on demand, outside the band's bundle) and shows the name as text until then, or for a platform the registry does not hold.
- For a platform outside the registry, ship both `competitor.logo` (dark theme) and `competitor.logoLight` (light theme), or one file with its `artwork`.
- Set `anchor` when a page links to the table (`#compare`).
- Keep `caption` equal to the title; it is the table's accessible name.

## Don’t

- To compare Azion's own plans or support tiers → use `plan-comparison-section`.
- For price cards with a billing-period toggle → use `pricing-plans-section`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [plan-comparison-section](plan-comparison-section.md) — the plan-by-plan matrix of Pricing.
- [tooltip](tooltip.md) — names each support glyph on hover and focus.
- [third-party-logo](third-party-logo.md) — draws the competitor's mark right on both themes.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `eyebrow` | `string` | `''` | false | Eyebrow above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the section title as its `h2` and naming the band; no header renders when empty. |
| `caption` | `string` | `''` | false | Screen-reader caption naming the table. |
| `columnLabel` | `string` | `''` | false | Heading of the capability column. |
| `fullLabel` | `string` | `''` | false | Tooltip and screen-reader text of a full-support cell. |
| `partialLabel` | `string` | `''` | false | Tooltip and screen-reader text of a partial-support cell. |
| `noneLabel` | `string` | `''` | false | Tooltip and screen-reader text of an unsupported cell. |
| `competitor` | `CompetitorComparisonSectionCompetitor` | `—` | true | The platform compared with Azion; `{ name, logo?, logoLight?, artwork? }` where `logo` is the dark-theme file and `logoLight` the light-theme one. With only a `name`, the logo is taken from the competitor registry once the page is interactive, and the name is the column head until then or when the registry has no entry. |
| `groups` | `CompetitorComparisonSectionGroup[]` | `[]` | false | The categories, in order; each is `{ title, rows }` and a row is `{ capability, definition?, azion?, competitor? }` with each level `full`, `partial` or `none` (missing reads as `none`). |

## States

- Visual states: `default`
- A support cell is one of `full`, `partial` or `none`, mirrored on the glyph's `data-support`. Only `full` is coloured; `partial` and `none` stay neutral, told apart by their glyph and their label:

  | Level     | Glyph                | Colour                |
  | --------- | -------------------- | --------------------- |
  | `full`    | `az az-circle-check` | `var(--success-mark)` |
  | `partial` | `az az-circle-half`  | `var(--text-muted)`   |
  | `none`    | `az az-minus`        | `var(--text-muted)`   |

  Partial support is a property of the platform, not a problem that needs action, so it never takes the warning colour; an unsupported capability is a quiet dash, not a red cross.

- The competitor head is a `ThirdPartyLogo` (`data-testid="competitor-comparison-section__competitor-logo"`) whose `data-route` is `pair` (light/dark files), `single` (one file) or `wordmark` (the name as text: no logo and no registry entry, or before the registry loads)
- Not applicable: `loading`, `error`, `disabled`, `readonly`, `invalid`, `open`/`closed` (the popovers own their open state)
- Empty: when `groups` is empty the band renders nothing but its root — no header, no table

## Accessibility

- Visible focus: owned by the composed `icon-button` and `tooltip` triggers.
- Keyboard map: `Tab` reaches each definition's info button; `Enter` / `Space` opens its popover and `Esc` closes it (owned by `popover`).
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the table carries a `caption`, `scope="col"` heads, a `scope="colgroup"` head per category and a `scope="row"` head per capability, so each value is announced with its row and column. The glyphs are `aria-hidden` and every cell carries its level as `sr-only` text; the competitor logo is a `Logo` named by the platform, inside a head cell that carries the same name.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text and glyph colours are the tokens above. The glyphs on `--bg-canvas`: `--success-mark` Lc 67.0 / 4.43:1 (light) and Lc 49.6 / 7.69:1 (dark); `--text-muted` Lc 80.8 / 7.06:1 (light) and Lc 60.7 / 9.90:1 (dark). The category heads on `--bg-surface` are `--text-brand`, the logo orange in both themes: Lc 44.1 / 6.32:1 in dark, and about 3:1 in light, the accepted `--text-brand` pairs of `rules/webkit-tokens.md` (owner decision 2026-11-18, superseding the darker light-theme orange).
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the table carries a `caption`, `scope="col"` heads, a `scope="colgroup"` head per category and a `scope="row"` head per capability, so each value is announced with its row and column. The glyphs are `aria-hidden` and every cell carries its level as `sr-only` text; the competitor logo is a `ThirdPartyLogo` named by the platform, inside a head cell that carries the same name.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text and glyph colours are the tokens above. The glyphs on `--bg-canvas`: `--success-mark` Lc 67.0 / 4.43:1 (light) and Lc 49.6 / 7.69:1 (dark); `--text-muted` Lc 80.8 / 7.06:1 (light) and Lc 60.7 / 9.90:1 (dark). The category heads on `--bg-surface`: `--text-primary` Lc 79.0 / 6.01:1 in light; `--text-brand` Lc 44.1 / 6.32:1 in dark, the accepted dark `--text-brand` pair of `rules/webkit-tokens.md`.
- Never colour alone: each level has its own glyph and its label as tooltip and `sr-only` text.
- `motion-reduce:transition-none motion-reduce:transform-none` — the popover and tooltip carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the info button is a small `icon-button`, a secondary affordance next to the capability name.

## Right-to-left

- Layout: logical utilities only (`border-s`, `ps-`/`pe-`); the Azion and competitor columns follow the reading direction.
- Icons: the support glyphs and the info glyph are not mirrored; logos are never mirrored.
- Keyboard: `Tab` order follows the DOM.
- User data: the competitor name drawn as a wordmark is wrapped in `dir="auto"` by `ThirdPartyLogo`.

## Internationalization

| Key                                 | English source       | Override prop |
| ----------------------------------- | -------------------- | ------------- |
| `competitorComparisonSection.about` | `About {capability}` | —             |

- The column and level labels (`columnLabel`, `fullLabel`, `partialLabel`, `noneLabel`), the caption and every capability are content the page passes.
- Formatting: none.

## Responsive

- Container queries: none; the head row's logos step up from 12 px to 16 px (`sm`) and 24 px (`md`).
- Narrow: the capability column keeps its text, the two platform columns narrow to their glyphs.
- Touch: the info button is a small `icon-button`, a secondary affordance next to the capability name.
- Reflow: no horizontal scroll at 320 px; the head row stays pinned under the site header at `top: var(--layout-sticky-top)` (the header height by default; `0` inside a scroller with no header above it, so the head row never covers the first category at rest).

## Examples

### Default

```vue
<script setup>
  import cloudflareExtendedColor from '@aziontech/webkit/assets/cloudflare-extended-color.svg'
  import cloudflareExtendedReversed from '@aziontech/webkit/assets/cloudflare-extended-reversed.svg'
  import CompetitorComparisonSection from '@aziontech/webkit/competitor-comparison-section'

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
  <CompetitorComparisonSection
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

### Registry

```vue
<script setup>
  import CompetitorComparisonSection from '@aziontech/webkit/competitor-comparison-section'

  const groups = [
    {
      title: 'Security',
      rows: [
        {
          capability: 'Web application firewall',
          definition: 'Rules that inspect requests and block attacks before they reach the origin.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Bot management',
          definition: 'Detecting and blocking automated traffic.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Compute',
      rows: [
        {
          capability: 'Functions on every location',
          definition: 'Code runs on every location of the network, not only in a few regions.',
          azion: 'full',
          competitor: 'none'
        }
      ]
    }
  ]
</script>

<template>
  <CompetitorComparisonSection
    anchor="compare"
    eyebrow="Comparison"
    title="Azion vs Fastly"
    caption="Azion vs Fastly"
    column-label="Capability"
    full-label="Full support"
    partial-label="Partial support"
    none-label="Not supported"
    :competitor="{ name: 'Fastly' }"
    :groups="groups"
  />
</template>
```
