# Customer Spotlight

> A row of client cards, each painted in the client's own colours with its reversed logo; the hovered or focused card opens to reveal its story line and a "Read story" cue, and the whole card links to the success story. Below the large breakpoint the cards stack and stay open. From the design sample's site `CustomerSpotlight`.

- Import: `import CustomerSpotlight from '@aziontech/webkit/customer-spotlight'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [customer-spotlight.json](https://github.com/aziontech/webkit/blob/main/.specs/customer-spotlight.json)

## When to use

- Three or four flagship customer stories on a landing page.

## Do

- Three or four cards.
- Use the client's reversed (white) logo; the face paints the client's brand colours.
- Leave `brand` out for a client the client registry knows (`clientBrand(name)` from `@aziontech/webkit/assets/client-registry`): the card reads its colours by `name`. Add a missing client to the registry rather than writing its hex colours into the page. Pass `brand` only for a one-off client the registry does not carry; a card with neither paints a black face.
- One sentence per story line.

## Don’t

- For many clients — use `ClientMosaic` or `LogoWallQuote`.
- For a quotation — use `ClientQuotes` or `LogoWallQuote` `kind="quote"`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- ClientMosaic`, `ClientQuotes`, `LogoWallQuote`.
- FrameBox`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `cards` | `CustomerSpotlightCard[]` | `[]` | false | The cards, in reading order; each is `{ name, logo, logoWidth?, href, description, brand? }`; `brand` (`{ base, glow }`) defaults to the client registry's colours for `name`. A card opens while hovered or focused. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list; empty uses the built-in "Customer stories". |
| `storyLabel` | `string` | `''` | false | Label revealed under the description while the card is open; empty uses the built-in "Read story". |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |

## States

- Renders nothing without cards.
- Each item carries `data-state=open|closed`; one is open at a time on large screens.

## Accessibility

- A list of links; each link name is "<story label>, <client>: <story line>", so the logo image is decorative (`alt=""`).
- Focus opens the card the same way hover does; the focus ring is drawn inside the card.
- Contrast of the story line: `--text-default` on `--bg-canvas`.

## Right-to-left

- Layout: logical utilities; the first card is flush at the inline start.
- Icons: `pi-arrow-up-right` is mirrored.
- Keyboard: unchanged.

## Internationalization

| Key                       | English source     | Override prop |
| ------------------------- | ------------------ | ------------- |
| `customerSpotlight.list`  | `Customer stories` | `ariaLabel`   |
| `customerSpotlight.story` | `Read story`       | `storyLabel`  |

- Client names, logos and story lines are content passed through `cards`.

## Responsive

- Below large: cards stack, open, with the logo above the story line.
- From large: one row, open on hover or focus.

## Examples

### Default

```vue
<script setup>
  import agibankExtendedReversed from '@aziontech/webkit/assets/agibank-extended-reversed.svg'
  import americanasExtendedReversed from '@aziontech/webkit/assets/americanas-extended-reversed.svg'
  import arezzoExtendedReversed from '@aziontech/webkit/assets/arezzo-extended-reversed.svg'
  import CustomerSpotlight from '@aziontech/webkit/customer-spotlight'

  const cards = [
    {
      name: 'Agibank',
      logo: agibankExtendedReversed,
      href: '/customers/agibank',
      description: 'Agibank moved its digital bank to a platform that scales with every campaign.'
    },
    {
      name: 'Americanas',
      logo: americanasExtendedReversed,
      href: '/customers/americanas',
      description: 'Americanas serves Black Friday traffic with no capacity planning.'
    },
    {
      name: 'Arezzo',
      logo: arezzoExtendedReversed,
      href: '/customers/arezzo',
      description: 'Arezzo cut image weight by half across its storefronts.'
    }
  ]
</script>

<template>
  <CustomerSpotlight :cards="cards" />
</template>
```
