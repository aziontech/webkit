# Client Mosaic

> The client mosaic: a framed bento grid of customer cells where a story cell carries a photograph, the client's mark, one line of its result and a "read the case study" link, and a mark cell carries only the client's linked logo on a chosen fill. The layout is derived from the data: the first story spans two columns and two rows, every other story one column and two rows, every mark one cell. It is a page section — the site places it from a `{ _id: 'client-mosaic', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `bento-grid` and `mini-button`.

- Import: `import ClientMosaic from '@aziontech/webkit/client-mosaic'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [client-mosaic.json](https://github.com/aziontech/webkit/blob/main/.specs/client-mosaic.json)

## When to use

- On the home page, to show the best customer stories and a wall of marks in one band.

## Do

- Two stories and six marks fill the four-column grid exactly.
- Pick `fill` and `logoTreatment` together: a `knockout` mark reads on `white` or `primary`, a `monochrome` one on `canvas` or `surface`.

## Don’t

- For three equal story columns → use `client-mosaic-columns`.
- For a plain wall with one quote → use `logo-wall-quote`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [bento-grid](bento-grid.md) — the grid the cells are laid in.
- [client-mosaic-columns](client-mosaic-columns.md) — the three-column sibling with brand-coloured faces.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name of the grid. |
| `linkLabel` | `string` | `''` | false | Label of the link under every story. |
| `stories` | `ClientMosaicStory[]` | `[]` | false | The story cells, in order; each is `{ logo, logoAlt, photo, text, href, fill?, logoTreatment? }`. The first spans two columns and two rows, the rest one column and two rows. |
| `logos` | `ClientMosaicLogo[]` | `[]` | false | The mark cells, in order; each is `{ logo, logoAlt, href, fill?, logoTreatment? }` where `fill` is `'canvas'`, `'surface'`, `'white'` or `'primary'` and `logoTreatment` is `'monochrome'`, `'knockout'` or `'as-is'`. |

## States

- Visual states: `default`, `hover` and `focus-visible` on each cell
- `data-fill` on every cell face drives its fill; `data-treatment` on every mark drives its ink; `data-lead` on the first story sets its larger text
- Empty: when both `stories` and `logos` are empty the band renders nothing

## Accessibility

- Visible focus: every mark cell is a link with `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`; the story link is a `mini-button` with its own ring.
- Keyboard map: `Tab` moves between mark links and story links; `Enter` follows.
- ARIA: the band is a `<section>` named by `ariaLabel`; the photo of a story is decorative (`alt=""`, `aria-hidden`); every mark carries `logoAlt`; the story text is a paragraph and its link is named by `linkLabel`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): story text `var(--text-default)` over the canvas gradient; marks are inked to their fill through `logoTreatment`.
- `motion-reduce:transition-none` on the fill transition.
- Touch target ≥40×40 px — each mark cell is a full grid cell.

## Examples

### Default

```vue
<script setup>
  import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import dafitiExtendedMono from '@aziontech/webkit/assets/dafiti-extended-mono.svg'
  import exameExtendedMono from '@aziontech/webkit/assets/exame-extended-mono.svg'
  import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
  import gpaPhoto from '@aziontech/webkit/assets/gpa-photo.jpg'
  import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import netshoesPhoto from '@aziontech/webkit/assets/netshoes-photo.jpg'
  import nznExtendedReversed from '@aziontech/webkit/assets/nzn-extended-reversed.svg'
  import rennerExtendedReversed from '@aziontech/webkit/assets/renner-extended-reversed.svg'
  import ClientMosaic from '@aziontech/webkit/client-mosaic'
</script>

<template>
  <ClientMosaic
    aria-label="Client stories"
    link-label="Read the case study"
    :stories="[
      {
        logo: netshoesExtendedColor,
        logoAlt: 'Netshoes',
        photo: netshoesPhoto,
        text: 'Netshoes automatically blocks more than 4 million threats in six months',
        href: 'https://www.azion.com/en/success-case/netshoes/',
        fill: 'surface',
        logoTreatment: 'monochrome'
      },
      {
        logo: gpaExtendedReversed,
        logoAlt: 'GPA',
        photo: gpaPhoto,
        text: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
        href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/',
        fill: 'surface',
        logoTreatment: 'monochrome'
      }
    ]"
    :logos="[
      {
        logo: dafitiExtendedMono,
        logoAlt: 'Dafiti',
        href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/',
        fill: 'white',
        logoTreatment: 'knockout'
      },
      {
        logo: agibankExtendedReversed,
        logoAlt: 'Agibank',
        href: 'https://www.azion.com/en/success-case/agibank/',
        fill: 'canvas',
        logoTreatment: 'monochrome'
      },
      {
        logo: rennerExtendedReversed,
        logoAlt: 'Renner',
        href: 'https://www.azion.com/en/success-case/renner/',
        fill: 'canvas',
        logoTreatment: 'monochrome'
      },
      {
        logo: fourbankExtendedReversed,
        logoAlt: 'Fourbank',
        href: 'https://www.azion.com/en/success-case/fourbank/',
        fill: 'primary',
        logoTreatment: 'knockout'
      },
      {
        logo: exameExtendedMono,
        logoAlt: 'Exame',
        href: 'https://www.azion.com/en/success-case/exame/',
        fill: 'canvas',
        logoTreatment: 'monochrome'
      },
      {
        logo: nznExtendedReversed,
        logoAlt: 'NZN',
        href: 'https://www.azion.com/en/success-case/nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform/',
        fill: 'primary',
        logoTreatment: 'knockout'
      }
    ]"
  />
</template>
```
