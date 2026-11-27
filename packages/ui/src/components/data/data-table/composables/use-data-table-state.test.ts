import { describe, expect, it } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import { useDataTableState } from './use-data-table-state'

const setup = () => {
  const models = {
    sorting: ref<{ id: string; desc: boolean }[] | undefined>(undefined),
    selectedKeys: ref<string[] | undefined>(['a']),
    columnVisibility: ref<Record<string, boolean> | undefined>(undefined),
    openKeys: ref<string[] | undefined>(undefined)
  }
  const scope = effectScope()
  const state = scope.run(() => useDataTableState(models))!
  return { models, state, scope }
}

describe('useDataTableState', () => {
  it('seeds the selection from its model and follows later model writes', async () => {
    const { models, state, scope } = setup()
    expect(state.rowSelection.value.value).toEqual({ a: true })
    models.selectedKeys.value = ['b']
    await nextTick()
    expect(state.rowSelection.value.value).toEqual({ b: true })
    scope.stop()
  })

  it('writes sorting through its model and returns to the first page on a new page size', () => {
    const { models, state, scope } = setup()
    state.sorting.set([{ id: 'name', desc: true }])
    expect(models.sorting.value).toEqual([{ id: 'name', desc: true }])
    state.pagination.set({ pageIndex: 3, pageSize: 10 })
    state.writePagination({ pageIndex: 3, pageSize: 25 })
    expect(state.pagination.value.value).toEqual({ pageIndex: 0, pageSize: 25 })
    scope.stop()
  })

  it('round-trips a snapshot', () => {
    const { state, scope } = setup()
    state.setSnapshot({ page: 2, pageSize: 5, globalFilter: 'api', columnOrder: ['b', 'a'] })
    expect(state.getSnapshot()).toMatchObject({
      page: 2,
      pageSize: 5,
      globalFilter: 'api',
      columnOrder: ['b', 'a'],
      filters: []
    })
    scope.stop()
  })
})
