import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DetailProductionChecklist from '../../../../blocks/detail/detail-production-checklist/detail-production-checklist.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button, a')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLElement
describe('detail/detail-production-checklist', () => {
  it('opens the drawer from a step row and from the expand button', async () => {
    const view = render(DetailProductionChecklist)
    await fireEvent.click(view.getByRole('button', { name: /Enable a security policy/ }))
    const drawer = await waitFor(() => view.getByRole('dialog', { name: /Ship to production/ }))
    expect(drawer.textContent).toContain('Attach Policy')
    await fireEvent.click(buttonByText('Done', drawer))
    await waitFor(() => expect(view.queryByRole('dialog')).toBeNull())
    await fireEvent.click(view.getByRole('button', { name: 'Expand the production checklist' }))
    await waitFor(() =>
      expect(view.getByRole('dialog', { name: /Ship to production/ })).toBeTruthy()
    )
  })

  it('renders the steps it is given and emits the drawer action', async () => {
    const steps = [
      {
        id: 'domain',
        icon: 'az az-globe',
        title: 'Point the Acme domain',
        description: 'Serve acme-store on www.example.com.',
        actionLabel: 'Add Domain',
        done: false,
        doneNote: ''
      }
    ]
    const view = render(DetailProductionChecklist, { props: { steps, defaultOpen: true } })
    const drawer = await waitFor(() => view.getByRole('dialog', { name: /Ship to production/ }))
    expect(drawer.textContent).toContain('0 of 1')
    expect(drawer.textContent).toContain('Point the Acme domain')
    expect(drawer.textContent).not.toContain('Enable a security policy')
    await fireEvent.click(buttonByText('Add Domain', drawer))
    const emitted = view.emitted('step-action')
    expect(emitted).toHaveLength(1)
    expect((emitted[0] as unknown[])[1]).toEqual(steps[0])
    await waitFor(() => expect(view.queryByRole('dialog')).toBeNull())
  })

  it('marks the first open step as next and leaves the done ones plain', () => {
    const view = render(DetailProductionChecklist)
    const rows = Array.from(view.container.querySelectorAll('.group\\/step'))
    const done = rows.filter((row) => row.hasAttribute('data-done'))
    const next = rows.filter((row) => row.hasAttribute('data-next'))
    expect(done.length).toBeGreaterThan(0)
    expect(next).toHaveLength(1)
    expect(next[0]?.hasAttribute('data-done')).toBe(false)
    expect(next[0]?.textContent).toContain('Next step')
    expect(rows.indexOf(next[0] as Element)).toBe(
      rows.findIndex((row) => !row.hasAttribute('data-done'))
    )
  })
})
