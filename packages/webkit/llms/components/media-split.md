# Media Split

> A two-column band pairing a block of copy with a piece of media — a screenshot, diagram or short video — each holding half the frame. It is the workhorse section of a product page: one claim, one picture of the claim, repeated down the page with the sides alternating. It is a **sub-section**, not a section header, and its typography says so: the headline is `heading-md` against `section-title`'s `heading-xl`, because these bands sit _inside_ a section that a `section-title` has already opened. A band that needs the larger weight is opening a section, and wants `section-title`. Typographic weight and heading level are separate choices. The band sets its headline at `heading-md`, or `heading-xl` when `size` is `large`; `headingLevel` decides whether that headline is an `h2` or an `h3`, so a band nested under a section that already has its own `h2` does not open a second one at the same level. The seam between the two cells is the grid's own one-pixel gap over a rule fill, so neither cell draws a border and the hairline lands in the same place whichever side the media is on — horizontal while the band is stacked, vertical once it splits. `divided` drops it for a band whose two halves should read as one plate. Whether the band ever splits is `orientation`'s call. `horizontal` is the band proper: stacked below `lg`, two cells from `lg` up. `vertical` holds the stacked form at every width, and `kind` then picks whether the media sits above the copy or below it rather than left or right — the shape a band takes in a column too narrow to carry two halves.

