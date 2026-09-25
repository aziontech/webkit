import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import PricingPlans from './pricing-plans.vue'

const TESTID = 'marketing-pricing-plans'
const OPTION_TESTID = 'actions-segmented-button__option'

const PERIODS = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annual', value: 'annual' }
]

const plans = () => [
  h('div', { 'data-testid': 'plan-developer' }, 'Developer'),
  h('div', { 'data-testid': 'plan-business' }, 'Business'),
  h('div', { 'data-testid': 'plan-enterprise' }, 'Enterprise')
]

const renderBand = (props: Record<string, unknown> = {}, attrs: Record<string, string> = {}) =>
  render(PricingPlans, { props, attrs, slots: { default: plans } })

const planOrder = (container: Element) =>
  [...container.querySelectorAll('[data-testid^="plan-"]')].map((el) => el.textContent?.trim())

describe('PricingPlans', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = renderBand({ periods: PERIODS })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = renderBand(
      { periods: PERIODS },
      { 'data-testid': 'plans' }
    )

    expect(getByTestId('plans')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each([
    ['gap', 'gap'],
    ['divider', 'divider'],
    ['the default register', undefined]
  ])('carries the register on data-kind for %s', (_label, kind) => {
    const { getByTestId } = renderBand(kind ? { kind, periods: PERIODS } : { periods: PERIODS })

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe(kind ?? 'gap')
  })

  it('renders the composed cards in DOM order', () => {
    const { container } = renderBand({ periods: PERIODS })

    expect(planOrder(container)).toEqual(['Developer', 'Business', 'Enterprise'])
  })

  it('renders the switch and marks the band switchable with two or more periods', () => {
    const { getByTestId, getByRole, getAllByTestId } = renderBand({ periods: PERIODS })

    expect(getByTestId(TESTID).getAttribute('data-switchable')).toBe('true')
    expect(getByRole('radiogroup')).toBeInTheDocument()
    expect(getAllByTestId(OPTION_TESTID).map((el) => el.textContent?.trim())).toEqual([
      'Monthly',
      'Annual'
    ])
  })

  it.each([
    ['no periods', []],
    ['a single period', [PERIODS[0]]]
  ])('renders no switch and no data-switchable with %s', (_label, periods) => {
    const { getByTestId, queryByRole, container } = renderBand({ periods })

    expect(getByTestId(TESTID).hasAttribute('data-switchable')).toBe(false)
    expect(queryByRole('radiogroup')).toBeNull()
    expect(planOrder(container)).toEqual(['Developer', 'Business', 'Enterprise'])
  })

  it('names the switch with the default ariaLabel', () => {
    const { getByRole } = renderBand({ periods: PERIODS })

    expect(getByRole('radiogroup', { name: 'Billing period' })).toBeInTheDocument()
  })

  it('names the switch with a consumer ariaLabel', () => {
    const { getByRole } = renderBand({ periods: PERIODS, ariaLabel: 'How often you are billed' })

    expect(getByRole('radiogroup', { name: 'How often you are billed' })).toBeInTheDocument()
  })

  it('emits update:modelValue with the selected period value', async () => {
    const { getAllByTestId, emitted } = renderBand({ periods: PERIODS })

    const [, annual] = getAllByTestId(OPTION_TESTID)
    await userEvent.click(annual)

    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['annual'])
  })

  it('reflects a controlled model value on the switch', () => {
    const { getAllByTestId } = renderBand({ periods: PERIODS, modelValue: 'annual' })

    const [monthly, annual] = getAllByTestId(OPTION_TESTID)
    expect(annual.getAttribute('aria-checked')).toBe('true')
    expect(monthly.getAttribute('aria-checked')).toBe('false')
  })

  it('round-trips v-model: the page sees the period the band reports', async () => {
    const Host = defineComponent({
      components: { PricingPlans },
      setup() {
        return { period: ref('monthly'), periods: PERIODS }
      },
      template: `
        <div>
          <span data-testid="selected">{{ period }}</span>
          <PricingPlans v-model="period" :periods="periods">
            <div data-testid="plan-developer">Developer</div>
          </PricingPlans>
        </div>
      `
    })

    const { getByTestId, getAllByTestId } = render(Host)

    expect(getByTestId('selected').textContent).toBe('monthly')

    const [, annual] = getAllByTestId(OPTION_TESTID)
    await userEvent.click(annual)

    expect(getByTestId('selected').textContent).toBe('annual')
    expect(annual.getAttribute('aria-checked')).toBe('true')
  })

  it('has no accessibility violations in the divider register', async () => {
    const { container } = renderBand({ kind: 'divider', periods: PERIODS })

    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations with the switch', async () => {
    const { container } = renderBand({ periods: PERIODS })

    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations without the switch', async () => {
    const { container } = renderBand({ periods: [] })

    await expectNoA11yViolations(container)
  })
})
