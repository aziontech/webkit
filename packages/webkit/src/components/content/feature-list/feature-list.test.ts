import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Columns from '../../../../examples/feature-list/columns.vue'
import Default from '../../../../examples/feature-list/default.vue'
import WithDescriptions from '../../../../examples/feature-list/with-descriptions.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import FeatureList from './feature-list.vue'

const items = [
  { label: 'Unlimited Applications' },
  { label: 'Custom Domains', description: 'Serve every application from your own domain.' }
]

describe('FeatureList', () => {
  it('renders a named list with one item per feature and the derived testid', () => {
    const view = render(FeatureList, { props: { items, ariaLabel: 'Pro plan features' } })

    const list = view.getByRole('list', { name: 'Pro plan features' })
    expect(view.getByTestId('content-feature-list').contains(list)).toBe(true)
    expect(view.getAllByRole('listitem')).toHaveLength(2)
    expect(view.getAllByTestId('content-feature-list__item')).toHaveLength(2)
  })

  it('lets a consumer data-testid win and derives the item testid from it', () => {
    const view = render(FeatureList, { props: { items }, attrs: { 'data-testid': 'plan-perks' } })

    expect(view.getByTestId('plan-perks')).toBeTruthy()
    expect(view.getAllByTestId('plan-perks__item')).toHaveLength(2)
    expect(view.queryByTestId('content-feature-list')).toBeNull()
  })

  it('renders the label and, only when given, the description', () => {
    const view = render(FeatureList, { props: { items } })
    const [first, second] = view.getAllByRole('listitem')

    expect(first?.textContent?.trim()).toBe('Unlimited Applications')
    expect(second?.textContent).toContain('Custom Domains')
    expect(second?.textContent).toContain('Serve every application from your own domain.')
  })

  it('hides the check glyph from assistive technology', () => {
    const view = render(FeatureList, { props: { items } })

    for (const glyph of view.container.querySelectorAll('.pi-check')) {
      expect(glyph.getAttribute('aria-hidden')).toBe('true')
    }
  })

  it('keeps user text direction with dir auto', () => {
    const view = render(FeatureList, { props: { items: [{ label: 'تطبيقات غير محدودة' }] } })

    expect(view.getByText('تطبيقات غير محدودة').getAttribute('dir')).toBe('auto')
  })

  it('mirrors columns on the list and defaults to one', () => {
    const one = render(FeatureList, { props: { items } })
    expect(one.getByRole('list').getAttribute('data-columns')).toBe('1')
    one.unmount()

    const two = render(Columns)
    expect(two.getByRole('list').getAttribute('data-columns')).toBe('2')
    expect(two.getAllByRole('listitem')).toHaveLength(8)
  })

  it('omits aria-label when none is set', () => {
    const view = render(FeatureList, { props: { items } })

    expect(view.getByRole('list').hasAttribute('aria-label')).toBe(false)
  })

  it('renders nothing when there are no items', () => {
    const view = render(FeatureList, { props: { items: [] } })

    expect(view.queryByTestId('content-feature-list')).toBeNull()
    expect(view.queryByRole('list')).toBeNull()
  })

  it('renders under dir rtl with the same items', () => {
    const host = document.createElement('div')
    host.setAttribute('dir', 'rtl')
    document.body.appendChild(host)
    const view = render(FeatureList, { props: { items }, container: host })

    expect(view.getAllByRole('listitem')).toHaveLength(2)
    host.remove()
  })

  it.each([
    ['Default', Default],
    ['Columns', Columns],
    ['WithDescriptions', WithDescriptions]
  ])('has no a11y violations in the %s example', async (_name, example) => {
    const view = render(example)

    await expectNoA11yViolations(view.container)
  })
})
