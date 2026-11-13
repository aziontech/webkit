import { fireEvent, render, within } from '@testing-library/vue'
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
  document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())
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

  it('renders the hint and the tag next to a label', () => {
    const { getByRole, getByText } = band()

    expect(getByRole('button', { name: 'Conditional rules.' })).toBeInTheDocument()
    expect(getByText('Preview')).toBeInTheDocument()
  })

  it('folds every column but the highlighted plan, and switches on a pick', async () => {
    const { container, getByTestId } = band()

    expect(planHeads(container).map((head) => head.hasAttribute('data-folded'))).toEqual([
      true,
      false,
      true
    ])

    await fireEvent.click(getByTestId('select-trigger'))
    const option = Array.from(document.body.querySelectorAll('[data-testid="select-option"]')).find(
      (node) => node.textContent?.trim() === 'Enterprise'
    ) as HTMLElement
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
