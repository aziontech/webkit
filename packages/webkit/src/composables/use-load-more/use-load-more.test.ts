import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import { useLoadMore } from './index'

const ITEMS = [1, 2, 3, 4, 5]

describe('useLoadMore', () => {
  it('shows every item when the page size is zero or negative', () => {
    const off = useLoadMore(() => ITEMS, -1)
    expect(off.visible.value).toEqual(ITEMS)
    expect(off.hasMore.value).toBe(false)
    const zero = useLoadMore(() => ITEMS, 0)
    expect(zero.visible.value).toEqual(ITEMS)
    expect(zero.hasMore.value).toBe(false)
  })

  it('shows one page, then one more page per loadMore, until nothing is left', () => {
    const list = useLoadMore(() => ITEMS, 2)
    expect(list.visible.value).toEqual([1, 2])
    expect(list.hasMore.value).toBe(true)
    list.loadMore()
    expect(list.visible.value).toEqual([1, 2, 3, 4])
    list.loadMore()
    expect(list.visible.value).toEqual(ITEMS)
    expect(list.hasMore.value).toBe(false)
  })

  it('goes back to the first page on resetPages and follows the items it is given', () => {
    const items = ref(ITEMS)
    const list = useLoadMore(items, 2)
    list.loadMore()
    list.resetPages()
    expect(list.visible.value).toEqual([1, 2])
    items.value = [9]
    expect(list.visible.value).toEqual([9])
    expect(list.hasMore.value).toBe(false)
  })
})
