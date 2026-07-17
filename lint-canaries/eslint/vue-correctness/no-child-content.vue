<script setup lang="ts">
  // CANARY — must keep failing vue/no-child-content.
  // Child content is overwritten by v-text and never renders.
  const label = 'Deploy'
</script>

<template>
  <span v-text="label">This fallback text is silently thrown away</span>
</template>
