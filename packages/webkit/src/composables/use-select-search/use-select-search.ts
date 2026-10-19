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
  onPick: (key: string) => void
  onCommit?: () => void
}

export interface UseSelectSearchReturn {
  open: Ref<boolean>
  query: Ref<string>
  filtered: ComputedRef<SelectSearchItem[]>
  activeKey: ComputedRef<string | undefined>
  activeIndex: Readonly<Ref<number>>
  searchId: string
  optionId: (key: string) => string
  setActive: (index: number) => void
  onTriggerKeydown: (event: KeyboardEvent) => void
  onContentKeydown: (event: KeyboardEvent) => void
  onSearchKeydown: (event: KeyboardEvent) => void
}

const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const matches = (item: SelectSearchItem, term: string) => {
  const text = normalize(item.text)
  return (
    text.startsWith(term) ||
    text.includes(` ${term}`) ||
    (item.keywords ?? []).some((keyword) => normalize(keyword).startsWith(term))
  )
}

const isPrintable = (event: KeyboardEvent) =>
  event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey

/** Type-to-filter and active-descendant keyboard model for a Select list; per-instance state. */
export function useSelectSearch(options: UseSelectSearchOptions): UseSelectSearchReturn {
  const open = ref(false)
  const query = ref('')
  const activeIndex = ref(0)
  const searchId = `${options.idPrefix}-search`

  const optionId = (key: string) => `${options.idPrefix}-option-${key}`
  const focusById = (id: string) => document.getElementById(id)?.focus()

  const filtered = computed(() => {
    const term = normalize(query.value)
    const items = toValue(options.items)
    return term ? items.filter((item) => matches(item, term)) : items
  })

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

  const moveActive = (from: number, step: 1 | -1) => {
    const items = filtered.value
    for (let i = 1; i <= items.length; i++) {
      const index = (((from + step * i) % items.length) + items.length) % items.length
      if (!items[index].disabled) {
        activeIndex.value = index
        scrollActiveIntoView()
        return
      }
    }
  }

  const commit = () => {
    if (!activeKey.value) return
    options.onPick(activeKey.value)
    if (toValue(options.multiple)) return
    open.value = false
    if (options.onCommit) options.onCommit()
    else focusById(toValue(options.triggerId))
  }

  const close = () => {
    open.value = false
    focusById(toValue(options.triggerId))
  }

  const onTriggerKeydown = (event: KeyboardEvent) => {
    if (!isPrintable(event)) return
    event.preventDefault()
    query.value = open.value ? query.value + event.key : event.key
    open.value = true
  }

  const onContentKeydown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLElement && event.target.id === searchId) return
    if (isPrintable(event)) focusById(searchId)
  }

  const onSearchKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      close()
      return
    }
    const keys: Record<string, () => void> = {
      ArrowDown: () => moveActive(activeIndex.value, 1),
      ArrowUp: () => moveActive(activeIndex.value, -1),
      Home: () => moveActive(-1, 1),
      End: () => moveActive(filtered.value.length, -1),
      Enter: commit,
      Escape: close
    }
    const handle = keys[event.key]
    if (!handle) return
    event.preventDefault()
    event.stopPropagation()
    handle()
  }

  watch(query, () => {
    activeIndex.value = 0
  })

  watch(open, async (next) => {
    if (!next) {
      query.value = ''
      return
    }
    const selected = new Set(toValue(options.selectedKeys))
    const index = filtered.value.findIndex((item) => selected.has(item.key))
    activeIndex.value = query.value || index < 0 ? 0 : index
    await nextTick()
    focusById(searchId)
    scrollActiveIntoView()
  })

  return {
    open,
    query,
    filtered,
    activeKey,
    activeIndex: readonly(activeIndex),
    searchId,
    optionId,
    setActive,
    onTriggerKeydown,
    onContentKeydown,
    onSearchKeydown
  }
}
