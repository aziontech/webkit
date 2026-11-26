import './reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import { toast, Toaster } from '../components/feedback/toast'
import SaveBar from '../components/layout/save-bar/save-bar.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const appOffset = document.createElement('style')

afterEach(async () => {
  toast.dismiss()
  appOffset.remove()
  await nextTick()
})

const Page = defineComponent({
  props: { bottom: { type: String, default: '0' } },
  setup: (props) => () =>
    h(
      'div',
      {
        style: `position: fixed; inset: 0 0 ${props.bottom} 0; overflow-y: auto; display: flex; flex-direction: column`
      },
      [
        h('div', { style: 'height: 1200px; flex: none' }, 'Form'),
        h(SaveBar, null, {
          default: () => 'You have unsaved changes.',
          actions: () => h('button', { type: 'button' }, 'Save')
        })
      ]
    )
})

async function toastAndBar(bottom: string) {
  const view = render({
    components: { Page, Toaster },
    setup: () => ({ bottom }),
    template: '<div><Page :bottom="bottom" /><Toaster /></div>'
  })
  await nextTick()
  await nextTick()
  toast('Saved', { duration: 0 })
  const shell = view.getByTestId('save-bar').firstElementChild as HTMLElement
  await vi.waitFor(() =>
    expect(document.body.querySelector('[data-testid="toast-item"]')).not.toBeNull()
  )
  await new Promise((resolve) => setTimeout(resolve, 800))
  await frame()
  const card = document.body.querySelector<HTMLElement>('[data-testid="toast-item"]')
  return { view, bar: shell.getBoundingClientRect(), card: card!.getBoundingClientRect() }
}

describe('a toast never covers a SaveBar', () => {
  it('stacks the toast above a floating bar at the bottom of the viewport', async () => {
    const { view, bar, card } = await toastAndBar('0')

    expect(bar.height).toBeGreaterThan(0)
    expect(Math.round(bar.bottom)).toBe(window.innerHeight)
    expect(card.bottom).toBeLessThanOrEqual(bar.top)
    view.unmount()
  })

  it('keeps the app offset and adds the bar on top of it', async () => {
    appOffset.textContent = ':root { --toast-offset-bottom: 4rem; }'
    document.head.appendChild(appOffset)

    const { view, bar, card } = await toastAndBar('4rem')

    expect(Math.round(window.innerHeight - bar.bottom)).toBe(64)
    expect(card.bottom).toBeLessThanOrEqual(bar.top)
    view.unmount()
  })
})
