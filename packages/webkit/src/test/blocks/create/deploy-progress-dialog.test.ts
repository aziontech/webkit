import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import DeployProgressDialog from '../../../../blocks/create/deploy-progress-dialog/deploy-progress-dialog.vue'
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
})
