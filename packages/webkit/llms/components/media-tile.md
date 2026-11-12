# Media Tile

> One cell of a media band: a scene above, and under it a run-in caption whose lead names what the scene shows and whose sentence continues on the same line, so a row of tiles reads as one paragraph of claims under one row of panels. It comes in two registers. `frame` draws the page's frame language around the media alone — never around the copy — which is what lets the captions sit on the page column with no rules between them. `plain` draws no rules at all: the tile is itself the cell, filled and inset, for a `card-grid` in its `divider` register where the grid's own hairlines separate the columns.

- Import: `import MediaTile from '@aziontech/webkit/media-tile'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [media-tile.json](https://github.com/aziontech/webkit/blob/main/.specs/media-tile.json)

## When to use

- For a row of three or four scenes that each need one sentence of explanation, laid out by `card-grid` in its `gap` register (`frame`) or its `divider` register (`plain`).
- When the claim is a label for the picture above it (`AI workloads.`, `Middleware.`) rather than a section heading in its own right.
- When the media should carry the page's frame language — hairline rules and corner marks — and the copy should not (`frame`).
- For a full-bleed band whose columns are separated by the grid's own hairlines, where a frame per cell would double every rule (`plain`).

## Do

- End the lead with a full stop. It runs into the sentence that follows it, so the stop is what separates them — the component adds no punctuation of its own.
- Keep the lead to one or two words. It is a label for the panel above it, and a long lead swallows the first line of the sentence.
- Give every tile in a band a caption of roughly the same length. The frames are equalised by the grid row; ragged captions are what make a band look uneven.
- Reach for `padded` off when the media is an exported asset that already carries its own air, or when it should run to the cell's edges so a list or a table reads as continuing past them. A composed scene wants the inset.
- Pair the register with the grid. `frame` belongs in `card-grid`'s `gap` register, whose gutters keep every frame its own; the `divider` register would rule the captions as well as the panels. `plain` belongs in the `divider` register, where the grid draws every rule and the tile fills its own background so the gap has something to show through.
- Do not put a `frame` tile in a `divider` grid. The grid's hairline and the frame's rule then sit a padding apart, and the band reads as two competing grids.
- Turn `fluid` on for a band whose scenes share one frame size, so every tile renders its scene at the same zoom whatever the column width. Scenes on different frames come out at different zooms under `fluid` — fix the frames, not the tiles.
- Reach for `mediaScale` when a scene sits small or large on its canvas — a cluster of icon boxes drawn at its own size on the 592×300 frame reads as a speck in a tile. Set it per tile, so each scene in a band reaches the same visual height, and keep it at or under the value where the scene's widest edge meets the frame; anything past that is clipped.
- Leave the media slot empty while a scene is still being drawn: the frame holds the tile's floor height, so the band keeps its rhythm instead of collapsing.

## Don’t

- When the claim deserves a heading and a place in the document outline → use `topic`, which leads with a real `h2`/`h3`.
- When the tile is a padded surface card with a glyph and a link → use `topic` in a `CardGrid.Cell`.
- For one scene beside a block of copy across the full band → use `media-split`.
- For a mosaic whose cells claim different numbers of columns → use `bento-grid`.
- For the grid that lays the tiles out, or a framed cell that wraps media *and* copy together → use `card-grid`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card-grid](card-grid.md) — the grid that lays a row of tiles out; use its `gap` register, whose gutters keep every tile's frame its own.
- [topic](topic.md) — the heading-led claim, for a band whose items belong in the outline.
- [media-split](media-split.md) — one scene beside one block of copy, across the whole band.
- [frame-box](frame-box.md) — the frame this tile draws around its media.
- [illustration](illustration.md) — the scene the frame usually holds; unnamed, it renders the placeholder that reserves a tile's space.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `MediaTileKind` | `'frame'` | false | Register of the tile: `frame` draws the page's frame around the media alone, `plain` draws no rules and makes the tile itself the cell a `divider` grid separates. |
| `title` | `string` | `—` | true | The caption's run-in lead, naming what the panel above it shows. |
| `description` | `string` | `''` | false | The sentence continuing the caption after the lead; overridden by the default slot. |
| `src` | `string` | `''` | false | URL of the tile's media image; ignored when the `media` slot is filled. |
| `alt` | `string` | `''` | false | Alternative text describing what the image shows; empty keeps it decorative. |
| `padded` | `boolean` | `true` | false | Inset the media — inside the frame in the `frame` register, from the cell's edges in `plain`. Turn it off for an asset that should run to the cell's edges; the caption keeps its own inset either way. |
| `fluid` | `boolean` | `false` | false | Stretch the media to the frame's full width with its aspect ratio locked, so it grows and shrinks with the tile; off, slotted media keeps its own size, centred. |
| `mediaScale` | `number` | `1` | false | Scale of the media inside its frame, around its centre. The frame keeps its size and clips whatever grows past it, so a scene drawn small on its canvas can be fitted to the tile without changing the band's rhythm. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The caption body after the lead; replaces the `description` prop. |
| `media` | — | The scene the frame holds; replaces the `src` image. |

## States

- Visual states: `default`
- `data-kind` carries the register, and is what moves the inset from the frame to the tile
- `data-media` mirrors whether the frame holds any media
- `data-padded` mirrors the `padded` prop
- `data-fluid` mirrors the `fluid` prop, and is what stretches the media to the frame's width
- A `mediaScale` other than `1` scales the media around its centre without moving the frame or the caption; at `1` the media carries no scale at all
- `data-described` mirrors whether the caption carries a body after its lead
- Empty: a tile with no media still draws its frame at the tile's floor height, so a band whose scene is not drawn yet keeps its rhythm instead of collapsing

## Accessibility

- Visible focus: not applicable — the tile carries no control of its own; anything composed into its media keeps its own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the tile is static content and takes no focus, so `Tab` order runs through whatever a band composes around it.
- ARIA: the caption is one paragraph whose lead is a `strong`, so the lead is read in flow rather than announced as a heading — the band's `section-title` carries the outline. An image given no `alt` is marked `aria-hidden="true"` and stays decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the lead takes `var(--text-default)` and the body `var(--text-muted)`, both measured against the page canvas the band sits on.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, the tile declares no interactive control.

## Examples

### Default

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTile from '@aziontech/webkit/media-tile'
</script>

<template>
  <MediaTile
    title="AI workloads."
    description="Run tasks with reduced latency and higher concurrency, delivering faster, scalable results for all users."
  >
    <template #media>
      <Illustration name="ai-applications" />
    </template>
  </MediaTile>
</template>
```

