<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageStatus
  } from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
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
  import type { PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources from '@aziontech/webkit/sources'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import ToolCall from '@aziontech/webkit/tool-call'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref, watch } from 'vue'

  import {
    type AiChatDrawerInterrupt,
    type AiChatDrawerMessage,
    type AiChatDrawerTool,
    type AiChatDrawerToolCallPart,
    approvalOf,
    hasText,
    json,
    needsApproval,
    resolveInterrupt,
    segmentsOf,
    textOf,
    toolStatusOf
  } from './messages'
  import { sampleSuggestions } from './sample'

  export type {
    AiChatDrawerInterrupt,
    AiChatDrawerMessage,
    AiChatDrawerMessageMetadata,
    AiChatDrawerOtherPart,
    AiChatDrawerPart,
    AiChatDrawerRole,
    AiChatDrawerTextPart,
    AiChatDrawerThinkingPart,
    AiChatDrawerTool,
    AiChatDrawerToolCallPart,
    AiChatDrawerToolCallState,
    AiChatDrawerToolResultPart
  } from './messages'

  /** A rating the reader gave a response. */
  export interface AiChatDrawerFeedback {
    /** The rated response. */
    message: AiChatDrawerMessage
    /** Helpful, not helpful, or cleared. */
    value: ChatMessageFeedbackValue | null
  }

  export interface AiChatDrawerProps {
    /** The conversation, oldest first, as TanStack AI's `useChat` returns `messages`. Empty, the empty state renders. */
    messages?: ReadonlyArray<AiChatDrawerMessage>
    /** Starter prompts under the empty state. Left out, the sample prompts render. */
    suggestions?: SuggestionGroupItem[]
    /** Follow-up questions shown under the last finished response. */
    followUps?: SuggestionGroupItem[]
    /** The assistant is responding, as `useChat` returns `isLoading`. */
    loading?: boolean
    /** Why the last response failed: a sentence, or the `error` of `useChat`, which shows the standard sentence. */
    error?: string | { message: string } | null
    /** How each tool reads, by tool name; a tool left out shows its name. */
    tools?: Record<string, AiChatDrawerTool>
    /** Pending requests, as `useChat` returns `interrupts`; Approve and Deny resolve the matching one. */
    interrupts?: ReadonlyArray<AiChatDrawerInterrupt>
  }

  const props = withDefaults(defineProps<AiChatDrawerProps>(), {
    messages: () => [],
    suggestions: undefined,
    followUps: undefined,
    loading: false,
    error: '',
    tools: () => ({}),
    interrupts: () => []
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, text: string]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiChatDrawerMessage]
    'new-chat': [event: MouseEvent]
    feedback: [feedback: AiChatDrawerFeedback]
    approve: [event: MouseEvent, call: AiChatDrawerToolCallPart]
    deny: [event: MouseEvent, call: AiChatDrawerToolCallPart]
  }>()

  /** Whether the assistant drawer is open; Agent opens it and its close button closes it. */
  const open = defineModel<boolean>('open', { default: true })

  const { formatDate } = useLocale()

  const prompt = ref('')
  const composerEl = ref<InstanceType<typeof PromptInput> | null>(null)
  const ratings = ref<Record<string, ChatMessageFeedbackValue | null>>({})
  const stoppedIds = ref<Set<string>>(new Set())

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

  function statusOf(turn: AiChatDrawerMessage): ChatMessageStatus {
    if (turn.role === 'user' || turn !== last.value) return 'success'
    if (failure.value) return 'error'
    if (props.loading) return hasText(turn) ? 'streaming' : 'pending'
    return 'success'
  }

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.role === 'assistant' && hasText(last.value) ? 'streaming' : 'pending'
  })

  function stopped(turn: AiChatDrawerMessage): boolean {
    return Boolean(turn.metadata?.stopped) || stoppedIds.value.has(turn.id)
  }

  const lastAnswer = computed(() => {
    const turn = last.value
    return turn?.role === 'assistant' && statusOf(turn) === 'success' && !stopped(turn)
      ? turn
      : null
  })

  function timeOf(turn: AiChatDrawerMessage): string {
    return turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''
  }

  function toolOf(call: AiChatDrawerToolCallPart): AiChatDrawerTool {
    return props.tools[call.name] ?? { title: '' }
  }

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

  function stop(event: MouseEvent) {
    if (props.loading && last.value?.role === 'assistant') stoppedIds.value.add(last.value.id)
    emit('stop', event)
  }

  function newChat(event: MouseEvent) {
    prompt.value = ''
    stoppedIds.value.clear()
    emit('new-chat', event)
  }

  function rate(message: AiChatDrawerMessage, value: ChatMessageFeedbackValue | null) {
    ratings.value[message.id] = value
    emit('feedback', { message, value })
  }

  function decide(event: MouseEvent, call: AiChatDrawerToolCallPart, approved: boolean) {
    if (approved) emit('approve', event, call)
    else emit('deny', event, call)
    resolveInterrupt(props.interrupts, call, approved)
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
              icon="az az-ask-azion"
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
                icon="az az-plus"
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
                icon="az az-ask-azion"
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
                    <Reasoning
                      v-if="segment.type === 'reasoning'"
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
                        @approve="decide($event, segment.call, true)"
                        @deny="decide($event, segment.call, false)"
                      >
                        <CodeBlock
                          v-if="json(segment.call.input ?? segment.call.arguments)"
                          :code="json(segment.call.input ?? segment.call.arguments)"
                          language="json"
                          :show-line-numbers="false"
                        />
                      </ToolApproval>
                      <ToolCall
                        v-if="
                          !needsApproval(segment.call) || approvalOf(segment.call) === 'approved'
                        "
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
                              segment.result?.error ||
                                segment.call.output ||
                                segment.result?.content
                            )
                          "
                          #output
                        >
                          <CodeBlock
                            :code="
                              json(
                                segment.result?.error ||
                                  segment.call.output ||
                                  segment.result?.content
                              )
                            "
                            language="json"
                            :show-line-numbers="false"
                          />
                        </template>
                      </ToolCall>
                    </template>
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
          <div class="border-t border-(--border-default) p-(--spacing-sm)">
            <PromptInput
              ref="composerEl"
              v-model="prompt"
              :status="state"
              :max-rows="4"
              placeholder="Ask about storefront"
              @submit="(event, { value }) => send(event, value)"
              @stop="stop"
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
