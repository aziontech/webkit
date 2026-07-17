<script setup lang="ts">
  // CANARY — must keep failing vuejs-accessibility/click-events-have-key-events.
  // A clickable div with no keyboard handler is not keyboard-operable.
  function toggle() {
    console.warn('toggled')
  }
</script>

<template>
  <div @click="toggle()">Expand</div>
</template>
