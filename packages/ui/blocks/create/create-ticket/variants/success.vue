<script setup lang="ts">
  import CreateTicket from '../create-ticket.vue'
  import { sampleCreated } from '../sample'
</script>

<template>
  <CreateTicket :created="sampleCreated" />
</template>
