import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import {
  type CollectionFetchParams,
  type CollectionUrlAdapter,
  matchesQuery,
  parseFilterText,
  type PreferencesStorage,
  routerAdapter,
  tokenText,
  useCollection,
  type UseCollectionOptions
} from './index'

interface Row {
  id: string
  name: string
  status: string
  requests: number
}

const rows: Row[] = Array.from({ length: 23 }, (_, i) => ({
  id: String(i + 1),
  name: `edge-${String(i + 1).padStart(2, '0')}`,
  status: i % 3 === 0 ? 'Inactive' : 'Active',
  requests: (i * 37) % 100
}))

const properties = [
  {
    key: 'status',
    label: 'Status',
    options: [{ value: 'Active' }, { value: 'Inactive' }]
  },
  { key: 'requests', label: 'Requests', type: 'number' as const }
]

const scopes: ReturnType<typeof effectScope>[] = []
afterEach(() => {
  scopes.splice(0).forEach((scope) => scope.stop())
  window.history.replaceState(null, '', window.location.pathname)
})

function setup<C extends object = Row>(options: UseCollectionOptions<Row & C>) {
  const scope = effectScope()
  scopes.push(scope)
  const result = scope.run(() => useCollection(options))
  if (!result) throw new Error('no collection')
  return result
}

const flush = async () => {
  for (let i = 0; i < 4; i++) {
    await Promise.resolve()
    await nextTick()
  }
}

function memoryStorage(seed: Record<string, string> = {}): PreferencesStorage & {
  data: Record<string, string>
} {
  const data = { ...seed }
  return { data, getItem: (k) => data[k] ?? null, setItem: (k, v) => void (data[k] = v) }
}

function memoryUrl(initial = ''): CollectionUrlAdapter & { search: () => string } {
  let params = new URLSearchParams(initial)
  return {
    search: () => params.toString(),
    read: () => new URLSearchParams(params),
    write: (next) => {
      params = new URLSearchParams(next)
    }
  }
}

describe('property filter helpers', () => {
  it('parses property, operator and value from typed text', () => {
    expect(parseFilterText('Status = Act', properties)).toMatchObject({
      property: { key: 'status' },
      operator: '=',
      value: 'Act'
    })
    expect(parseFilterText('Requests >= 40', properties)).toMatchObject({
      operator: '>=',
      value: '40'
    })
    expect(parseFilterText('Stat', properties)).toEqual({ value: 'Stat' })
    expect(parseFilterText('Statuses', properties).property).toBeUndefined()
  })

  it('matches tokens with and / or', () => {
    const item = { status: 'Active', requests: 50, name: 'edge' }
    const tokens = [
      { propertyKey: 'status', operator: '=' as const, value: 'active' },
      { propertyKey: 'requests', operator: '>' as const, value: '60' }
    ]
    expect(matchesQuery(item, { tokens, operation: 'and' }, properties)).toBe(false)
    expect(matchesQuery(item, { tokens, operation: 'or' }, properties)).toBe(true)
    expect(
      matchesQuery(item, { tokens: [{ operator: ':', value: 'dg' }], operation: 'and' }, properties)
    ).toBe(true)
    expect(
      matchesQuery(
        item,
        { tokens: [{ propertyKey: 'status', operator: '!=', value: 'Active' }], operation: 'and' },
        properties
      )
    ).toBe(false)
  })

  it('prints a token with the property label', () => {
    expect(tokenText({ propertyKey: 'status', operator: '=', value: 'Active' }, properties)).toBe(
      'Status = Active'
    )
    expect(tokenText({ operator: ':', value: 'edge' }, properties)).toBe('edge')
  })
})

