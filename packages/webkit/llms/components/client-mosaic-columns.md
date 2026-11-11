# Client Mosaic Columns

> Three featured success stories side by side: each column is a client's mark on a face painted in the client's own brand colour, over a one-line story that links to the case. It is a page section — the site places it from a `{ _id: 'client-mosaic-columns', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box` and `logo-wall`.

- Import: `import ClientMosaicColumns from '@aziontech/webkit/client-mosaic-columns'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [client-mosaic-columns.json](https://github.com/aziontech/webkit/blob/main/.specs/client-mosaic-columns.json)

## When to use

- When three stories deserve equal weight and their brands should colour the band.

## Do

- Exactly three cells; the grid is three columns from the large breakpoint.
- brand.base` and `brand.glow` are the client's colours and may be any CSS colour; set `brand.ink` to `'dark'` when the face is light enough that the link text must be dark.

## Don’t

- For a mixed mosaic of stories and marks → use `client-mosaic`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [client-mosaic](client-mosaic.md) — the bento sibling.
- [logo-wall](logo-wall.md) — the single-mark wall each column's face is rendered with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of stories. |
| `linkLabel` | `string` | `''` | false | Label the mark face reveals on hover and the link's accessible name. |
| `cells` | `ClientMosaicColumnsCell[]` | `[]` | false | The stories, in order; each is `{ name, logo, href, story, brand, logoTreatment? }` where `brand` is `{ base, glow, ink? }` (CSS colours painting the face, `ink` `'dark'` or `'light'`) and `logoTreatment` is `'monochrome'`, `'knockout'` or `'as-is'`. |

## States

- Visual states: `default`, `hover` on each column (the face reveals the link line, the story fill rises)
- The face colours are bound as the `--wall-face` and `--wall-ink` custom properties from `brand`; `data-treatment` on every mark drives its ink
- Empty: when `cells` is empty the band renders nothing

## Accessibility

- Visible focus: the mark link is `logo-wall`'s, with its ring; the story panel is a duplicate link hidden from the tab order and from assistive technology.
- Keyboard map: `Tab` moves between the three mark links; `Enter` follows.
- ARIA: the band is a `<section>`; the grid is a list named by `ariaLabel` whose items are the columns; each mark carries the client `name` as `alt`; the story panel is `aria-hidden` with `tabindex="-1"` so the case is reachable once.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the link line ink follows `brand.ink`; the story text is `var(--text-default)` on `var(--bg-canvas)`.
- `motion-reduce:before:transition-none` on the hover fill.
- Touch target ≥40×40 px — each mark face spans its column.

## Examples

### Default

```vue
<script setup>
  import ClientMosaicColumns from '@aziontech/webkit/client-mosaic-columns'
</script>

<template>
  <ClientMosaicColumns
    aria-label="Featured success stories"
    link-label="Read story"
    :cells="[
      {
        name: 'Magalu',
        logo: '/marketing-components/logos/magalu-extended-color.svg',
        href: 'https://www.azion.com/en/success-case/magalu/',
        story:
          'Explore how Magalu enhances cybersecurity with Azion\'s Firewall and WAF, improving threat intelligence and bot management in retail.',
        brand: { base: '#0e89ff', glow: '#0e89ff' },
        logoTreatment: 'monochrome'
      },
      {
        name: 'Dafiti',
        logo: '/marketing-components/logos/dafiti-extended-reversed.svg',
        href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/',
        story:
          'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
        brand: { base: '#ffffff', glow: '#ffffff', ink: 'dark' },
        logoTreatment: 'knockout'
      },
      {
        name: 'MadeiraMadeira',
        logo: '/marketing-components/logos/madeiramadeira-extended-reversed.svg',
        href: 'https://www.azion.com/en/success-case/madeiramadeira/',
        story:
          'Faster product delivery and scalable infrastructure allowed MadeiraMadeira to support massive traffic growth during major e-commerce campaigns.',
        brand: { base: '#ff9014', glow: '#ff9014' },
        logoTreatment: 'monochrome'
      }
    ]"
  />
</template>
```
