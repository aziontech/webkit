import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/brand/Brand.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Brand from './brand.vue'

const { Default, Types, Sizes } = composeStories(stories)

// Each kind maps to a distinct SVG lockup, identifiable by its viewBox.
const KIND_VIEWBOX = {
  default: '0 0 90 18',
  reduced: '0 0 21 18',
  extended: '0 0 90 34'
} as const

const KINDS = ['default', 'reduced', 'extended'] as const
const SIZES = ['small', 'medium', 'large'] as const

describe('Brand', () => {
  // --- render + testid ----------------------------------------------------
  it('renders with the default testid and role="img"', () => {
    const { getByTestId } = render(Brand)

    const root = getByTestId('content-brand')
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('role', 'img')
  })

  it('honors a consumer data-testid on the root', () => {
    const { getByTestId } = render(Brand, {
      attrs: { 'data-testid': 'my-brand' }
    })

    expect(getByTestId('my-brand')).toBeInTheDocument()
  })

  // --- kind -> rendered lockup + data-kind --------------------------------
  it.each(KINDS)('kind=%s sets data-kind and renders the matching lockup', (kind) => {
    const { getByTestId } = render(Brand, { props: { kind } })

    const root = getByTestId('content-brand')
    expect(root).toHaveAttribute('data-kind', kind)

    const svg = root.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('viewBox', KIND_VIEWBOX[kind])
  })

  it('defaults to the default lockup when kind is omitted', () => {
    const { getByTestId } = render(Brand)

    const root = getByTestId('content-brand')
    expect(root).toHaveAttribute('data-kind', 'default')
    expect(root.querySelector('svg')).toHaveAttribute('viewBox', KIND_VIEWBOX.default)
  })

  // --- size -> data-size + preserved aspect ratio -------------------------
  it.each(SIZES)('size=%s sets data-size on the root', (size) => {
    const { getByTestId } = render(Brand, { props: { size } })
    expect(getByTestId('content-brand')).toHaveAttribute('data-size', size)
  })

  it('defaults to size "medium" when size is omitted', () => {
    expect(render(Brand).getByTestId('content-brand')).toHaveAttribute('data-size', 'medium')
  })

  // Sizing is applied via width:auto on the SVG, so each lockup keeps its own viewBox
  // aspect ratio at any size (the height utility only scales it; width follows the viewBox).
  it.each(KINDS)('keeps the %s lockup viewBox (aspect ratio) intact across sizes', (kind) => {
    for (const size of SIZES) {
      const { container } = render(Brand, { props: { kind, size } })
      expect(container.querySelector('svg')).toHaveAttribute('viewBox', KIND_VIEWBOX[kind])
    }
  })

  // --- accessibility ------------------------------------------------------
  it('labels the logo "Azion" by default and marks the inner SVG presentational', () => {
    const { getByTestId } = render(Brand)

    const root = getByTestId('content-brand')
    expect(root).toHaveAttribute('aria-label', 'Azion')
    expect(root.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('lets a consumer override the accessible name via aria-label', () => {
    const { getByTestId } = render(Brand, {
      attrs: { 'aria-label': 'Azion home' }
    })

    expect(getByTestId('content-brand')).toHaveAttribute('aria-label', 'Azion home')
  })

  it.each(KINDS)('has no accessibility violations for kind=%s', async (kind) => {
    const { container } = render(Brand, { props: { kind } })
    await expectNoA11yViolations(container)
  })

  // --- composed story fixtures --------------------------------------------
  it('renders the composed Default story fixture (default lockup)', () => {
    const { getByTestId } = render(Default)

    const root = getByTestId('content-brand')
    expect(root).toHaveAttribute('data-kind', 'default')
    expect(root.querySelector('svg')).toHaveAttribute('viewBox', KIND_VIEWBOX.default)
  })

  it('renders all three lockups in the composed Types story fixture', () => {
    const { getAllByTestId } = render(Types)

    const roots = getAllByTestId('content-brand')
    expect(roots).toHaveLength(3)
    expect(roots.map((r) => r.getAttribute('data-kind'))).toEqual([
      'default',
      'reduced',
      'extended'
    ])
  })

  it('renders all three sizes in the composed Sizes story fixture', () => {
    const { getAllByTestId } = render(Sizes)

    const roots = getAllByTestId('content-brand')
    expect(roots).toHaveLength(3)
    expect(roots.map((r) => r.getAttribute('data-size'))).toEqual(['small', 'medium', 'large'])
  })
})
