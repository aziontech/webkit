<script setup lang="ts">
  import CreateTicket from '../create-ticket.vue'
  import { sampleValues } from '../sample'
</script>

<template>
  <CreateTicket
    :default-values="sampleValues"
    submitting
  />
</template>
