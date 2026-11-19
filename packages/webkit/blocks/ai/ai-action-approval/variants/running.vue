<script setup lang="ts">
  import AiActionApproval from '../ai-action-approval.vue'
  import { sampleRunningMessages, sampleTools } from '../sample'
</script>

<template>
  <AiActionApproval
    :messages="sampleRunningMessages"
    :tools="sampleTools"
    loading
  />
</template>
