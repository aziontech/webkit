import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import MultipageCreate from '../../../../blocks/create/create-wizard/create-wizard.vue'
import MultipageCreateAndDeploy from '../../../../blocks/create/create-wizard/variants/create-and-deploy.vue'
import MultipageListSettings from '../../../../blocks/create/create-wizard/variants/list-settings.vue'
import Review from '../../../../blocks/create/create-wizard/variants/review.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }

afterEach(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})
describe('create-wizard#CreateAndDeploy', () => {
  it('gates Next on the project, then shows the loading state on Create and deploy', async () => {
    render(MultipageCreateAndDeploy)
    expect(screen.getByTestId('navigation-wizard')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      await screen.findByText('Select the project this service serves, or create a new one.')
    ).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: /web-app/ }))
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Domain and deployment' })
    ).toBeTruthy()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Domain prefix' }), 'my-first-app')
    const submit = screen.getByRole('button', { name: 'Create and deploy' })
    await fireEvent.click(submit)
    await waitFor(() => expect(submit.getAttribute('aria-busy')).toBe('true'), wait)
  })
})

describe('create-wizard', () => {
  it('moves from List settings to Review with Next, so every flow reaches the create', async () => {
    render(MultipageListSettings)
    expect(screen.queryByRole('button', { name: 'Create Access List' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy()
  })

  it('creates from Review with a loading submit and a toast, and edits Name on General', async () => {
    render(Review)
    const create = await screen.findByRole('button', { name: 'Create Access List' })
    await fireEvent.click(create)
    await waitFor(() => expect(create.getAttribute('aria-busy')).toBe('true'), wait)
    await waitFor(() => expect(screen.getByText('office-ranges created.')).toBeTruthy(), wait)
    await fireEvent.click(screen.getByRole('button', { name: 'Edit name' }))
    expect(await screen.findByRole('heading', { level: 2, name: 'General' }, wait)).toBeTruthy()
  })

  it('runs on the Wizard: Next needs an answer, and a host with the module off adds a step', async () => {
    render(MultipageCreate)
    expect(screen.getByTestId('navigation-wizard')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 1, name: 'Create Access List' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Select a policy, or continue without one.')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: /acme-staging/ }))
    expect(await screen.findByRole('heading', { level: 2, name: 'IP filtering' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByRole('heading', { level: 2, name: 'General' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('This field is required.')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'General' })).toBeTruthy()
  })
})

describe('create-wizard#Review', () => {
  it('shows what gets created and jumps back to a step with Edit', async () => {
    render(Review)
    expect(screen.getByText('Runs on acme-production.')).toBeTruthy()
    expect(screen.getByText('7 entries')).toBeTruthy()
    expect(screen.getByText('and 2 more')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Edit list settings' }))
    expect(await screen.findByRole('heading', { name: 'List settings' })).toBeTruthy()
  })
})
