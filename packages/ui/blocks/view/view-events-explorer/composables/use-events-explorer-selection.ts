import { computed, type ComputedRef, type Ref, ref, watch, type WritableComputedRef } from 'vue'

import type { EventRow } from '../lib/event-log'

/** The open event and where its document shows. */
export interface UseEventsExplorerSelectionReturn {
  /** The selected event among the matching ones. */
  selectedEvent: ComputedRef<EventRow | null>
  /** The event the document shows; it stays while the document closes. */
  documentEvent: ComputedRef<EventRow | null>
  /** The narrow drawer is open. */
  documentDrawerOpen: WritableComputedRef<boolean>
  /** The wide document pane is open. */
  documentPaneExpanded: WritableComputedRef<boolean>
  /** Closes the document. */
  closeDocument: () => void
  /** Opens the document of a row. */
  openDocument: (event: MouseEvent | KeyboardEvent, row: EventRow) => void
}

export function useEventsExplorerSelection(
  selectedKey: Ref<string>,
  matchedEvents: ComputedRef<EventRow[]>,
  isWide: ComputedRef<boolean>,
  onSelect: (event: MouseEvent | KeyboardEvent, row: EventRow) => void
): UseEventsExplorerSelectionReturn {
  const selectedEvent = computed(
    () => matchedEvents.value.find((event) => event.id === selectedKey.value) ?? null
  )
  const shownEvent = ref<EventRow | null>(null)
  watch(
    selectedEvent,
    (event) => {
      if (event) shownEvent.value = event
    },
    { immediate: true }
  )

  const drawerOpen = ref(false)

  watch(isWide, (wide) => {
    drawerOpen.value = !wide && Boolean(selectedKey.value)
  })

  const closeDocument = () => {
    selectedKey.value = ''
    drawerOpen.value = false
  }

  const openDocument = (event: MouseEvent | KeyboardEvent, row: EventRow) => {
    selectedKey.value = row.id
    drawerOpen.value = !isWide.value
    onSelect(event, row)
  }

  const documentPaneExpanded = computed({
    get: () => isWide.value && Boolean(selectedEvent.value),
    set: (expanded) => {
      if (!expanded) closeDocument()
    }
  })

  watch(drawerOpen, (open) => {
    if (!open && !isWide.value) selectedKey.value = ''
  })

  const documentDrawerOpen = computed({
    get: () => drawerOpen.value,
    set: (open) => {
      drawerOpen.value = open
    }
  })

  return {
    selectedEvent,
    documentEvent: computed(() => shownEvent.value),
    documentDrawerOpen,
    documentPaneExpanded,
    closeDocument,
    openDocument
  }
}
