# Doc Heading

> A documentation section heading that is also the link to itself. The whole text links to its own `anchor` (the heading's `id`), so a reader can copy the URL to the section; a rule under the text and a chain glyph after it appear on hover and keyboard focus without taking layout. The click goes through `useHeadingNavigation`, so the page decides how to scroll; with no page it falls back to the native hash jump. MDX renderers and hand-composed pages both render headings through it, so the two authoring paths cannot drift. Inside `DocLayout`, a level 2 or 3 heading with an `anchor` registers itself (through `useHeadingOutline`) as an entry of the layout's "On this page" rail, with its rendered text and its level, once it mounts, and leaves the rail when it unmounts; the page never lists its headings anywhere else.

- Import: `import DocHeading from '@aziontech/webkit/doc-heading'`
- Category: docs · Surface: docs · Structure: monolithic
- API as JSON: [doc-heading.json](doc-heading.json)

## When to use

- Use DocHeading only for h2/h3 inside documentation pages; a console page band uses SectionHeader.
- Every `h2`–`h4` on a docs page that the page rail lists.
- Section headings on a designed docs page composed in Vue.

## Do

- Give every heading a stable, slug-like `anchor`.
- Without an `anchor` the heading renders plain text with no anchor — a link to nowhere is never drawn — and stays out of the layout's outline; a page with no outline rail (the docs home) leaves its headings unanchored.

## Don’t

- For the page title — use `DocPageHeader`.
- On marketing pages — use `SectionTitle`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `DocOnThisPage` — the rail that points at the ids.
- `useHeadingNavigation` — the page-provided scroll handler.
- `DocProse` — skips `[data-doc-anchor]` in its link rules.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `level` | `1 \| 2 \| 3 \| 4` | `2` | false | Heading level; drives the tag and the prose type scale. |
| `anchor` | `string` | `''` | false | In-page anchor: the heading's id, what the page rail entry and the copied URL point at. Empty renders the heading without a link. |
| `label` | `string` | `''` | false | Fallback text when the default slot is empty. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The heading text. |

## States

- `data-doc-heading` mirrors `level` for the `DocProse` type scale.
- Hover and focus-visible reveal the underline and the link glyph.

## Accessibility

- A real `h1`–`h4`; the link name is the heading text (the glyph is `aria-hidden`).
- Keyboard: `Tab` reaches the link, `Enter` follows it; the focus outline is visible.
- The glyph meets 3:1 as a non-text indicator only when shown; the text keeps the heading colour.

## Right-to-left

- Layout: the glyph sits at the inline end (`ms-*`).
- Icons: `az-link` is not mirrored.
- Keyboard: unchanged.

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Responsive

- Plain inline flow, so a long heading wraps with the glyph trailing the last word.

## Examples

### Default

```vue
<script setup>
  import DocHeading from '@aziontech/webkit/doc-heading'
</script>

<template>
  <DocHeading
    anchor="purge-by-url"
    :level="2"
  >
    Purge by URL
  </DocHeading>
</template>
```

### Levels

```vue
<script setup>
  import DocHeading from '@aziontech/webkit/doc-heading'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <DocHeading
      anchor="cache"
      :level="1"
      label="Cache"
    />
    <DocHeading
      anchor="cache-rules"
      :level="2"
      label="Cache rules"
    />
    <DocHeading
      anchor="cache-keys"
      :level="3"
      label="Cache keys"
    />
    <DocHeading
      anchor="query-strings"
      :level="4"
      label="Query strings"
    />
  </div>
</template>
```
