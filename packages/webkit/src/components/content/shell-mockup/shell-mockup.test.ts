import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ShellMockup from './index'
import ShellMockupPart from './shell-mockup-part/shell-mockup-part.vue'

const TESTID = 'content-shell-mockup'
const PART_TESTID = 'content-shell-mockup-part'

const reducedMotion = () => globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

const host = (props: Record<string, unknown> = {}, overlay = false) =>
  defineComponent({
    components: { ShellMockup, ShellMockupPart },
    setup: () => ({ props, overlay }),
    template: `
      <div style="width: 860px; height: 480px">
        <ShellMockup v-bind="props" style="display: block; height: 100%">
          <ShellMockupPart :order="0"><p>First part</p></ShellMockupPart>
          <ShellMockupPart :order="1"><p>Second part</p></ShellMockupPart>
          <template v-if="overlay" #overlay><p>Drawer layer</p></template>
        </ShellMockup>
      </div>
    `
  })

const fadeLayers = (root: Element) => root.querySelectorAll(':scope > [data-fade]')

const parts = (container: Element) =>
  Array.from(container.querySelectorAll(`[data-testid="${PART_TESTID}"]`))

describe('ShellMockup (composition)', () => {
  it('attaches the part to the compound root', () => {
    expect(ShellMockup.Part).toBe(ShellMockupPart)
  })

  it('renders the root and its parts under the default testids', () => {
    const { getByTestId, container } = render(host())

    expect(getByTestId(TESTID).tagName).toBe('FIGURE')
    expect(parts(container)).toHaveLength(2)
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(host({ 'data-testid': 'workloads-mock' }))

    expect(getByTestId('workloads-mock')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('mirrors kind and fade on the root', () => {
    const { getByTestId } = render(host({ kind: 'bare', fade: 'y' }))
    const root = getByTestId(TESTID)

    expect(root.getAttribute('data-kind')).toBe('bare')
    expect(root.getAttribute('data-fade')).toBe('y')
  })

  it('renders a fade layer only when fade is set', () => {
    const faded = render(host({ fade: 'bottom' }))
    const layers = fadeLayers(faded.getByTestId(TESTID))
    expect(layers).toHaveLength(1)
    expect(layers[0]?.getAttribute('data-fade')).toBe('bottom')
    faded.unmount()

    const plain = render(host())
    expect(fadeLayers(plain.getByTestId(TESTID))).toHaveLength(0)
  })

  it('is an inert picture hidden from assistive technology by default', () => {
    const { getByTestId } = render(host())
    const root = getByTestId(TESTID)

    expect(root.hasAttribute('inert')).toBe(true)
    expect(root.getAttribute('aria-hidden')).toBe('true')
    expect(root.hasAttribute('data-interactive')).toBe(false)
  })

  it('exposes its controls when interactive', () => {
    const { getByTestId } = render(host({ interactive: true }))
    const root = getByTestId(TESTID)

    expect(root.hasAttribute('inert')).toBe(false)
    expect(root.hasAttribute('aria-hidden')).toBe(false)
    expect(root.hasAttribute('data-interactive')).toBe(true)
  })

  it('draws the slim console bar with the title when there is no rail', () => {
    const { getByTestId } = render(host({ title: 'Workloads' }))
    const root = getByTestId(TESTID)

    expect(root.querySelectorAll('header')).toHaveLength(1)
    expect(root.querySelector('header')?.textContent).toContain('Workloads')
    expect(root.querySelector('aside')).toBeNull()
  })

  it('splits the title into breadcrumbs and marks the active rail entry when a rail is set', () => {
    const { getByTestId } = render(host({ title: 'Workloads › my-workload', rail: 'workloads' }))
    const root = getByTestId(TESTID)
    const crumbs = Array.from(root.querySelectorAll('ol li'))

    expect(crumbs.map((crumb) => crumb.textContent?.trim())).toEqual(['Workloads', 'my-workload'])
    expect(crumbs[1]?.hasAttribute('data-current')).toBe(true)
    expect(crumbs[0]?.hasAttribute('data-current')).toBe(false)

    const active = root.querySelectorAll('aside [data-active]')
    expect(active).toHaveLength(1)
    expect(active[0]?.textContent).toContain('Workloads')
  })

  it('draws the previous console bar for the legacy shell', () => {
    const { getByTestId } = render(host({ shell: 'legacy' }))
    const root = getByTestId(TESTID)

    expect(root.querySelectorAll('header')).toHaveLength(1)
    expect(root.querySelector('header')?.textContent).toContain('Feedback')
    expect(root.querySelector('ol')).toBeNull()
  })

  it('draws no bar when chrome is off', () => {
    const { getByTestId } = render(host({ chrome: false, title: 'Workloads' }))

    expect(getByTestId(TESTID).querySelector('header')).toBeNull()
  })

  it('renders the overlay slot over the frame', () => {
    const { getByText } = render(host({}, true))

    expect(getByText('Drawer layer')).toBeInTheDocument()
  })

  it('lands every part once the mockup is on screen and active', async () => {
    const { container } = render(host())

    await expect
      .poll(() => parts(container).every((part) => part.hasAttribute('data-entered')))
      .toBe(true)
  })

  it('draws every part in place from the start when still', () => {
    const { container } = render(host({ still: true }))

    expect(parts(container).every((part) => part.hasAttribute('data-entered'))).toBe(true)
  })

  it.skipIf(reducedMotion())(
    'holds the entrance while inactive and replays it when activated',
    async () => {
      const active = ref(false)
      const Host = defineComponent({
        components: { ShellMockup, ShellMockupPart },
        setup: () => ({ active }),
        template: `
        <div style="width: 860px; height: 480px">
          <ShellMockup :active="active" style="display: block; height: 100%">
            <ShellMockupPart :order="0"><p>Only part</p></ShellMockupPart>
          </ShellMockup>
        </div>
      `
      })
      const { container } = render(Host)
      await new Promise((resolve) => globalThis.setTimeout(resolve, 100))

      expect(parts(container)[0]?.hasAttribute('data-entered')).toBe(false)

      active.value = true
      await expect.poll(() => parts(container)[0]?.hasAttribute('data-entered')).toBe(true)

      active.value = false
      await nextTick()
      expect(parts(container)[0]?.hasAttribute('data-entered')).toBe(false)
    }
  )

  it('throws when a part is rendered outside a ShellMockup', () => {
    expect(() => render(ShellMockupPart)).toThrow(
      'useShellMockupContext must be used within ShellMockup.'
    )
  })

  it('has no axe violations as a picture or when interactive', async () => {
    const picture = render(host({ title: 'Workloads › my-workload', rail: 'workloads' }))
    await expectNoA11yViolations(picture.container)
    picture.unmount()

    const interactive = render(host({ interactive: true, shell: 'legacy' }))
    await expectNoA11yViolations(interactive.container)
  })
})
