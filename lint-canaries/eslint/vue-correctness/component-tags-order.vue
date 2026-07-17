<template>
  <button type="button">{{ label }}</button>
</template>

<script setup lang="ts">
  // CANARY — must keep failing vue/component-tags-order.
  // The template block appears above the script block.
  const label = 'Deploy'
</script>
