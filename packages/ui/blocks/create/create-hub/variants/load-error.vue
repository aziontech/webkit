<script setup lang="ts">
  import CreateHub from '../create-hub.vue'
  import { sampleAccounts } from '../sample'
</script>

<template>
  <CreateHub
    :accounts="sampleAccounts"
    error="The repositories in this scope didn't load. GitHub didn't answer in time."
  />
</template>
