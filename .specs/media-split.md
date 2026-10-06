---
name: media-split
category: marketing
structure: monolithic
status: implemented
spec_version: 2
checksum: a5866c169fa4ea1e627690f1f61a053fa3730a0ee91cd2ad2a7101b4e85b01d4
created: 2026-09-22
last_updated: 2026-10-01
---

# Media Split — Component Spec

## Purpose

A two-column band pairing a block of copy with a piece of media — a screenshot, diagram or short video — each holding half the frame. It is the workhorse section of a product page: one claim, one picture of the claim, repeated down the page with the sides alternating.

It is a **sub-section**, not a section header, and its typography says so: the headline is `heading-md` against `section-title`'s `heading-xl`, because these bands sit _inside_ a section that a `section-title` has already opened. A band that needs the larger weight is opening a section, and wants `section-title`.

Typographic weight and heading level are separate choices. The band sets its headline at `heading-md`, or `heading-xl` when `size` is `large`; `headingLevel` decides whether that headline is an `h2` or an `h3`, so a band nested under a section that already has its own `h2` does not open a second one at the same level.

The seam between the two cells is the grid's own one-pixel gap over a rule fill, so neither cell draws a border and the hairline lands in the same place whichever side the media is on — horizontal while the band is stacked, vertical once it splits. `divided` drops it for a band whose two halves should read as one plate.

Whether the band ever splits is `orientation`'s call. `horizontal` is the band proper: stacked below `lg`, two cells from `lg` up. `vertical` holds the stacked form at every width, and `kind` then picks whether the media sits above the copy or below it rather than left or right — the shape a band takes in a column too narrow to carry two halves.

## When to use

- To pair one capability's explanation with a screenshot or diagram of it.
- Down a product page, alternating `kind` so consecutive bands mirror each other.
- With `framed` off inside a page column that already draws the frame, and on when the band stands alone.
- With `heading-level="3"` whenever a `section-title` has already opened the section the band sits in.
- With `orientation="vertical"` in a column too narrow for two halves — a page aside, a grid cell — where the band would otherwise squeeze both.
- Whenever the media carries as much of the message as the copy does.

## When NOT to use

- For copy with no media → use `section-title`, which is the header band.
- For the closing ask → use `call-to-action`; for a mid-page announcement → use `banner`.
- For several short claims side by side → use `topic` in a `card-grid`.
- For a picture with no explanation → use `illustration` directly.

## Related

- `section-title` — the copy-only section header.
- `topic` — the smaller unit when a page needs several claims rather than one.
- `illustration` — the media itself; a scene dropped in the `media` slot is what the band's ground is drawn for.
- `texture-material` — the material the media half is grounded with; compose it yourself when a band needs a different one.
- `frame-box` — the frame the band is drawn with. With `framed` on, or inside a `band-stack`, each of the band's two cells is its own `frame-box`.
- `band-stack` — the run that stacks these bands; inside it every band frames its two cells, left and right, under the rules the stack draws.

## Best practices

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

## Usage

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <!-- The usual form: an official scene, which the band's ground is drawn for. -->
  <MediaSplit
    eyebrow="Observability"
    title="See every request as it happens."
    description="Logs stream from every edge location in real time, with no agent to install and no sampling."
  >
    <template #media>
      <Illustration name="live-debugging" />
    </template>
  </MediaSplit>

  <!-- A plain picture: `src` covers the ground rather than sitting on it. -->
  <MediaSplit
    title="See every request as it happens."
    src="/media/real-time-logs.png"
    alt="A live log stream showing requests from twelve edge locations"
  />

  <!-- Stacked at every width, media leading, and the two cells reading as one plate. -->
  <MediaSplit
    orientation="vertical"
    kind="media-start"
    :divided="false"
    fill="surface"
    title="See every request as it happens."
    description="Logs stream from every edge location in real time."
  >
    <template #media>
      <Illustration name="live-debugging" />
    </template>
  </MediaSplit>
