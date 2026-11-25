import userEvent from '@testing-library/user-event'
import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import Default from '../../../../examples/confirm-dialog/default.vue'
import SaveOrDiscard from '../../../../examples/confirm-dialog/save-or-discard.vue'
import TypedConfirmation from '../../../../examples/confirm-dialog/typed-confirmation.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ConfirmDialog from './confirm-dialog.vue'

const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

describe('ConfirmDialog', () => {
  it('opens at the medium width by default', async () => {
    const { getByTestId } = within(render(Default).container as HTMLElement)

    await fireEvent.click(getByTestId('confirm-dialog__trigger'))
    await settle()

    expect(document.body.querySelector('[role="alertdialog"] [data-size]')).toHaveAttribute(
      'data-size',
      'medium'
    )
  })

  it('stays closed until the trigger is activated, then teleports the dialog to body', async () => {
    const { getByTestId } = within(render(Default).container as HTMLElement)

    expect(byTestId('confirm-dialog__panel')).toBeNull()

    await fireEvent.click(getByTestId('confirm-dialog__trigger'))
    await settle()

    const dialog = document.body.querySelector<HTMLElement>('[role="alertdialog"]')
    expect(dialog).toBeTruthy()
    expect(
      within(dialog as HTMLElement).getByRole('heading', { name: 'Remove domain' })
    ).toBeTruthy()
    expect(
      within(dialog as HTMLElement).getByRole('button', { name: 'Remove domain' })
    ).toBeTruthy()
  })

  it('renders title, description and the default buttons when open', async () => {
    render(ConfirmDialog, {
      props: { open: true, title: 'Remove domain', description: 'It stops answering.' }
    })
    await settle()

    expect(byTestId('confirm-dialog')).toBeTruthy()
    expect(byTestId('confirm-dialog__cancel')?.textContent?.trim()).toBe('Cancel')
    expect(byTestId('confirm-dialog__confirm')?.textContent?.trim()).toBe('Confirm')
    expect(document.body.textContent).toContain('It stops answering.')
  })

  it('stacks the actions in DOM order on phones, the confirm button last', async () => {
    render(ConfirmDialog, { props: { open: true, title: 'Remove domain' } })
    await settle()

    const actions = byTestId('confirm-dialog__actions')!
    expect(actions.classList.contains('flex-col')).toBe(true)
    expect(actions.classList.contains('flex-col-reverse')).toBe(false)
    const cancel = byTestId('confirm-dialog__cancel')!
    const confirm = byTestId('confirm-dialog__confirm')!
    expect(cancel.compareDocumentPosition(confirm) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
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

    await fireEvent.click(byTestId('confirm-dialog__confirm') as HTMLElement)
    const confirms = emitted()['confirm'] as [Event][]
    expect(confirms).toHaveLength(1)
    expect(confirms[0]![0]).toBeInstanceOf(MouseEvent)

    await fireEvent.click(byTestId('confirm-dialog__cancel') as HTMLElement)
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

    ;(byTestId('confirm-dialog__confirm') as HTMLElement).focus()
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

      await fireEvent.click(byTestId('confirm-dialog__confirm') as HTMLElement)
      expect(emitted()['confirm']).toBeUndefined()
    }
  )

  it('locks Cancel and Escape while loading, then releases them', async () => {
    const { emitted, rerender } = render(ConfirmDialog, {
      props: { open: true, title: 'Delete resource', loading: true }
    })
    await settle()

    const cancel = byTestId('confirm-dialog__cancel') as HTMLButtonElement
    expect(cancel.disabled).toBe(true)
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(emitted()['update:open']).toBeUndefined()
    expect(emitted()['cancel']).toBeUndefined()

    await rerender({ loading: false })
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(emitted()['update:open']).toContainEqual([false])
  })

  it('opens with focus on Cancel, the least destructive action, and shows no close button', async () => {
    render(ConfirmDialog, { props: { open: true, title: 'Delete resource' } })
    await settle()
    await vi.waitFor(() => expect(document.activeElement).toBe(byTestId('confirm-dialog__cancel')))
    expect(byTestId('confirm-dialog__close')).toBeNull()
  })

  it('replaces the buttons with the actions slot', async () => {
    const { getByTestId } = within(render(SaveOrDiscard).container as HTMLElement)

    await fireEvent.click(getByTestId('confirm-dialog__trigger'))
    await settle()

    const dialog = document.body.querySelector<HTMLElement>('[role="alertdialog"]') as HTMLElement
    expect(within(dialog).getByRole('button', { name: 'Save changes' })).toBeTruthy()
    expect(byTestId('confirm-dialog__confirm')).toBeNull()
  })

  it('has no accessibility violations when open', async () => {
    render(ConfirmDialog, {
      props: { open: true, title: 'Remove domain', description: 'It stops answering.' }
    })
    await settle()

    await expectNoA11yViolations(document.body.querySelector('[role="alertdialog"]') as HTMLElement)
  })

  it('does not emit confirm while disabled', async () => {
    const { emitted } = render(ConfirmDialog, {
      props: { open: true, title: 'Type the name first', disabled: true }
    })
    await settle()
    await fireEvent.click(byTestId('confirm-dialog__confirm')!)
    expect(emitted()['confirm']).toBeUndefined()
  })

  it('round-trips a controlled v-model:open from the parent', async () => {
    const open = ref(false)
    render(
      defineComponent({
        components: { ConfirmDialog },
        setup: () => ({ open }),
        template: `<ConfirmDialog v-model:open="open" title="Remove domain" />`
      })
    )
    await settle()
    expect(document.body.querySelector('[role="alertdialog"]')).toBeNull()
    open.value = true
    await settle()
    expect(document.body.querySelector('[role="alertdialog"]')).not.toBeNull()
    await fireEvent.click(byTestId('confirm-dialog__cancel')!)
    await settle()
    expect(open.value).toBe(false)
  })

  it('opens at defaultOpen when uncontrolled, as an alertdialog', async () => {
    render(ConfirmDialog, { props: { defaultOpen: true, title: 'Remove domain' } })
    await settle()
    const panel = byTestId('confirm-dialog__panel')
    expect(panel?.getAttribute('role')).toBe('alertdialog')
  })

  describe('typed confirmation', () => {
    const phraseProps = {
      open: true,
      title: 'Delete application',
      confirmLabel: 'Delete application',
      confirmationPhrase: 'acme-store'
    }

    it('labels the field with the phrase and focuses it on open', async () => {
      const { getByTestId } = within(render(TypedConfirmation).container as HTMLElement)
      await userEvent.click(getByTestId('confirm-dialog__trigger'))
      await settle()
      await vi.waitFor(() =>
        expect(document.activeElement).toBe(byTestId('confirm-dialog__phrase'))
      )
      const field = byTestId('confirm-dialog__phrase') as HTMLInputElement
      const label = document.getElementById(field.getAttribute('aria-labelledby') ?? '')
      expect(label?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Type acme-store to confirm.')
      expect(field.getAttribute('autocapitalize')).toBe('off')
      expect(field.getAttribute('autocorrect')).toBe('off')
      expect(field.getAttribute('spellcheck')).toBe('false')
      await expectNoA11yViolations(document.body)
    })

    it('keeps confirm disabled until the exact, case-sensitive phrase is typed', async () => {
      const onConfirm = vi.fn()
      render(ConfirmDialog, { props: { ...phraseProps, onConfirm } })
      await settle()
      const field = byTestId('confirm-dialog__phrase') as HTMLInputElement
      const confirm = byTestId('confirm-dialog__confirm') as HTMLButtonElement

      expect(confirm).toBeDisabled()
      await userEvent.type(field, 'Acme-Store')
      expect(confirm).toBeDisabled()
      await userEvent.click(confirm)
      expect(onConfirm).not.toHaveBeenCalled()

      await userEvent.clear(field)
      await userEvent.type(field, ' acme-store ')
      expect(confirm).toBeEnabled()
      await userEvent.click(confirm)
      expect(onConfirm).toHaveBeenCalledTimes(1)
      expect(onConfirm.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent)
    })

    it('confirms on Enter in the field only once the phrase matches', async () => {
      const onConfirm = vi.fn()
      render(ConfirmDialog, { props: { ...phraseProps, onConfirm } })
      await settle()
      const field = byTestId('confirm-dialog__phrase') as HTMLInputElement

      await userEvent.type(field, 'acme{Enter}')
      expect(onConfirm).not.toHaveBeenCalled()
      await userEvent.type(field, '-store{Enter}')
      expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('empties the field every time the dialog opens', async () => {
      const { rerender } = render(ConfirmDialog, { props: phraseProps })
      await settle()
      await userEvent.type(byTestId('confirm-dialog__phrase') as HTMLInputElement, 'acme-store')
      await rerender({ ...phraseProps, open: false })
      await settle()
      await rerender({ ...phraseProps, open: true })
      await settle()
      expect((byTestId('confirm-dialog__phrase') as HTMLInputElement).value).toBe('')
      expect(byTestId('confirm-dialog__confirm')).toBeDisabled()
    })
  })
})
