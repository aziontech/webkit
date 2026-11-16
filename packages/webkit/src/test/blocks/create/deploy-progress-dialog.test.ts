import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import DeployProgressDialog from '../../../../blocks/create/deploy-progress-dialog/deploy-progress-dialog.vue'
import {
  samplePartialItems,
  sampleRunningItems
} from '../../../../blocks/create/deploy-progress-dialog/sample'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }
describe('deploy-progress-dialog', () => {
  it('lets the user hide the dialog while the run goes on and reopen it', async () => {
    render(DeployProgressDialog)
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('list', { name: 'Deployment Settings' })).toBeTruthy()
    const hide = within(dialog).getByRole('button', { name: 'Hide' })
    expect(hide.hasAttribute('disabled')).toBe(false)
    await fireEvent.click(hide)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), wait)
    await fireEvent.click(screen.getByRole('button', { name: 'Show progress' }))
    expect(await screen.findByRole('dialog')).toBeTruthy()
  })
  it('renders the run it is given and emits retry with the failed rows', async () => {
    const view = render(DeployProgressDialog, { props: { items: samplePartialItems } })
    const dialog = await screen.findByRole('dialog')
    expect(
      within(dialog).getByRole('heading', { name: 'Deployed 4 of 5 Deployment Settings' })
    ).toBeTruthy()
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Retry failed' }))
    const [event, failed] = view.emitted('retry')?.[0] ?? []
    expect(event).toBeInstanceOf(MouseEvent)
    expect(failed).toEqual(samplePartialItems.filter((item) => item.status === 'failed'))
  })

  it('follows the rows the page passes instead of a timer', async () => {
    const one = [
      {
        id: 'acme',
        name: 'acme-settings',
        environments: 'Production',
        status: 'deploying' as const
      }
    ]
    const view = render(DeployProgressDialog, { props: { items: one } })
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'Deploying 0 of 1…' })).toBeTruthy()
    expect(within(dialog).queryByText(sampleRunningItems[0].name)).toBeNull()
    await view.rerender({ items: [{ ...one[0], status: 'done' as const }] })
    expect(
      within(dialog).getByRole('heading', { name: 'Deployed 1 Deployment Setting' })
    ).toBeTruthy()
  })
})
