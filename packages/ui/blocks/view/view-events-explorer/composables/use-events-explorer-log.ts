import type { FilterMenuField, FilterMenuValue } from '@aziontech/webkit/filter-menu'
import { computed, type ComputedRef, type Ref, watch } from 'vue'

import {
  eventLevelOptions,
  eventPeriods,
  type EventRow,
  eventSourceOptions,
  eventSources,
  fieldValueCounts,
  type FilterField,
  matchPeriod,
  searchEvents
} from '../lib/event-log'
import { sampleCategories, sampleEvents, sampleFields, sampleNow } from '../sample'
import type {
  EventsExplorerEvent,
  EventsExplorerField,
  EventsExplorerFieldCategory,
  EventsExplorerFilters,
  EventsExplorerProps
} from '../view-events-explorer.vue'
import type { UseEventsExplorerFormatReturn } from './use-events-explorer-format'

/** The models the log reads and writes. */
export interface EventsExplorerLogModels {
  /** Applied values per filter field. */
  filters: Ref<EventsExplorerFilters>
  /** Values that hide an event. */
  exclusions: Ref<EventsExplorerFilters>
  /** The search text. */
  search: Ref<string>
  /** The page of the table. */
  page: Ref<number>
}

/** One exclusion as its chip writes it. */
export interface EventsExplorerExclusionChip {
  /** Stable key of the chip. */
  key: string
  /** Id of the field. */
  id: string
  /** The excluded value. */
  value: FilterMenuValue
  /** Label of the field. */
  label: string
  /** The value as written. */
  text: string
}

/** The events, the fields and the filters of the log. */
export interface UseEventsExplorerLogReturn {
  /** The moment relative periods end at. */
  nowDate: ComputedRef<Date>
  /** Every field, in order. */
  eventFields: ComputedRef<EventsExplorerField[]>
  /** The categories of the fields panel. */
  eventFieldCategories: ComputedRef<EventsExplorerFieldCategory[]>
  /** Fields that always show. */
  coreFields: ComputedRef<EventsExplorerField[]>
  /** Fields the panel can show or hide. */
  optionalFields: ComputedRef<EventsExplorerField[]>
  /** Finds a field by id. */
  eventField: (id: string) => EventsExplorerField | undefined
  /** The events given, or the sample. */
  sourceEvents: ComputedRef<EventsExplorerEvent[]>
  /** The events that match the filters, the exclusions, the match test and the search. */
  matchedEvents: ComputedRef<EventRow[]>
  /** The fields of the filter menu. */
  menuFields: ComputedRef<FilterMenuField[]>
  /** One chip per exclusion. */
  exclusionChips: ComputedRef<EventsExplorerExclusionChip[]>
  /** Removes one exclusion. */
  removeExclusion: (id: string, value: FilterMenuValue) => void
  /** The server pages the events. */
  serverMode: ComputedRef<boolean>
}

const fieldsOf = (props: EventsExplorerProps) => {
  const eventFields = computed(() => props.fields ?? sampleFields)
  const eventFieldCategories = computed<EventsExplorerFieldCategory[]>(() => {
    if (props.categories) return props.categories
    if (!props.fields) return sampleCategories
    const ids = [...new Set(props.fields.map((field) => field.category ?? ''))].filter(Boolean)
    return ids.map((category) => ({ label: category, id: category }))
  })
  const coreFields = computed(() => eventFields.value.filter((field) => field.core))
  const optionalFields = computed(() => eventFields.value.filter((field) => !field.core))
  const eventField = (id: string) => eventFields.value.find((field) => field.id === id)
  return { eventFields, eventFieldCategories, coreFields, optionalFields, eventField }
}

const baseFilterFieldsOf = (
  nowDate: ComputedRef<Date>,
  format: UseEventsExplorerFormatReturn
): FilterField[] => [
  {
    label: 'Period',
    id: 'period',
    kind: 'range',
    options: eventPeriods,
    formatValue: format.formatPeriod,
    match: (event, values) => matchPeriod(event.at, values, nowDate.value)
  },
  {
    label: 'Source',
    id: 'source',
    kind: 'options',
    options: eventSourceOptions,
    match: (event, values) => values.includes(event.source)
  },
  {
    label: 'Level',
    id: 'level',
    kind: 'options',
    options: eventLevelOptions,
    match: (event, values) => values.includes(event.level)
  }
]

