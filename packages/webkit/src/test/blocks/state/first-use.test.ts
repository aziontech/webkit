import { cleanup, fireEvent, render } from '@testing-library/vue'
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

  it('renders the copy it is given and emits the create methods', async () => {
    const view = render(FirstUse, {
      props: { title: 'Create your first domain', command: 'azion link' }
    })
    expect(view.getByText('Create your first domain')).toBeTruthy()
    expect((view.getByLabelText('Via CLI command') as HTMLInputElement).value).toBe('azion link')
    await fireEvent.click(view.getByRole('button', { name: 'Import' }))
    await fireEvent.click(view.getByRole('button', { name: 'Create' }))
    expect(view.emitted<unknown[]>('import')?.[0][0]).toBeInstanceOf(MouseEvent)
    expect(view.emitted<unknown[]>('create')?.[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('loading replaces the methods with a busy placeholder', () => {
    const view = render(FirstUse, { props: { loading: true } })
    expect(view.getByRole('status', { name: 'Loading resources' }).getAttribute('aria-busy')).toBe(
      'true'
    )
    expect(view.queryByRole('button', { name: 'Import' })).toBeNull()
  })
})
