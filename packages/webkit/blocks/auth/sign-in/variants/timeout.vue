<script setup lang="ts">
  import SignIn from '../sign-in.vue'
</script>

<template>
  <SignIn
    step="password"
    :default-values="{ email: 'jane.doe@example.com', password: 'correct-horse-battery' }"
    error="timeout"
  />
</template>
