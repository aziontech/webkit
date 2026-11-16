import { fireEvent, render, screen, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import CreateHub from '../../../../blocks/create/create-hub/create-hub.vue'
import { sampleAccounts } from '../../../../blocks/create/create-hub/sample'
import CreateHubConnected from '../../../../blocks/create/create-hub/variants/connected.vue'
import CreateHubLoading from '../../../../blocks/create/create-hub/variants/repositories-loading.vue'
import { expectNoA11yViolations } from '../../axe'

describe('create-hub', () => {
  it('links every template tile and keeps the heading outline, with no button roles', async () => {
    const view = render(CreateHub)
    expect(screen.getByRole('heading', { level: 2, name: 'Start from template' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: 'Recommended' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Static Site' }).getAttribute('href')).toBe(
      '/create/templates/static-site'
    )
    expect(screen.getByRole('link', { name: 'Nuxt E-commerce' }).getAttribute('href')).toBe(
      '/create/templates/nuxt-ecommerce'
    )
    expect(view.container.querySelector('[role="button"][tabindex="0"]')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Filter' })).toBeNull()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('filters the templates and offers Clear search when nothing matches', async () => {
    render(CreateHub)
    const search = screen.getByRole('textbox', { name: 'Search templates' })
    await fireEvent.update(search, 'zzz')
    expect(screen.getByText('No templates match')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('link', { name: 'Static Site' })).toBeTruthy()
  })

  it('shows ten repositories with named Import buttons and loads more', async () => {
    render(CreateHubConnected)
    const list = screen.getByRole('list', { name: 'Repositories in jane-doe' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(10)
    expect(screen.getByRole('button', { name: 'Import docs-site' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Load more (2)' }))
    expect(within(list).getAllByRole('listitem')).toHaveLength(12)
  })

  it('renders a no-match EmptyState with Clear search for the repository search', async () => {
    render(CreateHubConnected)
    await fireEvent.update(
      screen.getByRole('textbox', { name: 'Search repositories or paste a repository URL' }),
      'nothing-like-this'
    )
    expect(screen.getByText('No repositories match')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('button', { name: 'Import docs-site' })).toBeTruthy()
  })

  it('announces loading with one status line and hides the skeletons', () => {
    const view = render(CreateHubLoading)
    expect(within(view.container as HTMLElement).getByRole('status').textContent).toContain(
      'Loading repositories'
    )
  })

  it('replaces the list with a Retry alert when the repositories fail to load', async () => {
    const view = render(CreateHub, {
      props: { accounts: sampleAccounts, error: "The repositories didn't load." }
    })
    expect(screen.getByText("The repositories didn't load.")).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Repositories in jane-doe' })).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
  })

  it('renders the repositories it is given and emits import with the repository', async () => {
    const repository = { name: 'acme-store', age: '1 hour ago', icon: 'ai ai-code' }
    const view = render(CreateHub, {
      props: { accounts: [{ label: 'acme', value: 'acme' }], repositories: [repository] }
    })
    const list = screen.getByRole('list', { name: 'Repositories in acme' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    expect(screen.queryByRole('button', { name: 'Import docs-site' })).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Import acme-store' }))
    const [event, payload] = view.emitted('import')?.[0] ?? []
    expect(event).toBeInstanceOf(MouseEvent)
    expect(payload).toEqual(repository)
  })

  it('emits connect from Continue with GitHub and shows the connect error it is given', async () => {
    const view = render(CreateHub, { props: { connectError: 'GitHub did not answer.' } })
    expect(screen.getByText('GitHub did not answer.')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Continue with GitHub' }))
    expect(view.emitted('connect')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
  })
})
