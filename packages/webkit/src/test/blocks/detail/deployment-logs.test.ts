import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DeploymentLogs from '../../../../blocks/detail/deployment-logs/deployment-logs.vue'
import DeploymentDetail from '../../../../blocks/detail/deployment-logs/variants/deployment-detail.vue'
import DeploymentError from '../../../../blocks/detail/deployment-logs/variants/deployment-error.vue'
import DeploymentQueued from '../../../../blocks/detail/deployment-logs/variants/deployment-queued.vue'
import DeploymentLogsFailed from '../../../../blocks/detail/deployment-logs/variants/error.vue'
import InCreateFlow from '../../../../blocks/detail/deployment-logs/variants/in-create-flow.vue'
import InCreateFlowError from '../../../../blocks/detail/deployment-logs/variants/in-create-flow-error.vue'
import AsyncSubmitFailed from '../../../../blocks/state/async-submit/variants/error.vue'
import AsyncSubmitRunning from '../../../../blocks/state/async-submit/variants/running.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())
describe('detail/deployment-logs', () => {
  it('derives the progress from the steps and shows no time for steps that never ran', () => {
    const view = render(DeploymentLogs)
    const root = view.container as HTMLElement
    expect(view.getByRole('heading', { name: 'Deployment logs', level: 2 })).toBeTruthy()
    expect(within(root).getByRole('status').textContent).toMatch(/3\/8 steps\s*Build/)
    expect(view.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('38')
    const publish = within(root).getByText('Publish').closest('button') as HTMLElement
    expect(publish.textContent).not.toMatch(/\d+s/)
  })

  it('announces the run in one status region and gives every step its status in words', () => {
    const view = render(DeploymentLogs)
    expect(within(view.container as HTMLElement).getAllByRole('status')).toHaveLength(1)
    const triggers = view.getAllByRole('button', { expanded: false })
    expect(triggers.some((trigger) => /Done/.test(trigger.textContent ?? ''))).toBe(true)
    expect(triggers.some((trigger) => /Not started/.test(trigger.textContent ?? ''))).toBe(true)
    expect(view.getByRole('button', { expanded: true }).textContent).toContain('Running')
  })

  it.each([
    ['Running', DeploymentLogs],
    ['Failed', DeploymentLogsFailed],
    ['InCreateFlowError', InCreateFlowError],
    ['DeploymentDetail', DeploymentDetail],
    ['DeploymentError', DeploymentError],
    ['async-submit Running', AsyncSubmitRunning],
    ['async-submit Failed', AsyncSubmitFailed]
  ])('%s composes LogView.Steps for its phased steps', (_name, block) => {
    const view = render(block)
    expect(view.container.querySelector('[data-testid="code-log-view__steps"]')).toBeTruthy()
  })

  it('opens a failed run on the failed step and says why the next one never ran', async () => {
    const view = render(DeploymentLogsFailed)
    expect(view.getByRole('button', { expanded: true }).textContent).toContain('Routing Rules')
    await fireEvent.click(within(view.container as HTMLElement).getByText('Publish'))
    await waitFor(() =>
      expect(view.container.textContent).toContain(
        'Never ran. The deployment stopped at Routing Rules.'
      )
    )
  })

  it('InCreateFlow opens on the cloning splash with a Cloning status', () => {
    const view = render(InCreateFlow)
    expect(view.container.textContent).toContain('Cloning acme/web-app to acme')
    expect(view.container.textContent).toContain('Cloning')
  })

  it('InCreateFlowError ends a failure with Edit and Redeploy', async () => {
    const view = render(InCreateFlowError)
    expect(view.getByRole('link', { name: 'Edit' })).toBeTruthy()
    expect(view.getAllByLabelText('Log view')).toHaveLength(1)
    await fireEvent.click(view.getByRole('button', { name: 'Redeploy' }))
    expect(view.queryByLabelText('Log view')).toBeNull()
    expect(view.container.textContent).toContain('Redeploying')
  })

  it('DeploymentQueued shows a not-started state with no view switch', () => {
    const view = render(DeploymentQueued)
    expect(view.container.textContent).toContain('Queued, not started')
    expect(view.queryByLabelText('Log view')).toBeNull()
  })
})
