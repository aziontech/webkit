import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import DeploySuccess from './deploy-success.vue'

// No story exists for this template — render it directly per .claude/rules/testing.md.
const steps = [
  { title: 'Add a domain', description: 'Point your domain to the edge.', icon: 'ai ai-domains' },
  { title: 'Configure cache', description: 'Tune your cache settings.', icon: 'ai ai-cache' }
]

describe('DeploySuccess', () => {
  it('mounts with its default testid and renders the success title', () => {
    const { getByTestId, getByText } = render(DeploySuccess, {
      props: { steps, title: 'Deploy succeeded' }
    })
    expect(getByTestId('templates-deploy-success')).toBeTruthy()
    expect(getByText('Deploy succeeded')).toBeTruthy()
  })

  it('lets a consumer data-testid override the fallback', () => {
    const { getByTestId } = render(DeploySuccess, {
      props: { steps },
      attrs: { 'data-testid': 'my-deploy' }
    })
    expect(getByTestId('my-deploy')).toBeTruthy()
  })

  it('emits action-click when the primary action is pressed', async () => {
    const { getByTestId, emitted } = render(DeploySuccess, { props: { steps } })
    await fireEvent.click(getByTestId('templates-deploy-success__action'))
    expect(emitted()['action-click']).toBeTruthy()
  })

  it('has no structural a11y violations', async () => {
    const { container } = render(DeploySuccess, { props: { steps } })
    await expectNoA11yViolations(container)
  })
})
