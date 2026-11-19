import { render, waitFor, within } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { nextTick } from 'vue'

import AiChat, {
  type AiChatContent,
  type AiChatInterrupt,
  type AiChatMessage,
  type AiChatQueuedMessage,
  type AiChatToolCallPart
} from '../../../../blocks/ai/ai-chat/ai-chat.vue'
import Agent from '../../../../blocks/ai/ai-chat/variants/agent.vue'
import Artifact from '../../../../blocks/ai/ai-chat/variants/artifact.vue'
import Media from '../../../../blocks/ai/ai-chat/variants/media.vue'
import type { McpAppFrameMessage } from '../../../components/ai/mcp-app-frame/mcp-app-frame.vue'

describe('ai/ai-chat Artifact', () => {
  describe('wide', () => {
    beforeEach(async () => {
      await page.viewport(1280, 900)
    })
    afterEach(async () => {
      await page.viewport(414, 896)
    })

    it('shows the artifact beside the thread with its versions and a named resize handle', async () => {
      const view = render(Artifact)
      const canvas = await view.findByRole('region', { name: 'top-orders.sql' })
      expect(canvas.textContent).toContain('2 of 2')
      expect(view.getByRole('separator', { name: 'Resize the artifact' })).toBeTruthy()
      expect(view.getAllByRole('button', { name: 'Open top-orders.sql' })).toHaveLength(2)
    })

    it('puts a follow-up question in the composer without a canned answer', async () => {
      const view = render(Artifact)
      await view.findByRole('region', { name: 'top-orders.sql' })
      await userEvent.click(view.getByRole('button', { name: 'Show the customer email too' }))
      expect(view.getByRole('textbox')).toHaveValue('Show the customer email too')
      expect(view.getByRole('region', { name: 'top-orders.sql' }).textContent).toContain('2 of 2')
    })

    it('closes to the Open that showed it and reopens the version of that message', async () => {
      const view = render(Artifact)
      await view.findByRole('region', { name: 'top-orders.sql' })
      const [firstOpen] = view.getAllByRole('button', { name: 'Open top-orders.sql' })
      await userEvent.click(firstOpen!)
      await waitFor(() =>
        expect(document.activeElement).toBe(
          view.getByRole('heading', { level: 2, name: 'top-orders.sql' })
        )
      )
      expect(view.getByRole('region', { name: 'top-orders.sql' }).textContent).toContain('1 of 2')
      await userEvent.click(view.getByRole('button', { name: 'Close top-orders.sql' }))
      expect(view.queryByRole('region', { name: 'top-orders.sql' })).toBeNull()
      await waitFor(() => expect(document.activeElement).toBe(firstOpen))
      expect(view.getByRole('button', { name: 'Show artifact' })).toBeTruthy()
    })
  })

  it('opens the canvas in a drawer on a narrow screen', async () => {
    await page.viewport(414, 896)
    const view = render(Artifact)
    await waitFor(() => expect(view.queryByRole('separator')).toBeNull())
    const [firstOpen] = view.getAllByRole('button', { name: 'Open top-orders.sql' })
    await userEvent.click(firstOpen!)
    const dialog = await view.findByRole('dialog', { name: 'Artifact' })
    await waitFor(() =>
      expect(dialog.querySelector('section')).toHaveAccessibleName('top-orders.sql')
    )
  })
})

