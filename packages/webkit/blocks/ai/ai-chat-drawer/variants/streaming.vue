<script setup lang="ts">
  import AiChatDrawer from '../ai-chat-drawer.vue'
  import { sampleStreamingMessages } from '../sample'
</script>

<template>
  <AiChatDrawer
    :messages="sampleStreamingMessages"
    loading
  />
</template>
