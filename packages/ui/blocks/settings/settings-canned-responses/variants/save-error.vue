<script setup lang="ts">
  import SettingsCannedResponses from '../settings-canned-responses.vue'
</script>

<template>
  <SettingsCannedResponses
    editor-open
    editing-key="cr-request-id"
    save-error="The response wasn't saved. Agents still insert the previous version; save again to apply your changes."
  />
</template>
