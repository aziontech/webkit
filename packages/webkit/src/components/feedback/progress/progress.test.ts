import '../../../test/reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { commands } from 'vitest/browser'
import type { Component } from 'vue'

import Default from '../../../../examples/progress/default.vue'
import Indeterminate from '../../../../examples/progress/indeterminate.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Progress from './progress.vue'

describe('Progress', () => {
  it('renders the progressbar role with the default testid', () => {
    const { getByTestId, getByRole } = render(Progress)

    const bar = getByTestId('progress')
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

  it.each(['rounded', 'flat'] as const)('reflects variant=%s on data-variant', (variant) => {
    const { getByRole } = render(Progress, { props: { variant: variant } })
    expect(getByRole('progressbar').getAttribute('data-variant')).toBe(variant)
  })

  it('defaults to the flat variant and drops the retired data-shape', () => {
    const { getByRole } = render(Progress)
    expect(getByRole('progressbar').getAttribute('data-variant')).toBe('flat')
    expect(getByRole('progressbar').hasAttribute('data-shape')).toBe(false)
  })

  it('defaults to the medium bar', () => {
    const { getByRole } = render(Progress)
    expect(getByRole('progressbar').getAttribute('data-size')).toBe('medium')
  })

  it.each(['neutral', 'info', 'success', 'warning', 'danger'] as const)(
    'reflects severity=%s on the bar and its fill',
    (severity) => {
      const { getByRole } = render(Progress, { props: { value: 40, severity } })
      const bar = getByRole('progressbar')
      expect(bar.getAttribute('data-severity')).toBe(severity)
      expect(bar.firstElementChild?.getAttribute('data-severity')).toBe(severity)
    }
  )

  it('keeps the brand fill with no data-severity when severity is unset', () => {
    const { getByRole } = render(Progress, { props: { value: 40 } })
    expect(getByRole('progressbar').hasAttribute('data-severity')).toBe(false)
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

  describe('indeterminate under reduced motion', () => {
    afterEach(async () => {
      await commands.emulateMedia({ reducedMotion: null })
    })

    const segment = (getByRole: (role: string) => HTMLElement) => {
      const track = getByRole('progressbar')
      const fill = track.firstElementChild as HTMLElement
      const trackBox = track.getBoundingClientRect()
      const before = getComputedStyle(fill, '::before')
      return { trackBox, before, after: getComputedStyle(fill, '::after') }
    }

    it('holds a still segment about a third of the track, never a full bar', async () => {
      await commands.emulateMedia({ reducedMotion: 'reduce' })
      const { getByRole } = render(Progress, {
        props: { indeterminate: true },
        attrs: { style: 'width: 300px' }
      })
      const { trackBox, before, after } = segment(getByRole)

      expect(before.animationName).toBe('none')
      expect(after.display).toBe('none')
      const width = parseFloat(before.width)
      expect(width).toBeGreaterThan(trackBox.width * 0.25)
      expect(width).toBeLessThan(trackBox.width * 0.5)
      expect(parseFloat(before.left)).toBeGreaterThan(0)
    })

    it('sweeps when motion is allowed', async () => {
      await commands.emulateMedia({ reducedMotion: 'no-preference' })
      const { getByRole } = render(Progress, {
        props: { indeterminate: true },
        attrs: { style: 'width: 300px' }
      })
      const { before } = segment(getByRole)

      expect(before.animationName).not.toBe('none')
    })
  })

  describe('Progress examples', () => {
    const examples = import.meta.glob<{ default: Component }>(
      '../../../../examples/progress/*.vue',
      {
        eager: true
      }
    )

    it.each(Object.entries(examples))('%s names the task each bar tracks', (_, mod) => {
      const { container } = render(mod.default)
      const bars = Array.from(container.querySelectorAll('[role="progressbar"]'))
      expect(bars.length).toBeGreaterThan(0)
      for (const bar of bars) expect(bar.getAttribute('aria-label')).not.toBe('Progress')
    })
  })
})
