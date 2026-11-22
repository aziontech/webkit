import { computed, type ComputedRef } from 'vue'

import {
  basePreferences,
  type CollectionConfig,
  columnIdOf,
  preferenceColumnsOf
} from '../lib/config'
import {
  type CollectionPreferencesValue,
  defaultStorage,
  mergeColumns,
  readPreferences,
  writePreferences
} from '../lib/preferences'
import type { CollectionState } from '../lib/state'
import type { CollectionColumn, UseCollectionOptions } from '../lib/types'

export interface UseCollectionPreferencesReturn {
  preferences: ComputedRef<Required<CollectionPreferencesValue>>
  pageSize: ComputedRef<number>
  setPreferences: (value: CollectionPreferencesValue) => void
  setPageSize: (size: number) => void
  loadStored: (urlPageSize: number | undefined) => void
}

export function useCollectionPreferences<T extends object, C extends CollectionColumn>(
  options: UseCollectionOptions<T, C>,
  config: CollectionConfig<T>,
  columns: ComputedRef<C[]>,
  state: CollectionState<T>
): UseCollectionPreferencesReturn {
  const { storedPreferences, page } = state
  const storage =
    options.preferences?.storage === undefined ? defaultStorage() : options.preferences.storage
  const storageKey = options.preferences?.storageKey

  const preferences = computed<Required<CollectionPreferencesValue>>(() => {
    const base = basePreferences(options)
    const ids = preferenceColumnsOf(columns.value).map(columnIdOf)
    const hiddenByDefault = (base.columns ?? []).filter((c) => !c.visible).map((c) => c.id)
    return {
      ...base,
      ...storedPreferences.value,
      columns: mergeColumns(storedPreferences.value.columns, ids, hiddenByDefault)
    }
  })
  const pageSize = computed<number>(() =>
    config.paginated ? preferences.value.pageSize : Number.MAX_SAFE_INTEGER
  )

  const setPreferences = (value: CollectionPreferencesValue): void => {
    const sizeChanged =
      value.pageSize !== undefined && value.pageSize !== preferences.value.pageSize
    storedPreferences.value = { ...storedPreferences.value, ...value }
    if (storageKey) writePreferences(storage, storageKey, storedPreferences.value)
    if (sizeChanged) page.value = 1
  }

  const loadStored = (urlPageSize: number | undefined): void => {
    if (!storageKey) return
    const saved = readPreferences(storage, storageKey)
    if (!saved) return
    storedPreferences.value = {
      ...saved,
      ...(urlPageSize !== undefined ? { pageSize: urlPageSize } : {})
    }
  }

  return {
    preferences,
    pageSize,
    setPreferences,
    setPageSize: (size) => setPreferences({ pageSize: size }),
    loadStored
  }
}
