<script setup lang="ts">
  import AccountUsers from '../account-users.vue'
  import { sampleUsers } from '../sample'
</script>

<template>
  <AccountUsers :users="sampleUsers.slice(0, 1)" />
</template>