describe('useCollection — client mode', () => {
  it('pages the items and reports the total', () => {
    const c = setup({ items: rows, pagination: { pageSize: 10 } })
    expect(c.items.value).toHaveLength(10)
    expect(c.totalCount.value).toBe(23)
    expect(c.pageCount.value).toBe(3)
    c.setPage(3)
    expect(c.items.value.map((r) => r.id)).toEqual(['21', '22', '23'])
    c.setPage(9)
    expect(c.page.value).toBe(3)
  })

  it('shows every item on one page without pagination', () => {
    const c = setup({ items: rows })
    expect(c.items.value).toHaveLength(23)
    expect(c.tableProps.value.paginated).toBe(false)
  })

  it('filters by text and goes back to the first page', () => {
    const c = setup({ items: rows, pagination: { pageSize: 5 } })
    c.setPage(2)
    c.setFilteringText('edge-1')
    expect(c.page.value).toBe(1)
    expect(c.totalCount.value).toBe(10)
    expect(c.filtersActive.value).toBe(true)
  })

  it('filters by property tokens', () => {
    const c = setup({ items: rows, propertyFiltering: { properties } })
    c.setQuery({
      tokens: [{ propertyKey: 'status', operator: '=', value: 'Inactive' }],
      operation: 'and'
    })
    expect(c.totalCount.value).toBe(8)
    expect(c.matchingItems.value.every((r) => r.status === 'Inactive')).toBe(true)
    c.clearFilters()
    expect(c.totalCount.value).toBe(23)
  })

  it('tells empty from no match', () => {
    const items = ref<Row[]>([])
    const c = setup({ items, propertyFiltering: { properties } })
    expect(c.status.value).toBe('empty')
    items.value = rows
    expect(c.status.value).toBe('ready')
    c.setFilteringText('nothing-like-this')
    expect(c.status.value).toBe('no-match')
  })

  it('sorts by one column, or several when multiple is on', () => {
    const c = setup({ items: rows })
    c.setSorting([
      { id: 'requests', desc: true },
      { id: 'name', desc: false }
    ])
    expect(c.sorting.value).toHaveLength(1)
    const values = c.items.value.map((r) => r.requests)
    expect(values).toEqual([...values].sort((a, b) => b - a))

    const m = setup({ items: rows, sorting: { multiple: true } })
    m.setSorting([
      { id: 'status', desc: false },
      { id: 'name', desc: true }
    ])
    expect(m.items.value[0]).toMatchObject({ status: 'Active', name: 'edge-23' })
  })

  it('selects one row, a page, or every match', () => {
    const c = setup({ items: rows, pagination: { pageSize: 10 }, selection: {} })
    c.toggleSelection('3')
    expect(c.selectedCount.value).toBe(1)
    c.selectPage(true)
    expect(c.selectedCount.value).toBe(10)
    expect(c.pageSelected.value).toBe(true)
    c.selectAllMatching()
    expect(c.selectedCount.value).toBe(23)
    expect(c.selectedItems.value).toHaveLength(23)
    c.clearSelection()
    expect(c.selectedCount.value).toBe(0)
  })

  it('keeps one key in single selection', () => {
    const c = setup({ items: rows, selection: { mode: 'single' } })
    c.toggleSelection('1')
    c.toggleSelection('2')
    expect(c.selectedKeys.value).toEqual(['2'])
    c.cardsProps.value['onUpdate:selectedKeys'](['5'])
    expect(c.selectedKeys.value).toEqual(['5'])
  })

  it('drops selected rows a filter hides unless keepSelection is set', () => {
    const c = setup({ items: rows, selection: {}, propertyFiltering: { properties } })
    c.toggleSelection('1')
    c.toggleSelection('2')
    c.setQuery({
      tokens: [{ propertyKey: 'status', operator: '=', value: 'Active' }],
      operation: 'and'
    })
    expect(c.selectedKeys.value).toEqual(['2'])
  })

  it('binds Table props both ways', () => {
    const columns = [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'status', header: 'Status' },
      { id: 'actions', kind: 'action' as const }
    ]
    const c = setup({ items: rows, columns, pagination: { pageSize: 10 }, selection: {} })
    const props = c.tableProps.value
    expect(props.manualPagination).toBe(true)
    expect(props.rowCount).toBe(23)
    props['onUpdate:rowSelection']({ '1': true, '2': true })
    expect(c.selectedKeys.value).toEqual(['1', '2'])
    props['onUpdate:pagination']({ pageIndex: 1, pageSize: 10 })
    expect(c.page.value).toBe(2)
    props['onUpdate:pagination']({ pageIndex: 0, pageSize: 25 })
    expect(c.pageSize.value).toBe(25)
    props['onUpdate:columnVisibility']({ status: false })
    expect(c.tableProps.value.columnVisibility).toEqual({ status: false })
    expect(c.preferencesProps.value.columns.map((col) => col.id)).toEqual(['name', 'status'])
  })
})

