# Frame Box

> The registration frame: a hairline box with a small square set inside each corner and an optional linear hatch texture behind its content. Every side and every corner is addressable on its own, so frames stack and abut without doubling a rule or a mark. It is the container every framed page section is built from — a section title, the gap between two sections, a cell of a divider grid — so a page's rules and corner marks come from one component instead of from per-screen borders.

- Import: `import FrameBox from '@aziontech/webkit/frame-box'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [frame-box.json](https://github.com/aziontech/webkit/blob/main/.specs/frame-box.json)

## When to use

- Wrapping a page section, band, or grid cell that should read as a framed module.
- Building a page whose vertical rhythm is drawn by rules rather than by margins: stack frames and let `flush` collapse each junction to a single hairline.
- Adding the corner registration marks (and optionally the hatch texture) to an area that already has its rules drawn by a surrounding grid — set `borders="none"` and keep `marks`.

## Do

- Stack or abut frames with `flush` so a shared edge reads as one hairline instead of two. It subtracts the named sides from this frame's own set, so it works vertically (`flush`, i.e. `top`) and horizontally (`flush="left"`) with the same mechanic.
- Use `borders` rather than overriding the border utilities from the call site: `y` for a full-bleed band that keeps only its top and bottom rules, `none` for a cell of a `gap-px` divider grid whose edges are already drawn by the grid's seams.
- Keep `marks` on: the corner squares are the frame's identity, and they cost nothing when the rules are handed over to a grid. On a shared edge, pair `flush` with the opposite `marks` keyword (`flush` + `marks="bottom"`, `flush="left"` + `marks="right"`) so the junction carries one rule and one mark per corner.
- Reach for `hatch` sparingly — one hatched frame per view reads as texture; several read as noise. For a ruled ground, compose `texture-material` at its `lines` kind inside the frame instead: it is the system's texture layer, and its ink and pitch are tunable from the call site.

## Don’t

- For a card-shaped surface with padding, a header and a footer → use `card` instead.
- For a single separating line between two blocks → use `divider` instead.
- For the empty framed band that separates two sections → use `section-gap`, which is this frame configured for that one job.
- Built to be personalized (style seam): any class is accepted on the tag.

## Related

- [section-gap](section-gap.md) — an empty `frame-box` that holds the air between two sections.
- [section-title](section-title.md) — a `frame-box` around a centered section header.
- [card](card.md) — a padded surface with header/content/footer regions; a card, not a frame.
- divider` — one hairline with optional centered label; no corners, no content.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `borders` | `'all' \| 'none' \| 'x' \| 'y' \| Side \| Side[]` | `'all'` | false | Which of the frame's own rules to draw. Takes a keyword, one side, or a list of sides. |
| `marks` | `'all' \| 'none' \| Edge \| Corner \| Corner[]` | `'all'` | false | Which corner registration squares to draw. Takes a keyword (`all`, `none`, `top`, `bottom`, `left`, `right`), one corner, or a list of corners. |
| `hatch` | `boolean` | `false` | false | Show the frame's own linear hatch texture behind the content, faded toward the edges. Prefer `texture-material`'s `lines` kind for a ruled ground; `section-gap` composes that instead. |
| `flush` | `boolean \| Side \| Side[]` | `false` | false | Which sides a neighbouring frame already draws, so this one does not draw them again. `true` is shorthand for `top`; use `left` for a horizontal row, or a list for a grid cell. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Frame content; rendered above the hatch texture and stretched to the frame height. |

## States

- Visual states: `default`
- `data-borders` carries the RESOLVED, space-separated side list (`flush` already subtracted), or `none`
- `data-marks` carries the RESOLVED, space-separated corner list, or `none`
- `data-hatch` present when the hatch texture is drawn, or when a consumer sets it — a component that paints its own texture inside the frame keeps the attribute on this root
- `data-flush` carries the space-separated list of sides a neighbour draws; absent when none do

## Accessibility

- Visible focus: not applicable — the frame is a container and holds no interactive surface of its own; focusable content composed into it keeps its own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the frame is not focusable and traps nothing; `Tab` order is decided entirely by the slotted content.
- ARIA: the hatch texture and the four corner squares are decorative and carry `aria-hidden="true"`; the root adds no role, so the slotted content's semantics reach the accessibility tree unchanged.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the rules and marks are non-informational decoration, and the slotted content owns its own contrast.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control.

## Examples

### Default

```vue
<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <FrameBox>
    <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Framed content</div>
  </FrameBox>
</template>
```

### Borders

```vue
<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <FrameBox borders="all">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="all"</div>
    </FrameBox>
    <FrameBox borders="x">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="x" — left and right
      </div>
    </FrameBox>
    <FrameBox borders="y">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="y" — top and bottom
      </div>
    </FrameBox>
    <FrameBox borders="top">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="top" — one side
      </div>
    </FrameBox>
    <FrameBox :borders="['top', 'left']">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        :borders="['top', 'left']" — an explicit list
      </div>
    </FrameBox>
    <FrameBox borders="none">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="none"
      </div>
    </FrameBox>
  </div>
</template>
```

### Marks

```vue
<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <FrameBox marks="all">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="all"</div>
    </FrameBox>
    <FrameBox marks="top">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="top" — both top corners
      </div>
    </FrameBox>
    <FrameBox marks="left">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="left" — both left corners
      </div>
    </FrameBox>
    <FrameBox marks="top-right">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="top-right" — one corner
      </div>
    </FrameBox>
    <FrameBox :marks="['top-left', 'bottom-right']">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        :marks="['top-left', 'bottom-right']" — an explicit list
      </div>
    </FrameBox>
    <FrameBox marks="none">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="none"</div>
    </FrameBox>
  </div>
</template>
```
