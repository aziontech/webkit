import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import { type UseLazyChunks, useLazyChunks } from './index'

function withChunks(run: (api: UseLazyChunks) => void) {
  render(
    defineComponent({
      setup() {
        run(useLazyChunks({ rowHeight: 10, chunkSize: 4, threshold: 6 }))
        return () => h('div')
      }
    })
  )
}

describe('useLazyChunks', () => {
  it('keeps a list at or under the threshold as one mounted chunk', () => {
    withChunks(({ split }) => {
      const chunks = split([1, 2, 3, 4, 5, 6])
      expect(chunks).toHaveLength(1)
      expect(chunks[0]).toMatchObject({ mounted: true, start: 0, items: [1, 2, 3, 4, 5, 6] })
    })
  })

  it('splits a longer list into chunks, mounting only the first, with estimated heights', () => {
    withChunks(({ split }) => {
      const chunks = split([1, 2, 3, 4, 5, 6, 7, 8, 9])
      expect(chunks.map((c) => [c.start, c.items.length, c.mounted, c.estimatedHeight])).toEqual([
        [0, 4, true, 40],
        [4, 4, false, 40],
        [8, 1, false, 10]
      ])
    })
  })

  it('mounts every chunk after revealAll', async () => {
    let api: UseLazyChunks | null = null
    withChunks((value) => {
      api = value
    })
    const ready = api as unknown as UseLazyChunks
    ready.revealAll()
    await nextTick()
    expect(ready.split([1, 2, 3, 4, 5, 6, 7, 8, 9]).every((c) => c.mounted)).toBe(true)
  })

  it('mounts a chunk whose placeholder scrolls into view', async () => {
    const view = render(
      defineComponent({
        setup() {
          const { split, observe } = useLazyChunks({ rowHeight: 10, chunkSize: 4, threshold: 6 })
          return () =>
            h(
              'div',
              split([1, 2, 3, 4, 5, 6, 7, 8, 9]).map((c) =>
                c.mounted
                  ? h('p', { key: c.index }, c.items.join(','))
                  : h('div', {
                      key: c.index,
                      ref: (el: unknown) => observe(el, c.index),
                      'data-chunk': c.index,
                      style: { height: `${c.estimatedHeight}px` }
                    })
              )
            )
        }
      })
    )
    await expect.poll(() => view.container.querySelectorAll('p').length, { timeout: 2000 }).toBe(3)
  })
})
