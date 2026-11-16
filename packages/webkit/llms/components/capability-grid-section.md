# Capability Grid Section

> A framed grid of claims or links under an optional section title: each cell is a `FeatureItem` (optional glyph, heading, sentence) with optional bullet points, three or four to a row, and an item with an `href` turns its whole cell into a link to that page. It is the one marketing grid of claims or links: it replaces `'use-case-links'`, `'resource-grid'` and `'content-columns'`. From the design sample's site `CapabilityGridSection`. Use CapabilityGridSection for any grid of claims or links on a marketing page; icons and per-item links are optional.

- Import: `import CapabilityGridSection from '@aziontech/webkit/capability-grid-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [capability-grid-section.json](capability-grid-section.json)

## When to use

- A product page listing what the product does, three or six at a time.
- Use cases or resources that each link to their own page, on a hub or landing page: give each item an `href` (and no `icon` for a resource list).
- A bare grid (no title) under a band that already has its heading.

## Do

- Three or six items at three columns, four or eight at four, so rows stay full.
- Keep points to three short lines.
- Give either every item an `href` or none, so the grid reads as one kind of cell; do not combine `points` with an `href` (the whole cell is the link).
- Set `titleAlign: 'start'` for a band whose header sits at the start edge (the Partners page's "Why you should be a partner"); the grid keeps its title, so each capability stays an `h3`. Never wrap a bare grid in `SectionModule` to move the title: the capability headings rise to `h2` and the outline breaks.

## Don’t

- For capabilities with art — use `FeatureTilesSection` or `BentoGrid`.
- For use cases whose band title sits in the first grid cell with one action — use `CustomerUseCasesSection`.
- For the use cases of a product page — not on product pages; use `CustomerUseCasesSection` with exactly four items. The linked use-case grid belongs on hub and landing pages.
- For cells that each carry their own action or copy button — use `FeatureWidgetsSection`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `FeatureItem`, `CardGrid`, `RegistrationFrame`, `SectionTitle` — the parts.
- `FeatureTilesSection` — tiles with illustrations.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Eyebrow above the title. |
| `title` | `string` | `''` | false | Headline over the grid, rendered as the band `h2`; without it the grid is bare and each capability heading is an `h2`. |
| `description` | `string` | `''` | false | One or two sentences under the title. |
| `items` | `CapabilityGridSectionItem[]` | `[]` | false | The capabilities, in order; each is `{ title, description, icon?, points?, href? }`; an item with `href` links its whole cell to that page. The band renders nothing when empty. |
| `columns` | `CapabilityGridSectionColumns` | `3` | false | Capabilities per row from the large breakpoint up. |
| `primaryAction` | `CapabilityGridSectionAction` | `undefined` | false | First button under the section title, `secondary`; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `secondaryAction` | `CapabilityGridSectionAction` | `undefined` | false | Second button under the section title, `outline`; same shape. Shown only with a label and a link. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `titleAlign` | `SectionTitleAlign` | `'center'` | false | Layout of the section title: `center` stacks and centers it, `start` stacks it at the start edge, `split` sets the headline and its description in two columns. |

## States

- Renders nothing without items.
- Heading level drops to `h3` under a title and rises to `h2` without one.
- An item with `href` renders its heading as a link that covers the cell.
- `titleAlign` is passed to the section title as its `align`; it has no effect on a bare grid.

## Accessibility

- A `section` named by its title; headings nest under it.
- Points are a real list.
- Glyphs are decorative (from `FeatureItem`).
- A linked cell is one link named by its heading (from `FeatureItem`), with a visible focus ring.

## Right-to-left

- Layout: logical utilities only (`ps-*`, `border-e`, `ms-*`).
- Icons: none mirrored.
- Keyboard: unchanged.

## Internationalization

- Built-in strings: none. Every visible string is marketing copy and arrives through props, so the page supplies it in its own language.

## Responsive

- One column on phones, two on medium, `columns` from large (from `CardGrid`).
- No horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import CapabilityGridSection from '@aziontech/webkit/capability-grid-section'

  const items = [
    {
      icon: 'ai ai-bolt',
      title: 'Functions',
      description: 'Run JavaScript and WebAssembly close to every user.'
    },
    {
      icon: 'ai ai-database',
      title: 'Object Storage',
      description: 'Keep files where they are read, with no egress to plan for.'
    },
    {
      icon: 'ai ai-shield',
      title: 'Firewall',
      description: 'Stop bots and attacks before they reach your origin.'
    }
  ]
</script>

<template>
  <CapabilityGridSection
    eyebrow="Platform"
    title="Everything an application needs, in one place"
    description="Compute, storage and security that deploy together."
    :items="items"
    :primary-action="{ label: 'Explore the platform', href: '/platform', trailing: true }"
  />
</template>
```

### Points

```vue
<script setup>
  import CapabilityGridSection from '@aziontech/webkit/capability-grid-section'

  const items = [
    {
      icon: 'ai ai-globe',
      title: 'Global network',
      description: 'Traffic lands on the nearest location.',
      points: ['Anycast routing', 'Automatic failover']
    },
    {
      icon: 'ai ai-lock',
      title: 'Certificates',
      description: 'TLS for every domain, renewed for you.',
      points: ['Managed certificates', 'Bring your own']
    },
    {
      icon: 'ai ai-chart-line',
      title: 'Observability',
      description: 'Metrics and logs in seconds.',
      points: ['Real-time metrics', 'Log streaming']
    },
    {
      icon: 'ai ai-sitemap',
      title: 'Load balancing',
      description: 'Spread requests across origins.',
      points: ['Health checks', 'Weighted pools']
    }
  ]
</script>

<template>
  <CapabilityGridSection
    title="Built for production"
    :items="items"
    :columns="4"
  />
</template>
```

### Left title

```vue
<script setup>
  import CapabilityGridSection from '@aziontech/webkit/capability-grid-section'

  const items = [
    {
      icon: 'ai ai-check',
      title: 'Grow with Azion',
      description: 'Offer a platform your customers already trust, with pricing built for resale.'
    },
    {
      icon: 'ai ai-check',
      title: 'Get certified',
      description: 'Train your team on the platform and earn the certifications your projects need.'
    },
    {
      icon: 'ai ai-check',
      title: 'Sell together',
      description:
        'Work joint accounts with our sales engineers, from the first call to production.'
    }
  ]
</script>

<template>
  <CapabilityGridSection
    title-align="start"
    title="Why you should be a partner"
    description="Build, sell and deliver modern applications with the Azion team beside you."
    :items="items"
  />
</template>
```
