import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import SettingsCannedResponses, {
  type CannedResponsesResponse
} from '../../../../blocks/settings/settings-canned-responses/settings-canned-responses.vue'
import Editing from '../../../../blocks/settings/settings-canned-responses/variants/editing.vue'
import NoMatch from '../../../../blocks/settings/settings-canned-responses/variants/no-match.vue'
import SaveError from '../../../../blocks/settings/settings-canned-responses/variants/save-error.vue'
import Saving from '../../../../blocks/settings/settings-canned-responses/variants/saving.vue'
import { expectNoA11yViolations } from '../../axe'

afterEach(() => cleanup())

const dialog = () =>
  document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement | null

const openDialog = () =>
  waitFor(() => {
    expect(dialog()).not.toBeNull()
    return dialog() as HTMLElement
  })

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

const response: CannedResponsesResponse = {
  id: 'cr-1',
  title: 'Password reset sent',
  folder: 'Accounts',
  visibility: 'team',
  body: 'Hi {{ticket.requester.first_name}},\n\nWe sent a reset link.',
  status: 'Solved',
  lastUsedAt: null,
  usageCount: 1200
}

const titles = (root: Element) =>
  Array.from(root.querySelectorAll('[role=cell] span[class*="text-label-sm"]')).map(
    (node) => node.textContent?.trim() ?? ''
  )

