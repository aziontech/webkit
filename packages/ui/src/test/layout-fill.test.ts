import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import FillPageExample from '../../examples/console-layout/fill-page.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

async function settle() {
  await nextTick()
  for (let i = 0; i < 6; i += 1) await frame()
  await new Promise((resolve) => setTimeout(resolve, 150))
}

function mountAt(width: number, height: number) {
  return render(
    defineComponent({
      render: () =>
        h('div', { style: { width: `${width}px`, height: `${height}px` } }, [h(FillPageExample)])
    })
  )
}

describe('data-layout-fill (styled)', () => {
  for (const [label, width] of [
    ['wide', 1280],
    ['compact', 480]
  ] as const) {
    it(`gives a fill page the whole content area without scrolling the page (${label})`, async () => {
      const view = mountAt(width, 700)
      await settle()
      const content = view.getByTestId('app-layout__content')
      const main = view.getByRole('main')
      const root = main.querySelector<HTMLElement>(':scope > [data-layout-fill]')!

      expect(content.scrollHeight).toBeLessThanOrEqual(content.clientHeight + 1)
      expect(
        Math.abs(root.getBoundingClientRect().bottom - content.getBoundingClientRect().bottom)
      ).toBeLessThanOrEqual(1)

      const lines = view.getByRole('group', { name: 'Source lines' })
      expect(lines.scrollHeight).toBeGreaterThan(lines.clientHeight)
    })
  }
})
