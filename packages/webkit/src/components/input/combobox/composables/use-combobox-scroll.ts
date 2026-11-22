import { type ComputedRef, nextTick, onBeforeUpdate, type Ref, watch } from 'vue'

import type { ComboboxRow } from '../lib/combobox-rows'

type LazyList = { revealAll: () => void }

export interface UseComboboxScrollReturn {
  setLazy: (el: unknown) => void
  scrollActiveIntoView: () => void
}

export function useComboboxScroll(
  rows: ComputedRef<ComboboxRow[]>,
  activeId: ComputedRef<string | undefined>,
  panelEl: Ref<HTMLElement | null>,
  selectedValue: () => string,
  expanded: ComputedRef<boolean>,
  typing: Ref<boolean>
): UseComboboxScrollReturn {
  const lazyLists = new Set<LazyList>()
  onBeforeUpdate(() => lazyLists.clear())
  const setLazy = (el: unknown) => {
    if (el && typeof (el as { revealAll?: unknown }).revealAll === 'function') {
      lazyLists.add(el as LazyList)
    }
  }

  const scrollActiveIntoView = () => {
    lazyLists.forEach((list) => list.revealAll())
    nextTick(() => {
      const id = activeId.value
      if (id) globalThis.document?.getElementById(id)?.scrollIntoView?.({ block: 'nearest' })
    })
  }

  const revealSelected = () => {
    const row = rows.value.find(
      (item) => item.kind === 'option' && item.option.value === selectedValue()
    )
    if (!row) return
    lazyLists.forEach((list) => list.revealAll())
    nextTick(() => {
      const list = panelEl.value
      const item = globalThis.document?.getElementById(row.id)
      if (!list || !item) return
      const offset = item.getBoundingClientRect().top - list.getBoundingClientRect().top
      list.scrollTop += offset - (list.clientHeight - item.offsetHeight) / 2
    })
  }

  watch(expanded, (isExpanded) => {
    if (isExpanded && !typing.value) revealSelected()
  })

  return { setLazy, scrollActiveIntoView }
}
