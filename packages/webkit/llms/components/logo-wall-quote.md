# Logo Wall Quote

> The customers band: a section title over a framed logo wall of linked client marks with one signed quote in its aside, closed by a call to action. It is a page section — the site places it from a `{ _id: 'logo-wall-quote', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `logo-wall`, `quote` and `button`.

- Import: `import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [logo-wall-quote.json](https://github.com/aziontech/webkit/blob/main/.specs/logo-wall-quote.json)

## When to use

- To prove adoption with marks and let one customer speak, early on a home or solution page.

## Do

- Eight or nine logos fill the rectangle wall beside the aside.
- Set `logoTreatment` per mark: `monochrome` for a mark drawn in one ink that must follow the theme, `invert-light` for a reversed mark that must flip on the light theme, `as-is` for a colour mark; give a `logoLight` file instead when the light theme needs a different drawing.

## Don’t

- For several quotes in turn → use `client-quotes`.
- For marks with photos and stories in a mosaic → use `client-mosaic`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [logo-wall](logo-wall.md) — the wall the marks are laid in, with the quote in its aside.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the logo wall. |
| `logos` | `LogoWallQuoteLogo[]` | `[]` | false | The client marks, in order; each is `{ name, logo, logoLight?, logoTreatment?, href? }` where `logoTreatment` is `'as-is'`, `'monochrome'` or `'invert-light'`. |
| `quote` | `LogoWallQuoteQuote` | `undefined` | false | The signed quote in the wall's aside; `{ text, name, jobTitle, logo, logoAlt }`. Omitted when absent. |
| `primaryAction` | `LogoWallQuoteAction` | `undefined` | false | Button under the quote; `{ label, href, trailing?, target? }`. Omitted when absent. |

## States

- Visual states: `default`
- Empty: when `logos` is empty the band renders nothing
- Each mark carries `data-treatment` so the theme-following inks are driven by data attributes

## Accessibility

- Visible focus: owned by `logo-wall` (each mark link) and `button`.
- Keyboard map: `Tab` moves between mark links and the action; `Enter` follows.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the wall is `logo-wall`'s own list named by `ariaLabel`; every mark image carries the client `name` as `alt`; the quote is a `blockquote` signed by its author.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components; marks follow the theme through their treatment.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — each mark link spans its wall cell.

## Examples

### Default

```vue
<script setup>
  import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'
</script>

<template>
  <LogoWallQuote
    eyebrow="Customers"
    title="Trusted by the world's largest banks and e-commerce companies"
    aria-label="Banks and e-commerce companies running on Azion"
    :logos="[
      {
        name: 'Magalu',
        logo: '/marketing-components/logos/magalu-extended-color.svg',
        href: 'https://www.azion.com/en/success-case/magalu/'
      },
      {
        name: 'Banco de la Nación',
        logo: '/marketing-components/logos/banco-de-la-nacion-extended-mono.svg',
        logoTreatment: 'monochrome',
        href: 'https://www.azion.com/en/success-case/banco-de-la-nacion-achieves-speed-and-reduces-costs/'
      },
      {
        name: 'Netshoes',
        logo: '/marketing-components/logos/netshoes-extended-color.svg',
        href: 'https://www.azion.com/en/success-case/netshoes/'
      },
      {
        name: 'Agibank',
        logo: '/marketing-components/logos/agibank-extended-reversed.svg',
        logoLight: '/marketing-components/logos/agibank-extended-color.svg',
        href: 'https://www.azion.com/en/success-case/agibank/'
      },
      {
        name: 'Zoop',
        logo: '/marketing-components/logos/zoop-extended-color.svg',
        href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/'
      },
      {
        name: 'Crefisa',
        logo: '/marketing-components/logos/crefisa-extended-reversed.svg',
        logoTreatment: 'invert-light',
        href: 'https://www.azion.com/en/success-case/crefisa/'
      },
      {
        name: 'Renner',
        logo: '/marketing-components/logos/renner-extended-color.svg',
        href: 'https://www.azion.com/en/success-case/renner/'
      },
      {
        name: 'Fourbank',
        logo: '/marketing-components/logos/fourbank-extended-reversed.svg',
        logoTreatment: 'invert-light',
        href: 'https://www.azion.com/en/success-case/fourbank/'
      },
      {
        name: 'Marisa',
        logo: '/marketing-components/logos/marisa-extended-color.svg',
        href: 'https://www.azion.com/en/success-case/marisa/'
      }
    ]"
    :quote="{
      text: '&quot;Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.&quot;',
      name: 'Ismael Aguilar',
      jobTitle: 'Information Security Manager at Zoop',
      logo: '/marketing-components/logos/zoop-extended-color.svg',
      logoAlt: 'Zoop'
    }"
    :primary-action="{
      label: 'Read the case study',
      href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/',
      trailing: true,
      target: '_blank'
    }"
  />
</template>
```
