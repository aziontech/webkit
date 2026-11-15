import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import FirstUse from '../../../../blocks/state/first-use/first-use.vue'

afterEach(() => cleanup())
describe('state/first-use', () => {
  it('makes both promos links and copies the real CLI command', () => {
    const view = render(FirstUse)
    const catalog = view.getByRole('link', { name: /Start from a Catalog template/ })
    expect(catalog.getAttribute('target')).toBe('_blank')
    expect(view.getByRole('link', { name: /Set up your coding agent/ }).getAttribute('href')).toBe(
      '/agent-setup'
    )
    expect((view.getByLabelText('Via CLI command') as HTMLInputElement).value).toBe('azion deploy')
  })
})
