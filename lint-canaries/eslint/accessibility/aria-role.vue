<script setup lang="ts">
  // CANARY — must keep failing vuejs-accessibility/aria-role.
  // `btn` is not a valid ARIA role.
  function submit() {
    console.warn('submitted')
  }
</script>

<template>
  <div
    role="btn"
    @click="submit()"
  />
</template>
