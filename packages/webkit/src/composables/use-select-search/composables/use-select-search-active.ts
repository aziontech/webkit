import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  nextTick,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

import { nextEnabledIndex } from '../lib/search'
import type { SelectSearchItem } from '../use-select-search'

export interface UseSelectSearchActiveReturn {
  activeKey: ComputedRef<string | undefined>
  activeIndex: Readonly<Ref<number>>
  optionId: (key: string) => string
  setActive: (index: number) => void
  firstEnabled: () => number
  moveActive: (from: number, step: 1 | -1) => void
  scrollActiveIntoView: () => Promise<void>
}

export function useSelectSearchActive(
  items: MaybeRefOrGetter<SelectSearchItem[]>,
  filtered: Readonly<Ref<SelectSearchItem[]>>,
  idPrefix: string
): UseSelectSearchActiveReturn {
  const activeIndex = ref(0)

  const positionByKey = computed(
    () => new Map(toValue(items).map((item, index) => [item.key, index]))
  )
  const optionId = (key: string) => `${idPrefix}-option-${positionByKey.value.get(key)}`

  const activeKey = computed(() => {
    const item = filtered.value[activeIndex.value]
    return item && !item.disabled ? item.key : undefined
  })

  const scrollActiveIntoView = async () => {
    await nextTick()
    if (activeKey.value)
      document.getElementById(optionId(activeKey.value))?.scrollIntoView({ block: 'nearest' })
  }

  const setActive = (index: number) => {
    activeIndex.value = index
  }

  const firstEnabled = () => nextEnabledIndex(filtered.value, -1, 1)

  const moveActive = (from: number, step: 1 | -1) => {
    activeIndex.value = nextEnabledIndex(filtered.value, from, step)
    scrollActiveIntoView()
  }

  return {
    activeKey,
    activeIndex: readonly(activeIndex),
    optionId,
    setActive,
    firstEnabled,
    moveActive,
    scrollActiveIntoView
  }
}
