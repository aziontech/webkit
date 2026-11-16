# Client Story Columns Section

> Three featured success stories side by side: each column is a client's mark on a face painted in the client's own brand colour, over a one-line story that links to the case. With `reveal="hover"` each column is one card instead: the client's reversed logo on its brand face, which opens while hovered or focused to reveal the story line and a "Read story" cue, the whole card linking to the case; below the large breakpoint those cards stack and stay open. It is a page section — the site places it from a `{ _id: 'client-story-columns-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `registration-frame` and `logo-wall`. The retired `'customer-spotlight'` `_id` resolves here with `reveal: 'hover'`.

- Import: `import ClientStoryColumnsSection from '@aziontech/webkit/client-story-columns-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [client-story-columns-section.json](client-story-columns-section.json)

## When to use

- Use ClientStoryColumnsSection for three or four client cards in brand colours linking to case studies; `reveal="hover"` shows the story on hover.

## Do

- Three cells for `reveal="always"` (the grid is three columns from the large breakpoint); three or four for `reveal="hover"`, which shares the row between them.
- With `reveal="hover"` use the client's reversed (white) logo and one sentence per story; `logoWidth` sizes the mark as a share of the card (default `35%`).
- Leave `brand` out for a client the client registry knows (`clientBrand(name)` from `@aziontech/webkit/assets/client-registry`): the face reads its colours, and its ink, by `name`. Add a missing client to the registry rather than writing its hex colours into the page.
- Pass `brand` only for a one-off client the registry does not carry: `base` and `glow` may be any CSS colour, and `ink` is `'dark'` when the face is light enough that the link text must be dark. A cell with neither paints a black face.

## Don’t

- For a bento of client stories with photos and logos → use `client-mosaic-section`.
- For a quotation → use `client-quotes-section` or `logo-wall-section` `variant="quote"`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [client-mosaic-section](client-mosaic-section.md) — the bento sibling.
- [logo-wall](logo-wall.md) — the single-mark wall each column's face is rendered with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of stories. |
| `linkLabel` | `string` | `''` | false | Label the mark face reveals on hover and the link's accessible name. |
| `cells` | `ClientStoryColumnsSectionCell[]` | `[]` | false | The stories, in order; each is `{ name, logo, href, story, brand?, logoTreatment?, logoWidth? }` where `brand` is `{ base, glow, ink? }` (CSS colours painting the face, `ink` `'dark'` or `'light'`) and defaults to the client registry's colours for `name`, `logoTreatment` is `'color'`, `'monochrome'` or `'knockout'` (the shared `LogoTreatment`), and `logoWidth` (read by `reveal="hover"`) sizes the mark as a share of the card. |
| `reveal` | `ClientStoryColumnsSectionReveal` | `'always'` | false | When the story shows: `always` under each face, or `hover`, where each card opens to reveal it while hovered or focused and stays open below the large breakpoint. |

## States

- Visual states: `default`, `hover` on each column (the face reveals the link line, the story fill rises)
- The face colours are bound as the `--wall-face` and `--wall-ink` custom properties from `brand`, or from the client registry by `name` when `brand` is left out; `data-treatment` on every mark drives its ink
- `reveal="hover"`: each list item carries `data-state=open|closed`; one card is open at a time on large screens, every card is open below the large breakpoint
- Empty: when `cells` is empty the band renders nothing

## Accessibility

- Visible focus: the mark link is `logo-wall`'s, with its ring; the story panel is a duplicate link hidden from the tab order and from assistive technology.
- Keyboard map: `Tab` moves between the three mark links; `Enter` follows.
- ARIA: the band is a `<section>`; the grid is a list named by `ariaLabel` whose items are the columns; each mark carries the client `name` as `alt`; the story panel is `aria-hidden` with `tabindex="-1"` so the case is reachable once.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the link line ink follows `brand.ink`; the story text is `var(--text-default)` on `var(--bg-canvas)`.
- `motion-reduce:before:transition-none` on the hover fill.
- Touch target ≥40×40 px — each mark face spans its column.
- `reveal="hover"`: the list carries the one accessible name (`ariaLabel`, else the built-in "Customer stories"); each card is one link named "<link label>, <client>: <story>", so its logo is decorative (`alt=""`); focus opens the card the same way hover does and the ring is drawn inside the card; `ai-arrow-up-right` mirrors under right-to-left.

## Internationalization

| Key                               | English source     | Override prop                          |
| --------------------------------- | ------------------ | -------------------------------------- |
| `clientStoryColumnsSection.list`  | `Customer stories` | `ariaLabel` (read by `reveal="hover"`) |
| `clientStoryColumnsSection.story` | `Read story`       | `linkLabel` (read by `reveal="hover"`) |

## Examples

### Default

```vue
<script setup>
  import dafitiExtendedReversed from '@aziontech/webkit/assets/dafiti-extended-reversed.svg'
  import madeiramadeiraExtendedReversed from '@aziontech/webkit/assets/madeiramadeira-extended-reversed.svg'
  import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import ClientStoryColumnsSection from '@aziontech/webkit/client-story-columns-section'
</script>

<template>
  <ClientStoryColumnsSection
    aria-label="Featured success stories"
    link-label="Read story"
    :cells="[
      {
        name: 'Magalu',
        logo: magaluExtendedColor,
        href: 'https://www.azion.com/en/success-case/magalu/',
        story:
          'Explore how Magalu enhances cybersecurity with Azion\'s Firewall and WAF, improving threat intelligence and bot management in retail.',
        logoTreatment: 'monochrome'
      },
      {
        name: 'Dafiti',
        logo: dafitiExtendedReversed,
        href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/',
        story:
          'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
        logoTreatment: 'knockout'
      },
      {
        name: 'MadeiraMadeira',
        logo: madeiramadeiraExtendedReversed,
        href: 'https://www.azion.com/en/success-case/madeiramadeira/',
        story:
          'Faster product delivery and scalable infrastructure allowed MadeiraMadeira to support massive traffic growth during major e-commerce campaigns.',
        logoTreatment: 'monochrome'
      }
    ]"
  />
</template>
```

### Reveal on hover

```vue
<script setup>
  import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import americanasExtendedReversed from '@aziontech/webkit/assets/americanas-extended-reversed.svg'
  import arezzoExtendedReversed from '@aziontech/webkit/assets/arezzo-extended-reversed.svg'
  import ClientStoryColumnsSection from '@aziontech/webkit/client-story-columns-section'

  const cells = [
    {
      name: 'Agibank',
      logo: agibankExtendedReversed,
      href: '/customers/agibank',
      story: 'Agibank moved its digital bank to a platform that scales with every campaign.'
    },
    {
      name: 'Americanas',
      logo: americanasExtendedReversed,
      href: '/customers/americanas',
      story: 'Americanas serves Black Friday traffic with no capacity planning.'
    },
    {
      name: 'Arezzo',
      logo: arezzoExtendedReversed,
      href: '/customers/arezzo',
      story: 'Arezzo cut image weight by half across its storefronts.'
    }
  ]
</script>

<template>
  <ClientStoryColumnsSection
    reveal="hover"
    :cells="cells"
  />
</template>
```
