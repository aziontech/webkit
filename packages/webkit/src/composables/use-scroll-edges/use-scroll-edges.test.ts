import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { useScrollEdges, type UseScrollEdgesReturn } from './index'

const host = (dir: 'ltr' | 'rtl', sink: { edges?: UseScrollEdgesReturn; el?: HTMLElement }) =>
  defineComponent({
    setup() {
      const scroller = ref<HTMLElement | null>(null)
      sink.edges = useScrollEdges(scroller)
      return () =>
        h(
          'div',
          {
            ref: (el) => {
              scroller.value = el as HTMLElement | null
              sink.el = (el as HTMLElement | null) ?? undefined
            },
            dir,
            style: { width: '100px', overflowX: 'auto' },
            onScroll: () => sink.edges?.measure()
          },
          [h('div', { style: { width: '400px', height: '10px' } })]
        )
    }
  })

const settle = async (): Promise<void> => {
  await nextTick()
  await new Promise((done) => requestAnimationFrame(() => done(null)))
}

describe('useScrollEdges', () => {
  it.each(['ltr', 'rtl'] as const)(
    'tracks both inline edges as the scroller moves (%s)',
    async (dir) => {
      const sink: { edges?: UseScrollEdgesReturn; el?: HTMLElement } = {}
      render(host(dir, sink))
      await settle()
      expect(sink.edges?.start.value).toBe(0)
      expect(sink.edges?.end.value).toBe(24)

      const el = sink.el as HTMLElement
      el.scrollLeft = dir === 'rtl' ? -150 : 150
      sink.edges?.measure()
      expect(sink.edges?.start.value).toBe(24)
      expect(sink.edges?.end.value).toBe(24)

      el.scrollLeft = dir === 'rtl' ? -300 : 300
      sink.edges?.measure()
      expect(sink.edges?.start.value).toBe(24)
      expect(sink.edges?.end.value).toBe(0)
    }
  )

  it('ignores an overflow of a few pixels and caps the fade size', async () => {
    const sink: { edges?: UseScrollEdgesReturn; el?: HTMLElement } = {}
    render(host('ltr', sink))
    await settle()
    const content = sink.el?.firstElementChild as HTMLElement
    content.style.width = '103px'
    await settle()
    sink.edges?.measure()
    expect(sink.edges?.end.value).toBe(0)
    content.style.width = '110px'
    await settle()
    sink.edges?.measure()
    expect(sink.edges?.end.value).toBe(10)
    content.style.width = '400px'
    await settle()
    sink.edges?.measure()
    expect(sink.edges?.end.value).toBe(24)
  })

  it('reports no edge when the content fits', async () => {
    const sink: { edges?: UseScrollEdgesReturn; el?: HTMLElement } = {}
    render(host('ltr', sink))
    await settle()
    ;(sink.el?.firstElementChild as HTMLElement).style.width = '50px'
    await settle()
    sink.edges?.measure()
    expect(sink.edges?.start.value).toBe(0)
    expect(sink.edges?.end.value).toBe(0)
  })
})
