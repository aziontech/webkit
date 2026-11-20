import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

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
    expect(screen.getByTestId('wizard')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      await screen.findByText('Select the project this service serves, or create a new one.')
    ).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: /web-app/ }))
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Domain and deployment' })
    ).toBeTruthy()
    await fireEvent.update(
      screen.getByRole('textbox', { name: /^Domain prefix\b/ }),
      'my-first-app'
    )
    const submit = screen.getByRole('button', { name: 'Create and deploy' })
    await fireEvent.click(submit)
    await waitFor(() => expect(submit.getAttribute('aria-busy')).toBe('true'), wait)
  })
  it('leaves at once on Cancel while nothing is answered', async () => {
    const view = render(MultipageCreateAndDeploy)
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(view.emitted('cancel')).toHaveLength(1), wait)
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('runs the Cancel path on Escape: leaves when clean, asks when answered', async () => {
    const view = render(MultipageCreateAndDeploy)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(view.emitted('cancel')).toHaveLength(1), wait)
    view.unmount()
    const dirty = render(MultipageCreateAndDeploy)
    await fireEvent.click(screen.getByRole('button', { name: /web-app/ }))
    await userEvent.keyboard('{Escape}')
    const confirm = await screen.findByRole('alertdialog')
    await fireEvent.click(within(confirm).getByRole('button', { name: 'Keep editing' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull(), wait)
    expect(dirty.emitted('cancel')).toBeUndefined()
  })

  it('asks before Cancel or Back to Services discards the answers', async () => {
    const view = render(MultipageCreateAndDeploy)
    await fireEvent.click(screen.getByRole('button', { name: /web-app/ }))
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    const confirm = await screen.findByRole('alertdialog')
    expect(within(confirm).getByText('Unsaved changes')).toBeTruthy()
    await fireEvent.click(within(confirm).getByRole('button', { name: 'Keep editing' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull(), wait)
    expect(view.emitted('cancel')).toBeUndefined()
    await fireEvent.click(screen.getByRole('button', { name: 'Back to Services' }))
    const again = await screen.findByRole('alertdialog')
    await fireEvent.click(within(again).getByRole('button', { name: 'Discard changes' }))
    await waitFor(() => expect(view.emitted('cancel')).toHaveLength(1), wait)
  })
})

describe('create-wizard', () => {
  it('moves from List settings to Review with Next, so every flow reaches the create', async () => {
    render(MultipageListSettings)
    expect(screen.queryByRole('button', { name: 'Create Access List' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy()
  })

  it('emits submit with the values from Review, and edits Name on General', async () => {
    const view = render(MultipageCreate, {
      props: {
        defaultStep: 'review',
        defaultPolicy: 'acme-production',
        defaultValues: { name: 'office-ranges', items: '13335\n13335\n64512' }
      }
    })
    await fireEvent.click(await screen.findByRole('button', { name: 'Create Access List' }))
    const [event, values] = view.emitted<unknown[]>('submit')?.[0] ?? []
    expect(event).toBeInstanceOf(MouseEvent)
    expect(values).toEqual({
      name: 'office-ranges',
      type: 'asn',
      items: '13335\n64512',
      policy: 'acme-production',
      enableModule: false
    })
    await fireEvent.click(screen.getByRole('button', { name: 'Edit name' }))
    expect(await screen.findByRole('heading', { level: 2, name: 'General' }, wait)).toBeTruthy()
  })

  it('leaves at once on Cancel while nothing is answered', async () => {
    const view = render(MultipageCreate)
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(view.emitted('cancel')).toHaveLength(1), wait)
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('runs the Cancel path on Escape: leaves when clean, asks when answered', async () => {
    const view = render(MultipageCreate)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(view.emitted('cancel')).toHaveLength(1), wait)
    view.unmount()
    const dirty = render(MultipageCreate)
    await fireEvent.click(screen.getByRole('button', { name: /acme-staging/ }))
    await userEvent.keyboard('{Escape}')
    const confirm = await screen.findByRole('alertdialog')
    await fireEvent.click(within(confirm).getByRole('button', { name: 'Keep editing' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull(), wait)
    expect(dirty.emitted('cancel')).toBeUndefined()
  })

  it('asks before Cancel discards the answers, and stays on Keep editing', async () => {
    const view = render(MultipageCreate)
    await fireEvent.click(screen.getByRole('button', { name: /acme-staging/ }))
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    const confirm = await screen.findByRole('alertdialog')
    await fireEvent.click(within(confirm).getByRole('button', { name: 'Keep editing' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull(), wait)
    expect(view.emitted('cancel')).toBeUndefined()
    await fireEvent.click(screen.getByRole('button', { name: 'Back to Access Lists' }))
    const again = await screen.findByRole('alertdialog')
    await fireEvent.click(within(again).getByRole('button', { name: 'Discard changes' }))
    await waitFor(() => expect(view.emitted('cancel')).toHaveLength(1), wait)
  })

  it('lists the policies it is given and spins the submit while loading', async () => {
    const view = render(MultipageCreate, {
      props: {
        policies: [
          { value: 'docs-site', label: 'docs-site', description: 'acme-docs', ready: true }
        ]
      }
    })
    expect(screen.getByRole('button', { name: /docs-site/ })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /acme-staging/ })).toBeNull()
    view.unmount()
    const busy = render(MultipageCreate, {
      props: {
        defaultStep: 'review',
        defaultValues: { name: 'office-ranges', items: '13335' },
        loading: true
      }
    })
    const create = await screen.findByRole('button', { name: 'Create Access List' }, wait)
    expect(create.getAttribute('aria-busy')).toBe('true')
    await fireEvent.click(create)
    expect(busy.emitted<unknown[]>('submit')).toBeUndefined()
  })

  it('runs on the Wizard: Next needs an answer, and a host with the module off adds a step', async () => {
    render(MultipageCreate)
    expect(screen.getByTestId('wizard')).toBeTruthy()
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
