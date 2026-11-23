<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { ChatMessageFeedbackValue, ChatMessageStatus } from '@aziontech/webkit/chat-message'
  import ChatMessage from '@aziontech/webkit/chat-message-root'
  import Conversation from '@aziontech/webkit/conversation'
  import {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/webkit/mcp-app-frame'
  import type {
    PromptInputFile,
    PromptInputMenuOption,
    PromptInputStatus
  } from '@aziontech/webkit/prompt-input'
  import PromptQueue from '@aziontech/webkit/prompt-queue'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import {
    type AiChatConnection,
    type AiChatInterrupt,
    type AiChatInterruptError,
    type AiChatMessage,
    type AiChatQuestion,
    type AiChatQueuedMessage,
    type AiChatSendContent,
    type AiChatTool,
    type AiChatToolAnswer,
    type AiChatToolCallPart,
    type AiChatUiResourcePart,
    contentOf,
    hasAnswer,
    interruptErrorText,
    isQuestion,
    json,
    queueItemOf,
    resolveInterrupt,
    toolQuestionOf
  } from '@aziontech/webkit/utils/ai-chat'
  import {
    answerQuestion,
    groupQuestions,
    skipQuestion
  } from '@aziontech/webkit/utils/ai-chat-questions'
  import { computed, nextTick, ref, watch } from 'vue'

  import AiChatComposer from './parts/ai-chat-composer.vue'
  import AiChatConnectionStatus from './parts/ai-chat-connection-status.vue'
  import AiChatHeader, { type AiChatHeaderAction } from './parts/ai-chat-header.vue'
  import AiChatHistory from './parts/ai-chat-history.vue'
  import AiChatSkeleton from './parts/ai-chat-skeleton.vue'
  import AiChatStart from './parts/ai-chat-start.vue'
  import AiChatTurn from './parts/ai-chat-turn.vue'
  import { sampleModels, sampleSuggestions, sampleTools } from './sample'

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
    /** Pending requests, as `useChat` returns `interrupts`; Approve and Deny resolve the matching approval, a generic one asks its question, and an unbound one asks it for the app to route. */
    interrupts?: ReadonlyArray<AiChatInterrupt>
    /** Why the answers to pending requests were not sent, as `useChat` returns `interruptErrors`; a retryable one offers Retry. */
    interruptErrors?: ReadonlyArray<AiChatInterruptError>
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
    /** The conversation is being restored, as `useChat` returns `isHydrating`; placeholders show in place of the empty state. */
    hydrating?: boolean
    /** A response is being generated for this chat elsewhere, as `useChat` returns `sessionGenerating`. */
    sessionGenerating?: boolean
    /** The reader may attach files from the Attach control at the start of the composer; `send` then hands over the multimodal content `sendMessage` takes. */
    attachable?: boolean
    /** An empty composer shows the round Start voice conversation control in place of Send; it emits `voice-start` and the app owns the audio session. */
    voice?: boolean
    /** The files the reader may attach, in the native accept syntax. */
    accept?: string
    /** Most files attached to one message. */
    maxFiles?: number
    /** Largest file in bytes. */
    maxFileSize?: number
    /** Turns a widget's resource into a trusted https address when it has no inline HTML; left out, only inline widgets show. */
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
    /** The models the header title picks from on desktop; left out, the sample models show. Read the chosen one from `v-model:modelKey`. */
    models?: PromptInputMenuOption[]
    /** The tools the composer's "+" menu turns on (web search, deep research); left out, the sample tools show. Read the turned-on ones from `v-model:toolKeys`. */
    toolOptions?: PromptInputMenuOption[]
  }

  const props = withDefaults(defineProps<AiChatProps>(), {
    messages: () => [],
    suggestions: undefined,
    followUps: undefined,
    loading: false,
    error: '',
    tools: () => ({}),
    interrupts: () => [],
    interruptErrors: () => [],
    queue: undefined,
    moreMessages: false,
    loadingMore: false,
    connection: 'connected',
    resuming: false,
    hydrating: false,
    sessionGenerating: false,
    attachable: true,
    voice: true,
    accept: 'image/*,application/pdf',
    maxFiles: 4,
    maxFileSize: 10485760,
    resolveAppUrl: undefined,
    models: undefined,
    toolOptions: undefined
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, content: AiChatSendContent]
    stop: [event: MouseEvent]
    'voice-start': [event: MouseEvent]
    retry: [event: MouseEvent, message: AiChatMessage]
    'new-chat': [event: MouseEvent]
    feedback: [value: ChatMessageFeedbackValue | null, message: AiChatMessage, reason?: string]
    share: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    edit: [event: MouseEvent | KeyboardEvent, message: AiChatMessage, text: string]
    branch: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    'share-chat': [event: MouseEvent | KeyboardEvent, key: string | null]
    'rename-chat': [event: MouseEvent | KeyboardEvent, key: string | null]
    'archive-chat': [event: MouseEvent | KeyboardEvent, key: string | null]
    'remove-chat': [event: MouseEvent | KeyboardEvent, key: string | null]
    approve: [event: MouseEvent, call: AiChatToolCallPart, input?: unknown]
    deny: [event: MouseEvent, call: AiChatToolCallPart]
    'remove-queued': [event: MouseEvent, item: AiChatQueuedMessage]
    'app-message': [
      message: McpAppFrameMessage,
      part: AiChatUiResourcePart,
      reply: (message: McpAppFrameMessage) => void
    ]
    'load-more': [event: Event]
    'answer-interrupt': [event: Event, interrupt: AiChatInterrupt, value: string]
    'answer-tool': [event: Event, answer: AiChatToolAnswer]
    'retry-interrupts': [event: MouseEvent]
  }>()

  const activeKey = defineModel<string | null>('activeKey', { default: null })
  /** The model chosen in the header title, one of `models`; pass it to `sendMessage` as `{ body: { model } }`. */
  const modelKey = defineModel<string>('modelKey', { default: 'auto' })
  /** The tools turned on in the composer's "+" menu, in `toolOptions` order; pass them to `sendMessage` as `{ body: { tools } }`. */
  const toolKeys = defineModel<string[]>('toolKeys', { default: () => [] })

  const { formatDate } = useLocale()

  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])
  const composerEl = ref<InstanceType<typeof AiChatComposer> | null>(null)
  const ratings = ref<Record<string, ChatMessageFeedbackValue | null>>({})
  const stoppedIds = ref<Set<string>>(new Set())
  const edits = ref<Record<string, string>>({})
  const answers = ref<Record<string, string>>({})
  const askedAfter = ref<Record<string, string>>({})
  const settled = ref<Record<string, AiChatQuestion>>({})
  const routed = ref<Record<string, boolean>>({})
  const toolAnswers = ref<Record<string, AiChatQuestion>>({})
  const historyPanel = ref(true)
  const historyDrawer = ref(false)

  const turns = computed(() =>
    props.messages.filter((message) => message.role === 'user' || message.role === 'assistant')
  )
  const starters = computed(() => props.suggestions ?? sampleSuggestions)
  const modelOptions = computed(() => props.models ?? sampleModels)
  const composerTools = computed(() => props.toolOptions ?? sampleTools)
  const welcome = computed(() => !turns.value.length && !props.hydrating)
  let refocus = false
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
    if (props.loading) return hasAnswer(turn) ? 'streaming' : 'pending'
    return 'success'
  }

  const queueable = computed(() => props.queue !== undefined)
  const queued = computed(() => (props.queue ?? []).map(queueItemOf))
  const retryable = computed(() => props.interruptErrors.some((error) => error.retryable !== false))

  const pendingQuestions = computed(() => props.interrupts.filter(isQuestion))
  watch(
    pendingQuestions,
    (now) => {
      for (const interrupt of now) askedAfter.value[interrupt.id!] ??= last.value?.id ?? ''
    },
    { immediate: true }
  )

  const questions = computed(() =>
    groupQuestions({
      pending: pendingQuestions.value,
      settled: settled.value,
      routed: routed.value,
      askedAfter: askedAfter.value,
      turns: turns.value,
      lastId: last.value?.id ?? ''
    })
  )

  function answer(event: Event, question: AiChatQuestion, value: string) {
    const state = { pending: pendingQuestions.value, settled: settled.value, routed: routed.value }
    const interrupt = answerQuestion(state, question, value)
    if (interrupt) emit('answer-interrupt', event, interrupt, value)
  }

  function askOf(call: AiChatToolCallPart): AiChatQuestion {
    return toolAnswers.value[call.id] ?? toolQuestionOf(call, toolOf(call))
  }

  function answerTool(event: Event, call: AiChatToolCallPart, value: string) {
    toolAnswers.value[call.id] = { ...toolQuestionOf(call, toolOf(call)), status: 'running' }
    emit('answer-tool', event, { toolCallId: call.id, tool: call.name, output: value })
  }

  function skip(question: AiChatQuestion) {
    skipQuestion({ pending: pendingQuestions.value, settled: settled.value }, question)
  }

  function editOf(call: AiChatToolCallPart): string {
    return edits.value[call.id] ?? json(call.input ?? call.arguments)
  }

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.role === 'assistant' && hasAnswer(last.value) ? 'streaming' : 'pending'
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

  watch(welcome, (now) => {
    if (now || !refocus) return
    refocus = false
    void nextTick(() => composerEl.value?.focus())
  })

  async function send(event: MouseEvent | KeyboardEvent, text: string, typed = false) {
    const attached = files.value
    const picked = attached.flatMap((item) => (item.file instanceof File ? [item.file] : []))
    if ((!text.trim() && !picked.length) || (state.value !== 'ready' && !queueable.value)) return
    prompt.value = ''
    files.value = []
    let content: AiChatSendContent
    try {
      content = await contentOf(text, picked)
    } catch {
      prompt.value = text
      files.value = attached
      return
    }
    refocus = typed
    emit('send', event, content)
  }

  function stop(event: MouseEvent) {
    if (props.loading && last.value?.role === 'assistant') stoppedIds.value.add(last.value.id)
    emit('stop', event)
  }

  function newChat(event: MouseEvent) {
    prompt.value = ''
    files.value = []
    stoppedIds.value.clear()
    edits.value = {}
    answers.value = {}
    askedAfter.value = {}
    settled.value = {}
    routed.value = {}
    toolAnswers.value = {}
    activeKey.value = null
    emit('new-chat', event)
  }

  function rate(message: AiChatMessage, value: ChatMessageFeedbackValue | null, reason?: string) {
    ratings.value[message.id] = value
    emit('feedback', value, message, reason)
  }

  function onChatAction(event: MouseEvent | KeyboardEvent, action: AiChatHeaderAction) {
    if (action === 'share') emit('share-chat', event, activeKey.value)
    else if (action === 'rename') emit('rename-chat', event, activeKey.value)
    else if (action === 'archive') emit('archive-chat', event, activeKey.value)
    else emit('remove-chat', event, activeKey.value)
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
    data-layout-fill
    class="flex min-h-0 w-full grow basis-0"
  >
    <AiChatHistory
      v-model="activeKey"
      v-model:drawer-open="historyDrawer"
      :panel-open="historyPanel"
      @create="newChat"
    />
    <div class="relative flex min-h-0 min-w-0 flex-1 flex-col">
      <AiChatHeader
        v-model:model-key="modelKey"
        :empty="!turns.length"
        :history-open="historyPanel"
        :models="modelOptions"
        @new-chat="newChat"
        @open-history="historyDrawer = true"
        @toggle-history="historyPanel = !historyPanel"
        @action="onChatAction"
      />
      <AiChatStart
        v-if="welcome"
        :starters="starters"
        @select="(event, item) => send(event, item.label)"
      >
        <AiChatConnectionStatus
          :connection="connection"
          :resuming="resuming"
          :session-generating="sessionGenerating"
          :loading="loading"
        />
        <AiChatComposer
          ref="composerEl"
          v-model="prompt"
          v-model:files="files"
          v-model:tool-keys="toolKeys"
          :state="state"
          :queueable="queueable"
          :hydrating="hydrating"
          :accept="accept"
          :max-files="maxFiles"
          :max-file-size="maxFileSize"
          :attachable="attachable"
          :voice="voice"
          :tools="composerTools"
          @submit="(event, text) => send(event, text, true)"
          @stop="stop"
          @voice-start="emit('voice-start', $event)"
        />
      </AiChatStart>
      <Conversation
        v-else
        aria-label="Conversation with the AI assistant"
        :more-messages="moreMessages"
        :loading-more="loadingMore"
        @load-more="emit('load-more', $event)"
      >
        <div
          aria-hidden="true"
          class="h-(--spacing-lg) shrink-0"
        />
        <AiChatSkeleton v-if="!turns.length" />
        <AiChatTurn
          v-for="turn in turns"
          :key="turn.id"
          v-model:answers="answers"
          :turn="turn"
          :messages="messages"
          :status="statusOf(turn)"
          :time="timeOf(turn)"
          :failure="failure"
          :tools="tools"
          :busy="loading && turn === last"
          :ready="state === 'ready'"
          :stopped="stopped(turn)"
          :rating="ratings[turn.id] ?? null"
          :questions="questions[turn.id]"
          :ask-of="askOf"
          :edit-of="editOf"
          :resolve-app-url="resolveAppUrl"
          @retry="emit('retry', $event, turn)"
          @rate="(value, reason?: string) => rate(turn, value, reason)"
          @share="(event: MouseEvent | KeyboardEvent) => emit('share', event, turn)"
          @branch="(event: MouseEvent | KeyboardEvent) => emit('branch', event, turn)"
          @edit-prompt="
            (event: MouseEvent | KeyboardEvent, text: string) => emit('edit', event, turn, text)
          "
          @answer-tool="answerTool"
          @edit="(call, text) => (edits[call.id] = text)"
          @approve="approve"
          @deny="deny"
          @answer="answer"
          @skip="skip"
          @app-message="(message, part, reply) => emit('app-message', message, part, reply)"
        />
        <ChatMessage
          v-if="waiting && last"
          :status="failure ? 'error' : 'pending'"
          :error-message="failure || undefined"
          @retry="emit('retry', $event, last)"
        />
        <SuggestionGroup
          v-if="lastAnswer && followUps?.length"
          :items="followUps"
          aria-label="Follow-up questions"
          @select="(event, item) => send(event, item.label)"
        />
        <template #composer>
          <AiChatConnectionStatus
            :connection="connection"
            :resuming="resuming"
            :session-generating="sessionGenerating"
            :loading="loading"
          />
          <Alert
            key="alert-2"
            v-if="interruptErrors.length"
            severity="danger"
            size="small"
            title="Your answer was not sent"
            :action-label="retryable ? 'Retry' : ''"
            @action="emit('retry-interrupts', $event)"
          >
            {{ interruptErrorText(interruptErrors) }}
          </Alert>
          <PromptQueue
            v-if="queued.length"
            :items="queued"
            @remove="(event, item) => removeQueued(event, item.id)"
          />
          <AiChatComposer
            ref="composerEl"
            v-model="prompt"
            v-model:files="files"
            v-model:tool-keys="toolKeys"
            :state="state"
            :queueable="queueable"
            :hydrating="hydrating"
            :accept="accept"
            :max-files="maxFiles"
            :max-file-size="maxFileSize"
            :attachable="attachable"
            :voice="voice"
            :tools="composerTools"
            @submit="(event, text) => send(event, text, true)"
            @stop="stop"
            @voice-start="emit('voice-start', $event)"
          />
        </template>
      </Conversation>
    </div>
  </section>
</template>
