import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import SplitView from '../../../../blocks/view/split-view/split-view.vue'
import SplitViewFiltered from '../../../../blocks/view/split-view/variants/filtered.vue'

describe('view/split-view block', () => {
  it('opens an event from its detail button, a keyboard path to the document', async () => {
    const view = render(SplitView)
    const [open] = await waitFor(() => view.getAllByRole('button', { name: /^Open event / }))
    expect(open).toHaveAttribute('aria-expanded', 'false')
    await fireEvent.click(open)
    await waitFor(() => expect(open).toHaveAttribute('aria-expanded', 'true'))
  })

  it('filters through FilterMenu and shows its chips for applied fields', async () => {
    const view = render(SplitViewFiltered)
    expect(view.getByTestId('filter-button')).toBeTruthy()
    const chips = view.getByTestId('filter-chips')
    expect(chips.textContent).toContain('Source')
    expect(chips.textContent).toContain('Level')
  })
})
