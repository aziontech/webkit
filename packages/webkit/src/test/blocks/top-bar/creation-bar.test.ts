import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import CreationBar from '../../../../blocks/top-bar/creation-bar/creation-bar.vue'

afterEach(() => cleanup())
describe('top-bar/creation-bar', () => {
  it('makes the back control a link to the list it came from', () => {
    const view = render(CreationBar)
    const back = view.getByRole('link', { name: 'Back to Resources' })
    expect(back.getAttribute('href')).toBe('/resources')
  })
})
