import { composeStories } from '@storybook/vue3'
import { render, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/product-widget/ProductWidget.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import ProductWidget, { type ProductWidgetName } from './product-widget.vue'
import { productWidgets } from './registry'

const { Default, Types } = composeStories(stories)

const TESTID = 'content-product-widget'
const FRAME_TESTID = 'content-shell-mockup'
const NAMES = Object.keys(productWidgets) as ProductWidgetName[]

const reducedMotion = () => globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

const host = (props: Record<string, unknown>) =>
  defineComponent({
    components: { ProductWidget },
    setup: () => ({ props }),
    template: `
      <div style="width: 860px; height: 480px">
        <ProductWidget v-bind="props" />
      </div>
    `
  })

const frameOf = (view: ReturnType<typeof render>) =>
  within(view.container).findByTestId(FRAME_TESTID, {}, { timeout: 5000 })

describe('ProductWidget', () => {
  it('renders the default story under the fallback testid and draws its widget', async () => {
    const view = render(Default())
    const root = view.getByTestId(TESTID)

    expect(root.getAttribute('data-name')).toBe('workloads-list')
    expect(root.contains(await frameOf(view))).toBe(true)
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const view = render(host({ name: 'workloads-list', 'data-testid': 'workloads-band' }))

    expect(view.getByTestId('workloads-band')).toBeInTheDocument()
    expect(view.queryByTestId(TESTID)).toBeNull()
  })

  it('keeps the widget plating when kind is unset', async () => {
    const framed = render(host({ name: 'workloads-list' }))
    expect((await frameOf(framed)).getAttribute('data-kind')).toBe('window')
    framed.unmount()

    const bare = render(host({ name: 'workload-topology-chain' }))
    expect((await frameOf(bare)).getAttribute('data-kind')).toBe('bare')
  })

  it('forwards kind and fade to a widget that declares them', async () => {
    const view = render(host({ name: 'workloads-list', kind: 'bare', fade: 'bottom' }))
    const frame = await frameOf(view)

    expect(frame.getAttribute('data-kind')).toBe('bare')
    expect(frame.getAttribute('data-fade')).toBe('bottom')
  })

  it('renders both plates in the Types story', async () => {
    const view = render(Types())

    await expect
      .poll(() =>
        Array.from(view.container.querySelectorAll(`[data-testid="${FRAME_TESTID}"]`)).map(
          (frame) => frame.getAttribute('data-kind')
        )
      )
      .toEqual(['window', 'bare'])
  })

  it('never leaks a prop the widget does not declare onto its root', async () => {
    const view = render(host({ name: 'workloads-list', hover: true, interval: 80, tab: 'deploy' }))
    const frame = await frameOf(view)

    expect(frame.hasAttribute('hover')).toBe(false)
    expect(frame.hasAttribute('interval')).toBe(false)
    expect(frame.hasAttribute('tab')).toBe(false)
  })

  it('swaps the widget when name changes', async () => {
    const name = ref<ProductWidgetName>('workloads-list')
    const Host = defineComponent({
      components: { ProductWidget },
      setup: () => ({ name }),
      template: '<div style="width: 860px; height: 480px"><ProductWidget :name="name" /></div>'
    })
    const view = render(Host)
    expect((await frameOf(view)).getAttribute('data-kind')).toBe('window')

    name.value = 'workload-topology-chain'
    await nextTick()

    expect(view.getByTestId(TESTID).getAttribute('data-name')).toBe('workload-topology-chain')
    await expect
      .poll(() =>
        view.container.querySelector(`[data-testid="${FRAME_TESTID}"]`)?.getAttribute('data-kind')
      )
      .toBe('bare')
  })

  it('clears the earlier widget when the next one fails to load', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const failed = new Error('chunk failed')
    const load = vi
      .spyOn(productWidgets, 'workload-topology-chain')
      .mockImplementation(() => Promise.reject(failed))
    const name = ref<ProductWidgetName>('workloads-list')
    const Host = defineComponent({
      components: { ProductWidget },
      setup: () => ({ name }),
      template: '<div style="width: 860px; height: 480px"><ProductWidget :name="name" /></div>'
    })
    const view = render(Host)
    await frameOf(view)

    name.value = 'workload-topology-chain'
    await nextTick()
    const root = view.getByTestId(TESTID)

    expect(root.getAttribute('data-name')).toBe('workload-topology-chain')
    expect(root.children).toHaveLength(0)
    await expect
      .poll(() => warn.mock.calls.some(([message]) => String(message).includes('could not load')))
      .toBe(true)
    expect(root.children).toHaveLength(0)

    load.mockRestore()
    warn.mockRestore()
  })

  it('warns and draws nothing for a name outside the registry', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const view = render(host({ name: 'not-a-widget' }))
    await nextTick()

    expect(view.getByTestId(TESTID).children).toHaveLength(0)
    expect(warn).toHaveBeenCalledWith(
      '[webkit] <ProductWidget>: no widget registered under name "not-a-widget".'
    )
    warn.mockRestore()
  })

  it('holds the deploy logs still while they are off screen', async () => {
    const Host = defineComponent({
      components: { ProductWidget },
      template: `
        <div>
          <div style="height: 300vh"></div>
          <div style="width: 600px; height: 480px">
            <ProductWidget name="workload-deploy-logs" :interval="40" />
          </div>
        </div>
      `
    })
    const view = render(Host)
    const frame = await frameOf(view)
    const drawn = frame.textContent

    await new Promise((resolve) => globalThis.setTimeout(resolve, 600))
    expect(frame.textContent).toBe(drawn)

    if (reducedMotion()) return
    frame.scrollIntoView()
    await expect.poll(() => frame.textContent).not.toBe(drawn)
  })

  it.each(NAMES)('draws %s inside a shell mockup', async (name) => {
    const view = render(host({ name }))
    const frame = await frameOf(view)

    expect(view.getByTestId(TESTID).contains(frame)).toBe(true)
    expect(frame.hasAttribute('inert')).toBe(name !== 'function-code')
  })

  it('has no axe violations', async () => {
    const view = render(Default())
    await frameOf(view)

    await expectNoA11yViolations(view.container)
  })
})
