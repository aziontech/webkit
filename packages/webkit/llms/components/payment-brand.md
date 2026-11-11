# Payment Brand

> The card-brand plate shown beside a payment card: a small bordered plate with the network's mark (Visa, Mastercard, American Express, Diners Club, JCB) drawn in theme tokens, so it reads in light, dark and forced colors without a raster image or a brand hex. It replaces the design sample's `CardBrandMark` (a Visa plate on a hard-coded blue fill), the Console Kit's `card-flag-block` (six colored SVG logos) and the inline Visa SVG the account blocks repeated. A brand it does not draw (Discover, Elo, Hipercard, UnionPay, or an unknown value) shows a generic card glyph and keeps the brand's name for assistive technology.

- Import: `import PaymentBrand from '@aziontech/webkit/payment-brand'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [payment-brand.json](https://github.com/aziontech/webkit/blob/main/.specs/payment-brand.json)

## When to use

- A payment method row, a checkout summary or a billing table names the card on file: the plate sits before `Ending in 4242` or `Visa •••• 4242`.
- A list of saved cards where the brand helps the reader tell them apart.

## Do

- Pass the brand as the payment API returns it; the plate normalizes `American Express`, `american_express`, `Diners Club` and casing.
- When the row text already says the brand (`Visa •••• 4242`), set `decorative` so the name is not read twice; when the text says only `Ending in 4242`, leave the plate named.
- Keep the plate at `medium` in rows and forms, `small` inside dense tables.

## Don’t

- The Azion logo → use `Brand`.
- A partner or integration logo (Git providers, clouds) → use the product's logo asset or an `Avatar`.
- A status or category of the card (expired, default) → use `Tag` beside the plate.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [brand](brand.md) — the same idea for the Azion lockup: an inline mark, sized by token.
- [tag](tag.md) — put `Default` or `Expired` next to the plate, not inside it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `brand` | `string` | `''` | false | The card network as the payment API names it (`visa`, `mastercard`, `amex`, `American Express`, `diners`, `jcb`…). Unknown values draw the generic card glyph. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Plate size: `small` 20 × 32 px for dense tables, `medium` 28 × 40 px for rows and forms. |
| `label` | `string` | `undefined` | false | Accessible name. Empty uses the brand's name (`Visa`), or the catalog's `Card` for an unknown brand. |
| `decorative` | `boolean` | `false` | false | Hide the plate from assistive technology when the text next to it already names the brand. |

## States

- `data-brand` on the root: `visa` | `mastercard` | `amex` | `diners` | `jcb` | `discover` | `elo` | `hipercard` | `unionpay` | `unknown`.
- `data-size`: `small` | `medium`.
- `data-glyph`: `mark` when the brand has a drawn mark, `generic` otherwise.

## Accessibility

- The root is `role="img"` named by `label` or the brand's name; with `decorative` it is `aria-hidden="true"` and has no role.
- The SVG inside is `aria-hidden` and not focusable; the plate takes no focus.
- Contrast: the mark is `--text-default` on `--bg-surface` (above 4.5:1 in both themes); forced colors draw it in `CanvasText` because it uses `currentColor`.

## Right-to-left

- Layout: the plate is symmetric; no logical spacing inside it.
- Icons: brand marks are not mirrored (they are logos).
- Keyboard: none.
- User data: none.

## Internationalization

| Key                    | English source | Override prop |
| ---------------------- | -------------- | ------------- |
| `paymentBrand.unknown` | `Card`         | `label`       |

- Brand names (`Visa`, `Mastercard`, `American Express`, `Diners Club`, `JCB`, `Discover`, `Elo`, `Hipercard`, `UnionPay`) are trademarks and are not translated.

## Responsive

- Container queries: none.
- Narrow: fixed size; `shrink-0` so a row never squeezes it.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import PaymentBrand from '@aziontech/webkit/payment-brand'
</script>

<template>
  <div class="flex items-center gap-(--spacing-sm)">
    <PaymentBrand brand="visa" />
    <span class="text-label-md text-(--text-default)">Ending in 4242</span>
  </div>
</template>
```

### Brands

```vue
<script setup>
  import PaymentBrand from '@aziontech/webkit/payment-brand'

  const brands = ['Visa', 'Mastercard', 'American Express', 'Diners Club', 'JCB', 'Elo']
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      v-for="size in ['medium', 'small']"
      :key="size"
      class="flex flex-wrap items-center gap-(--spacing-sm)"
    >
      <PaymentBrand
        v-for="brand in brands"
        :key="brand"
        :brand="brand"
        :size="size"
      />
    </div>
  </div>
</template>
```
