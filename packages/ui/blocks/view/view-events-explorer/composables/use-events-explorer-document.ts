import type { CodeBlockTab } from '@aziontech/webkit/code-block'
import type { FilterMenuValue } from '@aziontech/webkit/filter-menu'
import { computed, type ComputedRef } from 'vue'

import { canFilterField, type EventRow, hasEventValue } from '../lib/event-log'
import type { EventsExplorerDocumentField, EventsExplorerField } from '../view-events-explorer.vue'
import type { UseEventsExplorerFormatReturn } from './use-events-explorer-format'

/** One row of the default document summary. */
export interface EventsExplorerDocumentRow {
  /** Id of the field. */
  id: string
  /** Label of the field. */
  label: string
  /** The value as written. */
  value: string
}

/** What the open event document lists. */
export interface UseEventsExplorerDocumentReturn {
  /** Every field of the document event. */
  documentFields: ComputedRef<EventsExplorerDocumentField[]>
  /** The summary rows of the open event. */
  documentRows: ComputedRef<EventsExplorerDocumentRow[]>
  /** The JSON tab of the open event. */
  documentTabs: ComputedRef<CodeBlockTab[]>
}

const summaryPriority = [
  'host',
  'requestMethod',
  'requestUri',
  'status',
  'serviceName',
  'serviceDurationMs',
  'ruleName',
  'requestTimeMs',
  'remoteAddress',
  'country',
  'cacheStatus',
  'resourceId'
]

const summaryLimit = 6

/** The fields the document reads. */
export interface EventsExplorerDocumentSource {
  /** Every field, in order. */
  eventFields: ComputedRef<EventsExplorerField[]>
  /** Fields the panel can show or hide. */
  optionalFields: ComputedRef<EventsExplorerField[]>
  /** Finds a field by id. */
  eventField: (id: string) => EventsExplorerField | undefined
}

export function useEventsExplorerDocument(
  source: EventsExplorerDocumentSource,
  selectedEvent: ComputedRef<EventRow | null>,
  documentEvent: ComputedRef<EventRow | null>,
  format: UseEventsExplorerFormatReturn
): UseEventsExplorerDocumentReturn {
  const { eventFields, optionalFields, eventField } = source

  const summaryOrder = computed(() => {
    const known = summaryPriority.filter((id) => eventField(id))
    return known.length ? known : optionalFields.value.map((field) => field.id)
  })

  const documentFields = computed<EventsExplorerDocumentField[]>(() => {
    const event = documentEvent.value
    if (!event) return []
    return eventFields.value
      .filter((field) => hasEventValue(event, field.id))
      .map((field) => ({
        id: field.id,
        label: field.label,
        value: format.formatEventValue(field, event[field.id]),
        raw: event[field.id] as FilterMenuValue,
        filterable: canFilterField(field)
      }))
  })

  const documentRows = computed(() => {
    const event = selectedEvent.value
    if (!event) return []
    return summaryOrder.value
      .filter((id) => hasEventValue(event, id))
      .slice(0, summaryLimit)
      .map((id) => {
        const field = eventField(id)
        return { id, label: field?.label ?? id, value: format.formatEventValue(field, event[id]) }
      })
  })

  const documentTabs = computed(() => {
    const event = selectedEvent.value
    if (!event) return []
    const payload = Object.fromEntries(
      eventFields.value
        .filter((field) => hasEventValue(event, field.id))
        .map((field) => [field.id, event[field.id]])
    )
    return [
      {
        label: 'Document',
        value: 'document',
        language: 'json',
        code: JSON.stringify(payload, null, 2)
      }
    ]
  })

  return { documentFields, documentRows, documentTabs }
}
