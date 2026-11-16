<script setup lang="ts">
  import AiActionApproval from '../ai-action-approval.vue'
  import { sampleOutcomes } from '../sample'
</script>

<template>
  <AiActionApproval
    decision="denied"
    run="denied"
    :outcome="sampleOutcomes.denied"
  />
</template>
