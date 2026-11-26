<script setup lang="ts">
  import { sampleViews } from '../sample'
  import ViewTicketInbox from '../view-ticket-inbox.vue'

  const views = sampleViews.map((view) => (view.key === 'my-open' ? { ...view, count: 0 } : view))
</script>

<template>
  <ViewTicketInbox
    :tickets="[]"
    :views="views"
  />
</template>
