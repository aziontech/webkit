# Item

> Versatile flex row for title, description, media, and actions. Mirrors the shadcn-vue Item anatomy so consumers can reorder or omit regions. Compose with `ItemGroup` for gapped off-card lists, `ItemList` for divided in-card lists (inside a `Card`), and `ItemSeparator` between rows. Reference: https://www.shadcn-vue.com/docs/components/item (adapted to Webkit tokens and naming).

- Import: `import ItemRoot from '@aziontech/webkit/item-root'`
- Compound import (dot notation, not tree-shakeable): `import Item from '@aziontech/webkit/item'`
- Category: content · Surface: product · Structure: composition
- API as JSON: [item.json](https://github.com/aziontech/webkit/blob/main/.specs/item.json)

## When to use

- A row that pairs a title and description with leading media (icon, avatar, image) and trailing actions — settings entries, team members, next steps, notifications.
- A list of such rows: `Item.Group` for gapped rows off a card, `Item.List` for divided rows inside a `card`.
- A whole row that is one link or button — set `as-child` and pass a single `a` / `button` as the item's child.

## Do

- Use `Item.Group` off-card and `Item.List` inside a `card` with `:padded="false"`; both force their child items' `kind` (`inline` in a group, `default` in a list), so do not set `kind` on rows inside them.
- Item.List` draws its own dividers — do not add `Item.Separator` inside it.
- With `as-child`, pass exactly one child element; the row's hover, active and focus ring move onto it, so do not also put buttons inside that row.
- Set `Item.Media` `kind="icon"` for a glyph and `kind="image"` for a picture; the frame sizes and clips the content.
- Use `size="small"` for dense lists; `medium` is the default.

## Don’t

- Records that share columns and need sorting, selection or paging → use `table`.
- Hierarchical navigation rows in a sidebar → use `menu`.
- A grid of selectable option cards → use `radio-cards`.
- A single surface that frames arbitrary content → use `card`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [card](card.md) — the surface an `Item.List` sits in (with `:padded="false"`).
- [table](table.md) — columnar data; below `sm`, `listing-table` swaps its table rows for `item` rows.
- [menu](menu.md) — navigation rows with nesting and drill levels.
- [avatar](avatar.md) — the usual leading media for people rows inside `Item.Media`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'default' \| 'outlined' \| 'muted' \| 'inline'` | `'default'` | false | Item root surface variant. `inline` removes the row's outer padding (transparent surface) for inline placement and divided in-card lists. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Item root density (padding and gap). |
| `asChild` | `boolean` | `false` | false | Merge row layout and interactive-state classes onto the single default-slot child (e.g. anchor). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Every sub-component exposes `default` for its region. |

## Sub-component imports

- `@aziontech/webkit/item-group`
- `@aziontech/webkit/item-list`
- `@aziontech/webkit/item-separator`
- `@aziontech/webkit/item-media`
- `@aziontech/webkit/item-content`
- `@aziontech/webkit/item-title`
- `@aziontech/webkit/item-description`
- `@aziontech/webkit/item-actions`
- `@aziontech/webkit/item-header`
- `@aziontech/webkit/item-footer`

## Sub-components

- `item.vue` — Root row container (`kind`, `size`).
- `item-group.vue` — Vertical list wrapper (`role="list"`) with a gap between rows; for off-card lists. Forces its descendant Items to render inline (no per-item surface or padding) to avoid a box-in-box effect.
- `item-list.vue` — Vertical list wrapper (`role="list"`) that draws full-width dividers between rows and no gap; for in-card lists (inside a `Card` with `padded=false`). Forces its descendant Items to the `default` kind (padded rows, transparent surface, no per-item border) to avoid a box-in-box effect.
- `item-separator.vue` — Horizontal divider between rows in a group.
- `item-media.vue` — Leading media slot (`kind` for icon/image frames).
- `item-content.vue` — Main text column (title + description).
- `item-title.vue` — Primary label line.
- `item-description.vue` — Secondary muted line.
- `item-actions.vue` — Trailing actions cluster.
- `item-header.vue` — Optional top band (e.g. cover image).
- `item-footer.vue` — Optional bottom band.

## States

- Visual states on Item shell: `default` only, **except with `asChild`**, where the merged child (the whole-row link/button) gains row-level `hover`, `active`, and `focus-visible`
- Without `asChild`, slotted controls (`Button`, `a`, etc.) own hover, active, and `focus-visible`
- `data-kind` on Item root: `default` | `outlined` | `muted` | `inline` (an Item inside `ItemGroup` is forced to `inline`; inside `ItemList` to `default`)
- `data-size` on Item root: `small` | `medium`
- `data-kind` on ItemMedia: `default` | `icon` | `image`

## Accessibility

- Visible focus: on slotted links and buttons. The Item shell draws no focus ring on its own, except with `asChild`, where the merged focusable child (e.g. an anchor) receives the `focus-visible` ring (`focus-visible:ring-2 focus-visible:ring-(--ring-color)`) and hover/active feedback.
- Keyboard map: slotted links and buttons supply Tab order; use `asChild` to merge layout onto a single focusable child when the whole row is a link.
- ARIA: `ItemGroup` uses `role="list"`; consumers may set `role="listitem"` on Item when inside a list; `ItemSeparator` uses `role="separator"`.
- Contrast ≥4.5:1 for title and description text.
- `motion-reduce:transition-none` on color transitions.
- Touch target ≥40×40 px on slotted actions (owned by children).

## Examples

### Default

```vue
<script setup>
  import Item from '@aziontech/webkit/item'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Item>
    <Item.Content>
      <Item.Title>Basic Item</Item.Title>
      <Item.Description>A simple item with title and description.</Item.Description>
    </Item.Content>
    <Item.Actions>
      <Button
        label="Action"
        kind="outlined"
        size="small"
      />
    </Item.Actions>
  </Item>
</template>
```

### Outline

```vue
<script setup>
  import Item from '@aziontech/webkit/item'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Item kind="outlined">
    <Item.Content>
      <Item.Title>Basic Item</Item.Title>
      <Item.Description>A simple item with title and description.</Item.Description>
    </Item.Content>
    <Item.Actions>
      <Button
        label="Action"
        kind="outlined"
        size="small"
      />
    </Item.Actions>
  </Item>
</template>
```

### Muted

```vue
<script setup>
  import Item from '@aziontech/webkit/item'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Item kind="muted">
    <Item.Content>
      <Item.Title>Basic Item</Item.Title>
      <Item.Description>A simple item with title and description.</Item.Description>
    </Item.Content>
    <Item.Actions>
      <Button
        label="Action"
        kind="outlined"
        size="small"
      />
    </Item.Actions>
  </Item>
</template>
```
