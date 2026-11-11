import {
  PROPERTY_FILTER_OPERATORS,
  type PropertyFilterOperator,
  type PropertyFilterQuery,
  type PropertyFilterToken
} from './property-filter'

/** Reads and writes the query string. `useCollection` keeps its state in it when `url` is set. */
export interface CollectionUrlAdapter {
  read: () => URLSearchParams
  write: (params: URLSearchParams) => void
  subscribe?: (listener: () => void) => () => void
}

export function historyAdapter(): CollectionUrlAdapter {
  const hasWindow = typeof window !== 'undefined'
  return {
    read: () => new URLSearchParams(hasWindow ? window.location.search : ''),
    write: (params) => {
      if (!hasWindow) return
      const search = params.toString()
      const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
      if (next !== current) window.history.replaceState(window.history.state, '', next)
    },
    subscribe: (listener) => {
      if (!hasWindow) return () => {}
      window.addEventListener('popstate', listener)
      return () => window.removeEventListener('popstate', listener)
    }
  }
}

type RouteQueryValue = string | null | Array<string | null> | undefined

/** The part of a Vue Router instance the adapter uses. */
export interface RouterLike {
  currentRoute: { value: { query: Record<string, RouteQueryValue> } }
  replace: (to: { query: Record<string, string | string[]> }) => unknown
  afterEach?: (hook: () => void) => () => void
}

function queryParams(query: Record<string, RouteQueryValue>): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    for (const one of Array.isArray(value) ? value : [value]) {
      if (one !== null && one !== undefined) params.append(key, one)
    }
  }
  return params
}

export function routerAdapter(router: RouterLike): CollectionUrlAdapter {
  return {
    read: () => queryParams(router.currentRoute.value.query),
    write: (params) => {
      if (params.toString() === queryParams(router.currentRoute.value.query).toString()) return
      const query: Record<string, string | string[]> = {}
      for (const key of new Set(params.keys())) {
        const all = params.getAll(key)
        query[key] = all.length > 1 ? all : (all[0] ?? '')
      }
      void router.replace({ query })
    },
    subscribe: (listener) => router.afterEach?.(listener) ?? (() => {})
  }
}

export interface CollectionUrlState {
  filteringText?: string
  query?: PropertyFilterQuery
  sorting?: { id: string; desc: boolean }[]
  page?: number
  pageSize?: number
}

export const URL_KEYS = ['q', 'filter', 'op', 'sort', 'page', 'size'] as const

const isOperator = (value: unknown): value is PropertyFilterOperator =>
  typeof value === 'string' && (PROPERTY_FILTER_OPERATORS as readonly string[]).includes(value)

function parseTokens(raw: string | null): PropertyFilterToken[] | undefined {
  if (!raw) return undefined
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return undefined
    const tokens: PropertyFilterToken[] = []
    for (const entry of parsed) {
      if (!Array.isArray(entry) || entry.length !== 3) continue
      const [key, operator, value] = entry as unknown[]
      if (!isOperator(operator) || typeof value !== 'string') continue
      tokens.push(
        typeof key === 'string' && key ? { propertyKey: key, operator, value } : { operator, value }
      )
    }
    return tokens
  } catch {
    return undefined
  }
}

export function readUrlState(params: URLSearchParams, prefix = ''): CollectionUrlState {
  const get = (key: string) => params.get(prefix + key)
  const state: CollectionUrlState = {}
  const text = get('q')
  if (text !== null) state.filteringText = text
  const tokens = parseTokens(get('filter'))
  if (tokens) state.query = { tokens, operation: get('op') === 'or' ? 'or' : 'and' }
  const sort = get('sort')
  if (sort !== null) {
    state.sorting = sort
      .split(',')
      .filter(Boolean)
      .map((part) =>
        part.startsWith('-') ? { id: part.slice(1), desc: true } : { id: part, desc: false }
      )
  }
  const page = Number(get('page'))
  if (Number.isInteger(page) && page > 0) state.page = page
  const size = Number(get('size'))
  if (Number.isInteger(size) && size > 0) state.pageSize = size
  return state
}

export function writeUrlState(
  base: URLSearchParams,
  state: Required<CollectionUrlState>,
  defaults: { pageSize: number },
  prefix = ''
): URLSearchParams {
  const params = new URLSearchParams(base)
  for (const key of URL_KEYS) params.delete(prefix + key)
  if (state.filteringText) params.set(`${prefix}q`, state.filteringText)
  if (state.query.tokens.length) {
    params.set(
      `${prefix}filter`,
      JSON.stringify(state.query.tokens.map((t) => [t.propertyKey ?? '', t.operator, t.value]))
    )
    if (state.query.operation === 'or') params.set(`${prefix}op`, 'or')
  }
  if (state.sorting.length) {
    params.set(`${prefix}sort`, state.sorting.map((s) => (s.desc ? `-${s.id}` : s.id)).join(','))
  }
  if (state.page > 1) params.set(`${prefix}page`, String(state.page))
  if (state.pageSize !== defaults.pageSize) params.set(`${prefix}size`, String(state.pageSize))
  return params
}
