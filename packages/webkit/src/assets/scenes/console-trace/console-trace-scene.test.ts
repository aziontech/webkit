import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ConsoleTraceScene from './console-trace-scene.vue'

const TESTID = 'assets-console-trace-scene'

const host = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: { ConsoleTraceScene },
    setup: () => ({ props }),
    template: `
      <div style="width: 760px; height: 520px">
        <ConsoleTraceScene v-bind="props" />
      </div>
    `
  })

describe('ConsoleTraceScene', () => {
  it('renders an inert picture under the default testid', () => {
    const { getByTestId } = render(host())
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('FIGURE')
    expect(root.hasAttribute('inert')).toBe(true)
    expect(root.getAttribute('aria-hidden')).toBe('true')
    expect(root).toHaveTextContent('image-optimizer')
    expect(root).toHaveTextContent('Completed in 412 ms')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(host({ 'data-testid': 'trace-mock' }))

    expect(getByTestId('trace-mock')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('draws the span waterfall by default and for an unknown tab', () => {
    const empty = render(host())
    expect(empty.getByTestId(TESTID).getAttribute('data-tab')).toBe('trace')
    expect(empty.getByTestId('code-trace')).toHaveTextContent('fetch-origin')
    empty.unmount()

    const unknown = render(host({ tab: 'nope' }))
    expect(unknown.getByTestId(TESTID).getAttribute('data-tab')).toBe('trace')
  })

  it('draws the run logs on the logs tab', () => {
    const { getByTestId, queryByTestId } = render(host({ tab: 'logs', animated: false }))

    expect(getByTestId('code-log-view')).toHaveTextContent('Invocation completed · 200')
    expect(queryByTestId('code-trace')).toBeNull()
  })

  it('draws the request path as a flow of four hops on the path tab', () => {
    const { getByTestId } = render(host({ tab: 'path', animated: false }))
    const flow = getByTestId('data-flow')

    expect(flow.querySelectorAll('[data-flow-kind="node"]')).toHaveLength(4)
    for (const hop of ['storefront-prod', 'storefront', 'image-optimizer', 'origin-assets']) {
      expect(flow).toHaveTextContent(hop)
    }
  })

  it('marks the drawn document as the selected tab', () => {
    const { getAllByRole } = render(host({ tab: 'path', animated: false }))
    const selected = getAllByRole('tab', { hidden: true }).filter(
      (tab) => tab.getAttribute('aria-selected') === 'true'
    )

    expect(selected).toHaveLength(1)
    expect(selected[0]).toHaveTextContent('Request path')
  })

  it('has no accessibility violations on each document', async () => {
    for (const tab of ['trace', 'logs', 'path']) {
      const view = render(host({ tab, animated: false }))
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
