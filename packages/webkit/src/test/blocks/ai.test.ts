import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import AiActionApproval, {
  type AiActionApprovalAction
} from '../../../blocks/ai/ai-action-approval/ai-action-approval.vue'
import { sampleAction, sampleOutcomes } from '../../../blocks/ai/ai-action-approval/sample'
import AiChatDrawer from '../../../blocks/ai/ai-chat-drawer/ai-chat-drawer.vue'

afterEach(() => cleanup())
describe('ai', () => {
  it('ai-action-approval Failed: says what failed and emits retry from Retry', async () => {
    const view = render(AiActionApproval, {
      props: { decision: 'approved', run: 'error', outcome: sampleOutcomes.failed }
    })
    expect(view.container.textContent).toContain('still serves the previous version')
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    const [[event, action]] = view.emitted('retry') as [[Event, AiActionApprovalAction]]
    expect(event).toBeInstanceOf(Event)
    expect(action.command).toContain('azion deploy')
  })

  it('ai-action-approval renders the action it is given and emits approve', async () => {
    const action: AiActionApprovalAction = {
      ...sampleAction,
      request: 'Purge the cache of acme-store',
      title: 'Allow `azion purge`?',
      approveLabel: 'Purge',
      command: 'azion purge urls --urls https://example.com/'
    }
    const view = render(AiActionApproval, { props: { action } })
    expect(view.container.textContent).toContain('Purge the cache of acme-store')
    expect(view.container.textContent).not.toContain('Deploy the current build')
    await fireEvent.click(view.getByRole('button', { name: 'Purge' }))
    const [[event, approved]] = view.emitted('approve') as [[Event, AiActionApprovalAction]]
    expect(event).toBeInstanceOf(Event)
    expect(approved.command).toBe('azion purge urls --urls https://example.com/')
    expect(view.emitted('update:decision')).toEqual([['approved']])
    expect(view.container.textContent).not.toContain('storefront is live')
  })

  it('ai-chat-drawer renders the messages it is given and emits new-chat', async () => {
    const view = render(AiChatDrawer, {
      props: {
        messages: [
          { id: 'u1', from: 'user', content: 'Is shop.example.com cached?', time: '08:00' },
          { id: 'a1', from: 'assistant', content: 'Yes, at a 91% hit ratio.', time: '08:01' }
        ]
      }
    })
    await waitFor(() => expect(document.body.textContent).toContain('Yes, at a 91% hit ratio.'))
    expect(document.body.textContent).not.toContain('reads this workload')
    await fireEvent.click(document.querySelector<HTMLElement>('[aria-label="New chat"]')!)
    expect(view.emitted('new-chat')).toHaveLength(1)
  })

  it('ai-chat-drawer opens the assistant from Agent without dimming the page', async () => {
    const view = render(AiChatDrawer)
    await fireEvent.click(view.getByRole('button', { name: 'Agent' }))
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    expect(document.querySelector('[data-testid$="__backdrop"]')).toBeNull()
  })
})
