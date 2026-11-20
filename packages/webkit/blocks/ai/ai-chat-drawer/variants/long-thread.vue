<script setup lang="ts">
  import AiChatDrawer from '../ai-chat-drawer.vue'
  import { sampleLongThread, sampleLongThreadFollowUps } from '../sample'
</script>

<template>
  <AiChatDrawer
    :messages="sampleLongThread"
    :follow-ups="sampleLongThreadFollowUps"
  />
</template>
