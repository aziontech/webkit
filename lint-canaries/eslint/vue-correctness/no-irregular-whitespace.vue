<script setup lang="ts">
  // CANARY — must keep failing vue/no-irregular-whitespace.
  // The gap in "Deploy now" below is U+00A0 (no-break space), not a regular space.
  const label = 'Deploy'
</script>

<template>
  <span>Deploy now {{ label }}</span>
</template>
