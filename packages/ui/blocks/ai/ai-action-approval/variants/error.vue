<script setup lang="ts">
  import AiActionApproval from '../ai-action-approval.vue'
  import { sampleFailedMessages, sampleTools } from '../sample'
</script>

<template>
  <AiActionApproval
    :messages="sampleFailedMessages"
    :tools="sampleTools"
  />
</template>
