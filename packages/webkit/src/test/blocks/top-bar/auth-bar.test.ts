import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import AuthBar from '../../../../blocks/top-bar/auth-bar/auth-bar.vue'

afterEach(() => cleanup())
describe('top-bar/auth-bar', () => {
  it('offers Documentation and no account control', () => {
    const view = render(AuthBar)
    expect(view.getByRole('link', { name: 'Azion home' })).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Account menu' })).toBeNull()
  })
})
