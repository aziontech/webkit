<script setup lang="ts">
  import SavePerCard from './save-per-card.vue'
</script>

<template>
  <SavePerCard :preview-toolbar="{ defaultDraft: { prod: 'enabled' }, loading: true }" />
</template>
