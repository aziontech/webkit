# Sources

> The sources a generative AI response drew on (Cloudscape's sources section, AI Elements Sources): a rounded `Sources` pill with the overlapping marks of up to three sources (the item's `icon` or its site's first letter) that opens an ordered list — mark, linked title, description or site. It ends the message's action row (`ChatMessage.Actions` `#trailing`). Item `n` has the id `<anchor>-source-<n>`, the target of `StreamingResponse`'s `[n]` citations; following one opens the list and brings the item into view.

- Import: `import Sources from '@aziontech/webkit/sources'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [sources.json](sources.json)

## When to use

- A response is grounded in documents, pages or records the reader may want to open or verify.

## Do

- Order items as the response first cites them, so `[1]` is item 1.
- Use the page title, not the URL, as the title; the site shows on its own from `href`, so the description is for the section (`Azion documentation · Cache`).
- Give `icon` only for a site whose glyph is in the icon set (`az az-github`).
- Keep the list collapsed by default; the inline citations are the primary path.

## Don’t

- Related links that the response did not use → `help-panel` links or a plain list.
- A single source → cite it inline with a link; a list of one is noise.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [citation](citation.md) — the inline `[n]` that points here.
- [streaming-response](streaming-response.md) — renders the citations; share the `anchor`.
- [chat-message](chat-message.md) — the pill goes in the `#trailing` slot of `ChatMessage.Actions`, after the icon actions.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `SourcesItem[]` | `[]` | false | The sources behind the response, in citation order; item `n` is what `[n]` points at. |
| `anchor` | `string` | `''` | false | Id prefix of the list items (`<anchor>-source-<n>`); pass the same value to `StreamingResponse` so its citations link here. |
| `title` | `string` | `''` | false | Label of the pill that opens the list. Empty shows `Sources` and names the pill with the count (`3 sources`). |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `open` | `boolean` | `undefined as never` | false | Two-way value (`v-model:open`). |

## Sub-components

_None. Data-driven: a source list is a record set the response already holds, like table rows.
Exports: `"./sources"`; exported type `SourcesItem` (`title`, `href?`, `description?`, `icon?`) from `sources/types.ts`,
shared with `StreamingResponse`. A private part, `parts/sources-mark.vue`, draws one round mark._

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                        |
| -------------- | --------- | ----------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Expanded or collapsed, by the trigger or by following a citation. Unbound, the state is local and starts from `defaultOpen`. |

## States

- `data-state="open|closed"` on the root and the pill (an open pill keeps the hover fill); renders nothing when `items` is empty.
- The root is `display: contents`, so in a wrapping row (`ChatMessage.Actions`) the pill sits in the row and the open list takes the full width under it.
- Following a `#<anchor>-source-<n>` link (`hashchange`) opens the list and scrolls the item into view.

## Accessibility

- Visible focus: trigger, links and the targeted item show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` to the trigger, `Enter` / `Space` toggles; `Tab` through the links.
- ARIA: `button` with `aria-expanded` / `aria-controls`, named `3 sources` (it holds the visible `Sources`, WCAG 2.5.3) or by `title`; the marks are `aria-hidden`; the list is an `<ol aria-label="Sources">` so numbers are announced by position.
- Touch: the 32 px pill carries an invisible 44 px hit area on coarse pointers.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): shows the title as plain text.

## Right-to-left

- Layout: logical utilities; the marks overlap toward the inline end (`-ms`), the mark sits at the inline start of each row.
- Icons: site glyphs are not mirrored.
- Keyboard: none.
- User data: titles render with the document direction.

## Internationalization

| Key             | English source               | Override prop |
| --------------- | ---------------------------- | ------------- |
| `sources.count` | `{count} source(s)` (plural) | `title`       |
| `sources.label` | `Sources`                    | `title`       |

- Formatting: `Intl.PluralRules` and `Intl.NumberFormat` through `t()`.

## Responsive

- Container queries: none.
- Narrow: titles and descriptions truncate with an ellipsis.
- Touch: the pill has a 44 px hit area on coarse pointers; list rows are 40 px tall.
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
      description: 'Azion documentation · Cache'
    },
    {
      title: 'aziontech/azion: the Azion command line',
      href: 'https://github.com/aziontech/azion',
      icon: 'az az-github'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/'
    }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <Sources
      :items="items"
      anchor="purge-answer"
    />
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
      description: 'Azion documentation · Cache'
    },
    {
      title: 'aziontech/azion: the Azion command line',
      href: 'https://github.com/aziontech/azion',
      icon: 'az az-github'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/'
    }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <Sources
      :items="items"
      anchor="purge-answer"
      default-open
    />
  </div>
</template>
```
