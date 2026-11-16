import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import CardView from '../../../../blocks/view/card-view/card-view.vue'
import CardViewEmpty from '../../../../blocks/view/card-view/variants/empty.vue'
import CardViewFailed from '../../../../blocks/view/card-view/variants/error.vue'
import CardViewLoading from '../../../../blocks/view/card-view/variants/loading.vue'

describe('view/card-view block', () => {
  it('names each card with a Link to the application', () => {
    const view = render(CardView)
    expect(view.getByRole('link', { name: 'storefront' })).toHaveAttribute(
      'href',
      '/applications/app-01'
    )
  })

  it('shows placeholder cards while loading and a Retry alert when loading fails', async () => {
    const loading = render(CardViewLoading)
    expect(loading.container.querySelector('[aria-busy="true"]')).not.toBeNull()
    expect(loading.container.textContent).not.toContain('storefront')
    loading.unmount()
    const failed = render(CardViewFailed)
    expect(failed.container.textContent).toContain("Couldn't load the applications.")
    failed.unmount()
    const view = render(CardView, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain('The API answered 503.')
    expect(view.container.textContent).not.toContain('storefront')
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
  })

  it('renders the applications it is given instead of the sample, and the empty card for none', async () => {
    const view = render(CardView, {
      props: {
        applications: [
          {
            id: 'app-77',
            name: 'acme-store',
            status: 'Active',
            domain: 'store.example.com',
            region: 'us-east',
            requests: 1200,
            owner: 'Jane Doe'
          }
        ]
      }
    })
    await waitFor(() =>
      expect(view.getByRole('link', { name: 'acme-store' })).toHaveAttribute(
        'href',
        '/applications/app-77'
      )
    )
    expect(view.queryByRole('link', { name: 'storefront' })).toBeNull()
    view.unmount()
    const empty = render(CardViewEmpty)
    expect(empty.container.textContent).toContain('No applications yet')
  })

  it('emits create and delete with the selected applications', async () => {
    const view = render(CardView)
    await fireEvent.click(view.getByRole('button', { name: 'Create Application' }))
    expect(view.emitted('create')).toHaveLength(1)
    await fireEvent.click(view.getByRole('checkbox', { name: 'storefront' }))
    await fireEvent.click(view.getByRole('button', { name: 'Delete (1)' }))
    const input = await waitFor(() => {
      const el = document.body.querySelector<HTMLInputElement>('[role=alertdialog] input')
      expect(el).not.toBeNull()
      return el!
    })
    await fireEvent.update(input, 'delete')
    const confirm = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('[role=alertdialog] button')
    ).find((button) => button.textContent?.includes('Delete application'))
    await fireEvent.click(confirm!)
    const emitted = view.emitted('delete') as [Event, { id: string }[]][]
    expect(emitted).toHaveLength(1)
    expect(emitted[0][0]).toBeInstanceOf(Event)
    expect(emitted[0][1].map((item) => item.id)).toEqual(['app-01'])
  })
})
