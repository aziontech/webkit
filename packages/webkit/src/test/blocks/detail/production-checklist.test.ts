import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import ProductionChecklist from '../../../../blocks/detail/production-checklist/production-checklist.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button, a')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLElement
describe('detail/production-checklist', () => {
  it('opens the drawer from a step row and from the expand button', async () => {
    const view = render(ProductionChecklist)
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
    const view = render(ProductionChecklist, { props: { steps, defaultOpen: true } })
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
})
