<script setup lang="ts">
  import { ref } from 'vue'

  import DetailTicket, { type DetailTicketDraft } from '../detail-ticket.vue'

  const draft = ref<DetailTicketDraft>({
    mode: 'reply',
    cc: [],
    body: 'Safari keeps the old certificate for a few minutes. A hard refresh picks up the new one.',
    files: []
  })
</script>

<template>
  <DetailTicket
    v-model:draft="draft"
    send-error="The reply was not sent. Your draft is kept; try again."
  />
</template>
