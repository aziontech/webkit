import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  nextTick,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import { useSelectSearchActive } from './composables/use-select-search-active'
import { createSearchKeydowns } from './lib/keys'
import { filterItems, focusById } from './lib/search'

export interface SelectSearchItem {
  key: string
  text: string
  keywords?: string[]
  disabled?: boolean
}

export interface UseSelectSearchOptions {
  items: MaybeRefOrGetter<SelectSearchItem[]>
  selectedKeys: MaybeRefOrGetter<string[]>
  idPrefix: string
  triggerId: MaybeRefOrGetter<string>
  multiple?: MaybeRefOrGetter<boolean>
  locked?: MaybeRefOrGetter<boolean>
  onPick: (key: string) => void
  onCommit?: () => void
}

export interface UseSelectSearchReturn {
  open: Readonly<Ref<boolean>>
  query: Readonly<Ref<string>>
  filtered: ComputedRef<SelectSearchItem[]>
  activeKey: ComputedRef<string | undefined>
  activeIndex: Readonly<Ref<number>>
  searchId: string
  optionId: (key: string) => string
  setOpen: (next: boolean) => void
  setQuery: (next: string) => void
  setActive: (index: number) => void
  onTriggerKeydown: (event: KeyboardEvent) => void
  onContentKeydown: (event: KeyboardEvent) => void
  onSearchKeydown: (event: KeyboardEvent) => void
}

export function useSelectSearch(options: UseSelectSearchOptions): UseSelectSearchReturn {
  const open = ref(false)
  const query = ref('')
  const searchId = `${options.idPrefix}-search`

  const filtered = computed(() => filterItems(toValue(options.items), query.value))
  const active = useSelectSearchActive(options.items, filtered, options.idPrefix)
  const { activeKey, activeIndex, moveActive, firstEnabled } = active

  const setOpen = (next: boolean) => {
    open.value = next
  }

  const setQuery = (next: string) => {
    query.value = next
  }

  const keydowns = createSearchKeydowns(options, {
    open,
    query,
    searchId,
    activeKey,
    activeIndex,
    optionCount: () => filtered.value.length,
    moveActive
  })

  watch(query, () => active.setActive(firstEnabled()))

  watch(open, async (next) => {
    if (!next) {
      query.value = ''
      return
    }
    const selected = new Set(toValue(options.selectedKeys))
    const index = filtered.value.findIndex((item) => selected.has(item.key))
    active.setActive(query.value || index < 0 ? firstEnabled() : index)
    await nextTick()
    focusById(searchId)
    active.scrollActiveIntoView()
  })

  return {
    open: readonly(open),
    query: readonly(query),
    filtered,
    activeKey,
    activeIndex,
    searchId,
    optionId: active.optionId,
    setOpen,
    setQuery,
    setActive: active.setActive,
    ...keydowns
  }
}