- Import: `import MediaSplit from '@aziontech/webkit/media-split'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [media-split.json](https://github.com/aziontech/webkit/blob/main/.specs/media-split.json)

## When to use

- To pair one capability's explanation with a screenshot or diagram of it.
- Down a product page, alternating `kind` so consecutive bands mirror each other.
- With `framed` off inside a page column that already draws the frame, and on when the band stands alone.
- With `heading-level="3"` whenever a `section-title` has already opened the section the band sits in.
- With `orientation="vertical"` in a column too narrow for two halves — a page aside, a grid cell — where the band would otherwise squeeze both.
- Whenever the media carries as much of the message as the copy does.

## Do

- By default the band draws no frame of its own: the rule and the corner marks belong to the `section-module` or `frame-box` that the page assembles it into, so a band placed in a framed column never lands a second hairline on the column's own.
- A run of bands goes in a `band-stack`, not in a frame per band: the stack draws each band's rules and the band frames its two cells. Leave `framed` off there, or the band draws a second set of rules over the stack's.
- Alternate `kind` down a page so consecutive bands mirror; two identical bands in a row read as one.
- Reach for `orientation="vertical"` when the column is too narrow to carry two halves, not to vary the rhythm of a wide page — a vertical band across a full-width page reads as a card that lost its grid.
- Composed into a grid of cells, the band fills the cell it is given: the copy column floors its actions, so a row of vertical bands lines up on its buttons. Let the grid own the seams there — `divided` off, `framed` off.
- Keep the seam unless the two halves are meant to read as one thing: `divided` off on a `surface` fill is a single plate with a picture in it, and on a `canvas` fill it is two cells that merely touch.
- Keep the copy to a headline and a short paragraph — the media is the other half of the argument, not decoration beside a wall of text.
- Give the media a real `alt` that says what it shows, not what it is. "Deployment succeeded in 1.2s" beats "screenshot".
- Reach for an official `illustration` scene before a screenshot: it is vector, it follows the canvas the library is drawn on, and its transparent ground is what the band's lattice is there for. `src` is the plain-picture path — a raster covers the ground rather than sitting on it.
- Use the `media` slot when the media is not a plain image — a video, a chart or a composed figure belongs there rather than in `src`.
- Let the band's own ground carry a scene with a transparent canvas: an `illustration` needs nothing behind it. Quiet or kill the lattice from the call site with `--texture-ink`, which the layer inherits from the band's root; a media element that paints its own opaque backdrop covers it anyway.

## Don’t

- For copy with no media → use `section-title`, which is the header band.
- For the closing ask → use `call-to-action`; for a mid-page announcement → use `banner`.
- For several short claims side by side → use `topic` in a `card-grid`.
- For a picture with no explanation → use `illustration` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [section-title](section-title.md) — the copy-only section header.
- [topic](topic.md) — the smaller unit when a page needs several claims rather than one.
- [illustration](illustration.md) — the media itself; a scene dropped in the `media` slot is what the band's ground is drawn for.
- [texture-material](texture-material.md) — the material the media half is grounded with; compose it yourself when a band needs a different one.
- [frame-box](frame-box.md) — the frame the band is drawn with. With `framed` on, or inside a `band-stack`, each of the band's two cells is its own `frame-box`.
- [band-stack](band-stack.md) — the run that stacks these bands; inside it every band frames its two cells, left and right, under the rules the stack draws.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | Headline of the band, rendered as its `h2`. |
| `description` | `string` | `''` | false | Supporting paragraph under the headline; overridden by the default slot. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `src` | `string` | `''` | false | URL of the band's image; ignored when the `media` slot is filled. |
| `alt` | `string` | `''` | false | Alternative text describing what the image shows. |
| `kind` | `MediaSplitKind` | `'media-end'` | false | Which end the media sits on: the closing cell from `lg` up, or the lower one when the band is vertical. `media-end` puts the copy first. |
| `orientation` | `MediaSplitOrientation` | `'horizontal'` | false | Axis the band splits on. `horizontal` sets the cells side by side from `lg` up; `vertical` holds them stacked at every width. |
| `fill` | `MediaSplitFill` | `'canvas'` | false | The copy cell's fill. `canvas` lets the band sit in the page column; `surface` lifts it onto its own plate. The media cell follows `mediaFill`. |
| `mediaFill` | `MediaSplitFill` | `'surface'` | false | The media cell's fill. `surface` sets the asset on its own plate, one step off the page; `canvas` lets the whole band sit on the page. |
| `framed` | `boolean` | `false` | false | Draw the band's own registration frame: its top and bottom rules, with the copy and the media framed as two cells, each with its four marks. Turn it off when the page already wraps the band in a frame. |
| `divided` | `boolean` | `true` | false | Draw the seam between the copy and the media. Turn it off for a band whose two halves should read as one plate. |
| `headingLevel` | `MediaSplitHeadingLevel` | `2` | false | Level of the band's headline element. Drop it to `3` when the band is a sub-band of a section a `section-title` has already opened with its `h2`, so the document outline stays in order. |
| `texture` | `TextureMaterialKind` | `'grid'` | false | Texture the media half is grounded with; `none` leaves the cell bare. |
| `textureSize` | `TextureMaterialSize` | `'medium'` | false | Pitch of the ground's tiling — how far apart its cells sit. |
| `textureFade` | `TextureMaterialFade` | `'vignette'` | false | How the ground fades out before the cell's edges. |
| `mediaPadded` | `boolean` | `false` | false | Inset the media from the cell's edges. An exported asset carries its own air and runs flush; a screenshot or a composed panel wants the inset. |
| `mediaHref` | `string` | `''` | false | URL the band links to. With it set the media cell is one link named by the band's `title`, a click anywhere else on the band follows it, and hovering the band reveals the chevron affordance and the hover state of its link actions. |
| `align` | `MediaSplitAlign` | `'top'` | false | Where the copy sits down its cell. `top` holds the copy at the cell's top and floors the actions so consecutive bands align on them; `center` gathers the copy and its actions into one block on the cell's vertical middle. |
| `size` | `MediaSplitSize` | `'medium'` | false | Type scale and air of the copy. `medium` sets the headline at heading-md for a band beside other content; `large` sets it at heading-xl with a larger description and pads the copy cell a step wider, for a band that carries only its headline and actions. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Description body; replaces the `description` prop when provided. |
| `content` | — | Further copy-column content under the description — an inventory, a list of surfaces — inside the paragraph's own measure. |
| `media` | — | The band's media; replaces the image built from `src`. |
| `actions` | — | Optional controls under the copy, floored so consecutive bands align on them. Small buttons: `kind="secondary"` for the action, `kind="outlined"` for a second beside it, `icon="pi pi-chevron-right"` + `icon-position="trailing"` when it leaves the page. |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop and drives which column the media occupies
- `data-media` is present when the band has media (either `src` or the `media` slot), and is what switches the band between one and two columns
- `data-orientation` mirrors the `orientation` prop; `vertical` holds the stacked layout at every width, so the band never reaches two columns and `kind` decides which cell is on top instead of which is on the right
- With `framed` on, or when the band sits inside a `band-stack`, each cell — the copy and the media — is its own `frame-box` with no rules and all four registration marks, so the band reads as two frames, left and right, and every corner of each half is ticked, including both sides of the seam. `framed` adds the band's top and bottom rules around them; inside a `band-stack` the stack draws those. Below `lg` the same two frames stack, and their marks flank the horizontal seam
- `data-divided` mirrors the `divided` prop and is what draws the seam — the grid's own gap over a rule fill. With it off the grid closes the gap and the two cells meet on their own fills
- Below `lg` a horizontal band is one column with the copy first, so reading order matches the argument regardless of `kind`; a vertical band honours `kind` at every width, and does it with grid `order` so the copy — which carries the actions — stays first in DOM and in tab order either way
- When neither `src` nor the `media` slot is given, the copy column spans the full width rather than leaving an empty half
- The media half is grounded on a `texture-material` the band paints itself: `texture` picks the material, `textureSize` its pitch and `textureFade` how it reaches zero before the cell's edges, so a transparent scene has something to sit on and the seam stays the only hard line. `texture="none"` leaves the cell bare; no media, no layer
- `data-media-padded` mirrors the `mediaPadded` prop and is what insets the media from the cell's edges — off by default, because an exported asset already carries its own air and a padded cell pays for that margin twice. The ground fills the cell either way, so the texture reaches the seam even when the media does not
- `data-media-fill` mirrors the `mediaFill` prop. `surface` paints the media cell `var(--bg-surface)`, so the asset sits on its own plate one step off the page; `canvas` paints it `var(--bg-canvas)` and, with `divided` off, the whole band sits on the page
- `data-size` mirrors the `size` prop; `large` sets the headline at `heading-xl` and the description at `body-lg`, and pads the copy cell `var(--spacing-xxl)` on every side instead of `var(--spacing-xl)`, for a band whose copy cell holds only a headline and its actions. The padding follows the type, so a call site never re-spaces a large band by hand
- `data-align` mirrors the `align` prop; `top` spreads the copy column so the headline sits at the cell's top and the actions on its floor, `center` gathers the stack and its actions on the cell's vertical middle. The text stays flush with the leading edge either way
- `data-media-href` is present when `mediaHref` is set, and is what turns the band into a link: the media cell is a single `<a>` named by the band's `title`, and a chevron affordance sits at its closing lower corner — `opacity-0` at rest, revealed on `hover` anywhere on the band and on the cell's own `focus-visible`, so the keyboard reaches the same affordance the pointer does. The affordance is `aria-hidden` decoration, never a nested control: the cell is the link
- A band carrying `mediaHref` is clickable as a whole: the pointer turns to `cursor-pointer`, and a click anywhere outside a control follows the URL — in a new tab with `Cmd`/`Ctrl` held, and not at all while the reader is selecting text or when a consumer's own `click` listener called `preventDefault()`. Links and buttons inside the band keep their own destinations. The keyboard path is the media cell's link, so the band adds no tab stop
- Hovering a band carrying `mediaHref` lights every link in the `actions` slot as if it were hovered itself — its hover overlay shows and a trailing icon nudges forward — and pressing the band shows their active overlay, so the band and its action read as one target. Actions rendered as `<button>` are left alone

## Accessibility

- Visible focus: not applicable to the band; controls composed into `actions` keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` reaches the controls placed in the `actions` slot, in DOM order, which is the copy column first at every width, then the media cell's link when `mediaHref` is set. The band-wide click is a pointer convenience over that link, not a second tab stop.
- ARIA: the headline is a real `h2` and the band is a `<section>` labelled by it; the image carries `alt`, and an image given no `alt` is marked `aria-hidden` rather than announced as an unnamed graphic.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the headline is `var(--text-default)` on `var(--bg-surface)`; the description uses `var(--text-muted)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the band is static.
- Touch target — the band composes no control of its own; the small buttons its `actions` pattern calls for stand 28 px tall, which clears WCAG 2.2 AA 2.5.8 (24×24 px) but is under this package's own 40×40 px house floor.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the call-to-action chevron mirrors (`rtl:-scale-x-100`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <MediaSplit
    eyebrow="Deployment"
    title="Go from repository to running application in three steps."
    description="Pick a method, point at a repository, then name the application and deploy it. There is no pipeline to assemble first and nothing to size — the last step ships it."
  >
    <template #media>
      <Illustration name="quick-start-with-templates" />
    </template>
  </MediaSplit>
</template>
```