</template>
```

## Props

| Prop           | Type                     | Default        | Required | JSDoc                                                                                                                                                                                     |
| -------------- | ------------------------ | -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`        | `string`                 | `—`            | true     | Headline of the band, rendered as its `h2`.                                                                                                                                               |
| `description`  | `string`                 | `''`           | false    | Supporting paragraph under the headline; overridden by the default slot.                                                                                                                  |
| `eyebrow`      | `string`                 | `''`           | false    | Short uppercase overline rendered above the headline.                                                                                                                                     |
| `src`          | `string`                 | `''`           | false    | URL of the band's image; ignored when the `media` slot is filled.                                                                                                                         |
| `alt`          | `string`                 | `''`           | false    | Alternative text describing what the image shows.                                                                                                                                         |
| `kind`         | `MediaSplitKind`         | `'media-end'`  | false    | Which end the media sits on: the closing cell from `lg` up, or the lower one when the band is vertical. `media-end` puts the copy first.                                                  |
| `orientation`  | `MediaSplitOrientation`  | `'horizontal'` | false    | Axis the band splits on. `horizontal` sets the cells side by side from `lg` up; `vertical` holds them stacked at every width.                                                             |
| `fill`         | `MediaSplitFill`         | `'canvas'`     | false    | The copy cell's fill. `canvas` lets the band sit in the page column; `surface` lifts it onto its own plate. The media cell follows `mediaFill`.    |
| `mediaFill`    | `MediaSplitFill`         | `'surface'`    | false    | The media cell's fill. `surface` sets the asset on its own plate, one step off the page; `canvas` lets the whole band sit on the page. |
| `framed`       | `boolean`                | `false`        | false    | Draw the band's own registration frame: its top and bottom rules, with the copy and the media framed as two cells, each with its four marks. Turn it off when the page already wraps the band in a frame. |
| `divided`      | `boolean`                | `true`         | false    | Draw the seam between the copy and the media. Turn it off for a band whose two halves should read as one plate.                                                                           |
| `headingLevel` | `MediaSplitHeadingLevel` | `2`            | false    | Level of the band's headline element. Drop it to `3` when the band is a sub-band of a section a `section-title` has already opened with its `h2`, so the document outline stays in order. |
| `texture`      | `TextureMaterialKind`    | `'grid'`       | false    | Texture the media half is grounded with; `none` leaves the cell bare.                                                                                                                     |
| `textureSize`  | `TextureMaterialSize`    | `'medium'`     | false    | Pitch of the ground's tiling — how far apart its cells sit.                                                                                                                               |
| `textureFade`  | `TextureMaterialFade`    | `'vignette'`   | false    | How the ground fades out before the cell's edges.                                                                                                                                         |
| `mediaPadded`  | `boolean`                | `false`        | false    | Inset the media from the cell's edges. An exported asset carries its own air and runs flush; a screenshot or a composed panel wants the inset.                                            |
| `mediaHref`    | `string`                 | `''`           | false    | URL the band links to. With it set the media cell is one link named by the band's `title`, a click anywhere else on the band follows it, and hovering the band reveals the chevron affordance and the hover state of its link actions. |
| `align`        | `MediaSplitAlign`        | `'top'`        | false    | Where the copy sits down its cell. `top` holds the copy at the cell's top and floors the actions so consecutive bands align on them; `center` gathers the copy and its actions into one block on the cell's vertical middle. |
| `size`         | `MediaSplitSize`         | `'medium'`     | false    | Type scale and air of the copy. `medium` sets the headline at heading-md for a band beside other content; `large` sets it at heading-xl with a larger description and pads the copy cell a step wider, for a band that carries only its headline and actions. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                                                                                                                                                                                                                                                                                                                                                 |
| --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | Description body; replaces the `description` prop when provided.                                                                                                                                                                                                                                                                                                                      |
| `content` | —     | Further copy-column content under the description — an inventory, a list of surfaces — inside the paragraph's own measure.                                                                                                                                                                                                                                                            |
| `media`   | —     | The band's media; replaces the image built from `src`.                                                                                                                                                                                                                                                                                                                                |
| `actions` | —     | Optional controls under the copy, floored so consecutive bands align on them. Small buttons: `kind="secondary"` for the action, `kind="outlined"` for a second beside it, `icon="pi pi-chevron-right"` + `icon-position="trailing"` when it leaves the page. |

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

