# Hero

> The opening band of a page: a full-bleed section spanning the whole viewport width whose copy is centered in a capped column, optionally filling one screen and optionally carrying a decorative backdrop behind it. It is the top layer of the page language and the owner of the page's first rule — the bottom hairline every column below it hangs from. `Hero.Title` is the copy block it centers.

- Import: `import HeroRoot from '@aziontech/webkit/hero-root'`
- Compound import (dot notation, not tree-shakeable): `import Hero from '@aziontech/webkit/hero'`
- Category: marketing · Surface: marketing · Structure: composition
- API as JSON: [hero.json](https://github.com/aziontech/webkit/blob/main/.specs/hero.json)

## When to use

- As the opening band of a marketing, hub or documentation page.
- Whenever a band must span the window while its copy stays on the page's measure.
- For any band that carries a decorative backdrop behind its content.
- With `kind="screen"` when the opening should measure exactly one viewport.

## Do

- One `Hero` per page. It owns the `h1` through `Hero.Title`, and a second breaks the document outline.
- Pass `kind="screen"` for an opening band that should measure one screen, and declare the sticky bar's height as `--banner-offset` so the band still measures exactly one screen beneath it.
- Put the backdrop in the `background` slot rather than on the band's own class: the slot renders beneath the content layer and is already marked decorative.
- Turn `padded` off when the slotted content owns its block rhythm; the inline inset is not optional, because it is the page boundary the bar above the band also reads.
- Set the band's air with `size`, never with a padded wrapper around the copy: `large` is the opening a page leads with, and the rhythm is the same above and below so the copy and the media sit on the band's vertical centre.
- Keep `highlight` to the opening phrase of the headline — it is the same sentence, only painted differently.
- Put the calls to action in `Hero.Title`'s `actions` slot; it stacks them full-width on narrow screens, which is what makes a hero button a comfortable thumb target.
- Set `mediaAlign="end"` when the media should close on the same vertical line as the frames below the band; leave it `center` when the media is a self-contained object that reads best balanced in its column.
- Reach for `floorTexture` rather than wiring a texture into the `bottom` slot by hand: the window is a fixed cell, so the band already carries the ink and the horizontal falloff fitted to it, and a hand-fitted copy of that drifts.
- Leave the `media` slot out entirely rather than filling it with decoration — a band with one column and a strong statement beats one with a stock image.

## Don’t

- For the framed column of bands below the opening → use `section-container`.
- For one band inside that column → use `section-module`.
- For a section header further down the page → use `section-title`, which renders an `h2`.
- For a mid-page announcement → use `banner`; for the closing ask → use `call-to-action`.
- For a copy-and-media pairing that is not the page opening → use `media-split`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [section-container](section-container.md) — the framed column below it; this band's `border-b` is that column's top edge.
- [section-module](section-module.md) — the brick stacked inside that column.
- [texture-material](texture-material.md) — the backdrop the `texture` and `floorTexture` props paint, at the pitch `textureSize` and `floorTextureSize` set; reach for the `background` slot only when the layer needs more than kind, size and fade.
- [media-split](media-split.md) — the same copy-beside-media shape at section scale, rendering an `h2`.
- [banner](banner.md) — the mid-page announcement band.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `HeroKind` | `'band'` | false | Height of the band; `screen` fills one viewport minus `--banner-offset`. |
| `maxWidth` | `HeroWidth` | `'7xl'` | false | Width the inner column is capped at; `site` is the marketing measure, `full` keeps only the inset. |
| `bordered` | `boolean` | `true` | false | Draw the band's bottom rule, which is the top edge of whatever follows it. |
| `padded` | `boolean` | `true` | false | Apply the band's own vertical rhythm. The inline inset is always applied. |
| `size` | `HeroSize` | `'medium'` | false | Vertical rhythm the band applies when `padded`, equal above and below; `large` is the opening a page leads with. |
| `texture` | `TextureMaterialKind` | `'none'` | false | Paint this texture behind the band's content; `none` leaves the backdrop to the `background` slot. |
| `textureSize` | `TextureMaterialSize` | `'medium'` | false | Pitch of the tiling the `texture` prop paints — how far apart its cells sit. |
| `textureFade` | `TextureMaterialFade` | `'none'` | false | Fade applied to the layer the `texture` prop paints. |
| `floorTexture` | `TextureMaterialKind` | `'none'` | false | Paint this texture standing on the band's floor, filling the `bottom` window under the brand strip. |
| `floorTextureSize` | `TextureMaterialSize` | `'medium'` | false | Pitch of the tiling the `floorTexture` prop paints — how far apart its cells sit. |
| `align` | `HeroAlign` | `'center'` | false | Where the content column sits vertically when the band fills a screen. |
| `mediaAlign` | `HeroMediaAlign` | `'center'` | false | Where the `media` slot sits in its column: `center` balances it in the column, `end` sets its end edge on the container boundary, past the inline inset, from `md` up. |
| `offset` | `string` | `''` | false | Height of the fixed chrome above the band, subtracted from the viewport when `kind` is `screen`; any CSS length. |
| `bottomHeight` | `string` | `''` | false | Height of the window under the content, where the brand strip and the floor texture stand; any CSS length. |
| `carousel` | `boolean` | `false` | false | Stand the brand strip on the band's floor, under the `bottom` window. |
| `carouselMarks` | `string[]` | `[]` | false | Registry names of the marks the strip shows, in order. |
| `carouselLabel` | `string` | `''` | false | Overline above the brand strip, stating the claim the marks make. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The band's copy, centered in the capped column above the backdrop; usually one `Hero.Title`. |
| `media` | — | Screenshot, diagram or form set beside the copy from `md` up. When filled, the content column becomes two equal halves from `md` up and the copy keeps the leading one; the `Hero.Title` `maxWidth` caps the copy inside its half. |
| `background` | — | Decorative backdrop rendered full-bleed beneath the content; marked `aria-hidden`. |
| `top` | — | Decorative asset window overlaying the band's top edge; clips its child, which may be larger than the window and offset inside it. It claims no space, so content still centres on the band. |
| `bottom` | — | Asset window standing on the band's floor; clips its child, which may be larger than the window and offset inside it. It is real content, so it **reserves its height** and `align` centres the copy in what is left. It shares the floor with the `carousel` strip, which stands under it. `floorTexture` fills this same window when the asset is one of the system's textures. |

## Assets

- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Ticker` prints it as a typographic wordmark, the quote components show no mark.

## Sub-component imports

- `@aziontech/webkit/hero-title`

## Sub-components

The root `Hero` owns the band — the full-bleed section, the capped column, the bottom rule, the backdrop and asset windows, and the one-screen height. `Hero.Title` owns the copy block placed in its default slot. There is no shared state between them: the band is a layout shell and the copy block is self-contained, so nothing is provided or injected and the consumer wires nothing. Member names mirror this component's anatomy; the band has no `data-state="open|closed"`, so it has no `Trigger` or `Content`.

- `hero-title/hero-title.vue` — the page's leading statement: overline, `h1` with an optionally accented opening phrase, supporting paragraph and the actions row. Renders a `header`, so it carries the band's document outline.
  - Props: `title` (`string`, required) — headline of the page, rendered as the page's `h1`; `highlight` (`string`, `''`) — opening phrase of the headline, painted in the brand accent, reading as one sentence with `title`; `description` (`string`, `''`) — supporting sentence under the headline, overridden by the default slot, running to the block's own width and set one step further from the headline than the rest of the block; `eyebrow` (`string`, `''`) — short uppercase overline rendered above the headline, always closed by the blinking cursor, wrapping to the block's width instead of overflowing it; `eyebrowPrefix` (`HeroTitleEyebrowPrefix` = `'' | '//' | '<>' | '</>'`, `''`) — mark set before the eyebrow label, empty renders the label alone; `centered` (`boolean`, `false`) — centre the whole block instead of aligning it to the start. `mobileCentered` (`boolean`, `false`) — centre the whole block below `md` only, where a band with `media` stacks the copy above it; from `md` up the block keeps its start alignment. `size` (`HeroTitleSize` = `'medium' | 'large'`, `'large'`) — headline scale, medium steps one rung below large. `maxWidth` (`HeroTitleWidth` = `'lg' | 'xl' | '2xl' | '3xl' | '4xl'`, `'4xl'`) — width the whole block (headline, paragraph and actions) is capped at; beside a `media` slot the block is capped inside its half of the band. `sticky` (`boolean`, `false`) — keep the block pinned beneath the fixed chrome while the column beside it scrolls, from the large breakpoint up.
  - Events: _none_.
  - Slots: `default` — description body, replacing the `description` prop when provided; `actions` — the page's leading calls to action, stacked full-width below `20rem` and laid out in a row above it.

## States

- Visual states: `default`
- `data-kind` carries the band's height mode (`band` or `screen`)
- `data-width` carries the resolved width key
- `data-bordered` present when the bottom rule is drawn
- `data-padded` present when the band applies its own vertical rhythm
- `data-size` carries the rhythm key (`medium` or `large`); it takes effect only with `data-padded`, and the same step applies above and below the content, so the copy and the media sit on the band's vertical centre
- `data-media` present when the `media` slot is filled and the content column is split into two equal halves from `md` up, the copy leading and the media trailing; stacked below `md`
- `data-media-align` carries where the `media` slot sits in its column (`center` or `end`); it takes effect only with `data-media`. With `end`, from `md` up, the media cell extends through the end-side inline inset so its end edge lands on the container boundary — the same line the frames of the section below draw — and media narrower than the cell is set against that edge. Stacked below `md`, the media keeps the inset
- `data-align` carries where the content column sits vertically in a `screen` band. The column takes the band's leftover height, so `center` is the centre of the space actually available — a `bottom` asset reserves its height and the copy centres above it, while a `top` asset overlays and claims none
- The band is an `isolate` stacking context, so its layer order never leaks into the page. Layer tokens set that order: `--banner-z-background` (0), `--banner-z-top` / `--banner-z-bottom` (1), `--banner-z-content` (10)
- Each asset window clips its slotted child, so an asset larger than the band shows only the part the window frames. Custom properties place it: `--banner-top-height` / `--banner-bottom-height` size the window, and `--banner-top-x` / `-y`, `--banner-bottom-x` / `-y`, `--banner-background-x` / `-y` move the asset inside it
- The backdrop sets `--texture-fade-lead: transparent`, so a `top` / `bottom` fade on the `texture` layer — or on a `texture-material` in the `background` slot — ramps in from zero at its leading edge as well as fading out: the opening band sits under the site header, and the texture must clear it. Outside a hero the same fades stay single
- `data-floor` present when `floorTexture` paints the floor window. The window then takes a fluid default height (`clamp(9rem, 30dvh, 34rem)`) so a `screen` band still measures one screen on a laptop and caps at the design's field where there is room; with no floor texture it stays `auto` and is sized by its slotted child. `--banner-bottom-height` overrides either, and `--banner-floor-ink` (0.6) sets how strongly the texture reads
- The floor holds the `bottom` window and the `carousel` strip in one block, so a single ground covers both: `--banner-floor-bg` (transparent by default) paints it, which is how a design plinths the floor a shade off the band's own canvas
- The `carousel` strip stands on `--bg-canvas` edge to edge, so a `texture` backdrop or `background` slot never shows through the marks; a `--banner-floor-bg` plinth replaces that ground so the floor still reads as one block
- `carousel` loads the strip on demand, so a band without one pulls in neither the strip nor its mark registry
- `carouselLabel` names what the strip is evidence of; left empty the marks stand alone, which is the right register when the band's copy has already said it

## Accessibility

- Visible focus: not applicable to the band — it is a container; controls composed into it keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the band is not focusable; `Tab` order is decided entirely by the slotted content.
- ARIA: the root renders a `section` and adds no role; the backdrop and the top asset window are wrapped `aria-hidden="true"` so decoration never reaches the accessibility tree. `Hero.Title` renders a `header` holding the page's single `h1`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the backdrop is decoration and the slotted copy owns its own contrast against the canvas.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable to the band; the actions row in `Hero.Title` stacks full-width below `20rem` so each control clears the target.

## Examples

### Default

```vue
<script setup>
  import Hero from '@aziontech/webkit/hero'
</script>

<template>
  <Hero max-width="7xl">
    <Hero.Title
      centered
      eyebrow="Infrastructure"
      eyebrow-prefix="//"
      title="A global network built for fast applications"
      description="Run closer to users with low-latency delivery and stable routing."
    />
  </Hero>
</template>
```

### Widths

```vue
<script setup>
  import Hero from '@aziontech/webkit/hero'
</script>

<template>
  <div>
    <Hero max-width="4xl">
      <p class="m-0 text-center text-body-md text-(--text-muted)">4xl</p>
    </Hero>
    <Hero max-width="7xl">
      <p class="m-0 text-center text-body-md text-(--text-muted)">7xl</p>
    </Hero>
    <Hero max-width="full">
      <p class="m-0 text-center text-body-md text-(--text-muted)">full</p>
    </Hero>
  </div>
</template>
```

### Screen

```vue
<script setup>
  import Hero from '@aziontech/webkit/hero'
</script>

<template>
  <Hero
    kind="screen"
    max-width="site"
  >
    <Hero.Title
      centered
      eyebrow="Infrastructure"
      eyebrow-prefix="//"
      title="A global network built for fast applications"
    />
  </Hero>
</template>
```
