import { computed, type ComputedRef, type MaybeRefOrGetter, nextTick, ref, toValue } from 'vue'

export interface UseLoadMoreReturn<T> {
  visible: ComputedRef<T[]>
  hasMore: ComputedRef<boolean>
  loadMore: () => Promise<void>
  resetPages: () => void
}

export function useLoadMore<T>(
  items: MaybeRefOrGetter<T[]>,
  pageSize: MaybeRefOrGetter<number>,
  listEl: MaybeRefOrGetter<HTMLElement | null> = null
): UseLoadMoreReturn<T> {
  const pages = ref(1)

  const visible = computed(() => {
    const size = toValue(pageSize)
    return size > 0 ? toValue(items).slice(0, pages.value * size) : toValue(items)
  })

  const hasMore = computed(() => visible.value.length < toValue(items).length)

  const loadMore = async () => {
    const from = visible.value.length
    pages.value += 1
    await nextTick()
    const revealed = toValue(listEl)?.children.item(from)
    revealed?.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus()
  }

  const resetPages = () => {
    pages.value = 1
  }

  return { visible, hasMore, loadMore, resetPages }
}
