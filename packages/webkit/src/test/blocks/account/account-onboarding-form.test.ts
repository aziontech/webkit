import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import AccountOnboardingForm from '../../../../blocks/account/account-onboarding-form/account-onboarding-form.vue'
import Plan from '../../../../blocks/account/account-onboarding-form/variants/plan.vue'
import Profile from '../../../../blocks/account/account-onboarding-form/variants/profile.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('account/account-onboarding-form', () => {
  it('renders the step card on the layout column, with the Wizard holding the step', async () => {
    const view = render(AccountOnboardingForm)
    const column = view.container.querySelector('.layout-column.layout-boundary')
    expect(column).not.toBeNull()
    expect(view.queryByRole('progressbar')).toBeNull()
    expect(view.getByTestId('wizard')).toBeTruthy()
    expect(
      await view.findByRole('heading', { level: 2, name: 'Create your organization' })
    ).toBeTruthy()
    expect(view.getByTestId('wizard__progress').textContent).toContain('Step 1 of 3')
  })

  it('gates Next on the required fields, then moves to the plan step', async () => {
    const view = render(AccountOnboardingForm)
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

  it('lists what the upgrade includes with PlanFeatureList', async () => {
    const view = render(Plan)
    await userEvent.click(view.getByRole('radio', { name: /Pro plan/ }))
    const drawer = await view.findByRole('dialog', { name: 'Upgrade to Pro' })
    const list = within(drawer).getByTestId('plan-feature-list')
    expect(within(list).getAllByRole('listitem').length).toBeGreaterThan(3)
  })

  it('ends on Create Organization, which asks for both answers first', async () => {
    const view = render(Profile)
    const create = await view.findByRole('button', { name: 'Create Organization' })
    await fireEvent.click(create)
    expect(view.getAllByText('Select one to continue.')).toHaveLength(2)
  })

  it('emits submit with every answer instead of faking the create request', async () => {
    const view = render(AccountOnboardingForm, {
      props: {
        step: 2,
        defaultValues: {
          fullName: 'Jane Doe',
          organizationName: 'Acme Inc.',
          plan: 'free',
          usage: 'work',
          role: 'team_lead'
        }
      }
    })
    await fireEvent.click(await view.findByRole('button', { name: 'Create Organization' }))
    const [event, values] = view.emitted('submit')![0] as [MouseEvent, Record<string, unknown>]
    expect(event).toBeInstanceOf(MouseEvent)
    expect(values).toMatchObject({
      fullName: 'Jane Doe',
      organizationName: 'Acme Inc.',
      plan: 'free',
      usage: 'work',
      role: 'team_lead',
      session: false,
      billingPeriod: 'yearly'
    })
    expect(view.queryByText('Organization created.')).toBeNull()
    await view.rerender({ loading: true })
    await view.rerender({ loading: false })
    expect(await view.findByText('Organization created.')).toBeTruthy()
  })

  it('shows the error it is given with Retry, and Cancel emits cancel', async () => {
    const view = render(AccountOnboardingForm, {
      props: {
        step: 2,
        error: 'The API answered 503.',
        defaultValues: { plan: 'free', usage: 'work', role: 'other' }
      }
    })
    expect(await view.findByText('The API answered 503.')).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('submit')).toHaveLength(1)
    await fireEvent.click(view.getByRole('button', { name: 'Cancel' }))
    expect(view.emitted('cancel')).toHaveLength(1)
  })

  it('renders the plans and the account it is given instead of the sample', async () => {
    const view = render(AccountOnboardingForm, {
      props: {
        step: 1,
        account: {
          email: 'jane.doe@example.com',
          address: {
            country: 'United States',
            postalCode: '94105',
            state: 'California',
            city: 'San Francisco',
            line1: '100 Market Street',
            line2: ''
          },
          cardLast4: '4242'
        },
        plans: [
          {
            value: 'starter',
            label: 'Starter for small teams',
            description: 'A plan given by the page',
            ariaLabel: 'Starter plan, $5/mo.',
            name: 'Starter',
            price: '$5/mo'
          }
        ]
      }
    })
    expect(await view.findByRole('radio', { name: /Starter plan/ })).toBeTruthy()
    expect(view.queryByRole('radio', { name: /Pro plan/ })).toBeNull()
    expect(view.container.textContent).toContain('jane.doe@example.com')
    expect(view.container.textContent).not.toContain('myemail@example.com')
  })
})
