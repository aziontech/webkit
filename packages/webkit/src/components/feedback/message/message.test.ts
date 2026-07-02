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
  it('renders the root with the default testid, status role, and title/description', () => {
    const { getByTestId } = render(Message, {
      props: { severity: 'info', title: 'Info title', description: 'Some details' }
    })

    const root = getByTestId('feedback-message')
    expect(root).toBeTruthy()
    expect(root.getAttribute('role')).toBe('status')
    expect(root.getAttribute('data-severity')).toBe('info')
    expect(getByTestId('feedback-message__title').textContent).toContain('Info title')
    expect(getByTestId('feedback-message__description').textContent).toContain('Some details')
  })

  it('omits the description node when description is empty', () => {
    const { queryByTestId } = render(Message, {
      props: { title: 'Only a title' }
    })

    expect(queryByTestId('feedback-message__title')).toBeTruthy()
    expect(queryByTestId('feedback-message__description')).toBeNull()
  })

  it('normalizes severity="error" to danger and uses the alert role', () => {
    const { getByTestId } = render(Message, {
      props: { severity: 'error', title: 'Boom' }
    })

    const root = getByTestId('feedback-message')
    expect(root.getAttribute('data-severity')).toBe('danger')
    expect(root.getAttribute('role')).toBe('alert')
  })

  it('uses the alert role for warning severity', () => {
    const { getByTestId } = render(Message, {
      props: { severity: 'warning', title: 'Careful' }
    })

    const root = getByTestId('feedback-message')
    expect(root.getAttribute('data-severity')).toBe('warning')
    expect(root.getAttribute('role')).toBe('alert')
  })

  it('applies an icon override on the leading glyph', () => {
    const { getByTestId } = render(Message, {
      props: { title: 'With icon', icon: 'pi pi-star' }
    })

    const glyph = getByTestId('feedback-message').querySelector('i')
    expect(glyph).toBeTruthy()
    expect(glyph?.className).toContain('pi-star')
    expect(glyph?.getAttribute('aria-hidden')).toBe('true')
  })

  describe('action button', () => {
    it('renders the action button when actionLabel is set and emits "action" with the click event on click', async () => {
      const { getByTestId, emitted } = render(Message, {
        props: { title: 'Has action', actionLabel: 'Retry' }
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
        props: { title: 'No action' }
      })

      expect(queryByTestId('feedback-message__action')).toBeNull()
    })
  })

  describe('close / dismiss', () => {
    it('renders a close control when closable and emits "close" after the dismiss click', async () => {
      const { getByTestId, queryByTestId, emitted } = render(Message, {
        props: { title: 'Dismiss me', closable: true },
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
        props: { title: 'Persistent' }
      })

      expect(queryByTestId('feedback-message__close')).toBeNull()
    })

    it('dismisses on Escape when closable, emitting "close"', async () => {
      const { getByTestId, emitted } = render(Message, {
        props: { title: 'Escapable', closable: true },
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
        props: { title: 'No escape' }
      })

      const root = getByTestId('feedback-message')
      await fireEvent.keyDown(root, { key: 'Escape' })

      // Give any pending transition a chance; the component must stay mounted and silent.
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(emitted('close')).toBeUndefined()
      expect(getByTestId('feedback-message')).toBeTruthy()
    })
  })

  it('renders default-slot content in place of the title/description block', () => {
    const { getByText, queryByTestId } = render(Message, {
      props: { title: 'Ignored title', description: 'Ignored description' },
      slots: { default: 'Custom slot body' }
    })

    expect(getByText('Custom slot body')).toBeTruthy()
    expect(queryByTestId('feedback-message__title')).toBeNull()
    expect(queryByTestId('feedback-message__description')).toBeNull()
  })

  describe('accessibility', () => {
    it('has no a11y violations for the default status message', async () => {
      const { container } = render(Message, {
        props: {
          severity: 'info',
          title: 'Accessible info',
          description: 'A brief description of the message.',
          actionLabel: 'Label',
          closable: true
        }
      })

      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for the danger alert variant', async () => {
      const { container } = render(Message, {
        props: {
          severity: 'danger',
          title: 'Accessible alert',
          description: 'Something went wrong.'
        }
      })

      await expectNoA11yViolations(container)
    })
  })

  it.each(['info', 'success', 'warning', 'danger', 'error'] as const)(
    'renders severity=%s with a data-severity attribute',
    (severity) => {
      const { getByTestId } = render(Message, {
        props: { severity, title: `Severity ${severity}` }
      })

      const expected = severity === 'error' ? 'danger' : severity
      expect(getByTestId('feedback-message').getAttribute('data-severity')).toBe(expected)
    }
  )

  it('composes the Default story fixture', () => {
    const { getByTestId } = render(Default())

    expect(getByTestId('feedback-message')).toBeTruthy()
    expect(getByTestId('feedback-message__title').textContent).toContain('Info message')
  })
})
