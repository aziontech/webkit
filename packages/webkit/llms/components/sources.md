# Sources

> The sources a generative AI response drew on (ChatGPT's Sources, Cloudscape's sources section, AI Elements Sources): a small `Sources` pill with the overlapping marks of up to three cited sources that opens, in place, a `DropdownMenu` of link items, one per source. Sources the answer searched but did not cite (`cited: false`) are listed under More, after the Citations. The pill ends the message's action row (`ChatMessage.Actions` `#trailing`), on the same line as the actions. Each mark is the site's favicon (`image`), its icon, or its first letter on a colour of its own, so three sources never look alike.

- Import: `import Sources from '@aziontech/webkit/sources'`
- Category: ai · Surface: app · Structure: monolithic
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [sources.json](sources.json)

## When to use

- A response is grounded in documents, pages or records the reader may want to open or verify.

## Do

- Order items as the response first cites them, so `[1]` is item 1; put uncited items (`cited: false`) last so the numbers stay aligned.
- Use the page title as the title and the site's own name as `site` (`Azion`, `GitHub`); without `site` the host of `href` shows.
- Pass `publisher` and `publishedAt` when you have them.
- Keep the panel closed by default; the inline citations are the primary path.
- Give `image` the site's favicon URL when the app has one (from the search tool's result); otherwise `icon` for a site in the icon set, or nothing for the lettered mark.

## Don’t

- Related links that the response did not use → `help-panel` links or a plain list.
- A single source → cite it inline with `Citation`; a list of one is noise.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [citation](citation.md) — the inline chip whose numbers point at these items.
- [streaming-response](streaming-response.md) — renders the citations; pass it the same items.
- [chat-message](chat-message.md) — the pill goes in the `#trailing` slot of `ChatMessage.Actions`, after the icon actions.
- [dropdown-menu](dropdown-menu.md) — the menu the pill opens; its items draw every row.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `SourcesItem[]` | `[]` | false | The sources behind the response, in citation order; item `n` is what `[n]` points at. |
| `title` | `string` | `''` | false | Label of the pill that opens the panel. Empty shows `Sources` and names the pill with the count (`3 sources`). |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |

## Sub-components

_None. Data-driven: a source list is a record set the response already holds, like table rows.
Exports: `"./sources"`; exported type `SourcesItem` (`title`, `href?`, `description?`, `site?`,
`image?`, `icon?`, `publisher?`, `publishedAt?`, `cited?`) from `sources/types.ts`, shared with
`StreamingResponse` and `Citation`. Private parts: `parts/sources-mark.vue` draws one round mark
(also the leading slot of each menu item), and `parts/sources-item.vue` the `Citation` card row.
Composed DS components: `dropdown-menu` (`Trigger`, `Group`, `Item`)._

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                  |
| -------------- | --------- | ----------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | The panel's open state, by the pill, `Escape` or a press outside the panel. Unbound, the state is local and starts from `defaultOpen`. |

## States

- `data-state="open|closed"` on the root and the pill (an open pill keeps the hover fill); renders nothing when `items` is empty.
- The root is `display: contents` and the pill does not wrap (`whitespace-nowrap`, `shrink-0`), so it sits at the end of the action row.
- The pill's marks are the first three cited items (all items when none is cited).
- Panel: a `DropdownMenu` (`side="auto"`, `align="start"`) on every width, never a `Drawer`; it scrolls when taller than the room left.
- Row: one `DropdownMenu.Item` per source: `value` its index, `label` the title, `href` (a safe URL), `target="_blank"` for an external URL, the 24 px mark in `#leading`, and `description` the line `site · publisher · date` (medium date in the reader's locale; parts it lacks are left out; none, a one-line row). Hover, focus, the highlighted fill with its 2px inset gap, padding and type are the menu item's; no underline. The item `description` (snippet) is not drawn.
- Groups: when some items have `cited: false`, the menu shows a Citations and a More `DropdownMenu.Group` with their labels and divider; otherwise one unlabelled group.
- Mark: favicon (`image`, a safe URL), else `icon`, else the first letter of the site on one of seven `--chart-series-*` colours picked by a stable hash of the host; a favicon that fails to load falls back to the letter.

## Accessibility

- Visible focus: the pill shows `focus-visible:ring-2 focus-visible:ring-(--ring-color)`; rows show the menu item's inset ring.
- Keyboard map: `DropdownMenu`'s: `Enter` / `Space` / `Down` on the pill opens and focuses the first source, `Up` the last; `Down` / `Up` / `Home` / `End` and typeahead move; `Enter` opens the link; `Escape` closes and returns focus to the pill; `Tab` closes.
- ARIA: the pill is a `button` with `aria-haspopup="menu"` and `aria-expanded`, named `3 sources` (it holds the visible `Sources`, WCAG 2.5.3) or by `title`; the marks are `aria-hidden`; the `menu` is labelled by the pill; each source is a link `menuitem` named by its title and described by its meta line; groups are `role="group"` named Citations or More.
- Touch: the 32 px pill carries an invisible 44 px hit area on coarse pointers.
- External links open in a new tab (`target="_blank"` on the item: `rel`, glyph and `common.newTab` hint).
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): a plain item; an unsafe `image` is dropped.
- Contrast: the letter is `--text-default` on a 30% tint; the series ring is a solid mark (Lc 30).

## Right-to-left

- Layout: logical utilities; the marks overlap toward the inline end (`-ms`); rows and the menu follow `DropdownMenu`.
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

- Formatting: `Intl.PluralRules` and `Intl.NumberFormat` through `t()`; `publishedAt` with `Intl.DateTimeFormat` (`dateStyle: 'medium'`), a date-only string kept on its day.

## Responsive

- Container queries: none.
- Narrow: the menu stays anchored and within the viewport; titles and meta lines cut at two lines.
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
      icon: 'az az-azion',
      publisher: 'Azion Technologies',
      publishedAt: '2026-03-02'
    },
    {
      title: 'aziontech/azion: the Azion command line',
      href: 'https://github.com/aziontech/azion',
      description: 'Purge URLs, wildcards and cache keys from a terminal.',
      site: 'GitHub',
      icon: 'az az-github',
      publisher: 'aziontech'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/',
      description: 'How caches store responses and when they must ask the origin again.',
      publisher: 'World Wide Web Consortium',
      publishedAt: '2022-06-01'
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
      icon: 'az az-azion',
      publisher: 'Azion Technologies',
      publishedAt: '2026-03-02'
    },
    {
      title: 'aziontech/azion: the Azion command line',
      href: 'https://github.com/aziontech/azion',
      description: 'Purge URLs, wildcards and cache keys from a terminal.',
      site: 'GitHub',
      icon: 'az az-github',
      publisher: 'aziontech'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/',
      description: 'How caches store responses and when they must ask the origin again.',
      publisher: 'World Wide Web Consortium',
      publishedAt: '2022-06-01'
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
