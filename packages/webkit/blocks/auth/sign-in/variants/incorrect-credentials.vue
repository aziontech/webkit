<script setup lang="ts">
  import SignIn from '../sign-in.vue'
</script>

<template>
  <SignIn
    step="password"
    :default-values="{ email: 'jane.doe@example.com' }"
    error="bad-credentials"
  />
</template>
