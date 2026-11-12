# Card Grid

> The responsive cell grid of the page language, in three registers: spaced cards separated by real gutters, a hairline box grid whose internal rules are the gaps themselves, and a framed grid whose cells are real `frame-box` elements. The `frame` register is the one that composes: each `CardGrid.Cell` draws its own rules and corner marks and carries its own fill, so the grid needs no background trick and nests flush inside a column that already owns the outer edges.

- Import: `import CardGridRoot from '@aziontech/webkit/card-grid-root'`
- Compound import (dot notation, not tree-shakeable): `import CardGrid from '@aziontech/webkit/card-grid'`
- Category: marketing · Surface: marketing · Structure: composition
- API as JSON: [card-grid.json](https://github.com/aziontech/webkit/blob/main/.specs/card-grid.json)

## When to use

- For a row or block of equal cells that should fan out from one column on a phone to several on a wide screen.
- With `kind` set to `frame` whenever the cells are real content — a `topic`, a claim, a figure — and should carry the page's frame language, corner marks included.
- For the hairline cell grid a `section-module` body holds, with `kind` set to `divider`.
- For a row of self-contained cards with gutters between them, with the default `gap`.

## Do

- **Do** hand the grid however many cells the content has. The default `balanced` layout fills every row: it takes the fewest rows `columns` allows, makes each row as narrow as that row count permits, and lets a short last row split the width evenly. Under `columns: 3` that is 1 → one full-width cell, 2 → halves, 3 → thirds, 4 → 2 × 2, 5 → 3 + 2, 6 → 3 + 3, 7 → 3 + 3 + 1; under `columns: 4`, 4 → four across, 5 → 3 + 2, 6 → 3 + 3, 7 → 4 + 3. Below `lg` the same rule runs against two columns (`sm`) and against `mobileColumns` (phone), so 4 cells are 2 × 2 on a tablet and four across from `lg`.
- **Don't** pick `columns` from the item count, pad the list with placeholder cells, or leave a trailing empty cell: a framed or divided grid with an empty cell reads as a missing card. `columns` is the most a row may hold, not how many it must.
- **Don't** reach for `layout="fixed"` to fix a count: keep it for tiles whose width must not change from row to row — square logo tiles, a cell that spans rows (`use-cases`), a wall that overrides the track count. Anything else that wants unequal cells belongs in `bento-grid`.
- Prefer `frame` over `divider` for new work. The hairline register depends on every child filling its own background; the framed register draws real rules, so a cell that forgets its fill still reads correctly, and the corner marks come with it.
- Give every child of a `divider` grid its own background fill, or the gap trick has nothing to show through and the whole band goes the colour of the rule.
- Leave the perimeter to the container: the `divider` register draws no outer border, and a `frame` grid set to `flush` withholds its own top and left rules so a surrounding `frame-box` keeps one hairline per edge.
- Let the grid draw the rules. Do not add borders inside a `frame` cell, or the shared edges double.
- Give a cell `kind="none"` and `:padded="false"` when its own content paints the cell — a media layer, a brand fill, or a link that must be the whole tile.
- Reach for `mobileColumns` of `2` only for short, glyph-led cells; a cell carrying a description reads better one-up on a phone.

## Don’t

- For a mosaic whose cells claim different numbers of columns and rows → use `bento-grid`, which is this grid with spans.
- For a single framed box → use `frame-box`.
- For one card with a header, content and footer → use `card`.
- For the band that wraps the grid → use `section-module`.
- For tabular data a reader scans row by row → use `table`.
- Built to be personalized (style seam): any class is accepted on the tag.

## Related

- [bento-grid](bento-grid.md) — the same framed grid with unequal cells; reach for it when one claim deserves more room than the rest.
- [topic](topic.md) — the glyph, headline and sentence a `frame` cell usually holds.
- [section-module](section-module.md) — the band whose body holds this grid.
- [section-container](section-container.md) — the column whose vertical rules the `divider` and flush `frame` grids deliberately do not repeat.
- [frame-box](frame-box.md) — the frame each `frame` cell is drawn with, and the framed box a `gap` cell may be built from.
- [card](card.md) — a padded card surface, the usual child of a `gap` grid.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `CardGridKind` | `'gap'` | false | Register of the grid: gutters between self-contained cards, hairline rules drawn by the gaps, or framed cells that draw their own rules and marks. |
| `columns` | `CardGridColumns` | `3` | false | How many columns the grid fans out to at the large breakpoint. |
| `mobileColumns` | `CardGridMobileColumns` | `1` | false | How many columns the grid holds below the small breakpoint. |
| `dividerColor` | `CardGridDividerColor` | `'default'` | false | Weight of the hairline rules in the `divider` register. |
| `flush` | `boolean` | `false` | false | In the `frame` register, the surrounding frame already draws the grid's outer rules: the grid drops its own top and left ones and lays its right and bottom ones onto the frame's, so a framed column keeps one hairline per edge. |
| `layout` | `CardGridLayout` | `'balanced'` | false | How the cells fill the rows: `balanced` keeps every row full — the fewest rows `columns` allows, each as narrow as that row count permits, with a short last row sharing the width evenly, so no cell is left empty; `fixed` keeps a strict `columns`-wide grid and leaves the last row's unused tracks empty. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The cells, in reading order. In the `frame` register they are `CardGrid.Cell` elements; in the `divider` register each cell fills its own background. |

## Sub-component imports

- `@aziontech/webkit/card-grid-cell`

## Sub-components

- `card-grid-cell/card-grid-cell.vue` — one cell of the `frame` register; wraps `frame-box` so the cell owns its own rules and corner marks, and takes the fill it carries (`kind`) and whether it pads its content (`padded`). It claims exactly one column — a cell that claims more belongs in `bento-grid`.

Cell props: `kind` (`'surface' | 'canvas' | 'none'`, default `'surface'`) — the cell's fill, where `none` leaves the surface to the composed content; `padded` (`boolean`, default `true`) — off for a cell whose content reaches its edges.

The cell's `frame-box` is set `flush` on its top and left edges, so it draws only its right and bottom rules; the grid root draws the matching top and left ones. That is what gives the block one hairline per edge instead of two at every junction.

The compound `index.ts` annotates the `Object.assign` result with an explicit `typeof CardGrid & { Cell: typeof CardGridCell }` type. Without it, declaration emit expands the root's private `Props` interface and `vue-tsc` fails with TS4082 ("default export of the module has or is using private name"). Do not simplify it back to a bare `Object.assign`.

## States

- Visual states: `default`
- `data-kind` carries the register
- `data-columns` carries the large-breakpoint column count
- `data-mobile-columns` carries the small-breakpoint column count
- `data-divider-color` carries the hairline weight
- `data-flush` mirrors `flush`, and is what withholds the `frame` grid's own outer rules
- `data-layout` mirrors `layout`; `data-count` carries how many cells render (comments and empty text are not cells)
- In `balanced`, the root sets `--card-grid-cols-base`, `--card-grid-cols-sm` and `--card-grid-cols-lg` to the row width each breakpoint resolves to, and lays the cells out as a wrapping row whose cells grow to fill it; every direct child is set to `height: auto` so it stretches to its row (a child's own `h-full` would not resolve in a wrapping row and would leave the `divider` rule showing under a shorter cell); the counts come from the render, so the server HTML and the hydrated page lay out the same
- `data-filled` mirrors whether any cell renders, so an empty `frame` grid draws no stray rules
- `data-kind` and `data-padded` on each cell's content box mirror its fill and its padding
- Empty: a `frame` grid with no cells renders no rules, so an unfilled grid leaves no empty frame on the page

## Accessibility

- Visible focus: not applicable — the grid and its cells are containers; controls composed into a cell keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the grid is not focusable; `Tab` order follows the cells in DOM order, which is reading order at every breakpoint.
- ARIA: the root adds no role, so a list composed into it keeps its own semantics and the cells reach the accessibility tree unchanged; a cell adds no role either, so headings composed inside it keep the document outline the page intends.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the rules are non-informational decoration; a `frame` cell provides `var(--bg-surface)` or `var(--bg-canvas)`, and a `kind="none"` cell hands both the fill and its contrast to the composed content.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control of its own.

## Examples

### Default

```vue
<script setup>
  import CardGrid from '@aziontech/webkit/card-grid'
</script>

<template>
  <CardGrid :columns="3">
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">One</div>
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">Two</div>
    <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">Three</div>
  </CardGrid>
</template>
```

### Kinds

```vue
<script setup>
  import CardGrid from '@aziontech/webkit/card-grid'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <CardGrid
      kind="gap"
      :columns="3"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">gap</div>
    </CardGrid>
    <CardGrid
      kind="divider"
      :columns="3"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">divider</div>
    </CardGrid>
    <CardGrid
      kind="frame"
      :columns="3"
    >
      <CardGridCell kind="canvas">frame</CardGridCell>
      <CardGridCell kind="canvas">frame</CardGridCell>
      <CardGridCell kind="canvas">frame</CardGridCell>
    </CardGrid>
  </div>
</template>
```

### Columns

```vue
<script setup>
  import CardGrid from '@aziontech/webkit/card-grid'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <CardGrid
      kind="divider"
      :columns="2"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">1</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">2</div>
    </CardGrid>
    <CardGrid
      kind="divider"
      :columns="4"
    >
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">1</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">2</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">3</div>
      <div class="bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)">4</div>
    </CardGrid>
  </div>
</template>
```
