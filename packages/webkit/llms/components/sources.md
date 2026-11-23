# Sources

> The sources a generative AI response drew on (ChatGPT's Sources, Cloudscape's sources section, AI Elements Sources): a small `Sources` pill with the overlapping marks of up to three cited sources that opens a panel listing every source — mark, site name, linked title and snippet. The panel is a side `Drawer` from the end on wide screens (non-modal, the answer stays readable beside it) and a bottom sheet on a phone. Sources the answer searched but did not cite (`cited: false`) are listed under More, after the Citations. The pill ends the message's action row (`ChatMessage.Actions` `#trailing`), on the same line as the actions. Each mark is the site's favicon (`image`), its icon, or its first letter on a colour of its own, so three sources never look alike.

- Import: `import Sources from '@aziontech/webkit/sources'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [sources.json](sources.json)

## When to use

- A response is grounded in documents, pages or records the reader may want to open or verify.

## Do

- Order items as the response first cites them, so `[1]` is item 1; put uncited items (`cited: false`) last so the numbers stay aligned.
- Use the page title as the title and the site's own name as `site` (`Azion`, `GitHub`); without `site` the host of `href` shows.
- Give `image` the site's favicon URL when the app has one (from the search tool's result); otherwise `icon` for a site in the icon set, or nothing for the lettered mark.
- Keep the panel closed by default; the inline citations are the primary path.

## Don’t

- Related links that the response did not use → `help-panel` links or a plain list.
- A single source → cite it inline with `Citation`; a list of one is noise.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [citation](citation.md) — the inline chip whose numbers point at these items.
- [streaming-response](streaming-response.md) — renders the citations; pass it the same items.
- [chat-message](chat-message.md) — the pill goes in the `#trailing` slot of `ChatMessage.Actions`, after the icon actions.
- [drawer](drawer.md) — the panel the pill opens.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `SourcesItem[]` | `[]` | false | The sources behind the response, in citation order; item `n` is what `[n]` points at. |
| `title` | `string` | `''` | false | Label of the pill that opens the panel. Empty shows `Sources` and names the pill with the count (`3 sources`). |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `open` | `boolean` | `undefined as never` | false | Two-way value (`v-model:open`). |

## Sub-components

_None. Data-driven: a source list is a record set the response already holds, like table rows.
Exports: `"./sources"`; exported type `SourcesItem` (`title`, `href?`, `description?`, `site?`,
`image?`, `icon?`, `cited?`) from `sources/types.ts`, shared with `StreamingResponse` and `Citation`.
Private parts: `parts/sources-mark.vue` draws one round mark (also used by `Citation`), and
`parts/sources-panel.vue` holds the panel, loaded on demand. Composed DS components: `drawer`._

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                 |
| -------------- | --------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | The panel's open state, by the pill, the panel's close button, `Escape` or a press on the overlay (phone). Unbound, the state is local and starts from `defaultOpen`. |

## States

- `data-state="open|closed"` on the root and the pill (an open pill keeps the hover fill); renders nothing when `items` is empty.
- The root is `display: contents` and the pill does not wrap (`whitespace-nowrap`, `shrink-0`), so it sits at the end of the action row.
- The pill's marks are the first three cited items (all items when none is cited).
- Panel: from `md` a non-modal side `Drawer` (`size="small"`, from the end); below `md` the `Drawer`'s bottom sheet, modal. Its title is the pill's label.
- Groups: when some items have `cited: false`, the panel shows a Citations section and a More section with headings; otherwise one unheaded list.
- Mark: favicon (`image`, a safe URL), else `icon`, else the first letter of the site on one of seven `--chart-series-*` colours picked by a stable hash of the host; a favicon that fails to load falls back to the letter.

## Accessibility

- Visible focus: the pill and the links show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` to the pill, `Enter` / `Space` opens the panel and moves focus into it; `Tab` through the links and the close button; `Escape` closes it and returns focus to the pill.
- ARIA: the pill is a `button` with `aria-haspopup="dialog"` and `aria-expanded`, named `3 sources` (it holds the visible `Sources`, WCAG 2.5.3) or by `title`; the marks are `aria-hidden`; the panel is the `Drawer`'s `dialog`, titled by the pill's label; each group is a `section` named Citations or More (or Sources when there is one group) holding an `<ol>`.
- Touch: the 32 px pill carries an invisible 44 px hit area on coarse pointers.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): shows the title as plain text; an unsafe `image` is dropped.
- Contrast: the letter is `--text-default` on a 30% tint; the series ring is a solid mark (Lc 30).

## Right-to-left

- Layout: logical utilities; the marks overlap toward the inline end (`-ms`), the mark sits at the inline start of each row; the side panel opens from the inline end.
- Icons: site glyphs and favicons are not mirrored.
- Keyboard: none.
- User data: site names, titles and snippets render with the document direction.

## Internationalization

| Key             | English source               | Override prop |
| --------------- | ---------------------------- | ------------- |
| `sources.cited` | `Citations`                  | —             |
| `sources.count` | `{count} source(s)` (plural) | `title`       |
| `sources.label` | `Sources`                    | `title`       |
| `sources.more`  | `More`                       | —             |

- Formatting: `Intl.PluralRules` and `Intl.NumberFormat` through `t()`.

## Responsive

- Container queries: none.
- Narrow: below `md` the panel is the `Drawer`'s bottom sheet (full screen below `sm`); titles and snippets cut at two lines.
- Touch: the pill has a 44 px hit area on coarse pointers.
- Reflow: no horizontal scroll.

## Examples

### Default

```vue
<script setup>
  import Sources from '@aziontech/webkit/sources'

  const items = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/products/cache/real-time-purge/',
      description: 'Removes a cached object from every data center in a few seconds.',
      site: 'Azion',
      icon: 'az az-azion'
    },
    {
      title: 'aziontech/azion: the Azion command line',
      href: 'https://github.com/aziontech/azion',
      description: 'Purge URLs, wildcards and cache keys from a terminal.',
      site: 'GitHub',
      icon: 'az az-github'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/',
      description: 'How caches store responses and when they must ask the origin again.'
    },
    {
      title: 'Cache-Control',
      href: 'https://www.npmjs.com/package/cache-control',
      description: 'A package that writes Cache-Control headers.',
      cited: false
    }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <Sources :items="items" />
  </div>
</template>
```

### Open

```vue
<script setup>
  import Sources from '@aziontech/webkit/sources'

  const items = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/products/cache/real-time-purge/',
      description: 'Removes a cached object from every data center in a few seconds.',
      site: 'Azion',
      icon: 'az az-azion'
    },
    {
      title: 'aziontech/azion: the Azion command line',
      href: 'https://github.com/aziontech/azion',
      description: 'Purge URLs, wildcards and cache keys from a terminal.',
      site: 'GitHub',
      icon: 'az az-github'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/',
      description: 'How caches store responses and when they must ask the origin again.'
    },
    {
      title: 'Cache-Control',
      href: 'https://www.npmjs.com/package/cache-control',
      description: 'A package that writes Cache-Control headers.',
      cited: false
    }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <Sources
      :items="items"
      default-open
    />
  </div>
</template>
```
