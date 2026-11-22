# Citation

> An inline reference in generated text (`[1]`), Cloudscape's inline citation: a small rounded chip holding the source's site (`azion.com`), or its title cut to fit, that links to item `n` of the `Sources` list or to the URL, with a tooltip naming the source and the accessible name `Source 1, azion.com: <title>`. `StreamingResponse` renders it for every `[n]`, filling `site` from the source's `href`.

- Import: `import Citation from '@aziontech/webkit/citation'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [citation.json](citation.json)

## When to use

- A statement in a generated response that comes from a specific source.

## Do

- Number in order of first use: [1], [2], [3]; the number stays in the accessible name.
- Give every citation a `title` and, for a web source, its `site`; a bare number tells a reader nothing.

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
| `title` | `string` | `''` | false | Title of the source, shown in the tooltip and read in the accessible name; the chip shows it, cut to fit, when `site` is empty. |
| `site` | `string` | `''` | false | Site of the source without `www.` (`example.com`), the text of the chip. |
| `href` | `string` | `''` | false | Where the reference points: `#<anchor>-source-<n>` for the `Sources` list under the response, or the source URL. Without it, or when it is unsafe (`javascript:`, `data:`), the chip is plain text. |

## Sub-components

_None. Exports: `"./citation"`. Composed DS components: `tooltip`._

## States

- With `href`: an `<a>` (external URLs open in a new tab); without: a `role="note"` span.
- Tooltip only when `title` is set.
- The chip text is `site`, else `title`, else the number; a long text is cut with an ellipsis (`max-w-48`).
- `data-slot="citation"` marks the chip, so `ChatMessage`'s Read aloud skips it; `data-linked` on a linked chip turns on the hover underline.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches a linked citation; `Enter` follows it; focus shows the tooltip.
- ARIA: `aria-label="Source 1, azion.com: Real-Time Purge"` — the number and the title, with the visible site first so the name contains the text on screen (WCAG 2.5.3). Without `site`: `Source 1: Real-Time Purge`.
- Touch target: inline text reference; exempt from the 24 px minimum as inline text (WCAG 2.5.8 exception).
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): renders the unlinked note.

## Right-to-left

- Layout: no margin of its own; the chip sits inline with the sentence and follows its direction. In a response (`StreamingResponse`), one normal space separates it from the word before, none from the punctuation after (`.` `,` `;` `:` `)`), and one space from the next chip.
- Icons: none.
- Keyboard: none.
- User data: the site is a hostname and the title the source's own; both render with the document direction.

## Internationalization

| Key                      | English source                    | Override prop |
| ------------------------ | --------------------------------- | ------------- |
| `citation.label`         | `Source {index}: {title}`         | —             |
| `citation.labelUntitled` | `Source {index}`                  | —             |
| `citation.labelWithSite` | `Source {index}, {site}: {title}` | —             |

- Formatting: the index through `Intl.NumberFormat`.

## Responsive

- Container queries: none: the chip is at most 12rem wide and cuts its text.
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
  <p class="max-w-(--container-md) text-body-lg text-(--text-default)">
    A purge reaches every data center in a few seconds
    <Citation
      :index="1"
      title="Real-Time Purge"
      site="azion.com"
      href="https://www.azion.com/en/documentation/"
    />, and cached objects are fetched again from the origin on the next request
    <Citation
      :index="2"
      title="HTTP Caching (RFC 9111)"
      site="w3.org"
      href="#cache-answer-source-2"
    />.
  </p>
</template>
```
