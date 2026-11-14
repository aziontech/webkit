import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import ApplicationBuild from '../../blocks/platform/detail/details-page/variants/application-build.vue'
import Invocations from '../../blocks/platform/detail/invocations/invocations.vue'
import Failed from '../../blocks/platform/detail/invocations/variants/failed.vue'
import DeviceGroups from '../../blocks/platform/detail/version-detail/variants/device-groups.vue'

const selectedSpan = () =>
  document.querySelector<HTMLElement>('[data-testid="code-trace__row"][aria-selected="true"]')

describe('invocations', () => {
  it('selects the span of a request path node and scrolls the trace into view', async () => {
    render(Invocations)
    expect(selectedSpan()).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Show origin-assets in the trace' }))
    await waitFor(() => expect(selectedSpan()?.dataset.spanId).toBe('origin'))
  })

  it('swaps the whole page to the run picked in Recent', async () => {
    render(Invocations)
    expect(screen.getByText('inv_8f2c1a9d')).toBeTruthy()
    await fireEvent.click(screen.getByText('Recent'))
    await fireEvent.click(await screen.findByRole('menuitem', { name: /inv_7d41be02/ }))
    await waitFor(() =>
      expect(screen.getByText('502, the origin did not answer within the 1 s budget.')).toBeTruthy()
    )
  })

  it('opens a failed run on its failing span', async () => {
    render(Failed)
    expect(selectedSpan()?.dataset.spanId).toBe('response')
    expect(screen.getAllByText('Timed out').length).toBeGreaterThan(0)
  })
})

describe('details-page#ApplicationBuild', () => {
  it('raises the drop target while files hover and opens the deploy drawer on drop', async () => {
    const { container } = render(ApplicationBuild)
    const root = container.firstElementChild as HTMLElement
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(new File(['x'], 'site.zip'))
    root.dispatchEvent(
      new DragEvent('dragenter', { dataTransfer, bubbles: true, cancelable: true })
    )
    expect(await screen.findByText('Drop your project to deploy it')).toBeTruthy()
    root.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }))
    const drawer = await screen.findByRole('dialog', { name: 'Deploy storefront-app' })
    expect(drawer.textContent).toContain('site.zip')
  })
})

describe('version-detail#DeviceGroups', () => {
  it('validates the add drawer and adds the group to the table', async () => {
    render(DeviceGroups)
    await fireEvent.click(screen.getByRole('button', { name: 'Add Device Group' }))
    const drawer = await screen.findByRole('dialog', { name: 'Add Device Group' })
    const submit = drawer.querySelector<HTMLButtonElement>('button[type="submit"]')!
    await fireEvent.click(submit)
    expect(await screen.findByText('Enter a name for the device group.')).toBeTruthy()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Name' }), 'smart-tv')
    await fireEvent.update(
      screen.getByRole('textbox', { name: 'Regular expression' }),
      '(SmartTV|Tizen)'
    )
    await fireEvent.click(submit)
    await waitFor(() => expect(screen.getByRole('button', { name: 'smart-tv' })).toBeTruthy(), {
      timeout: 4000
    })
  })
})
