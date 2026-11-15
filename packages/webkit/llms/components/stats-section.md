# Stats Section

> The proof-by-numbers band of a marketing page: a framed row of big figures, each with its caption and optional prefix or unit. It is a page section — the site places it from a `{ _id: 'stats-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `registration-frame` and `stats`, which owns the figures' scale and layout.

- Import: `import StatsSection from '@aziontech/webkit/stats-section'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [stats-section.json](https://github.com/aziontech/webkit/blob/main/.specs/stats-section.json)

## When to use

- Use StatsSection for a band of proof figures placed from page JSON.
- Rendering page JSON, or you need a whole band with no custom content → the section (`stats-section`). Building an SFC by hand, needing slots, or nesting inside another band → the primitive (`stats`).
- To state reach, scale or results in three to five figures right after a hero or a claim.

## Do

- Keep `value` short and the unit in `suffix`, so the figure reads at a glance.
- Three to five items; more than that and the figures stop reading as a band.

## Don’t

- For figures that need a quote or a logo beside them → use `network-section` or `logo-wall-section`.
- For a single figure inside another band → use `stats` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [stats](stats.md) — the figure row this band frames.
- [network-section](network-section.md) — the band that pairs claims with client outcomes.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `StatsSectionItem[]` | `[]` | false | The figures rendered as cells, in order; each item is `{ value, label, prefix?, suffix? }` where `value` is the figure, `label` its caption, and `prefix` / `suffix` the qualifier and unit set beside it. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing — a proof band with nothing to prove is absent from the page

## Accessibility

- Visible focus: nothing in the band is interactive.
- Keyboard map: none.
- ARIA: the band is a plain `div`; the figures' semantics (each figure paired with its caption) belong to `stats`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `stats`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — not applicable, nothing is interactive.

## Right-to-left

- Layout: logical utilities only; the figure row follows the direction as `stats` lays it out.
- Icons: none.
- Keyboard: nothing is interactive.
- User data: none.

## Internationalization

No built-in strings: every visible and announced text is a prop from the page JSON.

- Formatting: none.

## Responsive

- Container queries: none of its own; `stats` owns how the figures wrap.
- Narrow (below `md`): the figures stack as `stats` stacks them; the frame rules stay full width.
- Touch: nothing is interactive.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import StatsSection from '@aziontech/webkit/stats-section'
</script>

<template>
  <StatsSection
    :items="[
      { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
      { value: '24', suffix: '/7', label: 'Support on every plan' },
      { value: '99.99', suffix: '%', label: 'Availability, contractual' }
    ]"
  />
</template>
```
