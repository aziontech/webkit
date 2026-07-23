<script setup>
  // Routed docs example: the Azion developer-docs home rendered inside the docs
  // shell (docs top bar + filterable sidebar, no console chrome). Pair DocsLayout
  // with a new content component the same way to add further docs pages.
  import DocsHome from './DocsHome.vue'
  import DocsLayout from './DocsLayout.vue'
</script>

<template>
  <DocsLayout>
    <DocsHome />
  </DocsLayout>
</template>
