# Overflow Count

> A small `+N` chip that stands for the items a slot cannot show, and opens a popover with the whole list. It replaces the design sample's `DomainOverflowPopover`, the overflow badge of `TagListCell` and `WorkloadCell`, and the Console Kit's `OverflowCountButton`. The popover follows the overflow rule of `webkit-ux-heuristics`: a summary line (`12 domains`, `10 of 34 domains` while paged), a search box once the list holds more than 7 items, a scrolling list, a **Load N more** footer while items remain, a no-match line quoting the query, and a polite status region that announces the summary. Closing it clears the query and the paging.

- Import: `import OverflowCount from '@aziontech/webkit/overflow-count'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [overflow-count.json](https://github.com/aziontech/webkit/blob/main/.specs/overflow-count.json)

## When to use

- A table cell or a detail row shows the first value of a list and the rest hide behind a count: the domains of a workload, the tags of a row, the workloads a rule applies to.
- A card or a header names one item of many and the reader may want the full list without leaving the screen.

## Do

- Show the first item (or as many as fit) beside the chip; the chip counts only the hidden ones, and `items` passes only those.
- Name the items with `noun` (`{ one: 'domain', other: 'domains' }`) so the summary reads `12 domains`, not `12 items`.
- Give an item an `href` only when it opens something; an item without one renders as plain text.
- Use the `item` slot for a router link or a richer entry; keep every entry to one truncating line.

## Don’t

- The list is the content of the page → render it as a `Table` or an `Item` list.
- The reader picks from the list → use `Select`, `Combobox` or `MultiSelect`.
- A single count without a list behind it → use `Badge`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [table](table.md) — `Table.CellTags` and `Table.CellLink` put this chip after the values they fit.
- [tag](tag.md) — the chip is a small secondary `Tag`.
- [popover](popover.md) — the list opens in a `Popover`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `Array<string \| { label: string; href?: string }>` | `[]` | false | The hidden items. The chip reads `+<length>`; an item with `href` opens in a new tab. |
| `noun` | `string \| { one: string; other: string }` | `undefined` | false | What the items are, for the summary and the trigger's name. Empty uses the catalog (`item` / `items`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `item` |  | One list entry; replaces the built-in text or link. |

## States

- `data-state` on the trigger: `open` | `closed` (from `Popover`).
- Search shows when `items` holds more than 7 entries; Load more shows while entries beyond the loaded batches (10 per batch) match.
- Empty `items` renders nothing.

## Accessibility

- The trigger is a button named `Show all <count> <noun>` (the visible `+N` alone does not say what it counts); `aria-expanded` and `aria-controls` come from `Popover`.
- Keyboard: `Enter`/`Space` opens, `Esc` closes and returns focus to the chip, `Tab` moves through the search box, the links and Load more.
- A polite `role="status"` region announces the summary after a search or Load more.
- A link that opens a new tab carries a visually hidden `(opens in a new tab)`.
- Contrast: the secondary `Tag` and the muted summary meet 4.5:1 in both themes.

## Right-to-left

- Layout: logical utilities only; the external-link glyph sits at the inline end.
- Icons: `pi-external-link` and `pi-search` are not mirrored.
- Keyboard: unchanged.
- User data: each entry is wrapped in `dir="auto"` so a domain keeps its order inside right-to-left text.

## Internationalization

| Key                      | English source              | Override prop |
| ------------------------ | --------------------------- | ------------- |
| `overflowCount.noun`     | `item` / `items` (plural)   | `noun`        |
| `overflowCount.summary`  | `{count} {noun}`            | —             |
| `overflowCount.paged`    | `{shown} of {count} {noun}` | —             |
| `overflowCount.showAll`  | `Show all {count} {noun}`   | —             |
| `overflowCount.search`   | `Search`                    | —             |
| `overflowCount.noMatch`  | `Nothing matches “{query}”` | —             |
| `overflowCount.loadMore` | `Load {count} more`         | —             |
| `overflowCount.newTab`   | `(opens in a new tab)`      | —             |

- Formatting: counts go through the locale's number format.

## Responsive

- Container queries: none; the popover is `width="small"` (`--container-xs`).
- Narrow: the popover keeps its width and flips to fit (from `Popover`).
- Touch: the chip sits in a 24 px row; the popover entries are 28 px tall with their own padding.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import OverflowCount from '@aziontech/webkit/overflow-count'

  const domains = ['shop.example.com', 'api.example.com', 'img.example.com', 'docs.example.com']
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) min-w-0 items-center gap-(--spacing-xs)">
    <a
      :href="`https://${domains[0]}`"
      target="_blank"
      rel="noopener noreferrer"
      class="min-w-0 truncate text-body-sm text-(--text-default) underline-offset-2 hover:underline"
      >{{ domains[0] }}</a
    >
    <OverflowCount
      :items="domains.slice(1).map((label) => ({ label, href: `https://${label}` }))"
      :noun="{ one: 'domain', other: 'domains' }"
    />
  </div>
</template>
```

### Long list

```vue
<script setup>
  import OverflowCount from '@aziontech/webkit/overflow-count'

  const regions = ['north', 'south', 'east', 'west']
  const tiers = ['edge', 'core', 'cache', 'origin', 'shield', 'relay', 'gateway', 'store', 'queue']
  const tags = regions.flatMap((region) => tiers.map((tier) => `${region}-${tier}`)).slice(0, 34)
</script>

<template>
  <div class="flex items-center gap-(--spacing-xs)">
    <span class="text-body-sm text-(--text-default)">{{ tags[0] }}</span>
    <OverflowCount
      :items="tags.slice(1)"
      :noun="{ one: 'tag', other: 'tags' }"
    />
  </div>
</template>
```
