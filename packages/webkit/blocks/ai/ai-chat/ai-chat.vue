<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { ChatMessageFeedbackValue, ChatMessageStatus } from '@aziontech/webkit/chat-message'
  import ChatMessage from '@aziontech/webkit/chat-message-root'
  import Conversation from '@aziontech/webkit/conversation'
  import type { FeedbackReasonDialogPayload } from '@aziontech/webkit/feedback-reason-dialog'
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
  import { useAiChatTools } from '@aziontech/webkit/use-ai-chat-tools'
  import { useAiChatVersions } from '@aziontech/webkit/use-ai-chat-versions'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import {
    type AiChatConnection,
    type AiChatInterrupt,
    type AiChatInterruptError,
    type AiChatMessage,
    type AiChatQueuedMessage,
    type AiChatSendContent,
    type AiChatTool,
    type AiChatToolAnswer,
    type AiChatToolCallPart,
    type AiChatUiResourcePart,
    contentOf,
    hasAnswer,
    interruptErrorText,
    queueItemOf
  } from '@aziontech/webkit/utils/ai-chat'
  import { computed, ref, useSlots } from 'vue'

  import { useComposerFocus } from './composables/use-composer-focus'
  import { failureText, turnTime } from './lib/ai-chat-failure'
  import AiChatComposer from './parts/ai-chat-composer.vue'
  import AiChatConnectionStatus from './parts/ai-chat-connection-status.vue'
  import AiChatHeader, { type AiChatHeaderAction } from './parts/ai-chat-header.vue'
  import AiChatHistory from './parts/ai-chat-history.vue'
  import AiChatSkeleton from './parts/ai-chat-skeleton.vue'
  import AiChatSplit from './parts/ai-chat-split.vue'
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
    /** The models the composer picks from; left out, the sample models show. Read the chosen one from `v-model:modelKey`. */
    models?: PromptInputMenuOption[]
    /** The tools the composer turns on (web search, deep research); left out, the sample tools show. Read the turned-on ones from `v-model:toolKeys`. */
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
    retry: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    share: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    branch: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    edit: [event: MouseEvent | KeyboardEvent, message: AiChatMessage, text: string]
    'version-change': [messages: AiChatMessage[]]
    'new-chat': [event: MouseEvent]
    feedback: [
      value: ChatMessageFeedbackValue | null,
      message: AiChatMessage,
      reason?: FeedbackReasonDialogPayload
    ]
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
  /** The model chosen in the composer, one of `models`; pass it to `sendMessage` as `{ body: { model } }`. */
  const modelKey = defineModel<string>('modelKey', { default: 'gemini-4-neon' })
  /** The tools turned on in the composer, in `toolOptions` order; pass them to `sendMessage` as `{ body: { tools } }`. */
  const toolKeys = defineModel<string[]>('toolKeys', { default: () => [] })

  defineSlots<{
    /** Content after an assistant response, such as the card of a file it produced. */
    'turn-end'?(props: { turn: AiChatMessage }): unknown
    /** A resizable side pane beside the conversation, given as a Resizable handle and pane, such as an artifact canvas. */
    canvas?(): unknown
  }>()

  const slots = useSlots()
  const { formatDate } = useLocale()
  const versions = useAiChatVersions(() => props.messages)

  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])
  const composerEl = ref<InstanceType<typeof AiChatComposer> | null>(null)
  const stoppedIds = ref<Set<string>>(new Set())
  const answers = ref<Record<string, string>>({})
  const historyPanel = ref(true)
  const historyDrawer = ref(false)

  const turns = computed(() =>
    props.messages.filter((message) => message.role === 'user' || message.role === 'assistant')
  )
  const chatTools = useAiChatTools({
    turns: () => turns.value,
    interrupts: () => props.interrupts,
    tools: () => props.tools,
    onAnswerInterrupt: (event, interrupt, value) =>
      emit('answer-interrupt', event, interrupt, value),
    onAnswerTool: (event, answer) => emit('answer-tool', event, answer),
    onApprove: (event, call, input) => emit('approve', event, call, input),
    onDeny: (event, call) => emit('deny', event, call)
  })
  const starters = computed(() => props.suggestions ?? sampleSuggestions)
  const modelOptions = computed(() => props.models ?? sampleModels)
  const composerBindings = computed(() => ({
    state: state.value,
    queueable: queueable.value,
    hydrating: props.hydrating,
    accept: props.accept,
    maxFiles: props.maxFiles,
    maxFileSize: props.maxFileSize,
    attachable: props.attachable,
    voice: props.voice,
    models: modelOptions.value,
    tools: props.toolOptions ?? sampleTools
  }))
  const statusBindings = computed(() => ({
    connection: props.connection,
    resuming: props.resuming,
    sessionGenerating: props.sessionGenerating,
    loading: props.loading
  }))
  const welcome = computed(() => !turns.value.length && !props.hydrating)
  const last = computed(() => turns.value[turns.value.length - 1])
  const failure = computed(() => failureText(props.error))
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

  const timeOf = (turn: AiChatMessage) => turnTime(turn, formatDate)
  const { refocusAfterWelcome } = useComposerFocus(composerEl, () => props.loading, welcome)

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
    refocusAfterWelcome(typed)
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
    answers.value = {}
    chatTools.reset()
    versions.clear()
    activeKey.value = null
    emit('new-chat', event)
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
    <AiChatSplit :split="Boolean(slots.canvas)">
      <AiChatHeader
        :empty="!turns.length"
        :history-open="historyPanel"
        :conversation-key="activeKey"
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
        <AiChatConnectionStatus v-bind="statusBindings" />
        <AiChatComposer
          ref="composerEl"
          v-model="prompt"
          v-model:files="files"
          v-model:model-key="modelKey"
          v-model:tool-keys="toolKeys"
          v-bind="composerBindings"
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
          :questions="chatTools.questions.value[turn.id]"
          :ask-of="chatTools.askOf"
          :edit-of="chatTools.editOf"
          :resolve-app-url="resolveAppUrl"
          :versions="versions"
          @retry="emit('retry', $event, turn)"
          @rate="(value, reason) => emit('feedback', value, turn, reason)"
          @share="(event) => emit('share', event, turn)"
          @branch="(event) => emit('branch', event, turn)"
          @edit-prompt="(event, text) => emit('edit', event, turn, text)"
          @version-change="(next) => emit('version-change', next)"
          @answer-tool="chatTools.answerTool"
          @edit="chatTools.setEdit"
          @approve="chatTools.approve"
          @deny="chatTools.deny"
          @answer="chatTools.answer"
          @skip="chatTools.skip"
          @app-message="(message, part, reply) => emit('app-message', message, part, reply)"
        >
          <template
            v-if="slots['turn-end']"
            #end
          >
            <slot
              name="turn-end"
              :turn="turn"
            />
          </template>
        </AiChatTurn>
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
          <AiChatConnectionStatus v-bind="statusBindings" />
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
            v-model:model-key="modelKey"
            v-model:tool-keys="toolKeys"
            v-bind="composerBindings"
            @submit="(event, text) => send(event, text, true)"
            @stop="stop"
            @voice-start="emit('voice-start', $event)"
          />
        </template>
      </Conversation>
      <template
        v-if="slots.canvas"
        #canvas
      >
        <slot name="canvas" />
      </template>
    </AiChatSplit>
  </section>
</template>
