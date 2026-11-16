<script setup lang="ts">
  import { sampleUsers } from '../sample'
  import Users from '../users.vue'
</script>

<template>
  <Users :users="sampleUsers.slice(0, 1)" />
</template>
