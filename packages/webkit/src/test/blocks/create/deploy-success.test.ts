import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import DeploySuccess from '../../../../blocks/create/deploy-success/deploy-success.vue'
import DeploySuccessCli from '../../../../blocks/create/deploy-success/variants/cli-created.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('deploy-success', () => {
  it('links the domain and repository with Link and the next steps with integration Cards', async () => {
    const view = render(DeploySuccess)
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
  })
})