## Motion & Animations

| Trigger                                                      | Animation / Transition                                                                                                                                                                | Token                                                             | Reduced-motion fallback                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| hover on a band, or `focus-visible` on a media cell, carrying `mediaHref` | the chevron affordance fades and slides in — `transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance`, `opacity-0 translate-x-1` to `opacity-100 translate-x-0` | `--transition-duration-moderate-02`, `--ease-expressive-entrance` | `motion-reduce:transition-none` — the affordance still appears, it just does not travel |

## Tokens

| Region                         | Token (DESIGN.md)                                                        |
| ------------------------------ | ------------------------------------------------------------------------ |
| typography (headline)          | `.text-heading-md` (`medium`), `.text-heading-xl` (`large`)              |
| typography (description)       | `.text-body-md` (`medium`), `.text-body-lg` (`large`)                    |
| headline text                  | `var(--text-default)`                                                    |
| description text               | `var(--text-muted)`                                                      |
| copy cell fill (`canvas`)      | `var(--bg-canvas)`                                                       |
| copy cell fill (`surface`)     | `var(--bg-surface)`                                                      |
| media cell fill (`surface`)    | `var(--bg-surface)`                                                      |
| media cell fill (`canvas`)     | `var(--bg-canvas)`                                                       |
| media affordance               | `var(--secondary)` on `var(--secondary-contrast)`, `var(--shape-button)` |
| band rules, marks and the seam | `var(--border-default)`                                                  |
| spacing (cell padding)         | `var(--spacing-xl)`                                                      |
| spacing (copy cell, `large`)   | `var(--spacing-xxl)`                                                     |
| media ground ink               | `var(--text-default)`, mixed down by `texture-material`                  |
| spacing (copy stack)           | `var(--spacing-lg)`                                                      |
| spacing (copy to actions)      | `var(--spacing-xxl)`                                                     |
| spacing (between actions)      | `var(--spacing-sm)`                                                      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable to the band; controls composed into `actions` keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` reaches the controls placed in the `actions` slot, in DOM order, which is the copy column first at every width, then the media cell's link when `mediaHref` is set. The band-wide click is a pointer convenience over that link, not a second tab stop.
- ARIA: the headline is a real `h2` and the band is a `<section>` labelled by it; the image carries `alt`, and an image given no `alt` is marked `aria-hidden` rather than announced as an unnamed graphic.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the headline is `var(--text-default)` on `var(--bg-surface)`; the description uses `var(--text-muted)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the band is static.
- Touch target — the band composes no control of its own; the small buttons its `actions` pattern calls for stand 28 px tall, which clears WCAG 2.2 AA 2.5.8 (24×24 px) but is under this package's own 40×40 px house floor.

## Stories (Storybook)

- Default — the band with an official `illustration` scene in the `media` slot, which is what the ground is drawn for; filling `src` in the Controls swaps the scene for a plain image
- Kinds — composite story rendering both `kind` values one under the other, as a page would alternate them
- Textures — composite story over the `texture` axis, every material one under the other with the same scene on it, so the step between them is the only difference; the band that reads `none` is the bare cell, and the `dots` band takes `texture-size="small"` so the pitch axis is shown where it reads
- Orientations — composite story over the `orientation` axis: the horizontal band, then the vertical one in a narrow column with `kind="media-start"`, so the axis and what `kind` means on it are shown together
- Undivided — state story pairing a band with its seam and the same band with `divided` off on a `surface` fill, which is the form that reads as one plate
- MediaLink — state story pairing a plain band with one carrying `mediaHref` and an outlined link action, so the linked band's cursor, chevron affordance and action hover are shown against the band that has none
- Actions — the band's action pattern, one band carrying a single `secondary` button and one carrying the `secondary` + `outlined` pair, both `small`; the first band carries none, because the slot is optional and a band that ends on its copy is the common case

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
