# Bento Grid

> A mosaic of unequal cells on one set of shared rules: each cell claims a number of columns and rows, and the rules between them are drawn once so the whole block reads as a single framed surface. It is the layout a marketing page uses when several claims deserve different amounts of room — the alternative to a row of identical tiles.

- Import: `import BentoGridRoot from '@aziontech/webkit/bento-grid-root'`
- Compound import (dot notation, not tree-shakeable): `import BentoGrid from '@aziontech/webkit/bento-grid'`
- Category: marketing · Surface: marketing · Structure: composition
- API as JSON: [bento-grid.json](https://github.com/aziontech/webkit/blob/main/.specs/bento-grid.json)

## When to use

- When a set of claims is genuinely unequal and one or two deserve more room than the rest.
- As the framed body of a product or platform section, under a `section-title`.
- For a logo wall, a client-story band, or any set where a few members carry a headline and the rest carry only a mark.
- Whenever the cells hold composed content — copy, media, a control — rather than one repeated shape.

## Do

- Size the mosaic so the cells fill the rectangle: count the tracks (`columns` × rows) and check the spans add up, or the grid ends on a gap of bare canvas.
- Keep cells in reading order — the grid auto-places in DOM order, so that order is what a screen reader and a keyboard follow, and it is what puts a cell in the track you meant.
- Compose real elements inside a cell rather than passing a config array; the cell is a slot, and that is the point of it.
- Let the grid draw the rules. Do not add borders inside a cell, or the shared edges double.
- Give a cell `kind="none"` + `padded="false"` when its own content paints the cell — a media layer, a brand fill, or a link that must be the whole tile.
- Inside a framed page column, set `flush` so the column's rules stay one hairline each.

## Don’t

- When every claim carries the same weight → use `card-grid`.
- For a row of measured figures → use `big-numbers`, which already draws this grid for numbers.
- For a single copy-and-media pairing → use `media-split`.
- For a list of questions → use `faq`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card-grid](card-grid.md) — the equal-cell grid with no spans, in the gap or divider register.
- [big-numbers](big-numbers.md) — the same collapsed-rule grid, specialised for figures.
- [media-split](media-split.md) — the two-column band when there is one claim, not several.
- [frame-box](frame-box.md) — the frame each cell is drawn with.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the grid, when the surrounding section does not already name it. |
| `columns` | `BentoGridColumns` | `2` | false | How many columns the mosaic lays out from the medium breakpoint up. |
| `mobileColumns` | `BentoGridMobileColumns` | `1` | false | How many columns the mosaic holds below the medium breakpoint, where every cell claims one of them. |
| `flush` | `boolean` | `false` | false | The surrounding frame already draws the grid's outer rules: the grid drops its own top and left ones and lays its right and bottom ones onto the frame's, so a framed column keeps one hairline per edge. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The grid's cells, composed as `BentoGrid.Cell` elements in reading order. |

## Sub-component imports

- `@aziontech/webkit/bento-grid-cell`

## Sub-components

- `bento-grid-cell/bento-grid-cell.vue` — one cell of the mosaic; owns its own frame, and takes the tracks it claims (`span`, `rows`), the fill it carries (`kind`) and whether it pads its content (`padded`).

Cell props: `span` (`'1' | '2' | '3' | '4' | 'full'`, default `'1'`) — columns claimed from the medium breakpoint up; `rows` (`'1' | '2'`, default `'1'`) — rows claimed from the medium breakpoint up; `kind` (`'surface' | 'canvas' | 'none'`, default `'surface'`) — the cell's fill, where `none` leaves the surface to the composed content; `padded` (`boolean`, default `true`) — off for a cell whose content reaches its edges.

The compound `index.ts` annotates the `Object.assign` result with an explicit `typeof BentoGrid & { Cell: typeof BentoGridCell }` type. Without it, declaration emit expands the root's private `Props` interface and `vue-tsc` fails with TS4082 ("default export of the module has or is using private name"). Do not simplify it back to a bare `Object.assign`.

## States