### Kinds

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <MediaSplit
      kind="media-end"
      eyebrow="Deployment"
      title="Go from repository to running application in three steps."
      description="Pick a method, point at a repository, then name the application and deploy it. There is no pipeline to assemble first and nothing to size — the last step ships it."
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
    <MediaSplit
      kind="media-start"
      eyebrow="Deployment"
      title="Go from repository to running application in three steps."
      description="Pick a method, point at a repository, then name the application and deploy it. There is no pipeline to assemble first and nothing to size — the last step ships it."
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
  </div>
</template>
```

### Orientations

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <MediaSplit
      orientation="horizontal"
      eyebrow="Deployment"
      title="Horizontal: two cells from lg up."
      description="The band proper. It stacks below lg and splits above it, so a full-width page reads as a column of alternating halves."
    >
      <template #media>
        <Illustration name="quick-start-with-templates" />
      </template>
    </MediaSplit>
    <div class="max-w-(--container-lg)">
      <MediaSplit
        orientation="vertical"
        kind="media-start"
        eyebrow="Deployment"
        title="Vertical: stacked at every width."
        description="The shape a band takes in a column too narrow to carry two halves. kind picks which cell is on top — media-start leads with the picture."
      >
        <template #media>
          <Illustration name="quick-start-with-templates" />
        </template>
      </MediaSplit>
    </div>
  </div>
</template>
```
