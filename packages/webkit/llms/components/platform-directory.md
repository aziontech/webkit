# Platform Directory

> A directory of Azion's products under a section title: one column per product group (Build, Store, Secure, Observe), each row an icon, a product name and one line about it, linking to that product. It is a page section — the site places it from a `{ _id: 'platform-directory', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `section-title`, `frame-box` and `column-navigation` rather than owning any anatomy of its own.

- Import: `import PlatformDirectory from '@aziontech/webkit/platform-directory'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [platform-directory.json](https://github.com/aziontech/webkit/blob/main/.specs/platform-directory.json)

## When to use

- On Home, right under the hero, to show every product the platform offers at a glance.
- On a solution, product or pricing page that repeats the full product map.

## Do

- Keep to four groups or fewer; the directory fans out to one column per group at the large breakpoint, up to four, so one, two or three groups never leave an empty cell.
- Give each item an `href`; an item without a title or a link is skipped, and a group left with no items is skipped too.
- Set `ariaLabel` so the directory's navigation landmark is told apart from the site navigation.

## Don’t

- For a handful of icon-led use cases → use `use-cases`.
- For a site-wide navigation menu → use `navigation-menu`.
- Inside another band's cell → compose `column-navigation` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [column-navigation](column-navigation.md) — the named navigation landmark whose columns and rows this band fills.
- [section-title](section-title.md) — the headline over the directory.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Headline over the directory, rendered by the section title as its `h2`; the band renders no header when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the directory's navigation landmark. |
| `groups` | `PlatformDirectoryGroup[]` | `[]` | false | The columns, in order; each is `{ title, items }` where every item is `{ icon, title, description, href }`. Items without a title or an `href` are skipped, and so are groups left empty. |

## States

- Visual states: `default`
- One column per group from the large breakpoint, up to four (`column-navigation`'s `columns` is 2, 3 or 4), one column below the small one; the column layout is `column-navigation`'s own
- No empty cell: a single group spans the whole row (`data-span="full"`), and with three groups the third spans both columns between the small and the large breakpoints (`data-span="pair"`), so the rule colour never shows through a missing column
- Empty: when no group carries a linked item the band renders nothing — not the header, not the frame

## Accessibility

- Visible focus: owned by the composed `column-navigation` item links.
- Keyboard map: `Tab` moves through the product links in reading order; `Enter` follows one. Nothing else in the band is interactive.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the directory is `column-navigation`'s `nav`, named by `ariaLabel`, and each column's overline heading names its list of rows.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none motion-reduce:transform-none` — the row hover belongs to `column-navigation`, which carries its own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — each row is a full-width link taller than 40 px.

## Examples

### Default

```vue
<script setup>
  import PlatformDirectory from '@aziontech/webkit/platform-directory'
</script>

<template>
  <PlatformDirectory
    title="Everything you need to build and run applications"
    aria-label="Azion products"
    :groups="[
      {
        title: 'Build',
        items: [
          {
            icon: 'ai ai-edge-functions',
            title: 'Functions',
            description: 'Run code globally with no cold starts',
            href: '/products/functions'
          },
          {
            icon: 'ai ai-edge-ai',
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
            icon: 'ai ai-edge-kv',
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
            icon: 'ai ai-waf-rules',
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
            icon: 'ai ai-real-time-metrics',
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
  import PlatformDirectory from '@aziontech/webkit/platform-directory'
</script>

<template>
  <PlatformDirectory
    title="Build, store and secure in one place"
    aria-label="Azion products"
    :groups="[
      {
        title: 'Build',
        items: [
          {
            icon: 'ai ai-edge-functions',
            title: 'Functions',
            description: 'Run code globally with no cold starts',
            href: '/products/functions'
          },
          {
            icon: 'ai ai-edge-ai',
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
            icon: 'ai ai-edge-kv',
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
            icon: 'ai ai-waf-rules',
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
