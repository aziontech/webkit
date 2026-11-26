<script setup lang="ts">
  import type { PropertyFilterQuery } from '@aziontech/webkit/use-collection'

  import SettingsCannedResponses from '../settings-canned-responses.vue'

  const query: PropertyFilterQuery = {
    tokens: [
      { propertyKey: 'folder', operator: '=', value: 'Billing' },
      { propertyKey: 'visibility', operator: '=', value: 'personal' }
    ],
    operation: 'and'
  }
</script>

<template>
  <SettingsCannedResponses :default-query="query" />
</template>
