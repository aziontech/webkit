import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { h } from 'vue'

import DeleteSettingsRow from '../../blocks/edit/edit-delete-dialog/variants/settings-row.vue'
import FunctionArguments from '../../blocks/edit/edit-function/variants/arguments.vue'
import FunctionTestRun from '../../blocks/edit/edit-function/variants/test-run.vue'
import FirstUseLoading from '../../blocks/state/state-first-use/variants/loading.vue'
import Skeleton from '../components/feedback/skeleton/skeleton.vue'

const overlaps = (a: DOMRect, b: DOMRect) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom

describe('clipped content', () => {
  it('never draws a rectangle wider than its container', () => {
    const view = render(() =>
      h('div', { style: 'width: 100px' }, [h(Skeleton, { width: '16rem', height: '1rem' })])
    )
    const bar = view.getByTestId('skeleton')
    expect(bar.getBoundingClientRect().width).toBeLessThanOrEqual(100)
  })

  it('keeps the state-first-use loading rows apart on a phone', () => {
    const view = render(() => h('div', { style: 'width: 358px' }, [h(FirstUseLoading)]))
    const rows = view.container.querySelectorAll<HTMLElement>('[data-slot="item"]')
    expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) {
      const bars = [...row.querySelectorAll('[data-slot="item-content"] [data-testid="skeleton"]')]
      const action = row.querySelector('[data-slot="item-actions"] [data-testid="skeleton"]')!
      const boxes = bars.map((bar) => bar.getBoundingClientRect())
      for (const box of boxes) expect(overlaps(box, action.getBoundingClientRect())).toBe(false)
      expect(overlaps(boxes[0]!, boxes[1]!)).toBe(false)
      expect(boxes[1]!.top - boxes[0]!.bottom).toBeGreaterThan(0)
    }
  })

  it('shows the whole irreversible warning of the delete settings row on a phone', () => {
    const view = render(() => h('div', { style: 'width: 358px' }, [h(DeleteSettingsRow)]))
    const description = view.container.querySelector<HTMLElement>('[data-slot="item-description"]')!
    expect(description.textContent).toContain('This cannot be undone.')
    expect(description.scrollHeight).toBeLessThanOrEqual(description.clientHeight + 1)
  })

  it.each([320, 768])('shows each argument field name in full at %ipx', async (width) => {
    const view = render(() => h('div', { style: `width: ${width}px` }, [h(FunctionArguments)]))
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    const headers = view.container.querySelectorAll<HTMLElement>('[data-slot="field-header"]')
    expect(headers.length).toBeGreaterThan(0)
    for (const header of headers) {
      const key = header.querySelector<HTMLElement>('[data-slot="item-content"] .font-code')!
      expect(key.textContent?.trim()).not.toBe('')
      expect(key.getBoundingClientRect().width).toBeGreaterThan(0)
      expect(key.scrollWidth).toBeLessThanOrEqual(key.clientWidth + 1)
    }
  })

  it('reads the whole test run below the editor on a phone, with no pane to scroll', async () => {
    await page.viewport(390, 844)
    const view = render(FunctionTestRun)
    const pane = await vi.waitFor(() => {
      const found = view.container.querySelector<HTMLElement>(
        'section[aria-labelledby="test-run-title"]'
      )
      expect(found).not.toBeNull()
      return found!
    })
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    expect(pane.scrollHeight).toBeLessThanOrEqual(pane.clientHeight + 1)
    expect(view.container.querySelector('[role="separator"]')?.getBoundingClientRect().height).toBe(
      0
    )
  })
})

afterEach(async () => {
  await page.viewport(414, 896)
})
