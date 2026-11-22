<script setup lang="ts">
  import MfaCodeCard from '../parts/mfa-code-card.vue'
  import SignInFrame from '../parts/sign-in-frame.vue'
</script>

<template>
  <SignInFrame>
    <MfaCodeCard />
  </SignInFrame>
</template>
