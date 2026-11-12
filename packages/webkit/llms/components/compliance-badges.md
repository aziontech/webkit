# Compliance Badges

> The compliance band: a framed media split whose copy states the certifications and whose media is a frame grid of badges, each a picture over a check-marked pill, closed by a "see more" cell. It is a page section — the site places it from a `{ _id: 'compliance-badges', props }` entry and binds `props` straight onto it — and it composes `section-module`, `media-split` and `card-grid`.

- Import: `import ComplianceBadges from '@aziontech/webkit/compliance-badges'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [compliance-badges.json](https://github.com/aziontech/webkit/blob/main/.specs/compliance-badges.json)

## When to use

- On security, enterprise or pricing pages, to list the certifications and link to the compliance page.

## Do

- Four or five certifications plus the link cell fill two rows of three.
- Give every badge an `alt` naming the certification; the pill repeats it for sighted readers.

## Don’t

- For client logos → use `logo-wall-quote` or `client-mosaic`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-split](media-split.md) — the copy-beside-media band this section renders through.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the headline. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the media split as its `h2`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the badge list. |
| `certifications` | `ComplianceBadgesCertification[]` | `[]` | false | The badges, in order; each is `{ label, badge, alt }` where `badge` is the picture URL and `label` the pill text. |
| `primaryAction` | `ComplianceBadgesAction` | `undefined` | false | The closing "see more" cell; `{ label, href }`. Omitted when absent. |

## States

- Visual states: `default`, `hover` and `focus-visible` on the see-more cell
- Empty: when `title` is empty the band renders nothing; when `certifications` is empty the media holds only the see-more cell, if any

## Accessibility

- Visible focus: the see-more cell carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`.
- Keyboard map: `Tab` reaches the see-more link; `Enter` follows it.
- ARIA: the band is a plain `div`; the named landmark is `media-split`'s own section (labelled by `title`), so no second landmark is added; the badge grid is a list (`role="list"` named by `ariaLabel`) of list items; each badge image carries its `alt`; the check bubble and chevron are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): pill `var(--text-default)` on `var(--bg-surface-raised)`; see-more `var(--text-muted)` rising to `var(--text-default)` on hover.
- `motion-reduce:transition-none motion-reduce:transform-none` on both transitions above.
- Touch target ≥40×40 px — the see-more cell is a full grid cell.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the "more" chevron mirrors (`rtl:-scale-x-100`) and its hover nudge moves toward the end edge.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import ComplianceBadges from '@aziontech/webkit/compliance-badges'
  import ccpaSymbolColor from '@aziontech/webkit/assets/ccpa-symbol-color.svg'
  import gdprSymbolColor from '@aziontech/webkit/assets/gdpr-symbol-color.svg'
  import lgpdSymbolColor from '@aziontech/webkit/assets/lgpd-symbol-color.svg'
  import pciDssSymbolColor from '@aziontech/webkit/assets/pci-dss-symbol-color.svg'
  import socSymbolColor from '@aziontech/webkit/assets/soc-symbol-color.svg'
</script>

<template>
  <ComplianceBadges
    eyebrow="Compliance"
    title="Meet your compliance requirements"
    description="Azion's certifications help customers and global partners meet a wide range of compliance requirements."
    aria-label="Compliance certifications"
    :certifications="[
      {
        label: 'SOC 2 & 3',
        badge: socSymbolColor,
        alt: 'AICPA SOC 2 Type 2 and SOC 3 badge'
      },
      {
        label: 'PCI DSS',
        badge: pciDssSymbolColor,
        alt: 'PCI DSS badge'
      },
      {
        label: 'LGPD',
        badge: lgpdSymbolColor,
        alt: 'LGPD badge'
      },
      {
        label: 'GDPR',
        badge: gdprSymbolColor,
        alt: 'GDPR badge'
      },
      {
        label: 'CCPA',
        badge: ccpaSymbolColor,
        alt: 'CCPA badge'
      }
    ]"
    :primary-action="{ label: 'See more', href: '/compliance' }"
  />
</template>
```
