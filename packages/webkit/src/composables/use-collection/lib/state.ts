import { readonly, type Ref, ref, type ShallowRef, shallowRef } from 'vue'

import type { CollectionPreferencesValue } from './preferences'
import { emptyQuery, type PropertyFilterQuery } from './property-filter'
import type {
  CollectionColumn,
  CollectionSort,
  UseCollectionOptions,
  UseCollectionReturn
} from './types'

export interface CollectionState<T> {
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

export function createCollectionState<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>
): CollectionState<T> {
  const filteringText = ref<string>(options.filtering?.defaultText ?? '')
  return {
    filteringText,
    debouncedText: ref<string>(filteringText.value),
    query: ref<PropertyFilterQuery>(
      options.propertyFiltering?.defaultQuery ?? emptyQuery()
    ) as Ref<PropertyFilterQuery>,
    sorting: ref<CollectionSort[]>(options.sorting?.defaultState ?? []),
    page: ref<number>(1),
    storedPreferences: ref<CollectionPreferencesValue>({}),
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

export type CollectionReadonlyState = Pick<
  UseCollectionReturn<never, never>,
  'loading' | 'error' | 'filteringText' | 'query' | 'sorting' | 'page'
>

export function readonlyStateOf<T>(state: CollectionState<T>): CollectionReadonlyState {
  return {
    loading: readonly(state.loading),
    error: readonly(state.error),
    filteringText: readonly(state.filteringText),
    query: readonly(state.query) as Readonly<Ref<PropertyFilterQuery>>,
    sorting: readonly(state.sorting) as Readonly<Ref<CollectionSort[]>>,
    page: readonly(state.page)
  }
}
