<script setup lang="ts">
  import AiApiKey from '../ai-api-key.vue'
</script>

<template>
  <AiApiKey
    status="error"
    error="The provider refused the key: it is not valid or it was revoked."
  />
</template>
