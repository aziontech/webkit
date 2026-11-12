# Cards

> A collection shown as cards, after Cloudscape's cards: one card per item, named by its `header` slot, with the item's fields in the default slot. It shares Table's item and selection model — `items`, `trackBy`, `selectedKeys` — so `useCollection` binds it through `cardsProps`, and selection (single or multi, with a visible select-all) survives paging. Four cards a row in a wide container, then three, two and one as the container narrows.

- Import: `import Cards from '@aziontech/webkit/cards'`
- Category: data · Surface: product · Structure: monolithic
- API as JSON: [cards.json](https://github.com/aziontech/webkit/blob/main/.specs/cards.json)

## When to use

- Items people recognise by a few fields or a picture rather than compare column by column (applications, templates, environments).
- The card form of a list page (`platform/view/card-view`), filtered and paged by `useCollection`.

## Do

- Put the item's name, as a link to the item, in the `header` slot: it also names the selection control.
- Keep each card to a handful of label and value pairs; let `collection-preferences` choose which.
- Use `selectionMode="multi"` only when a bulk action exists next to the list.

## Don’t

- Records compared, sorted or scanned across many fields → use `table`.
- A fixed marketing grid of features or links → use `card-grid`.
- A single content box → use `card`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- use-collection` — filters, pages and selects; `cardsProps` is the binding.
- [table](table.md) — the same collection as rows; same item and selection model.
- [property-filter](property-filter.md), `collection-preferences`, `pagination` — the controls around it.
- [card](card.md) — one standalone card.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `Record<string, unknown>[]` | `[]` | false | The items, one card each. |
| `trackBy` | `string` | `'id'` | false | Field that identifies an item; selection keys read it. |
| `selectionMode` | `'none' \| 'single' \| 'multi'` | `'none'` | false | No selection, one card, or several cards with a select-all above them. |
| `loading` | `boolean` | `false` | false | Shows placeholder cards and sets aria-busy while true. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list. Empty uses the locale catalog. |
| `selectedKeys` | `string[]` | `() => []` | false | Two-way value (`v-model:selectedKeys`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `header` | { item: Record<string, unknown>; index: number; selected: boolean } | Card title; names the card and its selection control. |
| `default` | { item: Record<string, unknown>; index: number; selected: boolean } | Card body: the item's fields. |
| `empty` | — | Shown when there are no items. |

## v-model

- **`v-model:selected-keys`** — `string[]`, default `[]`. Keys (`item[trackBy]`) of the selected cards; keys of items not on the current page are kept.

## States

- Visual states: `default`, `selected`, `loading`, `empty`
- `data-state` on each card: `selected` | `unselected`; `data-selected` when selected
- `data-selection` on the root mirrors `selectionMode`; `aria-busy` while loading

## Accessibility

- Visible focus: owned by the checkbox, the radio and the links in the header slot.
- Keyboard map: `Tab` moves through the select-all, each card's control and its content; `Space` toggles a control.
- ARIA: the cards are a named `list` of `listitem`s; each selection control is labelled by its card's header (`aria-labelledby`); the select-all has a visible label; the root sets `aria-busy` while loading.
- Selection is never conveyed by color alone: the control is checked.
- Contrast ≥4.5:1 (text) and ≥3:1 for the selected border.

## Right-to-left

- Layout: logical utilities only; the selection control sits at the end of the header row.
- Icons: none of its own.
- Keyboard: no arrow-key navigation of its own.
- User data: the slots isolate user data (`<bdi>` around domains in the examples).

## Internationalization

| Key                      | English source              | Override prop |
| ------------------------ | --------------------------- | ------------- |
| `cards.label`            | Items                       | `ariaLabel`   |
| `cards.selectAll`        | Select all items            | —             |
| `cards.emptyTitle`       | No items yet                | `empty` slot  |
| `cards.emptyDescription` | Items you create show here. | `empty` slot  |

- Formatting: none; the slots format the item's fields.

## Responsive

- Container queries: `@container/cards`; one column below `@xl` (36rem), two from `@xl`, three from `@4xl` (56rem), four from `@7xl` (80rem).
- Narrow (≤ 640 px or a narrow container): one card a row at full width.
- Touch: the checkbox and radio grow their hit area on `pointer: coarse` (from the inputs); nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import Cards from '@aziontech/webkit/cards'
  import Tag from '@aziontech/webkit/tag'

  const applications = [
    {
      id: 'app-1',
      name: 'storefront',
      status: 'Active',
      domain: 'shop.example.com',
      requests: '1.2M'
    },
    {
      id: 'app-2',
      name: 'checkout',
      status: 'Active',
      domain: 'pay.example.com',
      requests: '310K'
    },
    { id: 'app-3', name: 'blog', status: 'Inactive', domain: 'blog.example.com', requests: '0' },
    { id: 'app-4', name: 'docs', status: 'Active', domain: 'docs.example.com', requests: '88K' }
  ]
</script>

<template>
  <Cards :items="applications">
    <template #header="{ item }">{{ item.name }}</template>
    <template #default="{ item }">
      <dl class="grid grid-cols-[auto_1fr] gap-x-(--spacing-sm) gap-y-(--spacing-xxs)">
        <dt class="text-(--text-muted)">Status</dt>
        <dd>
          <Tag
            :label="item.status"
            :severity="item.status === 'Active' ? 'success' : 'secondary'"
            size="small"
          />
        </dd>
        <dt class="text-(--text-muted)">Domain</dt>
        <dd class="truncate">
          <bdi>{{ item.domain }}</bdi>
        </dd>
        <dt class="text-(--text-muted)">Requests</dt>
        <dd class="tabular-nums">{{ item.requests }}</dd>
      </dl>
    </template>
  </Cards>
</template>
```

### Selectable

```vue
<script setup>
  import Cards from '@aziontech/webkit/cards'
  import Pagination from '@aziontech/webkit/pagination-root'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const edges = Array.from({ length: 14 }, (_, i) => ({
    id: `edge-${i + 1}`,
    name: `Edge node ${i + 1}`,
    region: ['sa-east', 'us-east', 'eu-west'][i % 3]
  }))

  const { cardsProps, paginationProps, selectedCount } = useCollection({
    items: edges,
    pagination: { pageSize: 6 },
    selection: { mode: 'multi' }
  })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <p
      class="text-body-sm text-(--text-muted)"
      role="status"
    >
      {{ selectedCount }} selected
    </p>
    <Cards v-bind="cardsProps">
      <template #header="{ item }">{{ item.name }}</template>
      <template #default="{ item }">
        <span class="text-(--text-muted)">{{ item.region }}</span>
      </template>
    </Cards>
    <Pagination v-bind="paginationProps" />
  </div>
</template>
```
