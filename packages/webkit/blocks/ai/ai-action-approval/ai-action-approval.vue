<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ChatMessage, { type ChatMessageStatus } from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import type { PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import ToolCall from '@aziontech/webkit/tool-call'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import {
    type AiActionApprovalInterrupt,
    type AiActionApprovalMessage,
    type AiActionApprovalTool,
    type AiActionApprovalToolCallPart,
    approvalOf,
    hasText,
    isToolCallPart,
    isToolResultPart,
    json,
    needsApproval,
    resolveInterrupt,
    segmentsOf,
    textOf,
    toolStatusOf
  } from './messages'
  import { sampleMessages, sampleTools } from './sample'

  export type {
    AiActionApprovalInterrupt,
    AiActionApprovalMessage,
    AiActionApprovalMessageMetadata,
    AiActionApprovalOtherPart,
    AiActionApprovalPart,
    AiActionApprovalRole,
    AiActionApprovalTextPart,
    AiActionApprovalThinkingPart,
    AiActionApprovalTool,
    AiActionApprovalToolCallPart,
    AiActionApprovalToolCallState,
    AiActionApprovalToolResultPart
  } from './messages'

  export interface AiActionApprovalProps {
    /** The conversation, oldest first, as TanStack AI's `useChat` returns `messages`. Left out, the sample deployment renders. */
    messages?: ReadonlyArray<AiActionApprovalMessage>
    /** The assistant is responding or an approved call runs, as `useChat` returns `isLoading`. */
    loading?: boolean
    /** Why the last response failed: a sentence, or the `error` of `useChat`, which shows the standard sentence. */
    error?: string | { message: string } | null
    /** How each tool reads, by tool name: the call's title, the approval question, its verb and whether it is irreversible. */
    tools?: Record<string, AiActionApprovalTool>
    /** Pending requests, as `useChat` returns `interrupts`; the approve button and Deny resolve the matching one. */
    interrupts?: ReadonlyArray<AiActionApprovalInterrupt>
  }

  const props = withDefaults(defineProps<AiActionApprovalProps>(), {
    messages: undefined,
    loading: false,
    error: '',
    tools: undefined,
    interrupts: () => []
  })

  const emit = defineEmits<{
    approve: [event: MouseEvent, call: AiActionApprovalToolCallPart]
    deny: [event: MouseEvent, call: AiActionApprovalToolCallPart]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiActionApprovalMessage]
    send: [event: MouseEvent | KeyboardEvent, text: string]
  }>()

  const { formatDate } = useLocale()

  const prompt = ref('')

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

  function statusOf(turn: AiActionApprovalMessage): ChatMessageStatus {
    if (turn.role === 'user' || turn !== last.value) return 'success'
    if (failure.value) return 'error'
    if (props.loading && !runs(turn)) return hasText(turn) ? 'streaming' : 'pending'
    return 'success'
  }

  function runs(turn: AiActionApprovalMessage): boolean {
    return turn.parts.some(
      (part) =>
        isToolCallPart(part) &&
        toolStatusOf(part) === 'running' &&
        (!needsApproval(part) || approvalOf(part) === 'approved')
    )
  }

  function failed(turn: AiActionApprovalMessage): boolean {
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
    return last.value?.role === 'assistant' && (hasText(last.value) || runs(last.value))
      ? 'streaming'
      : 'pending'
  })

  function timeOf(turn: AiActionApprovalMessage): string {
    return turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''
  }

  function toolOf(call: AiActionApprovalToolCallPart): AiActionApprovalTool {
    return toolLabels.value[call.name] ?? { title: '' }
  }

  function decide(event: MouseEvent, call: AiActionApprovalToolCallPart, approved: boolean) {
    if (approved) emit('approve', event, call)
    else emit('deny', event, call)
    resolveInterrupt(props.interrupts, call, approved)
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
          </template>
        </template>
        <template
          v-if="turn.role === 'assistant' && hasText(turn) && statusOf(turn) === 'success'"
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
    </Conversation>
    <footer class="layout-column-content layout-boundary-inline pb-(--spacing-md)">
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
