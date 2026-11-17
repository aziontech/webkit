<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import ToolApproval, {
    type ToolApprovalStatus,
    type ToolApprovalVariant
  } from '@aziontech/webkit/tool-approval'
  import ToolCall, { type ToolCallStatus } from '@aziontech/webkit/tool-call'
  import { computed, ref } from 'vue'

  import { sampleAction } from './sample'

  /** A tool call the assistant makes, as the conversation records it. */
  export interface AiActionApprovalCall {
    /** The tool name, shown in code. */
    name: string
    /** What the call does, in plain words. */
    title: string
  }

  /** The action the assistant proposes and the conversation that led to it. */
  export interface AiActionApprovalAction {
    /** The reader's request, in their words. */
    request: string
    /** When the reader asked and the assistant answered, already formatted. */
    time: string
    /** The read-only call the assistant made before asking. */
    check: AiActionApprovalCall
    /** What the assistant found and why it needs approval, in Markdown. */
    explanation: string
    /** The question on the card, naming the action with the command in code. */
    title: string
    /** What changes and what stays. */
    description: string
    /** The approve button label, the verb of the title. */
    approveLabel: string
    /** The exact command that runs once approved. */
    command: string
    /** Danger for an irreversible action. */
    variant?: ToolApprovalVariant
    /** The phrase the reader types before an irreversible action enables. */
    confirmationPhrase?: string
    /** The call that runs once approved. */
    run: AiActionApprovalCall
  }

  /** The assistant's report once the action was decided or ran. */
  export interface AiActionApprovalOutcome {
    /** What changed, or that nothing ran, in Markdown. */
    content: string
    /** When the assistant reported, already formatted. */
    time: string
  }

  export interface AiActionApprovalProps {
    /** The proposed action. Left out, the sample deployment renders. */
    action?: AiActionApprovalAction
    /** Where the approved call stands (running, success, error); empty before it starts. */
    run?: ToolCallStatus | ''
    /** The assistant's report after the decision; a failed run shows Retry beside Copy. */
    outcome?: AiActionApprovalOutcome
  }

  const props = withDefaults(defineProps<AiActionApprovalProps>(), {
    action: undefined,
    run: '',
    outcome: undefined
  })

  const emit = defineEmits<{
    approve: [event: MouseEvent, action: AiActionApprovalAction]
    deny: [event: MouseEvent, action: AiActionApprovalAction]
    stop: [event: MouseEvent, action: AiActionApprovalAction]
    retry: [event: MouseEvent, action: AiActionApprovalAction]
    send: [event: MouseEvent | KeyboardEvent, text: string]
  }>()

  /** The decision on the card; Deny or the approve button sets it and emits. */
  const decision = defineModel<ToolApprovalStatus>('decision', { default: 'pending' })

  const prompt = ref('')

  const current = computed(() => props.action ?? sampleAction)
  const runStatus = computed<ToolCallStatus | ''>(
    () => props.run || (decision.value === 'denied' ? 'denied' : '')
  )
  const followUp = computed(() => props.outcome?.content ?? '')
  const composerState = computed(() =>
    decision.value === 'approved' && runStatus.value === 'running' ? 'streaming' : 'ready'
  )

  function approve(event: MouseEvent) {
    decision.value = 'approved'
    emit('approve', event, current.value)
  }

  function deny(event: MouseEvent) {
    decision.value = 'denied'
    emit('deny', event, current.value)
  }

  function send(event: MouseEvent | KeyboardEvent, value: string) {
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
        from="user"
        :timestamp="current.time"
      >
        {{ current.request }}
      </ChatMessage>
      <ChatMessage :timestamp="current.time">
        <ToolCall
          :name="current.check.name"
          :title="current.check.title"
          status="success"
        />
        <StreamingResponse :content="current.explanation" />
        <ToolApproval
          :title="current.title"
          :description="current.description"
          :approve-label="current.approveLabel"
          :variant="current.variant"
          :confirmation-phrase="current.confirmationPhrase"
          :status="decision"
          @approve="approve"
          @deny="deny"
        >
          <CodeBlock
            :tabs="[{ label: 'Shell', value: 'command', code: current.command, language: 'bash' }]"
            :show-line-numbers="false"
          />
        </ToolApproval>
        <ToolCall
          v-if="runStatus"
          :name="current.run.name"
          :title="current.run.title"
          :status="runStatus"
        />
      </ChatMessage>
      <ChatMessage
        v-if="followUp"
        :timestamp="outcome?.time"
      >
        <StreamingResponse :content="followUp" />
        <template #actions>
          <ChatMessage.Actions>
            <CopyButton
              size="small"
              :value="followUp"
            />
            <Button
              v-if="runStatus === 'error'"
              label="Retry"
              variant="outline"
              size="small"
              icon="az az-refresh"
              @click="emit('retry', $event, current)"
            />
          </ChatMessage.Actions>
        </template>
      </ChatMessage>
    </Conversation>
    <footer class="layout-column-content layout-boundary-inline pb-(--spacing-md)">
      <PromptInput
        v-model="prompt"
        :status="composerState"
        @submit="(event, { value }) => send(event, value)"
        @stop="emit('stop', $event, current)"
      >
        <template #hint>
          The assistant runs nothing in your account without your approval.
        </template>
      </PromptInput>
    </footer>
  </section>
</template>
