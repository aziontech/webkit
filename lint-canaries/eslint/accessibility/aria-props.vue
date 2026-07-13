<script setup lang="ts">
  // CANARY — must keep failing vuejs-accessibility/aria-props.
  // `aria-lable` is a typo assistive tech silently ignores.
</script>

<template>
  <button
    aria-lable="Close"
    type="button"
  >
    ×
  </button>
</template>
