# Stats Band

> The proof-by-numbers band of a marketing page: a framed row of big figures, each with its caption and optional prefix or unit. It is a page section — the site places it from a `{ _id: 'stats-band', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box` and `big-numbers`, which owns the figures' scale and layout.

- Import: `import StatsBand from '@aziontech/webkit/stats-band'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [stats-band.json](https://github.com/aziontech/webkit/blob/main/.specs/stats-band.json)

## When to use

- To state reach, scale or results in three to five figures right after a hero or a claim.

## Do

- Keep `value` short and the unit in `suffix`, so the figure reads at a glance.
- Three to five items; more than that and the figures stop reading as a band.

## Don’t

- For figures that need a quote or a logo beside them → use `network-section` or `logo-wall-quote`.
- For a single figure inside another band → use `big-numbers` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [big-numbers](big-numbers.md) — the figure row this band frames.
- [network-section](network-section.md) — the band that pairs claims with client outcomes.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `StatsBandItem[]` | `[]` | false | The figures rendered as cells, in order; each item is `{ value, label, prefix?, suffix? }` where `value` is the figure, `label` its caption, and `prefix` / `suffix` the qualifier and unit set beside it. |

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing — a proof band with nothing to prove is absent from the page

## Accessibility

- Visible focus: nothing in the band is interactive.
- Keyboard map: none.
- ARIA: the band is a plain `div`; the figures' semantics (each figure paired with its caption) belong to `big-numbers`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `big-numbers`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — not applicable, nothing is interactive.

## Examples

### Default

```vue
<script setup>
  import StatsBand from '@aziontech/webkit/stats-band'
</script>

<template>
  <StatsBand
    :items="[
      { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
      { value: '24', suffix: '/7', label: 'Support on every plan' },
      { value: '99.99', suffix: '%', label: 'Availability, contractual' }
    ]"
  />
</template>
```
