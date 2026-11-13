import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import PricingPlans from './pricing-plans.vue'

const TESTID = 'sections-pricing-plans'

const periods = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' }
]

const plans = [
  {
    name: 'Hobby',
    prices: [{ value: 'Free', details: 'Free forever.' }],
    featuresTitle: 'All features included.',
    features: [{ icon: 'pi pi-globe', label: 'Global infrastructure' }],
    action: { label: 'Start for free', href: '/signup?plan=hobby' }
  },
  {
    name: 'Pro',
    highlighted: true,
    tagLabel: 'Popular',
    prices: [
      { period: 'monthly', value: '25', prefix: '$', suffix: '/mo', details: 'Billed monthly.' },
      { period: 'annual', value: '20', prefix: '$', suffix: '/mo', details: 'Billed annually.' }
    ],
    featuresTitle: 'All Hobby features, plus:',
    features: [
      { icon: 'ai ai-workloads', label: 'Additional workloads' },
      { icon: 'pi pi-wallet', label: 'Configurable spend limit' }
    ],
    action: { label: 'Start with Pro', href: '/signup?plan=pro' }
  },
  {
    name: 'Enterprise',
    prices: [{ value: 'Custom', details: 'Custom terms.' }],
    features: [{ icon: 'pi pi-calendar', label: 'Savings Plan available' }],
    action: { label: 'Talk to a specialist', href: '' }
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(PricingPlans, {
    props: {
      anchor: 'plans',
      periods,
      periodsAriaLabel: 'Billing period',
      plans,
      ...props
    }
  })

describe('PricingPlans', () => {
  it('renders the band under the default testid with its anchor', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).id).toBe('plans')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(PricingPlans, {
      props: { plans },
      attrs: { 'data-testid': 'home-pricing-plans' }
    })

    expect(getByTestId('home-pricing-plans')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders one card per named plan, in order, with its name as h3', () => {
    const { getAllByRole } = band({ plans: [...plans, { name: '', prices: [] }] })

    expect(
      getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.trim())
    ).toEqual(['Hobby', 'Pro', 'Enterprise'])
  })

  it('lists each plan feature and its title', () => {
    const { getAllByRole, getByText } = band()

    const lists = getAllByRole('list')
    expect(lists).toHaveLength(plans.length)
    expect(
      within(lists[1])
        .getAllByRole('listitem')
        .map((item) => item.textContent?.trim())
    ).toEqual(['Additional workloads', 'Configurable spend limit'])
    expect(getByText('All Hobby features, plus:')).toBeInTheDocument()
  })

  it('raises and tags only the highlighted plan', () => {
    const { getAllByTestId, getAllByText } = band()

    const cards = getAllByTestId('content-card-pricing')
    expect(cards.map((card) => card.hasAttribute('data-highlighted'))).toEqual([false, true, false])
    expect(getAllByText('Popular')).toHaveLength(1)
    expect(within(cards[1]).getByText('Popular')).toBeInTheDocument()
  })

  it('renders each action as a link and drops an action without an href', () => {
    const { getByRole, queryByRole } = band()

    expect(getByRole('link', { name: 'Start for free' })).toHaveAttribute(
      'href',
      '/signup?plan=hobby'
    )
    expect(getByRole('link', { name: 'Start with Pro' })).toHaveAttribute(
      'href',
      '/signup?plan=pro'
    )
    expect(queryByRole('link', { name: 'Talk to a specialist' })).toBeNull()
  })

  it('opens on the first period and switches every price on a pick', async () => {
    const { getAllByTestId, getByRole } = band()

    const pro = () => getAllByTestId('content-card-pricing')[1]
    expect(getByRole('radio', { name: 'Monthly' })).toHaveAttribute('aria-checked', 'true')
    expect(within(pro()).getByText('Billed monthly.')).toBeInTheDocument()

    await fireEvent.click(getByRole('radio', { name: 'Annual' }))

    expect(within(pro()).getByText('Billed annually.')).toBeInTheDocument()
    expect(
      within(getAllByTestId('content-card-pricing')[0]).getByText('Free forever.')
    ).toBeInTheDocument()
  })

  it('names the toggle', () => {
    const { getByRole } = band()

    expect(getByRole('radiogroup', { name: 'Billing period' })).toBeInTheDocument()
  })

  it('hides the toggle with fewer than two periods', () => {
    const { queryByRole } = band({ periods: [periods[0]] })

    expect(queryByRole('radiogroup')).toBeNull()
  })

  it('renders only the section when plans is empty', () => {
    const { getByTestId, queryByRole } = band({ plans: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryByRole('radiogroup')).toBeNull()
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
