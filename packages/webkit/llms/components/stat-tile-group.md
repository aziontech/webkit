# Stat Tile Group

> One card split into cells, one `StatTile` per cell: the KPI strip at the top of an overview (data transferred, requests per second, bandwidth saving, data offload). The group draws the card (surface, border, radius) and the grid; each tile inside it drops its own card and draws its end and bottom edges as the dividers, with its delta aligned to the end of the figure row. The cells sit one per row in a narrow box, two per row from the group's `@md`, and all in one row from its `@3xl`.

- Import: `import StatTileGroup from '@aziontech/webkit/stat-tile-group'`
- Category: chart · Surface: product · Structure: monolithic
- API as JSON: [stat-tile-group.json](https://github.com/aziontech/webkit/blob/main/.specs/stat-tile-group.json)

## When to use

- The usage or KPI row of an overview, where the figures read as one band.
- Two to six related figures for the same period.

## Do

- Put only `StatTile`s in the default slot, in reading order.
- Name the strip with `ariaLabel` when the page has more than one (`Usage`, `Traffic`).
- Give every tile in a strip the same `kind` and the same period.
- Prefer four cells: they fill one row on a desktop and two rows of two on a tablet.
- Next to a taller card in a row (a dashboard's usage band beside a chart), let the row stretch the group: it fills the height and the cells grow with it. Do not pin a height. Inside a wrapper element, give the group `h-full` (or make the wrapper a flex column) so the stretch reaches it.

## Don’t

- Figures that stand alone or carry their own sparkline history at different periods → separate `StatTile`s in a grid.
- Marketing figures on a site band → use `big-numbers`.
- Label/value details of one resource → use `key-value-pairs`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [stat-tile](stat-tile.md) — the cell; the group changes its chrome through an injected context, so the tiles take no extra prop.
- [card](card.md) — a plain surface; do not hand-build a strip by putting tiles in a `Card` grid.
- [key-value-pairs](key-value-pairs.md) — static label/value details.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name of the strip, such as Usage; empty leaves the group unnamed. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The StatTile cells, in reading order. |

## States

- Visual states: `default` only; loading and empty are each tile's own (`loading`, a null `value`).
- The group provides an injected context (`StatTileGroupInjectionKey`); a `StatTile` inside it sets `data-grouped`, drops its border, radius and surface, and draws `border-e` + `border-b` as dividers. The inner grid is pulled out by `-me-px -mb-px` and the root clips it (`overflow-hidden`), so the last column's end edge and the last row's bottom edge fall under the card border and every column count gets correct dividers with no `nth-child` rules.
- Not applicable: `disabled`, `readonly`, `invalid`, `open`/`closed`, `error`.

## Accessibility

- Pattern: a `role="group"` container named by `ariaLabel` when set; each cell stays a `StatTile` `<section>` named by its label, so the reading order is the slot order.
- Keyboard map: none of its own; focusable content inside the tiles (an info `Tooltip` in `aside`) keeps its own.
- Dividers are borders, not content; they carry no meaning.
- Contrast: the divider and card border use `--border-default`, the same as a separate tile.

## Right-to-left

- Layout: logical utilities only (`-me-px`, `border-e`), so the dividers sit between the cells under `dir="rtl"` too.
- Icons: none.
- Keyboard: no arrow keys.
- User data: none.

## Internationalization

| Key    | English source | Override prop |
| ------ | -------------- | ------------- |
| _none_ | —              | —             |

- No built-in strings: the name comes from `ariaLabel`; the tiles carry their own.

## Responsive

- Container queries: the root is the `@container/stat-tile-group`; one cell per row below its `@md`, two per row from `@md`, every cell in one row (`grid-flow-col auto-cols-fr`) from `@3xl`.
- Height: the root is a flex column and the cell grid is `flex-1`, so when a grid or flex row stretches the group to a taller neighbour, the cell rows share the extra height instead of leaving an empty band under them.
- Touch: no targets of its own.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the cells stack.

## Examples

### Default

```vue
<script setup>
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
</script>

<template>
  <StatTileGroup aria-label="Usage">
    <StatTile
      label="Data transferred"
      :value="842"
      unit="GB"
      :delta="12.4"
    />
    <StatTile
      label="Requests / second"
      :value="1240"
      unit="/s"
      :delta="3.8"
    />
    <StatTile
      label="Bandwidth saving"
      :value="588"
      unit="GB"
      :delta="6.2"
    />
    <StatTile
      label="Data offload"
      :value="70"
      unit="%"
      :delta="-1.5"
      inverse
    />
  </StatTileGroup>
</template>
```

### BesideCard

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
</script>

<template>
  <div class="@container w-full">
    <div class="grid gap-(--layout-group-gap) @3xl:grid-cols-[2fr_1fr]">
      <StatTileGroup aria-label="Usage">
        <StatTile
          label="Data transferred"
          :value="842"
          unit="GB"
          :delta="12.4"
        />
        <StatTile
          label="Requests / second"
          :value="1240"
          unit="/s"
          :delta="3.8"
        />
        <StatTile
          label="Bandwidth saving"
          :value="588"
          unit="GB"
          :delta="6.2"
        />
        <StatTile
          label="Data offload"
          :value="70"
          unit="%"
          :delta="-1.5"
          inverse
        />
      </StatTileGroup>
      <Card title="Next steps">
        <template #content>
          <ul
            class="flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-md) text-body-sm text-(--text-muted)"
          >
            <li>Add a custom domain to the workload.</li>
            <li>Turn on the web application firewall.</li>
            <li>Invite a teammate to the account.</li>
            <li>Set a usage alert for data transferred.</li>
            <li>Connect a repository to deploy on push.</li>
            <li>Review the cache settings of the application.</li>
          </ul>
        </template>
      </Card>
    </div>
  </div>
</template>
```
