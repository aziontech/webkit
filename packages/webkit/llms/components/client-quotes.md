# Client Quotes

> The client-stories band: a framed `quote-tabs` carousel of customer quotes, each signed by its author and marked by the client's logo, with one call to action under it. It is a page section — the site places it from a `{ _id: 'client-quotes', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `quote-tabs` and `button`.

- Import: `import ClientQuotes from '@aziontech/webkit/client-quotes'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [client-quotes.json](https://github.com/aziontech/webkit/blob/main/.specs/client-quotes.json)

## When to use

- To let several customers speak in turn, one at a time, near the end of a page's argument.

## Do

- Three to six items; the tabs need room for each client's mark.
- Give each item either a registry `mark` or a `logo` URL with `clientName`, not both.

## Don’t

- For one quote beside a logo wall → use `logo-wall-quote`.
- For a scrolling strip of analyst recognitions → use `recognition-marquee`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [quote-tabs](quote-tabs.md) — the tabbed quote carousel this band frames.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name of the quote carousel. |
| `items` | `ClientQuotesItem[]` | `[]` | false | The quotes, in order; each is `{ text, name?, jobTitle?, mark?, logo?, clientName?, photo? }` where `mark` is a registry mark name and `logo` a mark URL named by `clientName`. |
| `primaryAction` | `ClientQuotesAction` | `undefined` | false | Button under the quotes; `{ label, href, trailing? }`. Omitted when absent. |

## Assets

- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Ticker` prints it as a typographic wordmark, the quote components show no mark.

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing
- The active quote, its progress and the tab keyboard model belong to `quote-tabs`

## Accessibility

- Visible focus: owned by the composed components.
- Keyboard map: `Tab` reaches each link or button; `Enter` follows it.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- Touch target ≥40×40 px — every affordance is a large `button` or spans its cell.
- ARIA: the band is a plain `div`; the carousel is `quote-tabs`' own labelled region (`ariaLabel`), so no second landmark is added.
- `motion-reduce:transition-none motion-reduce:transform-none` — the tab transition belongs to `quote-tabs`; this band adds no motion.

## Examples

### Default

```vue
<script setup>
  import ClientQuotes from '@aziontech/webkit/client-quotes'
  import herosparkExtendedColor from '@aziontech/webkit/assets/herospark-extended-color.svg'
  import magaluExtendedColor from '@aziontech/webkit/assets/magalu-extended-color.svg'
  import zoopExtendedColor from '@aziontech/webkit/assets/zoop-extended-color.svg'

  const items = [
    {
      mark: 'dafiti',
      clientName: 'Dafiti',
      text: "One of the best CDN and WAF solutions I've ever used. Easy to implement and integrate, with speed and low latency that make a real difference for our customers.",
      name: 'Julian H',
      jobTitle: 'IT OPS, SRE & SEC Manager at Dafiti Group'
    },
    {
      mark: 'axur',
      text: 'With Azion, we scale proprietary AI models without managing infrastructure—inspecting millions of websites daily and automating the market’s fastest threat takedown.',
      name: 'Fabio Ramos',
      jobTitle: 'CEO at Axur'
    },
    {
      logo: magaluExtendedColor,
      clientName: 'Magalu',
      text: 'Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers across Latin America.',
      name: 'Allan Monteiro',
      jobTitle: 'CISO & Head of Technology at Magalu'
    },
    {
      logo: herosparkExtendedColor,
      clientName: 'HeroSpark',
      text: 'Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development.',
      name: 'Mateus Leonardi',
      jobTitle: 'CTO at HeroSpark'
    },
    {
      logo: zoopExtendedColor,
      clientName: 'Zoop',
      text: 'Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.',
      name: 'Ismael Aguilar',
      jobTitle: 'Information Security Manager at Zoop'
    },
    {
      mark: 'contabilizei',
      text: 'With Azion, Contabilizei improved request delivery at the Edge, reduced infrastructure costs, and gained fast access to support whenever needed.',
      name: 'Fabrício Santos',
      jobTitle: 'DevSecOps Manager at Contabilizei'
    }
  ]
</script>

<template>
  <ClientQuotes
    aria-label="Client stories"
    :items="items"
    :primary-action="{ label: 'See customer stories', href: '/success-cases', trailing: true }"
  />
</template>
```
