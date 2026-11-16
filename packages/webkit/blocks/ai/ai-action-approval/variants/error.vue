<script setup lang="ts">
  import AiActionApproval from '../ai-action-approval.vue'
  import { sampleOutcomes } from '../sample'
</script>

<template>
  <AiActionApproval
    decision="approved"
    run="error"
    :outcome="sampleOutcomes.failed"
  />
</template>