describe('useCollection — preferences', () => {
  it('reads and writes the saved preferences', () => {
    const storage = memoryStorage({
      'resources-prefs': JSON.stringify({
        pageSize: 25,
        density: 'compact',
        columns: [
          { id: 'status', visible: true },
          { id: 'name', visible: false }
        ]
      })
    })
    const columns = [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'status', header: 'Status' },
      { accessorKey: 'requests', header: 'Requests' }
    ]
    const c = setup({
      items: rows,
      columns,
      pagination: { pageSize: 10 },
      preferences: { storageKey: 'resources-prefs', storage }
    })
    expect(c.pageSize.value).toBe(25)
    expect(c.tableProps.value.density).toBe('compact')
    expect(c.tableProps.value.columns.map((col) => col.accessorKey)).toEqual([
      'status',
      'name',
      'requests'
    ])
    expect(c.tableProps.value.columnVisibility).toEqual({ name: false })
    c.setPreferences({ wrapLines: true })
    expect(JSON.parse(storage.data['resources-prefs'] ?? '{}')).toMatchObject({
      wrapLines: true,
      pageSize: 25
    })
  })

  it('works without storage (server render)', () => {
    const c = setup({ items: rows, preferences: { storageKey: 'x', storage: null } })
    c.setPreferences({ striped: true })
    expect(c.preferences.value.striped).toBe(true)
  })
})

describe('useCollection — URL', () => {
  it('reads the state from the query string and writes it back', async () => {
    const url = memoryUrl(
      'tab=2&q=edge&sort=-requests&page=2&size=5&filter=' +
        encodeURIComponent(JSON.stringify([['status', '=', 'Active']]))
    )
    const c = setup({
      items: rows,
      pagination: { pageSize: 10 },
      propertyFiltering: { properties },
      url
    })
    expect(c.filteringText.value).toBe('edge')
    expect(c.sorting.value).toEqual([{ id: 'requests', desc: true }])
    expect(c.page.value).toBe(2)
    expect(c.pageSize.value).toBe(5)
    expect(c.query.value.tokens).toHaveLength(1)

    c.setPage(3)
    await flush()
    const params = new URLSearchParams(url.search())
    expect(params.get('page')).toBe('3')
    expect(params.get('tab')).toBe('2')

    c.clearFilters()
    c.setSorting([])
    await flush()
    const cleared = new URLSearchParams(url.search())
    expect(cleared.get('q')).toBeNull()
    expect(cleared.get('filter')).toBeNull()
    expect(cleared.get('sort')).toBeNull()
  })

  it('uses history when url is true, with a prefix to keep two lists apart', async () => {
    window.history.replaceState(null, '', `${window.location.pathname}?a.q=alpha`)
    const c = setup({ items: rows, url: { prefix: 'a.' } })
    expect(c.filteringText.value).toBe('alpha')
    c.setFilteringText('beta')
    await flush()
    expect(new URLSearchParams(window.location.search).get('a.q')).toBe('beta')
  })

  it('adapts a Vue Router instance', () => {
    const replace = vi.fn()
    const router = { currentRoute: { value: { query: { q: 'x', keep: ['1', '2'] } } }, replace }
    const adapter = routerAdapter(router)
    expect(adapter.read().getAll('keep')).toEqual(['1', '2'])
    adapter.write(new URLSearchParams('q=y&keep=1&keep=2'))
    expect(replace).toHaveBeenCalledWith({ query: { q: 'y', keep: ['1', '2'] } })
    replace.mockClear()
    adapter.write(new URLSearchParams('q=x&keep=1&keep=2'))
    expect(replace).not.toHaveBeenCalled()
  })
})

