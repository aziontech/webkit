import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/section-gap/SectionGap.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import SectionGap from './section-gap.vue'

const { Default, Sizes } = composeStories(stories)

const TESTID = 'layout-section-gap'
const FRAME_TESTID = 'layout-frame-box'

describe('SectionGap', () => {
  it('renders the gap frame under its own testid, not the frame-box fallback', () => {
    const { getByTestId, queryByTestId } = render(SectionGap)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByTestId(FRAME_TESTID)).toBeNull()
  })

  it('renders as a flush frame that keeps only its two dividing rules', () => {
    const { getByTestId } = render(SectionGap)
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('data-flush', 'true')
    expect(root).toHaveAttribute('data-borders', 'y')
    expect(root).toHaveAttribute('data-marks', 'true')
  })

  it('defaults to the medium size', () => {
    const { getByTestId } = render(SectionGap)

    expect(getByTestId(TESTID)).toHaveAttribute('data-size', 'medium')
  })

  it.each(['small', 'medium', 'large'] as const)('reflects size="%s" on data-size', (size) => {
    const { getByTestId } = render(SectionGap, { props: { size } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-size', size)
  })

  it('holds no content of its own', () => {
    const { getByTestId } = render(SectionGap)

    expect(getByTestId(TESTID)).toHaveTextContent('')
  })

  it('forwards a consumer data-testid onto the root', () => {
    const { getByTestId } = render(SectionGap, { attrs: { 'data-testid': 'my-gap' } })

    expect(getByTestId('my-gap')).toHaveAttribute('data-borders', 'y')
  })

  it('has no a11y violations', async () => {
    const { container } = render(SectionGap)
    await expectNoA11yViolations(container)
  })

  describe('stories', () => {
    it('renders the Default story with the gap between two stub sections', () => {
      const { getByTestId, getByText } = render(Default())

      expect(getByText('Section above')).toBeInTheDocument()
      expect(getByTestId(TESTID)).toHaveAttribute('data-flush', 'true')
      expect(getByText('Section below')).toBeInTheDocument()
    })

    it('renders the Sizes story with one gap per size step', () => {
      const { getAllByTestId } = render(Sizes())

      expect(getAllByTestId(TESTID).map((el) => el.getAttribute('data-size'))).toEqual([
        'small',
        'medium',
        'large'
      ])
    })
  })
})
