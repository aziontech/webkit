import '../../../test/reflow.css'

import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/save-bar/default.vue'
import Docked from '../../../../examples/save-bar/docked.vue'
import Fade from '../../../../examples/save-bar/fade.vue'
import Plain from '../../../../examples/save-bar/plain.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import SaveBar from './save-bar.vue'

describe('SaveBar', () => {
  it('renders a footer with the default testid and the floating kind', () => {
    const { getByTestId } = within(render(SaveBar).container)

    const root = getByTestId('layout-save-bar')
    expect(root.tagName).toBe('FOOTER')
    expect(root.getAttribute('data-kind')).toBe('floating')
  })

  it('honours a consumer data-testid', () => {
    const { getByTestId } = within(
      render(SaveBar, {
        attrs: { 'data-testid': 'profile-save' },
        slots: { default: 'You have unsaved changes.' }
      }).container
    )

    expect(getByTestId('profile-save__message').textContent?.trim()).toBe(
      'You have unsaved changes.'
    )
  })

  it.each(['floating', 'docked', 'plain', 'fade'] as const)(
    'renders the leading slot in place of the icon and sentence (kind=%s)',
    (kind) => {
      const { getByTestId } = within(
        render(SaveBar, {
          props: { kind },
          slots: {
            leading: '<span data-testid="status">Saving…</span>',
            default: 'You have unsaved changes.'
          }
        }).container
      )

      const message = getByTestId('layout-save-bar__message')
      expect(message.contains(getByTestId('status'))).toBe(true)
      expect(message.textContent).not.toContain('You have unsaved changes.')
      expect(message.querySelector('.pi-info-circle')).toBeNull()
    }
  )

  it.each(['floating', 'docked', 'plain', 'fade'] as const)(
    'mirrors kind=%s and renders the actions',
    (kind) => {
      const { getByTestId, getByRole } = within(
        render(SaveBar, {
          props: { kind },
          slots: { actions: '<button type="button">Save</button>' }
        }).container
      )

      expect(getByTestId('layout-save-bar').getAttribute('data-kind')).toBe(kind)
      expect(getByTestId('layout-save-bar__actions').contains(getByRole('button'))).toBe(true)
    }
  )

  it('renders the status message only when the default slot is given', () => {
    const bare = within(render(SaveBar).container)
    expect(bare.queryByTestId('layout-save-bar__message')).toBeNull()

    const withMessage = within(
      render(SaveBar, { slots: { default: 'You have unsaved changes.' } }).container
    )
    expect(withMessage.getByTestId('layout-save-bar__message').textContent?.trim()).toBe(
      'You have unsaved changes.'
    )
  })

  it('renders the examples', () => {
    expect(within(render(Default).container).getByRole('button', { name: 'Save' })).toBeTruthy()
    expect(
      within(render(Docked).container).getByTestId('layout-save-bar').getAttribute('data-kind')
    ).toBe('docked')
    expect(within(render(Plain).container).getByRole('button', { name: 'Cancel' })).toBeTruthy()
  })

  it('has no accessibility violations as a floating bar', async () => {
    await expectNoA11yViolations(render(Default).container)
  })

  it('has no accessibility violations as a plain form footer', async () => {
    await expectNoA11yViolations(render(Plain).container)
  })

  it('has no accessibility violations as a wizard step footer', async () => {
    await expectNoA11yViolations(render(Fade).container)
  })
})

const boxOf = (width: number) => {
  const host = document.createElement('div')
  host.style.width = `${width}px`
  document.body.appendChild(host)
  return host
}

describe('SaveBar in a narrow box', () => {
  const mountIn = (width: number) =>
    render(SaveBar, {
      props: { kind: 'plain' },
      slots: {
        default: 'You have unsaved changes',
        actions: '<button type="button">Discard</button><button type="button">Save</button>'
      },
      container: boxOf(width)
    })

  it('stacks full-width actions under the message', () => {
    const view = mountIn(320)
    const actions = view.getByTestId('layout-save-bar__actions')
    const save = view.getByRole('button', { name: 'Save' })

    expect(getComputedStyle(actions).flexDirection).toBe('column-reverse')
    expect(Math.round(save.getBoundingClientRect().width)).toBe(
      Math.round(actions.getBoundingClientRect().width)
    )
  })

  it('keeps the actions in a row in a wide box', () => {
    const view = mountIn(1024)

    expect(getComputedStyle(view.getByTestId('layout-save-bar__actions')).flexDirection).toBe('row')
  })
})

describe('SaveBar fade in a narrow box', () => {
  it('keeps Back and the action on one row, without a border', () => {
    const view = render(Fade, { container: boxOf(320) })
    const back = view.getByRole('button', { name: 'Back' })
    const next = view.getByRole('button', { name: 'Continue' })
    const root = view.getByTestId('layout-save-bar')

    expect(getComputedStyle(view.getByTestId('layout-save-bar__actions')).flexDirection).toBe('row')
    expect(Math.round(back.getBoundingClientRect().top)).toBe(
      Math.round(next.getBoundingClientRect().top)
    )
    expect(back.getBoundingClientRect().left).toBeLessThan(next.getBoundingClientRect().left)
    expect(getComputedStyle(root).borderTopWidth).toBe('0px')
    expect(getComputedStyle(root).backgroundImage).toContain('gradient')
  })
})
