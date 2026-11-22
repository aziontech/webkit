<script setup lang="ts">
  import AgentActivity from '@aziontech/webkit/agent-activity'
  import AgentQuestion from '@aziontech/webkit/agent-question'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageStatus
  } from '@aziontech/webkit/chat-message'
  import CopyButton from '@aziontech/webkit/copy-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import McpAppFrame, {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/webkit/mcp-app-frame'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
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
  } from '@aziontech/webkit/utils/ai-chat'

  import AiChatMediaSegment from './ai-chat.ai-chat-media-segment.vue'
  import AiChatToolSegment from './ai-chat.ai-chat-tool-segment.vue'

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
    rating: ChatMessageFeedbackValue | null
    questions?: AiChatQuestion[]
    askOf: (call: AiChatToolCallPart) => AiChatQuestion
    editOf: (call: AiChatToolCallPart) => string
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
  }>()

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    rate: [value: ChatMessageFeedbackValue | null]
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
        :anchor="`answer-${turn.id}`"
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
    </template>
    <template
      v-if="turn.role === 'assistant'"
      #actions
    >
      <ChatMessage.Actions
        show-read-aloud
        :read-aloud-text="textOf(turn)"
      >
        <CopyButton
          size="large"
          :value="textOf(turn)"
        />
        <ChatMessage.Feedback
          :model-value="rating"
          @update:model-value="(value) => emit('rate', value)"
        />
        <IconButton
          icon="az az-refresh"
          aria-label="Regenerate response"
          variant="ghost"
          size="large"
          :disabled="!ready"
          @click="emit('retry', $event)"
        />
        <template
          v-if="!stopped && turn.metadata?.sources?.length"
          #trailing
        >
          <Sources
            :items="turn.metadata.sources"
            :anchor="`answer-${turn.id}`"
          />
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
</template>
