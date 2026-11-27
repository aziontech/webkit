<script setup lang="ts">
  import AiChat from '../ai-chat.vue'
  import { sampleStreamingMessages } from '../sample'
</script>

<template>
  <AiChat
    :messages="sampleStreamingMessages"
    loading
  />
</template>
