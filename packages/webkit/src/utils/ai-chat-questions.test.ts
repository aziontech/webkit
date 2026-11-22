import { describe, expect, it, vi } from 'vitest'

import type { AiChatInterrupt, AiChatMessage, AiChatQuestion } from './ai-chat'
import { answerQuestion, groupQuestions, skipQuestion } from './ai-chat-questions'

const turn = (id: string): AiChatMessage => ({ id, role: 'assistant', parts: [] })

const interrupt = (id: string, kind: 'generic' | 'unbound' = 'generic'): AiChatInterrupt => ({
  kind,
  id,
  message: `Question ${id}?`,
  resolveInterrupt: vi.fn(),
  cancel: vi.fn()
})

describe('ai-chat questions', () => {
  it('groups live and settled questions under the turn they were asked after', () => {
    const settled: Record<string, AiChatQuestion> = {
      old: { id: 'old', title: 'Old?', options: [], status: 'success', error: '', bound: true }
    }
    const groups = groupQuestions({
      pending: [interrupt('q1'), interrupt('q2', 'unbound')],
      settled,
      routed: { q2: true },
      askedAfter: { q1: 'a', q2: 'gone', old: 'b' },
      turns: [turn('a'), turn('b')],
      lastId: 'b'
    })
    expect(groups.a?.map((question) => question.id)).toEqual(['q1'])
    expect(groups.b?.map((question) => [question.id, question.status])).toEqual([
      ['q2', 'running'],
      ['old', 'success']
    ])
  })

  it('answers a bound question through its interrupt and hands an unbound one back', () => {
    const bound = interrupt('q1')
    const unbound = interrupt('q2', 'unbound')
    const state = { pending: [bound, unbound], settled: {}, routed: {} }
    const question = (id: string, isBound: boolean): AiChatQuestion => ({
      id,
      title: '',
      options: [],
      status: 'pending',
      error: '',
      bound: isBound
    })

    expect(answerQuestion(state, question('q1', true), 'yes')).toBeUndefined()
    expect(bound.resolveInterrupt).toHaveBeenCalledWith('yes')
    expect(answerQuestion(state, question('q2', false), 'no')).toBe(unbound)
    expect(state.routed).toEqual({ q2: true })
    expect(Object.keys(state.settled)).toEqual(['q1', 'q2'])
  })

  it('skips a question and cancels its interrupt', () => {
    const pending = interrupt('q1')
    const settled: Record<string, AiChatQuestion> = {}
    skipQuestion(
      { pending: [pending], settled },
      { id: 'q1', title: '', options: [], status: 'pending', error: '', bound: true }
    )
    expect(settled.q1?.status).toBe('skipped')
    expect(pending.cancel).toHaveBeenCalledOnce()
  })
})
