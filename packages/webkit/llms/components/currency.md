# Currency

> Typesets one monetary amount as three separately-styled parts — the currency symbol, the figure, and a trailing period or unit — so money reads the same everywhere in the product instead of being a formatted string each screen spells its own way. The suffix carries the code typeface (`text-label-code-*`), which keeps the unit visually subordinate to the figure and aligns the whole set with the way the system typesets metered values. The size ladder is the house one (`small` / `medium` / `large`) and each step is a different reading distance: `small` is an amount inside a table row or a list cell, `medium` an amount stated as a fact on a card, `large` the headline figure of a pricing card. `large` bottom-aligns the suffix against the figure rather than centring it, because a 56px numeral centred against a 14px unit reads as two unrelated pieces of text.

- Import: `import Currency from '@aziontech/webkit/currency'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [currency.json](https://github.com/aziontech/webkit/blob/main/.specs/currency.json)

## When to use

- Any monetary amount in the product: a price in a table row or list cell (`small`), an amount stated on a card (`medium`), the headline figure of a pricing card (`large`).
- An amount followed by a period or unit (`/ mon`, `/ GB`) that should read as secondary to the figure.

## Do

- Pass `value` already formatted as a string (`'1,250.00'`). The component does no number or locale formatting.
- prefix` defaults to `'$'`; set `prefix=""` to drop the symbol. The suffix renders only when `suffix` is set.
- Pick `size` by reading distance, not by available space: `small` (the default) in tables and lists, `medium` on cards, `large` only for a headline price.
- Don't restyle the parts with classes; each size takes its typography from the `text-amount-*` and `text-label-code-*` tokens.

## Don’t

- You need a full pricing tier with plan name, caveat and action → use `card-pricing`.
- The headline figures are not money (throughput, uptime, points of presence) → use `big-numbers`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card-pricing](card-pricing.md) — composes Currency for its price, `medium` or `large` depending on `slotPosition`.
- [big-numbers](big-numbers.md) — display-scale figures for metrics that aren't money.
- [stats-band](stats-band.md) — page section of big figures with their own prefix and unit.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `''` | false | value. |
| `prefix` | `string` | `'$'` | false | prefix. |
| `suffix` | `string` | `''` | false | suffix. |
| `size` | `'small' \| 'medium' \| 'large'` | `'small'` | false | Size token; affects typography and the gap between the figure and the suffix. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Examples

### Default

```vue
<script setup>
  import Currency from '@aziontech/webkit/currency'
</script>

<template>
  <Currency
    value="20"
    prefix="$"
    suffix="per month"
    size="small"
  />
</template>
```

### Sizes

```vue
<script setup>
  import Currency from '@aziontech/webkit/currency'
</script>

<template>
  <div class="flex flex-col items-start gap-6">
    <Currency
      value="20"
      prefix="$"
      suffix="per month"
      size="small"
    />
    <Currency
      value="20"
      prefix="$"
      suffix="per month"
      size="medium"
    />
    <Currency
      value="20"
      prefix="$"
      suffix="per month"
      size="large"
    />
  </div>
</template>
```
