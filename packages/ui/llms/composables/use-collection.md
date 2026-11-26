# useCollection

Composable `@aziontech/ui/use-collection`. The signatures and option tables below are read from its typed source, [`src/composables/use-collection/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/ui/src/composables/use-collection/index.ts).

```ts
import { useCollection, matchesQuery, matchesText, parseFilterText, tokenText, historyAdapter, routerAdapter } from '@aziontech/ui/use-collection'
import type { UseCollectionOptions, UseCollectionReturn, CollectionColumnPreference, CollectionDensity, CollectionPreferencesValue, PreferencesStorage, FilteringProperty, PropertyFilterOperation, PropertyFilterOperator, PropertyFilterOption, PropertyFilterQuery, PropertyFilterToken, PropertyFilterTokenGroup, CollectionCardListProps, CollectionColumn, CollectionExportParams, CollectionExportScope, CollectionFetchParams, CollectionFetchResult, CollectionPaginationProps, CollectionPreferenceColumn, CollectionPreferencesProps, CollectionPropertyFilterProps, CollectionSelectionMode, CollectionSort, CollectionStatus, CollectionTableProps, CollectionTextFilterProps, CollectionUrlAdapter, RouterLike } from '@aziontech/ui/use-collection'
```

## `useCollection`

```ts
function useCollection<T extends object, C extends CollectionColumn = CollectionColumn>(options: UseCollectionOptions<T, C>): UseCollectionReturn<T, C>
```

## `UseCollectionOptions<T extends object, C extends CollectionColumn = CollectionColumn>`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | `MaybeRefOrGetter<readonly T[]>` | no | Client mode: every item, filtered, sorted and paged in memory. |
| `fetch` | `(params: CollectionFetchParams) => Promise<CollectionFetchResult<T>>` | no | Server mode: loads one page for the current filter, sort and page. |
| `exportAll` | `(params: CollectionExportParams) => Promise<T[]>` | no | Server mode: loads every item an export writes (`TableExportButton`, `exportCsv()`, `exportItems`); without it the loaded page is exported. |
| `itemKey` | `keyof T & string` | no | Field that identifies an item (selection, row keys). |
| `columns` | `MaybeRefOrGetter<readonly C[]>` | no | Columns bound to a Table; their order and visibility follow the preferences. |
| `filtering` | `{ fields?: string[]; defaultText?: string; debounce?: number }` | no | Free-text filtering: fields searched (all scalar fields by default), initial text, server debounce in ms. |
| `propertyFiltering` | `{ properties: MaybeRefOrGetter<readonly FilteringProperty[]> defaultQuery?: PropertyFilterQuery }` | no | Property filtering: the properties offered and the initial query. |
| `sorting` | `{ defaultState?: CollectionSort[] multiple?: boolean comparators?: Record<string, (a: T, b: T) => number> }` | no | Sorting: initial state, several columns at once, custom comparators by column id. |
| `pagination` | `{ pageSize?: number; pageSizeOptions?: number[] }` | no | Pagination: page size and the sizes offered. Without it every match shows on one page. |
| `selection` | `{ mode?: CollectionSelectionMode defaultSelectedKeys?: string[] keepSelection?: boolean }` | no | Selection: single or multi, initial keys, keep selected items hidden by a filter. |
| `url` | `boolean \| CollectionUrlAdapter \| { adapter?: CollectionUrlAdapter; prefix?: string }` | no | Keep filter, sort and page in the query string: `true` (history), an adapter, or an adapter with a key prefix. |
| `preferences` | `{ storageKey?: string defaults?: CollectionPreferencesValue storage?: PreferencesStorage \| null }` | no | Saved preferences: storage key, defaults, storage (`localStorage` by default). |

## `UseCollectionReturn<T, C>`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | `ComputedRef<T[]>` | yes |  |
| `matchingItems` | `ComputedRef<T[]>` | yes |  |
| `totalCount` | `ComputedRef<number>` | yes |  |
| `pageCount` | `ComputedRef<number>` | yes |  |
| `loading` | `Readonly<Ref<boolean>>` | yes |  |
| `error` | `Readonly<Ref<unknown>>` | yes |  |
| `status` | `ComputedRef<CollectionStatus>` | yes |  |
| `filtersActive` | `ComputedRef<boolean>` | yes |  |
| `filteringText` | `Readonly<Ref<string>>` | yes |  |
| `query` | `Readonly<Ref<PropertyFilterQuery>>` | yes |  |
| `sorting` | `Readonly<Ref<CollectionSort[]>>` | yes |  |
| `page` | `Readonly<Ref<number>>` | yes |  |
| `pageSize` | `ComputedRef<number>` | yes |  |
| `preferences` | `ComputedRef<Required<CollectionPreferencesValue>>` | yes |  |
| `selectedKeys` | `ComputedRef<string[]>` | yes |  |
| `selectedItems` | `ComputedRef<T[]>` | yes |  |
| `selectedCount` | `ComputedRef<number>` | yes |  |
| `allMatchingSelected` | `Readonly<Ref<boolean>>` | yes |  |
| `pageSelected` | `ComputedRef<boolean>` | yes |  |
| `setFilteringText` | `(text: string) => void` | yes |  |
| `setQuery` | `(query: PropertyFilterQuery) => void` | yes |  |
| `setSorting` | `(sorting: CollectionSort[]) => void` | yes |  |
| `setPage` | `(page: number) => void` | yes |  |
| `setPageSize` | `(size: number) => void` | yes |  |
| `setPreferences` | `(value: CollectionPreferencesValue) => void` | yes |  |
| `clearFilters` | `() => void` | yes |  |
| `refresh` | `() => Promise<void>` | yes |  |
| `exportItems` | `(scope?: CollectionExportScope) => Promise<T[]>` | yes |  |
| `isSelected` | `(key: string) => boolean` | yes |  |
| `toggleSelection` | `(key: string, selected?: boolean) => void` | yes |  |
| `selectPage` | `(selected?: boolean) => void` | yes |  |
| `selectAllMatching` | `() => void` | yes |  |
| `clearSelection` | `() => void` | yes |  |
| `tableProps` | `ComputedRef<CollectionTableProps<T, C>>` | yes |  |
| `paginationProps` | `ComputedRef<CollectionPaginationProps>` | yes |  |
| `filterProps` | `ComputedRef<CollectionTextFilterProps>` | yes |  |
| `propertyFilterProps` | `ComputedRef<CollectionPropertyFilterProps>` | yes |  |
| `preferencesProps` | `ComputedRef<CollectionPreferencesProps>` | yes |  |
| `cardListProps` | `ComputedRef<CollectionCardListProps<T>>` | yes |  |

## `matchesQuery`

```ts
function matchesQuery(item: unknown, query: PropertyFilterQuery, properties: FilteringProperty[], fields?: string[]): boolean
```

## `matchesText`

```ts
function matchesText(item: unknown, text: string, fields?: string[]): boolean
```

## `parseFilterText`

```ts
function parseFilterText(text: string, properties: FilteringProperty[]): ParsedFilterText
```

## `tokenText`

```ts
function tokenText(token: PropertyFilterToken, properties: FilteringProperty[]): string
```

## `historyAdapter`

```ts
function historyAdapter(): CollectionUrlAdapter
```

## `routerAdapter`

```ts
function routerAdapter(router: RouterLike): CollectionUrlAdapter
```

## `CollectionColumnPreference`

One column in the preferences: its id, in display order, and whether it shows.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `visible` | `boolean` | yes |  |

## `CollectionDensity`

Row density of a collection.

```ts
type CollectionDensity = 'comfortable' | 'compact'
```

## `CollectionPreferencesValue`

What a person can change about a collection, saved per collection.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `pageSize` | `number` | no |  |
| `columns` | `CollectionColumnPreference[]` | no |  |
| `wrapLines` | `boolean` | no |  |
| `striped` | `boolean` | no |  |
| `density` | `CollectionDensity` | no |  |
| `columnWidths` | `Record<string, number>` | no |  |

## `PreferencesStorage`

The storage the preferences use; `localStorage` by default.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `getItem` | `(key: string) => string \| null` | yes |  |
| `setItem` | `(key: string, value: string) => void` | yes |  |

## `FilteringProperty`

One property the filter offers.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | yes | Field read from each item. |
| `label` | `string` | yes | Name shown in suggestions and tokens. |
| `operators` | `PropertyFilterOperator[]` | no | Operators offered; defaults to `=`, `!=`, `:`, `!:` (plus `>`, `<`, `>=`, `<=` for `number` and `date`). |
| `options` | `PropertyFilterOption[]` | no | Values suggested after the operator. |
| `type` | `'text' \| 'number' \| 'date'` | no | How values compare. |
| `customValue` | `boolean` | no | PropertyFilter hands the value to its value slot instead of suggesting values. |

## `PropertyFilterOperation`

How the tokens of a query combine.

```ts
type PropertyFilterOperation = 'and' | 'or'
```

## `PropertyFilterOperator`

Comparison operators of a property filter token. `:` contains, `^` starts with.

```ts
type PropertyFilterOperator = '=' | '!=' | ':' | '!:' | '^' | '!^' | '>' | '<' | '>=' | '<='
```

## `PropertyFilterOption`

A value suggested for a property.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | `string` | yes |  |
| `label` | `string` | no |  |
| `count` | `number` | no | Items that hold this value, shown at the end of the suggestion. |

## `PropertyFilterQuery`

The whole property filter: its tokens and how they combine. Each of `groups` counts as one condition next to the tokens.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tokens` | `PropertyFilterToken[]` | yes |  |
| `operation` | `PropertyFilterOperation` | yes |  |
| `groups` | `PropertyFilterTokenGroup[]` | no |  |

## `PropertyFilterToken`

One condition: `property operator value`. A token without `propertyKey` is free text.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `propertyKey` | `string` | no |  |
| `operator` | `PropertyFilterOperator` | yes |  |
| `value` | `string` | yes |  |

## `PropertyFilterTokenGroup`

Tokens combined by their own operation, inside a query.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tokens` | `PropertyFilterToken[]` | yes |  |
| `operation` | `PropertyFilterOperation` | yes |  |

## `CollectionCardListProps<T>`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | `T[]` | yes |  |
| `itemKey` | `string` | yes |  |
| `loading` | `boolean` | yes |  |
| `selectionMode` | `'none' \| CollectionSelectionMode` | yes |  |
| `selectedKeys` | `string[]` | yes |  |
| `onUpdate:selectedKeys` | `(keys: string[]) => void` | yes |  |

## `CollectionColumn`

The column fields `useCollection` reads; a Table column satisfies it.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | no |  |
| `accessorKey` | `string` | no |  |
| `header` | `string` | no |  |
| `label` | `string` | no |  |
| `hideable` | `boolean` | no |  |
| `type` | `'default' \| 'action'` | no |  |
| `width` | `number` | no |  |

## `CollectionExportParams`

What a server-mode `exportAll` receives: the current filters and sort, without paging.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `filteringText` | `string` | yes |  |
| `filter` | `PropertyFilterQuery` | yes |  |
| `sort` | `CollectionSort[]` | yes |  |
| `scope` | `CollectionExportScope` | yes |  |

## `CollectionExportScope`

Which matches an export writes: every item that matches the filters, or every item.

```ts
type CollectionExportScope = 'filtered' | 'all'
```

## `CollectionFetchParams`

What a server-mode `fetch` receives.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `filteringText` | `string` | yes |  |
| `filter` | `PropertyFilterQuery` | yes |  |
| `sort` | `CollectionSort[]` | yes |  |
| `page` | `number` | yes |  |
| `pageSize` | `number` | yes |  |
| `signal` | `AbortSignal` | yes |  |

## `CollectionFetchResult<T>`

What a server-mode `fetch` resolves to: one page and the total that matches.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | `T[]` | yes |  |
| `total` | `number` | yes |  |

## `CollectionPaginationProps`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | `number` | yes |  |
| `total` | `number` | yes |  |
| `pageSize` | `number` | yes |  |
| `pageSizeOptions` | `number[]` | yes |  |
| `onUpdate:page` | `(page: number) => void` | yes |  |
| `onUpdate:pageSize` | `(size: number) => void` | yes |  |

## `CollectionPreferenceColumn`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `label` | `string` | yes |  |
| `locked` | `boolean` | yes |  |

## `CollectionPreferencesProps`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `preferences` | `Required<CollectionPreferencesValue>` | yes |  |
| `columns` | `CollectionPreferenceColumn[]` | yes |  |
| `pageSizeOptions` | `number[]` | yes |  |
| `onUpdate:preferences` | `(value: CollectionPreferencesValue) => void` | yes |  |

## `CollectionPropertyFilterProps`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `query` | `PropertyFilterQuery` | yes |  |
| `properties` | `FilteringProperty[]` | yes |  |
| `totalCount` | `number` | yes |  |
| `onUpdate:query` | `(query: PropertyFilterQuery) => void` | yes |  |

## `CollectionSelectionMode`

Single or multiple selection.

```ts
type CollectionSelectionMode = 'single' | 'multiple'
```

## `CollectionSort`

One sorted column; the same shape as the Table `sorting` model.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |
| `desc` | `boolean` | yes |  |

## `CollectionStatus`

Where the collection is: loading, failed, no items at all, no item matches the filters, or ready.

```ts
type CollectionStatus = 'loading' | 'error' | 'empty' | 'no-match' | 'ready'
```

## `CollectionTableProps<T, C>`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `T[]` | yes |  |
| `columns` | `C[]` | yes |  |
| `rowKey` | `string` | yes |  |
| `loading` | `boolean` | yes |  |
| `sorting` | `CollectionSort[]` | yes |  |
| `manualSorting` | `true` | yes |  |
| `manualFiltering` | `true` | yes |  |
| `selectable` | `boolean` | yes |  |
| `selectedKeys` | `string[]` | yes |  |
| `columnVisibility` | `Record<string, boolean>` | yes |  |
| `wrapLines` | `boolean` | yes |  |
| `striped` | `boolean` | yes |  |
| `density` | `CollectionDensity` | yes |  |
| `onUpdate:sorting` | `(value: CollectionSort[] \| undefined) => void` | yes |  |
| `onUpdate:selectedKeys` | `(value: string[] \| undefined) => void` | yes |  |
| `onUpdate:columnVisibility` | `(value: Record<string, boolean> \| undefined) => void` | yes |  |
| `onColumnResize` | `(event: Event, column: { id: string; width: number }) => void` | yes |  |

## `CollectionTextFilterProps`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | yes |  |
| `onUpdate:modelValue` | `(value: string) => void` | yes |  |

## `CollectionUrlAdapter`

Reads and writes the query string. `useCollection` keeps its state in it when `url` is set.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `read` | `() => URLSearchParams` | yes |  |
| `write` | `(params: URLSearchParams) => void` | yes |  |
| `subscribe` | `(listener: () => void) => () => void` | no |  |

## `RouterLike`

The part of a Vue Router instance the adapter uses.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `currentRoute` | `{ value: { query: Record<string, RouteQueryValue> } }` | yes |  |
| `replace` | `(to: { query: Record<string, string \| string[]> }) => unknown` | yes |  |
| `afterEach` | `(hook: () => void) => () => void` | no |  |
