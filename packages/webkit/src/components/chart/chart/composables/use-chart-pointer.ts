import { useEventListener } from '@vueuse/core'
import { type Ref, ref } from 'vue'

import { useElementListener } from '../../../../composables/use-element-listener'
import type { CategoryLayout, ChartRange } from '../../lib'

export interface UseChartPointerOptions {
  stageEl: Readonly<Ref<HTMLElement | null>>
  draft: Ref<ChartRange | null>
  activeIndex: Readonly<Ref<number | null>>
  count: Readonly<Ref<number>>
  vertical: Readonly<Ref<boolean>>
  category: () => CategoryLayout
  hasBrush: Readonly<Ref<boolean>>
  setActiveIndex: (index: number | null) => void
  commitRange: (span: ChartRange | null) => void
  pick: (event: MouseEvent, index: number) => void
}

const isTouch = (event: MouseEvent): boolean =>
  event instanceof globalThis.PointerEvent &&
  (event.pointerType === 'touch' || event.pointerType === 'pen')

function indexAt(options: UseChartPointerOptions, event: MouseEvent): number | null {
  const stage = options.stageEl.value
  if (!stage || !options.count.value) return null
  const rect = stage.getBoundingClientRect()
  const offset = options.vertical.value ? event.clientX - rect.left : event.clientY - rect.top
  return options.category().indexAt(offset)
}

function startBrush(options: UseChartPointerOptions, event: PointerEvent): void {
  if (!options.hasBrush.value || event.button !== 0) return
  const index = indexAt(options, event)
  if (index === null) return
  options.draft.value = [index, index]
  options.setActiveIndex(index)
  try {
    options.stageEl.value?.setPointerCapture?.(event.pointerId)
  } catch {
    return
  }
}

export function useChartPointer(options: UseChartPointerOptions): void {
  const { stageEl, draft, setActiveIndex } = options
  const touchActive = ref(false)

  useElementListener(stageEl, 'pointerdown', (event) => {
    const index = isTouch(event) ? indexAt(options, event) : null
    if (index !== null) {
      touchActive.value = true
      setActiveIndex(index)
    }
    startBrush(options, event)
  })
  useElementListener(stageEl, 'pointermove', (event) => {
    const index = indexAt(options, event)
    if (index === null) return
    if (draft.value) draft.value = [draft.value[0], index]
    setActiveIndex(index)
  })
  useElementListener(stageEl, 'pointerup', () => {
    if (draft.value) options.commitRange(draft.value)
  })
  useElementListener(stageEl, 'pointercancel', () => {
    draft.value = null
  })
  useElementListener(stageEl, 'pointerleave', (event) => {
    if (!isTouch(event) && !draft.value) setActiveIndex(null)
  })
  useEventListener(globalThis.document, 'pointerdown', (event: PointerEvent) => {
    if (!touchActive.value || stageEl.value?.contains(event.target as Node)) return
    touchActive.value = false
    if (!draft.value) setActiveIndex(null)
  })
  useElementListener(stageEl, 'click', (event) => {
    const index = options.activeIndex.value ?? (isTouch(event) ? indexAt(options, event) : null)
    if (index !== null) options.pick(event, index)
  })
}
