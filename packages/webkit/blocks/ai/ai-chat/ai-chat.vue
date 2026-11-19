<script setup lang="ts">
  import AgentActivity from '@aziontech/webkit/agent-activity'
  import AgentQuestion from '@aziontech/webkit/agent-question'
  import Alert from '@aziontech/webkit/alert'
  import AudioPlayer from '@aziontech/webkit/audio-player'
  import Button from '@aziontech/webkit/button'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageStatus
  } from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FilePreview from '@aziontech/webkit/file-preview'
  import IconButton from '@aziontech/webkit/icon-button'
  import ImageGallery from '@aziontech/webkit/image-gallery'
  import McpAppFrame, {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/webkit/mcp-app-frame'
  import type { PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import PromptQueue from '@aziontech/webkit/prompt-queue'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources from '@aziontech/webkit/sources'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SubagentCard from '@aziontech/webkit/subagent-card'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import ToolCall from '@aziontech/webkit/tool-call'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import VideoPlayer from '@aziontech/webkit/video-player'
  import { computed, ref, watch } from 'vue'

  import {
    activitiesBefore,
    type AiChatConnection,
    type AiChatInterrupt,
    type AiChatMessage,
    type AiChatQuestion,
    type AiChatQueuedMessage,
    type AiChatTool,
    type AiChatToolCallPart,
    type AiChatUiResourcePart,
    answerInterrupt,
    approvalOf,
    documentNameOf,
    hasText,
    isQuestion,
    json,
    needsApproval,
    parsesAsJson,
    questionOf,
    queueItemOf,
    resolveInterrupt,
    segmentsOf,
    skipInterrupt,
    stopSubagent,
    subagentStatusOf,
    subagentTextOf,
    textOf,
    toolStatusOf
  } from './messages'
  import { sampleSuggestions } from './sample'

  export type {
    AiChatActivityPart,
    AiChatAudioPart,
    AiChatConnection,
    AiChatDocumentPart,
    AiChatImagePart,
    AiChatInterrupt,
    AiChatMediaSource,
    AiChatMessage,
    AiChatMessageMetadata,
    AiChatOtherPart,
    AiChatPart,
    AiChatQueuedMessage,
    AiChatRole,
    AiChatSubagentPart,
    AiChatSubagentStatus,
    AiChatTextPart,
    AiChatThinkingPart,
    AiChatTool,
    AiChatToolCallPart,
    AiChatToolCallState,
    AiChatToolResultPart,
    AiChatUiResourcePart,
    AiChatVideoPart
  } from './messages'

  /** A rating the reader gave a response. */
  export interface AiChatFeedback {
    /** The rated response. */
    message: AiChatMessage
    /** Helpful, not helpful, or cleared. */
    value: ChatMessageFeedbackValue | null
  }

  export interface AiChatProps {
    /** The conversation, oldest first, as TanStack AI's `useChat` returns `messages`. Empty, the empty state renders. */
    messages?: ReadonlyArray<AiChatMessage>
    /** Starter prompts under the empty state. Left out, the sample prompts render. */
    suggestions?: SuggestionGroupItem[]
    /** Follow-up questions shown under the last finished response. */
    followUps?: SuggestionGroupItem[]
    /** The assistant is responding, as `useChat` returns `isLoading`. */
    loading?: boolean
    /** Why the last response failed: a sentence, or the `error` of `useChat`, which shows the standard sentence. */
    error?: string | { message: string } | null
    /** How each tool reads, by tool name; a tool left out shows its name. */
    tools?: Record<string, AiChatTool>
    /** Pending requests, as `useChat` returns `interrupts`; Approve and Deny resolve the matching approval, and a generic one asks its question. */
    interrupts?: ReadonlyArray<AiChatInterrupt>
    /** Messages waiting to be sent, as `useChat` returns `queue`; given, the composer sends while a response runs. */
    queue?: ReadonlyArray<AiChatQueuedMessage>
    /** Older messages exist, as `useChat` returns `hasOlderMessages`. */
    moreMessages?: boolean
    /** The older messages are loading. */
    loadingMore?: boolean
    /** The connection to the chat, as `useChat` returns `connectionStatus`. */
    connection?: AiChatConnection
    /** The chat is rejoining a run after a reload, as `useChat` returns `resuming`. */
    resuming?: boolean
    /** Turns a widget's resource into a trusted https address when it has no inline HTML; left out, only inline widgets show. */
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
  }

  const props = withDefaults(defineProps<AiChatProps>(), {
    messages: () => [],
    suggestions: undefined,
    followUps: undefined,
    loading: false,
    error: '',
    tools: () => ({}),
    interrupts: () => [],
    queue: undefined,
    moreMessages: false,
    loadingMore: false,
    connection: 'connected',
    resuming: false,
    resolveAppUrl: undefined
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, text: string]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiChatMessage]
    'new-chat': [event: MouseEvent]
    feedback: [feedback: AiChatFeedback]
    approve: [event: MouseEvent, call: AiChatToolCallPart, input?: unknown]
    deny: [event: MouseEvent, call: AiChatToolCallPart]
    'remove-queued': [event: MouseEvent, item: AiChatQueuedMessage]
    'app-message': [
      message: McpAppFrameMessage,
      part: AiChatUiResourcePart,
      reply: (message: McpAppFrameMessage) => void
    ]
    'load-more': [event: Event]
  }>()

  const appFrames = new Map<string, InstanceType<typeof McpAppFrame>>()

  function setAppFrame(key: string, el: unknown) {
    if (el) appFrames.set(key, el as InstanceType<typeof McpAppFrame>)
    else appFrames.delete(key)
  }

  function forwardAppMessage(key: string, part: AiChatUiResourcePart, message: McpAppFrameMessage) {
    emit('app-message', message, part, (reply) => appFrames.get(key)?.post(reply))
  }

  const { formatDate } = useLocale()

  const prompt = ref('')
  const composerEl = ref<InstanceType<typeof PromptInput> | null>(null)
  const ratings = ref<Record<string, ChatMessageFeedbackValue | null>>({})
  const stoppedIds = ref<Set<string>>(new Set())
  const edits = ref<Record<string, string>>({})
  const answers = ref<Record<string, string>>({})
  const askedAfter = ref<Record<string, string>>({})
  const settled = ref<Record<string, AiChatQuestion>>({})

  const turns = computed(() =>
    props.messages.filter((message) => message.role === 'user' || message.role === 'assistant')
  )
  const starters = computed(() => props.suggestions ?? sampleSuggestions)
  const last = computed(() => turns.value[turns.value.length - 1])
  const failure = computed(() => {
    if (!props.error) return ''
    if (typeof props.error === 'string') return props.error
    return 'The connection was interrupted before the response finished.'
  })
  const waiting = computed(
    () => (props.loading || Boolean(failure.value)) && last.value?.role === 'user'
  )

  function statusOf(turn: AiChatMessage): ChatMessageStatus {
    if (turn.role === 'user' || turn !== last.value) return 'success'
    if (failure.value) return 'error'
    if (props.loading) return hasText(turn) ? 'streaming' : 'pending'
    return 'success'
  }

  const queueable = computed(() => props.queue !== undefined)
  const queued = computed(() => (props.queue ?? []).map(queueItemOf))
  const reconnecting = computed(() => props.connection === 'connecting' || props.resuming)
  const offline = computed(
    () =>
      !reconnecting.value && (props.connection === 'disconnected' || props.connection === 'error')
  )

  const pendingQuestions = computed(() => props.interrupts.filter(isQuestion))
  watch(
    pendingQuestions,
    (now) => {
      for (const interrupt of now) askedAfter.value[interrupt.id!] ??= last.value?.id ?? ''
    },
    { immediate: true }
  )

  const questions = computed(() => {
    const live = pendingQuestions.value.map(questionOf)
    const ids = new Set(live.map((question) => question.id))
    const known = new Set(turns.value.map((turn) => turn.id))
    const groups: Record<string, AiChatQuestion[]> = {}
    for (const question of [
      ...live,
      ...Object.values(settled.value).filter((question) => !ids.has(question.id))
    ]) {
      const after = askedAfter.value[question.id] ?? ''
      ;(groups[known.has(after) ? after : (last.value?.id ?? '')] ??= []).push(question)
    }
    return groups
  })

  function answer(question: AiChatQuestion, value: string) {
    const interrupt = pendingQuestions.value.find((item) => item.id === question.id)
    settled.value[question.id] = { ...question, status: 'success', error: '' }
    answerInterrupt(interrupt, value)
  }

  function skip(question: AiChatQuestion) {
    const interrupt = pendingQuestions.value.find((item) => item.id === question.id)
    settled.value[question.id] = { ...question, status: 'skipped', error: '' }
    skipInterrupt(interrupt)
  }

  function editOf(call: AiChatToolCallPart): string {
    return edits.value[call.id] ?? json(call.input ?? call.arguments)
  }

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.role === 'assistant' && hasText(last.value) ? 'streaming' : 'pending'
  })

  function stopped(turn: AiChatMessage): boolean {
    return Boolean(turn.metadata?.stopped) || stoppedIds.value.has(turn.id)
  }

  const lastAnswer = computed(() => {
    const turn = last.value
    return turn?.role === 'assistant' && statusOf(turn) === 'success' && !stopped(turn)
      ? turn
      : null
  })

  function timeOf(turn: AiChatMessage): string {
    return turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''
  }

  function toolOf(call: AiChatToolCallPart): AiChatTool {
    return props.tools[call.name] ?? { title: '' }
  }

  watch(
    () => props.loading,
    (now, before) => {
      if (before && !now) composerEl.value?.focus()
    }
  )

  function send(event: MouseEvent | KeyboardEvent, text: string) {
    if (!text.trim() || (state.value !== 'ready' && !queueable.value)) return
    prompt.value = ''
    emit('send', event, text)
  }

  function stop(event: MouseEvent) {
    if (props.loading && last.value?.role === 'assistant') stoppedIds.value.add(last.value.id)
    emit('stop', event)
  }

  function newChat(event: MouseEvent) {
    prompt.value = ''
    stoppedIds.value.clear()
    edits.value = {}
    answers.value = {}
    askedAfter.value = {}
    settled.value = {}
    emit('new-chat', event)
  }

  function rate(message: AiChatMessage, value: ChatMessageFeedbackValue | null) {
    ratings.value[message.id] = value
    emit('feedback', { message, value })
  }

  function removeQueued(event: MouseEvent, id: string) {
    const item = props.queue?.find((entry) => entry.id === id)
    if (item) emit('remove-queued', event, item)
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
</script>

<template>
  <section
    aria-labelledby="ai-chat-title"
    class="flex min-h-0 w-full grow basis-0 flex-col"
  >
    <header
      class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <div class="flex items-center gap-(--spacing-xs)">
        <h1
          id="ai-chat-title"
          class="text-heading-xs text-(--text-default)"
        >
          AI assistant
        </h1>
        <Tag
          label="Preview"
          severity="info"
          size="small"
        />
      </div>
      <Button
        label="New chat"
        variant="ghost"
        size="small"
        icon="az az-plus"
        :disabled="!turns.length"
        @click="newChat"
      />
    </header>
    <div class="flex min-h-0 flex-1 flex-col">
      <div
        v-if="!turns.length"
        class="layout-column-content layout-boundary-inline flex flex-1 flex-col justify-center gap-(--spacing-lg) py-(--spacing-md)"
      >
        <EmptyState
          title="How can I help with your Azion account?"
          description="Ask about your workloads, cache, security rules and deployments. Answers cite the documentation they come from."
          icon="az az-ask-azion"
        />
        <SuggestionGroup
          :items="starters"
          orientation="vertical"
          @select="(event, item) => send(event, item.label)"
        />
      </div>
      <Conversation
        v-else
        aria-label="Conversation with the AI assistant"
        :more-messages="moreMessages"
        :loading-more="loadingMore"
        @load-more="emit('load-more', $event)"
      >
        <template
          v-for="turn in turns"
          :key="turn.id"
        >
          <ChatMessage
            :from="turn.role === 'user' ? 'user' : 'assistant'"
            :status="statusOf(turn)"
            :timestamp="timeOf(turn)"
            :error-message="statusOf(turn) === 'error' ? failure : undefined"
            @retry="emit('retry', $event, turn)"
          >
            <template v-if="turn.role === 'user'">{{ textOf(turn, '\n') }}</template>
            <template v-else>
              <template
                v-for="segment in segmentsOf(turn, activitiesBefore(messages, turn))"
                :key="segment.key"
              >
                <AgentActivity
                  v-if="segment.type === 'activity'"
                  :steps="segment.steps"
                />
                <Reasoning
                  v-else-if="segment.type === 'reasoning'"
                  :streaming="statusOf(turn) === 'pending'"
                  :duration="
                    statusOf(turn) === 'pending' ? undefined : turn.metadata?.reasoningSeconds
                  "
                >
                  <p class="whitespace-pre-line">{{ segment.content }}</p>
                </Reasoning>
                <StreamingResponse
                  v-else-if="segment.type === 'text'"
                  :content="segment.content"
                  :streaming="statusOf(turn) === 'streaming'"
                  :sources="turn.metadata?.sources ?? []"
                  :anchor="`answer-${turn.id}`"
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
                    v-if="!needsApproval(segment.call) || approvalOf(segment.call) === 'approved'"
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
                        json(
                          segment.result?.error || segment.call.output || segment.result?.content
                        )
                      "
                      #output
                    >
                      <CodeBlock
                        :code="
                          json(
                            segment.result?.error || segment.call.output || segment.result?.content
                          )
                        "
                        language="json"
                        :show-line-numbers="false"
                      />
                    </template>
                  </ToolCall>
                </template>
                <ImageGallery
                  v-else-if="segment.type === 'gallery'"
                  :items="segment.images"
                />
                <AudioPlayer
                  v-else-if="segment.type === 'audio'"
                  :src="segment.src"
                />
                <VideoPlayer
                  v-else-if="segment.type === 'video'"
                  :src="segment.src"
                  :mime-type="segment.mimeType"
                />
                <FilePreview
                  v-else-if="segment.type === 'document'"
                  :file-name="documentNameOf(segment.part)"
                  :mime-type="segment.part.source.mimeType"
                  :src="segment.part.source.type === 'url' ? segment.part.source.value : ''"
                  :base64="segment.part.source.type === 'data' ? segment.part.source.value : ''"
                />
                <SubagentCard
                  v-else-if="segment.type === 'subagent'"
                  :name="segment.part.subagent.name"
                  :title="segment.part.subagent.description"
                  :description="segment.part.subagent.error?.message"
                  :status="subagentStatusOf(segment.part)"
                  :stoppable="typeof segment.part.subagent.stop === 'function'"
                  @stop="stopSubagent(segment.part)"
                >
                  <StreamingResponse
                    v-if="subagentTextOf(segment.part)"
                    :content="subagentTextOf(segment.part)"
                  />
                  <template
                    v-if="json(segment.part.subagent.input)"
                    #input
                  >
                    <CodeBlock
                      :code="json(segment.part.subagent.input)"
                      language="json"
                      :show-line-numbers="false"
                    />
                  </template>
                </SubagentCard>
                <McpAppFrame
                  v-else-if="segment.type === 'app'"
                  :ref="(el) => setAppFrame(segment.key, el)"
                  :resource="segment.part.resource"
                  :title="
                    (tools[segment.part.toolName] ?? { title: '' }).title || segment.part.toolName
                  "
                  :resolve-url="resolveAppUrl"
                  @message="(message) => forwardAppMessage(segment.key, segment.part, message)"
                />
              </template>
              <p
                v-if="stopped(turn)"
                class="text-body-sm text-(--text-muted)"
              >
                You stopped this response.
              </p>
              <Sources
                v-if="statusOf(turn) === 'success' && !stopped(turn)"
                :items="turn.metadata?.sources ?? []"
                :anchor="`answer-${turn.id}`"
              />
            </template>
            <template
              v-if="turn.role === 'assistant'"
              #actions
            >
              <ChatMessage.Actions>
                <CopyButton
                  size="small"
                  :value="textOf(turn)"
                />
                <IconButton
                  icon="az az-refresh"
                  aria-label="Regenerate response"
                  variant="ghost"
                  size="small"
                  :disabled="state !== 'ready'"
                  @click="emit('retry', $event, turn)"
                />
                <ChatMessage.Feedback
                  :model-value="ratings[turn.id] ?? null"
                  @update:model-value="(value) => rate(turn, value)"
                />
              </ChatMessage.Actions>
            </template>
          </ChatMessage>
          <ChatMessage
            v-if="questions[turn.id]?.length"
            from="assistant"
          >
            <AgentQuestion
              v-for="question in questions[turn.id]"
              :key="question.id"
              v-model="answers[question.id]"
              :title="question.title"
              :type="question.options.length ? 'choice' : 'text'"
              :options="question.options"
              :status="question.status"
              :error="question.error"
              skippable
              @submit="(_event, value) => answer(question, value)"
              @skip="skip(question)"
            />
          </ChatMessage>
        </template>
        <ChatMessage
          v-if="waiting && last"
          :status="failure ? 'error' : 'pending'"
          :error-message="failure || undefined"
          @retry="emit('retry', $event, last)"
        />
        <div
          v-if="lastAnswer && followUps?.length"
          class="ps-[calc(2rem+var(--spacing-sm))]"
        >
          <SuggestionGroup
            :items="followUps"
            aria-label="Follow-up questions"
            @select="(event, item) => send(event, item.label)"
          />
        </div>
      </Conversation>
    </div>
    <footer
      class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-xs) pb-(--spacing-md)"
    >
      <StatusIndicator
        v-if="reconnecting"
        severity="warning"
        label="Reconnecting"
        loading
      />
      <Alert
        v-else-if="offline"
        severity="danger"
        size="small"
        title="Connection lost"
      >
        Your messages send when the connection returns.
      </Alert>
      <PromptQueue
        v-if="queued.length"
        :items="queued"
        @remove="(event, item) => removeQueued(event, item.id)"
      />
      <PromptInput
        ref="composerEl"
        v-model="prompt"
        :status="state"
        :queueable="queueable"
        :max-length="4000"
        @submit="(event, { value }) => send(event, value)"
        @stop="stop"
      >
        <template #hint>
          The AI assistant can make mistakes. Check important information before you act on it.
        </template>
      </PromptInput>
    </footer>
  </section>
</template>
