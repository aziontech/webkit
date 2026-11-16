import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import ChangePlanDrawer from '../../../../blocks/account/change-plan-drawer/change-plan-drawer.vue'
import Checkout from '../../../../blocks/account/change-plan-drawer/variants/checkout.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const dialog = () =>
  document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement | null

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement
describe('change-plan-drawer', () => {
  it('lists each tier with PlanFeatureList', async () => {
    const view = render(ChangePlanDrawer)
    await fireEvent.click(view.getByRole('button', { name: 'Change plan' }))
    const panel = await waitFor(() => {
      expect(dialog()).not.toBeNull()
      return dialog() as HTMLElement
    })
    expect(panel.querySelectorAll('[data-testid="plan-feature-list"]').length).toBe(3)
  })

  it('renders the plans it is given and emits plan-select and upgrade', async () => {
    const view = render(ChangePlanDrawer, {
      props: {
        plans: [
          {
            id: 'team',
            name: 'Team',
            current: false,
            action: 'upgrade',
            actionLabel: 'Continue with Team',
            featuresTitle: 'Everything for a team',
            features: [{ label: 'Shared projects' }],
            card: {
              monthly: {
                value: '40',
                prefix: '$',
                suffix: '/ mon',
                showPrefix: true,
                showSuffix: true,
                details: 'Billed monthly'
              },
              yearly: {
                value: '32',
                prefix: '$',
                suffix: '/ mon',
                showPrefix: true,
                showSuffix: true,
                details: 'Billed annually'
              }
            }
          }
        ],
        cardLast4: '4242'
      }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Change plan' }))
    const panel = await waitFor(() => {
      expect(dialog()?.textContent).toContain('Continue with Team')
      return dialog() as HTMLElement
    })
    expect(panel.textContent).not.toContain('Enterprise')
    await fireEvent.click(buttonByText('Continue with Team', panel))
    expect(view.emitted('plan-select')?.[0]?.[1]).toMatchObject({ id: 'team' })
    await waitFor(() => expect(document.body.textContent).toContain('Ending in 4242'))
    const upgrade = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Upgrade'
    ) as HTMLButtonElement
    await fireEvent.click(upgrade)
    await waitFor(() => expect(view.emitted('upgrade')).toHaveLength(1))
    expect(view.emitted('upgrade')?.[0]?.[1]).toMatchObject({
      period: 'yearly',
      card: null,
      address: { city: 'San Francisco' }
    })
    expect(document.body.textContent).toContain('Upgrade to Pro')
  })
})

describe('change-plan-drawer#Checkout', () => {
  it('requires the terms before Upgrade and focuses the checkbox', async () => {
    const view = render(Checkout)
    const panel = await waitFor(() => {
      expect(dialog()?.textContent).toContain('Upgrade to Pro')
      return dialog() as HTMLElement
    })
    expect(panel.textContent).toContain('Due today')
    await fireEvent.click(buttonByText('Upgrade', panel))
    await waitFor(() =>
      expect(panel.textContent).toContain(
        'Accept the Terms of Service and the Privacy Policy to upgrade.'
      )
    )
    const terms = view.getByLabelText(/I accept the/)
    await waitFor(() => expect(document.activeElement).toBe(terms))
    await fireEvent.click(terms)
    expect(panel.textContent).not.toContain('Accept the Terms of Service and the Privacy Policy')
    await expectNoA11yViolations(panel)
  })
})
