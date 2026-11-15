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
})
