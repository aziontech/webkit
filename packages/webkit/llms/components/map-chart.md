# Map Chart

> Values by place on the dotted world map of `NetworkMap`: countries shaded on a five-step sequential scale (a choropleth on the dot grid) and locations drawn as bubbles whose area follows the value. One tab stop walks every place from the highest value down, with a tooltip, a polite announcement and a table twin, so nothing on the map needs a pointer. The country shapes are a lazy chunk; the map itself adds no dependency.

- Import: `import MapChart from '@aziontech/webkit/map-chart'`
- Category: chart · Surface: product · Structure: monolithic
- API as JSON: [map-chart.json](https://github.com/aziontech/webkit/blob/main/.specs/map-chart.json)

## When to use

- Requests, threats or bandwidth by country (Real-Time Metrics map card).
- Traffic by point of presence or by city, as bubbles.
- A regional view of either, framed with `view` (for example `south-america`).

## Do

- Pair the map with a ranked list or a table: the map shows where, the list shows how much.
- Pass ISO 3166-1 alpha-2 codes as region ids; names come from the locale (`Intl.DisplayNames`) unless you pass `name`.
- Keep region and point ids distinct: `v-model:activeId` holds one of them.
- Give points a status color only when the color means a state; otherwise leave the series slot.

## Don’t

- Ranking a handful of countries where the exact order matters → use `bar-list`; a map hides small countries.
- A decorative network backdrop with no data → use `network-map`.
- Values over time → use `chart`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [network-map](network-map.md) — the same dot grid as decoration in marketing and empty states.
- [bar-list](bar-list.md) — the ranked list that usually sits beside the map.
- [chart-card](chart-card.md) — the card a dashboard map sits in; the map takes its accessible name from the card title.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `regions` | `MapChartRegion[]` | `[]` | false | Countries shaded by value on a five-step sequential scale. |
| `points` | `MapChartPoint[]` | `[]` | false | Locations drawn as bubbles sized by value. |
| `view` | `'world' \| 'americas' \| 'north-america' \| 'south-america' \| 'europe' \| 'africa' \| 'asia' \| 'oceania'` | `'world'` | false | Part of the world the map frames. |
| `formatValue` | `(value: number) => string` | `formatCompact` | false | Formats values in the tooltip, legend and table. |
| `loading` | `boolean` | `false` | false | Renders a Skeleton sized to the map and suppresses interaction. |
| `refetching` | `boolean` | `false` | false | Holds the previous render at reduced opacity while new data loads. |
| `error` | `string` | `''` | false | Error message; when set, a danger Alert replaces the map. |
| `emptyTitle` | `string` | `''` | false | Title of the empty state shown when no region or point has a value. Empty uses the locale catalog (`No data available`). |
| `emptyDescription` | `string` | `''` | false | Supporting line under the empty title: why the range is empty, or what to do next. |
| `tableView` | `boolean` | `false` | false | Shows the data table in place of the map. The table is always present for assistive tech. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the map when it is not inside a ChartCard with a title. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `region-click` | `(event: MouseEvent \| KeyboardEvent, region: MapChartRegion)` | Click on a shaded country, or Enter / Space while it is active. |
| `point-click` | `(event: MouseEvent \| KeyboardEvent, point: MapChartPoint)` | Click on a bubble, or Enter / Space while it is active. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `empty` | — | Replaces the default EmptyState. |
| `empty-actions` | — | Actions under the default EmptyState, such as a Clear filters button. |
| `error` | — | Replaces the default danger Alert. |

## v-model

| Model              | Type             | Default | Emits             | Notes                                                    |
| ------------------ | ---------------- | ------- | ----------------- | -------------------------------------------------------- |
| `v-model:activeId` | `string \| null` | `null`  | `update:activeId` | The region or point under the pointer or keyboard focus. |

## States

- Visual states: `default`, `loading` (Skeleton at the map ratio), `error` (Alert), `empty` (EmptyState), `refetching`, `table-view`, `active` (a place is hovered or focused; the others dim)
- `data-loading`, `data-error`, `data-empty`, `data-refetching`, `data-table-view`, `data-active`, `data-view` on the root
- `data-geometry`: `loading` | `ready` while the country shapes chunk loads (only when `regions` is set)
- `data-bin` (0 to 4) on each shaded country; `data-entered` on marks after two animation frames
- Server render and hydration: the land, the bubbles, the legend and the table render on the server; the country shading appears after the shapes chunk loads on the client, so the first client render matches the server.

## Accessibility

- Root is a `<figure>`; the map is one tab stop: `role="group"` with `aria-roledescription="map"`, named by `ariaLabel` or the ChartCard title, described by a summary (`5 places on the map, 104K in total.`).
- Keyboard map: Right / Down move to the next place and Left / Up to the previous (countries first, then locations, each from the highest value), Home / End jump to the ends, Enter / Space fire `region-click` or `point-click`, Escape clears.
- A polite live region announces the active place and its value; the tooltip follows focus as it follows the pointer.
- A data table twin (name, value) is always rendered, visually hidden unless `tableView`.
- The SVG is `aria-hidden`; value never rests on color alone — the legend states the range, the tooltip and table give each value.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the map.
- `motion-reduce:transition-none` on every transition.

## Right-to-left

- Layout: geography is never mirrored; the legend and table follow the inline direction with logical utilities. The tooltip is placed in physical map coordinates (inline `left` plus translate), because SVG coordinates are physical.
- Icons: none.
- Keyboard: Left and Right swap under rtl (`logicalArrowKey`), so the key toward the inline end always moves to the next place.
- User data: names render as given.

## Internationalization

| Key                        | English source                                          | Override prop         |
| -------------------------- | ------------------------------------------------------- | --------------------- |
| `mapChart.emptyTitle`      | `No data available`                                     | `emptyTitle`          |
| `mapChart.roleDescription` | `map`                                                   | —                     |
| `mapChart.name`            | `Name`                                                  | —                     |
| `mapChart.value`           | `Value`                                                 | —                     |
| `mapChart.summary`         | `{count} places on the map, {total} in total.` (plural) | `ariaLabel` (caption) |
| `mapChart.legend`          | `From {min} to {max}`                                   | —                     |

- Formatting: `Intl.NumberFormat` compact values and `Intl.DisplayNames` (type `region`) country names, with the locale from `WebkitProvider`.

## Responsive

- Container queries: none: the map takes the container width at the framed region's aspect ratio.
- Narrow (≤ 640 px or a narrow container): the map scales down; the tooltip caps at `--container-3xs`.
- Touch: tapping a country or bubble activates it; every value is in the table twin and reachable from the keyboard.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import MapChart from '@aziontech/webkit/map-chart'

  const regions = [
    { id: 'BR', value: 48200 },
    { id: 'US', value: 31600 },
    { id: 'DE', value: 18900 },
    { id: 'IN', value: 15400 },
    { id: 'JP', value: 9800 },
    { id: 'MX', value: 7600 },
    { id: 'ZA', value: 4100 },
    { id: 'AU', value: 3900 }
  ]
</script>

<template>
  <MapChart
    :regions="regions"
    aria-label="Requests by country"
  />
</template>
```

### Points

```vue
<script setup>
  import MapChart from '@aziontech/webkit/map-chart'

  const points = [
    { id: 'sao-paulo', name: 'São Paulo', lat: -23.55, lon: -46.63, value: 18400 },
    { id: 'miami', name: 'Miami', lat: 25.76, lon: -80.19, value: 9200 },
    { id: 'frankfurt', name: 'Frankfurt', lat: 50.11, lon: 8.68, value: 12600 },
    { id: 'mumbai', name: 'Mumbai', lat: 19.07, lon: 72.88, value: 6100 },
    { id: 'tokyo', name: 'Tokyo', lat: 35.68, lon: 139.69, value: 8300 },
    { id: 'sydney', name: 'Sydney', lat: -33.87, lon: 151.21, value: 2700 }
  ]
</script>

<template>
  <MapChart
    :points="points"
    aria-label="Requests by point of presence"
  />
</template>
```

### View

```vue
<script setup>
  import MapChart from '@aziontech/webkit/map-chart'

  const regions = [
    { id: 'BR', value: 48200 },
    { id: 'AR', value: 9100 },
    { id: 'CO', value: 6800 },
    { id: 'CL', value: 5200 },
    { id: 'PE', value: 3100 }
  ]
  const points = [
    { id: 'sao-paulo', name: 'São Paulo', lat: -23.55, lon: -46.63, value: 18400, color: 2 },
    { id: 'buenos-aires', name: 'Buenos Aires', lat: -34.6, lon: -58.38, value: 4300, color: 2 }
  ]
</script>

<template>
  <MapChart
    :regions="regions"
    :points="points"
    view="south-america"
    aria-label="Requests in South America"
  />
</template>
```
