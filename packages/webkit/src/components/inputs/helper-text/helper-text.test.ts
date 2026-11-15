import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/helper-text/default.vue'
import Types from '../../../../examples/helper-text/types.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import HelperText from './helper-text.vue'

const TYPES = ['helper', 'invalid', 'required', 'disabled'] as const

describe('HelperText', () => {
  it('renders a <p> root with the default data-testid and default type', () => {
    const { getByTestId } = render(HelperText, { props: { label: 'Guidance' } })

    const root = getByTestId('input-helper-text')
    expect(root.tagName).toBe('P')
    // Default type is 'helper' per withDefaults.
    expect(root).toHaveAttribute('data-type', 'helper')
  })

  it('renders the label prop inside the __text span when no slot is provided', () => {
    const { getByTestId } = render(HelperText, { props: { label: 'Enter a valid email address.' } })

    expect(getByTestId('input-helper-text__text')).toHaveTextContent('Enter a valid email address.')
  })

  it('prefers the default slot over the label prop', () => {
    const { getByTestId } = render(HelperText, {
      props: { label: 'fallback value' },
      slots: { default: 'Slot content wins' }
    })

    const text = getByTestId('input-helper-text__text')
    expect(text).toHaveTextContent('Slot content wins')
    expect(text).not.toHaveTextContent('fallback value')
  })

  it('mirrors the type prop onto data-type for every variant', () => {
    for (const type of TYPES) {
      const { getByTestId, unmount } = render(HelperText, { props: { type: type, label: 'x' } })
      expect(getByTestId('input-helper-text')).toHaveAttribute('data-type', type)
      unmount()
    }
  })

  it('renders the ai ai-lock icon only for the disabled type', () => {
    const disabled = render(HelperText, { props: { type: 'disabled', label: 'Locked' } })
    const icon = disabled.getByTestId('input-helper-text__icon')
    expect(icon).toHaveClass('ai', 'ai-lock')
    // The icon is decorative and must be hidden from assistive tech.
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    disabled.unmount()

    for (const type of ['helper', 'invalid', 'required'] as const) {
      const { queryByTestId, unmount } = render(HelperText, { props: { type: type, label: 'x' } })
      expect(queryByTestId('input-helper-text__icon')).toBeNull()
      unmount()
    }
  })

  it('honors a consumer-supplied data-testid and derives child testids from it', () => {
    const { getByTestId } = render(HelperText, {
      props: { type: 'disabled', label: 'Locked' },
      attrs: { 'data-testid': 'field-hint' }
    })

    expect(getByTestId('field-hint').tagName).toBe('P')
    expect(getByTestId('field-hint__text')).toHaveTextContent('Locked')
    expect(getByTestId('field-hint__icon')).toHaveClass('ai-lock')
  })

  it('has no accessibility violations in the default helper variant', async () => {
    const { container } = render(HelperText, { props: { label: 'Helper guidance text' } })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations in the disabled variant (icon present)', async () => {
    const { container } = render(HelperText, { props: { type: 'disabled', label: 'Locked field' } })
    await expectNoA11yViolations(container)
  })

  it('renders the Default story fixture', () => {
    const { getByTestId } = render(Default)
    expect(getByTestId('input-helper-text__text')).toHaveTextContent('Helper Text')
  })

  it('renders the Types story fixture with one root per type', () => {
    const { getAllByTestId } = render(Types)
    const roots = getAllByTestId('input-helper-text')
    expect(roots).toHaveLength(4)
    expect(roots.map((el) => el.getAttribute('data-type'))).toEqual([
      'helper',
      'invalid',
      'required',
      'disabled'
    ])
  })
})
