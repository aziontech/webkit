import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import CreateDeploySuccess from '../../../../blocks/create/create-deploy-success/create-deploy-success.vue'
import DeploySuccessCli from '../../../../blocks/create/create-deploy-success/variants/cli-created.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('create-deploy-success', () => {
  it('links the domain and repository with Link and the next steps with `IntegrationCard`s', async () => {
    const view = render(CreateDeploySuccess)
    const domain = screen.getByRole('link', { name: /web-app-k3x9q2\.example\.com/ })
    expect(domain.getAttribute('target')).toBe('_blank')
    expect(domain.getAttribute('rel')).toBe('noopener noreferrer')
    expect(screen.getByRole('link', { name: /acme\/web-app/ }).getAttribute('target')).toBe(
      '_blank'
    )
    expect(screen.getByRole('link', { name: 'Customize domain' }).getAttribute('href')).toBe(
      'https://example.com/docs'
    )
    expect(screen.getByRole('heading', { name: 'Resources' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Manage service' })).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('makes the in-place next step a button tile', () => {
    render(DeploySuccessCli)
    expect(screen.getByRole('button', { name: 'Deploy this resource' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Deploy using a new service' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Visit site' })).toBeNull()
    expect(screen.getByRole('heading', { name: 'Get started' })).toBeTruthy()
  })

  it('ends on Manage resource when nothing serves the resource yet', () => {
    render(DeploySuccessCli)
    expect(screen.getByRole('button', { name: 'Manage resource' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Manage service' })).toBeNull()
  })

  it('draws no empty preview tile and stacks the next steps one per row', () => {
    const view = render(CreateDeploySuccess)
    const heading = screen.getByRole('heading', { name: 'web-app' })
    const card = heading.closest('[data-testid="card"]') as HTMLElement
    expect(card.querySelector('[aria-hidden="true"] .az-globe')).toBeNull()
    const steps = view.container.querySelector(
      '[data-testid="create-deploy-success__next-steps"]'
    ) as HTMLElement
    expect(steps.className).toContain('grid-cols-1')
    expect(steps.className).not.toContain('sm:grid-cols-3')
  })

  it('renders the records it is given and emits the next step and manage', async () => {
    const step = { icon: 'az az-box', title: 'Open the store', description: 'Go to the store.' }
    const view = render(CreateDeploySuccess, {
      props: {
        deployment: {
          name: 'acme-store',
          created: 'Created 2 minutes ago',
          domain: 'store.example.com',
          url: 'https://store.example.com',
          addDomainHref: '/services/1?tab=settings'
        },
        resources: [
          {
            key: 'store',
            kind: 'Storage',
            icon: 'az az-inbox',
            name: 'acme-assets',
            state: 'bound',
            reference: '3 files'
          }
        ],
        nextSteps: [step]
      }
    })
    expect(screen.getByRole('heading', { name: 'acme-store' })).toBeTruthy()
    expect(screen.getByText('Bound')).toBeTruthy()
    expect(screen.queryByText('web-app-assets')).toBeNull()
    expect(screen.queryByText('Source:', { exact: false })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Get started' })).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Open the store' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Manage service' }))
    const emitted = view.emitted()
    expect((emitted['next-step'][0] as unknown[])[1]).toEqual(step)
    expect(emitted.manage).toHaveLength(1)
  })
})
