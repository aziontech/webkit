import type {
  AgentQuestionOption,
  AgentQuestionStatus
} from '../../components/ai/agent-question/agent-question.vue'
import type {
  AiChatInterrupt,
  AiChatInterruptError,
  AiChatQuestion,
  AiChatToolCallPart
} from './ai-chat-types'

export function resolveInterrupt(
  interrupts: ReadonlyArray<AiChatInterrupt> | undefined,
  call: AiChatToolCallPart,
  approved: boolean,
  editedArgs?: unknown
): void {
  const interrupt = interrupts?.find(
    (item) => item.kind === 'tool-approval' && item.toolCallId === call.id
  )
  const resolve = interrupt?.resolveInterrupt
  if (typeof resolve !== 'function') return
  if (editedArgs === undefined) resolve.call(interrupt, approved)
  else resolve.call(interrupt, approved, { editedArgs })
}

export function isQuestion(interrupt: AiChatInterrupt): boolean {
  return (interrupt.kind === 'generic' || interrupt.kind === 'unbound') && Boolean(interrupt.id)
}

function optionsIn(value: unknown): AgentQuestionOption[] {
  if (!value || typeof value !== 'object' || !('options' in value)) return []
  const options = (value as { options?: unknown }).options
  if (!Array.isArray(options)) return []
  return options.flatMap((option): AgentQuestionOption[] => {
    if (typeof option === 'string') return [{ value: option, label: option }]
    if (option && typeof option === 'object' && 'value' in option) {
      const { value: answer, label } = option as { value?: unknown; label?: unknown }
      if (typeof answer !== 'string') return []
      return [{ value: answer, label: typeof label === 'string' ? label : answer }]
    }
    return []
  })
}

const QUESTION_STATUS: Record<string, AgentQuestionStatus> = {
  validating: 'running',
  staged: 'running',
  submitting: 'running',
  error: 'error'
}

export function questionOf(interrupt: AiChatInterrupt): AiChatQuestion {
  const options = optionsIn(interrupt.metadata)
  return {
    id: interrupt.id ?? '',
    title: interrupt.message || 'The agent needs an answer to continue.',
    options: options.length ? options : optionsIn(interrupt.payload),
    status: QUESTION_STATUS[interrupt.status ?? ''] ?? 'pending',
    error: interrupt.errors?.[0]?.message ?? '',
    bound: interrupt.kind !== 'unbound'
  }
}

export function answerInterrupt(interrupt: AiChatInterrupt | undefined, value: string): void {
  const resolve = interrupt?.resolveInterrupt
  if (typeof resolve === 'function') resolve.call(interrupt, value)
}

export function skipInterrupt(interrupt: AiChatInterrupt | undefined): void {
  const cancel = interrupt?.cancel
  if (typeof cancel === 'function') cancel.call(interrupt)
}

export function interruptErrorText(errors: ReadonlyArray<AiChatInterruptError>): string {
  return [...new Set(errors.map((error) => error.message).filter(Boolean))].join(' ')
}
