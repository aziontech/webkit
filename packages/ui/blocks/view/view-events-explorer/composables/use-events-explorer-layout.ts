import { computed, type ComputedRef, onMounted, onScopeDispose, type Ref, ref, watch } from 'vue'

const logMinWidth = 480
const documentMinWidth = 348
const fieldsPanelWidth = 268

/** The panes of the explorer and the widths that fold them. */
export interface UseEventsExplorerLayoutReturn {
  /** The fields panel fits beside the log. */
  showFieldsPanel: ComputedRef<boolean>
  /** The document fits beside the fields panel and the log. */
  isWide: ComputedRef<boolean>
}

/** The panel widths the layout reads and clamps. */
export interface EventsExplorerPanes {
  /** The fields panel is open. */
  fieldsOpen: Ref<boolean>
  /** Width of the fields panel. */
  fieldsWidth: Ref<number>
  /** Width of the document pane. */
  documentWidth: Ref<number>
  /** The element whose width decides the layout. */
  explorerEl: Ref<HTMLElement | null>
}

export const defaultFieldsWidth = fieldsPanelWidth

export function useEventsExplorerLayout(panes: EventsExplorerPanes): UseEventsExplorerLayoutReturn {
  const { fieldsOpen, fieldsWidth, documentWidth, explorerEl } = panes
  const explorerWidth = ref(0)
  let explorerObserver: ResizeObserver | null = null

  const showFieldsPanel = computed(
    () => explorerWidth.value === 0 || explorerWidth.value >= fieldsPanelWidth + logMinWidth
  )

  const isWide = computed(
    () =>
      explorerWidth.value === 0 ||
      explorerWidth.value >= fieldsPanelWidth + logMinWidth + documentMinWidth
  )

  onMounted(() => {
    if (!explorerEl.value) return
    explorerWidth.value = explorerEl.value.offsetWidth
    explorerObserver = new ResizeObserver(([entry]) => {
      explorerWidth.value = entry.contentRect.width
    })
    explorerObserver.observe(explorerEl.value)
  })

  const documentMaxWidth = computed(() => {
    if (explorerWidth.value === 0) return Infinity
    const fieldsUsed = showFieldsPanel.value && fieldsOpen.value ? fieldsWidth.value : 0
    return Math.max(documentMinWidth, explorerWidth.value - fieldsUsed - logMinWidth)
  })

  watch(
    [documentMaxWidth, documentWidth],
    ([max, width]) => {
      if (width > max) documentWidth.value = max
    },
    { flush: 'sync' }
  )

  onScopeDispose(() => {
    explorerObserver?.disconnect()
  })

  return { showFieldsPanel, isWide }
}
