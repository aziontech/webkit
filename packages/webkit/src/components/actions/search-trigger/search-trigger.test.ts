import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import CollapsibleExample from '../../../../examples/search-trigger/collapsible.vue'
import DefaultExample from '../../../../examples/search-trigger/default.vue'
import DisabledExample from '../../../../examples/search-trigger/disabled.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import SearchTrigger from './search-trigger.vue'

describe('SearchTrigger', () => {
  it('renders a button with the fallback data-testid and the catalog label', () => {
    const { getByTestId, getByRole } = render(SearchTrigger)
    const root = getByTestId('actions-search-trigger')
    expect(root.tagName).toBe('BUTTON')
    expect(root).toHaveAttribute('type', 'button')
    expect(getByRole('button', { name: 'Search' })).toBe(root)
    expect(getByTestId('actions-search-trigger__label')).toHaveTextContent('Search')
  })

  it('lets a consumer override data-testid and derives the part ids from it', () => {
    const { getByTestId } = render(SearchTrigger, { attrs: { 'data-testid': 'top-search' } })
    expect(getByTestId('top-search')).toBeTruthy()
    expect(getByTestId('top-search__icon')).toHaveAttribute('aria-hidden', 'true')
    expect(getByTestId('top-search__shortcut')).toBeTruthy()
  })

  it('uses the label prop as visible text and accessible name', () => {
    const { getByRole, getByTestId } = render(SearchTrigger, { props: { label: 'Search docs' } })
    expect(getByRole('button', { name: 'Search docs' })).toBeTruthy()
    expect(getByTestId('actions-search-trigger__label')).toHaveTextContent('Search docs')
  })

  it('announces the shortcut and hides the keycap from the accessible name', () => {
    const { getByTestId } = render(SearchTrigger)
    expect(getByTestId('actions-search-trigger')).toHaveAttribute(
      'aria-keyshortcuts',
      'Meta+K Control+K'
    )
    const keycap = getByTestId('actions-search-trigger__shortcut')
    expect(keycap.tagName).toBe('KBD')
    expect(keycap).toHaveAttribute('aria-hidden', 'true')
    expect(keycap).toHaveTextContent('K')
  })

  it('maps another shortcut key and drops the keycap when shortcut is empty', () => {
    const slash = render(SearchTrigger, { props: { shortcut: 'p' } })
    expect(slash.getByTestId('actions-search-trigger')).toHaveAttribute(
      'aria-keyshortcuts',
      'Meta+P Control+P'
    )
    expect(slash.getByTestId('actions-search-trigger__shortcut')).toHaveTextContent('P')
    slash.unmount()
    const none = render(SearchTrigger, { props: { shortcut: '' } })
    expect(none.getByTestId('actions-search-trigger')).not.toHaveAttribute('aria-keyshortcuts')
    expect(none.queryByTestId('actions-search-trigger__shortcut')).toBeNull()
  })

  it('maps collapsible to data-collapsible', () => {
    const off = render(SearchTrigger)
    expect(off.getByTestId('actions-search-trigger')).toHaveAttribute('data-collapsible', 'false')
    off.unmount()
    const on = render(SearchTrigger, { props: { collapsible: true } })
    expect(on.getByTestId('actions-search-trigger')).toHaveAttribute('data-collapsible', 'true')
    expect(on.getByRole('button', { name: 'Search' })).toBeTruthy()
  })

  it('emits click with the MouseEvent on pointer, Enter and Space', async () => {
    const user = userEvent.setup()
    const { getByRole, emitted } = render(SearchTrigger)
    const button = getByRole('button', { name: 'Search' })
    await user.click(button)
    button.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    const clicks = emitted('click') as [MouseEvent][]
    expect(clicks).toHaveLength(3)
    expect(clicks[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('does not emit click and leaves the tab order when disabled', async () => {
    const user = userEvent.setup()
    const { getByTestId, emitted } = render(SearchTrigger, { props: { disabled: true } })
    const root = getByTestId('actions-search-trigger')
    expect(root).toBeDisabled()
    expect(root).toHaveAttribute('data-disabled')
    await user.click(root)
    await user.tab()
    expect(document.activeElement).not.toBe(root)
    expect(emitted('click')).toBeUndefined()
  })

  it('opens the Command palette from the Default example', async () => {
    const user = userEvent.setup()
    const { getByRole } = render(DefaultExample)
    await user.click(getByRole('button', { name: 'Search' }))
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
  })

  it('renders the Collapsible and Disabled examples', () => {
    const collapsible = render(CollapsibleExample)
    expect(collapsible.getByRole('button', { name: 'Search docs' })).toBeTruthy()
    collapsible.unmount()
    const disabled = render(DisabledExample)
    expect(disabled.getByRole('button', { name: 'Search' })).toBeDisabled()
  })

  it('reads the label from the provider locale', () => {
    const InProvider = defineComponent({
      setup: () => () =>
        h(
          WebkitProvider,
          { catalogs: LOCALES, locale: 'pt-BR' },
          { default: () => h(SearchTrigger) }
        )
    })
    const { getByRole } = render(InProvider)
    expect(getByRole('button', { name: 'Buscar' })).toBeTruthy()
  })

  it('renders under dir="rtl" with the same name and shortcut', () => {
    const InRtl = defineComponent({
      setup: () => () => h('div', { dir: 'rtl' }, [h(SearchTrigger)])
    })
    const { getByRole } = render(InRtl)
    expect(getByRole('button', { name: 'Search' })).toHaveAttribute(
      'aria-keyshortcuts',
      'Meta+K Control+K'
    )
  })

  it('has no axe violations in the default, collapsible and disabled renders', async () => {
    const a = render(SearchTrigger)
    await expectNoA11yViolations(a.container)
    a.unmount()
    const b = render(SearchTrigger, { props: { collapsible: true } })
    await expectNoA11yViolations(b.container)
    b.unmount()
    const c = render(SearchTrigger, { props: { disabled: true } })
    await expectNoA11yViolations(c.container)
  })
})
