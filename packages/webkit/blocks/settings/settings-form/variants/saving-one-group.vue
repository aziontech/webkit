<script setup lang="ts">
  import SavePerGroup from './save-per-group.vue'
</script>

<template>
  <SavePerGroup :general="{ defaultDraft: { language: 'es' }, loading: true }" />
</template>
