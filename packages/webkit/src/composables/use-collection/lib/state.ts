import {
  computed,
  type ComputedRef,
  type Ref,
  ref,
  type ShallowRef,
  shallowRef,
  toValue
} from 'vue'

import { DEFAULT_PAGE_SIZES } from './config'
import type { CollectionPreferencesValue } from './preferences'
import { emptyQuery, type FilteringProperty, type PropertyFilterQuery } from './property-filter'
import type {
  CollectionColumn,
  CollectionSelectionMode,
  CollectionSort,
  CollectionStatus,
  UseCollectionOptions
} from './types'

export interface CollectionState<T, C = CollectionColumn> {
  columns: ComputedRef<C[]>
  properties: ComputedRef<FilteringProperty[]>
  serverMode: boolean
  paginated: boolean
  itemKey: string
  keyOf: (item: T) => string
  selectionMode: CollectionSelectionMode
  selectionEnabled: boolean
  pageSizeOptions: number[]
  sourceItems: ComputedRef<readonly T[]>
  filteringText: Ref<string>
  debouncedText: Ref<string>
  query: Ref<PropertyFilterQuery>
  sorting: Ref<CollectionSort[]>
  page: Ref<number>
  storedPreferences: Ref<CollectionPreferencesValue>
  loading: Ref<boolean>
  error: ShallowRef<unknown>
  serverItems: ShallowRef<T[]>
  serverTotal: Ref<number>
  seen: Map<string, T>
  selected: Ref<string[]>
  allMatching: Ref<boolean>
  excluded: Ref<string[]>
}

export interface CollectionView<T> {
  items: ComputedRef<T[]>
  matchingItems: ComputedRef<T[]>
  totalCount: ComputedRef<number>
  pageCount: ComputedRef<number>
  status: ComputedRef<CollectionStatus>
  filtersActive: ComputedRef<boolean>
}

type CollectionConfig<T> = Pick<
  CollectionState<T>,
  | 'serverMode'
  | 'paginated'
  | 'itemKey'
  | 'keyOf'
  | 'selectionMode'
  | 'selectionEnabled'
  | 'pageSizeOptions'
>

function collectionConfig<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>
): CollectionConfig<T> {
  const itemKey = (options.itemKey ?? 'id') as string
  return {
    serverMode: typeof options.fetch === 'function',
    paginated: Boolean(options.pagination),
    itemKey,
    keyOf: (item) => String((item as Record<string, unknown>)[itemKey] ?? ''),
    selectionMode: options.selection?.mode ?? 'multiple',
    selectionEnabled: Boolean(options.selection),
    pageSizeOptions: options.pagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZES
  }
}

export function createCollectionState<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>
): CollectionState<T, C> {
  const filteringText = ref<string>(options.filtering?.defaultText ?? '')
  return {
    ...collectionConfig(options),
    columns: computed<C[]>(() => [...(toValue(options.columns) ?? [])]),
    properties: computed<FilteringProperty[]>(() => [
      ...(toValue(options.propertyFiltering?.properties) ?? [])
    ]),
    sourceItems: computed<readonly T[]>(() => toValue(options.items) ?? []),
    filteringText,
    debouncedText: ref<string>(filteringText.value),
    query: ref<PropertyFilterQuery>(
      options.propertyFiltering?.defaultQuery ?? emptyQuery()
    ) as Ref<PropertyFilterQuery>,
    sorting: ref<CollectionSort[]>(options.sorting?.defaultState ?? []),
    page: ref<number>(1),
    storedPreferences: ref({}),
    loading: ref<boolean>(false),
    error: shallowRef<unknown>(null),
    serverItems: shallowRef<T[]>([]) as ShallowRef<T[]>,
    serverTotal: ref<number>(0),
    seen: new Map<string, T>(),
    selected: ref<string[]>([...(options.selection?.defaultSelectedKeys ?? [])]),
    allMatching: ref<boolean>(false),
    excluded: ref<string[]>([])
  }
}
