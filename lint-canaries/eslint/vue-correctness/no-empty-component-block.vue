<script setup lang="ts">
  // CANARY — must keep failing vue/no-empty-component-block.
  // The empty style block at the end is dead weight.
  const label = 'Deploy'
</script>

<template>
  <span>{{ label }}</span>
</template>

<style scoped></style>
