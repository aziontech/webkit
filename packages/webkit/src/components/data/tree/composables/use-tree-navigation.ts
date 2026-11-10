import { computed, type MaybeRefOrGetter, readonly, type Ref, ref, toValue, watch } from 'vue'

export interface TreeNavigationItem<T> {
  id: string
  children?: T[]
}

export interface TreeNavigationEntry<T> {
  item: T
  level: number
  parentId: string
}

export interface UseTreeNavigationOptions<T> {
  items: MaybeRefOrGetter<T[]>
  expanded: MaybeRefOrGetter<string[]>
  selected: MaybeRefOrGetter<string>
}

export interface UseTreeNavigationReturn<T> {
  visible: Readonly<Ref<readonly string[]>>
  tabStop: Readonly<Ref<string>>
  entry: (id: string) => TreeNavigationEntry<T> | undefined
  isParent: (id: string) => boolean
  setFocused: (id: string) => void
  sibling: (id: string, offset: 1 | -1) => string
  first: () => string
  last: () => string
  parentOf: (id: string) => string
  firstChildOf: (id: string) => string
}

const hasChildren = <T extends TreeNavigationItem<T>>(item: T): boolean =>
  Array.isArray(item.children) && item.children.length > 0

export function useTreeNavigation<T extends TreeNavigationItem<T>>(
  options: UseTreeNavigationOptions<T>
): UseTreeNavigationReturn<T> {
  const focused = ref('')

  const index = computed(() => {
    const map = new Map<string, TreeNavigationEntry<T>>()
    const walk = (nodes: T[], level: number, parentId: string) => {
      for (const item of nodes) {
        map.set(item.id, { item, level, parentId })
        if (hasChildren(item)) walk(item.children ?? [], level + 1, item.id)
      }
    }
    walk(toValue(options.items), 1, '')
    return map
  })

  const visible = computed<readonly string[]>(() => {
    const open = new Set(toValue(options.expanded))
    const ids: string[] = []
    const walk = (nodes: T[]) => {
      for (const item of nodes) {
        ids.push(item.id)
        if (hasChildren(item) && open.has(item.id)) walk(item.children ?? [])
      }
    }
    walk(toValue(options.items))
    return ids
  })

  const visibleSet = computed(() => new Set(visible.value))

  const nearestVisible = (id: string): string => {
    let current = index.value.get(id)
    while (current && !visibleSet.value.has(current.item.id)) {
      current = current.parentId ? index.value.get(current.parentId) : undefined
    }
    return current?.item.id ?? ''
  }

  const tabStop = computed(() => {
    const selected = toValue(options.selected)
    if (selected && visibleSet.value.has(selected)) return selected
    if (focused.value && visibleSet.value.has(focused.value)) return focused.value
    if (selected && index.value.has(selected)) return nearestVisible(selected)
    return visible.value[0] ?? ''
  })

  watch(visible, () => {
    if (!focused.value || visibleSet.value.has(focused.value)) return
    focused.value = nearestVisible(focused.value)
  })

  const entry = (id: string) => index.value.get(id)

  const isParent = (id: string) => {
    const found = index.value.get(id)
    return found ? hasChildren(found.item) : false
  }

  const setFocused = (id: string) => {
    focused.value = index.value.has(id) ? id : ''
  }

  const sibling = (id: string, offset: 1 | -1) => {
    const position = visible.value.indexOf(id)
    if (position === -1) return ''
    return visible.value[position + offset] ?? ''
  }

  const first = () => visible.value[0] ?? ''

  const last = () => visible.value[visible.value.length - 1] ?? ''

  const parentOf = (id: string) => index.value.get(id)?.parentId ?? ''

  const firstChildOf = (id: string) => {
    const found = index.value.get(id)
    if (!found || !hasChildren(found.item)) return ''
    return found.item.children?.[0]?.id ?? ''
  }

  return {
    visible: readonly(visible),
    tabStop: readonly(tabStop),
    entry,
    isParent,
    setFocused,
    sibling,
    first,
    last,
    parentOf,
    firstChildOf
  }
}
