import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import type { ReleaseImpactResource } from '../../../../blocks/create/release-impact/release-impact.vue'
import ReleaseImpact from '../../../../blocks/create/release-impact/release-impact.vue'
import ReleaseImpactSettings from '../../../../blocks/create/release-impact/variants/choose-settings.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('release-impact', () => {
  it('names each resource card and gives the read-only resource a real control', async () => {
    const view = render(ReleaseImpact)
    expect(screen.getByRole('heading', { level: 1, name: 'Review and deploy' })).toBeTruthy()
    const regions = screen.getAllByRole('region')
    expect(regions.length).toBeGreaterThan(1)
    const resources = screen.getAllByRole('textbox', { name: 'Resource' })
    expect(resources.length).toBeGreaterThan(0)
    resources.forEach((input) => expect(input.hasAttribute('readonly')).toBe(true))
    expect(screen.getByRole('button', { name: /Deploy release/ })).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('renders the resources and impact it is given and emits deploy with them', async () => {
    const resources: ReleaseImpactResource[] = [
      {
        type: 'service',
        name: 'acme-store',
        required: true,
        enabled: true,
        versionId: 'BX1Y2Z3A',
        versions: [{ id: 'BX1Y2Z3A', current: true, age: '1 hour ago' }],
        groups: []
      }
    ]
    const view = render(ReleaseImpact, {
      props: {
        resources,
        impact: [
          {
            id: 'store-settings',
            name: 'store-settings',
            domainsCount: 1,
            environments: [
              {
                id: 'production',
                name: 'Production',
                projects: [{ id: 'acme-store', name: 'acme-store', domainsCount: 1 }]
              }
            ]
          }
        ]
      }
    })
    expect(screen.getByRole('region', { name: 'Service acme-store' })).toBeTruthy()
    expect(screen.queryByRole('region', { name: 'Policy edge-policy' })).toBeNull()
    expect(
      screen.getByText(
        'This release reaches 1 project in 1 environment through 1 Deployment Setting.'
      )
    ).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: /Deploy release/ }))
    const dialog = await screen.findByRole('alertdialog')
    const confirm = Array.from(dialog.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Deploy release'
    )
    await fireEvent.click(confirm as HTMLButtonElement)
    const [event, deployed] = view.emitted('deploy')?.[0] as [MouseEvent, ReleaseImpactResource[]]
    expect(event).toBeInstanceOf(MouseEvent)
    expect(deployed.map((resource) => resource.name)).toEqual(['acme-store'])
  })

  it('emits retry from the unavailable impact and shows the failed run from deployError', async () => {
    const view = render(ReleaseImpact, {
      props: {
        error: 'The impact could not be read.',
        deployError: 'edge-policy was refused.'
      }
    })
    expect(screen.getByText(/The release wasn't deployed\. edge-policy was refused\./)).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
  })

  it('selects settings with an overflow chip and a no-match EmptyState', async () => {
    render(ReleaseImpactSettings)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Select Deployment Settings' })
    ).toBeTruthy()
    await fireEvent.update(
      screen.getByRole('textbox', { name: 'Search Deployment Settings' }),
      'nothing-like-this'
    )
    expect(screen.getByText('No Deployment Settings match')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.queryByText('No Deployment Settings match')).toBeNull()
  })
})