describe('useCollection — server mode', () => {
  const server = (delay = 0) => {
    const calls: Omit<CollectionFetchParams, 'signal'>[] = []
    const signals: AbortSignal[] = []
    const fetch = vi.fn(async (params: CollectionFetchParams) => {
      const { signal, ...rest } = params
      calls.push(rest)
      signals.push(signal)
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
      const matching = rows.filter((r) =>
        params.filter.tokens.every(
          (t) => !t.propertyKey || String(r[t.propertyKey as keyof Row]) === t.value
        )
      )
      const start = (params.page - 1) * params.pageSize
      return { items: matching.slice(start, start + params.pageSize), total: matching.length }
    })
    return { fetch, calls, signals }
  }

  it('fetches a page and exposes loading and the total', async () => {
    const { fetch, calls } = server()
    const c = setup({ fetch, pagination: { pageSize: 10 } })
    expect(c.loading.value).toBe(true)
    expect(c.status.value).toBe('loading')
    await flush()
    expect(c.loading.value).toBe(false)
    expect(c.items.value).toHaveLength(10)
    expect(c.totalCount.value).toBe(23)
    expect(calls[0]).toMatchObject({ page: 1, pageSize: 10, sort: [], filteringText: '' })
    c.setPage(3)
    await flush()
    expect(calls.at(-1)).toMatchObject({ page: 3 })
    expect(c.items.value).toHaveLength(3)
  })

  it('cancels the request a newer one replaces', async () => {
    const { fetch, signals } = server(20)
    const c = setup({ fetch, pagination: { pageSize: 10 }, propertyFiltering: { properties } })
    await flush()
    c.setPage(2)
    await flush()
    expect(signals[0]?.aborted).toBe(true)
    await new Promise((resolve) => setTimeout(resolve, 40))
    expect(c.page.value).toBe(2)
    expect(c.items.value).toHaveLength(10)
  })

  it('debounces the text before it fetches', async () => {
    vi.useFakeTimers()
    try {
      const { fetch, calls } = server()
      const c = setup({ fetch, filtering: { debounce: 200 } })
      await flush()
      const before = calls.length
      c.setFilteringText('e')
      c.setFilteringText('ed')
      c.setFilteringText('edg')
      await flush()
      vi.advanceTimersByTime(250)
      await flush()
      expect(calls.filter((call) => call.filteringText === 'edg')).toHaveLength(1)
      expect(calls.slice(before).some((call) => call.filteringText === 'e')).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('reports a failed request and recovers on refresh', async () => {
    let fail = true
    const fetch = vi.fn(async () => {
      if (fail) throw new Error('boom')
      return { items: rows.slice(0, 2), total: 2 }
    })
    const c = setup({ fetch })
    await flush()
    expect(c.status.value).toBe('error')
    fail = false
    await c.refresh()
    expect(c.status.value).toBe('ready')
  })

  it('selects every match across pages without loading them', async () => {
    const { fetch } = server()
    const c = setup({ fetch, pagination: { pageSize: 10 }, selection: {} })
    await flush()
    c.selectAllMatching()
    expect(c.allMatchingSelected.value).toBe(true)
    expect(c.selectedCount.value).toBe(23)
    c.toggleSelection('1', false)
    expect(c.selectedCount.value).toBe(22)
    expect(c.tableProps.value.rowSelection['1']).toBeUndefined()
    expect(c.tableProps.value.rowSelection['2']).toBe(true)
  })

  it('tells empty from no match on the server', async () => {
    const fetch = vi.fn(async () => ({ items: [], total: 0 }))
    const c = setup({ fetch, propertyFiltering: { properties } })
    await flush()
    expect(c.status.value).toBe('empty')
    c.setQuery({ tokens: [{ propertyKey: 'status', operator: '=', value: 'x' }], operation: 'and' })
    await flush()
    expect(c.status.value).toBe('no-match')
  })
})
