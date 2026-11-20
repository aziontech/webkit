<script setup>
  import KeyValueList from '@aziontech/webkit/key-value-list'
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
      <KeyValueList aria-label="Command to run">
        <KeyValueList.Item label="Command">
          <code class="text-label-code-sm [overflow-wrap:anywhere] text-(--text-default)"
            >azion deploy --env production --workload storefront</code
          >
        </KeyValueList.Item>
        <KeyValueList.Item label="Environment">production</KeyValueList.Item>
        <KeyValueList.Item label="Workload">storefront</KeyValueList.Item>
      </KeyValueList>
    </ToolApproval>
  </div>
</template>
