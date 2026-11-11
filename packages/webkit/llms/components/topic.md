# Topic

> One claim stated in three parts: a glyph, a short headline it shares a line with, and a sentence under them that explains it. It is the repeated unit of a marketing claim grid — the content of a cell, not the cell itself, so it carries no surface, no padding and no rules of its own and reads the same dropped into a `card-grid` cell, a `bento-grid` cell, or a column the page lays out by hand. Given an `href` the whole claim becomes the link, and its headline closes on a trailing arrow, so a band of claims needs no separate row of "learn more" controls.

- Import: `import Topic from '@aziontech/webkit/topic'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [topic.json](https://github.com/aziontech/webkit/blob/main/.specs/topic.json)

## When to use

- For each cell of a "what you get" band: a row of equal claims under a section's headline.
- Inside `CardGrid.Cell` or `BentoGrid.Cell`, where the grid owns the frame and the fill and the topic owns only the copy.
- Whenever a claim is glyph-led and one sentence long, repeated three to six times across a band.

## Do

- Let the cell own the surface. A topic paints no background and adds no padding, so put it inside `CardGrid.Cell` / `BentoGrid.Cell` (or a padded cell the page owns) rather than giving the topic a fill.
- Keep `headingLevel` in step with the page outline: `2` when the band has no headline of its own and these are the first sub-headings under the `h1`, `3` when a `section-title` has already opened the section. The level is the outline; the size is fixed at `heading-xs`.
- Keep the description to one sentence. The glyph carries the recognition, the headline carries the claim, and a second sentence turns a scannable grid into a wall of prose.
- Drop `icon` for a band whose claims are not glyph-led rather than reaching for a decorative glyph that says nothing.
- Give the claim an `href` rather than composing a button under it. A grid of six claims that each close on their own "Learn more" reads as six calls to action instead of six claims, and the button is a second target for the destination the claim already points at.
- A linked claim stretches its link over the nearest positioned ancestor, so the whole cell is the hover and click target, not just the copy. `CardGrid.Cell` and `BentoGrid.Cell` are positioned; a cell the page builds by hand needs `relative`, or every claim in the grid covers the band.

## Don’t

- For a tile with its own border and surface → keep the topic and put it in a `CardGrid.Cell`, which draws the frame and the fill.
- For a claim that carries an eyebrow, a media region or a button → use `media-split`.
- For the headline that opens the whole section → use `section-title`.
- For a measured figure with a unit → use `big-numbers`.
- For a console list row with media and actions → use `item`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card-grid](card-grid.md) — the equal-cell grid a topic is usually repeated in; its `frame` register gives each topic a real `frame-box` cell.
- [bento-grid](bento-grid.md) — the unequal-cell mosaic, when one claim deserves more room than the rest.
- [section-title](section-title.md) — the headline that opens the band a row of topics sits in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The claim, rendered as the topic's heading. |
| `description` | `string` | `''` | false | One sentence explaining the claim; overridden by the default slot. |
| `icon` | `string` | `''` | false | Icon class for the glyph that leads the headline. |
| `href` | `string` | `''` | false | When set, the whole claim renders as an anchor link to this URL and its headline closes on a trailing arrow. |
| `headingLevel` | `TopicHeadingLevel` | `2` | false | Level of the heading element. Keep `2` when the band has no headline of its own; drop it to `3` when a `section-title` has already opened the section, so the document outline stays in order. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Description body; replaces the `description` prop when provided. |

## States

- Visual states: `default`, and `hover` / `focus-visible` when `href` is set
- `data-icon` mirrors whether a glyph is rendered, so a band can style the glyph-less case
- `data-described` mirrors whether a description is rendered, from either the prop or the slot
- `data-linked` present when the claim carries an `href`
- The root element switches between `<a>` and `<div>` on the `href` data prop, never on an `as` string — so the whole claim is the target, not a control composed under it
- A linked root lays an `::after` over its positioned cell, so hovering anywhere in the cell hovers the claim
- The heading element follows `headingLevel`; its size does not change with it

## Accessibility

- Visible focus: the linked root draws an inset `focus-visible` ring in `var(--ring-color)` on its `::after`, so the ring outlines the whole cell it covers. Without an `href` the topic holds no interactive control of its own.
- Keyboard map: `Tab` reaches the linked claim and `Enter` follows it — the anchor's own behaviour, no handler of our own. Unlinked, the topic is static content and `Tab` passes through whatever the description slot contains.
- ARIA: both glyphs are decorative and carry `aria-hidden="true"` — the leading icon and the trailing arrow — so the link's accessible name is the headline and the sentence, the copy a reader sees. `headingLevel` is what keeps the document outline in order (axe `heading-order`); the heading stays a heading inside the anchor.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): `var(--text-default)` for the heading, `var(--text-muted)` for the description, `var(--primary)` for the glyph and for the hovered headline — all against the fill the surrounding cell provides.
- `motion-reduce:transition-none` on both transitions a linked claim carries.
- Touch target ≥40×40 px — the whole claim is the target, so it is the cell's own height; a topic is never smaller than its heading plus its sentence.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the external-link arrow does not mirror; its hover nudge moves toward the end edge (`rtl:` flips the `translate-x`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import Topic from '@aziontech/webkit/topic'
</script>

<template>
  <div class="relative">
    <Topic
      icon="ai ai-edge-nodes"
      title="Consistent global speed"
      description="Serve content and run web apps across hundreds of locations with median latency under 30 ms. No infra to manage."
    />
  </div>
</template>
```

### WithoutIcon

```vue
<script setup>
  import Topic from '@aziontech/webkit/topic'
</script>

<template>
  <Topic
    title="Frontend and API logic together"
    description="Deploy your frontend and backend API as a single, simple project — in one deploy."
  />
</template>
```

### Linked

```vue
<script setup>
  import Topic from '@aziontech/webkit/topic'
</script>

<template>
  <div class="relative">
    <Topic
      icon="ai ai-tiered-cache"
      title="Accelerate API responses"
      description="Cache API responses on a distributed architecture to reduce latency and origin load."
      href="/products/cache"
    />
  </div>
</template>
```
