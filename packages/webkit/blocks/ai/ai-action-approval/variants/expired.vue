<script setup lang="ts">
  import AiActionApproval from '../ai-action-approval.vue'
  import { sampleOutcomes } from '../sample'
</script>

<template>
  <AiActionApproval
    decision="expired"
    :outcome="sampleOutcomes.expired"
  />
</template>
