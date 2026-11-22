import { readonly, type Ref, ref } from 'vue'

import type { CategoryLayout, ChartRange, NormalizedSeries } from '../../lib'
import { useChartKeyboard } from './use-chart-keyboard'
import { useChartPointer } from './use-chart-pointer'

export interface UseChartInteractionOptions {
  stageEl: Readonly<Ref<HTMLElement | null>>
  activeIndex: Ref<number | null>
  range: Ref<ChartRange | null>
  count: Readonly<Ref<number>>
  vertical: Readonly<Ref<boolean>>
  direction: Readonly<Ref<'ltr' | 'rtl'>>
  hasBrush: Readonly<Ref<boolean>>
  category: () => CategoryLayout
  visibleSeries: Readonly<Ref<NormalizedSeries[]>>
  pick: (event: MouseEvent | KeyboardEvent, index: number) => void
}

export interface UseChartInteractionReturn {
  draft: Readonly<Ref<ChartRange | null>>
  committed: Readonly<Ref<boolean>>
  focusedSeries: Readonly<Ref<string | null>>
  emphasized: Readonly<Ref<string | null>>
  setActiveIndex: (index: number | null) => void
  setEmphasized: (id: string | null) => void
}

export function useChartInteraction(
  options: UseChartInteractionOptions
): UseChartInteractionReturn {
  const { activeIndex, range } = options
  const emphasized = ref<string | null>(null)
  const focusedSeries = ref<string | null>(null)
  const draft = ref<ChartRange | null>(null)
  const committed = ref(false)

  function setActiveIndex(index: number | null): void {
    committed.value = false
    if (activeIndex.value !== index) activeIndex.value = index
  }

  function commitRange(span: ChartRange | null): void {
    draft.value = null
    if (!span) return
    range.value = [Math.min(span[0], span[1]), Math.max(span[0], span[1])]
    committed.value = true
  }

  const shared = { ...options, draft, setActiveIndex, commitRange }
  useChartPointer(shared)
  useChartKeyboard({
    ...shared,
    focusedSeries,
    setFocusedSeries: (id) => {
      focusedSeries.value = id
      emphasized.value = id
    }
  })

  return {
    draft: readonly(draft),
    committed: readonly(committed),
    focusedSeries: readonly(focusedSeries),
    emphasized: readonly(emphasized),
    setActiveIndex,
    setEmphasized: (id) => {
      emphasized.value = id
    }
  }
}
