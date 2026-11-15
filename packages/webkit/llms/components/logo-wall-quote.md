# Logo Wall Quote

> The customers band: a section title over a framed logo wall of linked client marks with one signed quote in its aside, closed by a call to action. It is a page section — the site places it from a `{ _id: 'logo-wall-quote', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `logo-wall`, `quote` and `button`.

- Import: `import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'`
- Category: sections · Surface: site · Structure: monolithic
- API as JSON: [logo-wall-quote.json](https://github.com/aziontech/webkit/blob/main/.specs/logo-wall-quote.json)

## When to use

- Use LogoWallQuote for customer logos plus one featured quote.
- To prove adoption with marks and let one customer speak, early on a home or solution page.

## Do

- Eight or nine logos fill the rectangle wall beside the aside.
- Pass client registry entries (`@aziontech/webkit/assets/client-registry`) as they stand: each carries `name`, `logo` and either `logoLight` (a light-theme drawing) or `artwork` (which theme a single file must be inverted on), and every mark renders through `Logo`.
- Without a registry entry, set `logoTreatment` per mark: `monochrome` for a mark drawn in one ink that must follow the theme, `invert-light` for a reversed mark that must flip on the light theme, `as-is` for a colour mark; give a `logoLight` file instead when the light theme needs a different drawing.
- Give the quote's company mark a `logoLight` (or an `artwork`) the same way, so it stays legible on both themes.
- Keep to one or two actions under the quote: the primary (`secondary` variant) and an optional outlined `secondaryAction`.

## Don’t

- For several quotes in turn → use `client-quotes`.
- For marks with photos and stories in a mosaic → use `client-mosaic`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [logo-wall](logo-wall.md) — the wall the marks are laid in, with the quote in its aside.
- [logo](logo.md) — draws every mark (the wall's and the quote's) right on both themes.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `LogoWallQuoteVariant` | `'wall'` | false | Layout of the band: `wall` sets the client marks with the quote in their aside, `quote` sets the quote alone as a full-width band (the design sample's QuoteBand) and needs no logos. |
| `quoteVariant` | `LogoWallQuoteQuoteVariant` | `'signed'` | false | Register of the quote in the `quote` layout: the featured `highlight` or the band-sized `signed` sentence. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the logo wall. |
| `logos` | `LogoWallQuoteLogo[]` | `[]` | false | The client marks, in order; each is `{ name, logo, logoLight?, logoTreatment?, artwork?, href? }` where `logoTreatment` is `'as-is'`, `'monochrome'` or `'invert-light'` and `artwork` is the registry's `'color'`, `'light'` or `'dark'`. |
| `quote` | `LogoWallQuoteQuote` | `undefined` | false | The signed quote in the wall's aside; `{ text, name, jobTitle, logo, logoAlt, logoLight?, artwork? }`. Omitted when absent. |
| `primaryAction` | `LogoWallQuoteAction` | `undefined` | false | Button under the quote; `{ label, href, trailing?, target? }`. Omitted when absent. |
| `secondaryAction` | `LogoWallQuoteAction` | `undefined` | false | Outlined button beside the primary one under the quote; `{ label, href, trailing?, target? }`. Omitted when absent. |

## States

- Visual states: `default`
- Empty: when `logos` is empty the band renders nothing
- Each mark is a `Logo` carrying `data-treatment` (the `logoTreatment`, default `as-is`), `data-variant`, `data-artwork` and `data-route` (`pair`, `single` or `wordmark`), so the theme-following inks are driven by data attributes
- Not applicable: `loading`, `error`, `disabled`, `readonly`, `invalid`, `open`/`closed`

## Accessibility

- Visible focus: owned by `logo-wall` (each mark link) and `button`.
- Keyboard map: `Tab` moves between mark links and the action; `Enter` follows.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the wall is `logo-wall`'s own list named by `ariaLabel`; every mark is a `Logo` (`role="img"`) named by the client `name`, announced once even when a light/dark pair renders; the quote is a `blockquote` signed by its author.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components; marks follow the theme through their treatment.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — each mark link spans its wall cell.

## Right-to-left

- Layout: the composed `section-title`, `logo-wall`, `quote` and `button` use logical utilities; the band adds none of its own.
- Icons: the trailing chevron of an action is mirrored by `button`; logos are never mirrored.
- Keyboard: `Tab` order follows the DOM, which follows the reading direction.
- User data: a client name drawn as a wordmark is wrapped in `dir="auto"` by `Logo`.

## Internationalization

No built-in strings: the title, the quote, the client names and the action labels are content the page passes.

- Formatting: none.

## Responsive

- Container queries: none of its own; `logo-wall` reflows the marks and moves the aside under them on narrow widths.
- Narrow: the marks cap at the wall cell's width (`max-w-full`), widening to a 96 px cap from `sm`.
- Touch: each mark link spans its wall cell (well over 44 px); actions are `large` buttons.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import agibankExtendedColor from '@aziontech/webkit/assets/agibank-extended-color.svg'
  import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import bancoDeLaNacionExtendedMono from '@aziontech/webkit/assets/banco-de-la-nacion-extended-mono.svg'
  import crefisaExtendedReversed from '@aziontech/webkit/assets/crefisa-extended-reversed.svg'
  import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
  import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import marisaExtendedColor from '@aziontech/webkit/assets/marisa-extended-color.svg'
  import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'
  import zoopExtendedColor from '@aziontech/webkit/assets/zoop-extended-color.svg'
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
        logo: magaluExtendedColor,
        href: 'https://www.azion.com/en/success-case/magalu/'
      },
      {
        name: 'Banco de la Nación',
        logo: bancoDeLaNacionExtendedMono,
        logoTreatment: 'monochrome',
        href: 'https://www.azion.com/en/success-case/banco-de-la-nacion-achieves-speed-and-reduces-costs/'
      },
      {
        name: 'Netshoes',
        logo: netshoesExtendedColor,
        href: 'https://www.azion.com/en/success-case/netshoes/'
      },
      {
        name: 'Agibank',
        logo: agibankExtendedReversed,
        logoLight: agibankExtendedColor,
        href: 'https://www.azion.com/en/success-case/agibank/'
      },
      {
        name: 'Zoop',
        logo: zoopExtendedColor,
        href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/'
      },
      {
        name: 'Crefisa',
        logo: crefisaExtendedReversed,
        logoTreatment: 'invert-light',
        href: 'https://www.azion.com/en/success-case/crefisa/'
      },
      {
        name: 'Renner',
        logo: rennerExtendedColor,
        href: 'https://www.azion.com/en/success-case/renner/'
      },
      {
        name: 'Fourbank',
        logo: fourbankExtendedReversed,
        logoTreatment: 'invert-light',
        href: 'https://www.azion.com/en/success-case/fourbank/'
      },
      {
        name: 'Marisa',
        logo: marisaExtendedColor,
        href: 'https://www.azion.com/en/success-case/marisa/'
      }
    ]"
    :quote="{
      text: '&quot;Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.&quot;',
      name: 'Ismael Aguilar',
      jobTitle: 'Information Security Manager at Zoop',
      logo: zoopExtendedColor,
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

