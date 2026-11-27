import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DetailDeploymentLogs, {
  type DeploymentLogsStep
} from '../../../../blocks/detail/detail-deployment-logs/detail-deployment-logs.vue'
import {
  sampleFailedSteps,
  sampleSteps,
  sampleSucceededSteps
} from '../../../../blocks/detail/detail-deployment-logs/sample'
import DeploymentDetail from '../../../../blocks/detail/detail-deployment-logs/variants/deployment-detail.vue'
import DeploymentError from '../../../../blocks/detail/detail-deployment-logs/variants/deployment-error.vue'
import DeploymentQueued from '../../../../blocks/detail/detail-deployment-logs/variants/deployment-queued.vue'
import DeploymentLogsFailed from '../../../../blocks/detail/detail-deployment-logs/variants/error.vue'
import InCreateFlow from '../../../../blocks/detail/detail-deployment-logs/variants/in-create-flow.vue'
import InCreateFlowError from '../../../../blocks/detail/detail-deployment-logs/variants/in-create-flow-error.vue'
import AsyncSubmitFailed from '../../../../blocks/state/state-async-submit/variants/error.vue'
import AsyncSubmitRunning from '../../../../blocks/state/state-async-submit/variants/running.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())
describe('detail/detail-deployment-logs', () => {
  it('derives the progress from the steps and shows no time for steps that never ran', () => {
    const view = render(DetailDeploymentLogs)
    const root = view.container as HTMLElement
    expect(view.getByRole('heading', { name: 'Deployment logs', level: 2 })).toBeTruthy()
    expect(within(root).getByRole('status').textContent).toMatch(/3\/8 steps\s*Build/)
    expect(view.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('38')
    const publish = within(root).getByText('Publish').closest('button') as HTMLElement
    expect(publish.textContent).not.toMatch(/\d+s/)
  })

  it('announces the run in one status region and gives every step its status in words', () => {
    const view = render(DetailDeploymentLogs)
    expect(within(view.container as HTMLElement).getAllByRole('status')).toHaveLength(1)
    const triggers = view.getAllByRole('button', { expanded: false })
    expect(triggers.some((trigger) => /Done/.test(trigger.textContent ?? ''))).toBe(true)
    expect(triggers.some((trigger) => /Not started/.test(trigger.textContent ?? ''))).toBe(true)
    expect(view.getByRole('button', { expanded: true }).textContent).toContain('Running')
  })

  it.each([
    ['Running', DetailDeploymentLogs],
    ['Failed', DeploymentLogsFailed],
    ['InCreateFlowError', InCreateFlowError],
    ['DeploymentDetail', DeploymentDetail],
    ['DeploymentError', DeploymentError],
    ['state-async-submit Running', AsyncSubmitRunning],
    ['state-async-submit Failed', AsyncSubmitFailed]
  ])('%s composes LogViewer.Steps for its phased steps', (_name, block) => {
    const view = render(block)
    expect(view.container.querySelector('[data-testid="log-viewer-steps"]')).toBeTruthy()
  })

  it('opens a failed run on the failed step and says why the next one never ran', async () => {
    const view = render(DeploymentLogsFailed)
    expect(view.getByRole('button', { expanded: true }).textContent).toContain('Routing rules')
    await fireEvent.click(within(view.container as HTMLElement).getByText('Publish'))
    await waitFor(() =>
      expect(view.container.textContent).toContain(
        'Never ran. The deployment stopped at Routing rules.'
      )
    )
  })

  it('tags the [ERROR] and 409 lines of a failed step as errors, never warnings', () => {
    const view = render(DeploymentLogsFailed)
    const failures = [...view.container.querySelectorAll('[data-testid$="__line"]')].filter((row) =>
      /\[ERROR\]|409 Conflict/.test(row.textContent ?? '')
    )
    expect(failures.length).toBeGreaterThan(0)
    for (const row of failures) expect(row.getAttribute('data-level')).toBe('error')
  })

  it('InCreateFlow opens on the cloning splash with a Cloning status', () => {
    const view = render(InCreateFlow)
    expect(view.container.textContent).toContain('Cloning acme/web-app to acme')
    expect(view.container.textContent).toContain('Cloning')
    expect(view.container.querySelector('template')).toBeNull()
    expect(view.getByText('Cloning acme/web-app to acme').closest('template')).toBeNull()
  })

  it('InCreateFlowError ends a failure with Edit and Redeploy', async () => {
    const view = render(InCreateFlowError)
    expect(view.getByRole('link', { name: 'Edit' })).toBeTruthy()
    expect(view.getAllByLabelText('Log view')).toHaveLength(1)
    await fireEvent.click(view.getByRole('button', { name: 'Redeploy' }))
    expect(view.queryByLabelText('Log view')).toBeNull()
    expect(view.container.textContent).toContain('Redeploying')
  })

  it('renders the steps it is given instead of the sample and reports the open step', async () => {
    const steps: DeploymentLogsStep[] = [
      {
        id: 'fetch',
        title: 'Fetch source',
        description: 'Source pulled from acme/store',
        status: 'success',
        duration: '2s',
        lines: [{ id: '0', time: '09:00:01', type: 'success', message: 'Source pulled' }]
      },
      {
        id: 'compile',
        title: 'Compile',
        description: 'Compiling the storefront',
        status: 'running',
        duration: '5s',
        lines: [{ id: '0', time: '09:00:03', type: 'text', message: 'Compiling 12 modules' }]
      }
    ]
    const view = render(DetailDeploymentLogs, { props: { steps } })
    const root = view.container as HTMLElement
    expect(within(root).getByRole('status').textContent).toMatch(/1\/2 steps\s*Compile/)
    expect(root.textContent).not.toContain('Access token')
    await fireEvent.click(within(root).getByText('Fetch source'))
    expect(view.emitted('update:openStep')?.at(-1)).toEqual(['fetch'])
  })

  it('reads the outcome of a settled run from the step statuses', () => {
    const failed = render(DetailDeploymentLogs, {
      props: { steps: sampleFailedSteps, duration: '9s' }
    })
    expect(failed.container.textContent).toContain('Failed: Routing rules')
    expect(failed.container.textContent).toContain('Failed after 9s')
    expect(failed.container.textContent).not.toMatch(/\d\/8 steps/)
    failed.unmount()
    const done = render(DetailDeploymentLogs, {
      props: { steps: sampleSucceededSteps, duration: '9s' }
    })
    expect(done.container.textContent).toContain('Completed')
    expect(done.container.textContent).toContain('Deployed in 9s')
  })

  it('DeploymentQueued shows a not-started state with no view switch', () => {
    const view = render(DeploymentQueued)
    expect(view.container.textContent).toContain('Queued, not started')
    expect(view.queryByLabelText('Log view')).toBeNull()
  })

  it('keeps a running step free of its finished output and duration', () => {
    const running = sampleSteps.find((step) => step.status === 'running')
    expect(running?.duration).toBe('')
    expect(running?.lines.some((line) => /completed successfully/.test(line.message))).toBe(false)
  })

  it('titles every step in sentence case', () => {
    for (const step of [...sampleSucceededSteps, ...sampleFailedSteps]) {
      expect(step.title.split(' ').slice(1).join(' ')).toBe(
        step.title.split(' ').slice(1).join(' ').toLowerCase()
      )
    }
  })

  it('wraps the log view switch under the whole Deployment logs title instead of cutting it', () => {
    const view = render(DeploymentDetail)
    const title = within(view.container as HTMLElement).getByText('Deployment logs')
    expect(title.classList.contains('truncate')).toBe(false)
    expect(title.parentElement?.classList.contains('flex-wrap')).toBe(true)
  })
})
