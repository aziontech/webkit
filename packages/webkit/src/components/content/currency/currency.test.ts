import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/currency/Currency.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Currency from './currency.vue'

const { Default, Sizes, Animated } = composeStories(stories)

const nextFrames = () =>
  new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

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
    expect(withSuffix.getByTestId('content-currency__suffix').textContent?.trim()).toBe('per month')
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

  it.each(['small', 'medium', 'large'] as const)(
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

  it('has no a11y violations at size medium', async () => {
    const { container } = render(Currency, {
      props: { value: '20', prefix: '$', suffix: 'per month', size: 'medium' }
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

  it('composes the Sizes story rendering every step of the ladder', () => {
    const { getAllByTestId } = render(Sizes())
    // Three <Currency> instances (small + medium + large) -> three value spans.
    const values = getAllByTestId('content-currency__value')
    expect(values).toHaveLength(3)
    values.forEach((v) => expect(v.textContent?.trim()).toBe('20'))
  })

  it('keeps the plain figure on a value change when animated is off', async () => {
    const { getByTestId, queryByTestId, rerender } = render(Currency, { props: { value: '25' } })
    await rerender({ value: '20' })
    expect(queryByTestId('content-currency__roll')).toBeNull()
    expect(getByTestId('content-currency__value').textContent?.trim()).toBe('20')
  })

  it('does not roll on mount when animated', () => {
    const { getByTestId, queryByTestId } = render(Currency, {
      props: { value: '25', animated: true }
    })
    expect(queryByTestId('content-currency__roll')).toBeNull()
    expect(getByTestId('content-currency__value').textContent?.trim()).toBe('25')
  })

  it('rolls only the changed characters through the digits between old and new', async () => {
    const { getByTestId, rerender } = render(Currency, { props: { value: '25', animated: true } })
    await rerender({ value: '20', animated: true })
    const roll = getByTestId('content-currency__roll')
    expect(roll.getAttribute('aria-hidden')).toBe('true')
    const strips = [...roll.children].map((column) =>
      [...column.firstElementChild!.children].map((glyph) => glyph.textContent?.trim()).join('')
    )
    expect(strips).toEqual(['2', '012345'])
  })

  it('keeps the new value readable to assistive tech while the strips are hidden', async () => {
    const { getByTestId, rerender } = render(Currency, { props: { value: '25', animated: true } })
    await rerender({ value: '20', animated: true })
    const value = getByTestId('content-currency__value')
    expect(value.querySelector('.sr-only')?.textContent?.trim()).toBe('20')
  })

  it('flips every column to its landed position after the roll starts', async () => {
    const { getByTestId, rerender } = render(Currency, { props: { value: '25', animated: true } })
    await rerender({ value: '30', animated: true })
    const roll = getByTestId('content-currency__roll')
    expect(roll.querySelectorAll('[data-rolling]')).toHaveLength(0)
    await nextFrames()
    await nextFrames()
    expect(roll.querySelectorAll('[data-rolling]')).toHaveLength(2)
  })

  it('flips a non-digit change straight from the old glyph to the new one', async () => {
    const { getByTestId, rerender } = render(Currency, {
      props: { value: 'Free', prefix: '', animated: true }
    })
    await rerender({ value: '25', prefix: '', animated: true })
    const strips = [...getByTestId('content-currency__roll').children].map((column) =>
      [...column.firstElementChild!.children].map((glyph) => glyph.textContent).join('|')
    )
    expect(strips).toEqual(['e|2', 'e|5'])
  })

  it('has no a11y violations while rolled', async () => {
    const { container, rerender } = render(Currency, {
      props: { value: '25', suffix: 'per month', animated: true }
    })
    await rerender({ value: '20', suffix: 'per month', animated: true })
    await expectNoA11yViolations(container)
  })

  it('composes the Animated story and rolls when the period toggles', async () => {
    const { getByRole, getByTestId } = render(Animated())
    expect(getByTestId('content-currency__value').textContent?.trim()).toBe('25')
    await userEvent.click(getByRole('radio', { name: 'Annual' }))
    expect(getByTestId('content-currency__roll')).toBeTruthy()
    expect(
      getByTestId('content-currency__value').querySelector('.sr-only')?.textContent?.trim()
    ).toBe('20')
  })

  it('mirrors the size prop onto the root as data-size, for every step', () => {
    // The three text parts read the variant off the root through a named group, so
    // data-size on the root is the whole switch — if it stops being written, every
    // size renders identically.
    for (const size of ['small', 'medium', 'large'] as const) {
      const { getByTestId, unmount } = render(Currency, { props: { value: '20', size } })
      expect(getByTestId('content-currency').getAttribute('data-size')).toBe(size)
      unmount()
    }
  })
})
