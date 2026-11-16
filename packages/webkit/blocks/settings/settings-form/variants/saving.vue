<script setup lang="ts">
  import SettingsForm from '../settings-form.vue'
</script>

<template>
  <SettingsForm
    :default-draft="{ email: 'alex.morgan@example.com' }"
    loading
  />
</template>
