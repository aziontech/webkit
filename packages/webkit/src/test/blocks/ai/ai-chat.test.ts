import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import AiChat, {
  type AiChatMessage,
  type AiChatToolCallPart
} from '../../../../blocks/ai/ai-chat/ai-chat.vue'
import Artifact from '../../../../blocks/ai/ai-chat/variants/artifact.vue'

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
})
