<script setup lang="ts">
  import PolicySettingsPage from '../parts/policy-settings-page.vue'
</script>

<template>
  <PolicySettingsPage
    :default-draft="{ debugRules: true }"
    default-saving
  />
</template>
