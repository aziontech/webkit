import userEvent from '@testing-library/user-event'
import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import Default from '../../../../examples/confirm-dialog/default.vue'
import SaveOrDiscard from '../../../../examples/confirm-dialog/save-or-discard.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ConfirmDialog from './confirm-dialog.vue'

const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

describe('ConfirmDialog', () => {
  it('stays closed until the trigger is activated, then teleports the dialog to body', async () => {
    const { getByTestId } = within(render(Default).container)

    expect(byTestId('overlay-confirm-dialog__panel')).toBeNull()

    await fireEvent.click(getByTestId('overlay-confirm-dialog__trigger'))
    await settle()

    const dialog = document.body.querySelector<HTMLElement>('[role="dialog"]')
    expect(dialog).toBeTruthy()
    expect(within(dialog as HTMLElement).getByText('Remove domain')).toBeTruthy()
    expect(
      within(dialog as HTMLElement).getByRole('button', { name: 'Remove Domain' })
    ).toBeTruthy()
  })

  it('renders title, description and the default buttons when open', async () => {
    render(ConfirmDialog, {
      props: { open: true, title: 'Remove domain', description: 'It stops answering.' }
    })
    await settle()

    expect(byTestId('overlay-confirm-dialog')).toBeTruthy()
    expect(byTestId('overlay-confirm-dialog__cancel')?.textContent?.trim()).toBe('Cancel')
    expect(byTestId('overlay-confirm-dialog__confirm')?.textContent?.trim()).toBe('Confirm')
    expect(document.body.textContent).toContain('It stops answering.')
  })

  it('honours a consumer data-testid', async () => {
    render(ConfirmDialog, {
      props: { open: true, title: 'Remove domain' },
      attrs: { 'data-testid': 'remove-domain' }
    })
    await settle()

    expect(byTestId('remove-domain__confirm')).toBeTruthy()
  })

  it('emits confirm on the confirm button and cancel plus update:open on cancel', async () => {
    const { emitted } = render(ConfirmDialog, {
      props: { open: true, title: 'Remove domain', confirmLabel: 'Remove' }
    })
    await settle()

    await fireEvent.click(byTestId('overlay-confirm-dialog__confirm') as HTMLElement)
    const confirms = emitted()['confirm'] as [Event][]
    expect(confirms).toHaveLength(1)
    expect(confirms[0]![0]).toBeInstanceOf(MouseEvent)

    await fireEvent.click(byTestId('overlay-confirm-dialog__cancel') as HTMLElement)
    const cancels = emitted()['cancel'] as [Event][]
    expect(cancels).toHaveLength(1)
    expect(cancels[0]![0]).toBeInstanceOf(MouseEvent)
    expect(emitted()['update:open']).toContainEqual([false])
  })

  it('emits confirm with the event first when the confirm button is activated with Enter', async () => {
    const user = userEvent.setup()
    const { emitted } = render(ConfirmDialog, {
      props: { open: true, title: 'Remove domain', confirmLabel: 'Remove' }
    })
    await settle()

    ;(byTestId('overlay-confirm-dialog__confirm') as HTMLElement).focus()
    await user.keyboard('{Enter}')
    const confirms = emitted()['confirm'] as [Event][]
    expect(confirms).toHaveLength(1)
    expect(confirms[0]![0]).toBeInstanceOf(Event)
  })

  it.each([{ disabled: true }, { loading: true }])(
    'does not emit confirm when %o',
    async (state) => {
      const { emitted } = render(ConfirmDialog, {
        props: { open: true, title: 'Delete resource', ...state }
      })
      await settle()

      await fireEvent.click(byTestId('overlay-confirm-dialog__confirm') as HTMLElement)
      expect(emitted()['confirm']).toBeUndefined()
    }
  )

  it('locks Cancel, the close button and Escape while loading, then releases them', async () => {
    const { emitted, rerender } = render(ConfirmDialog, {
      props: { open: true, title: 'Delete resource', loading: true }
    })
    await settle()

    const cancel = byTestId('overlay-confirm-dialog__cancel') as HTMLButtonElement
    expect(cancel.disabled).toBe(true)
    await fireEvent.click(byTestId('overlay-confirm-dialog__close') as HTMLElement)
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(emitted()['update:open']).toBeUndefined()
    expect(emitted()['cancel']).toBeUndefined()

    await rerender({ loading: false })
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(emitted()['update:open']).toContainEqual([false])
  })

  it('stacks the confirm button above Cancel below md', async () => {
    render(ConfirmDialog, { props: { open: true, title: 'Remove domain' } })
    await settle()
    const actions = byTestId('overlay-confirm-dialog__actions') as HTMLElement
    expect(actions.className).toContain('flex-col-reverse')
  })

  it('replaces the buttons with the actions slot', async () => {
    const { getByTestId } = within(render(SaveOrDiscard).container)

    await fireEvent.click(getByTestId('overlay-confirm-dialog__trigger'))
    await settle()

    const dialog = document.body.querySelector<HTMLElement>('[role="dialog"]') as HTMLElement
    expect(within(dialog).getByRole('button', { name: 'Save changes' })).toBeTruthy()
    expect(byTestId('overlay-confirm-dialog__confirm')).toBeNull()
  })

  it('has no accessibility violations when open', async () => {
    render(ConfirmDialog, {
      props: { open: true, title: 'Remove domain', description: 'It stops answering.' }
    })
    await settle()

    await expectNoA11yViolations(document.body.querySelector('[role="dialog"]') as HTMLElement)
  })
})
