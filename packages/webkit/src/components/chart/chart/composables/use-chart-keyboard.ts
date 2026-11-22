import type { Ref } from 'vue'

import { logicalArrowKey } from '../../../../composables/use-direction'
import { useElementListener } from '../../../../composables/use-element-listener'
import { type ChartRange, type NormalizedSeries, stepIndex } from '../../lib'

export interface UseChartKeyboardOptions {
  stageEl: Readonly<Ref<HTMLElement | null>>
  draft: Ref<ChartRange | null>
  range: Ref<ChartRange | null>
  activeIndex: Readonly<Ref<number | null>>
  focusedSeries: Readonly<Ref<string | null>>
  count: Readonly<Ref<number>>
  vertical: Readonly<Ref<boolean>>
  direction: Readonly<Ref<'ltr' | 'rtl'>>
  hasBrush: Readonly<Ref<boolean>>
  visibleSeries: Readonly<Ref<NormalizedSeries[]>>
  setActiveIndex: (index: number | null) => void
  setFocusedSeries: (id: string | null) => void
  commitRange: (span: ChartRange | null) => void
  pick: (event: KeyboardEvent, index: number) => void
}

function stepSeries(options: UseChartKeyboardOptions, delta: number): void {
  const list = options.visibleSeries.value
  if (list.length < 2) return
  const at = list.findIndex((entry) => entry.id === options.focusedSeries.value)
  const next = at === -1 ? (delta > 0 ? 0 : list.length - 1) : at + delta
  options.setFocusedSeries(list[next]?.id ?? null)
  if (options.activeIndex.value === null) options.setActiveIndex(0)
}

function moveTo(options: UseChartKeyboardOptions, event: KeyboardEvent, target: number): void {
  const { draft } = options
  if (options.hasBrush.value && event.shiftKey)
    draft.value = [draft.value?.[0] ?? options.activeIndex.value ?? target, target]
  else if (draft.value) draft.value = null
  options.setActiveIndex(target)
}

function escape(options: UseChartKeyboardOptions): void {
  if (options.draft.value) options.draft.value = null
  else if (options.focusedSeries.value !== null) options.setFocusedSeries(null)
  else if (options.activeIndex.value !== null) options.setActiveIndex(null)
  else if (options.range.value) options.range.value = null
}

function confirm(options: UseChartKeyboardOptions, event: KeyboardEvent): void {
  const current = options.activeIndex.value
  if (options.draft.value) options.commitRange(options.draft.value)
  else if (current !== null) {
    if (options.hasBrush.value) options.commitRange([current, current])
    options.pick(event, current)
  }
}

function handle(options: UseChartKeyboardOptions, event: KeyboardEvent): boolean {
  const vertical = options.vertical.value
  const key = logicalArrowKey(event.key, options.direction.value)
  const target = stepIndex(
    key,
    options.activeIndex.value,
    options.count.value - 1,
    [vertical ? 'ArrowRight' : 'ArrowDown'],
    [vertical ? 'ArrowLeft' : 'ArrowUp']
  )
  if (target !== undefined) moveTo(options, event, target)
  else if (key === (vertical ? 'ArrowDown' : 'ArrowRight')) stepSeries(options, 1)
  else if (key === (vertical ? 'ArrowUp' : 'ArrowLeft')) stepSeries(options, -1)
  else if (key === 'Escape') escape(options)
  else if (key === 'Enter' || key === ' ') confirm(options, event)
  else return false
  return true
}

export function useChartKeyboard(options: UseChartKeyboardOptions): void {
  useElementListener(options.stageEl, 'keydown', (event) => {
    if (options.count.value - 1 >= 0 && handle(options, event)) event.preventDefault()
  })
}
