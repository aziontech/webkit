<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import PromptInput from '@aziontech/webkit/prompt-input'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import ToolApproval, { type ToolApprovalStatus } from '@aziontech/webkit/tool-approval'
  import ToolCall, { type ToolCallStatus } from '@aziontech/webkit/tool-call'
  import { computed, onBeforeUnmount, ref } from 'vue'

  const command = 'azion deploy --workload storefront --build b-4821 --env production'
  const decision = ref<ToolApprovalStatus>('approved')
  const run = ref<ToolCallStatus | ''>('error')
  const stopped = ref(false)
  const prompt = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  const followUp = computed(() => {
    if (decision.value === 'denied')
      return 'Got it, nothing was deployed. Build `b-4821` stays ready if you change your mind.'
    if (decision.value === 'expired') return 'This request expired. Nothing was deployed.'
    if (run.value === 'error' && stopped.value)
      return 'You stopped the deployment before it finished. Production still serves the previous version `b-4790`.'
    if (run.value === 'error')
      return 'The deployment of build `b-4821` failed while uploading the build to the edge. Nothing changed: production still serves the previous version `b-4790`.'
    if (run.value === 'success')
      return 'storefront is live on production with build `b-4821`. The previous version `b-4790` stays available for rollback.'
    return ''
  })
  const composerState = computed(() =>
    decision.value === 'approved' && run.value === 'running' ? 'streaming' : 'ready'
  )

  function approve() {
    decision.value = 'approved'
    stopped.value = false
    run.value = 'running'
    timer = setTimeout(() => (run.value = 'success'), 2500)
  }

  function deny() {
    decision.value = 'denied'
    run.value = 'denied'
  }

  function stop() {
    clearTimeout(timer)
    stopped.value = true
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
        Deploy the current build of storefront to production
      </ChatMessage>
      <ChatMessage timestamp="15:02">
        <ToolCall
          name="get_build"
          title="Reading the latest build of storefront"
          status="success"
        />
        <StreamingResponse
          content="Build `b-4821` passed its checks 6 minutes ago. Deploying it needs your approval."
        />
        <ToolApproval
          title="Allow `azion deploy --env production`?"
          description="Deploys build `b-4821` of storefront to production. The current version stays available for rollback."
          approve-label="Deploy"
          :status="decision"
          @approve="approve"
          @deny="deny"
        >
          <CodeBlock
            :tabs="[{ label: 'Shell', value: 'command', code: command, language: 'bash' }]"
            :show-line-numbers="false"
          />
        </ToolApproval>
        <ToolCall
          v-if="run"
          name="deploy_workload"
          title="Deploying storefront to production"
          :status="run"
        />
      </ChatMessage>
      <ChatMessage
        v-if="followUp"
        timestamp="15:04"
      >
        <StreamingResponse :content="followUp" />
        <template #actions>
          <ChatMessage.Actions>
            <CopyButton
              size="small"
              :value="followUp"
            />
            <Button
              v-if="run === 'error'"
              label="Retry"
              kind="outlined"
              size="small"
              icon="ai ai-refresh"
              @click="approve"
            />
          </ChatMessage.Actions>
        </template>
      </ChatMessage>
    </Conversation>
    <footer class="layout-column-content layout-boundary-inline pb-(--spacing-md)">
      <PromptInput
        v-model="prompt"
        :status="composerState"
        @stop="stop"
      >
        <template #hint>
          The assistant runs nothing in your account without your approval.
        </template>
      </PromptInput>
    </footer>
  </section>
</template>
