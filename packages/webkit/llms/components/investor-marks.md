# Investor Marks

> The investors band: a centered section title over a two-column bento grid where each cell is an investor's mark, linked to its site, that lifts on hover to reveal a "visit website" line. It is a page section — the site places it from a `{ _id: 'investor-marks', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box` and `bento-grid`.

- Import: `import InvestorMarks from '@aziontech/webkit/investor-marks'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [investor-marks.json](https://github.com/aziontech/webkit/blob/main/.specs/investor-marks.json)

## When to use

- On the company page, to name the investors with their marks.

## Do

- Give each item a `logoLight` when its mark needs a different file on the light theme; otherwise one `logo` serves both.
- Keep `linkLabel` short; it is revealed under the mark on hover and read before the investor name.

## Don’t

- For client marks → use `client-mosaic` or `logo-wall-quote`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [bento-grid](bento-grid.md) — the grid the marks are laid in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the centered section title as its `h2`; the band renders no header when empty. |
| `linkLabel` | `string` | `''` | false | Line revealed under a mark on hover, and the start of each link's accessible name. |
| `items` | `InvestorMarksItem[]` | `[]` | false | The investors, in order; each is `{ name, logo, logoLight?, href }` where `logo` is the mark on the dark theme and `logoLight` the one on the light theme. |

## States

- Visual states: `default`, `hover` and `focus-visible` on each cell (fill rises, mark lifts, the link line appears)
- Empty: when `items` is empty the band renders nothing

## Accessibility

- Visible focus: each cell link carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset` and shows the same reveal as hover.
- Keyboard map: `Tab` moves between investor links; `Enter` follows one (opens in a new tab).
- ARIA: the band is a `<section>` named by its title (`aria-label`); each link's accessible name is "`linkLabel`, `name` (opens in a new tab)"; the revealed line is `aria-hidden` since the name already carries it; the two theme marks share the investor's name as `alt`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): link line `var(--text-default)` on `var(--bg-hover)`.
- `motion-reduce:transition-none motion-reduce:transform-none` on every transition above.
- Touch target ≥40×40 px — each link is a full 12rem-tall cell.

## Examples

### Default

```vue
<script setup>
  import InvestorMarks from '@aziontech/webkit/investor-marks'
  import monasheesExtendedMono from '@aziontech/webkit/assets/monashees-extended-mono.svg'
  import monasheesExtendedReversed from '@aziontech/webkit/assets/monashees-extended-reversed.svg'
  import qualcommExtendedMono from '@aziontech/webkit/assets/qualcomm-extended-mono.svg'
  import qualcommExtendedReversed from '@aziontech/webkit/assets/qualcomm-extended-reversed.svg'
</script>

<template>
  <InvestorMarks
    eyebrow="Investors"
    title="Backed by visionary investors"
    link-label="Visit website"
    :items="[
      {
        name: 'monashees+',
        logo: monasheesExtendedReversed,
        logoLight: monasheesExtendedMono,
        href: 'https://www.monashees.com'
      },
      {
        name: 'Qualcomm Ventures',
        logo: qualcommExtendedReversed,
        logoLight: qualcommExtendedMono,
        href: 'https://www.qualcommventures.com'
      }
    ]"
  />
</template>
```
