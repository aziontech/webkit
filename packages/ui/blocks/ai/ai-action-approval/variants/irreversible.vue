<script setup lang="ts">
  import AiActionApproval from '../ai-action-approval.vue'
  import { sampleDeleteMessages, sampleTools } from '../sample'
</script>

<template>
  <AiActionApproval
    :messages="sampleDeleteMessages"
    :tools="sampleTools"
  />
</template>
