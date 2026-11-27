<script setup lang="ts">
  import CreateHub from '../create-hub.vue'
  import { sampleAccounts } from '../sample'
</script>

<template>
  <CreateHub :accounts="sampleAccounts" />
</template>
