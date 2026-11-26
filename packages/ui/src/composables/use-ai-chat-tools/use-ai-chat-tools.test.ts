import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import type {
  AiChatInterrupt,
  AiChatMessage,
  AiChatTool,
  AiChatToolCallPart
} from '../../utils/lib/ai-chat-types'
import { useAiChatTools } from './index'

const turns: AiChatMessage[] = [
  { id: 'u1', role: 'user', parts: [{ type: 'text', content: 'Deploy storefront' }] },
  { id: 'a1', role: 'assistant', parts: [{ type: 'text', content: 'Deploying.' }] }
]

const call: AiChatToolCallPart = {
  type: 'tool-call',
  id: 'call-1',
  name: 'deploy_workload',
  arguments: '{"workload":"storefront"}',
  input: { workload: 'storefront' },
  state: 'approval-requested',
  approval: { id: 'approval-1', needsApproval: true }
}

function setup(interrupts: AiChatInterrupt[] = [], tools: Record<string, AiChatTool> = {}) {
  const handlers = {
    onAnswerInterrupt: vi.fn(),
    onAnswerTool: vi.fn(),
    onApprove: vi.fn(),
    onDeny: vi.fn()
  }
  const list = ref(interrupts)
  const chat = effectScope().run(() =>
    useAiChatTools({ turns, interrupts: list, tools, ...handlers })
  )!
  return { chat, handlers, list }
}

describe('useAiChatTools', () => {
  it('groups an unbound question after the last turn and hands its answer to the app', async () => {
    const question: AiChatInterrupt = {
      kind: 'unbound',
      id: 'q1',
      message: 'Which region?',
      status: 'pending',
      errors: []
    }
    const { chat, handlers } = setup([question])
    await nextTick()
    const [asked] = chat.questions.value['a1'] ?? []
    expect(asked?.id).toBe('q1')
    chat.answer(new Event('submit'), asked!, 'us-east')
    expect(handlers.onAnswerInterrupt).toHaveBeenCalledWith(expect.any(Event), question, 'us-east')
  })

  it('answers an answerable tool and marks it running', () => {
    const { chat, handlers } = setup([], {
      deploy_workload: { title: 'Deploy', answerable: true }
    })
    chat.answerTool(new Event('submit'), call, 'yes')
    expect(handlers.onAnswerTool).toHaveBeenCalledWith(expect.any(Event), {
      toolCallId: 'call-1',
      tool: 'deploy_workload',
      output: 'yes'
    })
    expect(chat.askOf(call).status).toBe('running')
  })

  it('keeps an edit, passes edited arguments of an editable tool on approve, and resets', () => {
    const { chat, handlers } = setup([], { deploy_workload: { title: 'Deploy', editable: true } })
    expect(chat.editOf(call)).toContain('storefront')
    chat.setEdit(call, '{"workload":"checkout"}')
    expect(chat.editOf(call)).toBe('{"workload":"checkout"}')
    chat.approve(new MouseEvent('click'), call, chat.editOf(call))
    expect(handlers.onApprove).toHaveBeenCalledWith(expect.any(MouseEvent), call, {
      workload: 'checkout'
    })
    chat.deny(new MouseEvent('click'), call)
    expect(handlers.onDeny).toHaveBeenCalledWith(expect.any(MouseEvent), call)
    chat.reset()
    expect(chat.editOf(call)).toContain('storefront')
  })
})
