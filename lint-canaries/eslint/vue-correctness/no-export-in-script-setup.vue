<script setup lang="ts">
  // CANARY — must keep failing vue/no-export-in-script-setup.
  // A runtime export inside script setup does not work.
  export const FOCUS_RING = 'focus-visible-ring'
</script>

<template>
  <button type="button">Deploy</button>
</template>
