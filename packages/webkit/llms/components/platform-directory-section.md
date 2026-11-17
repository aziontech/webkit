# Platform Directory Section

> A directory of Azion's products under a section title: one column per product group (Build, Store, Secure, Observe), each row an icon, a product name and one line about it, linking to that product. It is a page section — the site places it from a `{ _id: 'platform-directory-section', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `section-title`, `registration-frame` and `link-directory` rather than owning any anatomy of its own.

- Import: `import PlatformDirectorySection from '@aziontech/webkit/platform-directory-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [platform-directory-section.json](platform-directory-section.json)

## When to use

- Use PlatformDirectorySection for the Azion products directory band.
- On Home, right under the hero, to show every product the platform offers at a glance.
- On a solution, product or pricing page that repeats the full product map.

## Do

- Keep to four groups or fewer; the directory fans out to one column per group at the large breakpoint, up to four, so one, two or three groups never leave an empty cell.
- Give each item an `href`; an item without a title or a link is skipped, and a group left with no items is skipped too.
- Set `ariaLabel` so the directory's navigation landmark is told apart from the site navigation; left empty, the landmark takes the `title`.
- Use `eyebrow` for the short label above the headline (the page's name for the product map) and `description` for one sentence under it.
- Give the band an `anchor` when a page links to it with a `#hash`.

## Don’t

- For a handful of icon-led use cases → use `customer-use-cases-section`.
- For a site-wide navigation menu → use `navigation-menu`.
- Inside another band's cell → compose `link-directory` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [link-directory](link-directory.md) — the named navigation landmark whose columns and rows this band fills.
- [section-title](section-title.md) — the headline over the directory.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Short label above the headline; shown only with a title. |
| `title` | `string` | `''` | false | Headline over the directory, rendered by the section title as its `h2`; the band renders no header, eyebrow or description when empty. |
| `description` | `string` | `''` | false | One sentence under the headline; shown only with a title. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the directory's navigation landmark; empty uses the title. |
| `groups` | `PlatformDirectorySectionGroup[]` | `[]` | false | The columns, in order; each is `{ title, items }` where every item is `{ icon, title, description, href }`. Items without a title or an `href` are skipped, and so are groups left empty. |

## States

- Visual states: `default`
- One column per group from the large breakpoint, up to four (`link-directory`'s `columns` is 2, 3 or 4), one column below the small one; the column layout is `link-directory`'s own
- No empty cell: a single group spans the whole row (`data-span="full"`), and with three groups the third spans both columns between the small and the large breakpoints (`data-span="pair"`), so the rule colour never shows through a missing column
- Header: with a `title`, the section title renders the eyebrow and the description that are set around the headline; without one, no header renders
- Anchor: the root carries `id` = `anchor` when set, with a scroll margin so a `#hash` jump clears a sticky header
- Empty: when no group carries a linked item the band renders nothing — not the header, not the frame

## Accessibility

- Visible focus: owned by the composed `link-directory` item links.
- Keyboard map: `Tab` moves through the product links in reading order; `Enter` follows one. Nothing else in the band is interactive.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the directory is `link-directory`'s `nav`, named by `ariaLabel` (or the title when `ariaLabel` is empty), and each column's overline heading names its list of rows.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none motion-reduce:transform-none` — the row hover belongs to `link-directory`, which carries its own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — each row is a full-width link taller than 40 px.

## Right-to-left

- Layout: logical utilities and the composed components' own mirroring, so the directory cells fill from the inline start.
- Icons: action chevrons mirror (owned by `button`).
- Keyboard: unchanged.

## Internationalization

- No built-in strings: every visible string arrives through props.

## Responsive

- One cell per row on phones (`mobileColumns: 1`); from the grid's breakpoints the cells fill the computed track count, wide cells spanning two tracks from small and large.
- No horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import PlatformDirectorySection from '@aziontech/webkit/platform-directory-section'
</script>

<template>
  <PlatformDirectorySection
    title="Everything you need to build and run applications"
    aria-label="Azion products"
    :groups="[
      {
        title: 'Build',
        items: [
          {
            icon: 'az az-functions',
            title: 'Functions',
            description: 'Run code globally with no cold starts',
            href: '/products/functions'
          },
          {
            icon: 'az az-ai-inference',
            title: 'AI Inference',
            description: 'Run models close to the user',
            href: 'https://www.azion.com/en/products/ai-inference/'
          }
        ]
      },
      {
        title: 'Store',
        items: [
          {
            icon: 'az az-kv-store',
            title: 'KV Store',
            description: 'Store key-value data with low latency',
            href: 'https://www.azion.com/en/products/kv-store/'
          }
        ]
      },
      {
        title: 'Secure',
        items: [
          {
            icon: 'az az-waf',
            title: 'WAF',
            description: 'Block common attacks close to traffic',
            href: 'https://www.azion.com/en/products/web-application-firewall/'
          }
        ]
      },
      {
        title: 'Observe',
        items: [
          {
            icon: 'az az-real-time-metrics',
            title: 'Real-Time Metrics',
            description: 'Watch traffic, errors and latency as they happen',
            href: 'https://www.azion.com/en/products/real-time-metrics/'
          }
        ]
      }
    ]"
  />
</template>
```

### Three groups

```vue
<script setup>
  import PlatformDirectorySection from '@aziontech/webkit/platform-directory-section'
</script>

<template>
  <PlatformDirectorySection
    title="Build, store and secure in one place"
    aria-label="Azion products"
    :groups="[
      {
        title: 'Build',
        items: [
          {
            icon: 'az az-functions',
            title: 'Functions',
            description: 'Run code globally with no cold starts',
            href: '/products/functions'
          },
          {
            icon: 'az az-ai-inference',
            title: 'AI Inference',
            description: 'Run models close to the user',
            href: 'https://www.azion.com/en/products/ai-inference/'
          }
        ]
      },
      {
        title: 'Store',
        items: [
          {
            icon: 'az az-kv-store',
            title: 'KV Store',
            description: 'Store key-value data with low latency',
            href: 'https://www.azion.com/en/products/kv-store/'
          }
        ]
      },
      {
        title: 'Secure',
        items: [
          {
            icon: 'az az-waf',
            title: 'WAF',
            description: 'Block common attacks close to traffic',
            href: 'https://www.azion.com/en/products/web-application-firewall/'
          }
        ]
      }
    ]"
  />
</template>
```

### With header

```vue
<script setup>
  import PlatformDirectorySection from '@aziontech/webkit/platform-directory-section'
</script>

<template>
  <PlatformDirectorySection
    anchor="products"
    eyebrow="Platform"
    title="Everything you need to build and run applications"
    description="Build, store, secure and observe applications on one platform."
    :groups="[
      {
        title: 'Build',
        items: [
          {
            icon: 'az az-functions',
            title: 'Functions',
            description: 'Run code globally with no cold starts',
            href: '/products/functions'
          }
        ]
      },
      {
        title: 'Store',
        items: [
          {
            icon: 'az az-kv-store',
            title: 'KV Store',
            description: 'Store key-value data with low latency',
            href: '/products/kv-store'
          }
        ]
      },
      {
        title: 'Secure',
        items: [
          {
            icon: 'az az-waf',
            title: 'WAF',
            description: 'Block common attacks close to traffic',
            href: '/products/web-application-firewall'
          }
        ]
      },
      {
        title: 'Observe',
        items: [
          {
            icon: 'az az-real-time-metrics',
            title: 'Real-Time Metrics',
            description: 'Watch traffic and errors as they happen',
            href: '/products/real-time-metrics'
          }
        ]
      }
    ]"
  />
</template>
```
