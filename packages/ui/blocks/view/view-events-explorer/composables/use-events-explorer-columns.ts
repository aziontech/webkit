import type { TableColumn } from '@aziontech/ui/data-table'
import { computed, type ComputedRef, ref, watch } from 'vue'

import type { EventsExplorerField } from '../view-events-explorer.vue'

/** The columns of the log and the fields shown as columns. */
export interface UseEventsExplorerColumnsReturn {
  /** Ids of the optional fields shown as columns. */
  shownColumns: ComputedRef<string[]>
  /** Shows or hides the column of a field. */
  toggleColumn: (id: string) => void
  /** The columns of the table. */
  columns: ComputedRef<TableColumn[]>
  /** The shown fields without a cell of their own. */
  genericColumns: ComputedRef<EventsExplorerField[]>
}

/** The fields the columns read. */
export interface EventsExplorerColumnSource {
  /** Every field, in order. */
  eventFields: ComputedRef<EventsExplorerField[]>
  /** Fields that always show. */
  coreFields: ComputedRef<EventsExplorerField[]>
  /** Fields the panel can show or hide. */
  optionalFields: ComputedRef<EventsExplorerField[]>
  /** Finds a field by id. */
  eventField: (id: string) => EventsExplorerField | undefined
}

const customCellFields = ['status']

const toColumn = (field: EventsExplorerField): TableColumn => ({
  accessorKey: field.id,
  header: field.label,
  sortable: true,
  ...(field.principal ? { principal: true } : {}),
  ...(field.grow ? { grow: field.grow } : {}),
  ...(field.minWidth ? { minWidth: field.minWidth } : {}),
  ...(field.align ? { align: field.align } : {})
})

export function useEventsExplorerColumns(
  source: EventsExplorerColumnSource,
  compactLog: ComputedRef<boolean>
): UseEventsExplorerColumnsReturn {
  const { eventFields, coreFields, optionalFields, eventField } = source

  const defaultColumns = () => {
    const known = ['host', 'status', 'remoteAddress'].filter((id) => eventField(id))
    return known.length ? known : optionalFields.value.slice(0, 3).map((field) => field.id)
  }

  const shown = ref(defaultColumns())

  watch(
    () => eventFields.value.map((field) => field.id).join(' '),
    () => {
      shown.value = defaultColumns()
    }
  )

  const toggleColumn = (id: string) => {
    shown.value = shown.value.includes(id)
      ? shown.value.filter((column) => column !== id)
      : [...shown.value, id]
  }

  const columns = computed<TableColumn[]>(() => [
    { id: 'detail', header: '', width: 44, align: 'center', hideable: false },
    ...(compactLog.value
      ? coreFields.value.filter((field) => field.id === 'message').map(toColumn)
      : coreFields.value.map(toColumn)),
    ...optionalFields.value.filter((field) => shown.value.includes(field.id)).map(toColumn)
  ])

  const genericColumns = computed(() =>
    optionalFields.value.filter(
      (field) => shown.value.includes(field.id) && !customCellFields.includes(field.id)
    )
  )

  return { shownColumns: computed(() => shown.value), toggleColumn, columns, genericColumns }
}
