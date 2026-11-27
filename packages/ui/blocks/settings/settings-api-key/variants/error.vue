<script setup lang="ts">
  import SettingsApiKey from '../settings-api-key.vue'
</script>

<template>
  <SettingsApiKey
    status="error"
    error="The provider refused the key: it is not valid or it was revoked."
  />
</template>
