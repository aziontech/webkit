import { computed, type ComputedRef, type MaybeRefOrGetter, ref, toValue } from 'vue'

export interface UseLoadMoreReturn<T> {
  visible: ComputedRef<T[]>
  hasMore: ComputedRef<boolean>
  loadMore: () => void
  resetPages: () => void
}

export function useLoadMore<T>(
  items: MaybeRefOrGetter<T[]>,
  pageSize: MaybeRefOrGetter<number>
): UseLoadMoreReturn<T> {
  const pages = ref(1)

  const visible = computed(() => {
    const size = toValue(pageSize)
    return size > 0 ? toValue(items).slice(0, pages.value * size) : toValue(items)
  })

  const hasMore = computed(() => visible.value.length < toValue(items).length)

  const loadMore = () => {
    pages.value += 1
  }

  const resetPages = () => {
    pages.value = 1
  }

  return { visible, hasMore, loadMore, resetPages }
}