const filterFieldsOf = (
  filters: Ref<EventsExplorerFilters>,
  eventRows: ComputedRef<EventRow[]>,
  eventField: (id: string) => EventsExplorerField | undefined,
  nowDate: ComputedRef<Date>,
  format: UseEventsExplorerFormatReturn
) => {
  const baseFilterFields = baseFilterFieldsOf(nowDate, format)
  const baseFilterIds = new Set(baseFilterFields.map((field) => field.id))

  const activeFieldIds = computed(() =>
    Object.keys(filters.value).filter(
      (id) => !baseFilterIds.has(id) && Boolean(filters.value[id]?.length)
    )
  )

  const filterFields = computed<FilterField[]>(() => [
    ...baseFilterFields,
    ...activeFieldIds.value.map((id): FilterField => {
      const field = eventField(id)
      return {
        id,
        label: field?.label ?? id,
        kind: 'options',
        options: fieldValueCounts(eventRows.value, id).map(({ value }) => ({
          value,
          label: format.formatEventValue(field, value)
        })),
        match: (event: EventRow, values: readonly unknown[]) => values.includes(event[id])
      }
    })
  ])

  const menuFields = computed<FilterMenuField[]>(() =>
    filterFields.value.map((field) => ({
      label: field.label,
      id: field.id,
      type: field.kind === 'range' ? 'date' : 'multiple',
      options: (field.options ?? [])
        .filter((option) => !option.custom)
        .map((option) => ({ value: option.value as string | number, label: option.label }))
    }))
  )

  return { filterFields, menuFields }
}

const exclusionsOf = (
  exclusions: Ref<EventsExplorerFilters>,
  eventField: (id: string) => EventsExplorerField | undefined,
  format: UseEventsExplorerFormatReturn
) => {
  const exclusionChips = computed(() =>
    Object.entries(exclusions.value).flatMap(([id, values]) => {
      const field = eventField(id)
      return values.map((value) => ({
        key: `${id}:${String(value)}`,
        id,
        value,
        label: field?.label ?? id,
        text: format.formatEventValue(field, value)
      }))
    })
  )

  const removeExclusion = (id: string, value: FilterMenuValue) => {
    exclusions.value = {
      ...exclusions.value,
      [id]: (exclusions.value[id] ?? []).filter((item) => item !== value)
    }
  }

  return { exclusionChips, removeExclusion }
}

const rowsOf = (props: EventsExplorerProps, format: UseEventsExplorerFormatReturn) => {
  const serverMode = computed(() => props.total !== undefined)
  const sourceEvents = computed<EventsExplorerEvent[]>(
    () => props.events ?? (props.loading || props.error ? [] : sampleEvents)
  )
  const eventRows = computed<EventRow[]>(() =>
    sourceEvents.value.map((event) => ({
      ...event,
      time: format.formatEventTime(event.at),
      sourceLabel: eventSources[event.source] ?? event.source
    }))
  )
  return { serverMode, sourceEvents, eventRows }
}

export function useEventsExplorerLog(
  props: EventsExplorerProps,
  models: EventsExplorerLogModels,
  format: UseEventsExplorerFormatReturn
): UseEventsExplorerLogReturn {
  const { filters, exclusions, search, page } = models
  const nowDate = computed(() => props.now ?? sampleNow)
  const fields = fieldsOf(props)
  const { eventFields, eventField } = fields

  const { serverMode, sourceEvents, eventRows } = rowsOf(props, format)

  const { filterFields, menuFields } = filterFieldsOf(
    filters,
    eventRows,
    eventField,
    nowDate,
    format
  )

  const passesFilters = (event: EventRow) =>
    filterFields.value.every((field) => {
      const values = filters.value[field.id]
      if (!values?.length) return true
      return field.match(event, values)
    })

  const filteredEvents = computed(() =>
    eventRows.value.filter(
      (event) =>
        passesFilters(event) &&
        Object.entries(exclusions.value).every(
          ([id, values]) => !values.includes(event[id] as FilterMenuValue)
        ) &&
        (!props.match || props.match(event))
    )
  )

  const { exclusionChips, removeExclusion } = exclusionsOf(exclusions, eventField, format)

  watch([filters, exclusions], () => {
    page.value = 1
  })

  const matchedEvents = computed(() =>
    serverMode.value
      ? eventRows.value
      : searchEvents(filteredEvents.value, search.value, eventFields.value)
  )

  watch(search, () => {
    page.value = 1
  })

  return {
    nowDate,
    ...fields,
    sourceEvents,
    matchedEvents,
    menuFields,
    exclusionChips,
    removeExclusion,
    serverMode
  }
}
