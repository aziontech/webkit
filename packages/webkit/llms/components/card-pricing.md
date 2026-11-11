# Card Pricing

> One tier of a pricing table: what it is called, what it costs, what that price includes, and the one action that moves the account onto it. The card owns the typographic hierarchy of a price — an overline plan name, the amount as the headline figure, and the billing caveat under it in muted body copy — so a row of tiers reads as a comparison rather than as three differently-typeset cards. `slotPosition` is the axis that decides which of the two compositions the card is. **`bottom`** is the compact tier: the name, a `medium` amount and the caveat stack at the top, the action follows, and the slot sits under it — a card sized by its own content, for a row of tiers a reader scans. **`middle`** is the full tier: the amount becomes the `large` headline figure, the caveat moves up to `body-md`, the slot grows to fill the card, and the action is pinned to the bottom edge so a row of `middle` cards has its buttons on one line whatever each tier's feature list holds. `kind` decides only whether the card draws its own surface (`contained`) or sits on the one behind it (`transparent`); it never changes the composition. The name, the amount and the caveat are **one column**, capped at `--container-xs` (348px) rather than at the card's full width: the caveat is a sentence about the price directly above it, so it wraps on the price's measure. The cap shipped as `--container-3xs` (256px) — two rungs down the ladder, and too narrow for the copy it holds. 256px sets `body-md` at roughly 33 characters, under the 45–75 a prose measure wants, and all three billing caveats on the sample pricing page (66, 69 and 84 characters) ran to three lines there. At 348px the measure is ~46 characters and the same three set in two, while the card's own content box at 1440 is 413px — so the caveat is still held to the price's column instead of the card's. The card carries **one** prose region — the pricing caveat, below the amount. It used to carry a second paragraph above the amount as well, and with `aligned` reserving a band for each, a row of tiers showed two two-line muted blocks around every price doing the same visual job. The Figma component (`3605:2260`) has a single prose region, `Pricing Details`, positioned below the amount, so that is the one the card keeps; a tier's positioning sentence belongs to whatever the consumer puts in the slot. `aligned` makes a ROW of cards read as one comparison. Every region is content-sized by default, which is right for a single card and wrong for three side by side — a tier with a two-line caveat and a tier with none put their feature lists on different lines, and the reader has to re-find the row in every column. It reserves **three** lines for the caveat, in `lh` so the reservation follows the type token rather than a hard-coded height. Three is the design's 64px band expressed in whole lines of the region's own token (`body-md` is a 22px line box, so `3lh` is 66px; `2lh` is 44px and twenty short) — it shipped as `2lh`, and the shortfall stayed invisible until a tier's caveat ran to three lines at the region's then-256px measure, overflowed the band, and pushed that column's feature list 22px below the other two. Opt-in, because reserving empty lines is wrong for a lone card; set it on every card in the row. A caveat past three lines still pushes the row down, like any overflow. The plan title is an **overline** (`.text-overline-md` on an `<h3>`): the token carries the display face, the uppercase transform and the widest tracking step, so the tier reads as a label on the card rather than as a title competing with the price beneath it. It stays an `<h3>` for the document outline — the tier is the section heading — while looking like an overline.

