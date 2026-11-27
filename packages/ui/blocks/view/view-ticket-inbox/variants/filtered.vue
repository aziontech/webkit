<script setup lang="ts">
  import type { PropertyFilterQuery } from '@aziontech/ui/use-collection'

  import ViewTicketInbox from '../view-ticket-inbox.vue'

  const query: PropertyFilterQuery = {
    tokens: [{ propertyKey: 'channel', operator: '=', value: 'Phone' }],
    operation: 'and'
  }
</script>

<template>
  <ViewTicketInbox :default-query="query" />
</template>
