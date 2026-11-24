import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import type { ReleaseImpactResource } from '../../../../blocks/create/create-release-impact/create-release-impact.vue'
import CreateReleaseImpact from '../../../../blocks/create/create-release-impact/create-release-impact.vue'
import ReleaseImpactSettings from '../../../../blocks/create/create-release-impact/variants/choose-settings.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('create-release-impact', () => {
  it('names each resource card and shows the fixed resource names as text, not fields', async () => {
    const view = render(CreateReleaseImpact)
    expect(screen.getByRole('heading', { level: 1, name: 'Review and deploy' })).toBeTruthy()
    const regions = screen.getAllByRole('region')
    expect(regions.length).toBeGreaterThan(1)
    expect(screen.queryAllByRole('textbox', { name: 'Resource' })).toHaveLength(0)
    expect(view.getAllByTestId('release-resource-card__resource').length).toBeGreaterThan(0)
    const kept = view.getByTestId('release-resource-card__kept')
    expect(kept.textContent).toContain('web-app-assets')
    expect(kept.textContent).toContain('AJ2B4D6F')
    expect(kept.querySelector('button, input, [role="combobox"]')).toBeNull()
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
        versions: [{ id: 'BX1Y2Z3A', current: true, builtAt: '2026-11-10T11:00:00Z' }],
        groups: []
      }
    ]
    const view = render(CreateReleaseImpact, {
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
    const view = render(CreateReleaseImpact, {
      props: {
        error: 'The impact could not be read.',
        deployError: 'edge-policy was refused.'
      }
    })
    expect(screen.getByText(/The release wasn't deployed\. edge-policy was refused\./)).toBeTruthy()
    await new Promise((resolve) => setTimeout(resolve, 100))
    const toasts = Array.from(document.querySelectorAll('[data-toast-id]'))
    expect(toasts.some((toast) => toast.textContent?.includes("wasn't deployed"))).toBe(false)
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

const apple = /mac/i.test(navigator.platform || navigator.userAgent)
const pressShortcut = (key: string, target: Element = document.body) => {
  const event = new KeyboardEvent('keydown', {
    key,
    metaKey: apple,
    ctrlKey: !apple,
    bubbles: true,
    cancelable: true
  })
  target.dispatchEvent(event)
  return event
}

describe('create-release-impact keyboard', () => {
  it('opens the deploy confirmation on Command Enter', async () => {
    render(CreateReleaseImpact)
    const deploy = screen.getByRole('button', { name: /Deploy release/ })
    expect(deploy.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
    expect(pressShortcut('Enter').defaultPrevented).toBe(true)
    expect(await screen.findByRole('alertdialog')).toBeTruthy()
  })
})
