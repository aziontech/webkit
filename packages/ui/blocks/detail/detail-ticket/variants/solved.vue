<script setup lang="ts">
  import DetailTicket from '../detail-ticket.vue'
  import { sampleNow, sampleTicket } from '../sample'

  const ticket = { ...sampleTicket, status: 'Solved' as const, slaDueAt: null }
</script>

<template>
  <DetailTicket
    :ticket="ticket"
    :now="sampleNow"
  />
</template>
