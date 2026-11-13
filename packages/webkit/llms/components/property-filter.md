# Property Filter

> One field that filters a collection by properties and free text, after Cloudscape's property filter. Typing suggests a property, then an operator, then a value, and each choice becomes a removable token (`Status = Active`); text typed without a property becomes a free-text token. Two or more tokens combine with Match all (and) or Match any (or). With `mode="query"` the same field edits one query string instead (`level = Error AND method = GET`), after the Console Kit events query bar: suggestions follow the word at the caret (a field, an operator, a value, then AND or OR), a check explains what is wrong under the field, and Enter submits the text with its flat token list. It edits a `PropertyFilterQuery` and never filters anything itself: `useCollection` (or the server) applies the query, and `propertyFilterProps` binds the query, the properties and the match count in one `v-bind`.

- Import: `import PropertyFilter from '@aziontech/webkit/property-filter'`
- Category: data · Surface: product · Structure: monolithic
- API as JSON: [property-filter.json](https://github.com/aziontech/webkit/blob/main/.specs/property-filter.json)

## When to use

- A list or table that people narrow by several fields at once (status, region, owner) and by text.
- Any collection driven by `useCollection`, client or server mode.
- Filters that must survive a reload or a shared link: the query serializes into the URL through `useCollection`.
- With `mode="query"`: an explorer (events, logs) whose users type queries by hand, keep and reuse them as text, or need a grammar of the product (pass `validate` and `suggest`).

## Do

- Give every property with a closed set of values its `options`, so values are suggested and tokens print labels.
- Set `type: 'number'` or `type: 'date'` on ordered properties to offer `>`, `<`, `>=`, `<=`.
- Bind `totalCount` so people hear how many items match after each change.
- Name the field after the collection (`aria-label="Filter resources"`).
- In query mode, fields are written by `key` (no spaces); quote values that hold spaces or operator characters (`"edge cache"`). Apply the `query` of `submit` when it is not null; keep the `text` for saved and recent queries.
- A product grammar (`like`, `between`, parentheses) passes `validate` and `suggest`; `submit` then carries `query: null` for text the built-in grammar cannot flatten, and the product parses `text` itself.

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
| `mode` | `'tokens' \| 'query'` | `'tokens'` | false | tokens` turns each choice into a token; `query` edits one query string. |
| `text` | `string` | `undefined` | false | The query string in query mode. Supports v-model:text. |
| `validate` | `(text: string) => string` | `undefined` | false | Checks the query string in query mode: '' when valid, else the message shown under the field. Replaces the built-in check. |
| `suggest` | `(text: string, caret: number) => PropertyFilterQuerySuggestion[]` | `undefined` | false | Suggestions for the word at the caret in query mode. Replaces the built-in field, operator, value and AND / OR suggestions. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:query` | `PropertyFilterQuery` | A token was added or removed, the operation changed, or all cleared. Tokens mode only. |
| `update:text` | `string` | The query string changed (typing, a suggestion, Escape clearing). Query mode only. |
| `submit` | `(event: KeyboardEvent, payload: PropertyFilterSubmit)` | Enter with no active suggestion and a valid query; `event` is the Enter keydown. Query mode only. |

## States

- Visual states: `default`, `focus-visible`, `open` (suggestions shown), `disabled`, `invalid` (query mode: after Enter or blur on a query that fails the check, then live until it passes or is cleared)
- `data-mode` on the field wrapper mirrors `mode`; query mode sets the typed text in the code type (`text-label-code-sm`)
- `aria-expanded` on the field mirrors the open suggestions; `data-active` marks the active option
- `data-disabled` mirrors the `disabled` prop

## Accessibility

- Visible focus: the field's own `focus-within` ring (from `input`); tokens and buttons keep theirs.
- Keyboard map (query mode): typing opens the suggestions for the word at the caret; `ArrowDown`/`ArrowUp` move the active option (wrapping); `Enter` applies the active option (it replaces the word and moves the caret after it) or submits the query; `Escape` closes the suggestions, then clears the text; `ArrowLeft`/`ArrowRight`, `Home`/`End` and clicks move the caret and the suggestions follow it; `Backspace` only edits text.
- In query mode an invalid query sets `aria-invalid` on the field and `aria-describedby` to the message, which sits in a polite live region under the field; the token group is not rendered.
- Keyboard map (tokens mode): typing opens the suggestions; `ArrowDown`/`ArrowUp` move the active option (wrapping); `Enter` applies the active option or commits the typed text; `Escape` closes the suggestions, then clears the text; `Backspace` in an empty field removes the last token.
- ARIA: the field is a `combobox` (`aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`); the suggestions are a named `listbox` of `option`s with `aria-selected` on the active one; the tokens sit in a named `group`; each token's remove button is named `Remove <token>`; the match count is a `status` region.
- Option targets are 32 px high (44 px on `pointer: coarse`).
- Contrast ≥4.5:1 from the semantic text tokens.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `text-start`, `ps-`/`pe-` from `input`); the suggestions anchor to the start edge of the field.
- Icons: the filter glyph is not mirrored.
- Keyboard: `ArrowDown`/`ArrowUp` are not direction-dependent.
- User data: suggestion labels sit in `<bdi>` so a value in another script does not reorder the line.
- Query mode: the query string keeps `dir="auto"` from `input`, so a Latin query stays left-to-right inside a right-to-left page; the message sits at the start and the match count at the end (`ms-auto`).
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
| `propertyFilterQuery.label`         | Query                          | `ariaLabel`   |
| `propertyFilterQuery.placeholder`   | Type a query, for example status = Active AND requests > 10 | `placeholder` |
| `propertyFilterQuery.fields`        | Fields                         | —             |
| `propertyFilterQuery.all` / `any`   | Every condition matches / Any condition matches (AND / OR) | — |
| `propertyFilterQuery.unknownField` … `unclosedQuote` | the built-in check messages (`{field}`, `{operator}`, `{word}`, `{connective}`, `{position}`) | `validate` |

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
  import TableRoot from '@aziontech/webkit/table-root'
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
    <TableRoot v-bind="tableProps" />
  </div>
