<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SubagentCard from '@aziontech/webkit/subagent-card'
  import ToolCall from '@aziontech/webkit/tool-call'
  import { ref } from 'vue'

  const status = ref('running')
  const task = JSON.stringify({ workload: 'acme-store', plans: ['Starter', 'Business'] }, null, 2)
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <SubagentCard
      name="researcher"
      title="Comparing cache plans for acme-store"
      :description="
        status === 'running'
          ? 'Reading the pricing page of each plan.'
          : 'Stopped before it finished.'
      "
      :status="status"
      :duration="42"
      stoppable
      default-open
      @stop="status = 'canceled'"
    >
      <template #input>
        <CodeBlock
          :tabs="[{ label: 'JSON', value: 'task', code: task, language: 'json' }]"
          :show-line-numbers="false"
        />
      </template>
      <ToolCall
        name="fetch_page"
        title="Reading https://example.com/pricing"
        status="success"
      />
      <StreamingResponse
        content="The **Business** plan keeps cached objects for 30 days; **Starter** keeps them for 7."
      />
      <SubagentCard
        name="summarizer"
        title="Writing the comparison table"
        status="running"
        :duration="9"
      />
    </SubagentCard>
    <SubagentCard
      name="analyst"
      title="Reading the error rate of www.example.com"
      description="The metrics service did not answer in 30 seconds."
      status="error"
      :duration="31"
    >
      <template #input>
        <p class="m-0 text-body-sm text-(--text-default)">
          Find the hour with the most 5xx responses on www.example.com yesterday.
        </p>
      </template>
    </SubagentCard>
  </div>
</template>
