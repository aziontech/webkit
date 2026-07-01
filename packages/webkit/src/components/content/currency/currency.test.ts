import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import * as stories from '../../../../../../apps/storybook/src/stories/components/content/currency/Currency.stories'
import Currency from './currency.vue'

const { Default, Sizes } = composeStories(stories)

describe('Currency', () => {
  it('renders the default testid on the root', () => {
    const { getByTestId } = render(Currency)
    // No consumer data-testid -> the component's fallback.
    expect(getByTestId('content-currency')).toBeTruthy()
  })

  it('renders the value inside the value span', () => {
    const { getByTestId } = render(Currency, { props: { value: '20' } })
    expect(getByTestId('content-currency__value').textContent?.trim()).toBe('20')
  })

  it('renders the default prefix ($) and shows it in the prefix span', () => {
    // prefix defaults to '$' and prefix span is v-if="prefix".
    const { getByTestId } = render(Currency, { props: { value: '20' } })
    expect(getByTestId('content-currency__prefix').textContent?.trim()).toBe('$')
  })

  it('renders a custom prefix', () => {
    const { getByTestId } = render(Currency, { props: { value: '99', prefix: 'R$' } })
    expect(getByTestId('content-currency__prefix').textContent?.trim()).toBe('R$')
  })

  it('omits the prefix span when prefix is empty (v-if="prefix")', () => {
    const { queryByTestId, getByTestId } = render(Currency, {
      props: { value: '20', prefix: '' }
    })
    expect(queryByTestId('content-currency__prefix')).toBeNull()
    // value still renders regardless of prefix.
    expect(getByTestId('content-currency__value').textContent?.trim()).toBe('20')
  })

  it('renders the suffix span only when suffix is provided (v-if="suffix")', () => {
    const { queryByTestId } = render(Currency, { props: { value: '20' } })
    // suffix defaults to '' -> suffix span absent.
    expect(queryByTestId('content-currency__suffix')).toBeNull()

    const withSuffix = render(Currency, { props: { value: '20', suffix: 'per month' } })
    expect(
      withSuffix.getByTestId('content-currency__suffix').textContent?.trim()
    ).toBe('per month')
  })

  it('honors a consumer-provided data-testid on the root and derives the part ids from it', () => {
    // testId = attrs['data-testid'] ?? 'content-currency'; parts use `${testId}__*`.
    const { getByTestId } = render(Currency, {
      props: { value: '20', suffix: 'per month' },
      attrs: { 'data-testid': 'plan-price' }
    })
    expect(getByTestId('plan-price')).toBeTruthy()
    expect(getByTestId('plan-price__prefix').textContent?.trim()).toBe('$')
    expect(getByTestId('plan-price__value').textContent?.trim()).toBe('20')
    expect(getByTestId('plan-price__suffix').textContent?.trim()).toBe('per month')
  })

  it.each(['small', 'large'] as const)(
    'renders the same value/prefix/suffix content for size "%s"',
    (size) => {
      const { getByTestId } = render(Currency, {
        props: { value: '20', suffix: 'per month', size }
      })
      // Size is a purely visual token; the content contract holds for every size.
      expect(getByTestId('content-currency__prefix').textContent?.trim()).toBe('$')
      expect(getByTestId('content-currency__value').textContent?.trim()).toBe('20')
      expect(getByTestId('content-currency__suffix').textContent?.trim()).toBe('per month')
    }
  )

  it('has no a11y violations in the default render', async () => {
    const { container } = render(Currency, {
      props: { value: '20', prefix: '$', suffix: 'per month', size: 'small' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations at size large', async () => {
    const { container } = render(Currency, {
      props: { value: '20', prefix: '$', suffix: 'per month', size: 'large' }
    })
    await expectNoA11yViolations(container)
  })

  it('composes the Default story', () => {
    const { getByTestId } = render(Default())
    // Default args: value '20', prefix '$', suffix 'per month'.
    expect(getByTestId('content-currency__value').textContent?.trim()).toBe('20')
    expect(getByTestId('content-currency__prefix').textContent?.trim()).toBe('$')
    expect(getByTestId('content-currency__suffix').textContent?.trim()).toBe('per month')
  })

  it('composes the Sizes story rendering both size variants', () => {
    const { getAllByTestId } = render(Sizes())
    // Two <Currency> instances (small + large) -> two value spans, same content.
    const values = getAllByTestId('content-currency__value')
    expect(values).toHaveLength(2)
    values.forEach((v) => expect(v.textContent?.trim()).toBe('20'))
  })
})
