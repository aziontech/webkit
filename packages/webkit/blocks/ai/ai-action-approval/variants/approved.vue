<script setup lang="ts">
  import AiActionApproval from '../ai-action-approval.vue'
  import { sampleApprovedMessages, sampleTools } from '../sample'
</script>

<template>
  <AiActionApproval
    :messages="sampleApprovedMessages"
    :tools="sampleTools"
  />
</template>
