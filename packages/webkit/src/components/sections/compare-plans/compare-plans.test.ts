import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ComparePlans from './compare-plans.vue'

const TESTID = 'sections-compare-plans'

const plans = [
  { id: 'hobby', name: 'Hobby', action: { label: 'Start for free', href: '/signup?plan=hobby' } },
  {
    id: 'pro',
    name: 'Pro',
    highlighted: true,
    action: { label: 'Start with Pro', href: '/signup?plan=pro' }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    action: { label: 'Talk to a specialist', href: '/contact' }
  }
]

const sections = [
  {
    eyebrow: 'Build',
    title: 'Applications',
    description: 'Build, run and scale applications globally.',
    rows: [
      { label: 'Applications', group: true, values: ['', '', ''] },
      { label: 'Rules Engine', hint: 'Conditional rules.', values: ['✓', true, '✓'] },
      { label: 'Rules per application', values: ['10 included', '20 included', 'Custom'] },
      { label: 'AI Inference', tag: 'Preview', values: ['—', '—', 'Custom'] }
    ]
  },
  {
    eyebrow: 'Azion Platform',
    title: 'Compliance',
    rows: [{ label: 'SOC 2 Type 2', group: true, values: ['—', '—', true] }]
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ComparePlans, {
    props: {
      anchor: 'comparison',
      caption: 'Feature comparison across the plans.',
      columnLabel: 'Features',
      pickerAriaLabel: 'Plan being compared',
      includedLabel: 'Included',
      excludedLabel: 'Not included',
      plans,
      sections,
      primaryAction: { label: 'See on-demand pricing', href: '/docs/pricing' },
      ...props
    }
  })

const planHeads = (container: Element) =>
  Array.from(container.querySelectorAll('thead th[scope="col"]')).slice(1) as HTMLElement[]

afterEach(() => {
  document.body
    .querySelectorAll('[data-testid="input-select-content"]')
    .forEach((el) => el.remove())
})

describe('ComparePlans', () => {
  it('renders the band under the default testid with its anchor', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).id).toBe('comparison')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ComparePlans, {
      props: { plans, sections },
      attrs: { 'data-testid': 'pricing-compare-plans' }
    })

    expect(getByTestId('pricing-compare-plans')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the table by its caption', () => {
    const { getByRole } = band()

    expect(getByRole('table', { name: 'Feature comparison across the plans.' })).toBeInTheDocument()
  })

  it('renders one column per plan with its action, the highlighted one secondary', () => {
    const { container } = band()

    const heads = planHeads(container)
    expect(heads).toHaveLength(plans.length)
    heads.forEach((head, index) => {
      expect(within(head).getByText(plans[index].name)).toBeInTheDocument()
      expect(within(head).getByRole('link', { name: plans[index].action.label })).toHaveAttribute(
        'href',
        plans[index].action.href
      )
    })
    expect(heads.map((head) => head.hasAttribute('data-highlighted'))).toEqual([false, true, false])
  })

  it('drops a plan without a name', () => {
    const { container } = band({
      plans: [...plans, { id: 'x', name: '', action: plans[0].action }]
    })

    expect(planHeads(container)).toHaveLength(plans.length)
  })

  it('renders one band head per section and one row head per feature', () => {
    const { getAllByRole } = band()

    expect(
      getAllByRole('rowheader').map((cell) => cell.textContent?.replace(/\s+/g, ' ').trim())
    ).toEqual([
      'Applications',
      'Rules Engine',
      'Rules per application',
      'AI InferencePreview',
      'SOC 2 Type 2'
    ])
  })

  it('ticks true and ✓, dashes —, and shows any other text as written', () => {
    const { getAllByRole } = band()

    const rows = getAllByRole('row').filter((row) => within(row).queryByRole('rowheader'))
    const rules = within(rows[1]).getAllByRole('cell')
    rules.forEach((cell) => expect(within(cell).getByText('Included')).toBeInTheDocument())
    const allowance = within(rows[2]).getAllByRole('cell')
    expect(allowance.map((cell) => cell.textContent?.trim())).toEqual([
      '10 included',
      '20 included',
      'Custom'
    ])
    const inference = within(rows[3]).getAllByRole('cell')
    expect(within(inference[0]).getByText('Not included')).toBeInTheDocument()
  })

  it('renders the hint button and the tag next to a label', () => {
    const { getByRole, getByText } = band()

    expect(getByRole('button', { name: 'About Rules Engine' })).toBeInTheDocument()
    expect(getByText('Preview')).toBeInTheDocument()
  })

  it('opens the hint in a popover titled by the label', async () => {
    const { getByRole } = band()

    await fireEvent.click(getByRole('button', { name: 'About Rules Engine' }))

    const dialog = await waitFor(() => {
      const panel = document.body.querySelector<HTMLElement>('[role="dialog"]')
      expect(panel).not.toBeNull()
      return panel as HTMLElement
    })
    expect(within(dialog).getByText('Rules Engine')).toBeInTheDocument()
    expect(within(dialog).getByText('Conditional rules.')).toBeInTheDocument()
  })

  it('draws included and not-included marks with tooltips of their labels', () => {
    const { getAllByRole } = band()

    const rows = getAllByRole('row').filter((row) => within(row).queryByRole('rowheader'))
    const included = within(rows[1]).getAllByRole('cell')[0]!
    expect(included.querySelector('.ai-check-circle')).not.toBeNull()
    expect(within(included).getByTestId('overlay-tooltip')).toBeInTheDocument()
    const excluded = within(rows[3]).getAllByRole('cell')[0]!
    expect(excluded.querySelector('.ai-circle-minus')).not.toBeNull()
  })

  it('falls back to the locale labels when the cell labels are empty', () => {
    const { getAllByRole } = band({ includedLabel: '', excludedLabel: '' })

    const rows = getAllByRole('row').filter((row) => within(row).queryByRole('rowheader'))
    expect(
      within(within(rows[1]).getAllByRole('cell')[0]!).getByText('Included')
    ).toBeInTheDocument()
    expect(
      within(within(rows[3]).getAllByRole('cell')[0]!).getByText('Not included')
    ).toBeInTheDocument()
  })

  it('narrows the picker by its search field and reports no match', async () => {
    const { getByTestId } = band()

    await fireEvent.click(getByTestId('input-select-trigger'))
    const search = await waitFor(() => {
      const field = document.body.querySelector<HTMLInputElement>(
        'input[aria-label="Search plan being compared"]'
      )
      expect(field).not.toBeNull()
      return field as HTMLInputElement
    })
    const optionNames = () =>
      Array.from(document.body.querySelectorAll('[data-testid="input-select-option"]')).map(
        (node) => node.textContent?.trim()
      )

    await fireEvent.update(search, 'ent')
    expect(optionNames()).toEqual(['Enterprise'])

    await fireEvent.update(search, 'zzz')
    expect(optionNames()).toEqual([])
    expect(document.body.querySelector('[role="status"]')?.textContent?.trim()).toBe(
      'No results found.'
    )
  })

  it('closes a band with its action, and ignores the removed link key', () => {
    const closed = (key: 'action' | 'link') =>
      band({
        primaryAction: undefined,
        sections: [{ ...sections[0], [key]: { label: 'See rates', href: '/pricing/rates' } }]
      })
    const withAction = closed('action')
    expect(withAction.getByRole('link', { name: 'See rates' })).toHaveAttribute(
      'href',
      '/pricing/rates'
    )
    expect(withAction.container.querySelectorAll('[data-closing]')).toHaveLength(0)
    withAction.unmount()
    const withLink = closed('link')
    expect(withLink.queryByRole('link', { name: 'See rates' })).toBeNull()
    withLink.unmount()
  })

  it('draws the closing rule on the last row only when no closing link follows it', () => {
    const lastRow = (container: Element) =>
      Array.from(container.querySelectorAll('tbody tr')).at(-1) as HTMLElement

    const { container, unmount } = band({ primaryAction: undefined })
    expect(lastRow(container)).toHaveAttribute('data-closing', 'true')
    expect(container.querySelectorAll('[data-closing]')).toHaveLength(1)
    unmount()

    const withLink = band()
    expect(withLink.container.querySelectorAll('[data-closing]')).toHaveLength(0)
  })

  it('folds every column but the highlighted plan, and switches on a pick', async () => {
    const { container, getByTestId } = band()

    expect(planHeads(container).map((head) => head.hasAttribute('data-folded'))).toEqual([
      true,
      false,
      true
    ])

    await fireEvent.click(getByTestId('input-select-trigger'))
    const option = Array.from(
      document.body.querySelectorAll('[data-testid="input-select-option"]')
    ).find((node) => node.textContent?.trim() === 'Enterprise') as HTMLElement
    await fireEvent.click(option)

    expect(planHeads(container).map((head) => head.hasAttribute('data-folded'))).toEqual([
      true,
      true,
      false
    ])
  })

  it('names the plan picker', () => {
    const { getByRole } = band()

    expect(getByRole('combobox', { name: 'Plan being compared' })).toBeInTheDocument()
  })

  it('renders the closing link in a new tab, and nothing when it is absent', () => {
    const { getByRole, unmount } = band()

    const link = getByRole('link', { name: 'See on-demand pricing' })
    expect(link).toHaveAttribute('href', '/docs/pricing')
    expect(link).toHaveAttribute('target', '_blank')
    unmount()

    const { queryByRole } = band({ primaryAction: undefined })
    expect(queryByRole('link', { name: 'See on-demand pricing' })).toBeNull()
  })

  it('renders only the section when plans is empty', () => {
    const { getByTestId, queryByRole } = band({ plans: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('table')).toBeNull()
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})

describe('ComparePlans — plan description and band links', () => {
  it('shows each plan description and closes a band with its link', async () => {
    const { default: BandLinks } = await import('../../../../examples/compare-plans/band-links.vue')
    const { getByText, getByRole } = render(BandLinks)
    expect(getByText('For teams in production.')).toBeInTheDocument()
    expect(getByRole('link', { name: /See compute rates/ })).toHaveAttribute(
      'href',
      '/pricing/compute'
    )
    expect(getByRole('link', { name: /See storage rates/ })).toHaveAttribute('target', '_blank')
  })

  it('has no axe violations with band links', async () => {
    const { default: BandLinks } = await import('../../../../examples/compare-plans/band-links.vue')
    const { container } = render(BandLinks)
    await expectNoA11yViolations(container)
  })
})

describe('ComparePlans — support tiers', () => {
  it('lays the support tiers out as plan columns, opening the picker on the highlighted tier', async () => {
    const { default: SupportTiers } =
      await import('../../../../examples/compare-plans/support-tiers.vue')
    const { container, getByText } = render(SupportTiers)
    const heads = Array.from(container.querySelectorAll('thead th[scope="col"]')).slice(1)
    expect(
      heads.map(
        (th) => th.textContent?.match(/Developer|Business|Enterprise|Mission-Critical/)?.[0]
      )
    ).toEqual(['Developer', 'Business', 'Enterprise', 'Mission-Critical'])
    expect(heads.filter((th) => !th.hasAttribute('data-folded'))).toHaveLength(1)
    expect(heads[2]).not.toHaveAttribute('data-folded')
    expect(getByText('Ideal for teams that need support from specialists.')).toBeInTheDocument()
  })

  it('has no axe violations with support tiers', async () => {
    const { default: SupportTiers } =
      await import('../../../../examples/compare-plans/support-tiers.vue')
    const { container } = render(SupportTiers)
    await expectNoA11yViolations(container)
  })
})
