<script setup lang="ts">
  import PersonalTokens from '../personal-tokens.vue'
</script>

<template>
  <PersonalTokens
    :secret="{
      name: 'Release workflow',
      secret: 'pat_3f9c2a7e5b1d4c8a9e0f6b2d7c4a1e5f9b3d8c2a6e1f4b7d'
    }"
  />
</template>
