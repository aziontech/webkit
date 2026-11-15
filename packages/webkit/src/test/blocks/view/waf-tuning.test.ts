import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import WafLoadFailed from '../../../../blocks/view/waf-tuning/variants/load-error.vue'
import WafTuning from '../../../../blocks/view/waf-tuning/waf-tuning.vue'

describe('view/waf-tuning block', () => {
  it('says No matching rules with Clear search for a search miss', async () => {
    const view = render(WafTuning)
    await fireEvent.update(
      view.getByRole('textbox', { name: 'Search matched requests' }),
      'kubernetes'
    )
    await waitFor(() => expect(view.getByText('No matching rules')).toBeTruthy())
    expect(view.queryByText('No rule reaches the minimum')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Clear search' }))
    await waitFor(() => expect(view.queryByText('No matching rules')).toBeNull())
  })

  it('reads Allow selected while nothing is checked', () => {
    const view = render(WafTuning)
    const allow = view.getByRole('button', { name: 'Allow selected' })
    expect(allow.hasAttribute('disabled')).toBe(true)
  })

  it('shows a danger alert when the matches fail to load and Retry brings the table back', async () => {
    const view = render(WafLoadFailed)
    expect(view.container.textContent).toContain("Couldn't load the matched requests.")
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    await waitFor(() =>
      expect(view.container.textContent).not.toContain("Couldn't load the matched requests.")
    )
  })
})
