import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import OnboardingForm from '../../blocks/platform/account/onboarding-form/onboarding-form.vue'
import Plan from '../../blocks/platform/account/onboarding-form/variants/plan.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

describe('platform/account/onboarding-form', () => {
  it('renders the step card on the layout column', () => {
    const view = render(OnboardingForm)
    const column = view.container.querySelector('.layout-column.layout-boundary')
    expect(column).not.toBeNull()
    expect(view.getByRole('progressbar', { name: 'Step 1 of 3' })).toBeTruthy()
  })

  it('lists what the upgrade includes with FeatureList', async () => {
    const view = render(Plan)
    await userEvent.click(view.getByRole('radio', { name: /Pro plan/ }))
    const drawer = await view.findByRole('dialog', { name: 'Upgrade to Pro' })
    const list = within(drawer).getByTestId('content-feature-list')
    expect(within(list).getAllByRole('listitem').length).toBeGreaterThan(3)
  })
})
