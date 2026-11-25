import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import StateFirstUse from '../../../../blocks/state/state-first-use/state-first-use.vue'

afterEach(() => cleanup())
describe('state/state-first-use', () => {
  it('makes both promos links and copies the real CLI command', () => {
    const view = render(StateFirstUse)
    const catalog = view.getByRole('link', { name: /Start from a Catalog template/ })
    expect(catalog.getAttribute('target')).toBe('_blank')
    expect(view.getByRole('link', { name: /Set up your coding agent/ }).getAttribute('href')).toBe(
      '/agent-setup'
    )
    const command = view.getByLabelText('Via CLI command') as HTMLInputElement
    expect(command.value).toBe('azion deploy')
    const group = command.closest('[data-testid="input-group"]')
    expect(group?.querySelector('button[aria-label="Copy the Via CLI command"]')).toBeTruthy()
  })

  it('renders the copy it is given and emits the create methods', async () => {
    const view = render(StateFirstUse, {
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
    const view = render(StateFirstUse, { props: { loading: true } })
    expect(view.getByRole('status', { name: 'Loading resources' }).getAttribute('aria-busy')).toBe(
      'true'
    )
    expect(view.queryByRole('button', { name: 'Import' })).toBeNull()
  })
})
