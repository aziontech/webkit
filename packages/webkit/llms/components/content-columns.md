# Content Columns

> A titled band whose body is two or three columns of short copy, drawn in one hairline `card-grid` so the columns read as a single surface. It is the plainest way to state a few parallel points under one section header.

- Import: `import ContentColumns from '@aziontech/webkit/content-columns'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [content-columns.json](https://github.com/aziontech/webkit/blob/main/.specs/content-columns.json)

## When to use

- For two or three parallel points that carry equal weight under one section heading.
- When each point is a short title and a sentence — no icon, no media, no link.
- As the body of a product or platform section that needs structure but not tiles.

## Do

- The band draws no frame of its own: the rule and the corner marks belong to the `section-module` or `frame-box` that the page assembles it into, so a band placed in a framed column never lands a second hairline on the column's own.
- Keep every column to a title and one or two sentences; the grid stretches to the tallest, so one long column pads the rest.
- Use three columns for three peers and two for a contrast; four points want `bento-grid` or a card grid instead.
- Write the column titles in parallel grammar — they are read across, not down.
- Leave `title` out when the band sits directly under another header; two headings in a row is one too many.

## Don’t

- When the points are unequal and one deserves the full width → use `bento-grid`.
- When each point needs an icon, a link or its own surface → use `topic` in a `card-grid`.
- For measured figures → use `big-numbers`.
- For one point paired with a picture → use `media-split`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [bento-grid](bento-grid.md) — the same collapsed-rule grid with unequal, slot-composed cells.
- [topic](topic.md) — the richer unit when a point needs an icon or a destination.
- [section-title](section-title.md) — the header this band renders above its columns.
- [big-numbers](big-numbers.md) — the numeric sibling of this grid.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `ContentColumnItem[]` | `[]` | false | The columns, in reading order; each item is `{ title, description }`. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2` above the columns. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `columns` | `2 \| 3` | `3` | false | How many columns the grid holds from the medium breakpoint up; below it the columns stack. |

## States

- Visual states: `default`
- `data-columns` mirrors the `columns` prop and drives the grid from the medium breakpoint up
- Below `md` the grid is a single column in DOM order, so the points are read in the order they are written
- Empty: when `items` is empty the band renders no grid and no rules, so an unfilled band leaves no empty frame

## Accessibility

- Visible focus: not applicable — the band is static copy and holds no interactive control.
- Keyboard map: none of its own; the band contains no focusable element and is skipped by `Tab`.
- ARIA: the band is a `<section>` labelled by its `h2` when `title` is set; each column title is an `h3`, so the columns nest correctly under the band's heading and the document outline stays honest.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): column titles are `var(--text-default)`; bodies use `var(--text-muted)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the band is static.
- Touch target ≥40×40 px — not applicable, no interactive target.

## Examples

### Default

```vue
<script setup>
  import ContentColumns from '@aziontech/webkit/content-columns'
</script>

<template>
  <ContentColumns
    eyebrow="How it works"
    title="Every request is handled at the edge."
    description="One platform runs the routing, the code and the cache in the same place, so a request never leaves the network to be answered."
    :columns="3"
    :items="[
      { title: 'Routed', description: 'The request lands at the location closest to the user.' },
      {
        title: 'Executed',
        description: 'Your code runs at that same location, with no region to warm up.'
      },
      { title: 'Cached', description: 'The response is held there, ready for the next request.' }
    ]"
  />
</template>
```

### Columns

```vue
<script setup>
  import ContentColumns from '@aziontech/webkit/content-columns'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <ContentColumns
      eyebrow="Where it runs"
      title="Two places your code can live."
      :columns="2"
      :items="[
        {
          title: 'At the edge',
          description: 'Code runs in the location that answered the request.'
        },
        {
          title: 'At the origin',
          description: 'Code runs where your data is, reached only when the edge cannot answer.'
        }
      ]"
    />
    <ContentColumns
      eyebrow="What you get"
      title="Three properties every deployment inherits."
      :columns="3"
      :items="[
        { title: 'Distributed', description: 'Each deployment is live in every location at once.' },
        {
          title: 'Isolated',
          description: 'Each request runs in its own sandbox, with no shared state.'
        },
        {
          title: 'Observable',
          description: 'Each request is logged with its latency, status and location.'
        }
      ]"
    />
  </div>
</template>
```
