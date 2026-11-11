# Big Numbers

> A band of headline figures — throughput, uptime, points of presence — set in the display face at big-number scale, each in its own cell of a hairline `card-grid` with a short caption underneath. It is the proof band of a marketing page: the one place a page states its numbers, between a `section-title` and the section body.

- Import: `import BigNumbers from '@aziontech/webkit/big-numbers'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [big-numbers.json](https://github.com/aziontech/webkit/blob/main/.specs/big-numbers.json)

## When to use

- To state a handful of measured facts (2–6) as the proof band of a marketing or landing page.
- Whenever the figure itself is the message and the caption only names what was measured.
- Under a `section-title`, as the opening evidence of a section.

## Do

- The band draws no frame of its own: the rule and the corner marks belong to the `section-module` or `frame-box` that the page assembles it into, so a band placed in a framed column never lands a second hairline on the column's own.
- Keep the band to 2–6 figures: it reads as a row, and past six the cells stop being scannable.
- Put the unit in `suffix` and the qualifier in `prefix`, so the figure itself stays the largest, highest-contrast thing in the cell.
- Keep `label` to a few words — it is set at overline scale and is a caption, not a sentence.
- Round the figures. A band is a claim, not a readout; `99.99%` belongs here, `99.9873%` does not.
- Leave `size` at `medium` unless the band is the page's hero statement (`large`) or sits inside a denser section (`small`).

## Don’t

- For a single monetary amount → use `currency`, which owns the amount ladder and its symbol placement.
- For a plan's headline price inside a pricing card → use `card-pricing`.
- For tabular or comparable figures a reader will scan row by row → use `table`.
- For a label-and-value pair at body scale inside a card or list → use `item`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [section-title](section-title.md) — the framed section header this band usually sits under.
- [card-grid](card-grid.md) — the hairline grid the cells sit in; its `gap-px` seams are the rules between them.
- [currency](currency.md) — a monetary amount at three reading distances, with symbol handling.
- [card-pricing](card-pricing.md) — a plan card, where the headline figure is a price.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `BigNumberItem[]` | `[]` | false | The figures rendered as cells, in order; each item is `{ value, label, prefix?, suffix? }` where `value` is the figure, `label` its caption, and `prefix` / `suffix` the qualifier and unit set beside it. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; picks the big-number scale the figures are set at. |

## States

- Visual states: `default`
- `data-size` mirrors the `size` prop and drives the figure's type scale
- Empty: when `items` is empty the band renders no cells and draws no frame — a marketing proof band with nothing to prove is absent from the page, not an `empty-state`

## Accessibility

- Visible focus: not applicable — the band is static copy and holds no interactive control.
- Keyboard map: none of its own; the band contains no focusable element and is skipped by `Tab`.
- ARIA: each cell is a `<figure>` whose `<figcaption>` carries the caption, so the figure and what it measures are one unit for a screen reader; `prefix` and `suffix` are plain spans inside the figure's text, so the announced value is the whole expression.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the figure is `var(--text-default)` (17.65:1 light, 20.12:1 dark) and the accent prefix `var(--text-primary)` (`primary-700` in light, `primary-500` in dark) is large text (5.5:1 or more light, 6.71:1 dark). The caption is `var(--text-muted)` at overline scale — 5.32:1 on the dark canvas, but **3.78:1 on the light canvas, under AA for normal text**. This is a system-wide property of `--text-muted`, not of this component; it is carried as a theme-level follow-up and is not worked around here with an off-token colour.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive target.
- Reflow: the figure row wraps (`flex-wrap`), so the prefix and the suffix move under the value when a cell is narrow, and the value itself breaks (`wrap-anywhere`) rather than overflow at 200% zoom.

## Examples

### Default

```vue
<script setup>
  import BigNumbers from '@aziontech/webkit/big-numbers'
</script>

<template>
  <BigNumbers
    :items="[
      { value: '120', suffix: '+', label: 'Points of presence' },
      { value: '99.99', suffix: '%', label: 'Availability' },
      { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
      { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
    ]"
  />
</template>
```

### Sizes

```vue
<script setup>
  import BigNumbers from '@aziontech/webkit/big-numbers'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <BigNumbers
      size="small"
      :items="[
        { value: '120', suffix: '+', label: 'Points of presence' },
        { value: '99.99', suffix: '%', label: 'Availability' },
        { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
        { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
      ]"
    />
    <BigNumbers
      size="medium"
      :items="[
        { value: '120', suffix: '+', label: 'Points of presence' },
        { value: '99.99', suffix: '%', label: 'Availability' },
        { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
        { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
      ]"
    />
    <BigNumbers
      size="large"
      :items="[
        { value: '120', suffix: '+', label: 'Points of presence' },
        { value: '99.99', suffix: '%', label: 'Availability' },
        { prefix: '<', value: '15', suffix: 'ms', label: 'Median latency' },
        { value: '4.5', suffix: 'Tbps', label: 'Network capacity' }
      ]"
    />
  </div>
</template>
```
