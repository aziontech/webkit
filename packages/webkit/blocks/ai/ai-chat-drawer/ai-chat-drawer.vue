<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { ChatMessageFeedbackValue, ChatMessageStatus } from '@aziontech/webkit/chat-message'
  import ChatMessage from '@aziontech/webkit/chat-message-root'
  import Conversation from '@aziontech/webkit/conversation'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
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
  import { computed, nextTick, ref, watch } from 'vue'

  import AiChatConnectionStatus from './parts/ai-chat-connection-status.vue'
  import AiChatTurn from './parts/ai-chat-turn.vue'
  import DrawerChatComposer from './parts/drawer-chat-composer.vue'
  import DrawerChatHeader from './parts/drawer-chat-header.vue'
  import DrawerChatStart from './parts/drawer-chat-start.vue'
  import WorkloadOverview from './parts/workload-overview.vue'
  import { sampleSuggestions, sampleTools } from './sample'

  export interface AiChatDrawerProps {
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
    /** The files the reader may attach, in the native accept syntax. */
    accept?: string
    /** Most files attached to one message. */
    maxFiles?: number
    /** Largest file in bytes. */
    maxFileSize?: number
    /** Turns a widget's resource into a trusted https address when it has no inline HTML; left out, only inline widgets show. */
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
    /** The tools the composer's "+" menu turns on (web search, deep research); left out, the sample tools show. Read the turned-on ones from `v-model:toolKeys`. */
    toolOptions?: PromptInputMenuOption[]
  }

  const props = withDefaults(defineProps<AiChatDrawerProps>(), {
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
    accept: 'image/*,application/pdf',
    maxFiles: 4,
    maxFileSize: 10485760,
    resolveAppUrl: undefined,
    toolOptions: undefined
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, content: AiChatSendContent]
    stop: [event: MouseEvent]
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

  /** Whether the assistant drawer is open; Agent opens it and its close button closes it. */
  const open = defineModel<boolean>('open', { default: true })
  /** The tools turned on in the composer's "+" menu, in `toolOptions` order; pass them to `sendMessage` as `{ body: { tools } }`. */
  const toolKeys = defineModel<string[]>('toolKeys', { default: () => [] })

  const { formatDate } = useLocale()
  const versions = useAiChatVersions(() => props.messages)

  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])
  const composerEl = ref<InstanceType<typeof DrawerChatComposer> | null>(null)
  const stoppedIds = ref<Set<string>>(new Set())
  const answers = ref<Record<string, string>>({})

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
  const composerTools = computed(() => props.toolOptions ?? sampleTools)
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

  watch(
    () => props.loading,
    (now, before) => {
      if (before && !now) composerEl.value?.focus()
    }
  )

  watch(
    open,
    async (isOpen) => {
      if (!isOpen) return
      await nextTick()
      composerEl.value?.focus()
    },
    { flush: 'post' }
  )

  async function send(event: MouseEvent | KeyboardEvent, text: string) {
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
    emit('new-chat', event)
  }

  function removeQueued(event: MouseEvent, id: string) {
    const item = props.queue?.find((entry) => entry.id === id)
    if (item) emit('remove-queued', event, item)
  }
</script>

<template>
  <div
    :data-drawer-open="open || null"
    class="w-full lg:data-drawer-open:pe-[max(30vw,var(--container-md))]"
  >
    <WorkloadOverview
      :open="open"
      @open="open = true"
    />

    <Drawer
      v-model:open="open"
      side="end"
      size="medium"
      :modal="false"
    >
      <DrawerContent>
        <div class="flex min-h-0 flex-1 flex-col">
          <DrawerChatHeader
            :empty="!turns.length"
            @new-chat="newChat"
          />
          <div
            class="flex min-h-0 flex-1 flex-col [--conversation-composer-fade:var(--bg-surface)]"
          >
            <Conversation
              aria-label="Conversation with the AI assistant"
              :more-messages="moreMessages"
              :loading-more="loadingMore"
              @load-more="emit('load-more', $event)"
            >
              <DrawerChatStart
                v-if="!turns.length"
                :hydrating="hydrating"
                :starters="starters"
                @select="(event, item) => send(event, item.label)"
              />
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
                <DrawerChatComposer
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
                  :tools="composerTools"
                  @submit="send"
                  @stop="stop"
                />
              </template>
            </Conversation>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
