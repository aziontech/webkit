import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { defineComponent, h } from 'vue'

import Default from '../../../../examples/console-showcase-section/default.vue'
import Diagram from '../../../../examples/console-showcase-section/diagram.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../layout/config-provider/config-provider.vue'
import ConsoleShowcaseSection from './console-showcase-section.vue'

const tabs = [
  { value: 'a', title: 'Alpha' },
  { value: 'b', title: 'Beta' }
]

const Probe = defineComponent({
  props: { tab: { type: String, default: undefined } },
  setup: (props) => () => h('p', { 'data-testid': 'probe' }, props.tab ?? 'none')
})

const panel = (props: Record<string, unknown> = {}) =>
  render(ConsoleShowcaseSection, {
    props: { title: 'Console', tabs, ...props },
    slots: { scene: ({ tab }: { tab?: string }) => h(Probe, { tab }) }
  })

describe('ConsoleShowcaseSection', () => {
  afterEach(async () => {
    await page.viewport(414, 896)
  })

  it('sets the anchor as the band id and names the band by its title', () => {
    const { getByTestId, getByRole } = panel({ anchor: 'console' })
    expect(getByTestId('console-showcase-section')).toHaveAttribute('id', 'console')
    expect(getByRole('region', { name: 'Console' })).toBe(getByTestId('console-showcase-section'))
  })

  it('links the primary and secondary actions, secondary then outlined', () => {
    const { getByRole } = panel({
      primaryAction: { label: 'Start now', href: '/signup' },
      secondaryAction: { label: 'Talk to sales', href: '/contact' }
    })
    const first = getByRole('link', { name: 'Start now' })
    const second = getByRole('link', { name: 'Talk to sales' })
    expect(first).toHaveAttribute('href', '/signup')
    expect(second).toHaveAttribute('href', '/contact')
    expect(first).toHaveAttribute('data-variant', 'secondary')
    expect(second).toHaveAttribute('data-variant', 'outline')
  })

  it('drops an action with no link', () => {
    const { queryAllByRole } = panel({ primaryAction: { label: 'Start now', href: '' } })
    expect(queryAllByRole('link')).toHaveLength(0)
  })

  it('draws no button from the removed actions array', () => {
    const { queryByRole } = panel({ actions: [{ label: 'Docs', href: '/docs' }] })
    expect(queryByRole('link', { name: 'Docs' })).toBeNull()
  })

  it('hands the first tab to the scene slot', () => {
    const { getByTestId } = panel()
    expect(getByTestId('probe')).toHaveTextContent('a')
  })

  it('switches the scene beat when another tab is chosen, by keyboard', async () => {
    const { getByRole, getByTestId } = panel()
    const beta = getByRole('radio', { name: 'Beta' })
    await userEvent.click(beta)
    expect(getByTestId('probe')).toHaveTextContent('b')
  })

  it('passes no tab without tabs', () => {
    const { getByTestId } = panel({ tabs: [] })
    expect(getByTestId('probe')).toHaveTextContent('none')
  })

  it('names the tab control with the built-in string or the override', () => {
    const { getByRole, unmount } = panel()
    expect(getByRole('radiogroup', { name: 'Console views' })).toBeInTheDocument()
    unmount()
    const custom = panel({ tabsAriaLabel: 'Views of the console' })
    expect(custom.getByRole('radiogroup', { name: 'Views of the console' })).toBeInTheDocument()
  })

  it('sizes the view switcher at medium on a 320px screen and large above, in even columns on a phone', async () => {
    await page.viewport(320, 640)
    await vi.waitFor(() => expect(window.matchMedia('(max-width: 22.49rem)').matches).toBe(true))
    const narrow = panel()
    const cramped = narrow.getByRole('radiogroup')
    await vi.waitFor(() => expect(cramped.getAttribute('data-size')).toBe('medium'))
    expect(cramped.getAttribute('data-columns')).toBe('2')
    narrow.unmount()

    await page.viewport(390, 844)
    await vi.waitFor(() => expect(window.matchMedia('(max-width: 22.49rem)').matches).toBe(false))
    const phone = panel().getByRole('radiogroup')
    await vi.waitFor(() => expect(phone.getAttribute('data-size')).toBe('large'))
    expect(phone.getAttribute('data-columns')).toBe('2')
  })

  it('splits four views into two even columns, so no view is left alone on a row', () => {
    const four = [
      { value: 'a', title: 'Build' },
      { value: 'b', title: 'Devices' },
      { value: 'c', title: 'Rules' },
      { value: 'd', title: 'Settings' }
    ]
    expect(panel({ tabs: four }).getByRole('radiogroup').getAttribute('data-columns')).toBe('2')
  })

  it('translates the built-in name', () => {
    const { getByRole } = render({
      render: () =>
        h(
          ConfigProvider,
          { locale: 'pt-BR', catalogs: LOCALES },
          {
            default: () =>
              h(ConsoleShowcaseSection, { title: 'Console', tabs }, { scene: () => h('div') })
          }
        )
    })
    expect(getByRole('radiogroup', { name: 'Visões do console' })).toBeInTheDocument()
  })

  it('mirrors variant and sets the crop custom properties', () => {
    const { getByTestId } = panel({ crop: 0.2 })
    const root = getByTestId('console-showcase-section')
    expect(root).toHaveAttribute('data-variant', 'console')
    const frame = root.querySelector('[style*="--console-showcase-section-crop"]') as HTMLElement
    expect(frame.style.getPropertyValue('--console-showcase-section-crop')).toBe('10.53%')
  })

  it('grounds the console panel on the texture and paints none under a diagram scene', () => {
    const consolePanel = panel()
    expect(consolePanel.container.querySelector('[data-slot="texture"]')).not.toBeNull()
    consolePanel.unmount()

    const diagram = panel({ variant: 'diagram', texture: 'pixelate' })
    expect(diagram.getByTestId('console-showcase-section')).toHaveAttribute(
      'data-variant',
      'diagram'
    )
    expect(diagram.container.querySelector('[data-slot="texture"]')).toBeNull()
  })

  it('renders under rtl', () => {
    const { getByRole } = render({ render: () => h('div', { dir: 'rtl' }, [h(Diagram)]) })
    expect(getByRole('link', { name: /See the network/ })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
