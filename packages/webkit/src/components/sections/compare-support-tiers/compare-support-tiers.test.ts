import { fireEvent, render, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import CompareSupportTiers from './compare-support-tiers.vue'

const TESTID = 'sections-compare-support-tiers'

const tiers = [
  {
    id: 'developer',
    name: 'Developer',
    description: 'Ideal for exploring the platform.',
    action: { label: 'Start for free', href: '/signup' }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Ideal for advanced support.',
    highlighted: true,
    action: { label: 'Talk to sales', href: '/contact' }
  },
  {
    id: 'mission-critical',
    name: 'Mission-Critical',
    description: 'Ideal for mission-critical operations.',
    action: { label: 'Talk to a specialist', href: '/contact?tier=mc' }
  }
]

const sections = [
  {
    eyebrow: 'Support',
    title: 'Get help when it matters most',
    action: { label: 'See support pricing', href: '/docs/pricing#support' },
    rows: [
      { label: 'Technical Support', group: true, values: ['', '', ''] },
      { label: 'Phone and video support', values: ['—', true, '✓'] },
      { label: 'Production system down', values: ['—', '< 1 hour', '< 30 minutes'] }
    ]
  },
  {
    eyebrow: 'Professional Services',
    title: 'Move faster with specialist guidance',
    rows: [{ label: 'Integration Services', group: true, values: ['—', '20 hours', '60 hours'] }]
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(CompareSupportTiers, {
    props: {
      anchor: 'tiers',
      caption: 'Support comparison across the tiers.',
      columnLabel: 'Support',
      pickerAriaLabel: 'Tier being compared',
      includedLabel: 'Included',
      excludedLabel: 'Not included',
      tiers,
      sections,
      ...props
    }
  })

const tierHeads = (container: Element) =>
  Array.from(container.querySelectorAll('thead th[scope="col"]')).slice(1) as HTMLElement[]

afterEach(() => {
  document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())
})

describe('CompareSupportTiers', () => {
  it('renders the band under the default testid with its anchor', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).id).toBe('tiers')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(CompareSupportTiers, {
      props: { tiers, sections },
      attrs: { 'data-testid': 'support-tiers' }
    })

    expect(getByTestId('support-tiers')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the table by its caption', () => {
    const { getByRole } = band()

    expect(getByRole('table', { name: 'Support comparison across the tiers.' })).toBeInTheDocument()
  })

  it('renders one column per tier with its description and action', () => {
    const { container } = band()

    const heads = tierHeads(container)
    expect(heads).toHaveLength(tiers.length)
    heads.forEach((head, index) => {
      expect(within(head).getByText(tiers[index].name)).toBeInTheDocument()
      expect(within(head).getByText(tiers[index].description)).toBeInTheDocument()
      expect(within(head).getByRole('link', { name: tiers[index].action.label })).toHaveAttribute(
        'href',
        tiers[index].action.href
      )
    })
    expect(heads.map((head) => head.hasAttribute('data-highlighted'))).toEqual([false, true, false])
  })

  it('drops a tier without a name', () => {
    const { container } = band({
      tiers: [...tiers, { id: 'x', name: '', action: tiers[0].action }]
    })

    expect(tierHeads(container)).toHaveLength(tiers.length)
  })

  it('renders one row head per service, in order', () => {
    const { getAllByRole } = band()

    expect(getAllByRole('rowheader').map((cell) => cell.textContent?.trim())).toEqual([
      'Technical Support',
      'Phone and video support',
      'Production system down',
      'Integration Services'
    ])
  })

  it('ticks true and ✓, dashes —, and shows any other text as written', () => {
    const { getAllByRole } = band()

    const rows = getAllByRole('row').filter((row) => within(row).queryByRole('rowheader'))
    const phone = within(rows[1]).getAllByRole('cell')
    expect(within(phone[0]).getByText('Not included')).toBeInTheDocument()
    expect(within(phone[1]).getByText('Included')).toBeInTheDocument()
    expect(within(phone[2]).getByText('Included')).toBeInTheDocument()
    expect(
      within(rows[2])
        .getAllByRole('cell')
        .map((cell) => cell.textContent?.trim())
    ).toEqual(['—Not included', '< 1 hour', '< 30 minutes'])
  })

  it('closes a band on its action link in a new tab, and renders none without one', () => {
    const { getAllByRole } = band()

    const links = getAllByRole('link', { name: 'See support pricing' })
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/docs/pricing#support')
    expect(links[0]).toHaveAttribute('target', '_blank')
  })

  it('folds every column but the highlighted tier, and switches on a pick', async () => {
    const { container, getByTestId } = band()

    expect(tierHeads(container).map((head) => head.hasAttribute('data-folded'))).toEqual([
      true,
      false,
      true
    ])

    await fireEvent.click(getByTestId('select-trigger'))
    const option = Array.from(document.body.querySelectorAll('[data-testid="select-option"]')).find(
      (node) => node.textContent?.trim() === 'Developer'
    ) as HTMLElement
    await fireEvent.click(option)

    expect(tierHeads(container).map((head) => head.hasAttribute('data-folded'))).toEqual([
      false,
      true,
      true
    ])
  })

  it('opens on the first tier when none is highlighted', () => {
    const { container } = band({ tiers: tiers.map((tier) => ({ ...tier, highlighted: false })) })

    expect(tierHeads(container).map((head) => head.hasAttribute('data-folded'))).toEqual([
      false,
      true,
      true
    ])
  })

  it('names the tier picker', () => {
    const { getByRole } = band()

    expect(getByRole('combobox', { name: 'Tier being compared' })).toBeInTheDocument()
  })

  it('renders only the section when tiers is empty', () => {
    const { getByTestId, queryByRole } = band({ tiers: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('table')).toBeNull()
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
