import type { PropertyFilterQuery, PropertyFilterSubmit } from '@aziontech/webkit/property-filter'
import { matchesQuery } from '@aziontech/webkit/use-collection'
import { computed, type ComputedRef, type Ref, ref, type WritableComputedRef } from 'vue'

import { eventSources } from '../lib/event-log'
import {
  filtersFromQuery,
  type QueryEntry,
  queryProperties,
  queryToText,
  searchableFields,
  tokensForFilters
} from '../lib/event-query'
import { sampleEvents } from '../sample'
import type { EventsExplorerEvent, EventsExplorerFilters } from '../view-events-explorer.vue'
import type { UseEventQueryRangeReturn } from './use-event-query-range'

/** The typed query of the Query variant, its history and its bridge to the filters. */
export interface UseEventQueryReturn {
  /** The text in the query bar. */
  queryText: WritableComputedRef<string>
  /** The query text last applied. */
  appliedText: ComputedRef<string>
  /** The query last applied. */
  appliedQuery: ComputedRef<PropertyFilterQuery>
  /** Why the typed query was not applied. */
  queryNotice: ComputedRef<string>
  /** The page of the log. */
  page: WritableComputedRef<number>
  /** The last queries run, newest first. */
  recentQueries: WritableComputedRef<QueryEntry[]>
  /** The filters the log shows, read from and written to the query. */
  filters: WritableComputedRef<EventsExplorerFilters>
  /** Events in the range that match the query. */
  matchedCount: ComputedRef<number>
  /** An event matches the applied query. */
  matchesAppliedQuery: (event: EventsExplorerEvent) => boolean
  /** Applies the query the bar submitted. */
  submitQuery: (event: KeyboardEvent, payload: PropertyFilterSubmit) => void
  /** Fills the bar with a query and runs it. */
  runQuery: (entry: QueryEntry) => void
}

const recentLimit = 8

const initialQuery: PropertyFilterQuery = {
  tokens: [
    { propertyKey: 'level', operator: '=', value: 'Error' },
    { propertyKey: 'host', operator: '=', value: 'api.example.com' }
  ],
  operation: 'and'
}

const initialRecent = (): QueryEntry[] => [
  {
    text: 'status >= 500',
    query: { tokens: [{ propertyKey: 'status', operator: '>=', value: '500' }], operation: 'and' }
  },
  {
    text: 'source = security AND level = Warning',
    query: {
      tokens: [
        { propertyKey: 'source', operator: '=', value: 'security' },
        { propertyKey: 'level', operator: '=', value: 'Warning' }
      ],
      operation: 'and'
    }
  }
]

const writable = <T>(source: { value: T }) =>
  computed({
    get: () => source.value,
    set: (value: T) => {
      source.value = value
    }
  })

interface QueryState {
  queryNotice: Ref<string>
  appliedQuery: Ref<PropertyFilterQuery>
  appliedText: Ref<string>
  page: Ref<number>
  recentQueries: Ref<QueryEntry[]>
}

const queryApplier =
  (state: QueryState) =>
  ({ text, query }: PropertyFilterSubmit) => {
    if (!query) {
      state.queryNotice.value =
        'This query mixes AND and OR. Use one of them throughout, then press Enter again.'
      return
    }
    state.queryNotice.value = ''
    state.appliedQuery.value = query
    state.appliedText.value = text.trim()
    state.page.value = 1
    const applied = state.appliedText.value
    if (!applied) return
    state.recentQueries.value = [
      { text: applied, query },
      ...state.recentQueries.value.filter((entry) => entry.text !== applied)
    ].slice(0, recentLimit)
  }

export function useEventQuery(timeRange: UseEventQueryRangeReturn): UseEventQueryReturn {
  const queryText = ref(queryToText(initialQuery))
  const appliedQuery = ref<PropertyFilterQuery>(initialQuery)
  const appliedText = ref(queryText.value)
  const queryNotice = ref('')
  const page = ref(1)
  const recentQueries = ref<QueryEntry[]>(initialRecent())

  const applyQuery = queryApplier({ queryNotice, appliedQuery, appliedText, page, recentQueries })

  const submitQuery = (_event: KeyboardEvent, payload: PropertyFilterSubmit) => applyQuery(payload)

  const matchesAppliedQuery = (event: EventsExplorerEvent) =>
    matchesQuery(
      { ...event, sourceLabel: eventSources[event.source] ?? event.source },
      appliedQuery.value,
      queryProperties,
      searchableFields
    )

  const runQuery = (entry: QueryEntry) => {
    queryText.value = entry.text
    applyQuery(entry)
  }

  const matchedCount = computed(
    () =>
      sampleEvents.filter((event) => timeRange.inWindow(event.at) && matchesAppliedQuery(event))
        .length
  )

  const filters = computed<EventsExplorerFilters>({
    get: () => filtersFromQuery(appliedQuery.value, timeRange.periodValue.value),
    set: (next) => {
      const current = filters.value
      if (next.period?.[0] !== current.period?.[0]) timeRange.setPeriod(next.period?.[0])
      const tokens = tokensForFilters(appliedQuery.value.tokens, current, next)
      if (!tokens) return
      const query = { tokens, operation: appliedQuery.value.operation }
      queryText.value = queryToText(query)
      applyQuery({ text: queryText.value, query })
    }
  })

  return {
    queryText: writable(queryText),
    appliedText: computed(() => appliedText.value),
    appliedQuery: computed(() => appliedQuery.value),
    queryNotice: computed(() => queryNotice.value),
    page: writable(page),
    recentQueries: writable(recentQueries),
    filters,
    matchedCount,
    matchesAppliedQuery,
    submitQuery,
    runQuery
  }
}
