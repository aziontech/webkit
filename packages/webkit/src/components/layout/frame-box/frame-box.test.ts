import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/frame-box/FrameBox.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FrameBox from './frame-box.vue'

const { Default, Borders, Hatch, Flush } = composeStories(stories)

const TESTID = 'layout-frame-box'

describe('FrameBox', () => {
  it('renders with the default testid and the default frame configuration', () => {
    const { getByTestId } = render(FrameBox)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-borders', 'all')
    // marks defaults to true; hatch/flush are `value || null`, so they are absent.
    expect(root).toHaveAttribute('data-marks', 'true')
    expect(root).not.toHaveAttribute('data-hatch')
    expect(root).not.toHaveAttribute('data-flush')
  })

  it.each(['all', 'x', 'y', 'none'] as const)(
    'reflects borders="%s" on data-borders',
    (borders) => {
      const { getByTestId } = render(FrameBox, { props: { borders } })

      expect(getByTestId(TESTID)).toHaveAttribute('data-borders', borders)
    }
  )

  it('renders the four corner marks by default', () => {
    const { getByTestId } = render(FrameBox)

    expect(getByTestId(TESTID).querySelectorAll('span[aria-hidden="true"]')).toHaveLength(4)
  })

  it('renders no corner marks and drops data-marks when marks is false', () => {
    const { getByTestId } = render(FrameBox, { props: { marks: false } })
    const root = getByTestId(TESTID)

    expect(root).not.toHaveAttribute('data-marks')
    expect(root.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(0)
  })

  it('renders the decorative hatch layer only when hatch is set', () => {
    const { getByTestId } = render(FrameBox, { props: { hatch: true } })
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('data-hatch', 'true')
    // The hatch is a decorative div (the marks are spans), hidden from a11y.
    expect(root.querySelectorAll('div[aria-hidden="true"]')).toHaveLength(1)
  })

  it('marks the frame flush when it shares the rule above', () => {
    const { getByTestId } = render(FrameBox, { props: { flush: true } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-flush', 'true')
  })

  it('renders default slot content above the decorative layers', () => {
    const { getByTestId, getByText } = render(FrameBox, {
      props: { hatch: true },
      slots: { default: '<p>Framed content</p>' }
    })

    const content = getByText('Framed content')
    expect(getByTestId(TESTID)).toContainElement(content)
  })

  it('forwards a consumer data-testid and class onto the root', () => {
    const { getByTestId } = render(FrameBox, {
      attrs: { 'data-testid': 'my-frame', class: 'h-40' }
    })

    const root = getByTestId('my-frame')
    expect(root).toHaveAttribute('data-borders', 'all')
    expect(root.className).toContain('h-40')
  })

  it('has no a11y violations in its default configuration', async () => {
    const { container } = render(FrameBox, { slots: { default: '<p>Framed content</p>' } })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with the hatch texture on', async () => {
    const { container } = render(FrameBox, {
      props: { hatch: true },
      slots: { default: '<p>Framed content</p>' }
    })
    await expectNoA11yViolations(container)
  })

  describe('stories', () => {
    it('renders the Default story fixture', () => {
      const { getByTestId, getByText } = render(Default())
      const root = getByTestId(TESTID)

      expect(root).toHaveAttribute('data-borders', 'all')
      expect(getByText('Framed content')).toBeInTheDocument()
    })

    it('renders the Borders story with one frame per borders value', () => {
      const { getAllByTestId } = render(Borders())
      const frames = getAllByTestId(TESTID)

      expect(frames.map((frame) => frame.getAttribute('data-borders'))).toEqual([
        'all',
        'x',
        'y',
        'none'
      ])
    })

    it('renders the Hatch story with the texture on', () => {
      const { getByTestId } = render(Hatch())

      expect(getByTestId(TESTID)).toHaveAttribute('data-hatch', 'true')
    })

    it('renders the Flush story with only the second frame sharing the rule', () => {
      const { getAllByTestId } = render(Flush())
      const [first, second] = getAllByTestId(TESTID)

      expect(first).not.toHaveAttribute('data-flush')
      expect(second).toHaveAttribute('data-flush', 'true')
    })
  })
})
