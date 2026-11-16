import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import NotFound from '../../../../blocks/state/not-found/not-found.vue'

afterEach(() => cleanup())
describe('state/not-found', () => {
  it('renders the copy and links it is given and emits home', async () => {
    const view = render(NotFound, {
      props: {
        title: 'Domain not found',
        description: 'No domain with this name exists in the account.',
        homeHref: '/domains',
        docsHref: 'https://example.com/docs/domains'
      }
    })
    expect(view.getByText('Domain not found')).toBeTruthy()
    expect(view.getByText('No domain with this name exists in the account.')).toBeTruthy()
    expect(view.queryByText('Page not found')).toBeNull()
    const home = view.getByRole('link', { name: 'Go to home' })
    expect(home.getAttribute('href')).toBe('/domains')
    expect(view.getByRole('link', { name: /Docs/ }).getAttribute('href')).toBe(
      'https://example.com/docs/domains'
    )
    home.addEventListener('click', (event) => event.preventDefault())
    await fireEvent.click(home)
    expect(view.emitted<unknown[]>('home')?.[0][0]).toBeInstanceOf(MouseEvent)
  })
})
