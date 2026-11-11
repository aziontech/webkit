import '../../../test/reflow.css'

import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

import Default from '../../../../examples/alert/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Alert from './alert.vue'

// @testing-library/vue mounts through @vue/test-utils, which stubs <Transition>
// by default. The stub skips the JS transition lifecycle, so the component's
// `@after-leave` (which emits `close`) never fires. Rendering the REAL transition
// lets the browser run the fade-out and fire `@after-leave` as it does in production.
const realTransition = { global: { stubs: { transition: false } } }

describe('Alert', () => {
  describe('flow content', () => {
    it('keeps a list inside the copy region once the server markup is parsed as HTML', async () => {
      // A p cannot hold a list: the HTML parser closes it at the ul, which then lands
      // beside the copy in the flex row and squeezes the text to zero width. Client
      // rendering never shows this (Vue builds the DOM node by node), so the assertion
      // goes through server-rendered markup parsed the way a browser parses a page.
      const app = createSSRApp({
        render: () =>
          h(Alert, { severity: 'info' }, () => [
            h('p', 'Take the following actions:'),
            h('ul', [h('li', 'Migrate the certificate.'), h('li', 'Update the device CAs.')])
          ])
      })
      const html = await renderToString(app)
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const content = doc.querySelector('[data-testid="feedback-alert__content"]')

      expect(content).not.toBeNull()
      expect(content?.querySelector('ul')).not.toBeNull()
      expect(content?.querySelectorAll('li')).toHaveLength(2)
    })
  })

  it('renders the root with the default testid, status role, and the label copy', () => {
    const { getByTestId } = render(Alert, {
      props: { severity: 'info', label: 'Deployment finished.' }
    })

    const root = getByTestId('feedback-alert')
    expect(root).toBeTruthy()
    expect(root.getAttribute('role')).toBe('status')
    expect(root.getAttribute('data-severity')).toBe('info')
    expect(getByTestId('feedback-alert__content').textContent).toContain('Deployment finished.')
  })

  it('lets a consumer data-testid win over the derived fallback', () => {
    const { getByTestId, queryByTestId } = render(Alert, {
      props: { label: 'Custom testid' },
      attrs: { 'data-testid': 'my-banner' }
    })

    expect(getByTestId('my-banner')).toBeTruthy()
    expect(queryByTestId('feedback-alert')).toBeNull()
  })

  it('renders the content region even when label is empty', () => {
    const { getByTestId } = render(Alert, { props: {} })

    expect(getByTestId('feedback-alert__content').textContent?.trim()).toBe('')
  })

  describe('size', () => {
    it('defaults to medium on the root and the content region', () => {
      const { getByTestId } = render(Alert, { props: { label: 'Default size' } })

      expect(getByTestId('feedback-alert').getAttribute('data-size')).toBe('medium')
      expect(getByTestId('feedback-alert__content').getAttribute('data-size')).toBe('medium')
    })

    it.each(['small', 'medium'] as const)('maps size=%s onto data-size', (size) => {
      const { getByTestId } = render(Alert, { props: { size, label: `Size ${size}` } })

      expect(getByTestId('feedback-alert').getAttribute('data-size')).toBe(size)
      expect(getByTestId('feedback-alert__content').getAttribute('data-size')).toBe(size)
    })
  })

  describe('trailing-control flag', () => {
    it('is absent when the banner carries no action or close control', () => {
      const { getByTestId } = render(Alert, { props: { label: 'Bare' } })

      expect(getByTestId('feedback-alert').hasAttribute('data-trailing')).toBe(false)
    })

    it.each([
      ['actionLabel', { label: 'x', actionLabel: 'Retry' }],
      ['closable', { label: 'x', closable: true }]
    ])('is set when %s is provided', (_name, props) => {
      const { getByTestId } = render(Alert, { props })

      expect(getByTestId('feedback-alert').hasAttribute('data-trailing')).toBe(true)
    })

    it('is set when the action slot is filled', () => {
      const { getByTestId } = render(Alert, {
        props: { label: 'x' },
        slots: { action: '<button type="button">Go</button>' }
      })

      expect(getByTestId('feedback-alert').hasAttribute('data-trailing')).toBe(true)
    })
  })

  it('renders severity="danger" with the alert role', () => {
    const { getByTestId } = render(Alert, {
      props: { severity: 'danger', label: 'Boom' }
    })

    const root = getByTestId('feedback-alert')
    expect(root.getAttribute('data-severity')).toBe('danger')
    expect(root.getAttribute('role')).toBe('alert')
  })

  it('uses the alert role for warning severity', () => {
    const { getByTestId } = render(Alert, {
      props: { severity: 'warning', label: 'Careful' }
    })

    const root = getByTestId('feedback-alert')
    expect(root.getAttribute('data-severity')).toBe('warning')
    expect(root.getAttribute('role')).toBe('alert')
  })

  it('renders the leading icon on every severity, and applies an icon override', () => {
    const { getByTestId } = render(Alert, {
      props: { label: 'With icon', icon: 'pi pi-star' }
    })

    const glyph = getByTestId('feedback-alert').querySelector('i')
    expect(glyph).toBeTruthy()
    expect(glyph?.className).toContain('pi-star')
    expect(glyph?.getAttribute('aria-hidden')).toBe('true')
  })

  describe('message content', () => {
    it('renders default-slot content in place of the label', () => {
      const { getByTestId } = render(Alert, {
        props: { label: 'Ignored label' },
        slots: { default: 'Slot copy' }
      })

      const content = getByTestId('feedback-alert__content')
      expect(content.textContent).toContain('Slot copy')
      expect(content.textContent).not.toContain('Ignored label')
    })

    it('keeps the leading icon when the default slot is used', () => {
      const { getByTestId } = render(Alert, {
        slots: { default: 'Slot copy' }
      })

      expect(getByTestId('feedback-alert').querySelector('i')).toBeTruthy()
    })

    it('renders inline anchors from the default slot as real, focusable links', async () => {
      const { getByTestId } = render(Alert, {
        props: { severity: 'warning' },
        slots: {
          default: 'Close to the limit. <a href="/billing">Upgrade the plan</a> to continue.'
        }
      })

      const content = getByTestId('feedback-alert__content')
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
    // It is verified by the styled visual suite (visual/) per src/test/setup.ts.
  })

  describe('action button', () => {
    it('renders the action button when actionLabel is set and emits "action" with the click event on click', async () => {
      const { getByTestId, emitted } = render(Alert, {
        props: { label: 'Has action', actionLabel: 'Retry' }
      })

      const action = getByTestId('feedback-alert__action')
      expect(action.textContent).toContain('Retry')

      await fireEvent.click(action)

      expect(emitted('action')).toHaveLength(1)
      // Payload is the native MouseEvent forwarded from the button click.
      expect(emitted('action')[0][0]).toBeInstanceOf(Event)
    })

    it('does not render the action button when actionLabel is empty', () => {
      const { queryByTestId } = render(Alert, {
        props: { label: 'No action' }
      })

      expect(queryByTestId('feedback-alert__action')).toBeNull()
    })

    it('replaces the built-in button with the action slot', () => {
      const { getByText, queryByTestId } = render(Alert, {
        props: { label: 'Custom action', actionLabel: 'Ignored' },
        slots: { action: '<button type="button">Do it</button>' }
      })

      expect(getByText('Do it')).toBeTruthy()
      expect(queryByTestId('feedback-alert__action')).toBeNull()
    })
  })

  describe('close / dismiss', () => {
    it('renders a close control when closable and emits "close" after the dismiss click', async () => {
      const { getByTestId, queryByTestId, emitted } = render(Alert, {
        props: { label: 'Dismiss me', closable: true },
        ...realTransition
      })

      const close = getByTestId('feedback-alert__close')
      expect(close).toBeTruthy()

      await fireEvent.click(close)

      // "close" is emitted after the leave transition completes (@after-leave).
      await waitFor(() => {
        expect(emitted('close')).toHaveLength(1)
      })
      // Once dismissed and unmounted, the root is gone.
      await waitFor(() => {
        expect(queryByTestId('feedback-alert')).toBeNull()
      })
    })

    it('does not render a close control when not closable', () => {
      const { queryByTestId } = render(Alert, {
        props: { label: 'Persistent' }
      })

      expect(queryByTestId('feedback-alert__close')).toBeNull()
    })

    it('dismisses on Escape when closable, emitting "close"', async () => {
      const { getByTestId, emitted } = render(Alert, {
        props: { label: 'Escapable', closable: true },
        ...realTransition
      })

      const root = getByTestId('feedback-alert')
      await fireEvent.keyDown(root, { key: 'Escape' })

      await waitFor(() => {
        expect(emitted('close')).toHaveLength(1)
      })
    })

    it('does not dismiss on Escape when not closable', async () => {
      const { getByTestId, emitted } = render(Alert, {
        props: { label: 'No escape' }
      })

      const root = getByTestId('feedback-alert')
      await fireEvent.keyDown(root, { key: 'Escape' })

      // Give any pending transition a chance; the component must stay mounted and silent.
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(emitted('close')).toBeUndefined()
      expect(getByTestId('feedback-alert')).toBeTruthy()
    })

    it('auto-dismisses once life expires', async () => {
      const { emitted } = render(Alert, {
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
      const { container } = render(Alert, {
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
      const { container } = render(Alert, {
        props: { severity: 'danger', label: 'The last deploy failed before reaching the edge.' }
      })

      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for copy carrying inline links', async () => {
      const { container } = render(Alert, {
        props: { severity: 'warning' },
        slots: {
          default:
            'This workload is close to its request limit. Review the <a href="/billing/usage">usage report</a> to avoid throttling.'
        }
      })

      await expectNoA11yViolations(container)
    })
  })

  it.each(['info', 'success', 'warning', 'danger'] as const)(
    'renders severity=%s with a data-severity attribute',
    (severity) => {
      const { getByTestId } = render(Alert, {
        props: { severity, label: `Severity ${severity}` }
      })

      expect(getByTestId('feedback-alert').getAttribute('data-severity')).toBe(severity)
    }
  )

  it('composes the Default story fixture', () => {
    const { getByTestId } = render(Default)

    expect(getByTestId('feedback-alert')).toBeTruthy()
    expect(getByTestId('feedback-alert__content').textContent).toContain(
      'Your workload finished deploying in 42 seconds.'
    )
  })
})

const boxOf = (width: number) => {
  const host = document.createElement('div')
  host.style.width = `${width}px`
  document.body.appendChild(host)
  return host
}

describe('Alert in a narrow box', () => {
  const mountIn = (width: number) =>
    render(Alert, {
      props: { label: 'The certificate expires in 3 days.', actionLabel: 'Renew', closable: true },
      container: boxOf(width)
    })

  it('moves the action to its own line under the message', () => {
    const view = mountIn(320)
    const action = view.getByRole('button', { name: 'Renew' })
    const close = view.getByRole('button', { name: 'Close message' })

    expect(action.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      close.getBoundingClientRect().bottom
    )
  })

  it('keeps the action on the message line in a wide box', () => {
    const view = mountIn(900)
    const action = view.getByRole('button', { name: 'Renew' })
    const close = view.getByRole('button', { name: 'Close message' })

    expect(action.getBoundingClientRect().top).toBeLessThan(close.getBoundingClientRect().bottom)
  })

  it('renders no action wrapper without an action', () => {
    const view = render(Alert, { props: { label: 'Saved.' } })

    expect(view.container.querySelector('[data-slot="alert-action"]')).toBeNull()
  })
})
