# Property Filter

> One field that filters a collection by properties and free text, after Cloudscape's property filter. Typing suggests a property, then an operator, then a value, and each choice becomes a removable token (`Status = Active`); text typed without a property becomes a free-text token. Two or more tokens combine with Match all (and) or Match any (or). It edits a `PropertyFilterQuery` and never filters anything itself: `useCollection` (or the server) applies the query, and `propertyFilterProps` binds the query, the properties and the match count in one `v-bind`.

- Import: `import PropertyFilter from '@aziontech/webkit/property-filter'`
- Category: data · Surface: product · Structure: monolithic
- API as JSON: [property-filter.json](https://github.com/aziontech/webkit/blob/main/.specs/property-filter.json)

## When to use

- A list or table that people narrow by several fields at once (status, region, owner) and by text.
- Any collection driven by `useCollection`, client or server mode.
- Filters that must survive a reload or a shared link: the query serializes into the URL through `useCollection`.

## Do

- Give every property with a closed set of values its `options`, so values are suggested and tokens print labels.
- Set `type: 'number'` or `type: 'date'` on ordered properties to offer `>`, `<`, `>=`, `<=`.
- Bind `totalCount` so people hear how many items match after each change.
- Name the field after the collection (`aria-label="Filter resources"`).

## Don’t

- A single text search over a short list → use `input` bound to `filterProps`.
- A few fixed choices always on screen → use `toggle-group` or `chip` filters.
- A structured filter builder with its own panel inside a table toolbar → use `table-filter`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- use-collection` — applies the query; `propertyFilterProps` is the binding.
- [table](table.md) — the collection it usually filters.
- [cards](cards.md) — the card form of a collection.
- [collection-preferences](collection-preferences.md) — the panel that sits beside it in the controls row.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `query` | `PropertyFilterQuery` | `undefined` | false | The tokens and how they combine. Supports v-model:query. |
| `properties` | `FilteringProperty[]` | `[]` | false | Properties the suggestions offer, with their operators and values. |
| `totalCount` | `number` | `undefined` | false | Items that match the query, announced next to the tokens. Hidden when unset. |
| `placeholder` | `string` | `''` | false | Placeholder of the field. Empty uses the locale catalog. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the field. Empty uses the locale catalog. |
| `freeText` | `boolean` | `true` | false | Accepts typed text with no property as a free-text token. |
| `disabled` | `boolean` | `false` | false | Disables the field and the tokens. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:query` | `PropertyFilterQuery` | A token was added or removed, the operation changed, or all cleared. |

## States

- Visual states: `default`, `focus-visible`, `open` (suggestions shown), `disabled`
- `aria-expanded` on the field mirrors the open suggestions; `data-active` marks the active option
- `data-disabled` mirrors the `disabled` prop

## Accessibility

- Visible focus: the field's own `focus-within` ring (from `input`); tokens and buttons keep theirs.
- Keyboard map: typing opens the suggestions; `ArrowDown`/`ArrowUp` move the active option (wrapping); `Enter` applies the active option or commits the typed text; `Escape` closes the suggestions, then clears the text; `Backspace` in an empty field removes the last token.
- ARIA: the field is a `combobox` (`aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`); the suggestions are a named `listbox` of `option`s with `aria-selected` on the active one; the tokens sit in a named `group`; each token's remove button is named `Remove <token>`; the match count is a `status` region.
- Option targets are 32 px high (44 px on `pointer: coarse`).
- Contrast ≥4.5:1 from the semantic text tokens.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `text-start`, `ps-`/`pe-` from `input`); the suggestions anchor to the start edge of the field.
- Icons: the filter glyph is not mirrored.
- Keyboard: `ArrowDown`/`ArrowUp` are not direction-dependent.
- User data: suggestion labels sit in `<bdi>` so a value in another script does not reorder the line.
- Teleported content: the teleported suggestions listbox binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Internationalization

| Key                                 | English source                 | Override prop |
| ----------------------------------- | ------------------------------ | ------------- |
| `propertyFilter.label`              | Filter                         | `ariaLabel`   |
| `propertyFilter.placeholder`        | Filter by property or text     | `placeholder` |
| `propertyFilter.suggestions`        | Suggestions                    | —             |
| `propertyFilter.useText`            | Use: “{text}”                  | —             |
| `propertyFilter.properties`         | Properties                     | —             |
| `propertyFilter.values`             | Values                         | —             |
| `propertyFilter.tokens`             | Applied filters                | —             |
| `propertyFilter.operation`          | Combine filters                | —             |
| `propertyFilter.matchAll` / `matchAny` | Match all / Match any       | —             |
| `propertyFilter.and` / `or`         | and / or                       | —             |
| `propertyFilter.clear`              | Clear filters                  | —             |
| `propertyFilter.matches`            | {count} match / {count} matches (plural) | —   |
| `propertyFilter.equals` … `lessOrEqual` | operator names (Equals, Contains, …) | —   |

- Formatting: the match count goes through the plural rules and number format of the active locale (`Intl.PluralRules`, `Intl.NumberFormat`).

## Responsive

- Container queries: `@container/property-filter` on the root; the token row wraps.
- Narrow (≤ 640 px or a narrow container): the field takes the full width, tokens wrap onto several lines, the count moves to the end of the last line.
- Touch: options are 44 px high on `pointer: coarse`; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; long tokens truncate inside the chip.

## Examples

### Default

```vue
<script setup>
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { ref } from 'vue'

  const properties = [
    {
      key: 'status',
      label: 'Status',
      options: [{ value: 'Active' }, { value: 'Inactive' }, { value: 'Degraded' }]
    },
    {
      key: 'region',
      label: 'Region',
      options: [{ value: 'sa-east' }, { value: 'us-east' }, { value: 'eu-west' }]
    },
    { key: 'name', label: 'Name' },
    { key: 'requests', label: 'Requests', type: 'number' }
  ]

  const query = ref({
    tokens: [{ propertyKey: 'status', operator: '=', value: 'Active' }],
    operation: 'and'
  })
</script>

<template>
  <PropertyFilter
    v-model:query="query"
    :properties="properties"
    :total-count="12"
  />
</template>
```

### WithCollection

```vue
<script setup>
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Table from '@aziontech/webkit/table'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const workloads = Array.from({ length: 36 }, (_, i) => ({
    id: String(1001 + i),
    name: `workload-${String(i + 1).padStart(2, '0')}`,
    status: ['Active', 'Inactive', 'Degraded'][i % 3],
    region: ['sa-east', 'us-east', 'eu-west'][i % 3],
    requests: (i * 137) % 1000
  }))

  const properties = [
    {
      key: 'status',
      label: 'Status',
      options: [{ value: 'Active' }, { value: 'Inactive' }, { value: 'Degraded' }]
    },
    {
      key: 'region',
      label: 'Region',
      options: [{ value: 'sa-east' }, { value: 'us-east' }, { value: 'eu-west' }]
    },
    { key: 'requests', label: 'Requests', type: 'number' }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'region', header: 'Region' },
    { accessorKey: 'requests', header: 'Requests', enableSorting: true, align: 'end' }
  ]

  const { propertyFilterProps, tableProps } = useCollection({
    items: workloads,
    columns,
    propertyFiltering: { properties },
    pagination: { pageSize: 10 }
  })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <PropertyFilter v-bind="propertyFilterProps" />
    <Table v-bind="tableProps" />
  </div>
</template>
```
