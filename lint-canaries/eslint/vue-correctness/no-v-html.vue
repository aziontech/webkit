<script setup lang="ts">
  // CANARY — must keep failing vue/no-v-html (XSS injection path).
  const description = '<strong>unsafe</strong>'
</script>

<template>
  <div v-html="description" />
</template>
