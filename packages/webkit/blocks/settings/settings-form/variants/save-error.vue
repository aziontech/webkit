<script setup lang="ts">
  import SettingsForm from '../settings-form.vue'
</script>

<template>
  <SettingsForm
    :default-draft="{ timezone: 'america-new_york' }"
    error="The request didn't reach the server. Your changes are kept."
  />
</template>
