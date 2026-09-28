import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { createCommentVNode, Fragment, h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import BandStack from './band-stack.vue'

const TESTID = 'marketing-band-stack'
const BAND = `[data-testid="${TESTID}__band"]`

const band = (label: string) => h('p', label)

const renderStack = (props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) =>
  render(BandStack, {
    props,
    attrs,
    slots: { default: () => [band('One'), band('Two'), band('Three')] }
  })

describe('BandStack', () => {
  it('renders with the default testid', () => {
    const { getByTestId } = renderStack()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = renderStack({}, { 'data-testid': 'solutions-stack' })

    expect(getByTestId('solutions-stack')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
    expect(
      getByTestId('solutions-stack').querySelectorAll('[data-testid="solutions-stack__band"]')
    ).toHaveLength(3)
  })

  it('wraps each direct child in its own frame', () => {
    const { getByTestId } = renderStack()
    const frames = getByTestId(TESTID).querySelectorAll(BAND)

    expect(frames).toHaveLength(3)
    expect([...frames].map((frame) => frame.textContent)).toEqual(['One', 'Two', 'Three'])
  })

  it('gives every child of a v-for style array and of a Fragment its own band, skipping comments', () => {
    const { getByTestId } = render(BandStack, {
      slots: {
        default: () => [
          band('Lead'),
          createCommentVNode('v-if'),
          [band('Loop one'), band('Loop two')],
          h(Fragment, [band('Fragment one'), createCommentVNode('skip'), band('Fragment two')])
        ]
      }
    })
    const frames = getByTestId(TESTID).querySelectorAll(BAND)

    expect([...frames].map((frame) => frame.textContent)).toEqual([
      'Lead',
      'Loop one',
      'Loop two',
      'Fragment one',
      'Fragment two'
    ])
  })

  it('renders no band for an empty slot', () => {
    const { getByTestId } = render(BandStack)

    expect(getByTestId(TESTID).querySelectorAll(BAND)).toHaveLength(0)
  })

  it('sets data-sticky only when sticky is on', async () => {
    const { getByTestId, rerender } = renderStack()

    expect(getByTestId(TESTID)).not.toHaveAttribute('data-sticky')

    await rerender({ sticky: true })

    expect(getByTestId(TESTID)).toHaveAttribute('data-sticky')
  })

  it('leaves every frame unflushed by default', () => {
    const { getByTestId } = renderStack()
    const frames = getByTestId(TESTID).querySelectorAll(BAND)

    expect(getByTestId(TESTID)).not.toHaveAttribute('data-flush')
    for (const frame of frames) expect(frame).not.toHaveAttribute('data-flush')
  })

  it('flushes only the first frame when flush is on', () => {
    const { getByTestId } = renderStack({ flush: true })
    const [first, ...rest] = [...getByTestId(TESTID).querySelectorAll(BAND)]

    expect(getByTestId(TESTID)).toHaveAttribute('data-flush')
    expect(first).toHaveAttribute('data-flush')
    for (const frame of rest) expect(frame).not.toHaveAttribute('data-flush')
  })

  it('has no accessibility violations', async () => {
    const { container } = renderStack()

    await expectNoA11yViolations(container)
  })
})
