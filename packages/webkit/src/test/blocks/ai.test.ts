import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import AiActionApproval from '../../../blocks/ai/ai-action-approval/ai-action-approval.vue'
import {
  sampleDeleteMessages,
  sampleFailedMessages,
  sampleRunningMessages,
  sampleTools
} from '../../../blocks/ai/ai-action-approval/sample'
import AiChatDrawer from '../../../blocks/ai/ai-chat-drawer/ai-chat-drawer.vue'
import type { AiChatInterrupt, AiChatMessage, AiChatToolCallPart } from '../../utils/ai-chat'

afterEach(() => cleanup())
describe('ai', () => {
  it('ai-action-approval Error: says what failed and names the action it re-runs', async () => {
    const view = render(AiActionApproval, {
      props: { messages: sampleFailedMessages, tools: sampleTools }
    })
    expect(view.container.textContent).toContain('still serves the previous version')
    expect(view.queryByRole('button', { name: 'Retry' })).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Deploy again' }))
    const [[event, message]] = view.emitted('retry') as [[Event, AiChatMessage]]
    expect(event).toBeInstanceOf(Event)
    expect(message.id).toBe('m2')
  })

  it('ai-action-approval renders the conversation it is given and emits approve', async () => {
    const purge: AiChatToolCallPart = {
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
    const [[event, call]] = view.emitted('approve') as [[Event, AiChatToolCallPart]]
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

  it('ai-chat-drawer puts focus in the prompt on open, never on New chat', async () => {
    const view = render(AiChatDrawer, {
      props: {
        open: false,
        'onUpdate:open': (open: boolean) => view.rerender({ open }),
        messages: [
          {
            id: 'u1',
            role: 'user' as const,
            parts: [{ type: 'text' as const, content: 'Is it cached?' }]
          },
          {
            id: 'a1',
            role: 'assistant' as const,
            parts: [{ type: 'text' as const, content: 'Yes.' }]
          }
        ]
      }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Agent' }))
    await waitFor(() => expect(document.activeElement?.tagName).toBe('TEXTAREA'))
    expect(document.activeElement?.getAttribute('aria-label')).not.toBe('New chat')
  })

  it('ai-chat-drawer opens the assistant from Agent without dimming the page', async () => {
    const view = render(AiChatDrawer)
    await fireEvent.click(view.getByRole('button', { name: 'Agent' }))
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    expect(document.querySelector('[data-testid$="__backdrop"]')).toBeNull()
    const page = view.container.firstElementChild as HTMLElement
    expect(page.hasAttribute('data-drawer-open')).toBe(true)
    expect(page.classList.contains('lg:data-drawer-open:pe-[max(30vw,var(--container-md))]')).toBe(
      true
    )
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
        connection: 'error'
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

  it('ai-chat-drawer attaches files, restores, answers tools and retries interrupts', async () => {
    const view = render(AiChatDrawer, {
      props: {
        attachable: true,
        hydrating: true,
        interruptErrors: [{ message: 'The server did not answer.', retryable: true }]
      }
    })
    await waitFor(() =>
      expect(
        document.querySelector('[role="status"][aria-label="Loading the conversation"]')
      ).not.toBeNull()
    )
    await fireEvent.click(within(document.body).getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry-interrupts')).toHaveLength(1)
    await view.rerender({
      attachable: true,
      hydrating: false,
      sessionGenerating: true,
      messages: [
        { id: 'u1', role: 'user', parts: [{ type: 'text', content: 'Pick a region' }] },
        {
          id: 'a1',
          role: 'assistant',
          parts: [
            {
              type: 'tool-call',
              id: 'call-3',
              name: 'pick_region',
              arguments: '{}',
              state: 'input-complete'
            },
            {
              type: 'structured-output',
              status: 'complete',
              raw: '{}',
              data: { region: 'us-east' }
            }
          ]
        }
      ],
      tools: {
        pick_region: { title: 'Picking a region', question: 'Which region?', answerable: true }
      }
    })
    expect(document.body.textContent).toContain('Responding in another tab')
    expect(document.body.textContent).toContain('"region": "us-east"')
    const card = within(within(document.body).getByRole('group', { name: 'Which region?' }))
    await fireEvent.update(card.getByRole('textbox'), 'us-east')
    await fireEvent.click(card.getByRole('button', { name: 'Submit' }))
    expect(view.emitted<unknown[]>('answer-tool')?.[0]?.[1]).toEqual({
      toolCallId: 'call-3',
      tool: 'pick_region',
      output: 'us-east'
    })
    const input = document.querySelector<HTMLInputElement>(
      '[data-testid="prompt-input-attach-button__input"]'
    )!
    const transfer = new DataTransfer()
    transfer.items.add(new File(['hello'], 'notes.pdf', { type: 'application/pdf' }))
    input.files = transfer.files
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await waitFor(() =>
      expect(document.querySelector('[data-testid="prompt-input__files"]')).not.toBeNull()
    )
    await fireEvent.click(
      document.querySelector<HTMLElement>('[data-testid="prompt-input__submit"]')!
    )
    await waitFor(() => expect(view.emitted('send')).toHaveLength(1))
    expect(view.emitted<unknown[]>('send')?.[0]?.[1]).toEqual({
      content: [
        {
          type: 'document',
          source: { type: 'data', value: 'aGVsbG8=', mimeType: 'application/pdf' },
          metadata: { name: 'notes.pdf' }
        }
      ]
    })
  })

  it('ai-action-approval draws structured and rich tool results, unbound approvals and interrupt errors', async () => {
    const workflow: AiChatInterrupt = {
      kind: 'unbound',
      id: 'wf-2',
      message: 'Approve the change window?',
      status: 'pending',
      errors: []
    }
    const view = render(AiActionApproval, {
      props: {
        messages: [
          { id: 'u1', role: 'user', parts: [{ type: 'text', content: 'Chart the errors' }] },
          {
            id: 'a1',
            role: 'assistant',
            parts: [
              { type: 'tool-call', id: 'c1', name: 'chart', arguments: '{}', state: 'complete' },
              {
                type: 'tool-result',
                toolCallId: 'c1',
                state: 'complete',
                content: [
                  { type: 'text', content: 'Errors per minute.' },
                  { type: 'image', source: { type: 'url', value: 'https://example.com/e.png' } }
                ]
              },
              { type: 'structured-output', status: 'error', raw: '', errorMessage: 'No rows.' }
            ]
          }
        ],
        interrupts: [workflow],
        interruptErrors: [{ message: 'The decision expired.', retryable: false }]
      }
    })
    expect(view.container.textContent).toContain('The structured answer failed')
    expect(view.container.textContent).toContain('No rows.')
    expect(view.container.textContent).toContain('Your decision was not sent')
    expect(view.queryByRole('button', { name: 'Retry' })).toBeNull()
    const call = view.container.querySelector<HTMLElement>('[data-testid="tool-call"]')!
    await fireEvent.click(within(call).getAllByRole('button')[0]!)
    await waitFor(() => expect(call.querySelector('[data-testid="image-gallery"]')).not.toBeNull())
    expect(call.textContent).toContain('Errors per minute.')
    const card = within(view.getByRole('group', { name: 'Approve the change window?' }))
    await fireEvent.update(card.getByRole('textbox'), 'Yes')
    await fireEvent.click(card.getByRole('button', { name: 'Submit' }))
    expect(view.emitted<unknown[]>('answer-interrupt')?.[0]?.slice(1)).toEqual([workflow, 'Yes'])
  })
})
