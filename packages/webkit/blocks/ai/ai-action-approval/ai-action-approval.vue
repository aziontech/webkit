<script setup lang="ts">
  import AgentQuestion from '@aziontech/webkit/agent-question'
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ChatMessage, { type ChatMessageStatus } from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import ImageGallery from '@aziontech/webkit/image-gallery'
  import type { PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import ToolCall from '@aziontech/webkit/tool-call'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import {
    type AiChatInterrupt,
    type AiChatInterruptError,
    type AiChatMessage,
    type AiChatQuestion,
    type AiChatTool,
    type AiChatToolCallPart,
    answerInterrupt,
    approvalOf,
    hasAnswer,
    hasText,
    interruptErrorText,
    isQuestion,
    isToolCallPart,
    isToolResultPart,
    json,
    needsApproval,
    parsesAsJson,
    questionOf,
    resolveInterrupt,
    segmentsOf,
    skipInterrupt,
    structuredOf,
    textOf,
    toolContentOf,
    toolStatusOf
  } from '@aziontech/webkit/utils/ai-chat'
  import { computed, ref } from 'vue'

  import { sampleMessages, sampleTools } from './sample'

  export interface AiActionApprovalProps {
    /** The conversation, oldest first, as TanStack AI's `useChat` returns `messages`. Left out, the sample deployment renders. */
    messages?: ReadonlyArray<AiChatMessage>
    /** The assistant is responding or an approved call runs, as `useChat` returns `isLoading`. */
    loading?: boolean
    /** Why the last response failed: a sentence, or the `error` of `useChat`, which shows the standard sentence. */
    error?: string | { message: string } | null
    /** How each tool reads, by tool name: the call's title, the approval question, its verb and whether it is irreversible. */
    tools?: Record<string, AiChatTool>
    /** Pending requests, as `useChat` returns `interrupts`; the approve button and Deny resolve the matching one, a generic one asks its question, and an unbound one asks it for the app to route. */
    interrupts?: ReadonlyArray<AiChatInterrupt>
    /** Why the decisions were not sent, as `useChat` returns `interruptErrors`; a retryable one offers Retry. */
    interruptErrors?: ReadonlyArray<AiChatInterruptError>
  }

  const props = withDefaults(defineProps<AiActionApprovalProps>(), {
    messages: undefined,
    loading: false,
    error: '',
    tools: undefined,
    interrupts: () => [],
    interruptErrors: () => []
  })

  const emit = defineEmits<{
    approve: [event: MouseEvent, call: AiChatToolCallPart, input?: unknown]
    deny: [event: MouseEvent, call: AiChatToolCallPart]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiChatMessage]
    send: [event: MouseEvent | KeyboardEvent, text: string]
    'answer-interrupt': [event: Event, interrupt: AiChatInterrupt, value: string]
    'retry-interrupts': [event: MouseEvent]
  }>()

  const { formatDate } = useLocale()

  const prompt = ref('')
  const edits = ref<Record<string, string>>({})
  const answers = ref<Record<string, string>>({})
  const settled = ref<Record<string, AiChatQuestion>>({})
  const routed = ref<Record<string, boolean>>({})

  const turns = computed(() =>
    (props.messages ?? sampleMessages).filter(
      (message) => message.role === 'user' || message.role === 'assistant'
    )
  )
  const toolLabels = computed(() => props.tools ?? (props.messages ? {} : sampleTools))
  const last = computed(() => turns.value[turns.value.length - 1])
  const failure = computed(() => {
    if (!props.error) return ''
    if (typeof props.error === 'string') return props.error
    return 'The connection was interrupted before the response finished.'
  })

  function statusOf(turn: AiChatMessage): ChatMessageStatus {
    if (turn.role === 'user' || turn !== last.value) return 'success'
    if (failure.value) return 'error'
    if (props.loading && !runs(turn)) return hasAnswer(turn) ? 'streaming' : 'pending'
    return 'success'
  }

  function runs(turn: AiChatMessage): boolean {
    return turn.parts.some(
      (part) =>
        isToolCallPart(part) &&
        ['running', 'streaming'].includes(toolStatusOf(part)) &&
        (!needsApproval(part) || approvalOf(part) === 'approved')
    )
  }

  function failed(turn: AiChatMessage): boolean {
    const results = turn.parts.filter(isToolResultPart)
    return turn.parts.some(
      (part) =>
        isToolCallPart(part) &&
        toolStatusOf(
          part,
          results.find((result) => result.toolCallId === part.id)
        ) === 'error'
    )
  }

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.role === 'assistant' && (hasAnswer(last.value) || runs(last.value))
      ? 'streaming'
      : 'pending'
  })

  function timeOf(turn: AiChatMessage): string {
    return turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''
  }

  function toolOf(call: AiChatToolCallPart): AiChatTool {
    return toolLabels.value[call.name] ?? { title: '' }
  }

  function editOf(call: AiChatToolCallPart): string {
    return edits.value[call.id] ?? json(call.input ?? call.arguments)
  }

  function approve(event: MouseEvent, call: AiChatToolCallPart, text: string) {
    const edited =
      toolOf(call).editable && text !== json(call.input ?? call.arguments)
        ? (JSON.parse(text) as unknown)
        : undefined
    emit('approve', event, call, edited)
    resolveInterrupt(props.interrupts, call, true, edited)
  }

  function deny(event: MouseEvent, call: AiChatToolCallPart) {
    emit('deny', event, call)
    resolveInterrupt(props.interrupts, call, false)
  }

  const pendingQuestions = computed(() => props.interrupts.filter(isQuestion))
  const retryable = computed(() => props.interruptErrors.some((error) => error.retryable !== false))

  const questions = computed(() => {
    const live = pendingQuestions.value
      .map(questionOf)
      .map((question) =>
        !question.bound && routed.value[question.id]
          ? { ...question, status: 'running' as const }
          : question
      )
    const ids = new Set(live.map((question) => question.id))
    return [...live, ...Object.values(settled.value).filter((question) => !ids.has(question.id))]
  })

  function answer(event: Event, question: AiChatQuestion, value: string) {
    const interrupt = pendingQuestions.value.find((item) => item.id === question.id)
    settled.value[question.id] = { ...question, status: 'success', error: '' }
    if (question.bound) {
      answerInterrupt(interrupt, value)
    } else {
      routed.value[question.id] = true
      if (interrupt) emit('answer-interrupt', event, interrupt, value)
    }
  }

  function skip(question: AiChatQuestion) {
    const interrupt = pendingQuestions.value.find((item) => item.id === question.id)
    settled.value[question.id] = { ...question, status: 'skipped', error: '' }
    skipInterrupt(interrupt)
  }

  function send(event: MouseEvent | KeyboardEvent, value: string) {
    if (!value.trim() || state.value !== 'ready') return
    prompt.value = ''
    emit('send', event, value)
  }
