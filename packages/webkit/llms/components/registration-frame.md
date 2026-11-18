# Registration Frame

> The registration frame: a hairline box with a small square set inside each corner and an optional linear hatch texture behind its content. Every side and every corner is addressable on its own, so frames stack and abut without doubling a rule or a mark. It is the container every framed page section is built from — a section title, the gap between two sections, a cell of a divider grid — so a page's rules and corner marks come from one component instead of from per-screen borders.

- Import: `import RegistrationFrame from '@aziontech/webkit/registration-frame'`
- Category: layout · Surface: site · Structure: monolithic
- API as JSON: [registration-frame.json](registration-frame.json)

## When to use

- Wrapping a page section, band, or grid cell that should read as a framed module.
- Building a page whose vertical rhythm is drawn by rules rather than by margins: stack frames and let `flush` collapse each junction to a single hairline.
- Adding the corner registration marks (and optionally the hatch texture) to an area that already has its rules drawn by a surrounding grid — set `borders="none"` and keep `marks`.

## Do

- Stack or abut frames with `flush` so a shared edge reads as one hairline instead of two. It subtracts the named sides from this frame's own set, so it works vertically (`flush`, i.e. `top`) and horizontally (`flush="left"`) with the same mechanic.
- Use `borders` rather than overriding the border utilities from the call site: `y` for a full-bleed band that keeps only its top and bottom rules, `none` for a cell of a `gap-px` divider grid whose edges are already drawn by the grid's seams.
- Keep `marks` on: the corner squares are the frame's identity, and they cost nothing when the rules are handed over to a grid. On a shared edge, pair `flush` with the opposite `marks` keyword (`flush` + `marks="bottom"`, `flush="left"` + `marks="right"`) so the junction carries one rule and one mark per corner.
- Never double a line. A frame placed directly in a box whose top and side edges its container already draws (a `module` body with `padded` off, marked `data-frame-edges`) drops its own top and side rules and its two top corner marks: the header's bottom rule and the column's side rules are its edge there, so each seam stays one hairline at every width. Its bottom rule and bottom marks stay; the module that follows it passes `divided` as `false`.
- Reach for `hatch` sparingly — one hatched frame per view reads as texture; several read as noise. For a ruled ground, compose `texture` at its `lines` kind inside the frame instead: it is the system's texture layer, and its ink and pitch are tunable from the call site.

## Don’t

- For a card-shaped surface with padding, a header and a footer → use `card` instead.
- For a single separating line between two blocks → use `separator` instead.
- For the empty framed band that separates two sections → use `spacer`, which is this frame configured for that one job.
- Built to be personalized (style seam): any class is accepted on the tag.

## Related

- [spacer](spacer.md) — an empty `registration-frame` that holds the air between two sections.
- [module-header](module-header.md) — a `registration-frame` around a centered section header.
- [card](card.md) — a padded surface with header/content/footer regions; a card, not a frame.
- [separator](separator.md) — one hairline with optional centered label; no corners, no content.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `borders` | `'all' \| 'none' \| 'x' \| 'y' \| Side \| Side[]` | `'all'` | false | Which of the frame's own rules to draw. Takes a keyword, one side, or a list of sides. |
| `marks` | `'all' \| 'none' \| Edge \| Corner \| Corner[]` | `'all'` | false | Which corner registration squares to draw. Takes a keyword (`all`, `none`, `top`, `bottom`, `left`, `right`), one corner, or a list of corners. |
| `hatch` | `boolean` | `false` | false | Show the frame's own linear hatch texture behind the content, faded toward the edges. Prefer `texture`'s `lines` kind for a ruled ground; `spacer` composes that instead. |
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
- Directly inside an element marked `data-frame-edges`, the frame's top and side rules and its two top corner marks are dropped, whatever `borders` and `marks` resolve to; the bottom rule and the bottom marks follow `borders` and `marks` as usual

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
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <RegistrationFrame>
    <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Framed content</div>
  </RegistrationFrame>
</template>
```

### Borders

```vue
<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <RegistrationFrame borders="all">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">borders="all"</div>
    </RegistrationFrame>
    <RegistrationFrame borders="x">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="x" — left and right
      </div>
    </RegistrationFrame>
    <RegistrationFrame borders="y">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="y" — top and bottom
      </div>
    </RegistrationFrame>
    <RegistrationFrame borders="top">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="top" — one side
      </div>
    </RegistrationFrame>
    <RegistrationFrame :borders="['top', 'left']">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        :borders="['top', 'left']" — an explicit list
      </div>
    </RegistrationFrame>
    <RegistrationFrame borders="none">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        borders="none"
      </div>
    </RegistrationFrame>
  </div>
</template>
```

### Marks

```vue
<script setup>
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <RegistrationFrame marks="all">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="all"</div>
    </RegistrationFrame>
    <RegistrationFrame marks="top">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="top" — both top corners
      </div>
    </RegistrationFrame>
    <RegistrationFrame marks="left">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="left" — both left corners
      </div>
    </RegistrationFrame>
    <RegistrationFrame marks="top-right">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        marks="top-right" — one corner
      </div>
    </RegistrationFrame>
    <RegistrationFrame :marks="['top-left', 'bottom-right']">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        :marks="['top-left', 'bottom-right']" — an explicit list
      </div>
    </RegistrationFrame>
    <RegistrationFrame marks="none">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">marks="none"</div>
    </RegistrationFrame>
  </div>
</template>
```
