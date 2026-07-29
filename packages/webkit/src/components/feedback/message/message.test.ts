import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/feedback/message/Message.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Message from './message.vue'

const { Default } = composeStories(stories)

// @testing-library/vue mounts through @vue/test-utils, which stubs <Transition>
// by default. The stub skips the JS transition lifecycle, so the component's
// `@after-leave` (which emits `close`) never fires. Rendering the REAL transition
// lets the browser run the fade-out and fire `@after-leave` as it does in production.
const realTransition = { global: { stubs: { transition: false } } }

describe('Message', () => {
  it('renders the root with the default testid, status role, and the label copy', () => {
    const { getByTestId } = render(Message, {
      props: { severity: 'info', label: 'Deployment finished.' }
    })

    const root = getByTestId('feedback-message')
    expect(root).toBeTruthy()
    expect(root.getAttribute('role')).toBe('status')
    expect(root.getAttribute('data-severity')).toBe('info')
    expect(getByTestId('feedback-message__content').textContent).toContain('Deployment finished.')
  })

  it('lets a consumer data-testid win over the derived fallback', () => {
    const { getByTestId, queryByTestId } = render(Message, {
      props: { label: 'Custom testid' },
      attrs: { 'data-testid': 'my-banner' }
    })

    expect(getByTestId('my-banner')).toBeTruthy()
    expect(queryByTestId('feedback-message')).toBeNull()
  })

  it('renders the content region even when label is empty', () => {
    const { getByTestId } = render(Message, { props: {} })

    expect(getByTestId('feedback-message__content').textContent?.trim()).toBe('')
  })

  describe('size', () => {
    it('defaults to medium on the root and the content region', () => {
      const { getByTestId } = render(Message, { props: { label: 'Default size' } })

      expect(getByTestId('feedback-message').getAttribute('data-size')).toBe('medium')
      expect(getByTestId('feedback-message__content').getAttribute('data-size')).toBe('medium')
    })

    it.each(['small', 'medium'] as const)('maps size=%s onto data-size', (size) => {
      const { getByTestId } = render(Message, { props: { size, label: `Size ${size}` } })

      expect(getByTestId('feedback-message').getAttribute('data-size')).toBe(size)
      expect(getByTestId('feedback-message__content').getAttribute('data-size')).toBe(size)
    })
  })

  describe('trailing-control flag', () => {
    it('is absent when the banner carries no action or close control', () => {
      const { getByTestId } = render(Message, { props: { label: 'Bare' } })

      expect(getByTestId('feedback-message').hasAttribute('data-trailing')).toBe(false)
    })

    it.each([
      ['actionLabel', { label: 'x', actionLabel: 'Retry' }],
      ['closable', { label: 'x', closable: true }]
    ])('is set when %s is provided', (_name, props) => {
      const { getByTestId } = render(Message, { props })

      expect(getByTestId('feedback-message').hasAttribute('data-trailing')).toBe(true)
    })

    it('is set when the action slot is filled', () => {
      const { getByTestId } = render(Message, {
        props: { label: 'x' },
        slots: { action: '<button type="button">Go</button>' }
      })

      expect(getByTestId('feedback-message').hasAttribute('data-trailing')).toBe(true)
    })
  })

  it('normalizes severity="error" to danger and uses the alert role', () => {
    const { getByTestId } = render(Message, {
      props: { severity: 'error', label: 'Boom' }
    })

    const root = getByTestId('feedback-message')
    expect(root.getAttribute('data-severity')).toBe('danger')
    expect(root.getAttribute('role')).toBe('alert')
  })

  it('uses the alert role for warning severity', () => {
    const { getByTestId } = render(Message, {
      props: { severity: 'warning', label: 'Careful' }
    })

    const root = getByTestId('feedback-message')
    expect(root.getAttribute('data-severity')).toBe('warning')
    expect(root.getAttribute('role')).toBe('alert')
  })

  it('renders the leading icon on every severity, and applies an icon override', () => {
    const { getByTestId } = render(Message, {
      props: { label: 'With icon', icon: 'pi pi-star' }
    })

    const glyph = getByTestId('feedback-message').querySelector('i')
    expect(glyph).toBeTruthy()
    expect(glyph?.className).toContain('pi-star')
    expect(glyph?.getAttribute('aria-hidden')).toBe('true')
  })

  describe('message content', () => {
    it('renders default-slot content in place of the label', () => {
      const { getByTestId } = render(Message, {
        props: { label: 'Ignored label' },
        slots: { default: 'Slot copy' }
      })

      const content = getByTestId('feedback-message__content')
      expect(content.textContent).toContain('Slot copy')
      expect(content.textContent).not.toContain('Ignored label')
    })

    it('keeps the leading icon when the default slot is used', () => {
      const { getByTestId } = render(Message, {
        slots: { default: 'Slot copy' }
      })

      expect(getByTestId('feedback-message').querySelector('i')).toBeTruthy()
    })

    it('renders inline anchors from the default slot as real, focusable links', async () => {
      const { getByTestId } = render(Message, {
        props: { severity: 'warning' },
        slots: {
          default: 'Close to the limit. <a href="/billing">Upgrade the plan</a> to continue.'
        }
      })

      const content = getByTestId('feedback-message__content')
      const anchor = content.querySelector('a')

      expect(anchor).toBeTruthy()
      expect(anchor?.getAttribute('href')).toBe('/billing')
      expect(anchor?.textContent).toContain('Upgrade the plan')

      // The anchor is reachable by keyboard — it is a real link, not inert markup.
      anchor?.focus()
      expect(document.activeElement).toBe(anchor)
    })

    // The visual side of the inline-link contract (`.text-link` colour + underline,
    // applied via the content region's descendant-anchor rules) is NOT asserted here:
    // this env loads no theme CSS and runs no Tailwind, so a computed-style check
    // would only read the browser's default anchor styling and pass either way.
    // It is verified in Storybook (the WithLinks story) per src/test/setup.ts.
  })

  describe('action button', () => {
    it('renders the action button when actionLabel is set and emits "action" with the click event on click', async () => {
      const { getByTestId, emitted } = render(Message, {
        props: { label: 'Has action', actionLabel: 'Retry' }
      })

      const action = getByTestId('feedback-message__action')
      expect(action.textContent).toContain('Retry')

      await fireEvent.click(action)

      expect(emitted('action')).toHaveLength(1)
      // Payload is the native MouseEvent forwarded from the button click.
      expect(emitted('action')[0][0]).toBeInstanceOf(Event)
    })

    it('does not render the action button when actionLabel is empty', () => {
      const { queryByTestId } = render(Message, {
        props: { label: 'No action' }
      })

      expect(queryByTestId('feedback-message__action')).toBeNull()
    })

    it('replaces the built-in button with the action slot', () => {
      const { getByText, queryByTestId } = render(Message, {
        props: { label: 'Custom action', actionLabel: 'Ignored' },
        slots: { action: '<button type="button">Do it</button>' }
      })

      expect(getByText('Do it')).toBeTruthy()
      expect(queryByTestId('feedback-message__action')).toBeNull()
    })
  })

  describe('close / dismiss', () => {
    it('renders a close control when closable and emits "close" after the dismiss click', async () => {
      const { getByTestId, queryByTestId, emitted } = render(Message, {
        props: { label: 'Dismiss me', closable: true },
        ...realTransition
      })

      const close = getByTestId('feedback-message__close')
      expect(close).toBeTruthy()

      await fireEvent.click(close)

      // "close" is emitted after the leave transition completes (@after-leave).
      await waitFor(() => {
        expect(emitted('close')).toHaveLength(1)
      })
      // Once dismissed and unmounted, the root is gone.
      await waitFor(() => {
        expect(queryByTestId('feedback-message')).toBeNull()
      })
    })

    it('does not render a close control when not closable', () => {
      const { queryByTestId } = render(Message, {
        props: { label: 'Persistent' }
      })

      expect(queryByTestId('feedback-message__close')).toBeNull()
    })

    it('dismisses on Escape when closable, emitting "close"', async () => {
      const { getByTestId, emitted } = render(Message, {
        props: { label: 'Escapable', closable: true },
        ...realTransition
      })

      const root = getByTestId('feedback-message')
      await fireEvent.keyDown(root, { key: 'Escape' })

      await waitFor(() => {
        expect(emitted('close')).toHaveLength(1)
      })
    })

    it('does not dismiss on Escape when not closable', async () => {
      const { getByTestId, emitted } = render(Message, {
        props: { label: 'No escape' }
      })

      const root = getByTestId('feedback-message')
      await fireEvent.keyDown(root, { key: 'Escape' })

      // Give any pending transition a chance; the component must stay mounted and silent.
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(emitted('close')).toBeUndefined()
      expect(getByTestId('feedback-message')).toBeTruthy()
    })

    it('auto-dismisses once life expires', async () => {
      const { emitted } = render(Message, {
        props: { label: 'Fleeting', life: 60 },
        ...realTransition
      })

      await waitFor(() => {
        expect(emitted('close')).toHaveLength(1)
      })
    })
  })

  describe('accessibility', () => {
    it('has no a11y violations for the default status message', async () => {
      const { container } = render(Message, {
        props: {
          severity: 'info',
          label: 'Your workload finished deploying in 42 seconds.',
          actionLabel: 'Label',
          closable: true
        }
      })

      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for the danger alert variant', async () => {
      const { container } = render(Message, {
        props: { severity: 'danger', label: 'The last deploy failed before reaching the edge.' }
      })

      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for copy carrying inline links', async () => {
      const { container } = render(Message, {
        props: { severity: 'warning' },
        slots: {
          default:
            'This workload is close to its request limit. Review the <a href="/billing/usage">usage report</a> to avoid throttling.'
        }
      })

      await expectNoA11yViolations(container)
    })
  })

  it.each(['info', 'success', 'warning', 'danger', 'error'] as const)(
    'renders severity=%s with a data-severity attribute',
    (severity) => {
      const { getByTestId } = render(Message, {
        props: { severity, label: `Severity ${severity}` }
      })

      const expected = severity === 'error' ? 'danger' : severity
      expect(getByTestId('feedback-message').getAttribute('data-severity')).toBe(expected)
    }
  )

  it('composes the Default story fixture', () => {
    const { getByTestId } = render(Default())

    expect(getByTestId('feedback-message')).toBeTruthy()
    expect(getByTestId('feedback-message__content').textContent).toContain(
      'Your workload finished deploying in 42 seconds.'
    )
  })
})
