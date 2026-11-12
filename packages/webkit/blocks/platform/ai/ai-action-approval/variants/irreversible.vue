<script setup>
  import ActionConfirmation from '@aziontech/webkit/action-confirmation'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import PromptInput from '@aziontech/webkit/prompt-input'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import ToolCall from '@aziontech/webkit/tool-call'
  import { computed, onBeforeUnmount, ref } from 'vue'

  const command = 'azion delete domain --name old.example.com'
  const decision = ref('pending')
  const run = ref('')
  const prompt = ref('')
  let timer

  const followUp = computed(() => {
    if (decision.value === 'denied') return 'Got it, the domain stays as it is.'
    if (decision.value === 'expired') return 'This request expired. Nothing was deleted.'
    if (run.value === 'success')
      return 'old.example.com is deleted. Its DNS records were kept in the zone, so you can remove them separately.'
    return ''
  })
  const composerState = computed(() =>
    decision.value === 'approved' && run.value === 'running' ? 'streaming' : 'ready'
  )

  function approve() {
    decision.value = 'approved'
    run.value = 'running'
    timer = setTimeout(() => (run.value = 'success'), 2500)
  }

  function deny() {
    decision.value = 'denied'
    run.value = 'denied'
  }

  function stop() {
    clearTimeout(timer)
    run.value = 'error'
  }

  onBeforeUnmount(() => clearTimeout(timer))
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
        timestamp="15:02"
      >
        Delete the domain old.example.com, nobody uses it anymore
      </ChatMessage>
      <ChatMessage timestamp="15:02">
        <ToolCall
          name="get_domain_traffic"
          title="Reading the traffic of old.example.com"
          state="success"
        />
        <StreamingResponse
          content="old.example.com had no requests in the last 30 days. Deleting it needs your approval, and you need to type its name."
        />
        <ActionConfirmation
          title="Delete the domain `old.example.com`?"
          description="The domain stops answering at once and its certificate is revoked. This cannot be undone."
          approve-label="Delete"
          kind="danger"
          confirmation-phrase="old.example.com"
          :state="decision"
          @approve="approve"
          @deny="deny"
        >
          <CodeBlock
            :tabs="[{ label: 'Shell', value: 'command', code: command, language: 'bash' }]"
            :show-line-numbers="false"
          />
        </ActionConfirmation>
        <ToolCall
          v-if="run"
          name="delete_domain"
          title="Deleting old.example.com"
          :state="run"
        />
      </ChatMessage>
      <ChatMessage
        v-if="followUp"
        timestamp="15:04"
      >
        <StreamingResponse :content="followUp" />
        <template #actions>
          <ChatMessage.Actions>
            <CopyButton :value="followUp" />
          </ChatMessage.Actions>
        </template>
      </ChatMessage>
    </Conversation>
    <footer class="layout-column-content layout-boundary-inline pb-(--spacing-md)">
      <PromptInput
        v-model="prompt"
        :state="composerState"
        @stop="stop"
      >
        <template #hint>
          The assistant runs nothing in your account without your approval.
        </template>
      </PromptInput>
    </footer>
  </section>
</template>
