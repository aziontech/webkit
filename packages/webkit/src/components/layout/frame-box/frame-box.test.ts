import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/frame-box/FrameBox.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FrameBox from './frame-box.vue'

const { Default, Borders, Marks, Hatch, Flush } = composeStories(stories)

const TESTID = 'layout-frame-box'

/** The resolved side/corner list off a `data-*` attribute, sorted so order is not asserted. */
const sides = (el: HTMLElement, attr: string) => {
  const value = el.getAttribute(attr)
  return value && value !== 'none' ? value.split(' ').sort() : []
}

describe('FrameBox', () => {
  it('renders with the default testid and the default frame configuration', () => {
    const { getByTestId } = render(FrameBox)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    // borders/marks carry the RESOLVED side and corner lists, not the raw keyword.
    expect(sides(root, 'data-borders')).toEqual(['bottom', 'left', 'right', 'top'])
    expect(sides(root, 'data-marks')).toEqual([
      'bottom-left',
      'bottom-right',
      'top-left',
      'top-right'
    ])
    expect(root).not.toHaveAttribute('data-hatch')
    expect(root).not.toHaveAttribute('data-flush')
  })

  it.each([
    ['all', ['bottom', 'left', 'right', 'top']],
    ['x', ['left', 'right']],
    ['y', ['bottom', 'top']],
    ['top', ['top']],
    ['left', ['left']],
    ['none', []]
  ] as const)('resolves borders="%s" to its sides', (borders, expected) => {
    const { getByTestId } = render(FrameBox, { props: { borders } })

    expect(sides(getByTestId(TESTID), 'data-borders')).toEqual([...expected])
  })

  it('accepts an explicit list of sides', () => {
    const { getByTestId } = render(FrameBox, { props: { borders: ['top', 'left'] } })
    const root = getByTestId(TESTID)

    expect(sides(root, 'data-borders')).toEqual(['left', 'top'])
  })

  it('renders the four corner marks by default', () => {
    const { getByTestId } = render(FrameBox)

    expect(getByTestId(TESTID).querySelectorAll('span[aria-hidden="true"]')).toHaveLength(4)
  })

  it.each([
    ['all', ['bottom-left', 'bottom-right', 'top-left', 'top-right']],
    ['top', ['top-left', 'top-right']],
    ['bottom', ['bottom-left', 'bottom-right']],
    ['left', ['bottom-left', 'top-left']],
    ['right', ['bottom-right', 'top-right']],
    ['top-right', ['top-right']],
    ['none', []]
  ] as const)('resolves marks="%s" to its corners', (marks, expected) => {
    const { getByTestId } = render(FrameBox, { props: { marks } })
    const root = getByTestId(TESTID)

    expect(sides(root, 'data-marks')).toEqual([...expected])
    expect(root.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(expected.length)
  })

  it('accepts an explicit list of corners', () => {
    const { getByTestId } = render(FrameBox, {
      props: { marks: ['top-left', 'bottom-right'] }
    })
    const root = getByTestId(TESTID)

    expect(sides(root, 'data-marks')).toEqual(['bottom-right', 'top-left'])
    expect(root.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(2)
  })

  it.each([
    ['top', 'top-0'],
    ['bottom', 'bottom-0'],
    ['left', 'left-0'],
    ['right', 'right-0']
  ] as const)('anchors the marks="%s" pair to its own edge', (marks, edgeClass) => {
    const { getByTestId } = render(FrameBox, { props: { marks } })
    const squares = [...getByTestId(TESTID).querySelectorAll('span[aria-hidden="true"]')]

    expect(squares).toHaveLength(2)
    expect(squares.every((square) => square.className.includes(edgeClass))).toBe(true)
  })

  it('renders the decorative hatch layer only when hatch is set', () => {
    const { getByTestId } = render(FrameBox, { props: { hatch: true } })
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('data-hatch', 'true')
    // The hatch is a decorative div (the marks are spans), hidden from a11y.
    expect(root.querySelectorAll('div[aria-hidden="true"]')).toHaveLength(1)
  })

  it('treats a bare flush as the top side and drops that rule', () => {
    const { getByTestId } = render(FrameBox, { props: { flush: true } })
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('data-flush', 'top')
    expect(sides(root, 'data-borders')).toEqual(['bottom', 'left', 'right'])
  })

  it.each([
    ['top', ['bottom', 'left', 'right']],
    ['right', ['bottom', 'left', 'top']],
    ['bottom', ['left', 'right', 'top']],
    ['left', ['bottom', 'right', 'top']]
  ] as const)('flushes the %s side on either axis', (flush, remaining) => {
    const { getByTestId } = render(FrameBox, { props: { flush } })
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('data-flush', flush)
    expect(sides(root, 'data-borders')).toEqual([...remaining])
  })

  it('flushes several sides at once for a grid cell', () => {
    const { getByTestId } = render(FrameBox, { props: { flush: ['top', 'left'] } })
    const root = getByTestId(TESTID)

    expect(sides(root, 'data-flush')).toEqual(['left', 'top'])
    expect(sides(root, 'data-borders')).toEqual(['bottom', 'right'])
  })

  it('never leaves a flushed side in the border set', () => {
    const { getByTestId } = render(FrameBox, { props: { borders: 'y', flush: 'top' } })
    const root = getByTestId(TESTID)

    expect(sides(root, 'data-borders')).toEqual(['bottom'])
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
    expect(sides(root, 'data-borders')).toEqual(['bottom', 'left', 'right', 'top'])
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

      expect(sides(root, 'data-borders')).toEqual(['bottom', 'left', 'right', 'top'])
      expect(getByText('Framed content')).toBeInTheDocument()
    })

    it('renders the Borders story with one frame per borders value', () => {
      const { getAllByTestId } = render(Borders())
      const frames = getAllByTestId(TESTID)

      expect(frames.map((frame) => sides(frame, 'data-borders'))).toEqual([
        ['bottom', 'left', 'right', 'top'],
        ['left', 'right'],
        ['bottom', 'top'],
        ['top'],
        ['left', 'top'],
        []
      ])
    })

    it('renders the Hatch story with the texture on', () => {
      const { getByTestId } = render(Hatch())

      expect(getByTestId(TESTID)).toHaveAttribute('data-hatch', 'true')
    })

    it('renders the Marks story with one frame per marks value', () => {
      const { getAllByTestId } = render(Marks())
      const frames = getAllByTestId(TESTID)

      expect(frames.map((frame) => sides(frame, 'data-marks'))).toEqual([
        ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
        ['top-left', 'top-right'],
        ['bottom-left', 'top-left'],
        ['top-right'],
        ['bottom-right', 'top-left'],
        []
      ])
    })

    it('renders the Flush story with a vertical and a horizontal shared edge', () => {
      const { getAllByTestId } = render(Flush())
      const [stackTop, stackBottom, rowLeft, rowRight] = getAllByTestId(TESTID)

      expect(stackTop).not.toHaveAttribute('data-flush')
      expect(stackBottom).toHaveAttribute('data-flush', 'top')
      expect(sides(stackBottom, 'data-borders')).toEqual(['bottom', 'left', 'right'])

      expect(rowLeft).not.toHaveAttribute('data-flush')
      expect(rowRight).toHaveAttribute('data-flush', 'left')
      expect(sides(rowRight, 'data-borders')).toEqual(['bottom', 'right', 'top'])
    })
  })
})
