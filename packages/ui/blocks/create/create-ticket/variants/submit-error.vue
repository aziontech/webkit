<script setup lang="ts">
  import CreateTicket from '../create-ticket.vue'
  import { sampleValues } from '../sample'
</script>

<template>
  <CreateTicket
    :default-values="sampleValues"
    error="The ticket service didn't answer. Your entries are kept: try again."
  />
</template>
