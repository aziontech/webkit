import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import CardView from '../../../../blocks/view/card-view/card-view.vue'
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
    loading.unmount()
    const failed = render(CardViewFailed)
    await fireEvent.click(failed.getByRole('button', { name: 'Retry' }))
    expect(failed.emitted('retry')).toHaveLength(1)
  })
})