- Visual states: `default`
- `data-columns` and `data-mobile-columns` on the grid mirror the track counts it lays out at each breakpoint
- `data-flush` on the grid mirrors `flush`, and is what withholds its own outer rules
- `data-span` and `data-rows` on each cell mirror its props and drive the tracks it claims from `md` up
- `data-kind` and `data-padded` on the cell's content box mirror its fill and its padding
- Below `md` every cell claims one of the mobile columns — only `span="full"` still takes the whole row — and no cell claims a second row
- Empty: a grid with no cells renders no rules, so an unfilled grid leaves no empty frame on the page

## Accessibility

- Visible focus: the grid and its cells are containers and are not focusable; controls composed inside a cell keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` follows DOM order through whatever the cells contain. The grid is not a composite widget, so it declares no arrow-key model.
- ARIA: the grid is a plain container named by `ariaLabel` when set; cells add no role, so headings composed inside them keep the document outline the page intends.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the cells provide `var(--bg-surface)` or `var(--bg-canvas)`; a `kind="none"` cell hands both the fill and its contrast to the composed content.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the grid is static.
- Touch target ≥40×40 px — not applicable; the grid holds no interactive target of its own.

## Examples

### Default

```vue
<script setup>
  import BentoGridCell from '@aziontech/webkit/bento-grid-cell'
  import BentoGridRoot from '@aziontech/webkit/bento-grid-root'
</script>

<template>
  <BentoGridRoot aria-label="Platform capabilities">
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Deploy in seconds</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Push to a repository and the application is live at every location, with no pipeline to
        assemble first.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Scale without capacity planning</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Traffic is absorbed where it arrives, so there is no region to size and nothing to provision
        ahead of a launch.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Observe every request</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Real-time events and metrics land in the same console that runs the application, without a
        second tool to wire up.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Pay for what you use</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Billing follows requests and compute time, so an idle application costs nothing to keep
        running.
      </p>
    </BentoGridCell>
  </BentoGridRoot>
</template>
```

### Spans

```vue
<script setup>
  import BentoGridCell from '@aziontech/webkit/bento-grid-cell'
  import BentoGridRoot from '@aziontech/webkit/bento-grid-root'
</script>

<template>
  <BentoGridRoot aria-label="Platform capabilities">
    <BentoGridCell span="full">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Everything runs at the edge</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Every request is served from the location closest to the user, so there is no origin round
        trip to plan around and no region to choose.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Deploy in seconds</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Push to a repository and the application is live, with no pipeline to assemble first.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Scale without capacity planning</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Traffic is absorbed where it arrives, so there is nothing to provision ahead of a launch.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Observe every request</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Events and metrics land in the same console that runs the application.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Pay for what you use</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Billing follows requests and compute time, so an idle application costs nothing.
      </p>
    </BentoGridCell>
  </BentoGridRoot>
</template>
```

### Mosaic

```vue
<script setup>
  import BentoGridCell from '@aziontech/webkit/bento-grid-cell'
  import BentoGridRoot from '@aziontech/webkit/bento-grid-root'
</script>

<template>
  <BentoGridRoot
    columns="4"
    mobile-columns="2"
    aria-label="The platform, in one block"
  >
    <BentoGridCell
      span="2"
      rows="2"
    >
      <div class="flex h-full flex-col justify-between gap-(--spacing-xl)">
        <h3 class="m-0 text-heading-md text-(--text-default)">Everything runs at the edge</h3>
        <p class="m-0 text-body-md text-(--text-muted)">
          Every request is served from the location closest to the user, so there is no origin round
          trip to plan around and no region to choose. The cell claims two columns and two rows,
          which is what makes it the block's subject.
        </p>
      </div>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Deploy in seconds</h3>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">No capacity planning</h3>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Observe every request</h3>
    </BentoGridCell>
    <BentoGridCell
      rows="2"
      kind="none"
      :padded="false"
    >
      <a
        href="#pricing"
        class="flex h-full flex-col justify-between gap-(--spacing-lg) bg-(--bg-contrast) p-(--spacing-xl) text-(--bg-canvas) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
      >
        <span class="text-heading-xs">Pay for what you use</span>
        <span class="text-body-sm"
          >An unpadded cell with no fill of its own: the link inside it paints the whole tile and
          carries its own padding, so the target is the cell.</span
        >
      </a>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">One console</h3>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Logs in real time</h3>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Rollback in one click</h3>
    </BentoGridCell>
  </BentoGridRoot>
</template>
```
