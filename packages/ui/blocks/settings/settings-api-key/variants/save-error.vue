<script setup lang="ts">
  import { ref } from 'vue'

  import SettingsApiKey from '../settings-api-key.vue'

  const apiKey = ref('acme-replacement-key')
</script>

<template>
  <SettingsApiKey
    v-model:api-key="apiKey"
    error="The key could not be stored. Check your connection or permissions and try again."
  />
</template>
