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

const focusById = (id: string) => document.getElementById(id)?.focus()

function nextEnabled(items: SelectSearchItem[], from: number, step: 1 | -1): number {
  for (let i = 1; i <= items.length; i++) {
    const index = (((from + step * i) % items.length) + items.length) % items.length
    if (!items[index].disabled) return index
  }
  return -1
}

const setter =
  <T>(target: Ref<T>) =>
  (next: T) => {
    target.value = next
  }

function filterItems(items: SelectSearchItem[], query: string): SelectSearchItem[] {
  const term = normalize(query)
  return term ? items.filter((item) => matches(item, term)) : items
}

function openIndex(items: SelectSearchItem[], selectedKeys: string[], query: string): number {
  const selected = new Set(selectedKeys)
  const index = items.findIndex((item) => selected.has(item.key))
  return query || index < 0 ? nextEnabled(items, -1, 1) : index
}

function commitActive(
  options: UseSelectSearchOptions,
  key: string | undefined,
  open: Ref<boolean>,
  close: () => void
): void {
  if (!key || toValue(options.locked)) return
  options.onPick(key)
  if (toValue(options.multiple)) return
  if (!options.onCommit) return close()
  open.value = false
  options.onCommit()
}

function contentKeydown(event: KeyboardEvent, searchId: string): void {
  if (event.target instanceof HTMLElement && event.target.id === searchId) return
  if (isPrintable(event)) focusById(searchId)
}

function triggerKeydown(
  event: KeyboardEvent,
  locked: boolean | undefined,
  open: Ref<boolean>,
  query: Ref<string>
): void {
  if (!isPrintable(event) || locked) return
  event.preventDefault()
  query.value = open.value ? query.value + event.key : event.key
  open.value = true
}

function searchKeydown(
  event: KeyboardEvent,
  close: () => void,
  commit: () => void,
  moveActive: (from: number, step: 1 | -1) => void,
  activeIndex: number,
  count: number
): void {
  if (event.key === 'Tab') {
    close()
    return
  }
  const keys: Record<string, () => void> = {
    ArrowDown: () => moveActive(activeIndex, 1),
    ArrowUp: () => moveActive(activeIndex, -1),
    Home: () => moveActive(-1, 1),
    End: () => moveActive(count, -1),
    Enter: commit,
    Escape: close
  }
  const handle = keys[event.key]
  if (!handle) return
  event.preventDefault()
  event.stopPropagation()
  handle()
}

export function useSelectSearch(options: UseSelectSearchOptions): UseSelectSearchReturn {
  const open = ref(false)
  const query = ref('')
  const activeIndex = ref(0)
  const searchId = `${options.idPrefix}-search`

  const filtered = computed(() => filterItems(toValue(options.items), query.value))

  const positionByKey = computed(
    () => new Map(toValue(options.items).map((item, index) => [item.key, index]))
  )
  const optionId = (key: string) => `${options.idPrefix}-option-${positionByKey.value.get(key)}`

  const activeKey = computed(() => {
    const item = filtered.value[activeIndex.value]
    return item && !item.disabled ? item.key : undefined
  })

  const scrollActiveIntoView = async () => {
    await nextTick()
    if (activeKey.value)
      document.getElementById(optionId(activeKey.value))?.scrollIntoView({ block: 'nearest' })
  }

  const moveActive = (from: number, step: 1 | -1) => {
    activeIndex.value = nextEnabled(filtered.value, from, step)
    scrollActiveIntoView()
  }

  const close = () => {
    open.value = false
    focusById(toValue(options.triggerId))
  }

  const commit = () => commitActive(options, activeKey.value, open, close)

  watch(query, () => {
    activeIndex.value = nextEnabled(filtered.value, -1, 1)
  })

  watch(open, async (next) => {
    if (!next) {
      query.value = ''
      return
    }
    activeIndex.value = openIndex(filtered.value, toValue(options.selectedKeys), query.value)
    await nextTick()
    focusById(searchId)
    scrollActiveIntoView()
  })

  return {
    open: readonly(open),
    query: readonly(query),
    filtered,
    activeKey,
    activeIndex: readonly(activeIndex),
    searchId,
    optionId,
    setOpen: setter(open),
    setQuery: setter(query),
    setActive: setter(activeIndex),
    onTriggerKeydown: (event: KeyboardEvent) =>
      triggerKeydown(event, toValue(options.locked), open, query),
    onContentKeydown: (event: KeyboardEvent) => contentKeydown(event, searchId),
    onSearchKeydown: (event: KeyboardEvent) =>
      searchKeydown(event, close, commit, moveActive, activeIndex.value, filtered.value.length)
  }
}
