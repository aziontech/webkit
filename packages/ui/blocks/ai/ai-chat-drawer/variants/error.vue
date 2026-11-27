<script setup lang="ts">
  import AiChatDrawer from '../ai-chat-drawer.vue'
  import { sampleInterruptedError, sampleInterruptedMessages } from '../sample'
</script>

<template>
  <AiChatDrawer
    :messages="sampleInterruptedMessages"
    :error="sampleInterruptedError"
  />
</template>
