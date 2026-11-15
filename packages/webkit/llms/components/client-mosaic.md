# Client Mosaic

> The client mosaic: a framed bento grid of customer cells where a story cell carries a photograph, the client's mark, one line of its result and a "read the case study" link, and a mark cell carries only the client's linked logo on a chosen fill. With `stories` and `logos` the layout is derived from the data: the first story spans two columns and two rows, every other story one column and two rows, every mark one cell. With `cells` the page places story and mark cells in one ordered list, each with its own column and row span, so stories and marks interleave as on the home page. It is a page section — the site places it from a `{ _id: 'client-mosaic', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `bento-grid`, `logo` and `link`.

- Import: `import ClientMosaic from '@aziontech/webkit/client-mosaic'`
- Category: sections · Surface: site · Structure: monolithic
- API as JSON: [client-mosaic.json](https://github.com/aziontech/webkit/blob/main/.specs/client-mosaic.json)

## When to use

- On the home page, to show the best customer stories and a wall of marks in one band.

## Do

- Two stories and six marks fill the four-column grid exactly.
- Use `cells` when the order matters (a story between marks, a tall story at the end of a row): give each cell its `span` and `rows` (`'1'` or `'2'`) and make the spans add up to full rows of four.
- Pick `fill` and `logoTreatment` together: a `knockout` mark reads on `white` or `primary`, a `monochrome` one on `canvas` or `surface`. Left unset, a mark on `white` or `primary` takes `knockout` and every other mark `monochrome`.
- Set `stacked` on a cell whose mark is a stacked lockup (squarer than a wordmark) so it draws one step taller.
- A story without a `photo` sits on its fill; keep photos for the stories that have one.

## Don’t

- For three equal story columns → use `client-mosaic-columns`.
- For a plain wall with one quote → use `logo-wall-quote`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [bento-grid](bento-grid.md) — the grid the cells are laid in.
- [client-mosaic-columns](client-mosaic-columns.md) — the three-column sibling with brand-coloured faces.
- [logo](logo.md) — draws every client mark in the ink its fill needs.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name of the grid. |
| `linkLabel` | `string` | `''` | false | Label of the link under every story. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `stories` | `ClientMosaicStory[]` | `[]` | false | The story cells, in order; each is `{ logo, logoAlt, photo?, text, href, fill?, logoTreatment? }`. The first spans two columns and two rows, the rest one column and two rows. |
| `logos` | `ClientMosaicLogo[]` | `[]` | false | The mark cells, in order; each is `{ logo, logoAlt, href, fill?, logoTreatment? }` where `fill` is `'canvas'`, `'surface'`, `'white'` or `'primary'` and `logoTreatment` is `'monochrome'`, `'knockout'` or `'as-is'`. |
| `cells` | `ClientMosaicCell[]` | `[]` | false | The cells in placement order, story and mark cells interleaved; each is `{ logo, logoAlt, href, text?, photo?, span?, rows?, fill?, logoTreatment?, stacked? }` where a cell with `text` is a story cell, `span` and `rows` are `'1'` (default) or `'2'`, and `fill` defaults to `canvas`. When set it replaces `stories` and `logos`. |

## States

- Visual states: `default`, `hover` and `focus-visible` on each cell
- `data-cell` (`story` or `logo`), `data-span` and `data-rows` on every grid cell; `data-fill` on every cell face drives its fill; every mark is a `Logo` with `data-treatment` and `data-variant` for its ink and `data-stacked` for a stacked lockup; `data-lead` sets the larger text of the first story (from `stories`) or of a story spanning two columns (from `cells`)
- Empty: when `cells`, `stories` and `logos` are all empty the band renders nothing
- Not applicable: `loading`, `error`, `disabled`, `readonly`, `invalid`, `open`/`closed`

## Accessibility

- Visible focus: every mark cell is a link with `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`; the story link is a `link` with its own ring.
- Keyboard map: `Tab` moves between mark links and story links; `Enter` follows.
- ARIA: the band is a `<section>` named by `ariaLabel`; the photo of a story is decorative (`alt=""`, `aria-hidden`); every mark is a `Logo` (`role="img"`) named by `logoAlt`; the story text is a paragraph and its link is named by `linkLabel`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): story text `var(--text-default)` over the canvas gradient; marks are inked to their fill through `logoTreatment`.
- `motion-reduce:transition-none` on the fill transition.
- Touch target ≥40×40 px — each mark cell is a full grid cell.

## Right-to-left

- Layout: the grid follows the reading direction (`bento-grid`); the story cell uses logical alignment (`items-start`, `self-start`).
- Icons: the story link's chevron is mirrored by `link`; logos are never mirrored.
- Keyboard: `Tab` order follows the placement order.
- User data: none beyond the client names, which are images named by `logoAlt`.

## Internationalization

No built-in strings: the story lines, the client names and `linkLabel` are content the page passes.

- Formatting: none.

## Responsive

- Container queries: none of its own; `bento-grid` sets four columns, two below `md`.
- Narrow: a two-column span fills the phone row; cells keep a minimum height of `clamp(180px, 18vw, 240px)`.
- Touch: every mark cell is a full-cell link; story links are `link` targets.
- Reflow: no horizontal scroll at 320 px.

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

### Ordered cells

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

  const cells = [
    {
      logo: netshoesExtendedColor,
      logoAlt: 'Netshoes',
      photo: netshoesPhoto,
      text: 'Netshoes automatically blocks more than 4 million threats in six months',
      href: 'https://www.azion.com/en/success-case/netshoes/',
      span: '2',
      rows: '2',
      fill: 'surface'
    },
    {
      logo: dafitiExtendedMono,
      logoAlt: 'Dafiti',
      href: 'https://www.azion.com/en/success-case/dafiti/',
      fill: 'white'
    },
    {
      logo: agibankExtendedReversed,
      logoAlt: 'Agibank',
      href: 'https://www.azion.com/en/success-case/agibank/'
    },
    {
      logo: rennerExtendedReversed,
      logoAlt: 'Renner',
      href: 'https://www.azion.com/en/success-case/renner/'
    },
    {
      logo: gpaExtendedReversed,
      logoAlt: 'GPA',
      photo: gpaPhoto,
      text: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
      href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/',
      rows: '2',
      fill: 'surface',
      stacked: true
    },
    {
      logo: fourbankExtendedReversed,
      logoAlt: 'Fourbank',
      href: 'https://www.azion.com/en/success-case/fourbank/',
      fill: 'primary'
    },
    {
      logo: exameExtendedMono,
      logoAlt: 'Exame',
      href: 'https://www.azion.com/en/success-case/exame/'
    },
    {
      logo: nznExtendedReversed,
      logoAlt: 'NZN',
      href: 'https://www.azion.com/en/success-case/nzn/',
      fill: 'primary'
    }
  ]
</script>

<template>
  <ClientMosaic
    anchor="clients"
    aria-label="Client stories"
    link-label="Read the case study"
    :cells="cells"
  />
</template>
```
