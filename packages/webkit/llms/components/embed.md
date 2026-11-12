# Embed

> A responsive `iframe` for third-party content — a demo, a player, a status page, a form — that keeps its aspect ratio at every width and always carries the accessible name an `iframe` needs. It is the one place external content enters a page, so the attributes that are easy to forget are not optional.

- Import: `import Embed from '@aziontech/webkit/embed'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [embed.json](https://github.com/aziontech/webkit/blob/main/.specs/embed.json)

## When to use

- To embed a video player, live demo, status page or third-party form in a marketing page.
- Whenever content comes from another origin and must sit inside the page's own frame.
- When the embedded thing has a natural aspect ratio the page should preserve while it scales.

## Do

- The band draws no frame of its own: the rule and the corner marks belong to the `section-module` or `frame-box` that the page assembles it into, so a band placed in a framed column never lands a second hairline on the column's own.
- Always write a `title` that says what the embedded thing is. It is the frame's accessible name, and a screen-reader user meets it before the content.
- Pick the `ratio` that matches the source. A `video` ratio around a square form leaves bands of empty frame.
- Prefer `loading="lazy"` behaviour for anything below the fold — it is the default here, and an embed is usually the heaviest thing on a marketing page.
- Do not embed something essential. A blocked or failed third-party frame leaves a hole the page cannot fill.

## Don’t

- For a screenshot or a clip hosted by us inside documentation → use `doc-frame`, which frames stills and clips and opens them full screen.
- For an image → use a plain `img` inside `frame-box`; an `iframe` for a picture costs a document load.
- For content we own and could render directly — an embed is a last resort, not a layout tool.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [doc-frame](doc-frame.md) — the documentation frame for stills and clips, not third-party documents.
- [frame-box](frame-box.md) — the frame drawn around the embedded document by whatever assembles the page; the embed draws none of its own.
- [media-split](media-split.md) — when the embed is one half of a copy-and-media band.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | `—` | true | URL of the document to embed. |
| `title` | `string` | `—` | true | Accessible name for the embedded document, announced before its content. |
| `ratio` | `'video' \| 'square' \| 'wide'` | `'video'` | false | Aspect ratio the frame holds while it scales. |

## States

- Visual states: `default`
- `data-ratio` mirrors the `ratio` prop and drives the frame's aspect ratio
- The frame reserves its aspect ratio before the document loads, so the page does not shift when it arrives

## Accessibility

- Visible focus: the embedded document manages focus inside itself; the frame adds no focusable element of its own.
- Keyboard map: `Tab` moves into the embedded document, which owns its own keyboard model. The frame intercepts nothing.
- ARIA: `title` is required and renders as the `iframe`'s `title` attribute — an `iframe` without one is announced as an unnamed frame, which is why the prop is not optional here.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the embedded document carries its own contrast; the frame contributes only its border.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the frame is static.
- Touch target ≥40×40 px — not applicable; any control belongs to the embedded document.

## Examples

### Default

```vue
<script setup>
  import Embed from '@aziontech/webkit/embed'
</script>

<template>
  <Embed
    src="data:text/html,<body style='margin:0;height:100vh;display:grid;place-items:center;font:1rem system-ui;color:gray'>Placeholder embed</body>"
    title="A placeholder document standing in for an embedded demo"
    ratio="video"
  />
</template>
```

### Ratios

```vue
<script setup>
  import Embed from '@aziontech/webkit/embed'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <Embed
      src="data:text/html,<body style='margin:0;height:100vh;display:grid;place-items:center;font:1rem system-ui;color:gray'>Placeholder embed</body>"
      title="A placeholder document in a 16:9 frame"
      ratio="video"
    />
    <Embed
      src="data:text/html,<body style='margin:0;height:100vh;display:grid;place-items:center;font:1rem system-ui;color:gray'>Placeholder embed</body>"
      title="A placeholder document in a square frame"
      ratio="square"
    />
    <Embed
      src="data:text/html,<body style='margin:0;height:100vh;display:grid;place-items:center;font:1rem system-ui;color:gray'>Placeholder embed</body>"
      title="A placeholder document in a 21:9 frame"
      ratio="wide"
    />
  </div>
</template>
```
