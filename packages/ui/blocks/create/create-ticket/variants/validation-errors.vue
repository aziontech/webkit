<script setup lang="ts">
  import CreateTicket from '../create-ticket.vue'
</script>

<template>
  <CreateTicket
    :default-values="{ subject: 'Invoice shows the wrong billing address', cc: ['finance team'] }"
    default-submitted
  />
</template>
