<script setup lang="ts">
  import AiActionApproval from '../ai-action-approval.vue'
  import { sampleDeniedMessages, sampleTools } from '../sample'
</script>

<template>
  <AiActionApproval
    :messages="sampleDeniedMessages"
    :tools="sampleTools"
  />
</template>
