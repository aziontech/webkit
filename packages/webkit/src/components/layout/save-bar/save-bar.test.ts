import '../../../test/reflow.css'

import { render, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import Centered from '../../../../examples/save-bar/centered.vue'
import Default from '../../../../examples/save-bar/default.vue'
import Docked from '../../../../examples/save-bar/docked.vue'
import Fade from '../../../../examples/save-bar/fade.vue'
import Plain from '../../../../examples/save-bar/plain.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import SaveBar from './save-bar.vue'

describe('SaveBar', () => {
  it('renders a footer with the default testid and the floating variant', () => {
    const { getByTestId } = within(render(SaveBar).container)

    const root = getByTestId('save-bar')
    expect(root.tagName).toBe('FOOTER')
    expect(root.getAttribute('data-variant')).toBe('floating')
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

  it.each(['floating', 'docked', 'plain', 'fade', 'centered'] as const)(
    'renders the leading slot in place of the icon and sentence (variant=%s)',
    (variant) => {
      const { getByTestId } = within(
        render(SaveBar, {
          props: { variant: variant },
          slots: {
            leading: '<span data-testid="status">Saving…</span>',
            default: 'You have unsaved changes.'
          }
        }).container
      )

      const message = getByTestId('save-bar__message')
      expect(message.contains(getByTestId('status'))).toBe(true)
      expect(message.textContent).not.toContain('You have unsaved changes.')
      expect(message.querySelector('.ai-circle-info')).toBeNull()
    }
  )

  it.each(['floating', 'docked', 'plain', 'fade', 'centered'] as const)(
    'mirrors variant=%s and renders the actions',
    (variant) => {
      const { getByTestId, getByRole } = within(
        render(SaveBar, {
          props: { variant: variant },
          slots: { actions: '<button type="button">Save</button>' }
        }).container
      )

      expect(getByTestId('save-bar').getAttribute('data-variant')).toBe(variant)
      expect(getByTestId('save-bar__actions').contains(getByRole('button'))).toBe(true)
    }
  )

  it('renders the status message only when the default slot is given', () => {
    const bare = within(render(SaveBar).container)
    expect(bare.queryByTestId('save-bar__message')).toBeNull()

    const withMessage = within(
      render(SaveBar, { slots: { default: 'You have unsaved changes.' } }).container
    )
    expect(withMessage.getByTestId('save-bar__message').textContent?.trim()).toBe(
      'You have unsaved changes.'
    )
  })

  it.each(['floating', 'docked', 'plain', 'fade', 'centered'] as const)(
    'announces the status sentence through a polite live region (%s)',
    (variant) => {
      const { getByRole } = render(SaveBar, {
        props: { variant: variant },
        slots: {
          default: 'You have unsaved changes',
          actions: '<button type="button">Save</button>'
        }
      })
      expect(getByRole('status').textContent).toContain('You have unsaved changes')
    }
  )

  it('renders the examples', () => {
    expect(within(render(Default).container).getByRole('button', { name: 'Save' })).toBeTruthy()
    expect(
      within(render(Docked).container).getByTestId('save-bar').getAttribute('data-variant')
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

  it('puts Cancel and Create, in reading order, inside the centered card', () => {
    const view = within(render(Centered).container)
    const card = view.getByTestId('save-bar__card')
    const buttons = within(card).getAllByRole('button')

    expect(view.getByTestId('save-bar').getAttribute('data-variant')).toBe('centered')
    expect(buttons.map((button) => button.textContent?.trim())).toEqual(['Cancel', 'Create'])
    expect(view.queryByTestId('save-bar__message')).toBeNull()
  })

  it('renders the status sentence inside the centered card when given', () => {
    const view = within(
      render(SaveBar, {
        props: { variant: 'centered' },
        slots: {
          default: '3 permissions selected',
          actions: '<button type="button">Create</button>'
        }
      }).container
    )

    expect(view.getByTestId('save-bar__card').contains(view.getByTestId('save-bar__message'))).toBe(
      true
    )
  })

  it('has no accessibility violations as a create page footer', async () => {
    await expectNoA11yViolations(render(Centered).container)
  })

  const boxOf = (width: number) => {
    const host = document.createElement('div')
    host.style.width = `${width}px`
    document.body.appendChild(host)
    return host
  }

  describe('in a narrow box', () => {
    const mountIn = (width: number) =>
      render(SaveBar, {
        props: { variant: 'plain' },
        slots: {
          default: 'You have unsaved changes',
          actions: '<button type="button">Discard</button><button type="button">Save</button>'
        },
        container: boxOf(width)
      })

    it('stacks full-width actions under the message', () => {
      const view = mountIn(320)
      const actions = view.getByTestId('save-bar__actions')
      const save = view.getByRole('button', { name: 'Save' })

      expect(getComputedStyle(actions).flexDirection).toBe('column-reverse')
      expect(Math.round(save.getBoundingClientRect().width)).toBe(
        Math.round(actions.getBoundingClientRect().width)
      )
    })

    it('keeps the actions in a row in a wide box', () => {
      const view = mountIn(1024)

      expect(getComputedStyle(view.getByTestId('save-bar__actions')).flexDirection).toBe('row')
    })
  })

  describe('fade in a narrow box', () => {
    it('keeps Back and the action on one row, without a border', () => {
      const view = render(Fade, { container: boxOf(320) })
      const back = view.getByRole('button', { name: 'Back' })
      const next = view.getByRole('button', { name: 'Continue' })
      const root = view.getByTestId('save-bar')

      expect(getComputedStyle(view.getByTestId('save-bar__actions')).flexDirection).toBe('row')
      expect(Math.round(back.getBoundingClientRect().top)).toBe(
        Math.round(next.getBoundingClientRect().top)
      )
      expect(back.getBoundingClientRect().left).toBeLessThan(next.getBoundingClientRect().left)
      expect(getComputedStyle(root).borderTopWidth).toBe('0px')
      expect(getComputedStyle(root).backgroundImage).toContain('gradient')
    })
  })

  describe('floating inset', () => {
    const documentStyle = () => document.documentElement.style
    const inset = () => documentStyle().getPropertyValue('--save-bar-inset')
    const toastOffset = () => documentStyle().getPropertyValue('--toast-offset-bottom')

    it('publishes its height on the document root while mounted and clears it on unmount', async () => {
      const view = render(SaveBar, { slots: { default: 'You have unsaved changes.' } })

      await vi.waitFor(() => expect(inset()).toMatch(/^[1-9]\d*px$/))
      expect(toastOffset()).toBe(inset())

      view.unmount()
      expect(inset()).toBe('')
      expect(toastOffset()).toBe('')
    })

    it.each(['docked', 'plain', 'fade', 'centered'] as const)(
      'publishes nothing for variant=%s',
      async (variant) => {
        const view = render(SaveBar, {
          props: { variant: variant },
          slots: { default: 'You have unsaved changes.' }
        })
        await nextTick()
        await nextTick()

        expect(inset()).toBe('')
        expect(toastOffset()).toBe('')
        view.unmount()
      }
    )

    it('clears the inset when the variant changes away from floating', async () => {
      const view = render(SaveBar, { slots: { default: 'You have unsaved changes.' } })
      await vi.waitFor(() => expect(inset()).not.toBe(''))

      await view.rerender({ variant: 'docked' })
      await nextTick()

      expect(inset()).toBe('')
      expect(toastOffset()).toBe('')
      view.unmount()
    })

    it('reserves scroll room when it would cover the end of a scroll region', async () => {
      const shown = ref(true)
      const host = document.createElement('div')
      host.style.cssText = 'height: 200px; overflow-y: auto'
      document.body.appendChild(host)
      const view = render(
        {
          components: { SaveBar },
          setup: () => ({ shown }),
          template:
            '<div><div style="height: 600px">Form</div><SaveBar v-if="shown">You have unsaved changes.</SaveBar></div>'
        },
        { container: host }
      )
      const root = view.getByTestId('save-bar')

      await vi.waitFor(() => expect(root.style.height).toMatch(/^[1-9]\d*px$/))
      expect(root.style.height).toBe(inset())

      shown.value = false
      await nextTick()
      expect(inset()).toBe('')
      view.unmount()
      host.remove()
    })
  })
})
