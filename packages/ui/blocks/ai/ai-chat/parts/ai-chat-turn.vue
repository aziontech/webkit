<script setup lang="ts">
  import AgentActivity from '@aziontech/ui/agent-activity'
  import AgentQuestion from '@aziontech/ui/agent-question'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageStatus
  } from '@aziontech/ui/chat-message'
  import FeedbackReasonDialog, {
    type FeedbackReasonDialogPayload
  } from '@aziontech/ui/feedback-reason-dialog'
  import McpAppFrame, {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/ui/mcp-app-frame'
  import Reasoning from '@aziontech/ui/reasoning'
  import ResponseBranches from '@aziontech/ui/response-branches'
  import Sources from '@aziontech/ui/sources'
  import StreamingResponse from '@aziontech/ui/streaming-response'
  import { toast } from '@aziontech/ui/toast'
  import type { UseAiChatVersionsReturn } from '@aziontech/ui/use-ai-chat-versions'
  import {
    activitiesBefore,
    type AiChatMessage,
    type AiChatQuestion,
    type AiChatSegment,
    type AiChatTool,
    type AiChatToolCallPart,
    type AiChatUiResourcePart,
    segmentsOf,
    textOf
  } from '@aziontech/ui/utils/ai-chat'
  import { computed, ref } from 'vue'

  import AiChatMediaSegment from './ai-chat-media-segment.vue'
  import AiChatToolSegment from './ai-chat-tool-segment.vue'

  const props = defineProps<{
    turn: AiChatMessage
    messages: ReadonlyArray<AiChatMessage>
    status: ChatMessageStatus
    time: string
    failure: string
    tools: Record<string, AiChatTool>
    busy: boolean
    ready: boolean
    stopped: boolean
    versions: UseAiChatVersionsReturn
    questions?: AiChatQuestion[]
    askOf: (call: AiChatToolCallPart) => AiChatQuestion
    editOf: (call: AiChatToolCallPart) => string
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
  }>()

  const emit = defineEmits<{
    retry: [event: MouseEvent | KeyboardEvent]
    rate: [value: ChatMessageFeedbackValue | null, reason?: FeedbackReasonDialogPayload]
    share: [event: MouseEvent]
    branch: [event: MouseEvent | KeyboardEvent]
    'edit-prompt': [event: MouseEvent | KeyboardEvent, text: string]
    'version-change': [messages: AiChatMessage[]]
    'answer-tool': [event: Event, call: AiChatToolCallPart, value: string]
    edit: [call: AiChatToolCallPart, text: string]
    approve: [event: MouseEvent, call: AiChatToolCallPart, text: string]
    deny: [event: MouseEvent, call: AiChatToolCallPart]
    answer: [event: Event, question: AiChatQuestion, value: string]
    skip: [question: AiChatQuestion]
    'app-message': [
      message: McpAppFrameMessage,
      part: AiChatUiResourcePart,
      reply: (message: McpAppFrameMessage) => void
    ]
  }>()

  const answers = defineModel<Record<string, string>>('answers', { required: true })

  defineSlots<{
    /** Content after an assistant response. */
    end?(): unknown
  }>()

  const reasonOpen = ref(false)
  const rating = ref<ChatMessageFeedbackValue | null>(null)
  const versionsOfTurn = computed(() => props.versions.versionsOf(props.turn))

  function regenerate(event: MouseEvent | KeyboardEvent) {
    props.versions.fork(props.turn)
    emit('retry', event)
  }

  function editPrompt(event: MouseEvent | KeyboardEvent, text: string) {
    props.versions.fork(props.turn)
    emit('edit-prompt', event, text)
  }

  function page(index: number) {
    const next = props.versions.select(props.turn, index)
    if (next) emit('version-change', next)
  }

  function rate(value: ChatMessageFeedbackValue | null) {
    rating.value = value
    emit('rate', value)
    if (value === 'up') toast('Thanks for your feedback')
    if (value === 'down') reasonOpen.value = true
  }

  function sendReason(reason: FeedbackReasonDialogPayload) {
    reasonOpen.value = false
    emit('rate', 'down', reason)
    toast('Thanks for your feedback')
  }

  const MEDIA_TYPES = new Set(['gallery', 'audio', 'video', 'document', 'subagent', 'structured'])
  const isMedia = (segment: AiChatSegment) => MEDIA_TYPES.has(segment.type)

  function toolOf(call: AiChatToolCallPart): AiChatTool {
    return props.tools[call.name] ?? { title: '' }
  }

  const appFrames = new Map<string, InstanceType<typeof McpAppFrame>>()

  function setAppFrame(key: string, el: unknown) {
    if (el) appFrames.set(key, el as InstanceType<typeof McpAppFrame>)
    else appFrames.delete(key)
  }

  function forwardAppMessage(key: string, part: AiChatUiResourcePart, message: McpAppFrameMessage) {
    emit('app-message', message, part, (reply) => appFrames.get(key)?.post(reply))
  }
</script>

<template>
  <ChatMessage
    :from="turn.role === 'user' ? 'user' : 'assistant'"
    :status="status"
    :timestamp="time"
    :error-message="status === 'error' ? failure : undefined"
    @retry="emit('retry', $event)"
    @edit="editPrompt"
  >
    <template v-if="turn.role === 'user'">{{ textOf(turn, '\n') }}</template>
    <template
      v-for="segment in segmentsOf(
        turn,
        turn.role === 'assistant' ? activitiesBefore(messages, turn) : []
      )"
      :key="segment.key"
    >
      <template v-if="turn.role === 'user' && segment.type === 'text'" />
      <AgentActivity
        v-else-if="segment.type === 'activity'"
        :steps="segment.steps"
      />
      <Reasoning
        v-else-if="segment.type === 'reasoning'"
        :streaming="status === 'pending'"
        :duration="status === 'pending' ? undefined : turn.metadata?.reasoningSeconds"
      >
        <p class="whitespace-pre-line">{{ segment.content }}</p>
      </Reasoning>
      <StreamingResponse
        v-else-if="segment.type === 'text'"
        :content="segment.content"
        :streaming="status === 'streaming'"
        :sources="turn.metadata?.sources ?? []"
      />
      <AiChatToolSegment
        v-else-if="segment.type === 'tool'"
        v-model:answer="answers[segment.call.id]"
        :call="segment.call"
        :result="segment.result"
        :tool="toolOf(segment.call)"
        :ask="askOf(segment.call)"
        :edit="editOf(segment.call)"
        :busy="busy"
        @answer="(event, value) => emit('answer-tool', event, segment.call, value)"
        @edit="(text) => emit('edit', segment.call, text)"
        @approve="(event, text) => emit('approve', event, segment.call, text)"
        @deny="(event) => emit('deny', event, segment.call)"
      />
      <AiChatMediaSegment
        v-else-if="isMedia(segment)"
        :segment="segment"
      />
      <McpAppFrame
        v-else-if="segment.type === 'app'"
        :ref="(el) => setAppFrame(segment.key, el)"
        :resource="segment.part.resource"
        :title="(tools[segment.part.toolName] ?? { title: '' }).title || segment.part.toolName"
        :resolve-url="resolveAppUrl"
        @message="(message) => forwardAppMessage(segment.key, segment.part, message)"
      />
    </template>
    <template v-if="turn.role === 'assistant'">
      <p
        v-if="stopped"
        class="text-body-sm text-(--text-muted)"
      >
        You stopped this response.
      </p>
      <slot name="end" />
    </template>
    <template
      v-if="turn.role === 'user'"
      #actions
    >
      <ChatMessage.Actions
        copyable
        editable
        :copy-text="textOf(turn, '\n')"
        :disabled="!ready"
      >
        <template
          v-if="versionsOfTurn"
          #leading
        >
          <ResponseBranches
            :model-value="versionsOfTurn.index"
            :count="versionsOfTurn.count"
            aria-label="Prompt versions"
            :disabled="!ready"
            @update:model-value="page"
          />
        </template>
      </ChatMessage.Actions>
    </template>
    <template
      v-else
      #actions
    >
      <ChatMessage.Actions
        copyable
        show-feedback
        show-read-aloud
        shareable
        retryable
        branchable
        :copy-text="textOf(turn)"
        :read-aloud-text="textOf(turn)"
        :feedback="rating"
        :disabled="!ready"
        @update:feedback="rate"
        @share="emit('share', $event)"
        @retry="regenerate"
        @branch="emit('branch', $event)"
      >
        <template
          v-if="versionsOfTurn"
          #leading
        >
          <ResponseBranches
            :model-value="versionsOfTurn.index"
            :count="versionsOfTurn.count"
            :disabled="!ready"
            @update:model-value="page"
          />
        </template>
        <template
          v-if="!stopped && turn.metadata?.sources?.length"
          #trailing
        >
          <Sources :items="turn.metadata.sources" />
        </template>
      </ChatMessage.Actions>
    </template>
  </ChatMessage>
  <ChatMessage
    v-if="questions?.length"
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
      @submit="(event, value) => emit('answer', event, question, value)"
      @skip="emit('skip', question)"
    />
  </ChatMessage>
  <FeedbackReasonDialog
    v-if="turn.role === 'assistant'"
    v-model:open="reasonOpen"
    @submit="(_event, reason) => sendReason(reason)"
  />
</template>
