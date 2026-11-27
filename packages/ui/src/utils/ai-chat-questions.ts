import {
  type AiChatInterrupt,
  type AiChatMessage,
  type AiChatQuestion,
  answerInterrupt,
  questionOf,
  skipInterrupt
} from './ai-chat'

export interface AiChatQuestionState {
  /** Pending question interrupts. */
  pending: ReadonlyArray<AiChatInterrupt>
  /** Questions answered or skipped, by id. */
  settled: Record<string, AiChatQuestion>
  /** Unbound questions handed to the app, by id. */
  routed: Record<string, boolean>
  /** The message each question was asked after, by id. */
  askedAfter: Record<string, string>
  /** The conversation turns. */
  turns: ReadonlyArray<AiChatMessage>
  /** The id of the last turn. */
  lastId: string
}

export function groupQuestions(state: AiChatQuestionState): Record<string, AiChatQuestion[]> {
  const live = state.pending
    .map(questionOf)
    .map((question) =>
      !question.bound && state.routed[question.id]
        ? { ...question, status: 'running' as const }
        : question
    )
  const ids = new Set(live.map((question) => question.id))
  const known = new Set(state.turns.map((turn) => turn.id))
  const groups: Record<string, AiChatQuestion[]> = {}
  for (const question of [
    ...live,
    ...Object.values(state.settled).filter((question) => !ids.has(question.id))
  ]) {
    const after = state.askedAfter[question.id] ?? ''
    ;(groups[known.has(after) ? after : state.lastId] ??= []).push(question)
  }
  return groups
}

export function answerQuestion(
  state: Pick<AiChatQuestionState, 'pending' | 'settled' | 'routed'>,
  question: AiChatQuestion,
  value: string
): AiChatInterrupt | undefined {
  const interrupt = state.pending.find((item) => item.id === question.id)
  state.settled[question.id] = { ...question, status: 'success', error: '' }
  if (question.bound) {
    answerInterrupt(interrupt, value)
    return undefined
  }
  state.routed[question.id] = true
  return interrupt
}

export function skipQuestion(
  state: Pick<AiChatQuestionState, 'pending' | 'settled'>,
  question: AiChatQuestion
): void {
  const interrupt = state.pending.find((item) => item.id === question.id)
  state.settled[question.id] = { ...question, status: 'skipped', error: '' }
  skipInterrupt(interrupt)
}
