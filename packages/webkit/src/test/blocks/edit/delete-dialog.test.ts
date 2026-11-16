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

  const deleteButton = (panel: HTMLElement) =>
    Array.from(panel.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Delete resource'
    ) as HTMLButtonElement

  it('emits delete with the name, locks while loading, then closes', async () => {
    const view = render(DeleteWithConfirmation)
    await userEvent.click(view.getByRole('button', { name: 'Delete resource' }))
    const panel = await confirmPanel()
    expect(panel.querySelector('button[aria-label="Copy resource-01"]')).not.toBeNull()
    const input = panel.querySelector('input') as HTMLInputElement
    await fireEvent.update(input, 'resource-01')
    await fireEvent.click(deleteButton(panel))
    const emitted = view.emitted('delete') as [Event, string][]
    expect(emitted).toHaveLength(1)
    expect(emitted[0][0]).toBeInstanceOf(Event)
    expect(emitted[0][1]).toBe('resource-01')
    await view.rerender({ loading: true })
    await waitFor(() => expect(input.disabled).toBe(true))
    await view.rerender({ loading: false })
    await waitFor(() => expect(panel.isConnected).toBe(false), { timeout: 3000 })
  })

  it('asks for the name it is given instead of the sample', async () => {
    const view = render(DeleteWithConfirmation, { props: { name: 'acme-store', open: true } })
    const panel = await confirmPanel()
    expect(panel.textContent).toContain('acme-store')
    expect(panel.textContent).not.toContain('resource-01')
    const input = panel.querySelector('input') as HTMLInputElement
    await fireEvent.update(input, 'resource-01')
    expect(deleteButton(panel).disabled).toBe(true)
    await fireEvent.update(input, 'acme-store')
    await fireEvent.click(deleteButton(panel))
    expect((view.emitted('delete') as [Event, string][])[0][1]).toBe('acme-store')
  })

  it('Failed: keeps the dialog and the typed name, with the reason in a danger alert', async () => {
    render(DeleteFailed)
    const panel = await confirmPanel()
    expect(panel.textContent).toContain('resource-01 is still used by 2 workloads')
    expect((panel.querySelector('input') as HTMLInputElement).value).toBe('resource-01')
  })
})
