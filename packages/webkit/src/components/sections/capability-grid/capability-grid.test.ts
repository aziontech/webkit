import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/capability-grid/default.vue'
import LeftTitle from '../../../../examples/capability-grid/left-title.vue'
import Points from '../../../../examples/capability-grid/points.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import CapabilityGrid from './capability-grid.vue'

const items = [
  { title: 'Functions', description: 'Run code.' },
  { title: 'Storage', description: 'Keep files.' }
]

describe('CapabilityGrid', () => {
  it('renders nothing without items', () => {
    const { queryByTestId } = render(CapabilityGrid, { props: { title: 'T' } })
    expect(queryByTestId('sections-capability-grid')).toBeNull()
  })

  it('names the band by its title and nests capability headings under it', () => {
    const { getByRole, getAllByRole } = render(Default)
    expect(
      getByRole('region', { name: 'Everything an application needs, in one place' })
    ).toBeInTheDocument()
    expect(getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })

  it('centers the title by default and sets it at the start edge with titleKind left', () => {
    const { getByTestId, unmount } = render(Default)
    expect(getByTestId('marketing-section-title')).toHaveAttribute('data-kind', 'centered')
    unmount()

    const left = render(LeftTitle)
    expect(left.getByTestId('marketing-section-title')).toHaveAttribute('data-kind', 'left')
    expect(left.getByRole('heading', { level: 2 }).textContent?.trim()).toBe(
      'Why you should be a partner'
    )
    expect(left.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })

  it('raises capability headings to h2 in a bare grid', () => {
    const { getAllByRole } = render(CapabilityGrid, { props: { items } })
    expect(getAllByRole('heading', { level: 2 }).map((el) => el.textContent?.trim())).toEqual([
      'Functions',
      'Storage'
    ])
  })

  it('renders points as a list and the action as a link', () => {
    const { getAllByRole, unmount } = render(Points)
    expect(getAllByRole('list').length).toBeGreaterThanOrEqual(4)
    unmount()
    const withAction = render(Default)
    expect(withAction.getByRole('link', { name: /Explore the platform/ })).toHaveAttribute(
      'href',
      '/platform'
    )
  })

  it('sets the anchor and lets a consumer testid win', () => {
    const { getByTestId } = render(CapabilityGrid, {
      props: { items, anchor: 'caps' },
      attrs: { 'data-testid': 'caps-band' }
    })
    expect(getByTestId('caps-band')).toHaveAttribute('id', 'caps')
  })

  it('renders under rtl with logical list padding', () => {
    const { container } = render({ render: () => h('div', { dir: 'rtl' }, [h(Points)]) })
    expect(container.querySelector('ul.list-disc')?.className).toContain('ps-')
  })

  it('has no axe violations', async () => {
    const { container } = render(Points)
    await expectNoA11yViolations(container)
  })
})
