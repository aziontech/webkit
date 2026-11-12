<script setup>
  import ActionConfirmation from '@aziontech/webkit/action-confirmation'
  import CodeBlock from '@aziontech/webkit/code-block'
  import { ref } from 'vue'

  const state = ref('pending')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ActionConfirmation
      title="Allow `azion deploy --env production`?"
      description="Deploys the current build of storefront to production. The previous version stays available for rollback."
      approve-label="Deploy"
      :state="state"
      @approve="state = 'approved'"
      @deny="state = 'denied'"
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
        :show-line-numbers="false"
      />
    </ActionConfirmation>
  </div>
</template>
