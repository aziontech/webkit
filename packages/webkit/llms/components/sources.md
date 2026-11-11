# Sources

> The list of sources a generative AI response drew on (Cloudscape's sources expandable section, AI Elements Sources): a disclosure titled `3 sources` that opens an ordered list — number, linked title, one-line description. Item `n` carries the id `<anchor>-source-<n>`, the target of the `[n]` citations `StreamingResponse` renders; following a citation opens the list and brings the item into view.

- Import: `import Sources from '@aziontech/webkit/sources'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [sources.json](https://github.com/aziontech/webkit/blob/main/.specs/sources.json)

## When to use

- A response is grounded in documents, pages or records the reader may want to open or verify.

## Do

- Order items as the response first cites them, so `[1]` is item 1.
- Use the page title, not the URL, as the title; add the site or section as the description.
- Keep the list collapsed by default; the inline citations are the primary path.

## Don’t

- Related links that the response did not use → `help-panel` links or a plain list.
- A single source → cite it inline with a link; a list of one is noise.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [citation](citation.md) — the inline `[n]` that points here.
- [streaming-response](streaming-response.md) — renders the citations; share the `anchor`.
- [chat-message](chat-message.md) — sources sit inside the assistant message, under the response.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `AiSource[]` | `[]` | false | The sources behind the response, in citation order; item `n` is what `[n]` points at. |
| `anchor` | `string` | `''` | false | Id prefix of the list items (`<anchor>-source-<n>`); pass the same value to `StreamingResponse` so its citations link here. |
| `title` | `string` | `''` | false | Heading of the disclosure. Empty uses the locale catalog (`3 sources`). |
| `open` | `boolean` | `undefined` | false | Controlled open state. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:open` | `boolean` |  |

## Sub-components

_None. Data-driven: a source list is a record set the response already holds, like table rows.
Exports: `"./sources"`; exported type `AiSource` (`title`, `href?`, `description?`) from `sources/types.ts`,
shared with `StreamingResponse`._

## States

- `data-state="open|closed"`; renders nothing when `items` is empty.
- Following a `#<anchor>-source-<n>` link (`hashchange`) opens the list and scrolls the item into view.

## Accessibility

- Visible focus: trigger, links and the targeted item show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` to the trigger, `Enter` / `Space` toggles; `Tab` through the links.
- ARIA: `button` with `aria-expanded` / `aria-controls`; the list is an `<ol aria-label="Sources">` so numbers are announced by position; the visual number chip is `aria-hidden`.
- External links open in a new tab with `rel="noopener noreferrer"`.

## Right-to-left

- Layout: logical utilities; the number chip sits at the inline start.
- Icons: book and chevron-down are not mirrored.
- Keyboard: none.
- User data: titles render with the document direction.

## Internationalization

| Key             | English source                  | Override prop |
| --------------- | ------------------------------- | ------------- |
| `sources.count` | `{count} source(s)` (plural)    | `title`       |
| `sources.label` | `Sources`                       | —             |

- Formatting: `Intl.PluralRules` and `Intl.NumberFormat` through `t()`.

## Responsive

- Container queries: none.
- Narrow: titles and descriptions truncate with an ellipsis.
- Touch: links are text-sized inside 24 px rows.
- Reflow: no horizontal scroll.

## Examples

### Default

```vue
<script setup>
  import Sources from '@aziontech/webkit/sources'

  const items = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Cache'
    },
    {
      title: 'Cache settings',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Applications'
    },
    {
      title: 'Purge by wildcard',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Cache'
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
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Cache'
    },
    {
      title: 'Cache settings',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Applications'
    },
    {
      title: 'Purge by wildcard',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Azion documentation · Cache'
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
