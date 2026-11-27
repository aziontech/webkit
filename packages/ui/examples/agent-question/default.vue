<script setup>
  import AgentQuestion from '@aziontech/ui/agent-question'
  import { ref } from 'vue'

  const answer = ref('')
  const status = ref('pending')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <AgentQuestion
      v-model="answer"
      title="Which environment should the new `waf-rules` set go to?"
      description="The rule set exists in both workloads. I can add it to one now and copy it to the other later."
      :options="[
        { value: 'staging', label: 'Staging', description: 'Preview traffic only.' },
        { value: 'production', label: 'Production', description: 'Serves live traffic.' }
      ]"
      :status="status"
      submit-label="Use this environment"
      skippable
      @submit="status = 'success'"
      @skip="status = 'skipped'"
    />
  </div>
</template>
