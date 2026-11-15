import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import SecurityByActor from '../../../../blocks/dashboard/security-dashboard/variants/by-actor.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const byTestId = (id: string, root: Document | HTMLElement = document) =>
  root.querySelector<HTMLElement>(`[data-testid="${id}"]`)
describe('dashboard/security-dashboard#ByActor', () => {
  it('narrows the log by destination and offers Clear filters when nothing matches', async () => {
    const view = render(SecurityByActor)
    const table = () => byTestId('data-data-table', view.container)
    expect(table()?.textContent).toContain('storage.example.com')
    const input = view.getByRole('textbox', { name: 'Destination host' })
    await userEvent.fill(input, 'storage.example.com')
    await waitFor(() => expect(table()?.textContent).not.toContain('api.example.com'))
    expect(table()?.textContent).toContain('storage.example.com')
    await userEvent.fill(input, 'nothing.example.org')
    await waitFor(() =>
      expect(view.container.textContent).toContain('No requests match these filters')
    )
    const clear = Array.from(view.container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Clear filters'
    ) as HTMLButtonElement
    await fireEvent.click(clear)
    await waitFor(() => expect(table()?.textContent).toContain('api.example.com'))
  })

  it('moves the time range to the header and the closed-set filters into FilterMenu', async () => {
    const view = render(SecurityByActor)
    expect(byTestId('data-filter-menu', view.container)).not.toBeNull()
    expect(view.getByRole('combobox', { name: 'Time range' })).toBeTruthy()
  })

  it('emits refresh from the Refresh button', async () => {
    const view = render(SecurityByActor)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted('refresh')?.length).toBe(1)
  })
})
