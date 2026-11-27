import { computed, type ComputedRef, type MaybeRefOrGetter, ref, toValue, watch } from 'vue'

import { answerQuestion, groupQuestions, skipQuestion } from '../../utils/ai-chat-questions'
import { isQuestion, resolveInterrupt } from '../../utils/lib/ai-chat-interrupts'
import { json, toolQuestionOf } from '../../utils/lib/ai-chat-tools'
import type {
  AiChatInterrupt,
  AiChatMessage,
  AiChatQuestion,
  AiChatTool,
  AiChatToolAnswer,
  AiChatToolCallPart
} from '../../utils/lib/ai-chat-types'

/** What `useAiChatTools` reads and whom it tells. */
export interface UseAiChatToolsOptions {
  /** The reader's and the assistant's turns, oldest first. */
  turns: MaybeRefOrGetter<ReadonlyArray<AiChatMessage>>
  /** Pending requests, as `useChat` returns `interrupts`. */
  interrupts: MaybeRefOrGetter<ReadonlyArray<AiChatInterrupt>>
  /** How each tool reads, by tool name. */
  tools: MaybeRefOrGetter<Record<string, AiChatTool>>
  /** An unbound question was answered: the app routes the answer. */
  onAnswerInterrupt: (event: Event, interrupt: AiChatInterrupt, value: string) => void
  /** An answerable tool was answered: the app calls `addToolResult`. */
  onAnswerTool: (event: Event, answer: AiChatToolAnswer) => void
  /** A call was approved, with the edited arguments of an editable tool. */
  onApprove: (event: MouseEvent, call: AiChatToolCallPart, input?: unknown) => void
  /** A call was denied. */
  onDeny: (event: MouseEvent, call: AiChatToolCallPart) => void
}

/** What `useAiChatTools` returns. */
export interface UseAiChatToolsReturn {
  /** The questions to ask, grouped by the id of the turn they follow. */
  questions: ComputedRef<Record<string, AiChatQuestion[]>>
  /** Answers a question: a bound one resolves its interrupt, an unbound one goes to the app. */
  answer: (event: Event, question: AiChatQuestion, value: string) => void
  /** Skips a question. */
  skip: (question: AiChatQuestion) => void
  /** The question an answerable tool call asks, with its status. */
  askOf: (call: AiChatToolCallPart) => AiChatQuestion
  /** Answers an answerable tool call. */
  answerTool: (event: Event, call: AiChatToolCallPart, value: string) => void
  /** The arguments of a call as the reader edited them, as JSON. */
  editOf: (call: AiChatToolCallPart) => string
  /** Keeps the reader's edit of a call's arguments. */
  setEdit: (call: AiChatToolCallPart, text: string) => void
  /** Approves a call and resolves its interrupt. */
  approve: (event: MouseEvent, call: AiChatToolCallPart, text: string) => void
  /** Denies a call and resolves its interrupt. */
  deny: (event: MouseEvent, call: AiChatToolCallPart) => void
  /** Forgets every answer and edit, for a new chat. */
  reset: () => void
}

function useQuestions(options: UseAiChatToolsOptions) {
  const askedAfter = ref<Record<string, string>>({})
  const settled = ref<Record<string, AiChatQuestion>>({})
  const routed = ref<Record<string, boolean>>({})
  const lastId = () => toValue(options.turns).at(-1)?.id ?? ''
  const pending = computed(() => toValue(options.interrupts).filter(isQuestion))

  watch(
    pending,
    (now) => {
      for (const interrupt of now) askedAfter.value[interrupt.id!] ??= lastId()
    },
    { immediate: true }
  )

  const questions = computed(() =>
    groupQuestions({
      pending: pending.value,
      settled: settled.value,
      routed: routed.value,
      askedAfter: askedAfter.value,
      turns: toValue(options.turns),
      lastId: lastId()
    })
  )

  function answer(event: Event, question: AiChatQuestion, value: string): void {
    const state = { pending: pending.value, settled: settled.value, routed: routed.value }
    const interrupt = answerQuestion(state, question, value)
    if (interrupt) options.onAnswerInterrupt(event, interrupt, value)
  }

  function skip(question: AiChatQuestion): void {
    skipQuestion({ pending: pending.value, settled: settled.value }, question)
  }

  function resetQuestions(): void {
    askedAfter.value = {}
    settled.value = {}
    routed.value = {}
  }

  return { questions, answer, skip, resetQuestions }
}

export function useAiChatTools(options: UseAiChatToolsOptions): UseAiChatToolsReturn {
  const edits = ref<Record<string, string>>({})
  const toolAnswers = ref<Record<string, AiChatQuestion>>({})
  const { questions, answer, skip, resetQuestions } = useQuestions(options)

  const toolOf = (call: AiChatToolCallPart): AiChatTool =>
    toValue(options.tools)[call.name] ?? { title: '' }

  function askOf(call: AiChatToolCallPart): AiChatQuestion {
    return toolAnswers.value[call.id] ?? toolQuestionOf(call, toolOf(call))
  }

  function answerTool(event: Event, call: AiChatToolCallPart, value: string): void {
    toolAnswers.value[call.id] = { ...toolQuestionOf(call, toolOf(call)), status: 'running' }
    options.onAnswerTool(event, { toolCallId: call.id, tool: call.name, output: value })
  }

  function editOf(call: AiChatToolCallPart): string {
    return edits.value[call.id] ?? json(call.input ?? call.arguments)
  }

  function setEdit(call: AiChatToolCallPart, text: string): void {
    edits.value[call.id] = text
  }

  function approve(event: MouseEvent, call: AiChatToolCallPart, text: string): void {
    const edited =
      toolOf(call).editable && text !== json(call.input ?? call.arguments)
        ? (JSON.parse(text) as unknown)
        : undefined
    options.onApprove(event, call, edited)
    resolveInterrupt(toValue(options.interrupts), call, true, edited)
  }

  function deny(event: MouseEvent, call: AiChatToolCallPart): void {
    options.onDeny(event, call)
    resolveInterrupt(toValue(options.interrupts), call, false)
  }

  function reset(): void {
    edits.value = {}
    toolAnswers.value = {}
    resetQuestions()
  }

  return { questions, answer, skip, askOf, answerTool, editOf, setEdit, approve, deny, reset }
}
