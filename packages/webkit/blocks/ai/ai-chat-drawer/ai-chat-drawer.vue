<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageStatus
  } from '@aziontech/webkit/chat-message'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PromptInput, { type PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources, { type SourcesItem } from '@aziontech/webkit/sources'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref, watch } from 'vue'

  import { sampleSuggestions } from './sample'

  /** Who wrote a message. */
  export type AiChatDrawerAuthor = 'user' | 'assistant'

  /** One message of the conversation. */
  export interface AiChatDrawerMessage {
    /** Stable key. */
    id: string
    /** The reader or the assistant. */
    from: AiChatDrawerAuthor
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
  export interface AiChatDrawerFeedback {
    /** The rated answer. */
    message: AiChatDrawerMessage
    /** Helpful, not helpful, or cleared. */
    value: ChatMessageFeedbackValue | null
  }

  export interface AiChatDrawerProps {
    /** The conversation, oldest first. Left out or empty, the empty state with the suggestions renders. */
    messages?: AiChatDrawerMessage[]
    /** Starter prompts under the empty state. Left out, the sample prompts render. */
    suggestions?: SuggestionGroupItem[]
    /** Follow-up questions shown under the last finished answer. */
    followUps?: SuggestionGroupItem[]
    /** The assistant is answering: the last assistant message thinks while empty, then streams. */
    loading?: boolean
    /** Why the last answer failed, shown on it with Try again. */
    error?: string
  }

  const props = withDefaults(defineProps<AiChatDrawerProps>(), {
    messages: undefined,
    suggestions: undefined,
    followUps: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, text: string]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiChatDrawerMessage]
    'new-chat': [event: MouseEvent]
    feedback: [feedback: AiChatDrawerFeedback]
  }>()

  /** Whether the assistant drawer is open; Agent opens it and its close button closes it. */
  const open = defineModel<boolean>('open', { default: true })

  const prompt = ref('')
  const composerEl = ref<InstanceType<typeof PromptInput> | null>(null)
  const ratings = ref<Record<string, ChatMessageFeedbackValue | null>>({})

  const turns = computed(() => props.messages ?? [])
  const starters = computed(() => props.suggestions ?? sampleSuggestions)
  const last = computed(() => turns.value[turns.value.length - 1])

  function statusOf(turn: AiChatDrawerMessage): ChatMessageStatus {
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

  function rate(message: AiChatDrawerMessage, value: ChatMessageFeedbackValue | null) {
    ratings.value[message.id] = value
    emit('feedback', { message, value })
  }
</script>

<template>
  <div class="w-full">
    <div class="layout-column layout-boundary flex min-w-0 flex-col">
      <div class="layout-section-start flex flex-col gap-(--layout-section-gap)">
        <PageHeader
          title="storefront"
          description="Workload · Production"
        >
          <template #actions>
            <Button
              label="Agent"
              variant="outline"
              size="medium"
              icon="ai ai-ask-azion"
              :aria-expanded="open ? 'true' : 'false'"
              @click="open = true"
            />
          </template>
        </PageHeader>
        <Card>
          <template #default>
            <div class="p-(--spacing-md)">
              <KeyValueList
                :columns="3"
                aria-label="Workload details"
              >
                <KeyValueList.Item label="Status">
                  <StatusIndicator
                    severity="danger"
                    label="Errors above 30%"
                  />
                </KeyValueList.Item>
                <KeyValueList.Item label="Domains"
                  >www.example.com, shop.example.com</KeyValueList.Item
                >
                <KeyValueList.Item label="Origin">api.example.com</KeyValueList.Item>
                <KeyValueList.Item label="Cache hit ratio">91%</KeyValueList.Item>
                <KeyValueList.Item label="Last deployment">Today, 13:58</KeyValueList.Item>
                <KeyValueList.Item label="Region">US East (Washington)</KeyValueList.Item>
              </KeyValueList>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Drawer
      v-model:open="open"
      side="end"
      size="medium"
      :modal="false"
    >
      <DrawerContent>
        <div class="flex min-h-0 flex-1 flex-col">
          <PanelHeader class="w-full">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <DrawerTitle>AI assistant</DrawerTitle>
              <Tag
                label="Preview"
                severity="info"
                size="small"
              />
            </div>
            <div class="flex items-center gap-(--spacing-2xs)">
              <IconButton
                icon="ai ai-plus"
                aria-label="New chat"
                variant="ghost"
                size="small"
                :disabled="!turns.length"
                @click="newChat"
              />
            </div>
          </PanelHeader>
          <div class="flex min-h-0 flex-1 flex-col">
            <div
              v-if="!turns.length"
              class="flex flex-1 flex-col justify-center gap-(--spacing-lg) p-(--spacing-md)"
            >
              <EmptyState
                title="Ask about storefront"
                description="The assistant reads this workload’s settings and metrics to answer. It cites the documentation it uses."
                icon="ai ai-ask-azion"
                size="small"
              />
              <SuggestionGroup
                :items="starters"
                orientation="vertical"
                @select="(event, item) => send(event, item.label)"
              />
            </div>
            <Conversation
              v-else
              layout="start"
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
                      icon="ai ai-refresh"
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
          <div class="border-t border-(--border-default) p-(--spacing-sm)">
            <PromptInput
              ref="composerEl"
              v-model="prompt"
              :status="state"
              :max-rows="4"
              placeholder="Ask about storefront"
              @submit="(event, { value }) => send(event, value)"
              @stop="emit('stop', $event)"
            >
              <template #hint
                >The AI assistant can make mistakes. Check important information.</template
              >
            </PromptInput>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
