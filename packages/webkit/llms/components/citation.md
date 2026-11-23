# Citation

> An inline reference in generated text, the inline citation of ChatGPT and Cloudscape: a small rounded chip with the mark of the source's site (its favicon, its icon, or its first letter on a colour of its own) and the site's name (`Azion`, else the host of `href` without `www.`), and `+N` when one marker cites several sources (`[1][2]`, `[1, 2]`). Hovering, focusing or pressing the chip opens a card with the site, the linked title and a snippet (`description`); with several sources a pager `‹ 1/3 ›` steps through them. `StreamingResponse` renders it for every run of `[n]` markers.

- Import: `import Citation from '@aziontech/webkit/citation'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [citation.json](citation.json)

## When to use

- A statement in a generated response that comes from one or more specific sources.

## Do

- Number in order of first use: [1], [2], [3]; the numbers stay in the accessible name.
- Give each web source a `site` name (`Azion`, `GitHub`) and, when you have one, its favicon as `image`; a bare host reads as a URL.
- Keep `description` to a sentence or two of the page; the card cuts it at three lines.

## Don’t

- A link the reader is meant to follow as part of the prose → a normal link.
- Footnotes in documentation → `doc-prose` conventions.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [sources](sources.md) — the pill and panel that list every source of the response.
- [streaming-response](streaming-response.md) — renders citations from `[n]` in Markdown.
- [hover-card](hover-card.md) — the card a chip opens.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `indexes` | `number[]` | `—` | true | 1-based numbers of the sources this reference cites, in order: `[1]` gives `[1]`, `[1][3]` and `[1, 3]` give `[1, 3]`. |
| `sources` | `SourcesItem[]` | `[]` | false | The sources of the response, in citation order; `indexes` point into it. A number with no source renders as a plain numbered note. |

## Sub-components

_None. Exports: `"./citation"`. Composed DS components: `hover-card`, `icon-button`, and the
`sources` mark part (`sources/parts/sources-mark.vue`)._

## States

- A chip is a `button` that opens the card: after 300 ms of hover or focus, at once on a press; a mouse press keeps it open, a touch or keyboard press toggles it. `Escape`, a press outside or moving the pointer away closes it.
- `data-state="open|closed"` on the chip; `data-slot="citation"` on the root, so `ChatMessage`'s Read aloud skips it.
- The chip text is the first source's site name (else its host, else its title), cut with an ellipsis at `max-w-48`; `+N` counts the other sources.
- The card shows one source at a time: mark and site name, the title (a link when `href` is safe; external URLs open in a new tab), the `description` cut at three lines. With more than one source, previous and next buttons and `1/3`; they disable at the ends, and the card starts at the first source each time it opens.
- No resolvable source: a `role="note"` chip with the numbers and no card.
- The mark is the source's `image` (favicon), else its `icon`, else its first letter on one of seven chart series colours picked by a stable hash of the host, so neighbouring sites rarely share a colour. A favicon that fails to load falls back to the letter.

## Accessibility

- Visible focus: the chip, the card link and the pager buttons show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches the chip and opens the card after the delay; `Enter` / `Space` toggles it; `Tab` from an open chip moves into the card (link, previous, next); `Escape` closes it and returns focus to the chip.
- ARIA: the chip is named with the site first so the name holds the visible text (WCAG 2.5.3): `Source 1, Azion: Real-Time Purge`, `Azion +2, sources 1, 2, 3`, or `Source 1: <title>` without a site; it carries `aria-expanded` and, while open, `aria-controls` and `aria-describedby` to the card. The marks are `aria-hidden`; the pager position is `aria-live="polite"`.
- Touch target: inline text reference; exempt from the 24 px minimum as inline text (WCAG 2.5.8 exception).
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`) or `image`: the title is plain text, the mark falls back to the icon or letter.
- Contrast: the letter is `--text-default` on a 30% tint, well above Lc 60; the series ring is a solid mark (Lc 30).

## Right-to-left

- Layout: logical padding; the mark sits at the inline start of the chip and the card. In a response (`StreamingResponse`), one normal space separates the chip from the word before, none from the punctuation after (`.` `,` `;` `:` `)`).
- Icons: the pager chevrons mirror (directional glyphs); site icons and favicons do not.
- Keyboard: none.
- User data: site names and titles render with the document direction.

## Internationalization

| Key                      | English source                      | Override prop |
| ------------------------ | ----------------------------------- | ------------- |
| `citation.label`         | `Source {index}: {title}`           | —             |
| `citation.labelMany`     | `{site} +{more}, sources {indexes}` | —             |
| `citation.labelUntitled` | `Source {index}`                    | —             |
| `citation.labelWithSite` | `Source {index}, {site}: {title}`   | —             |
| `citation.next`          | `Next source`                       | —             |
| `citation.page`          | `{current}/{total}`                 | —             |
| `citation.previous`      | `Previous source`                   | —             |

- Formatting: numbers through `Intl.NumberFormat`.

## Responsive

- Container queries: none: the chip is at most 12rem wide and cuts its text; the card is at most `--container-xs` and fits the viewport.
- Narrow: unchanged.
- Touch: a tap toggles the card (hover is ignored for touch); a tap outside closes it.
- Reflow: inline.

## Examples

### Default

```vue
<script setup>
  import Citation from '@aziontech/webkit/citation'

  const sources = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Removes a cached object from every data center in a few seconds.',
      site: 'Azion',
      icon: 'az az-azion'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/',
      description: 'How caches store responses and when they must ask the origin again.',
      site: 'W3C'
    },
    {
      title: 'aziontech/azion: the Azion command line',
      href: 'https://github.com/aziontech/azion',
      description: 'Purge URLs, wildcards and cache keys from a terminal.',
      site: 'GitHub',
      icon: 'az az-github'
    }
  ]
</script>

<template>
  <p class="max-w-(--container-md) text-body-lg text-(--text-default)">
    A purge reaches every data center in a few seconds
    <Citation
      :indexes="[1]"
      :sources="sources"
    />, and the next request fetches the object from the origin again
    <Citation
      :indexes="[2, 3]"
      :sources="sources"
    />.
  </p>
</template>
```
