import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import InstallIntegration from '../../blocks/create/deploy-template/variants/install-integration.vue'
import WhereItRuns from '../../blocks/create/deploy-template/variants/where-it-runs.vue'
import { expectNoA11yViolations } from './axe'

describe('deploy-template#WhereItRuns', () => {
  it('lists six services, narrows them with the search and answers the step with a pick', async () => {
    const view = render(WhereItRuns)
    await expectNoA11yViolations(view.container)
    expect(screen.getByRole('heading', { level: 1, name: 'Where it runs' })).toBeTruthy()
    expect(screen.getByText('6 more. Type to narrow the list.')).toBeTruthy()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Search services' }), 'zzz')
    expect(screen.getByText('No service matches “zzz”.')).toBeTruthy()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Search services' }), 'web-prod')
    await fireEvent.click(screen.getByRole('button', { name: /web-prod/ }))
    expect(await screen.findByText('Connect a Git provider')).toBeTruthy()
    expect(screen.getByText(/deployed to web-prod on every push/)).toBeTruthy()
  })

  it('focuses the new service name field when Create Service opens it', async () => {
    render(WhereItRuns)
    await fireEvent.click(screen.getByRole('button', { name: 'Create Service' }))
    const name = await screen.findByRole('textbox', { name: 'New service' })
    await waitFor(() => expect(document.activeElement).toBe(name))
  })

  it('focuses the name field, prefilled with the query, when Enter finds no service', async () => {
    render(WhereItRuns)
    const search = screen.getByRole('textbox', { name: 'Search services' })
    await fireEvent.update(search, 'billing-api')
    await fireEvent.keyDown(search, { key: 'Enter' })
    const name = await screen.findByRole<HTMLInputElement>('textbox', { name: 'New service' })
    await waitFor(() => expect(document.activeElement).toBe(name))
    expect(name.value).toBe('billing-api')
  })

  it('continues without a service to the Git step', async () => {
    render(WhereItRuns)
    await fireEvent.click(screen.getByRole('button', { name: 'Continue without a service' }))
    expect(await screen.findByRole('button', { name: 'Continue with GitHub' })).toBeTruthy()
  })
})

describe('deploy-template#InstallIntegration', () => {
  it('requires the origin and previews what gets added', async () => {
    const view = render(InstallIntegration)
    await expectNoA11yViolations(view.container)
    await fireEvent.click(screen.getByRole('button', { name: 'Add to service-01' }))
    expect(await screen.findByText('This field is required.')).toBeTruthy()
    await fireEvent.update(
      screen.getByRole('textbox', { name: /Origin address/ }),
      'origin.example.com'
    )
    const added = screen.getByText('Records').parentElement as HTMLElement
    expect(within(added).getByText(/origin\.example\.com/)).toBeTruthy()
    expect(screen.queryByText('This field is required.')).toBeNull()
  })
})
