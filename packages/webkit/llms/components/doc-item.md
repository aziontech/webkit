# Doc Item

> One row of the documentation's related-content list: a leading glyph in a framed 32px tile, the row's name, and the sentence that says what the thing is. When it has an `href` the title becomes an anchor stretched over the whole row — one tab stop, the full row as the hit area — closed by a trailing chevron, or a diagonal arrow when the destination leaves the documentation. The shell keeps `role="listitem"`, so a set of rows inside an `ItemList` is a real list to assistive technology.

- Import: `import DocItem from '@aziontech/webkit/doc-item'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-item.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-item.json)

## When to use

- The "Related products" band a page ends on — peer destinations where each entry needs a sentence to be understood.
- A one-column list of concepts or next steps, read at the page's own measure, with or without links.

## Do

- Keep the title to a noun phrase and let the sentence carry the verb; inline code in the sentence renders as the chip.
- Give every row of one list the same shape — all with glyphs or none, all linked or none — so the column reads as one object.
- Compose rows inside a `FrameBox` (with a solid surface) holding an `ItemList`: the frame draws the single box and the list draws full-width dividers, and the `role="list"` parent is what makes each row's `role="listitem"` valid.

## Don’t

- For a grid of scannable entries whose titles carry most of the meaning — use `DocCard` inside a `DocCardGroup`; a card claims a tile, a row claims one line.
- For an application resource list — compose `Item` and its parts directly; this row is documentation chrome.
- For a single call to action at the end of a page — that is a button, not a row.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocCard` — the cell counterpart. A card claims a whole tile; this claims one line.
- Item` / `ItemMedia` / `ItemContent` / `ItemTitle` / `ItemDescription` / `ItemActions` — the webkit anatomy this row composes.
- FrameBox` + `ItemList` — the documented group pattern: the page draws one framed surface holding an `ItemList`, and the list rules between the rows. There is no `DocItemGroup` in the package; the group is this composition.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | The row's name — what the reader is choosing. |
| `icon` | `string` | `''` | false | PrimeIcons class for the leading glyph. |
| `href` | `string` | `''` | false | Destination; when set the whole row becomes the link. |
| `target` | `'_self' \| '_blank'` | `'_self'` | false | Where the link opens. |
| `label` | `string` | `''` | false | Fallback copy when the default slot is empty. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The row's copy: one or two sentences of inline prose. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: `default`, `hover` and `focus-visible` — the last two exist only when the row is a link, and both are driven off the single title anchor via the shell's `has-[a:hover]` / `has-[a:focus-visible]` variants; a row with no `href` is inert
- The anchor appears on data, not on a mode prop: the title wraps in an anchor when `href` is set, and the trailing glyph region renders only then
- An external destination (absolute URL, `mailto:`, or explicit `target="_blank"`) swaps the chevron for the diagonal arrow and, for `target="_blank"`, adds `rel="noreferrer"`
- `data-doc-chrome` is the `DocProse` contract (prose rules stop at the row's edge)

## Accessibility

- Visible focus: the shell draws `has-[a:focus-visible]:ring-2` with `var(--ring-color)`, inset, so the whole row lights when its one anchor is focused; the anchor itself suppresses its own outline.
- Keyboard map: `Tab` reaches a linked row's title anchor — one stop per row; `Enter` follows it. A row with no `href` is not focusable and not announced as interactive.
- ARIA: `role="listitem"` lives on the shell, never on the anchor (axe `aria-allowed-role` forbids it there), so rows inside an `ItemList` with `role="list"` form a valid list. The anchor wraps only the title text, so the accessible name is the row's name with no duplicated `aria-label`; the stretched after-pseudo makes the whole row the pointer hit area without changing the accessible structure. Both glyphs are decorative (`aria-hidden`).
- A row that leaves the documentation carries `rel="noreferrer"` on `target="_blank"` and swaps the chevron for a diagonal arrow, so the destination change is visible and not colour-only.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: the full row is the hit area, comfortably over 40×40 px.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the chevron mirrors; the external-link arrow does not, but its hover nudge moves toward the end edge (`rtl:` flips the `translate-x`).
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import DocItem from '@aziontech/webkit/doc-item'
  import FrameBox from '@aziontech/webkit/frame-box'
  import ItemList from '@aziontech/webkit/item-list'
</script>

<template>
  <FrameBox class="w-full bg-(--bg-surface)">
    <ItemList>
      <DocItem
        title="Edge Functions"
        icon="pi pi-code"
        href="#edge-functions"
      >
        Build serverless applications on Azion's global network. Workloads integrate with functions
        natively, through a binding.
      </DocItem>
      <DocItem
        title="Edge SQL"
        icon="pi pi-database"
        href="#edge-sql"
      >
        Store relational data across the network. A workload reads it from the location that served
        the request.
      </DocItem>
      <DocItem
        title="Edge Cache"
        icon="pi pi-bolt"
        href="#edge-cache"
      >
        Decide what is cached, for how long, and by which key.
      </DocItem>
    </ItemList>
  </FrameBox>
</template>
```

### Variants

```vue
<script setup>
  import DocItem from '@aziontech/webkit/doc-item'
  import FrameBox from '@aziontech/webkit/frame-box'
  import ItemList from '@aziontech/webkit/item-list'
</script>

<template>
  <FrameBox class="w-full bg-(--bg-surface)">
    <ItemList>
      <DocItem
        title="Community templates"
        icon="pi pi-github"
        href="https://github.com/aziontech"
        target="_blank"
      >
        A row that leaves the documentation trades the chevron for a diagonal arrow.
      </DocItem>
      <DocItem
        title="Rule"
        icon="pi pi-filter"
      >
        With no href the row is inert — no hover, no anchor, no trailing arrow.
      </DocItem>
      <DocItem title="Binding">
        The glyph is optional too: a named connection from a function to the resource it reads.
      </DocItem>
    </ItemList>
  </FrameBox>
</template>
```