describe('ai/ai-chat', () => {
  const thread: AiChatMessage[] = [
    { id: 'u1', role: 'user', parts: [{ type: 'text', content: 'Which plan am I on?' }] },
    {
      id: 'a1',
      role: 'assistant',
      parts: [
        { type: 'thinking', content: 'Reading the billing settings.' },
        { type: 'text', content: 'Acme Inc. is on the Business plan.' }
      ]
    }
  ]

  const deploy: AiChatToolCallPart = {
    type: 'tool-call',
    id: 'call-1',
    name: 'deploy_workload',
    arguments: '{"workload":"storefront"}',
    input: { workload: 'storefront' },
    state: 'approval-requested',
    approval: { id: 'approval-1', needsApproval: true }
  }

  it('renders the messages it is given instead of the empty state', () => {
    const view = render(AiChat, { props: { messages: thread } })
    expect(view.container.textContent).toContain('Acme Inc. is on the Business plan.')
    expect(view.container.textContent).toContain('Which plan am I on?')
    expect(view.queryByText('How can I help with your Azion account?')).toBeNull()
  })

  it('skips system and activity messages', () => {
    const view = render(AiChat, {
      props: {
        messages: [
          { id: 's1', role: 'system', parts: [{ type: 'text', content: 'You are terse.' }] },
          ...thread
        ]
      }
    })
    expect(view.container.textContent).not.toContain('You are terse.')
  })

  it('emits send with the text and clears the composer', async () => {
    const view = render(AiChat)
    await userEvent.type(view.getByRole('textbox'), 'Purge styles.css')
    await userEvent.click(view.getByRole('button', { name: 'Submit' }))
    const [[event, text]] = view.emitted('send') as [[Event, string]]
    expect(event).toBeInstanceOf(Event)
    expect(text).toBe('Purge styles.css')
    expect(view.getByRole('textbox')).toHaveValue('')
  })

  it('emits send from a starter prompt', async () => {
    const view = render(AiChat)
    await userEvent.click(view.getByRole('button', { name: 'Protect my site with a WAF' }))
    expect((view.emitted('send') as [[Event, string]])[0][1]).toBe('Protect my site with a WAF')
  })

  it('shows Stop while loading, emits stop and marks the stopped response', async () => {
    const view = render(AiChat, { props: { messages: thread, loading: true } })
    await userEvent.click(view.getByRole('button', { name: 'Stop generating' }))
    expect(view.emitted('stop')).toHaveLength(1)
    await view.rerender({ messages: thread, loading: false })
    expect(view.container.textContent).toContain('You stopped this response.')
  })

  it('does not mark an earlier response when Stop ends a pending one', async () => {
    const pending = [
      ...thread,
      { id: 'u2', role: 'user', parts: [{ type: 'text', content: 'And next month?' }] }
    ] satisfies AiChatMessage[]
    const view = render(AiChat, { props: { messages: pending, loading: true } })
    expect(view.container.querySelectorAll('[aria-busy="true"]').length).toBeGreaterThan(0)
    await userEvent.click(view.getByRole('button', { name: 'Stop generating' }))
    await view.rerender({ messages: pending, loading: false })
    expect(view.container.textContent).not.toContain('You stopped this response.')
  })

  it('shows the error on the last response and emits retry with it', async () => {
    const view = render(AiChat, {
      props: { messages: thread, error: 'The connection was interrupted.' }
    })
    expect(view.container.textContent).toContain('The connection was interrupted.')
    await userEvent.click(view.getByRole('button', { name: 'Try again' }))
    const [[event, message]] = view.emitted('retry') as [[Event, AiChatMessage]]
    expect(event).toBeInstanceOf(Event)
    expect(message.id).toBe('a1')
  })

  it('shows the standard sentence for an error object', () => {
    const view = render(AiChat, { props: { messages: thread, error: new Error('fetch failed') } })
    expect(view.container.textContent).toContain('The connection was interrupted')
    expect(view.container.textContent).not.toContain('fetch failed')
  })

  it('reads sources from the message metadata', () => {
    const view = render(AiChat, {
      props: {
        messages: [
          thread[0],
          {
            ...thread[1],
            metadata: {
              sources: [{ title: 'Billing plans', href: 'https://example.com/docs/plans' }]
            }
          }
        ]
      }
    })
    expect(view.container.textContent).toContain('1 source')
  })

  it('draws a tool call with the title the tools prop gives it', () => {
    const view = render(AiChat, {
      props: {
        messages: [
          thread[0],
          {
            id: 'a1',
            role: 'assistant',
            parts: [{ ...deploy, approval: undefined, state: 'complete' }]
          }
        ],
        tools: { deploy_workload: { title: 'Deploying storefront' } }
      }
    })
    expect(view.container.textContent).toContain('Deploying storefront')
    expect(view.container.textContent).toContain('deploy_workload')
  })

  it('asks for approval, emits approve and resolves the matching interrupt', async () => {
    const resolved: boolean[] = []
    const view = render(AiChat, {
      props: {
        messages: [thread[0], { id: 'a1', role: 'assistant', parts: [deploy] }],
        tools: { deploy_workload: { title: 'Deploying storefront', approveLabel: 'Deploy' } },
        interrupts: [
          {
            kind: 'tool-approval',
            toolCallId: 'other',
            resolveInterrupt: () => resolved.push(false)
          },
          {
            kind: 'tool-approval',
            toolCallId: 'call-1',
            resolveInterrupt: (approved: boolean) => resolved.push(approved)
          }
        ]
      }
    })
    await userEvent.click(view.getByRole('button', { name: 'Deploy' }))
    const [[event, call]] = view.emitted('approve') as [[Event, AiChatToolCallPart]]
    expect(event).toBeInstanceOf(Event)
    expect(call.id).toBe('call-1')
    expect(resolved).toEqual([true])
  })

  it('records an approved call as running under its card', () => {
    const view = render(AiChat, {
      props: {
        messages: [
          thread[0],
          {
            id: 'a1',
            role: 'assistant',
            parts: [
              {
                ...deploy,
                state: 'approval-responded',
                approval: { id: 'approval-1', needsApproval: true, approved: true }
              }
            ]
          }
        ]
      }
    })
    expect(view.container.querySelector('[data-testid="tool-approval"]')).toHaveAttribute(
      'data-status',
      'approved'
    )
    expect(view.container.querySelector('[data-testid="tool-call"]')).toHaveAttribute(
      'data-status',
      'running'
    )
  })

  it('shows a pending response while the reply has not started', () => {
    const view = render(AiChat, { props: { messages: [thread[0]], loading: true } })
    expect(view.container.textContent).toContain('Generating a response')
  })

  const answer = (parts: AiChatMessage['parts']): AiChatMessage[] => [
    thread[0]!,
    { id: 'a1', role: 'assistant', parts }
  ]

  it('draws image, audio, video and document parts with their components', () => {
    const view = render(AiChat, {
      props: {
        messages: answer([
          { type: 'image', source: { type: 'url', value: 'https://example.com/a.png' } },
          {
            type: 'image',
            source: { type: 'data', value: 'iVBORw0KGgo=', mimeType: 'image/png' },
            metadata: { alt: 'Second chart' }
          },
          { type: 'audio', source: { type: 'url', value: 'https://example.com/a.webm' } },
          {
            type: 'video',
            source: { type: 'data', value: 'AAAA', mimeType: 'video/mp4' }
          },
          {
            type: 'document',
            source: { type: 'data', value: 'aGVsbG8=', mimeType: 'text/plain' },
            metadata: { name: 'notes.txt' }
          },
          { type: 'document', source: { type: 'file', value: 'file-1' } }
        ])
      }
    })
    const root = view.container
    expect(root.querySelectorAll('[data-testid="image-gallery"]')).toHaveLength(1)
    expect(root.querySelectorAll('[data-testid="image-gallery"] img')).toHaveLength(2)
    expect(root.querySelector('[data-testid="image-gallery"] img[alt="Second chart"]')).toBeTruthy()
    expect(root.querySelector('[data-testid="audio-player"] audio')).toHaveAttribute(
      'src',
      'https://example.com/a.webm'
    )
    expect(
      root.querySelector('[data-testid="video-player"] video')?.getAttribute('src') ??
        root.querySelector('[data-testid="video-player"] source')?.getAttribute('src')
    ).toBe('data:video/mp4;base64,AAAA')
    expect(root.querySelectorAll('[data-testid="file-preview"]')).toHaveLength(1)
    expect(root.textContent).toContain('notes.txt')
    expect(root.textContent).toContain('hello')
  })

  it('renders the Media variant', () => {
    const view = render(Media)
    expect(view.container.querySelector('[data-testid="image-gallery"]')).toBeTruthy()
    expect(view.container.textContent).toContain('traffic-report.csv')
    expect(view.container.querySelector('[data-testid="audio-player"]')).toBeTruthy()
    expect(
      view.container.querySelector('[data-from="user"] [data-testid="image-gallery"]')
    ).toBeTruthy()
    expect(view.container.textContent).toContain('"cacheHitRatio": 0.92')
    expect(view.getByRole('button', { name: 'Attach files' })).toBeTruthy()
  })

  it('draws activity parts and the activity messages before the turn as one step list', async () => {
    const view = render(AiChat, {
      props: {
        messages: [
          thread[0]!,
          {
            id: 'act',
            role: 'activity',
            parts: [
              {
                type: 'activity',
                activityType: 'search',
                content: { title: 'Reading the docs', status: 'complete' }
              }
            ]
          },
          {
            id: 'a1',
            role: 'assistant',
            parts: [
              {
                type: 'activity',
                activityType: 'compare',
                content: { status: 'cancelled', detail: 'Two builds' }
              },
              { type: 'text', content: 'Done.' }
            ]
          }
        ]
      }
    })
    const activity = view.container.querySelectorAll('[data-testid="agent-activity"]')
    expect(activity).toHaveLength(1)
    await userEvent.click(view.getByTestId('agent-activity__toggle'))
    const steps = activity[0]!.querySelectorAll('[data-testid="agent-activity__step"]')
    expect([...steps].map((step) => step.getAttribute('data-status'))).toEqual([
      'success',
      'canceled'
    ])
    expect(steps[0]!.textContent).toContain('Reading the docs')
    expect(steps[1]!.textContent).toContain('compare')
    expect(steps[1]!.textContent).toContain('Two builds')
  })

  it('draws a subagent with its answer and stops it', async () => {
    let stops = 0
    const view = render(AiChat, {
      props: {
        messages: answer([
          {
            type: 'subagent',
            subagent: {
              name: 'researcher',
              description: 'Comparing builds',
              status: 'running',
              messages: [
                { id: 'r1', role: 'assistant', parts: [{ type: 'text', content: 'Build 1042.' }] }
              ],
              stop: () => stops++
            }
          }
        ])
      }
    })
    const card = view.container.querySelector('[data-testid="subagent-card"]')!
    expect(card).toHaveAttribute('data-status', 'running')
    await userEvent.click(within(card as HTMLElement).getByRole('button', { name: /^Stop/ }))
    expect(stops).toBe(1)
  })

  it('maps a stopped subagent to canceled and a finished one to success', () => {
    const subagent = (status: 'error' | 'finished', message?: string) =>
      ({
        type: 'subagent',
        subagent: {
          name: 'researcher',
          status,
          messages: [],
          error: message ? { message } : undefined
        }
      }) as const
    const view = render(AiChat, {
      props: { messages: answer([subagent('error', 'Stopped'), subagent('finished')]) }
    })
    const cards = view.container.querySelectorAll('[data-testid="subagent-card"]')
    expect([...cards].map((card) => card.getAttribute('data-status'))).toEqual([
      'canceled',
      'success'
    ])
  })

  it('reads streaming and canceled tool calls', () => {
    const view = render(AiChat, {
      props: {
        messages: answer([
          { ...deploy, id: 'c1', approval: undefined, state: 'input-streaming' },
          { ...deploy, id: 'c2', approval: undefined, state: 'input-complete' },
          {
            type: 'tool-result',
            toolCallId: 'c2',
            content: null,
            state: 'complete',
            outcome: 'cancelled'
          }
        ])
      }
    })
    const calls = view.container.querySelectorAll('[data-testid="tool-call"]')
    expect([...calls].map((call) => call.getAttribute('data-status'))).toEqual([
      'streaming',
      'canceled'
    ])
  })

  it('asks a generic interrupt as a question and resolves it with the answer', async () => {
    const answers: unknown[] = []
    const question: AiChatInterrupt = {
      kind: 'generic',
      id: 'q-1',
      message: 'Which environment?',
      metadata: { options: [{ value: 'prod', label: 'Production' }, 'staging'] },
      status: 'pending',
      errors: [],
      resolveInterrupt: (value: unknown) => answers.push(value)
    }
    const view = render(AiChat, { props: { messages: thread, interrupts: [question] } })
    expect(view.getByRole('group', { name: 'Which environment?' })).toBeTruthy()
    const card = within(view.getByRole('group', { name: 'Which environment?' }))
    await userEvent.click(card.getByRole('radio', { name: 'Production' }))
    await userEvent.click(card.getByRole('button', { name: 'Submit' }))
    expect(answers).toEqual(['prod'])
    await view.rerender({ messages: thread, interrupts: [] })
    expect(view.container.querySelector('[data-testid="agent-question"]')).toHaveAttribute(
      'data-status',
      'success'
    )
  })

  it('shows the interrupt status and error, and Skip cancels it', async () => {
    let canceled = 0
    const question: AiChatInterrupt = {
      kind: 'generic',
      id: 'q-2',
      message: 'Name the bucket?',
      status: 'error',
      errors: [{ message: 'The name is taken.' }],
      resolveInterrupt: () => undefined,
      cancel: () => canceled++
    }
    const view = render(AiChat, { props: { messages: thread, interrupts: [question] } })
    const card = view.container.querySelector<HTMLElement>('[data-testid="agent-question"]')!
    expect(within(card).getByRole('textbox')).toBeTruthy()
    expect(view.container.textContent).toContain('The name is taken.')
    await userEvent.click(within(card).getByRole('button', { name: 'Skip' }))
    expect(canceled).toBe(1)
    await view.rerender({ messages: thread, interrupts: [] })
    expect(view.container.querySelector('[data-testid="agent-question"]')).toHaveAttribute(
      'data-status',
      'skipped'
    )
  })

  it('renders the Agent variant and keeps the answered question', async () => {
    const view = render(Agent)
    expect(view.container.querySelector('[data-testid="agent-activity"]')).toBeTruthy()
    expect(view.container.querySelector('[data-testid="subagent-card"]')).toHaveAttribute(
      'data-status',
      'success'
    )
    const card = within(view.getByRole('group', { name: 'How should I fix checkout?' }))
    await userEvent.click(card.getByRole('radio', { name: 'Roll back to build 1041' }))
    await userEvent.click(card.getByRole('button', { name: 'Submit' }))
    await waitFor(() =>
      expect(view.container.querySelector('[data-testid="agent-question"]')).toHaveAttribute(
        'data-status',
        'success'
      )
    )
  })

  it('passes edited arguments of an editable tool as editedArgs', async () => {
    const calls: unknown[][] = []
    const view = render(AiChat, {
      props: {
        messages: answer([deploy]),
        tools: { deploy_workload: { title: 'Deploying', approveLabel: 'Deploy', editable: true } },
        interrupts: [
          {
            kind: 'tool-approval',
            toolCallId: 'call-1',
            resolveInterrupt: (...args: unknown[]) => calls.push(args)
          }
        ]
      }
    })
    const approval = view.container.querySelector<HTMLElement>('[data-testid="tool-approval"]')!
    const field = within(approval).getByRole('textbox')
    const original = (field as HTMLTextAreaElement).value
    expect(JSON.parse(original)).toEqual({ workload: 'storefront' })
    await userEvent.clear(field)
    await userEvent.type(field, '{{"workload":"checkout"')
    expect(view.getByRole('button', { name: 'Deploy' })).toBeDisabled()
    await userEvent.type(field, '}')
    await userEvent.click(view.getByRole('button', { name: 'Deploy' }))
    expect(calls).toEqual([[true, { editedArgs: { workload: 'checkout' } }]])
    const [[, , input]] = view.emitted('approve') as [[Event, AiChatToolCallPart, unknown]]
    expect(input).toEqual({ workload: 'checkout' })
  })

  it('resolves an unedited editable tool with true only', async () => {
    const calls: unknown[][] = []
    const view = render(AiChat, {
      props: {
        messages: answer([deploy]),
        tools: { deploy_workload: { title: 'Deploying', approveLabel: 'Deploy', editable: true } },
        interrupts: [
          {
            kind: 'tool-approval',
            toolCallId: 'call-1',
            resolveInterrupt: (...args: unknown[]) => calls.push(args)
          }
        ]
      }
    })
    await userEvent.click(view.getByRole('button', { name: 'Deploy' }))
    expect(calls).toEqual([[true]])
  })

  it('shows the queue, sends while loading and emits remove-queued', async () => {
    const queue: AiChatQueuedMessage[] = [
      { id: 'w1', content: 'Then purge the cache' },
      {
        id: 'w2',
        content: {
          content: [
            { type: 'text', content: 'Read this log' },
            { type: 'image', source: { type: 'url', value: 'https://example.com/a.png' } }
          ]
        }
      }
    ]
    const view = render(AiChat, { props: { messages: thread, loading: true, queue } })
    const list = view.getByRole('list', { name: 'Queued messages' })
    expect(list.textContent).toContain('Then purge the cache')
    expect(list.textContent).toContain('Read this log')
    await userEvent.type(view.getByRole('textbox', { name: 'Prompt' }), 'And the logs')
    await userEvent.click(view.getByRole('button', { name: 'Submit' }))
    expect((view.emitted('send') as [[Event, string]])[0]![1]).toBe('And the logs')
    const [remove] = view.getAllByRole('button', { name: /^Remove/ })
    await userEvent.click(remove!)
    const [[event, item]] = view.emitted('remove-queued') as [[Event, AiChatQueuedMessage]]
    expect(event).toBeInstanceOf(Event)
    expect(item.id).toBe('w1')
  })

  it('does not send while loading without a queue', async () => {
    const view = render(AiChat, { props: { messages: thread, loading: true } })
    expect(view.queryByRole('button', { name: 'Submit' })).toBeNull()
  })

  it('offers older messages and emits load-more', async () => {
    const view = render(AiChat, { props: { messages: thread, moreMessages: true } })
    await userEvent.click(view.getByRole('button', { name: /earlier messages/i }))
    expect(view.emitted('load-more')!.length).toBeGreaterThan(0)
  })

  it('shows Reconnecting and Connection lost above the composer', async () => {
    const view = render(AiChat, { props: { messages: thread, connection: 'connecting' } })
    expect(view.container.textContent).toContain('Reconnecting')
    await view.rerender({ messages: thread, connection: 'connected', resuming: true })
    expect(view.container.textContent).toContain('Reconnecting')
    await view.rerender({ messages: thread, connection: 'error', resuming: false })
    expect(view.container.textContent).toContain('Connection lost')
    expect(view.container.textContent).not.toContain('Reconnecting')
    await view.rerender({ messages: thread, connection: 'connected' })
    expect(view.container.textContent).not.toContain('Connection lost')
  })

  it('draws a tool widget in a sandboxed frame and lets the app answer it', async () => {
    const replies: string[] = []
    const script = `addEventListener('message', (event) => { if (event.data && event.data.id === 7) parent.postMessage({ type: 'notify', payload: { message: event.data.result.ok } }, '*') }); parent.postMessage({ jsonrpc: '2.0', id: 7, method: 'ui/initialize', params: {} }, '*')`
    const widget: AiChatMessage = {
      id: 'a1',
      role: 'assistant',
      parts: [
        {
          type: 'ui-resource',
          resource: {
            uri: 'ui://billing/plan-picker',
            mimeType: 'text/html;profile=mcp-app',
            text: `<p>Plans</p><script>${script}<${'/'}script>`
          },
          toolCallId: 'call-1',
          toolName: 'pick_plan'
        }
      ]
    }
    const view = render(AiChat, {
      props: {
        messages: [thread[0], widget],
        tools: { pick_plan: { title: 'Plan picker' } },
        'onApp-message': (
          message: McpAppFrameMessage,
          _part: unknown,
          reply: (answer: McpAppFrameMessage) => void
        ) => {
          if (typeof message === 'object' && message && 'jsonrpc' in message) {
            reply({ jsonrpc: '2.0', id: 7, result: { ok: 'answered' } })
          } else replies.push(JSON.stringify(message))
        }
      }
    })
    const frame = view.container.querySelector('[data-testid="mcp-app-frame__view"]')
    expect(frame).toHaveAttribute('title', 'Plan picker')
    expect(frame).toHaveAttribute('sandbox', 'allow-scripts')
    await waitFor(() =>
      expect(replies).toEqual([
        JSON.stringify({ type: 'notify', payload: { message: 'answered' } })
      ])
    )
  })

  it('sends the attached files as the multimodal content sendMessage takes', async () => {
    const view = render(AiChat, { props: { attachable: true } })
    const input = view.getByTestId('prompt-input-attach-button__input') as HTMLInputElement
    const transfer = new DataTransfer()
    transfer.items.add(new File(['hello'], 'notes.pdf', { type: 'application/pdf' }))
    transfer.items.add(
      new File([new Uint8Array([137, 80, 78, 71])], 'chart.png', { type: 'image/png' })
    )
    input.files = transfer.files
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()
    await userEvent.type(view.getByRole('textbox'), 'Read these')
    await userEvent.click(view.getByRole('button', { name: 'Submit' }))
    await waitFor(() => expect(view.emitted('send')).toHaveLength(1))
    const [[event, content]] = view.emitted('send') as [[Event, AiChatContent]]
    expect(event).toBeInstanceOf(Event)
    expect(content.content).toEqual([
      { type: 'text', content: 'Read these' },
      {
        type: 'document',
        source: { type: 'data', value: 'aGVsbG8=', mimeType: 'application/pdf' },
        metadata: { name: 'notes.pdf' }
      },
      {
        type: 'image',
        source: { type: 'data', value: 'iVBORw==', mimeType: 'image/png' },
        metadata: { name: 'chart.png' }
      }
    ])
    expect(view.queryByTestId('prompt-input__files')).toBeNull()
  })

  it('offers no attach control unless attachable', () => {
    const view = render(AiChat)
    expect(view.queryByRole('button', { name: 'Attach files' })).toBeNull()
  })

  it('draws the image and document a reader attached to a message', () => {
    const view = render(AiChat, {
      props: {
        messages: [
          {
            id: 'u1',
            role: 'user',
            parts: [
              { type: 'text', content: 'What is in this chart?' },
              {
                type: 'image',
                source: { type: 'data', value: 'iVBORw0KGgo=', mimeType: 'image/png' }
              },
              {
                type: 'document',
                source: { type: 'data', value: 'aGVsbG8=', mimeType: 'text/plain' },
                metadata: { name: 'notes.txt' }
              }
            ]
          }
        ]
      }
    })
    const turn = view.container.querySelector<HTMLElement>('[data-from="user"]')!
    expect(turn.textContent).toContain('What is in this chart?')
    expect(turn.querySelector('[data-testid="image-gallery"] img')).toBeTruthy()
    expect(turn.querySelector('[data-testid="file-preview"]')?.textContent).toContain('notes.txt')
  })

  it('draws a structured answer as JSON, streaming or failed', async () => {
    const view = render(AiChat, {
      props: {
        messages: answer([
          {
            type: 'structured-output',
            status: 'complete',
            raw: '{"plan":"Business"}',
            data: { plan: 'Business', seats: 12 }
          }
        ])
      }
    })
    const code = view.container.querySelector('[data-testid="code-block"]')
    expect(code?.textContent).toContain('"seats": 12')
    await view.rerender({
      messages: answer([
        {
          type: 'structured-output',
          status: 'streaming',
          raw: '{"plan":"Busi',
          partial: { plan: 'Busi' }
        }
      ]),
      loading: true
    })
    expect(view.container.querySelector('[data-testid="code-block"]')?.textContent).toContain(
      '"plan": "Busi"'
    )
    await view.rerender({
      messages: answer([
        {
          type: 'structured-output',
          status: 'error',
          raw: '',
          errorMessage: 'The plan is missing.'
        }
      ]),
      loading: false
    })
    expect(view.container.textContent).toContain('The structured answer failed')
    expect(view.container.textContent).toContain('The plan is missing.')
  })

  it('draws the text and images of a rich tool result instead of JSON', async () => {
    const view = render(AiChat, {
      props: {
        messages: answer([
          {
            type: 'tool-call',
            id: 'call-9',
            name: 'render_chart',
            arguments: '{}',
            state: 'complete'
          },
          {
            type: 'tool-result',
            toolCallId: 'call-9',
            state: 'complete',
            content: [
              { type: 'text', content: 'Requests over the last hour.' },
              { type: 'image', source: { type: 'url', value: 'https://example.com/chart.png' } }
            ]
          }
        ])
      }
    })
    const call = view.container.querySelector<HTMLElement>('[data-testid="tool-call"]')!
    await userEvent.click(within(call).getAllByRole('button')[0]!)
    await waitFor(() =>
      expect(call.querySelector('[data-testid="image-gallery"] img')).toBeTruthy()
    )
    expect(call.textContent).toContain('Requests over the last hour.')
    expect(call.textContent).not.toContain('"type"')
  })

  it('shows why the answers were not sent and emits retry-interrupts', async () => {
    const view = render(AiChat, {
      props: {
        messages: thread,
        interruptErrors: [{ message: 'The server did not answer.', retryable: true }]
      }
    })
    expect(view.container.textContent).toContain('Your answer was not sent')
    expect(view.container.textContent).toContain('The server did not answer.')
    await userEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry-interrupts')).toHaveLength(1)
    await view.rerender({
      messages: thread,
      interruptErrors: [{ message: 'The request expired.', retryable: false }]
    })
    expect(view.queryByRole('button', { name: 'Retry' })).toBeNull()
  })

  it('asks an unbound interrupt and hands the answer to the app', async () => {
    const unbound: AiChatInterrupt = {
      kind: 'unbound',
      id: 'wf-1',
      message: 'Approve the purchase order?',
      metadata: { options: ['Approve', 'Reject'] },
      status: 'pending',
      errors: []
    }
    const view = render(AiChat, { props: { messages: thread, interrupts: [unbound] } })
    const card = within(view.getByRole('group', { name: 'Approve the purchase order?' }))
    expect(card.queryByRole('button', { name: 'Skip' })).toBeNull()
    await userEvent.click(card.getByRole('radio', { name: 'Approve' }))
    await userEvent.click(card.getByRole('button', { name: 'Submit' }))
    const [[event, interrupt, value]] = view.emitted('answer-interrupt') as [
      [Event, AiChatInterrupt, string]
    ]
    expect(event).toBeInstanceOf(Event)
    expect(interrupt.id).toBe('wf-1')
    expect(value).toBe('Approve')
    await waitFor(() =>
      expect(view.container.querySelector('[data-testid="agent-question"]')).toHaveAttribute(
        'data-status',
        'running'
      )
    )
  })

  it('shows placeholders while the conversation is restored', () => {
    const view = render(AiChat, { props: { hydrating: true } })
    expect(view.getByRole('status', { name: 'Loading the conversation' })).toBeTruthy()
    expect(view.container.querySelectorAll('[data-testid="skeleton"]').length).toBeGreaterThan(0)
    expect(view.queryByText('How can I help with your Azion account?')).toBeNull()
    expect(view.getByRole('textbox')).toBeDisabled()
  })

  it('says a response is being generated in another tab', async () => {
    const view = render(AiChat, { props: { messages: thread, sessionGenerating: true } })
    expect(view.container.textContent).toContain('Responding in another tab')
    await view.rerender({ messages: thread, sessionGenerating: true, loading: true })
    expect(view.container.textContent).not.toContain('Responding in another tab')
  })

  it('asks a tool the reader answers and emits the addToolResult payload', async () => {
    const pick: AiChatToolCallPart = {
      type: 'tool-call',
      id: 'call-7',
      name: 'pick_region',
      arguments: '{}',
      state: 'input-complete'
    }
    const view = render(AiChat, {
      props: {
        messages: answer([pick]),
        tools: {
          pick_region: {
            title: 'Picking a region',
            question: 'Which region should serve storefront?',
            answerable: true,
            options: [
              { value: 'us-east', label: 'US East' },
              { value: 'eu-west', label: 'EU West' }
            ]
          }
        }
      }
    })
    const card = within(view.getByRole('group', { name: 'Which region should serve storefront?' }))
    await userEvent.click(card.getByRole('radio', { name: 'EU West' }))
    await userEvent.click(card.getByRole('button', { name: 'Submit' }))
    const [[event, result]] = view.emitted('answer-tool') as [[Event, unknown]]
    expect(event).toBeInstanceOf(Event)
    expect(result).toEqual({ toolCallId: 'call-7', tool: 'pick_region', output: 'eu-west' })
    await view.rerender({
      messages: answer([{ ...pick, state: 'complete', output: 'eu-west' }]),
      tools: { pick_region: { title: 'Picking a region', answerable: true } }
    })
    expect(view.container.querySelector('[data-testid="agent-question"]')).toBeNull()
    expect(view.container.querySelector('[data-testid="tool-call"]')).toHaveAttribute(
      'data-status',
      'success'
    )
  })
})