</script>

<template>
  <section
    aria-labelledby="ai-approval-title"
    class="flex min-h-0 w-full grow basis-0 flex-col"
  >
    <header class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)">
      <h1
        id="ai-approval-title"
        class="text-heading-xs text-(--text-default)"
      >
        AI assistant
      </h1>
    </header>
    <Conversation aria-label="Conversation with the AI assistant">
      <ChatMessage
        v-for="turn in turns"
        :key="turn.id"
        :from="turn.role === 'user' ? 'user' : 'assistant'"
        :status="statusOf(turn)"
        :timestamp="timeOf(turn)"
        :error-message="statusOf(turn) === 'error' ? failure : undefined"
        @retry="emit('retry', $event, turn)"
      >
        <template v-if="turn.role === 'user'">{{ textOf(turn, '\n') }}</template>
        <template v-else>
          <template
            v-for="segment in segmentsOf(turn)"
            :key="segment.key"
          >
            <StreamingResponse
              v-if="segment.type === 'text'"
              :content="segment.content"
              :streaming="statusOf(turn) === 'streaming'"
            />
            <template v-else-if="segment.type === 'tool'">
              <ToolApproval
                v-if="needsApproval(segment.call)"
                :title="
                  toolOf(segment.call).question ||
                  toolOf(segment.call).title ||
                  `Run ${segment.call.name}?`
                "
                :description="toolOf(segment.call).description"
                :approve-label="toolOf(segment.call).approveLabel"
                :variant="toolOf(segment.call).variant"
                :confirmation-phrase="toolOf(segment.call).confirmationPhrase"
                :status="approvalOf(segment.call)"
                :loading="loading && turn === last"
                :editable="toolOf(segment.call).editable"
                :invalid="toolOf(segment.call).editable && !parsesAsJson(editOf(segment.call))"
                :model-value="editOf(segment.call)"
                @update:model-value="(text) => (edits[segment.call.id] = text)"
                @approve="(event, text) => approve(event, segment.call, text)"
                @deny="deny($event, segment.call)"
              >
                <CodeBlock
                  v-if="
                    !toolOf(segment.call).editable &&
                    json(segment.call.input ?? segment.call.arguments)
                  "
                  :code="json(segment.call.input ?? segment.call.arguments)"
                  language="json"
                  :show-line-numbers="false"
                />
              </ToolApproval>
              <ToolCall
                v-if="!needsApproval(segment.call) || approvalOf(segment.call) !== 'pending'"
                :name="segment.call.name"
                :title="toolOf(segment.call).title"
                :status="toolStatusOf(segment.call, segment.result)"
              >
                <template
                  v-if="json(segment.call.input ?? segment.call.arguments)"
                  #input
                >
                  <CodeBlock
                    :code="json(segment.call.input ?? segment.call.arguments)"
                    language="json"
                    :show-line-numbers="false"
                  />
                </template>
                <template
                  v-if="
                    !segment.result?.error &&
                    segment.call.output === undefined &&
                    toolContentOf(segment.result?.content)
                  "
                  #output
                >
                  <p
                    v-if="toolContentOf(segment.result?.content)?.text"
                    class="whitespace-pre-line text-body-sm text-(--text-default)"
                  >
                    {{ toolContentOf(segment.result?.content)?.text }}
                  </p>
                  <ImageGallery
                    v-if="toolContentOf(segment.result?.content)?.images.length"
                    :items="toolContentOf(segment.result?.content)?.images ?? []"
                  />
                </template>
                <template
                  v-else-if="
                    json(segment.result?.error || segment.call.output || segment.result?.content)
                  "
                  #output
                >
                  <CodeBlock
                    :code="
                      json(segment.result?.error || segment.call.output || segment.result?.content)
                    "
                    language="json"
                    :show-line-numbers="false"
                  />
                </template>
              </ToolCall>
            </template>
            <template v-else-if="segment.type === 'structured'">
              <Alert
                v-if="segment.part.status === 'error'"
                severity="danger"
                size="small"
                title="The structured answer failed"
              >
                {{ segment.part.errorMessage || 'The answer did not match the expected format.' }}
              </Alert>
              <CodeBlock
                v-else-if="structuredOf(segment.part)"
                :code="structuredOf(segment.part)"
                language="json"
                :show-line-numbers="false"
                :aria-busy="segment.part.status === 'streaming' || undefined"
              />
            </template>
          </template>
        </template>
        <template
          v-if="
            turn.role === 'assistant' &&
            hasText(turn) &&
            statusOf(turn) === 'success' &&
            !(loading && turn === last)
          "
          #actions
        >
          <ChatMessage.Actions>
            <CopyButton
              size="small"
              :value="textOf(turn)"
            />
            <Button
              v-if="turn === last && failed(turn)"
              label="Retry"
              variant="outline"
              size="small"
              icon="az az-refresh"
              @click="emit('retry', $event, turn)"
            />
          </ChatMessage.Actions>
        </template>
      </ChatMessage>
      <ChatMessage
        v-if="questions.length"
        from="assistant"
      >
        <AgentQuestion
          v-for="question in questions"
          :key="question.id"
          v-model="answers[question.id]"
          :title="question.title"
          :type="question.options.length ? 'choice' : 'text'"
          :options="question.options"
          :status="question.status"
          :error="question.error"
          :skippable="question.bound"
          @submit="(event, value) => answer(event, question, value)"
          @skip="skip(question)"
        />
      </ChatMessage>
    </Conversation>
    <footer
      class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-xs) pb-(--spacing-md)"
    >
      <Alert
        v-if="interruptErrors.length"
        severity="danger"
        size="small"
        title="Your decision was not sent"
        :action-label="retryable ? 'Retry' : ''"
        @action="emit('retry-interrupts', $event)"
      >
        {{ interruptErrorText(interruptErrors) }}
      </Alert>
      <PromptInput
        v-model="prompt"
        :status="state"
        @submit="(event, { value }) => send(event, value)"
        @stop="emit('stop', $event)"
      >
        <template #hint>
          The assistant runs nothing in your account without your approval.
        </template>
      </PromptInput>
    </footer>
  </section>
</template>