</template>
```

### QueryMode

```vue
<script setup>
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { matchesQuery } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  const events = Array.from({ length: 40 }, (_, i) => ({
    id: String(i + 1),
    level: ['Info', 'Warning', 'Error', 'Info'][i % 4],
    method: ['GET', 'POST', 'GET', 'DELETE', 'GET'][i % 5],
    status: [200, 404, 500, 200, 301][i % 5],
    host: ['shop.example.com', 'api.example.com'][i % 2]
  }))

  const properties = [
    {
      key: 'level',
      label: 'Level',
      options: [{ value: 'Info' }, { value: 'Warning' }, { value: 'Error' }]
    },
    {
      key: 'method',
      label: 'Method',
      options: [{ value: 'GET' }, { value: 'POST' }, { value: 'DELETE' }]
    },
    { key: 'status', label: 'Status code', type: 'number' },
    {
      key: 'host',
      label: 'Host',
      options: [{ value: 'shop.example.com' }, { value: 'api.example.com' }]
    }
  ]

  const text = ref('level = Error AND method = GET')
  const applied = ref({
    tokens: [
      { propertyKey: 'level', operator: '=', value: 'Error' },
      { propertyKey: 'method', operator: '=', value: 'GET' }
    ],
    operation: 'and'
  })

  const matches = computed(
    () => events.filter((event) => matchesQuery(event, applied.value, properties)).length
  )

  const apply = (event, { query }) => {
    if (query) applied.value = query
  }
</script>

<template>
  <PropertyFilter
    v-model:text="text"
    mode="query"
    :properties="properties"
    :total-count="matches"
    aria-label="Query events"
    @submit="apply"
  />
</template>
```
