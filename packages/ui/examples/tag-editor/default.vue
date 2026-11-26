<script setup>
  import TagEditor from '@aziontech/webkit/tag-editor'
  import { ref } from 'vue'

  const tags = ref([
    { key: 'team', value: 'payments', existing: true },
    { key: 'cost-center', value: 'cc-1042', existing: true },
    { key: 'environment', value: 'staging' }
  ])

  const keySuggestions = ['team', 'cost-center', 'environment', 'owner', 'project']
  const valueSuggestions = { environment: ['production', 'staging', 'preview'] }
</script>

<template>
  <TagEditor
    v-model:tags="tags"
    :key-suggestions="keySuggestions"
    :value-suggestions="valueSuggestions"
    aria-label="Resource tags"
  />
</template>
