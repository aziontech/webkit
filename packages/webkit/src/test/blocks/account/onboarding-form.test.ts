import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import OnboardingForm from '../../../../blocks/account/onboarding-form/onboarding-form.vue'
import Plan from '../../../../blocks/account/onboarding-form/variants/plan.vue'
import Profile from '../../../../blocks/account/onboarding-form/variants/profile.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('account/onboarding-form', () => {
  it('renders the step card on the layout column, with the Wizard holding the step', async () => {
    const view = render(OnboardingForm)
    const column = view.container.querySelector('.layout-column.layout-boundary')
    expect(column).not.toBeNull()
    expect(view.queryByRole('progressbar')).toBeNull()
    expect(view.getByTestId('navigation-wizard')).toBeTruthy()
    expect(
      await view.findByRole('heading', { level: 2, name: 'Create your organization' })
    ).toBeTruthy()
    expect(view.getByTestId('navigation-wizard__progress').textContent).toContain('Step 1 of 3')
  })

  it('gates Next on the required fields, then moves to the plan step', async () => {
    const view = render(OnboardingForm)
    await fireEvent.click(view.getByRole('button', { name: 'Next' }))
    expect(view.getAllByText('This field is required.')).toHaveLength(2)
    expect(view.getByRole('heading', { level: 2, name: 'Create your organization' })).toBeTruthy()
    await fireEvent.update(view.getByRole('textbox', { name: /Your full name/ }), 'Jane Doe')
    await fireEvent.update(view.getByRole('textbox', { name: /Organization name/ }), 'Acme Inc.')
    await fireEvent.click(view.getByRole('button', { name: 'Next' }))
    expect(await view.findByRole('heading', { level: 2, name: 'Select your plan' })).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: 'Next' }))
    expect(view.getByText('Select a plan to continue.')).toBeTruthy()
  })

  it('Cancel clears the answers and starts over on the first step', async () => {
    const view = render(Profile)
    expect(view.getByRole('heading', { level: 2, name: 'Tell us about your work' })).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: 'Cancel' }))
    expect(
      await view.findByRole('heading', { level: 2, name: 'Create your organization' })
    ).toBeTruthy()
    expect(
      (view.getByRole('textbox', { name: /Your full name/ }) as globalThis.HTMLInputElement).value
    ).toBe('')
    expect(
      (view.getByRole('textbox', { name: /Organization name/ }) as globalThis.HTMLInputElement)
        .value
    ).toBe('')
    expect(view.queryByText('This field is required.')).toBeNull()
  })

  it('lists what the upgrade includes with FeatureList', async () => {
    const view = render(Plan)
    await userEvent.click(view.getByRole('radio', { name: /Pro plan/ }))
    const drawer = await view.findByRole('dialog', { name: 'Upgrade to Pro' })
    const list = within(drawer).getByTestId('content-feature-list')
    expect(within(list).getAllByRole('listitem').length).toBeGreaterThan(3)
  })

  it('ends on Create Organization, which asks for both answers first', async () => {
    const view = render(Profile)
    const create = await view.findByRole('button', { name: 'Create Organization' })
    await fireEvent.click(create)
    expect(view.getAllByText('Select one to continue.')).toHaveLength(2)
  })
})
