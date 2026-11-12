# Capability Grid

> A framed grid of product capabilities under an optional section title: each cell is a `Topic` (glyph, heading, sentence) with optional bullet points, three or four to a row. From the design sample's site `CapabilityGrid`.

- Import: `import CapabilityGrid from '@aziontech/webkit/capability-grid'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [capability-grid.json](https://github.com/aziontech/webkit/blob/main/.specs/capability-grid.json)

## When to use

- A product page listing what the product does, three or six at a time.
- A bare grid (no title) under a band that already has its heading.

## Do

- Three or six items at three columns, four or eight at four, so rows stay full.
- Keep points to three short lines.
- Set `titleKind: 'left'` for a band whose header sits at the start edge (the Partners page's "Why you should be a partner"); the grid keeps its title, so each capability stays an `h3`. Never wrap a bare grid in `SectionModule` to move the title: the capability headings rise to `h2` and the outline breaks.

## Don’t

- For capabilities with art — use `FeatureTiles` or `BentoGrid`.
- For links to other pages — use `UseCaseLinks` or `ResourceGrid`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- Topic`, `CardGrid`, `FrameBox`, `SectionTitle` — the parts.
- FeatureTiles` — tiles with illustrations.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the title. |
| `title` | `string` | `''` | false | Headline over the grid, rendered as the band `h2`; without it the grid is bare and each capability heading is an `h2`. |
| `description` | `string` | `''` | false | One or two sentences under the title. |
| `items` | `CapabilityGridItem[]` | `[]` | false | The capabilities, in order; each is `{ title, description, icon?, points? }`. The band renders nothing when empty. |
| `columns` | `CapabilityGridColumns` | `3` | false | Capabilities per row from the large breakpoint up. |
| `actions` | `CapabilityGridAction[]` | `[]` | false | Buttons under the section title; each is `{ label, href, trailing?, target?, kind? }`; without `kind` the first is secondary and the rest outlined. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `titleKind` | `SectionTitleKind` | `'centered'` | false | Layout of the section title: `centered` stacks and centers it, `left` stacks it at the start edge, `horizontal` sets the headline and its description in two columns. |

## States

- Renders nothing without items.
- Heading level drops to `h3` under a title and rises to `h2` without one.
- `titleKind` is passed to the section title as its `kind`; it has no effect on a bare grid.

## Accessibility

- A `section` named by its title; headings nest under it.
- Points are a real list.
- Glyphs are decorative (from `Topic`).

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
  import CapabilityGrid from '@aziontech/webkit/capability-grid'

  const items = [
    {
      icon: 'pi pi-bolt',
      title: 'Functions',
      description: 'Run JavaScript and WebAssembly close to every user.'
    },
    {
      icon: 'pi pi-database',
      title: 'Object Storage',
      description: 'Keep files where they are read, with no egress to plan for.'
    },
    {
      icon: 'pi pi-shield',
      title: 'Firewall',
      description: 'Stop bots and attacks before they reach your origin.'
    }
  ]
</script>

<template>
  <CapabilityGrid
    eyebrow="Platform"
    title="Everything an application needs, in one place"
    description="Compute, storage and security that deploy together."
    :items="items"
    :actions="[{ label: 'Explore the platform', href: '/platform', trailing: true }]"
  />
</template>
```

### Points

```vue
<script setup>
  import CapabilityGrid from '@aziontech/webkit/capability-grid'

  const items = [
    {
      icon: 'pi pi-globe',
      title: 'Global network',
      description: 'Traffic lands on the nearest location.',
      points: ['Anycast routing', 'Automatic failover']
    },
    {
      icon: 'pi pi-lock',
      title: 'Certificates',
      description: 'TLS for every domain, renewed for you.',
      points: ['Managed certificates', 'Bring your own']
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Observability',
      description: 'Metrics and logs in seconds.',
      points: ['Real-time metrics', 'Log streaming']
    },
    {
      icon: 'pi pi-sitemap',
      title: 'Load balancing',
      description: 'Spread requests across origins.',
      points: ['Health checks', 'Weighted pools']
    }
  ]
</script>

<template>
  <CapabilityGrid
    title="Built for production"
    :items="items"
    :columns="4"
  />
</template>
```

### Left title

```vue
<script setup>
  import CapabilityGrid from '@aziontech/webkit/capability-grid'

  const items = [
    {
      icon: 'pi pi-check',
      title: 'Grow with Azion',
      description: 'Offer a platform your customers already trust, with pricing built for resale.'
    },
    {
      icon: 'pi pi-check',
      title: 'Get certified',
      description: 'Train your team on the platform and earn the certifications your projects need.'
    },
    {
      icon: 'pi pi-check',
      title: 'Sell together',
      description:
        'Work joint accounts with our sales engineers, from the first call to production.'
    }
  ]
</script>

<template>
  <CapabilityGrid
    title-kind="left"
    title="Why you should be a partner"
    description="Build, sell and deliver modern applications with the Azion team beside you."
    :items="items"
  />
</template>
```
