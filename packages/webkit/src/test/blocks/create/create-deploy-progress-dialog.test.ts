import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import CreateDeployProgressDialog from '../../../../blocks/create/create-deploy-progress-dialog/create-deploy-progress-dialog.vue'
import {
  samplePartialItems,
  sampleRunningItems
} from '../../../../blocks/create/create-deploy-progress-dialog/sample'
import DeployProgressDrop from '../../../../blocks/create/create-deploy-progress-dialog/variants/drop.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }
const visible = { ignore: '[aria-live], script, style' }
describe('create-deploy-progress-dialog', () => {
  it('lets the user hide the dialog while the run goes on and reopen it', async () => {
    render(CreateDeployProgressDialog)
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('list', { name: 'Deployment Settings' })).toBeTruthy()
    const hide = within(dialog).getByRole('button', { name: 'Hide' })
    expect(hide.hasAttribute('disabled')).toBe(false)
    expect(screen.queryByText(/It keeps running if you leave/, visible)).toBeNull()
    await fireEvent.click(hide)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), wait)
    expect(await screen.findByText(/It keeps running if you leave/, visible, wait)).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Show progress' }))
    expect(await screen.findByRole('dialog')).toBeTruthy()
    await waitFor(
      () => expect(screen.queryByText(/It keeps running if you leave/, visible)).toBeNull(),
      wait
    )
  })
  it('renders the run it is given and emits retry with the failed rows', async () => {
    const view = render(CreateDeployProgressDialog, { props: { items: samplePartialItems } })
    const dialog = await screen.findByRole('dialog')
    expect(
      within(dialog).getByRole('heading', { name: 'Deployed 4 of 5 Deployment Settings' })
    ).toBeTruthy()
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Retry failed' }))
    const [event, failed] = view.emitted<unknown[]>('retry')?.[0] ?? []
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
    const view = render(CreateDeployProgressDialog, { props: { items: one } })
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('heading', { name: 'Deploying… 0 of 1 done' })).toBeTruthy()
    expect(within(dialog).queryByText(sampleRunningItems[0].name)).toBeNull()
    await view.rerender({ items: [{ ...one[0], status: 'done' as const }] })
    expect(
      within(dialog).getByRole('heading', { name: 'Deployed 1 Deployment Setting' })
    ).toBeTruthy()
  })

  it('Drop: confirms the dropped folder, then runs it in the progress dialog with no toast while it shows', async () => {
    render(DeployProgressDrop)
    const confirm = await screen.findByRole('dialog', { name: 'New production deployment' })
    expect(within(confirm).getByRole('list', { name: 'Dropped files' })).toBeTruthy()
    expect(screen.queryByText(/It keeps running if you leave/, visible)).toBeNull()
    await fireEvent.click(within(confirm).getByRole('button', { name: 'Deploy to Production' }))
    const progress = await screen.findByRole('dialog', { name: /Deploying… 0 of 2 done/ }, wait)
    expect(within(progress).getByRole('button', { name: 'Hide' })).toBeTruthy()
    expect(screen.queryByText(/It keeps running if you leave/, visible)).toBeNull()
    await fireEvent.click(within(progress).getByRole('button', { name: 'Hide' }))
    expect(await screen.findByText(/It keeps running if you leave/, visible, wait)).toBeTruthy()
  })
})
