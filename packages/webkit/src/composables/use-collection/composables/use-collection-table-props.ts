import { computed, type ComputedRef } from 'vue'

import { columnIdOf } from '../lib/config'
import type { CollectionColumnPreference } from '../lib/preferences'
import type { CollectionState, CollectionView } from '../lib/state'
import type { CollectionColumn, CollectionTableProps } from '../lib/types'
import type { UseCollectionFiltersReturn } from './use-collection-filters'
import type { UseCollectionPreferencesReturn } from './use-collection-preferences'
import type { UseCollectionSelectionReturn } from './use-collection-selection'

function orderColumns<C extends CollectionColumn>(
  columns: C[],
  preferred: CollectionColumnPreference[]
): C[] {
  const order = preferred.map((c) => c.id)
  const byId = new Map(columns.map((column) => [columnIdOf(column), column]))
  const listed = order.map((id) => byId.get(id)).filter((c): c is C => c !== undefined)
  const rest = columns.filter((column) => !order.includes(columnIdOf(column)))
  return [...listed, ...rest]
}

export function useCollectionTableProps<T extends object, C extends CollectionColumn>(
  s: CollectionState<T, C>,
  view: CollectionView<T>,
  prefs: Omit<UseCollectionPreferencesReturn, 'loadStored'>,
  filters: UseCollectionFiltersReturn,
  selection: UseCollectionSelectionReturn<T>
): ComputedRef<CollectionTableProps<T, C>> {
  const { sorting, columns } = s
  const { preferences, setPreferences } = prefs

  const orderedColumns = computed<C[]>(() => orderColumns(columns.value, preferences.value.columns))

  const columnVisibility = computed<Record<string, boolean>>(() =>
    Object.fromEntries(
      preferences.value.columns
        .filter((c: CollectionColumnPreference) => !c.visible)
        .map((c) => [c.id, false])
    )
  )

  const pageSelectedKeys = computed<string[]>(() =>
    selection.pageKeys.value.filter(selection.isSelected)
  )

  return computed<CollectionTableProps<T, C>>(() => ({
    data: view.items.value,
    columns: orderedColumns.value,
    rowKey: s.itemKey,
    loading: s.loading.value,
    sorting: sorting.value,
    manualSorting: true,
    manualFiltering: true,
    selectable: s.selectionEnabled,
    selectedKeys: pageSelectedKeys.value,
    columnVisibility: columnVisibility.value,
    wrapLines: preferences.value.wrapLines,
    striped: preferences.value.striped,
    density: preferences.value.density,
    'onUpdate:sorting': (value) => filters.setSorting(value ?? []),
    'onUpdate:selectedKeys': (value = []) => selection.applyPageSelection(new Set(value)),
    'onUpdate:columnVisibility': (value = {}) =>
      setPreferences({
        columns: preferences.value.columns.map((c) => ({
          id: c.id,
          visible: value[c.id] !== false
        }))
      })
  }))
}
