import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/feedback/skeleton/Skeleton.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Skeleton from './skeleton.vue'

const { Default, Types, Static } = composeStories(stories)

describe('Skeleton', () => {
  it('renders with the default data-testid and presentational a11y semantics', () => {
    const { getByTestId } = render(Skeleton)
    const el = getByTestId('feedback-skeleton')

    expect(el.getAttribute('role')).toBe('presentation')
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })

  it('honors a consumer-provided data-testid over the fallback', () => {
    const { getByTestId } = render(Skeleton, {
      attrs: { 'data-testid': 'my-placeholder' }
    })

    expect(getByTestId('my-placeholder')).toBeTruthy()
  })

  it('defaults to the shape geometry', () => {
    const { getByTestId } = render(Skeleton)

    expect(getByTestId('feedback-skeleton').getAttribute('data-kind')).toBe('shape')
  })

  it('reflects kind="circle" on data-kind', () => {
    const { getByTestId } = render(Skeleton, { props: { kind: 'circle' } })

    expect(getByTestId('feedback-skeleton').getAttribute('data-kind')).toBe('circle')
  })

  it('exposes data-animated when animated is true (the default)', () => {
    const { getByTestId } = render(Skeleton)

    expect(getByTestId('feedback-skeleton').hasAttribute('data-animated')).toBe(true)
    expect(getByTestId('feedback-skeleton').getAttribute('data-animated')).toBe('true')
  })

  it('omits data-animated when animated is false', () => {
    const { getByTestId } = render(Skeleton, { props: { animated: false } })

    expect(getByTestId('feedback-skeleton').hasAttribute('data-animated')).toBe(false)
  })

  it('applies width and height as inline styles', () => {
    const { getByTestId } = render(Skeleton, {
      props: { width: '240px', height: '100px' }
    })
    const el = getByTestId('feedback-skeleton') as HTMLElement

    expect(el.style.width).toBe('240px')
    expect(el.style.height).toBe('100px')
  })

  it('defaults width to 100% and height to 1rem', () => {
    const { getByTestId } = render(Skeleton)
    const el = getByTestId('feedback-skeleton') as HTMLElement

    expect(el.style.width).toBe('100%')
    expect(el.style.height).toBe('1rem')
  })

  it.each(['shape', 'circle'] as const)('renders the %s geometry', (kind) => {
    const { getByTestId } = render(Skeleton, { props: { kind } })

    expect(getByTestId('feedback-skeleton').getAttribute('data-kind')).toBe(kind)
  })

  it('has no a11y violations for the default shape', async () => {
    const { container } = render(Skeleton, {
      props: { width: '240px', height: '100px' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations for the circle geometry', async () => {
    const { container } = render(Skeleton, {
      props: { kind: 'circle', width: '100px', height: '100px' }
    })

    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story', () => {
    const { getByTestId } = render(Default())
    const el = getByTestId('feedback-skeleton')

    expect(el.getAttribute('data-kind')).toBe('shape')
    expect(el.hasAttribute('data-animated')).toBe(true)
  })

  it('renders the composed Types story with both geometries', () => {
    const { getAllByTestId } = render(Types())
    const kinds = getAllByTestId('feedback-skeleton').map((el) => el.getAttribute('data-kind'))

    expect(kinds).toContain('shape')
    expect(kinds).toContain('circle')
  })

  it('renders the composed Static story without the animated attribute', () => {
    const { getByTestId } = render(Static())

    expect(getByTestId('feedback-skeleton').hasAttribute('data-animated')).toBe(false)
  })
})
