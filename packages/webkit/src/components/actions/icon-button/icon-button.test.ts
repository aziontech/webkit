import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/icon-button/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import IconButton from './icon-button.vue'

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
    // Never click an active anchor here: real-browser navigation hangs the runner.
    // The shared click handler is already exercised on the button path.
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

describe('IconButton accessible name', () => {
  it('takes its name from the kebab aria-label attribute a template writes', () => {
    const { getByRole } = render({
      components: { IconButton },
      template: '<IconButton icon="pi pi-trash" aria-label="Delete domain" />'
    })

    const button = getByRole('button', { name: 'Delete domain' })
    expect(button).toHaveAttribute('aria-label', 'Delete domain')
  })

  it('takes a bound :aria-label and follows its changes', async () => {
    const { getByRole, getByTestId } = render({
      components: { IconButton },
      data: () => ({ label: 'Show password' }),
      template: `
        <div>
          <IconButton icon="pi pi-eye" :aria-label="label" />
          <button type="button" data-testid="toggle" @click="label = 'Hide password'">toggle</button>
        </div>
      `
    })

    expect(getByRole('button', { name: 'Show password' })).toBeTruthy()
    await fireEvent.click(getByTestId('toggle'))
    expect(getByRole('button', { name: 'Hide password' })).toBeTruthy()
  })

  it('renders no empty aria-label when aria-labelledby names it', async () => {
    const { getByTestId, container } = render({
      components: { IconButton },
      template: `
        <div>
          <span id="close-name">Close panel</span>
          <IconButton icon="pi pi-times" aria-labelledby="close-name" />
        </div>
      `
    })

    const button = getByTestId('actions-icon-button')
    expect(button).not.toHaveAttribute('aria-label')
    expect(button).toHaveAttribute('aria-labelledby', 'close-name')
    await expectNoA11yViolations(container)
  })
})

describe('IconButton touch target', () => {
  it('adds a 44px hit area on coarse pointers without changing the drawn size', () => {
    const view = render(IconButton, { props: { icon: 'pi pi-times', ariaLabel: 'Close' } })
    const target = view.getByRole('button').querySelector('[data-slot="touch-target"]')

    expect(target?.className).toContain('pointer-coarse:block')
  })
})
