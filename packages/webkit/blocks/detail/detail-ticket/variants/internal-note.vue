<script setup lang="ts">
  import { ref } from 'vue'

  import DetailTicket, { type DetailTicketDraft } from '../detail-ticket.vue'

  const draft = ref<DetailTicketDraft>({
    mode: 'note',
    cc: [],
    body: '@priya.patel can you check whether Safari caches the old chain for this zone?',
    files: []
  })
</script>

<template>
  <DetailTicket v-model:draft="draft" />
</template>
