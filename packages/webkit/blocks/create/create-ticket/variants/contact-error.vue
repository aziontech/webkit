<script setup lang="ts">
  import CreateTicket from '../create-ticket.vue'
</script>

<template>
  <CreateTicket
    :default-values="{ requester: { id: '', name: 'Riley Chen', email: 'riley.chen@example' } }"
    default-submitted
  />
</template>
