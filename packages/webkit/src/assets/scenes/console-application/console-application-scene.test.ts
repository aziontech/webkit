import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ConsoleApplicationScene from './console-application-scene.vue'

const TESTID = 'assets-console-application-scene'

const reducedMotion = () => globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

const host = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: { ConsoleApplicationScene },
    setup: () => ({ props }),
    template: `
      <div style="width: 1040px; height: 560px">
        <ConsoleApplicationScene v-bind="props" />
      </div>
    `
  })

const drawer = (container: Element) => container.querySelector(`[data-testid="${TESTID}__drawer"]`)
const saveBar = (container: Element) =>
  container.querySelector(`[data-testid="${TESTID}__save-bar"]`)

describe('ConsoleApplicationScene', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders an inert picture under the default testid', () => {
    const { getByTestId } = render(host())
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('FIGURE')
    expect(root.hasAttribute('inert')).toBe(true)
    expect(root.getAttribute('aria-hidden')).toBe('true')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(host({ 'data-testid': 'application-mock' }))

    expect(getByTestId('application-mock')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('shows the Build tab when the tab is empty or unknown', () => {
    const empty = render(host())
    expect(empty.getByTestId(TESTID).getAttribute('data-tab')).toBe('build')
    empty.unmount()

    const unknown = render(host({ tab: 'nope' }))
    expect(unknown.getByTestId(TESTID).getAttribute('data-tab')).toBe('build')
  })

  it('marks the drawn tab as the selected one in the tab bar', () => {
    const { getAllByRole } = render(host({ tab: 'cache-settings', animated: false }))
    const selected = getAllByRole('tab', { hidden: true }).filter(
      (tab) => tab.getAttribute('aria-selected') === 'true'
    )

    expect(selected).toHaveLength(1)
    expect(selected[0]).toHaveTextContent('Cache Settings')
  })

  it('draws a list tab as a table with its rows and opens its create drawer when settled', () => {
    const { getByTestId, container } = render(host({ tab: 'device-groups', animated: false }))
    const table = getByTestId(`${TESTID}__table`)

    expect(table).toHaveTextContent('mobiledevices')
    expect(table).toHaveTextContent('consoles')
    expect(drawer(container)).toHaveTextContent('Add Device Group')
    expect(drawer(container)).toHaveTextContent('Regular expression')
    expect(saveBar(container)).toBeNull()
  })

  it('draws a form tab as settings bands and raises its save bar when settled', () => {
    const { getByTestId, container } = render(host({ tab: 'main-settings', animated: false }))
    const page = getByTestId(`${TESTID}__page`)

    expect(page).toHaveTextContent('Subscription modules')
    expect(saveBar(container)).toHaveTextContent('Application settings changed.')
    expect(drawer(container)).toBeNull()
  })

  it('renders every field of the Rules Engine drawer', () => {
    const { container } = render(host({ tab: 'rules-engine', animated: false }))
    const panel = drawer(container)

    for (const label of ['Name', 'Description', 'Variable', 'Operator', 'Argument', 'Active']) {
      expect(panel).toHaveTextContent(label)
    }
    expect(panel).toHaveTextContent('Response Phase')
  })

  it('plays the second move after the page settles', async () => {
    vi.useFakeTimers()
    const { container } = render(host({ tab: 'device-groups' }))
    await nextTick()

    if (reducedMotion()) {
      expect(drawer(container)).not.toBeNull()
      return
    }
    expect(drawer(container)).toBeNull()
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(drawer(container)).not.toBeNull()
  })

  it('holds the second move while the scene is not active', async () => {
    vi.useFakeTimers()
    const { container } = render(host({ tab: 'device-groups', active: false }))
    await nextTick()
    vi.advanceTimersByTime(2000)
    await nextTick()

    if (reducedMotion()) expect(drawer(container)).not.toBeNull()
    else expect(drawer(container)).toBeNull()
  })

  it('has no accessibility violations on a list tab and on a form tab', async () => {
    const list = render(host({ tab: 'rules-engine', animated: false }))
    await expectNoA11yViolations(list.container)
    list.unmount()

    const form = render(host({ tab: 'build', animated: false }))
    await expectNoA11yViolations(form.container)
  })
})
