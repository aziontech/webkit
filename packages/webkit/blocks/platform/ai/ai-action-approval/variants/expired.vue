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

  const command = 'azion deploy --workload storefront --build b-4821 --env production'
  const decision = ref('expired')
  const run = ref('')
  const prompt = ref('')
  let timer

  const followUp = computed(() => {
    if (decision.value === 'denied')
      return 'Got it, nothing was deployed. Build `b-4821` stays ready if you change your mind.'
    if (decision.value === 'expired') return 'This request expired. Nothing was deployed.'
    if (run.value === 'success')
      return 'storefront is live on production with build `b-4821`. The previous version `b-4790` stays available for rollback.'
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
    class="flex h-dvh w-full flex-col bg-(--bg-canvas)"
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
        Deploy the current build of storefront to production
      </ChatMessage>
      <ChatMessage timestamp="15:02">
        <ToolCall
          name="get_build"
          title="Reading the latest build of storefront"
          state="success"
        />
        <StreamingResponse
          content="Build `b-4821` passed its checks 6 minutes ago. Deploying it needs your approval."
        />
        <ActionConfirmation
          title="Allow `azion deploy --env production`?"
          description="Deploys build `b-4821` of storefront to production. The current version stays available for rollback."
          approve-label="Deploy"
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
          name="deploy_workload"
          title="Deploying storefront to production"
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
