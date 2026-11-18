<script setup lang="ts">
  import AuthSignIn from '../auth-sign-in.vue'
</script>

<template>
  <AuthSignIn
    step="password"
    :default-values="{ email: 'jane.doe@example.com', password: 'correct-horse-battery' }"
    loading
  />
</template>
