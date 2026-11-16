<script setup lang="ts">
  import AiChat from '../ai-chat.vue'
  import { sampleInterruptedError, sampleInterruptedMessages } from '../sample'
</script>

<template>
  <AiChat
    :messages="sampleInterruptedMessages"
    :error="sampleInterruptedError"
  />
</template>
