import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import AgentActivityDefault from '../../../../examples/agent-activity/default.vue'
import AgentActivityStatuses from '../../../../examples/agent-activity/statuses.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import type { AgentActivityStep } from './agent-activity.vue'
import AgentActivity from './agent-activity.vue'

const steps: AgentActivityStep[] = [
  { key: 'search', title: 'Searching the docs', status: 'success' },
  { key: 'read', title: 'Reading 3 files', status: 'running', description: 'cache-settings.md' },
  { key: 'write', title: 'Writing the answer', status: 'pending' }
]

afterEach(() => {
  vi.useRealTimers()
})

describe('AgentActivity', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(AgentActivity, { props: { steps } }).getByTestId('agent-activity')).toBeTruthy()
    expect(
      render(AgentActivity, { props: { steps }, attrs: { 'data-testid': 'mine' } }).getByTestId(
        'mine'
      )
    ).toBeTruthy()
  })

  it('shows only the running step while collapsed, with its status word', () => {
    const { getAllByTestId, getByTestId } = render(AgentActivity, { props: { steps } })
    const rows = getAllByTestId('agent-activity__step')
    expect(rows).toHaveLength(1)
    expect(rows[0]).toHaveTextContent('Reading 3 files, Running')
    expect(rows[0]).toHaveTextContent('cache-settings.md')
    expect(rows[0]).toHaveAttribute('aria-current', 'step')
    expect(rows[0]).toHaveAttribute('data-status', 'running')
    expect(getByTestId('agent-activity')).toHaveAttribute('data-status', 'running')
    expect(getByTestId('agent-activity')).toHaveAttribute('data-state', 'closed')
  })

  it('falls back to the last step when nothing runs', () => {
    const done = steps.map((step) => ({ ...step, status: 'success' as const }))
    const { getAllByTestId, getByTestId } = render(AgentActivity, { props: { steps: done } })
    expect(getAllByTestId('agent-activity__step')[0]).toHaveTextContent('Writing the answer, Done')
    expect(getByTestId('agent-activity')).toHaveAttribute('data-status', 'success')
  })

  it('shows the failed step of a failed run, not the canceled ones after it', () => {
    const failed: AgentActivityStep[] = [
      steps[0]!,
      { ...steps[1]!, status: 'error' },
      { ...steps[2]!, status: 'canceled' }
    ]
    const { getAllByTestId, getByTestId } = render(AgentActivity, { props: { steps: failed } })
    expect(getAllByTestId('agent-activity__step')[0]).toHaveTextContent('Reading 3 files, Failed')
    expect(getByTestId('agent-activity')).toHaveAttribute('data-status', 'error')
    expect(getByTestId('agent-activity__status').textContent?.trim()).toBe('')
  })

  it('expands the step list by keyboard and emits update:open', async () => {
    const { getByRole, getAllByTestId, getByTestId, emitted } = render(AgentActivity, {
      props: { steps }
    })
    const toggle = getByRole('button', { name: '3 steps' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', getByTestId('agent-activity__steps').id)
    toggle.focus()
    await userEvent.keyboard('{Enter}')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(getAllByTestId('agent-activity__step')).toHaveLength(3)
    expect(emitted('update:open')?.[0]).toEqual([true])
    await userEvent.keyboard(' ')
    expect(getAllByTestId('agent-activity__step')).toHaveLength(1)
  })

  it('starts from defaultOpen when unbound and follows the parent when bound', async () => {
    const free = render(AgentActivity, { props: { steps, defaultOpen: true } })
    expect(free.getAllByTestId('agent-activity__step')).toHaveLength(3)
    free.unmount()
    const bound = render(AgentActivity, {
      props: { steps, open: false, 'onUpdate:open': () => undefined }
    })
    await userEvent.click(bound.getByRole('button'))
    expect(bound.emitted('update:open')?.[0]).toEqual([true])
    expect(bound.getAllByTestId('agent-activity__step')).toHaveLength(1)
    await bound.rerender({ steps, open: true, 'onUpdate:open': () => undefined })
    expect(bound.getAllByTestId('agent-activity__step')).toHaveLength(3)
  })

  it('has no toggle for a single step and renders empty with no steps', () => {
    const one = render(AgentActivity, { props: { steps: [steps[1]!] } })
    expect(one.queryByRole('button')).toBeNull()
    expect(one.getByTestId('agent-activity')).not.toHaveAttribute('data-state')
    one.unmount()
    const none = render(AgentActivity)
    expect(none.queryAllByTestId('agent-activity__step')).toHaveLength(0)
    expect(none.getByTestId('agent-activity')).not.toHaveAttribute('data-status')
  })

  it('names the group from the catalog or ariaLabel', () => {
    expect(render(AgentActivity, { props: { steps } }).getByRole('group')).toHaveAccessibleName(
      'Agent activity'
    )
    expect(
      render(AgentActivity, { props: { steps, ariaLabel: 'Deploy agent' } }).getAllByRole(
        'group'
      )[1]
    ).toHaveAccessibleName('Deploy agent')
  })

  it('announces a running step only after it stays current for a second', async () => {
    vi.useFakeTimers()
    const { getByTestId, rerender } = render(AgentActivity, {
      props: { steps: [{ key: 'a', title: 'Searching the docs', status: 'running' }] }
    })
    const live = getByTestId('agent-activity__status')
    expect(live).toHaveAttribute('aria-live', 'polite')
    await rerender({
      steps: [
        { key: 'a', title: 'Searching the docs', status: 'success' },
        { key: 'b', title: 'Reading 3 files', status: 'running' }
      ]
    })
    await vi.advanceTimersByTimeAsync(400)
    await rerender({
      steps: [
        { key: 'a', title: 'Searching the docs', status: 'success' },
        { key: 'b', title: 'Reading 3 files', status: 'success' },
        { key: 'c', title: 'Writing the answer', status: 'running' }
      ]
    })
    await vi.advanceTimersByTimeAsync(400)
    expect(live.textContent?.trim()).toBe('')
    await vi.advanceTimersByTimeAsync(700)
    expect(live).toHaveTextContent('Writing the answer')
  })

  it('announces the outcome once: finished or the failed step', async () => {
    const done = render(AgentActivity, { props: { steps } })
    await done.rerender({ steps: steps.map((step) => ({ ...step, status: 'success' })) })
    expect(done.getByTestId('agent-activity__status')).toHaveTextContent('Finished 3 steps')
    done.unmount()
    const failed = render(AgentActivity, { props: { steps } })
    await failed.rerender({
      steps: [steps[0]!, { ...steps[1]!, status: 'error' }, { ...steps[2]!, status: 'canceled' }]
    })
    expect(failed.getByTestId('agent-activity__status')).toHaveTextContent(
      'Failed: Reading 3 files'
    )
  })

  it('announces a stopped run as stopped, never as finished', async () => {
    const stopped = render(AgentActivity, { props: { steps } })
    await stopped.rerender({
      steps: [steps[0]!, { ...steps[1]!, status: 'canceled' }, { ...steps[2]!, status: 'skipped' }]
    })
    const live = stopped.getByTestId('agent-activity__status')
    expect(live).toHaveTextContent('Stopped after 1 step')
    expect(live).not.toHaveTextContent('Finished')
    expect(stopped.getByTestId('agent-activity')).toHaveAttribute('data-status', 'canceled')
    expect(stopped.getAllByTestId('agent-activity__step')[0]).toHaveTextContent(
      'Reading 3 files, Canceled'
    )
  })

  it('still announces a step that keeps running after another one failed', async () => {
    vi.useFakeTimers()
    const { getByTestId, rerender } = render(AgentActivity, {
      props: {
        steps: [
          { key: 'a', title: 'Purging the cache', status: 'running' },
          { key: 'b', title: 'Retrying the purge', status: 'pending' }
        ]
      }
    })
    await rerender({
      steps: [
        { key: 'a', title: 'Purging the cache', status: 'error' },
        { key: 'b', title: 'Retrying the purge', status: 'running' }
      ]
    })
    const live = getByTestId('agent-activity__status')
    expect(live).toHaveTextContent('Failed: Purging the cache')
    await vi.advanceTimersByTimeAsync(1100)
    expect(live).toHaveTextContent('Retrying the purge')
  })

  it('announces nothing for a run that was already over at mount', () => {
    const history = render(AgentActivity, {
      props: { steps: steps.map((step) => ({ ...step, status: 'success' as const })) }
    })
    expect(history.getByTestId('agent-activity__status').textContent?.trim()).toBe('')
  })

  it('gives every status its word and mutes the ones that did not run', () => {
    const { getAllByTestId } = render(AgentActivityStatuses)
    const rows = getAllByTestId('agent-activity__step')
    const words = ['Done', 'Failed', 'Running', 'Canceled', 'Skipped', 'Pending']
    expect(rows.map((row) => row.getAttribute('data-status'))).toEqual([
      'success',
      'error',
      'running',
      'canceled',
      'skipped',
      'pending'
    ])
    rows.forEach((row, index) => expect(row).toHaveTextContent(words[index]!))
  })

  it('pairs the chevron motion with a reduced-motion escape', () => {
    const { container } = render(AgentActivity, { props: { steps } })
    const chevron = container.querySelector('.az-chevron-down')
    expect(chevron?.className).toContain('motion-reduce:transition-none')
  })

  it('keeps titles in their own direction under rtl', () => {
    const { getAllByTestId } = render(AgentActivity, {
      props: { steps },
      attrs: { dir: 'rtl' }
    })
    expect(getAllByTestId('agent-activity__step')[0]!.querySelector('[dir="auto"]')).toBeTruthy()
  })

  it('has no a11y violations, collapsed and open', async () => {
    const collapsed = render(AgentActivityDefault)
    await expectNoA11yViolations(collapsed.container)
    collapsed.unmount()
    const open = render(AgentActivityStatuses)
    await expectNoA11yViolations(open.container)
  })
})
