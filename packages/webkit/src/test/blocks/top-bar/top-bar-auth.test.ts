import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import TopBarAuth from '../../../../blocks/top-bar/top-bar-auth/top-bar-auth.vue'

afterEach(() => cleanup())
describe('top-bar/top-bar-auth', () => {
  it('offers Documentation and no account control', () => {
    const view = render(TopBarAuth)
    expect(view.getByRole('link', { name: 'Azion home' })).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Account menu' })).toBeNull()
  })

  it('points its links where it is told and emits docs', async () => {
    const view = render(TopBarAuth, {
      props: { homeHref: '/', docsHref: 'https://example.com/docs' }
    })
    expect(view.getByRole('link', { name: 'Azion home' }).getAttribute('href')).toBe('/')
    const docs = view.getByRole('link', { name: /Documentation/ })
    expect(docs.getAttribute('href')).toBe('https://example.com/docs')
    docs.addEventListener('click', (event) => event.preventDefault())
    await fireEvent.click(docs)
    expect(view.emitted<unknown[]>('docs')?.[0][0]).toBeInstanceOf(MouseEvent)
  })
})
