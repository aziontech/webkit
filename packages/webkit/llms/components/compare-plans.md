# Compare Plans

> The feature-by-feature matrix under the plan cards on Pricing: one column per plan with its name and action button pinned in the header while the page scrolls, one band per product with an overline, a title and a lead, and one row per feature saying what each plan includes — a tick, a dash, or the allowance as text. The recommended plan carries an accent bar, and below the large breakpoint the table folds to one plan picked from a select. It is a page section — the site places it from a `{ _id: 'compare-plans', props }` entry and binds `props` straight onto it — and it composes `section-module`, `select`, `button`, `overline`, `hint`, `tag` and `link`.

- Import: `import ComparePlans from '@aziontech/webkit/compare-plans'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [compare-plans.json](https://github.com/aziontech/webkit/blob/main/.specs/compare-plans.json)

## When to use

- On Pricing, under the plan cards, to show what every plan includes product by product.

## Do

- Give every plan a stable `id`; the narrow-screen picker selects by it.
- Mark one plan `highlighted`; it gets the accent bar, the secondary button and opens the picker.
- Give every row's `values` one entry per plan, in plan order.

## Don’t

- To compare support tiers → use `compare-support-tiers`.
- To compare Azion with a competitor → use `comparison-table`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [pricing-plans](pricing-plans.md) — the plan cards this matrix sits under.
- [compare-support-tiers](compare-support-tiers.md) — the same matrix for the Support page.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `caption` | `string` | `''` | false | Screen-reader caption naming the table. |
| `columnLabel` | `string` | `''` | false | Heading of the feature column, shown from the large breakpoint up. |
| `pickerAriaLabel` | `string` | `''` | false | Accessible name of the plan picker shown below the large breakpoint. |
| `includedLabel` | `string` | `''` | false | Screen-reader text of a ticked cell. |
| `excludedLabel` | `string` | `''` | false | Screen-reader text of a dashed cell. |
| `plans` | `ComparePlansPlan[]` | `[]` | false | The plan columns, in order; each is `{ id, name, description?, highlighted?, action }` with `action` as `{ label, href }`; a plan without a name is dropped. |
| `sections` | `ComparePlansSection[]` | `[]` | false | The product bands, in order; each is `{ eyebrow, title, description, rows, link? }` (`link` closes the band, `{ label, href }`) and a row is `{ label, values, group?, hint?, tag? }` with one value per plan: `true` or `✓` ticks, `—` dashes, other text shows as written, empty is blank. |
| `primaryAction` | `ComparePlansAction` | `undefined` | false | Closing link under the table, opened in a new tab; `{ label, href }`. Omitted when absent. |

## States

- Visual states: `default`
- The highlighted plan carries the accent bar and the secondary button; the others carry an outlined button
- Below the large breakpoint only the picked plan's column shows (`data-folded` on the others); the picker opens on the highlighted plan, or the first
- A group row (`group: true`) reads in the default text colour and draws a top rule unless it opens its band
- Empty: when no plan has a name the band renders nothing but its root

## Accessibility

- Visible focus: owned by the composed `select`, `button`, `hint` and `link`.
- Keyboard map: `Tab` reaches the picker (below `lg`), each plan button, each hint and the closing link; the picker's keyboard map is `select`'s.
- ARIA: the table carries a `caption`, `scope="col"` plan heads, a `scope="colgroup"` head per band and a `scope="row"` head per feature, so each value is announced with its row and plan. The tick and dash glyphs are `aria-hidden` and carry `includedLabel` / `excludedLabel` as `sr-only` text; the accent bar is decorative; the plan names stay readable to screen readers below `lg`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the composed controls carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the plan buttons and the picker are `large`.
- Reflow: below `lg` (one plan column beside the row labels) the header cells, the section headings and the row labels use `var(--spacing-sm)` side padding instead of `var(--spacing-lg)`, so the two columns fit a 640px box at 200% zoom; from `lg` the padding is unchanged.

## Examples

### Band links

```vue
<script setup>
  import ComparePlans from '@aziontech/webkit/compare-plans'

  const plans = [
    {
      id: 'hobby',
      name: 'Hobby',
      description: 'For side projects.',
      action: { label: 'Start for free', href: '/signup' }
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For teams in production.',
      highlighted: true,
      action: { label: 'Start trial', href: '/signup?plan=pro' }
    }
  ]

  const sections = [
    {
      eyebrow: 'Compute',
      title: 'Functions',
      description: 'Run code close to users.',
      rows: [
        { label: 'Requests per month', values: ['1M', '10M'] },
        { label: 'Custom domains', values: [true, true] },
        { label: 'Usage alerts', values: ['—', true] }
      ],
      link: { label: 'See compute rates', href: '/pricing/compute' }
    },
    {
      eyebrow: 'Storage',
      title: 'Object Storage',
      rows: [
        { label: 'Storage included', values: ['5 GB', '100 GB'] },
        { label: 'Versioning', values: ['—', true] }
      ],
      link: { label: 'See storage rates', href: '/pricing/storage' }
    }
  ]
</script>

<template>
  <ComparePlans
    caption="Hobby and Pro compared feature by feature"
    column-label="Features"
    picker-aria-label="Plan being compared"
    included-label="Included"
    excluded-label="Not included"
    :plans="plans"
    :sections="sections"
  />
</template>
```
