<script setup>
  import ConversationHistory from '@aziontech/webkit/conversation-history'
</script>

<template>
  <div class="grid w-full gap-(--spacing-xl) sm:grid-cols-2">
    <ConversationHistory
      loading
      label="Conversation history, loading"
    />
    <ConversationHistory
      :items="[]"
      label="Conversation history, empty"
    />
  </div>
</template>
