import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import DeleteWithConfirmation from '../../../../blocks/edit/delete-dialog/delete-dialog.vue'
import DeleteFailed from '../../../../blocks/edit/delete-dialog/variants/error.vue'

afterEach(() => cleanup())
describe('edit/delete-dialog', () => {
  const confirmPanel = () =>
    waitFor(() => {
      const found = Array.from(document.querySelectorAll('[role="alertdialog"]')).find((el) =>
        el.textContent?.includes('to confirm.')
      )
      expect(found).toBeTruthy()
      return found as HTMLElement
    })

  it('locks the dialog while Delete runs, then closes it', async () => {
    const view = render(DeleteWithConfirmation)
    await userEvent.click(view.getByRole('button', { name: 'Delete resource' }))
    const panel = await confirmPanel()
    expect(panel.querySelector('button[aria-label="Copy resource-01"]')).not.toBeNull()
    const input = panel.querySelector('input') as HTMLInputElement
    await fireEvent.update(input, 'resource-01')
    const confirm = Array.from(panel.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Delete resource'
    ) as HTMLButtonElement
    await fireEvent.click(confirm)
    await waitFor(() => expect(input.disabled).toBe(true))
    await waitFor(() => expect(input.disabled).toBe(false), { timeout: 2000 })
    await waitFor(() => expect(panel.isConnected).toBe(false), { timeout: 3000 })
  })

  it('Failed: keeps the dialog and the typed name, with the reason in a danger alert', async () => {
    render(DeleteFailed)
    const panel = await confirmPanel()
    expect(panel.textContent).toContain('resource-01 is still used by 2 workloads')
    expect((panel.querySelector('input') as HTMLInputElement).value).toBe('resource-01')
  })
})
