# Citation

> An inline numbered reference in generated text (`[1]`), Cloudscape's inline citation: a small superscript number that links to the source — to item `n` of the `Sources` list under the response, or straight to the URL — with a tooltip naming the source and an accessible name of `Source 1: <title>`. `StreamingResponse` renders it for every `[n]`; use it directly when you build responses yourself.

- Import: `import Citation from '@aziontech/webkit/citation'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [citation.json](https://github.com/aziontech/webkit/blob/main/.specs/citation.json)

## When to use

- A statement in a generated response that comes from a specific source.

## Do

- Number in order of first use: [1], [2], [3].
- Give every citation a `title`; a bare number tells a screen reader nothing.

## Don’t

- A link the reader is meant to follow as part of the prose → a normal link.
- Footnotes in documentation → `doc-prose` conventions.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [sources](sources.md) — the list citations point at.
- [streaming-response](streaming-response.md) — renders citations from `[n]` in Markdown.
- [tooltip](tooltip.md) — shows the source title.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `index` | `number` | `—` | true | 1-based number of the source, in the order the response first cites it. |
| `title` | `string` | `''` | false | Title of the source, shown in the tooltip and read in the accessible name. |
| `href` | `string` | `''` | false | Where the reference points: `#<anchor>-source-<n>` for the `Sources` list under the response, or the source URL. Without it the number is plain text. |

## Sub-components

_None. Exports: `"./citation"`. Composed DS components: `tooltip`._

## States

- With `href`: an `<a>` (external URLs open in a new tab); without: a `role="note"` span.
- Tooltip only when `title` is set.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches a linked citation; `Enter` follows it; focus shows the tooltip.
- ARIA: `aria-label="Source 1: Real-Time Purge"` (the visible digit alone is not a name).
- Touch target: inline text reference; exempt from the 24 px minimum as inline text (WCAG 2.5.8 exception).

## Right-to-left

- Layout: symmetric margins.
- Icons: none.
- Keyboard: none.
- User data: none.

## Internationalization

| Key                      | English source            | Override prop |
| ------------------------ | ------------------------- | ------------- |
| `citation.label`         | `Source {index}: {title}` | —             |
| `citation.labelUntitled` | `Source {index}`          | —             |

- Formatting: the index through `Intl.NumberFormat`.

## Responsive

- Container queries: none: fixed size.
- Narrow: unchanged.
- Touch: inline exception (see Accessibility).
- Reflow: inline.

## Examples

### Default

```vue
<script setup>
  import Citation from '@aziontech/webkit/citation'
</script>

<template>
  <p class="max-w-(--container-md) text-body-md text-(--text-default)">
    A purge reaches every edge location in a few seconds
    <Citation
      :index="1"
      title="Real-Time Purge"
      href="https://www.azion.com/en/documentation/"
    />, and cached objects are fetched again from the origin on the next request
    <Citation
      :index="2"
      title="Cache settings"
      href="#cache-answer-source-2"
    />.
  </p>
</template>
```