### Kinds

```vue
<script setup>
  import CardGridRoot from '@aziontech/webkit/card-grid-root'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTile from '@aziontech/webkit/media-tile'
</script>

<template>
  <div class="flex flex-col gap-8">
    <CardGridRoot
      kind="gap"
      :columns="2"
    >
      <MediaTile
        kind="frame"
        title="Framed."
        description="The frame wraps the media alone, and the caption sits under it on the page column."
      >
        <template #media>
          <Illustration name="ai-applications" />
        </template>
      </MediaTile>
      <MediaTile
        kind="frame"
        title="One frame per tile."
        description="The gutters of the gap register keep every frame its own, marks included."
      >
        <template #media>
          <Illustration name="distributed-apis" />
        </template>
      </MediaTile>
    </CardGridRoot>
    <CardGridRoot
      kind="divider"
      :columns="2"
    >
      <MediaTile
        kind="plain"
        title="Plain."
        description="No rules of its own: the tile is the cell, filled and inset, and the grid draws the seam."
      >
        <template #media>
          <Illustration name="modern-frontends" />
        </template>
      </MediaTile>
      <MediaTile
        kind="plain"
        title="One rule per seam."
        description="The divider register rules every column, so a frame here would double each line."
      >
        <template #media>
          <Illustration name="runtime" />
        </template>
      </MediaTile>
    </CardGridRoot>
  </div>
</template>
```

### Unpadded

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTile from '@aziontech/webkit/media-tile'
</script>

<template>
  <MediaTile
    title="AI workloads."
    description="Run tasks with reduced latency and higher concurrency, delivering faster, scalable results for all users."
    :padded="false"
  >
    <template #media>
      <Illustration name="ai-applications" />
    </template>
  </MediaTile>
</template>
```
