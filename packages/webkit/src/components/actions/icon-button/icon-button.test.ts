import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/actions/icon-button/IconButton.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import IconButton from './icon-button.vue'

const { Default } = composeStories(stories)

const KINDS = ['primary', 'secondary', 'outlined', 'transparent', 'danger'] as const
const SIZES = ['small', 'medium', 'large'] as const

describe('IconButton', () => {
  it('renders a <button type="button"> by default with the fallback data-testid and aria-label', () => {
    const { getByTestId } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add' }
    })

    const el = getByTestId('actions-icon-button')
    expect(el.tagName).toBe('BUTTON')
    expect(el).toHaveAttribute('type', 'button')
    expect(el).toHaveAttribute('aria-label', 'Add')
  })

  it('honors a consumer-provided data-testid', () => {
    const { getByTestId } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add' },
      attrs: { 'data-testid': 'my-button' }
    })

    expect(getByTestId('my-button').tagName).toBe('BUTTON')
  })

  it('emits click with the MouseEvent when the button is activated', async () => {
    const { getByTestId, emitted } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add' }
    })

    await fireEvent.click(getByTestId('actions-icon-button'))

    expect(emitted().click).toHaveLength(1)
    expect(emitted().click[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('does NOT emit click when disabled', async () => {
    const { getByTestId, emitted } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add', disabled: true }
    })

    const el = getByTestId('actions-icon-button')
    expect(el).toBeDisabled()
    expect(el).toHaveAttribute('aria-disabled', 'true')
    expect(el).toHaveAttribute('data-disabled', '')

    await fireEvent.click(el)
    expect(emitted().click).toBeUndefined()
  })

  it('does NOT emit click when loading, and marks aria-busy', async () => {
    const { getByTestId, emitted } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add', loading: true }
    })

    const el = getByTestId('actions-icon-button')
    expect(el).toHaveAttribute('aria-disabled', 'true')
    expect(el).toHaveAttribute('aria-busy', 'true')

    await fireEvent.click(el)
    expect(emitted().click).toBeUndefined()
  })

  it('renders the spinner (with its own testid) while loading and no icon glyph', () => {
    const { getByTestId, container } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add', loading: true }
    })

    expect(getByTestId('actions-icon-button-loading')).toBeInTheDocument()
    expect(container.querySelector('i.pi.pi-plus')).toBeNull()
  })

  it('renders the icon glyph (aria-hidden) when not loading', () => {
    const { container } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add' }
    })

    const glyph = container.querySelector('i.pi.pi-plus')
    expect(glyph).not.toBeNull()
    expect(glyph).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies iconClass to the icon glyph', () => {
    const { container } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add', iconClass: 'text-lg' }
    })

    expect(container.querySelector('i.pi.pi-plus.text-lg')).not.toBeNull()
  })

  describe('as a link (href set)', () => {
    // Note: we assert the anchor's structural + a11y attributes and the
    // disabled click-suppression (which calls preventDefault, so no navigation).
    // We do NOT fire a click on an ACTIVE anchor: in the real browser that would
    // trigger a live navigation and hang the runner. The `click` event itself is
    // fully exercised on the <button> path above — the same handleClick handler
    // drives both branches.
    it('renders an <a> carrying href/target when href is set', () => {
      const { getByTestId } = render(IconButton, {
        props: { icon: 'pi pi-external-link', ariaLabel: 'Open', href: '/somewhere' }
      })

      const el = getByTestId('actions-icon-button')
      expect(el.tagName).toBe('A')
      expect(el).toHaveAttribute('href', '/somewhere')
      expect(el).toHaveAttribute('aria-label', 'Open')
    })

    it('adds rel="noopener noreferrer" only when target is _blank', () => {
      const { getByTestId } = render(IconButton, {
        props: {
          icon: 'pi pi-external-link',
          ariaLabel: 'Open',
          href: '/somewhere',
          target: '_blank'
        }
      })

      const el = getByTestId('actions-icon-button')
      expect(el).toHaveAttribute('target', '_blank')
      expect(el).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('does not set rel when target is _self', () => {
      const { getByTestId } = render(IconButton, {
        props: {
          icon: 'pi pi-external-link',
          ariaLabel: 'Open',
          href: '/somewhere',
          target: '_self'
        }
      })

      expect(getByTestId('actions-icon-button')).not.toHaveAttribute('rel')
    })

    it('does NOT emit click and sets tabindex=-1 when disabled anchor is activated', async () => {
      const { getByTestId, emitted } = render(IconButton, {
        props: {
          icon: 'pi pi-external-link',
          ariaLabel: 'Open',
          href: '/somewhere',
          disabled: true
        }
      })

      const el = getByTestId('actions-icon-button')
      expect(el).toHaveAttribute('aria-disabled', 'true')
      expect(el).toHaveAttribute('tabindex', '-1')

      await fireEvent.click(el)
      expect(emitted().click).toBeUndefined()
    })
  })

  it.each(KINDS)('renders kind=%s', (kind) => {
    const { getByTestId } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add', kind }
    })
    expect(getByTestId('actions-icon-button')).toBeInTheDocument()
  })

  it.each(SIZES)('renders size=%s', (size) => {
    const { getByTestId } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add', size }
    })
    expect(getByTestId('actions-icon-button')).toBeInTheDocument()
  })

  it('has no a11y violations on the default button render', async () => {
    const { container } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when rendered as a link', async () => {
    const { container } = render(IconButton, {
      props: { icon: 'pi pi-external-link', ariaLabel: 'Open', href: '/somewhere' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the disabled state', async () => {
    const { container } = render(IconButton, {
      props: { icon: 'pi pi-plus', ariaLabel: 'Add', disabled: true }
    })
    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story', () => {
    const { getByTestId } = render(Default)
    expect(getByTestId('actions-icon-button')).toBeInTheDocument()
  })
})