### Quote band

```vue
<script setup>
  import agibankExtendedColor from '@aziontech/webkit/assets/agibank-extended-color.svg'
  import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'
</script>

<template>
  <div class="flex flex-col">
    <LogoWallQuote
      variant="quote"
      :quote="{
        text: 'We stopped planning capacity for campaigns. Traffic peaks just work now.',
        name: 'Jane Doe',
        jobTitle: 'Head of Platform, Agibank',
        logo: agibankExtendedColor,
        logoAlt: 'Agibank'
      }"
      :primary-action="{ label: 'Read the story', href: '/customers/agibank', trailing: true }"
    />
    <LogoWallQuote
      variant="quote"
      quote-variant="highlight"
      :quote="{
        text: 'Our checkout got faster in every country on the first deploy.',
        name: 'John Smith',
        jobTitle: 'CTO, Netshoes',
        logo: netshoesExtendedColor,
        logoAlt: 'Netshoes'
      }"
    />
  </div>
</template>
```

### Registry

```vue
<script setup>
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'

  const WALL = [
    'Agibank',
    'iFood',
    'Itaú',
    'GPA',
    'Netshoes',
    'Renner',
    'Magalu',
    'Dafiti',
    'Prime Video'
  ]

  const logos = WALL.map((name) => CLIENTS.find((client) => client.name === name))

  const zoop = CLIENTS.find((client) => client.name === 'Zoop')
</script>

<template>
  <LogoWallQuote
    eyebrow="Customers"
    title="Trusted by the largest retailers and banks"
    aria-label="Retailers and banks running on Azion"
    :logos="logos"
    :quote="{
      text: 'Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.',
      name: 'Ismael Aguilar',
      jobTitle: 'Information Security Manager at Zoop',
      logo: zoop.logo,
      logoLight: zoop.logoLight,
      artwork: zoop.artwork,
      logoAlt: zoop.name
    }"
    :primary-action="{
      label: 'Read the case study',
      href: 'https://example.com/stories',
      trailing: true
    }"
    :secondary-action="{ label: 'See all customers', href: 'https://example.com/customers' }"
  />
</template>
```
