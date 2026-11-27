<script setup lang="ts">
  import AiChat from '../ai-chat.vue'
  import { sampleLongThread, sampleLongThreadFollowUps } from '../sample'
</script>

<template>
  <AiChat
    :messages="sampleLongThread"
    :follow-ups="sampleLongThreadFollowUps"
  />
</template>
