import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Kbd from './kbd.vue'

// Starter suite emitted by the scaffold — a FLOOR, not the ceiling. Expand per
// .claude/rules/testing.md: reuse the Storybook story via composeStories once it
// exists, and add assertions for every OS-aware modifier glyph combination.
describe('Kbd', () => {
  it('renders and exposes the fallback data-testid', () => {
    const { getByTestId } = render(Kbd, { slots: { default: () => 'K' } })
    expect(getByTestId('content-kbd')).toBeTruthy()
  })

  it('lets a consumer override data-testid', () => {
    const { getByTestId } = render(Kbd, {
      attrs: { 'data-testid': 'custom-testid' },
      slots: { default: () => 'K' }
    })
    expect(getByTestId('custom-testid')).toBeTruthy()
  })

  it('defaults data-size to medium', () => {
    const { getByTestId } = render(Kbd, { slots: { default: () => 'K' } })
    expect(getByTestId('content-kbd')).toHaveAttribute('data-size', 'medium')
  })

  it('maps size=small to the data-size attribute', () => {
    const { getByTestId } = render(Kbd, {
      props: { size: 'small' },
      slots: { default: () => 'K' }
    })
    expect(getByTestId('content-kbd')).toHaveAttribute('data-size', 'small')
  })

  it('renders the shift modifier glyph before the key', () => {
    const { getByTestId } = render(Kbd, {
      props: { shift: true },
      slots: { default: () => 'K' }
    })

    const root = getByTestId('content-kbd')
    expect(root).toHaveTextContent('⇧')
    expect(root).toHaveTextContent('K')
  })

  it('has no axe violations on the default render', async () => {
    const { container } = render(Kbd, { slots: { default: () => 'K' } })
    await expectNoA11yViolations(container)
  })
})