describe('settings/settings-canned-responses block', () => {
  it('lists the sample sorted by use, with folder, visibility and counts, without axe violations', async () => {
    const view = render(SettingsCannedResponses)
    await waitFor(() => expect(titles(view.container)[0]).toBe('Welcome and first reply'))
    expect(titles(view.container)).toHaveLength(6)
    expect(view.getByRole('columnheader', { name: /Uses/ })).toBeTruthy()
    expect(view.container.textContent).toContain('No folder')
    expect(view.container.textContent).toContain('Never used')
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('renders the responses it is given, the first-use card for none, and the no-match state', async () => {
    const view = render(SettingsCannedResponses, {
      props: { responses: [response], now: new Date(Date.UTC(2026, 10, 10)) }
    })
    await waitFor(() => expect(titles(view.container)).toEqual(['Password reset sent']))
    expect(view.container.textContent).toContain('1,200')
    view.unmount()
    const empty = render(SettingsCannedResponses, { props: { responses: [] } })
    expect(empty.container.textContent).toContain('No canned responses yet')
    expect(empty.queryByRole('searchbox')).toBeNull()
    empty.unmount()
    const none = render(NoMatch)
    await waitFor(() => expect(none.container.textContent).toContain('No matching responses'))
  })

  it('shows the load error with Retry and emits retry and refresh', async () => {
    const failed = render(SettingsCannedResponses, { props: { error: 'The API answered 503.' } })
    expect(failed.container.textContent).toContain('The API answered 503.')
    expect(failed.container.textContent).not.toContain('Welcome and first reply')
    await fireEvent.click(failed.getByRole('button', { name: 'Retry' }))
    expect(failed.emitted<unknown[]>('retry')).toHaveLength(1)
    failed.unmount()
    const view = render(SettingsCannedResponses)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted<unknown[]>('refresh')).toHaveLength(1)
  })

  it('validates a new response and emits create with a new folder and no status', async () => {
    const view = render(SettingsCannedResponses)
    await fireEvent.click(buttonByText('New response'))
    const drawer = await openDialog()
    expect(within(drawer).getByRole('heading', { name: 'New response' })).toBeTruthy()
    await fireEvent.click(buttonByText('Save response', drawer))
    await waitFor(() => expect(drawer.textContent).toContain('Enter a title.'))
    expect(drawer.textContent).toContain('Write the reply agents insert.')
    await userEvent.type(within(drawer).getByLabelText(/^Title/), 'refund confirmed')
    await fireEvent.click(buttonByText('Save response', drawer))
    await waitFor(() =>
      expect(drawer.textContent).toContain('A response with this title already exists.')
    )
    const title = within(drawer).getByLabelText(/^Title/) as HTMLInputElement
    await userEvent.clear(title)
    await userEvent.type(title, 'Outage update')
    const folder = within(drawer).getByRole('combobox', { name: /^Folder/ }) as HTMLInputElement
    await userEvent.type(folder, 'Incidents')
    await userEvent.keyboard('{Enter}')
    await userEvent.type(within(drawer).getByRole('textbox', { name: /^Reply/ }), 'Fixed.')
    await fireEvent.click(buttonByText('Save response', drawer))
    await waitFor(() => expect(view.emitted<unknown[]>('create')).toHaveLength(1))
    expect(view.emitted<unknown[]>('create')![0][1]).toEqual({
      title: 'Outage update',
      folder: 'Incidents',
      visibility: 'personal',
      body: 'Fixed.',
      status: null
    })
  })

  it('inserts a placeholder at the caret and returns focus to the reply', async () => {
    render(Editing)
    const drawer = await openDialog()
    const body = within(drawer).getByRole('textbox', { name: /^Reply/ }) as HTMLTextAreaElement
    await waitFor(() => expect(body.value).toContain('x-request-id'))
    body.focus()
    body.setSelectionRange(0, 0)
    await fireEvent.click(buttonByText('Insert placeholder', drawer))
    const item = await waitFor(() =>
      within(document.body).getByRole('menuitem', { name: /Ticket number/ })
    )
    await fireEvent.click(item)
    await waitFor(() => expect(body.value.startsWith('{{ticket.id}}Hi ')).toBe(true))
    await waitFor(() => expect(document.activeElement).toBe(body))
    await waitFor(() => expect(body.selectionStart).toBe('{{ticket.id}}'.length))
    expect(document.activeElement).toBe(body)
  })

  it('emits update for an edited response, locks while saving and keeps values on a save error', async () => {
    const view = render(Editing)
    const drawer = await openDialog()
    expect(within(drawer).getByRole('heading', { name: 'Edit response' })).toBeTruthy()
    const title = within(drawer).getByLabelText(/^Title/) as HTMLInputElement
    expect(title.value).toBe('Ask for the request ID')
    await fireEvent.click(buttonByText('Save response', drawer))
    await waitFor(() => expect(view.emitted('update')).toBeUndefined())
    view.unmount()
    render(Saving)
    const locked = await openDialog()
    await waitFor(() =>
      expect(within(locked).getByLabelText(/^Title/) as HTMLInputElement).toBeDisabled()
    )
    cleanup()
    render(SaveError)
    const failed = await openDialog()
    expect(failed.textContent).toContain("The response wasn't saved.")
    expect((within(failed).getByLabelText(/^Title/) as HTMLInputElement).value).toBe(
      'Ask for the request ID'
    )
  })

  it('emits duplicate from the row menu and removes only after confirmation', async () => {
    const view = render(SettingsCannedResponses)
    await fireEvent.click(view.getByRole('button', { name: /Actions for Refund confirmed/ }))
    await fireEvent.click(await waitFor(() => view.getByRole('menuitem', { name: 'Duplicate' })))
    expect(view.emitted<unknown[]>('duplicate')![0][1]).toMatchObject({ id: 'cr-refund' })
    await fireEvent.click(view.getByRole('button', { name: /Actions for Refund confirmed/ }))
    await fireEvent.click(await waitFor(() => view.getByRole('menuitem', { name: 'Delete' })))
    const confirm = await waitFor(() => {
      expect(dialog()?.textContent).toContain('Delete response')
      return dialog() as HTMLElement
    })
    expect(confirm.textContent).toMatch(
      /Agents can no longer insert “\u2068Refund confirmed\u2069”/
    )
    await fireEvent.click(buttonByText('Delete response', confirm))
    await waitFor(() => expect(titles(view.container)).not.toContain('Refund confirmed'))
    const removed = view.emitted<unknown[]>('remove')![0]
    expect(removed[0]).toBeInstanceOf(MouseEvent)
    expect(removed[1]).toMatchObject({ id: 'cr-refund' })
  })
})