- Import: `import CardPricing from '@aziontech/webkit/card-pricing'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [card-pricing.json](https://github.com/aziontech/webkit/blob/main/.specs/card-pricing.json)

## When to use

- One tier in a row of plans: plan name, price, billing caveat, one action and the tier's feature list.
- A compact tier sized by its content (`slot-position="bottom"`), or a full tier whose action is pinned to the bottom so a row's buttons line up (`slot-position="middle"`).
- A tier set on the surface behind it (`kind="transparent"`) inside a section that already draws the frame.

## Do

- In a row of tiers, set `aligned` on every card so each caveat reserves the same band and the feature lists start on one line.
- Keep `pricing-details` to the billing caveat. A tier's positioning sentence goes in the default slot with the feature list.
- The card emits no events, and the built-in button has no handler. To act on the click, fill the `actions` slot with your own `Button`.
- Hide the symbol or the period with `:show-prefix="false"` / `:show-suffix="false"` (for example on a custom-quote tier) instead of clearing `prefix` / `suffix`.
- Mark at most one card in a row with `show-tag` and `tag-label`.

## Don’t

- You need the whole plans band of a pricing page, with the billing-period toggle and the framed row → use `pricing-plans`.
- You need a feature-by-feature comparison across plans → use `compare-plans`.
- You only need to show an amount, in a table cell or a summary → use `currency`.
- The card holds general content rather than a price → use `card`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [currency](currency.md) — typesets the amount inside the card; use it directly for prices outside a tier card.
- [pricing-plans](pricing-plans.md) — the page section that lays out a row of plan cards with the billing toggle.
- [compare-plans](compare-plans.md) — the matrix that sits under the plan cards.
- [card](card.md) — generic bordered card with header, content and footer regions.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `planTitle` | `string` | `'Pro'` | false | plan Title. |
| `pricingDetails` | `string` | `''` | false | pricing Details. |
| `showPricingDetails` | `boolean` | `true` | false | show Pricing Details. |
| `showTag` | `boolean` | `false` | false | show Tag. |
| `tagLabel` | `string` | `'Popular'` | false | tag Label. |
| `aligned` | `boolean` | `false` | false | Reserves the caveat's band so a row of cards aligns row-for-row. Set it on every card in the row. |
| `slotPosition` | `'bottom' \| 'middle'` | `'bottom'` | false | slot Position. |
| `kind` | `'contained' \| 'transparent'` | `'contained'` | false | card Style. |
| `value` | `string` | `'20'` | false | value. |
| `prefix` | `string` | `'$'` | false | prefix. |
| `suffix` | `string` | `'/ mon'` | false | suffix. |
| `showPrefix` | `boolean` | `true` | false | show Prefix. |
| `showSuffix` | `boolean` | `true` | false | show Suffix. |
| `actionLabel` | `string` | `'Label'` | false | action Label. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `actions` | — | Named slot. |
| `default` | — | Main content. |

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
  import CardPricing from '@aziontech/webkit/card-pricing'
</script>

<template>
  <CardPricing
    plan-title="Pro"
    pricing-details="Billed annually or $25/mo billed monthly."
    slot-position="bottom"
    kind="contained"
    value="20"
    prefix="$"
    suffix="/ mon"
    action-label="Label"
  />
</template>
```

### Aligned

```vue
<script setup>
  import CardPricing from '@aziontech/webkit/card-pricing'
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,320px)] gap-6">
    <CardPricing
      aligned
      plan-title="Hobby"
      pricing-details=""
      value="Free"
      prefix=""
      suffix=""
      action-label="Start for free"
    />
    <CardPricing
      aligned
      show-tag
      tag-label="Popular"
      plan-title="Pro"
      pricing-details="Billed annually, save 20%"
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Continue with Pro"
    />
    <CardPricing
      aligned
      plan-title="Enterprise"
      pricing-details="Tailored to your usage requirements and payment terms"
      value="Custom"
      prefix=""
      suffix=""
      action-label="Talk to a specialist"
    />
  </div>
</template>
```

### Variants

```vue
<script setup>
  import CardPricing from '@aziontech/webkit/card-pricing'
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,320px)] gap-6">
    <CardPricing
      slot-position="bottom"
      kind="contained"
      plan-title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <CardPricing
      slot-position="bottom"
      kind="transparent"
      plan-title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <CardPricing
      slot-position="middle"
      kind="contained"
      plan-title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
    <CardPricing
      slot-position="middle"
      kind="transparent"
      plan-title="Pro"
      pricing-details="Billed annually or $25/mo billed monthly."
      value="20"
      prefix="$"
      suffix="/ mon"
      action-label="Label"
    />
  </div>
</template>
```
