import { describe, expect, it, vi } from 'vitest'

import {
  activitiesBefore,
  activityStepOf,
  type AiChatInterrupt,
  type AiChatMessage,
  type AiChatToolCallPart,
  answerInterrupt,
  approvalOf,
  attachmentKindOf,
  contentOf,
  hasAnswer,
  interruptErrorText,
  isQuestion,
  json,
  mediaUrl,
  needsApproval,
  parsesAsJson,
  questionOf,
  queueItemOf,
  resolveInterrupt,
  segmentsOf,
  skipInterrupt,
  structuredOf,
  subagentStatusOf,
  textOf,
  toolContentOf,
  toolStatusOf
} from './ai-chat'

const call = (overrides: Partial<AiChatToolCallPart> = {}): AiChatToolCallPart => ({
  type: 'tool-call',
  id: 'call-1',
  name: 'deploy',
  arguments: '{}',
  state: 'input-complete',
  ...overrides
})

const assistant = (parts: AiChatMessage['parts']): AiChatMessage => ({
  id: 'a1',
  role: 'assistant',
  parts
})

describe('ai-chat', () => {
  it('joins the text parts of a message and skips empty ones', () => {
    const message = assistant([
      { type: 'text', content: 'First' },
      { type: 'thinking', content: 'hidden' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Second' }
    ])
    expect(textOf(message)).toBe('First\n\nSecond')
    expect(textOf(message, ' ')).toBe('First Second')
    expect(hasAnswer(message)).toBe(true)
    expect(hasAnswer(assistant([{ type: 'thinking', content: 'only' }]))).toBe(false)
  })

  it('turns a media source into a URL', () => {
    expect(mediaUrl({ type: 'url', value: 'https://example.com/a.png' })).toBe(
      'https://example.com/a.png'
    )
    expect(mediaUrl({ type: 'data', value: 'AAAA', mimeType: 'image/png' })).toBe(
      'data:image/png;base64,AAAA'
    )
    expect(mediaUrl({ type: 'data', value: 'data:text/plain,hi' })).toBe('data:text/plain,hi')
    expect(mediaUrl({ type: 'file', value: 'file-1' })).toBe('')
  })

  it('maps an activity part to a step', () => {
    expect(
      activityStepOf(
        { type: 'activity', activityType: 'search', content: { status: 'complete', detail: '' } },
        'step-0'
      )
    ).toEqual({ key: 'step-0', title: 'search', status: 'success', description: undefined })
  })

  it('collects the activity messages since the last turn', () => {
    const step = { type: 'activity' as const, activityType: 'plan', content: {} }
    const user: AiChatMessage = { id: 'u1', role: 'user', parts: [] }
    const activity: AiChatMessage = { id: 'x1', role: 'activity', parts: [step] }
    const answer = assistant([])
    expect(activitiesBefore([user, activity, answer], answer)).toEqual([step])
    expect(activitiesBefore([activity, user, answer], answer)).toEqual([])
  })

  it('splits a message into segments in order, merging text and images', () => {
    const segments = segmentsOf(
      assistant([
        { type: 'thinking', content: 'Plan' },
        { type: 'text', content: 'One' },
        { type: 'text', content: 'Two' },
        call({ id: 'c1' }),
        { type: 'tool-result', toolCallId: 'c1', content: 'ok', state: 'complete' },
        { type: 'image', source: { type: 'url', value: 'https://example.com/1.png' } },
        { type: 'image', source: { type: 'url', value: 'https://example.com/2.png' } },
        { type: 'unknown' }
      ])
    )
    expect(segments.map((segment) => segment.type)).toEqual([
      'reasoning',
      'text',
      'tool',
      'gallery'
    ])
    expect(segments[1]).toMatchObject({ content: 'One\n\nTwo' })
    expect(segments[2]).toMatchObject({ result: { toolCallId: 'c1' } })
    expect(segments[3]).toMatchObject({ images: [{ key: 'image-5' }, { key: 'image-6' }] })
  })

  it('reads the status of a tool call', () => {
    expect(toolStatusOf(call({ state: 'complete' }))).toBe('success')
    expect(toolStatusOf(call({ state: 'error' }))).toBe('error')
    expect(toolStatusOf(call({ state: 'input-streaming' }))).toBe('streaming')
    expect(toolStatusOf(call())).toBe('running')
    expect(
      toolStatusOf(call(), {
        type: 'tool-result',
        toolCallId: 'call-1',
        content: null,
        state: 'complete',
        outcome: 'denied'
      })
    ).toBe('denied')
  })

  it('reads the approval of a tool call', () => {
    const asked = call({ state: 'approval-requested' })
    expect(needsApproval(asked)).toBe(true)
    expect(needsApproval(call())).toBe(false)
    expect(approvalOf(asked)).toBe('pending')
    expect(approvalOf(call({ approval: { id: 'p', needsApproval: true, approved: true } }))).toBe(
      'approved'
    )
    expect(approvalOf(call({ approval: { id: 'p', needsApproval: true, approved: false } }))).toBe(
      'denied'
    )
  })

  it('resolves the approval interrupt of a call with its edited arguments', () => {
    const resolve = vi.fn()
    const interrupts: AiChatInterrupt[] = [
      { kind: 'tool-approval', toolCallId: 'call-1', resolveInterrupt: resolve }
    ]
    resolveInterrupt(interrupts, call(), true)
    resolveInterrupt(interrupts, call(), false, { name: 'edited' })
    resolveInterrupt(interrupts, call({ id: 'other' }), true)
    expect(resolve.mock.calls).toEqual([[true], [false, { editedArgs: { name: 'edited' } }]])
  })

  it('reads a generic interrupt as a question and answers or skips it', () => {
    const resolve = vi.fn()
    const cancel = vi.fn()
    const interrupt: AiChatInterrupt = {
      kind: 'generic',
      id: 'q1',
      message: 'Which region?',
      metadata: { options: ['us-east', { value: 'eu', label: 'Europe' }] },
      status: 'submitting',
      resolveInterrupt: resolve,
      cancel
    }
    expect(isQuestion(interrupt)).toBe(true)
    expect(isQuestion({ kind: 'tool-approval', id: 'x' })).toBe(false)
    expect(questionOf(interrupt)).toEqual({
      id: 'q1',
      title: 'Which region?',
      options: [
        { value: 'us-east', label: 'us-east' },
        { value: 'eu', label: 'Europe' }
      ],
      status: 'running',
      error: '',
      bound: true
    })
    answerInterrupt(interrupt, 'eu')
    skipInterrupt(interrupt)
    expect(resolve).toHaveBeenCalledWith('eu')
    expect(cancel).toHaveBeenCalledOnce()
  })

  it('joins distinct interrupt errors', () => {
    expect(
      interruptErrorText([{ message: 'Timed out.' }, { message: 'Timed out.' }, { message: '' }])
    ).toBe('Timed out.')
  })

  it('formats JSON and structured answers', () => {
    expect(json('{"a":1}')).toBe('{\n  "a": 1\n}')
    expect(json('not json')).toBe('not json')
    expect(json(null)).toBe('')
    expect(parsesAsJson('{"a":1}')).toBe(true)
    expect(parsesAsJson('{')).toBe(false)
    expect(
      structuredOf({ type: 'structured-output', status: 'complete', raw: '', data: { a: 1 } })
    ).toBe('{\n  "a": 1\n}')
    expect(structuredOf({ type: 'structured-output', status: 'streaming', raw: '{"a"' })).toBe(
      '{"a"'
    )
  })

  it('reads tool content made of text and images only', () => {
    expect(
      toolContentOf([
        { type: 'text', content: 'Chart' },
        { type: 'image', source: { type: 'url', value: 'https://example.com/c.png' } }
      ])
    ).toEqual({
      text: 'Chart',
      images: [{ key: 'image-1', src: 'https://example.com/c.png', alt: '' }]
    })
    expect(toolContentOf([{ type: 'tool-call' }])).toBeNull()
    expect(toolContentOf('plain')).toBeNull()
  })

  it('maps a helper agent status', () => {
    const part = (status: 'running' | 'finished' | 'error' | 'suspended', message = '') => ({
      type: 'subagent' as const,
      subagent: { name: 'helper', status, messages: [], error: { message } }
    })
    expect(subagentStatusOf(part('finished'))).toBe('success')
    expect(subagentStatusOf(part('suspended'))).toBe('pending')
    expect(subagentStatusOf(part('error', 'Stopped'))).toBe('canceled')
    expect(subagentStatusOf(part('error', 'Boom'))).toBe('error')
    expect(subagentStatusOf(part('running'))).toBe('running')
  })

  it('builds the content to send with attachments', async () => {
    expect(attachmentKindOf('image/png')).toBe('image')
    expect(attachmentKindOf('application/pdf')).toBe('document')
    expect(await contentOf('Hello', [])).toBe('Hello')
    const file = new File(['hi'], 'note.txt', { type: 'text/plain' })
    expect(await contentOf('Read this', [file])).toEqual({
      content: [
        { type: 'text', content: 'Read this' },
        {
          type: 'document',
          source: { type: 'data', value: 'aGk=', mimeType: 'text/plain' },
          metadata: { name: 'note.txt' }
        }
      ]
    })
  })

  it('reads a queued message as a queue item', () => {
    expect(queueItemOf({ id: 'm1', content: 'Hi' })).toEqual({ id: 'm1', text: 'Hi' })
    expect(
      queueItemOf({
        id: 'm2',
        content: { content: [{ type: 'text', content: 'See' }, { type: 'image' }] }
      })
    ).toEqual({ id: 'm2', text: 'See', attachmentCount: 1 })
  })
})
