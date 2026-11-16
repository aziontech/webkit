import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h } from 'vue'

import Default from '../../../../examples/console-showcase-section/default.vue'
import Diagram from '../../../../examples/console-showcase-section/diagram.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../provider/webkit-provider/webkit-provider.vue'
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

  it('translates the built-in name', () => {
    const { getByRole } = render({
      render: () =>
        h(
          WebkitProvider,
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

  it('renders under rtl', () => {
    const { getByRole } = render({ render: () => h('div', { dir: 'rtl' }, [h(Diagram)]) })
    expect(getByRole('link', { name: /See the network/ })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
