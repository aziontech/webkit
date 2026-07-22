<script setup lang="ts">
  // CANARY — must keep failing vue/no-duplicate-attributes.
  // `title` appears twice on the same element — one silently wins.
  const dynamicLabel = 'Dynamic'
</script>

<template>
  <button
    :title="dynamicLabel"
    title="Static"
    type="button"
  >
    Deploy
  </button>
</template>
