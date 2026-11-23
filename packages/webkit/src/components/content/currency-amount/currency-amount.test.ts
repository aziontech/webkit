import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/currency-amount/default.vue'
import Sizes from '../../../../examples/currency-amount/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import CurrencyAmount from './currency-amount.vue'

describe('CurrencyAmount', () => {
  it('renders the default testid on the root', () => {
    const { getByTestId } = render(CurrencyAmount)
    // No consumer data-testid -> the component's fallback.
    expect(getByTestId('currency-amount')).toBeTruthy()
  })

  it('renders the value inside the value span', () => {
    const { getByTestId } = render(CurrencyAmount, { props: { value: '20' } })
    expect(getByTestId('currency-amount__value').textContent?.trim()).toBe('20')
  })

  it('renders the default prefix ($) and shows it in the prefix span', () => {
    // prefix defaults to '$' and prefix span is v-if="prefix".
    const { getByTestId } = render(CurrencyAmount, { props: { value: '20' } })
    expect(getByTestId('currency-amount__prefix').textContent?.trim()).toBe('$')
  })

  it('renders a custom prefix', () => {
    const { getByTestId } = render(CurrencyAmount, { props: { value: '99', prefix: 'R$' } })
    expect(getByTestId('currency-amount__prefix').textContent?.trim()).toBe('R$')
  })

  it('omits the prefix span when prefix is empty (v-if="prefix")', () => {
    const { queryByTestId, getByTestId } = render(CurrencyAmount, {
      props: { value: '20', prefix: '' }
    })
    expect(queryByTestId('currency-amount__prefix')).toBeNull()
    // value still renders regardless of prefix.
    expect(getByTestId('currency-amount__value').textContent?.trim()).toBe('20')
  })

  it('renders the suffix span only when suffix is provided (v-if="suffix")', () => {
    const { queryByTestId } = render(CurrencyAmount, { props: { value: '20' } })
    // suffix defaults to '' -> suffix span absent.
    expect(queryByTestId('currency-amount__suffix')).toBeNull()

    const withSuffix = render(CurrencyAmount, { props: { value: '20', suffix: 'per month' } })
    expect(withSuffix.getByTestId('currency-amount__suffix').textContent?.trim()).toBe('per month')
  })

  it('honors a consumer-provided data-testid on the root and derives the part ids from it', () => {
    // testId = attrs['data-testid'] ?? 'currency-amount'; parts use `${testId}__*`.
    const { getByTestId } = render(CurrencyAmount, {
      props: { value: '20', suffix: 'per month' },
      attrs: { 'data-testid': 'plan-price' }
    })
    expect(getByTestId('plan-price')).toBeTruthy()
    expect(getByTestId('plan-price__prefix').textContent?.trim()).toBe('$')
    expect(getByTestId('plan-price__value').textContent?.trim()).toBe('20')
    expect(getByTestId('plan-price__suffix').textContent?.trim()).toBe('per month')
  })

  it.each(['small', 'medium', 'large'] as const)(
    'renders the same value/prefix/suffix content for size "%s"',
    (size) => {
      const { getByTestId } = render(CurrencyAmount, {
        props: { value: '20', suffix: 'per month', size }
      })
      // Size is a purely visual token; the content contract holds for every size.
      expect(getByTestId('currency-amount__prefix').textContent?.trim()).toBe('$')
      expect(getByTestId('currency-amount__value').textContent?.trim()).toBe('20')
      expect(getByTestId('currency-amount__suffix').textContent?.trim()).toBe('per month')
    }
  )

  it('defaults to the medium size', () => {
    const { container } = render(CurrencyAmount, { props: { value: '20', prefix: '$' } })
    expect(container.querySelector('[data-size]')).toHaveAttribute('data-size', 'medium')
  })

  it('has no a11y violations in the default render', async () => {
    const { container } = render(CurrencyAmount, {
      props: { value: '20', prefix: '$', suffix: 'per month', size: 'small' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations at size medium', async () => {
    const { container } = render(CurrencyAmount, {
      props: { value: '20', prefix: '$', suffix: 'per month', size: 'medium' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations at size large', async () => {
    const { container } = render(CurrencyAmount, {
      props: { value: '20', prefix: '$', suffix: 'per month', size: 'large' }
    })
    await expectNoA11yViolations(container)
  })

  it('composes the Default story', () => {
    const { getByTestId } = render(Default)
    // Default args: value '20', prefix '$', suffix 'per month'.
    expect(getByTestId('currency-amount__value').textContent?.trim()).toBe('20')
    expect(getByTestId('currency-amount__prefix').textContent?.trim()).toBe('$')
    expect(getByTestId('currency-amount__suffix').textContent?.trim()).toBe('per month')
  })

  it('composes the Sizes story rendering every step of the ladder', () => {
    const { getAllByTestId } = render(Sizes)
    // Three <CurrencyAmount> instances (small + medium + large) -> three value spans.
    const values = getAllByTestId('currency-amount__value')
    expect(values).toHaveLength(3)
    values.forEach((v) => expect(v.textContent?.trim()).toBe('20'))
  })

  it('keeps the symbol and figure in left-to-right order inside a right-to-left page', () => {
    const { getByTestId } = render({
      components: { CurrencyAmount },
      template: '<div dir="rtl"><CurrencyAmount value="20" prefix="$" suffix="/ month" /></div>'
    })
    const amount = getByTestId('currency-amount__amount')

    expect(amount.getAttribute('dir')).toBe('ltr')
    expect(amount).toContainElement(getByTestId('currency-amount__prefix'))
    expect(amount).toContainElement(getByTestId('currency-amount__value'))
    expect(amount).not.toContainElement(getByTestId('currency-amount__suffix'))
  })

  it('mirrors the size prop onto the root as data-size, for every step', () => {
    // The three text parts read the variant off the root through a named group, so
    // data-size on the root is the whole switch — if it stops being written, every
    // size renders identically.
    for (const size of ['small', 'medium', 'large'] as const) {
      const { getByTestId, unmount } = render(CurrencyAmount, { props: { value: '20', size } })
      expect(getByTestId('currency-amount').getAttribute('data-size')).toBe(size)
      unmount()
    }
  })
})
