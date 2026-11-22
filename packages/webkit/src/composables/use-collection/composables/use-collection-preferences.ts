import { computed, type ComputedRef } from 'vue'

import { basePreferences, columnIdOf } from '../lib/config'
import {
  type CollectionPreferencesValue,
  defaultStorage,
  mergeColumns,
  readPreferences,
  writePreferences
} from '../lib/preferences'
import type { CollectionState } from '../lib/state'
import type {
  CollectionColumn,
  CollectionPreferencesProps,
  UseCollectionOptions
} from '../lib/types'

export interface UseCollectionPreferencesReturn {
  preferences: ComputedRef<Required<CollectionPreferencesValue>>
  pageSize: ComputedRef<number>
  setPreferences: (value: CollectionPreferencesValue) => void
  setPageSize: (size: number) => void
  preferencesProps: ComputedRef<CollectionPreferencesProps>
  loadStored: (fromUrl: number | undefined) => void
}

export function useCollectionPreferences<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  s: CollectionState<T, C>
): UseCollectionPreferencesReturn {
  const { storedPreferences, paginated, pageSizeOptions, columns } = s
  const prefColumnsSource = computed<CollectionColumn[]>(() =>
    columns.value.filter((column) => column.type !== 'action')
  )
  const preferences = computed<Required<CollectionPreferencesValue>>(() => {
    const base = basePreferences(options)
    const merged = { ...base, ...storedPreferences.value }
    const ids = prefColumnsSource.value.map(columnIdOf)
    const hiddenByDefault = (base.columns ?? []).filter((c) => !c.visible).map((c) => c.id)
    return {
      ...merged,
      columns: mergeColumns(storedPreferences.value.columns, ids, hiddenByDefault)
    }
  })
  const pageSize = computed<number>(() =>
    paginated ? preferences.value.pageSize : Number.MAX_SAFE_INTEGER
  )

  const storage =
    options.preferences?.storage === undefined ? defaultStorage() : options.preferences.storage
  const storageKey = options.preferences?.storageKey

  const setPreferences = (value: CollectionPreferencesValue): void => {
    const sizeChanged =
      value.pageSize !== undefined && value.pageSize !== preferences.value.pageSize
    storedPreferences.value = { ...storedPreferences.value, ...value }
    if (storageKey) writePreferences(storage, storageKey, storedPreferences.value)
    if (sizeChanged) s.page.value = 1
  }

  const loadStored = (fromUrl: number | undefined): void => {
    if (!storageKey) return
    const saved = readPreferences(storage, storageKey)
    if (!saved) return
    storedPreferences.value = { ...saved, ...(fromUrl !== undefined ? { pageSize: fromUrl } : {}) }
  }

  const preferencesProps = computed<CollectionPreferencesProps>(() => ({
    preferences: preferences.value,
    columns: prefColumnsSource.value.map((column) => ({
      id: columnIdOf(column),
      label: column.label ?? column.header ?? columnIdOf(column),
      locked: column.hideable === false
    })),
    pageSizeOptions: paginated ? pageSizeOptions : [],
    'onUpdate:preferences': setPreferences
  }))

  return {
    preferences,
    pageSize,
    setPreferences,
    setPageSize: (size) => setPreferences({ pageSize: size }),
    preferencesProps,
    loadStored
  }
}
