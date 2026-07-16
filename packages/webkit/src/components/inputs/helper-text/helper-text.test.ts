import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/helper-text/HelperText.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import HelperText from './helper-text.vue'

const { Default, Types } = composeStories(stories)

const KINDS = ['helper', 'invalid', 'required', 'disabled'] as const

describe('HelperText', () => {
  it('renders a <p> root with the default data-testid and default kind', () => {
    const { getByTestId } = render(HelperText, { props: { label: 'Guidance' } })

    const root = getByTestId('input-helper-text')
    expect(root.tagName).toBe('P')
    // Default kind is 'helper' per withDefaults.
    expect(root).toHaveAttribute('data-kind', 'helper')
  })

  it('renders the value prop inside the __text span when no slot is provided', () => {
    const { getByTestId } = render(HelperText, { props: { label: 'Enter a valid email address.' } })

    expect(getByTestId('input-helper-text__text')).toHaveTextContent('Enter a valid email address.')
  })

  it('prefers the default slot over the value prop', () => {
    const { getByTestId } = render(HelperText, {
      props: { label: 'fallback value' },
      slots: { default: 'Slot content wins' }
    })

    const text = getByTestId('input-helper-text__text')
    expect(text).toHaveTextContent('Slot content wins')
    expect(text).not.toHaveTextContent('fallback value')
  })

  it('mirrors the kind prop onto data-kind for every variant', () => {
    for (const kind of KINDS) {
      const { getByTestId, unmount } = render(HelperText, { props: { kind, label: 'x' } })
      expect(getByTestId('input-helper-text')).toHaveAttribute('data-kind', kind)
      unmount()
    }
  })

  it('renders the pi pi-lock icon only for the disabled kind', () => {
    const disabled = render(HelperText, { props: { kind: 'disabled', label: 'Locked' } })
    const icon = disabled.getByTestId('input-helper-text__icon')
    expect(icon).toHaveClass('pi', 'pi-lock')
    // The icon is decorative and must be hidden from assistive tech.
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    disabled.unmount()

    for (const kind of ['helper', 'invalid', 'required'] as const) {
      const { queryByTestId, unmount } = render(HelperText, { props: { kind, label: 'x' } })
      expect(queryByTestId('input-helper-text__icon')).toBeNull()
      unmount()
    }
  })

  it('honors a consumer-supplied data-testid and derives child testids from it', () => {
    const { getByTestId } = render(HelperText, {
      props: { kind: 'disabled', label: 'Locked' },
      attrs: { 'data-testid': 'field-hint' }
    })

    expect(getByTestId('field-hint').tagName).toBe('P')
    expect(getByTestId('field-hint__text')).toHaveTextContent('Locked')
    expect(getByTestId('field-hint__icon')).toHaveClass('pi-lock')
  })

  it('has no accessibility violations in the default helper variant', async () => {
    const { container } = render(HelperText, { props: { label: 'Helper guidance text' } })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations in the disabled variant (icon present)', async () => {
    const { container } = render(HelperText, { props: { kind: 'disabled', label: 'Locked field' } })
    await expectNoA11yViolations(container)
  })

  it('renders the Default story fixture', () => {
    const { getByTestId } = render(Default)
    expect(getByTestId('input-helper-text__text')).toHaveTextContent('Helper Text')
  })

  it('renders the Types story fixture with one root per kind', () => {
    const { getAllByTestId } = render(Types)
    const roots = getAllByTestId('input-helper-text')
    expect(roots).toHaveLength(4)
    expect(roots.map((el) => el.getAttribute('data-kind'))).toEqual([
      'helper',
      'invalid',
      'required',
      'disabled'
    ])
  })
})
