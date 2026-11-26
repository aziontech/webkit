# Bar List

> Use BarList for a ranked top-N breakdown inside a chart card; a list of mixed rows with actions is Item rows. A ranked list of named values: each row is a tinted bar whose length is the value against the largest one, with the name inside the bar and the formatted value in a right-aligned column. It reads as a list, not a chart — no axes, no grid — so it suits top-N breakdowns inside a card, where a horizontal `chart` would spend its width on an axis gutter.

- Import: `import BarList from '@aziontech/webkit/bar-list'`
- Category: chart · Surface: app · Structure: monolithic
- API as JSON: [bar-list.json](bar-list.json)

## When to use

- Top-N breakdowns inside a card: top paths, top countries, top user agents, top rules triggered.
- A ranking where the name matters as much as the size, and names are long enough to need the bar's full width.
- Rows that lead somewhere — a filtered view of that path or country — via `href` or `item-click`.

## Do

- Keep it to about ten rows; fold the tail into an "Other" row in the data rather than scrolling.
- Leave `sort` on `descending` for rankings; use `none` only when the order itself carries meaning (pipeline steps, weekdays).
- Pass the same `formatValue` as the chart beside it so a number reads the same in both.
- Give interactive rows a destination the user expects — a filtered view of that item — not a detail drawer of the whole list.

## Don’t

- Several series per category, or values over time → use `chart`.
- A share of a whole where the parts sum to 100% → use `donut-chart`.
- One value against a limit (quota, usage) → use `progress`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [chart](chart.md) — horizontal bars with an axis, for comparing several series per category.
- [donut-chart](donut-chart.md) — the share view of the same breakdown when the parts sum to a whole.
- [chart-card](chart-card.md) — the box a BarList sits in on a dashboard.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `BarListItem[]` | `[]` | false | Rows to rank; each item is `{ id?: string; name: string; value: number; href?: string }`. An item with `href` renders as a link. |
| `sort` | `'descending' \| 'ascending' \| 'none'` | `'descending'` | false | Row order; `none` keeps the order of `items`. |
| `color` | `ChartColor` | `1` | false | Hue of the bars: a categorical slot (1–8), `other`, or a status. The fill is that hue tinted over the surface. |
| `clickable` | `boolean` | `false` | false | Renders rows without an `href` as buttons that emit `item-click`. |
| `formatValue` | `(value: number) => string` | `formatCompact` | false | Formats the value column. |
| `loading` | `boolean` | `false` | false | Renders Skeleton rows in place of the list. |
| `refetching` | `boolean` | `false` | false | Holds the previous rows at reduced opacity while new data loads (the same as `chart`). |
| `error` | `string` | `''` | false | Error message; when set, the list renders an error state in an `alert` region instead of rows: a bordered small `EmptyState` with the error mark, `barList.errorTitle` and the message (the `error` slot replaces it). |
| `emptyTitle` | `string` | `''` | false | Title of the empty state shown when `items` is empty. Empty uses the locale catalog (`No data available`). |
| `emptyDescription` | `string` | `''` | false | Supporting line under the empty title: why the list is empty, or what to do next. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `item-click` | `(event: MouseEvent, item: BarListItem)` | A row activated — a clickable row, or a link row (the link still navigates). `item` is the consumer's own item object. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `empty` | — | Replaces the default `EmptyState` shown when `items` is empty. |
| `empty-actions` | — | Actions under the default empty state (a Clear filters or Retry). |
| `error` | — | Replaces the default error state shown while `error` is set. |

## States

- Visual states: `default`, `hover` and `focus-visible` (interactive rows only), `loading` (Skeleton rows), `refetching` (previous rows at 60% opacity), `error` (error state in an `alert` region), `empty` (`EmptyState`). Precedence: loading, then error, then empty.
- `data-loading` mirrors `loading`; `data-refetching` mirrors `refetching`; `data-error` is set while an error shows
- `data-interactive` on a row that is a link or a button
- Bar width: `value / max`, at least 2% when the value is above zero, 0 when it is zero

- Its root carries `data-plain-ground`: it is content that must sit on a plain ground, so a `Texture` beside it hides itself, and the texture-backdrop check blocks placing it on a textured band (a texture is a backdrop for text only, RV-T2-1).

## Accessibility

- The root is an `<ol>` named by `ariaLabel`; each row is an `<li>` whose text reads "name, value" in order. The bar is decorative.
- A link row is a native `<a>`; a clickable row is a native `<button>`; a static row is neither, and is not focusable.
- Keyboard map: Tab moves between interactive rows; Enter activates (Space too on buttons).
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-surface)` on interactive rows (the offset takes the surface color, so it never shows as a white gap in the dark theme).
- `aria-busy` on the root while `loading` or `refetching`.
- Name and value text clear 4.5:1 on the tinted fill and on the bare surface in both themes.
- The bar is underlined by a 2px rule in the full hue along its bottom edge (a solid mark, APCA Lc 30 or more on the surface in both themes), so the length reads in dark, where the tint alone stays under the mark target, and the rule never crosses the row label the way an inline-end cap did on short bars. The name and the value are `dir="auto"`, so a path or a number keeps its own order in right-to-left.
- Interactive rows are 32px tall and full width; a transparent hit area (`before:` pseudo-element, 4px above and below) makes the pointer target 40px without changing the look.
- Forced colors: the bar fill keeps its colour (`forced-color-adjust: none`); forced to `Canvas` it vanished and left only the labels (`src/test/forced-colors-charts.test.ts`).

## Examples

### Default

```vue
<script setup>
  import BarList from '@aziontech/webkit/bar-list'

  const items = [
    { name: '/home', value: 843 },
    { name: '/documentation', value: 384 },
    { name: '/blocks', value: 108 },
    { name: '/imprint', value: 46 },
    { name: '/cancellation', value: 3 }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <BarList
      aria-label="Top paths"
      :items="items"
    />
  </div>
</template>
```

### Interactive

```vue
<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import { ref } from 'vue'

  const items = [
    { name: '/home', value: 843 },
    { name: '/documentation', value: 384 },
    { name: '/blocks', value: 108 },
    { name: '/imprint', value: 46 },
    { name: '/cancellation', value: 3 }
  ]

  const linkedItems = items.map((item) => ({
    ...item,
    href: `#/analytics?path=${item.name}`
  }))

  const selected = ref('none')

  const onItemClick = (event, item) => {
    selected.value = item.name
  }
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-(--spacing-xl) md:grid-cols-2">
    <BarList
      aria-label="Top paths, linked"
      :items="linkedItems"
    />
    <div class="flex flex-col gap-(--spacing-sm)">
      <BarList
        aria-label="Top paths"
        :items="items"
        clickable
        @item-click="onItemClick"
      />
      <p class="text-body-sm text-(--text-muted)">Selected: {{ selected }}</p>
    </div>
  </div>
</template>
```

### Loading

```vue
<script setup>
  import BarList from '@aziontech/webkit/bar-list'
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <BarList
      aria-label="Top paths"
      loading
    />
  </div>
</template>
```
