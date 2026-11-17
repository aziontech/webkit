<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageStatus
  } from '@aziontech/webkit/chat-message'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PromptInput, { type PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources, { type SourcesItem } from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref, watch } from 'vue'

  import { sampleSuggestions } from './ai-chat.sample'

  /** Who wrote a message. */
  export type AiChatAuthor = 'user' | 'assistant'

  /** One message of the conversation. */
  export interface AiChatMessage {
    /** Stable key. */
    id: string
    /** The reader or the assistant. */
    from: AiChatAuthor
    /** Plain text for the reader; Markdown for the assistant, as much as has arrived. */
    content: string
    /** When it was written, already formatted. */
    time: string
    /** How the assistant reached the answer, in the collapsible Reasoning. */
    reasoning?: string
    /** How long the assistant thought, in seconds, shown once it answers. */
    reasoningSeconds?: number
    /** The documents the answer cites, numbered in order. */
    sources?: SourcesItem[]
    /** The reader stopped this response; what was written stays. */
    stopped?: boolean
  }

  /** A rating the reader gave an answer. */
  export interface AiChatFeedback {
    /** The rated answer. */
    message: AiChatMessage
    /** Helpful, not helpful, or cleared. */
    value: ChatMessageFeedbackValue | null
  }

  export interface AiChatProps {
    /** The conversation, oldest first. Left out or empty, the empty state with the suggestions renders. */
    messages?: AiChatMessage[]
    /** Starter prompts under the empty state. Left out, the sample prompts render. */
    suggestions?: SuggestionGroupItem[]
    /** Follow-up questions shown under the last finished answer. */
    followUps?: SuggestionGroupItem[]
    /** The assistant is answering: the last assistant message thinks while empty, then streams. */
    loading?: boolean
    /** Why the last answer failed, shown on it with Try again. */
    error?: string
  }

  const props = withDefaults(defineProps<AiChatProps>(), {
    messages: undefined,
    suggestions: undefined,
    followUps: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, text: string]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiChatMessage]
    'new-chat': [event: MouseEvent]
    feedback: [feedback: AiChatFeedback]
  }>()

  const prompt = ref('')
  const composerEl = ref<InstanceType<typeof PromptInput> | null>(null)
  const ratings = ref<Record<string, ChatMessageFeedbackValue | null>>({})

  const turns = computed(() => props.messages ?? [])
  const starters = computed(() => props.suggestions ?? sampleSuggestions)
  const last = computed(() => turns.value[turns.value.length - 1])

  function statusOf(turn: AiChatMessage): ChatMessageStatus {
    if (turn.from === 'user' || turn !== last.value) return 'success'
    if (props.error) return 'error'
    if (props.loading) return turn.content ? 'streaming' : 'pending'
    return 'success'
  }

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.from === 'assistant' && !last.value.content ? 'pending' : 'streaming'
  })

  const lastAnswer = computed(() => {
    const turn = last.value
    return turn?.from === 'assistant' && statusOf(turn) === 'success' && !turn.stopped ? turn : null
  })

  watch(
    () => props.loading,
    (now, before) => {
      if (before && !now) composerEl.value?.focus()
    }
  )

  function send(event: MouseEvent | KeyboardEvent, text: string) {
    if (!text.trim() || state.value !== 'ready') return
    prompt.value = ''
    emit('send', event, text)
  }

  function newChat(event: MouseEvent) {
    prompt.value = ''
    emit('new-chat', event)
  }

  function rate(message: AiChatMessage, value: ChatMessageFeedbackValue | null) {
    ratings.value[message.id] = value
    emit('feedback', { message, value })
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
      >
        <ChatMessage
          v-for="turn in turns"
          :key="turn.id"
          :from="turn.from"
          :status="statusOf(turn)"
          :timestamp="turn.time"
          :error-message="statusOf(turn) === 'error' ? error : undefined"
          @retry="emit('retry', $event, turn)"
        >
          <template v-if="turn.from === 'user'">{{ turn.content }}</template>
          <template v-else>
            <Reasoning
              v-if="turn.reasoning"
              :streaming="statusOf(turn) === 'pending'"
              :duration="statusOf(turn) === 'pending' ? undefined : turn.reasoningSeconds"
            >
              <p>{{ turn.reasoning }}</p>
            </Reasoning>
            <StreamingResponse
              :content="turn.content"
              :streaming="statusOf(turn) === 'streaming'"
              :sources="turn.sources ?? []"
              :anchor="`answer-${turn.id}`"
            />
            <p
              v-if="turn.stopped"
              class="text-body-sm text-(--text-muted)"
            >
              You stopped this response.
            </p>
            <Sources
              v-if="statusOf(turn) === 'success' && !turn.stopped"
              :items="turn.sources ?? []"
              :anchor="`answer-${turn.id}`"
            />
          </template>
          <template
            v-if="turn.from === 'assistant'"
            #actions
          >
            <ChatMessage.Actions>
              <CopyButton
                size="small"
                :value="turn.content"
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
    <footer class="layout-column-content layout-boundary-inline pb-(--spacing-md)">
      <PromptInput
        ref="composerEl"
        v-model="prompt"
        :status="state"
        :max-length="4000"
        @submit="(event, { value }) => send(event, value)"
        @stop="emit('stop', $event)"
      >
        <template #hint>
          The AI assistant can make mistakes. Check important information before you act on it.
        </template>
      </PromptInput>
    </footer>
  </section>
</template>
