import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import AiActionApproval, {
  type AiActionApprovalMessage,
  type AiActionApprovalToolCallPart
} from '../../../blocks/ai/ai-action-approval/ai-action-approval.vue'
import {
  sampleDeleteMessages,
  sampleFailedMessages,
  sampleRunningMessages,
  sampleTools
} from '../../../blocks/ai/ai-action-approval/sample'
import AiChatDrawer from '../../../blocks/ai/ai-chat-drawer/ai-chat-drawer.vue'

afterEach(() => cleanup())
describe('ai', () => {
  it('ai-action-approval Error: says what failed and emits retry from Retry', async () => {
    const view = render(AiActionApproval, {
      props: { messages: sampleFailedMessages, tools: sampleTools }
    })
    expect(view.container.textContent).toContain('still serves the previous version')
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    const [[event, message]] = view.emitted('retry') as [[Event, AiActionApprovalMessage]]
    expect(event).toBeInstanceOf(Event)
    expect(message.id).toBe('m2')
  })

  it('ai-action-approval renders the conversation it is given and emits approve', async () => {
    const purge: AiActionApprovalToolCallPart = {
      type: 'tool-call',
      id: 'call-purge',
      name: 'purge_urls',
      arguments: '{"urls":["https://example.com/"]}',
      input: { urls: ['https://example.com/'] },
      state: 'approval-requested',
      approval: { id: 'approval-purge', needsApproval: true }
    }
    const resolved: boolean[] = []
    const view = render(AiActionApproval, {
      props: {
        messages: [
          {
            id: 'u1',
            role: 'user',
            parts: [{ type: 'text', content: 'Purge the cache of acme-store' }]
          },
          { id: 'a1', role: 'assistant', parts: [purge] }
        ],
        tools: {
          purge_urls: {
            title: 'Purging acme-store',
            question: 'Allow `azion purge`?',
            approveLabel: 'Purge'
          }
        },
        interrupts: [
          {
            kind: 'tool-approval',
            toolCallId: 'call-purge',
            resolveInterrupt: (approved: boolean) => resolved.push(approved)
          }
        ]
      }
    })
    expect(view.container.textContent).toContain('Purge the cache of acme-store')
    expect(view.container.textContent).not.toContain('Deploy the current build')
    await fireEvent.click(view.getByRole('button', { name: 'Purge' }))
    const [[event, call]] = view.emitted('approve') as [[Event, AiActionApprovalToolCallPart]]
    expect(event).toBeInstanceOf(Event)
    expect(call.id).toBe('call-purge')
    expect(resolved).toEqual([true])
  })

  it('ai-action-approval Deny resolves the interrupt with false', async () => {
    const resolved: boolean[] = []
    const view = render(AiActionApproval, {
      props: {
        interrupts: [
          {
            kind: 'tool-approval',
            toolCallId: 'call-deploy',
            resolveInterrupt: (approved: boolean) => resolved.push(approved)
          }
        ]
      }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Deny' }))
    expect(view.emitted('deny')).toHaveLength(1)
    expect(resolved).toEqual([false])
  })

  it('ai-action-approval Irreversible keeps Delete disabled until the name is typed', () => {
    const view = render(AiActionApproval, {
      props: { messages: sampleDeleteMessages, tools: sampleTools }
    })
    expect(view.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('ai-action-approval Running shows Stop and emits stop', async () => {
    const view = render(AiActionApproval, {
      props: { messages: sampleRunningMessages, tools: sampleTools, loading: true }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Stop generating' }))
    expect(view.emitted('stop')).toHaveLength(1)
  })

  it('ai-chat-drawer renders the messages it is given and emits new-chat', async () => {
    const view = render(AiChatDrawer, {
      props: {
        messages: [
          {
            id: 'u1',
            role: 'user',
            parts: [{ type: 'text', content: 'Is shop.example.com cached?' }]
          },
          {
            id: 'a1',
            role: 'assistant',
            parts: [{ type: 'text', content: 'Yes, at a 91% hit ratio.' }]
          }
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

  it('ai-action-approval passes the edited arguments of an editable tool', async () => {
    const calls: unknown[][] = []
    const view = render(AiActionApproval, {
      props: {
        messages: [
          { id: 'u1', role: 'user', parts: [{ type: 'text', content: 'Purge acme-store' }] },
          {
            id: 'a1',
            role: 'assistant',
            parts: [
              {
                type: 'tool-call',
                id: 'call-purge',
                name: 'purge_urls',
                arguments: '{"urls":["https://example.com/"]}',
                state: 'approval-requested',
                approval: { id: 'approval-purge', needsApproval: true }
              }
            ]
          }
        ],
        tools: { purge_urls: { title: 'Purging', approveLabel: 'Purge', editable: true } },
        interrupts: [
          {
            kind: 'tool-approval',
            toolCallId: 'call-purge',
            resolveInterrupt: (...args: unknown[]) => calls.push(args)
          }
        ]
      }
    })
    const approval = view.container.querySelector<HTMLElement>('[data-testid="tool-approval"]')!
    const field = within(approval).getByRole('textbox') as HTMLTextAreaElement
    await fireEvent.update(field, '{"urls":["https://example.com/a"]}')
    await fireEvent.click(view.getByRole('button', { name: 'Purge' }))
    expect(calls).toEqual([[true, { editedArgs: { urls: ['https://example.com/a'] } }]])
  })

  it('ai-chat-drawer draws media parts, the queue and the connection notice', async () => {
    const view = render(AiChatDrawer, {
      props: {
        messages: [
          { id: 'u1', role: 'user', parts: [{ type: 'text', content: 'Chart it' }] },
          {
            id: 'a1',
            role: 'assistant',
            parts: [
              { type: 'image', source: { type: 'url', value: 'https://example.com/a.png' } },
              { type: 'audio', source: { type: 'url', value: 'https://example.com/a.webm' } }
            ]
          }
        ],
        queue: [{ id: 'w1', content: 'Then purge it' }],
        connection: 'disconnected'
      }
    })
    await waitFor(() =>
      expect(document.querySelector('[data-testid="image-gallery"]')).not.toBeNull()
    )
    expect(document.querySelector('[data-testid="audio-player"]')).not.toBeNull()
    expect(document.body.textContent).toContain('Then purge it')
    expect(document.body.textContent).toContain('Connection lost')
    await fireEvent.click(document.querySelector<HTMLElement>('[aria-label^="Remove"]')!)
    expect(view.emitted('remove-queued')).toHaveLength(1)
  })
})
