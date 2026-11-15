<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import { ref } from 'vue'

  const status = ref('pending')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ToolApproval
      title="Allow `azion deploy --env production`?"
      description="Deploys the current build of storefront to production. The previous version stays available for rollback."
      approve-label="Deploy"
      :status="status"
      @approve="status = 'approved'"
      @deny="status = 'denied'"
    >
      <CodeBlock
        :tabs="[
          {
            label: 'Shell',
            value: 'cmd',
            code: 'azion deploy --env production --workload storefront',
            language: 'bash'
          }
        ]"
        :line-numbers="false"
      />
    </ToolApproval>
  </div>
</template>
