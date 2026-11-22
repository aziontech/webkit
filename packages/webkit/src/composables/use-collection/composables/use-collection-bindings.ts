import { computed, type ComputedRef } from 'vue'

import {
  type CollectionTableSource,
  preferencesPropsOf,
  tablePropsOf,
  visiblePageSize
} from '../lib/bindings'
import type { FilteringProperty, PropertyFilterQuery } from '../lib/property-filter'
import type {
  CollectionCardListProps,
  CollectionColumn,
  CollectionPaginationProps,
  CollectionPreferencesProps,
  CollectionPropertyFilterProps,
  CollectionSort,
  CollectionTableProps,
  CollectionTextFilterProps,
  UseCollectionReturn
} from '../lib/types'

export type UseCollectionBindingsReturn<T, C> = Pick<
  UseCollectionReturn<T, C>,
  | 'tableProps'
  | 'paginationProps'
  | 'filterProps'
  | 'propertyFilterProps'
  | 'preferencesProps'
  | 'cardListProps'
>

export interface CollectionBindingsSource<T, C> extends Omit<
  CollectionTableSource<T, C>,
  'items' | 'columns' | 'loading' | 'sorting' | 'totalCount' | 'selectedKeys'
> {
  items: ComputedRef<T[]>
  columns: ComputedRef<C[]>
  properties: ComputedRef<FilteringProperty[]>
  loading: Readonly<{ value: boolean }>
  sorting: Readonly<{ value: CollectionSort[] }>
  filteringText: Readonly<{ value: string }>
  query: Readonly<{ value: PropertyFilterQuery }>
  totalCount: ComputedRef<number>
  pageSelectedKeys: ComputedRef<string[]>
  setFilteringText: (text: string) => void
  setQuery: (query: PropertyFilterQuery) => void
}

export function useCollectionBindings<T, C extends CollectionColumn>(
  source: CollectionBindingsSource<T, C>
): UseCollectionBindingsReturn<T, C> {
  const { config } = source
  const tableProps = computed<CollectionTableProps<T, C>>(() =>
    tablePropsOf({
      ...source,
      items: source.items.value,
      columns: source.columns.value,
      loading: source.loading.value,
      sorting: source.sorting.value,
      totalCount: source.totalCount.value,
      selectedKeys: source.pageSelectedKeys.value
    })
  )
  const paginationProps = computed<CollectionPaginationProps>(() => ({
    page: source.page.value,
    total: source.totalCount.value,
    pageSize: visiblePageSize(config.paginated, source.pageSize.value),
    pageSizeOptions: config.pageSizeOptions,
    'onUpdate:page': source.setPage,
    'onUpdate:pageSize': source.setPageSize
  }))
  const filterProps = computed<CollectionTextFilterProps>(() => ({
    modelValue: source.filteringText.value,
    'onUpdate:modelValue': source.setFilteringText
  }))
  const propertyFilterProps = computed<CollectionPropertyFilterProps>(() => ({
    query: source.query.value,
    properties: source.properties.value,
    totalCount: source.totalCount.value,
    'onUpdate:query': source.setQuery
  }))
  const preferencesProps = computed<CollectionPreferencesProps>(() =>
    preferencesPropsOf(
      source.columns.value,
      source.preferences.value,
      config.paginated ? config.pageSizeOptions : [],
      source.setPreferences
    )
  )
  const cardListProps = computed<CollectionCardListProps<T>>(() => ({
    items: source.items.value,
    itemKey: config.itemKey,
    loading: source.loading.value,
    selectionMode: config.selectionEnabled ? config.selectionMode : 'none',
    selectedKeys: source.pageSelectedKeys.value,
    'onUpdate:selectedKeys': (keys) => source.applyPageSelection(new Set(keys))
  }))
  return {
    tableProps,
    paginationProps,
    filterProps,
    propertyFilterProps,
    preferencesProps,
    cardListProps
  }
}
