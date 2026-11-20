<script setup lang="ts">
  import SignUp from './sign-up.vue'
</script>

<template>
  <SignUp
    default-email="jane.doe@example.com"
    error="email-taken"
  />
</template>
