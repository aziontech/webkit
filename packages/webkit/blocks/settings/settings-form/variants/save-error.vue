<script setup lang="ts">
  import SettingsForm from '../settings-form.vue'
</script>

<template>
  <SettingsForm
    :default-draft="{ email: 'alex.morgan@example.com' }"
    error="The request didn't reach the server. Your changes are kept."
  />
</template>
