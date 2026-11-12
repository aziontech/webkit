import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/progress/default.vue'
import Indeterminate from '../../../../examples/progress/indeterminate.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Progress from './progress.vue'

describe('Progress', () => {
  it('renders the progressbar role with the default testid', () => {
    const { getByTestId, getByRole } = render(Progress)

    const bar = getByTestId('feedback-progress')
    expect(bar).toBe(getByRole('progressbar'))
  })

  it('honors a consumer-provided data-testid', () => {
    const { getByTestId } = render(Progress, {
      attrs: { 'data-testid': 'custom-progress' }
    })

    expect(getByTestId('custom-progress').getAttribute('role')).toBe('progressbar')
  })

  it('exposes the determinate aria value range from value and max', () => {
    const { getByRole } = render(Progress, {
      props: { value: 40, max: 200 }
    })

    const bar = getByRole('progressbar')
    expect(bar.getAttribute('aria-valuemin')).toBe('0')
    expect(bar.getAttribute('aria-valuemax')).toBe('200')
    expect(bar.getAttribute('aria-valuenow')).toBe('40')
    // Determinate is not busy.
    expect(bar.getAttribute('aria-busy')).toBeNull()
    expect(bar.getAttribute('data-indeterminate')).toBeNull()
  })

  it('defaults to value 0 / max 100', () => {
    const { getByRole } = render(Progress)

    const bar = getByRole('progressbar')
    expect(bar.getAttribute('aria-valuenow')).toBe('0')
    expect(bar.getAttribute('aria-valuemax')).toBe('100')
    expect(bar.getAttribute('aria-valuemin')).toBe('0')
  })

  it('drops the aria value range and marks busy when indeterminate', () => {
    const { getByRole } = render(Progress, {
      props: { indeterminate: true, value: 50 }
    })

    const bar = getByRole('progressbar')
    expect(bar.getAttribute('aria-valuemin')).toBeNull()
    expect(bar.getAttribute('aria-valuemax')).toBeNull()
    expect(bar.getAttribute('aria-valuenow')).toBeNull()
    expect(bar.getAttribute('aria-busy')).toBe('true')
    expect(bar.getAttribute('data-indeterminate')).toBe('true')
  })

  it('clamps the fill width to 100% when value exceeds max', () => {
    const { getByRole } = render(Progress, {
      props: { value: 150, max: 100 }
    })

    const fill = getByRole('progressbar').firstElementChild as HTMLElement
    expect(fill.style.width).toBe('100%')
  })

  it('clamps the fill width to 0% when value is negative', () => {
    const { getByRole } = render(Progress, {
      props: { value: -20, max: 100 }
    })

    const fill = getByRole('progressbar').firstElementChild as HTMLElement
    expect(fill.style.width).toBe('0%')
  })

  it('sets the fill width from the value / max percentage', () => {
    const { getByRole } = render(Progress, {
      props: { value: 30, max: 120 }
    })

    const fill = getByRole('progressbar').firstElementChild as HTMLElement
    expect(fill.style.width).toBe('25%')
  })

  it('does not set an inline fill width when indeterminate', () => {
    const { getByRole } = render(Progress, {
      props: { indeterminate: true }
    })

    const fill = getByRole('progressbar').firstElementChild as HTMLElement
    expect(fill.style.width).toBe('')
    expect(fill.getAttribute('data-indeterminate')).toBe('true')
  })

  it.each(['rounded', 'flat'] as const)('reflects shape=%s on data-shape', (shape) => {
    const { getByRole } = render(Progress, { props: { shape } })
    expect(getByRole('progressbar').getAttribute('data-shape')).toBe(shape)
  })

  it.each(['small', 'medium', 'large'] as const)('reflects size=%s on data-size', (size) => {
    const { getByRole } = render(Progress, { props: { size } })
    expect(getByRole('progressbar').getAttribute('data-size')).toBe(size)
  })

  // role="progressbar" requires an accessible name; the consumer supplies it
  // (contextual to the task), and it must flow through v-bind="$attrs" onto the root.
  it('has no a11y violations for a labeled determinate bar', async () => {
    const { container, getByRole } = render(Progress, {
      props: { value: 60, max: 100 },
      attrs: { 'aria-label': 'Upload progress' }
    })
    expect(getByRole('progressbar').getAttribute('aria-label')).toBe('Upload progress')
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations for a labeled indeterminate bar', async () => {
    const { container, getByRole } = render(Progress, {
      props: { indeterminate: true },
      attrs: { 'aria-label': 'Loading' }
    })
    expect(getByRole('progressbar').getAttribute('aria-label')).toBe('Loading')
    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story', () => {
    const { getByRole } = render(Default)
    const bar = getByRole('progressbar')
    expect(bar.getAttribute('aria-valuenow')).toBe('60')
  })

  it('renders the composed Indeterminate story as busy', () => {
    const { getByRole } = render(Indeterminate)
    const bar = getByRole('progressbar')
    expect(bar.getAttribute('aria-busy')).toBe('true')
    expect(bar.getAttribute('data-indeterminate')).toBe('true')
  })
})
