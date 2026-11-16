<script setup lang="ts">
  import FileBrowser from '../file-browser.vue'
</script>

<template>
  <FileBrowser
    path="20260622162046/"
    :selection="['index.html', '404.html']"
    movable
    default-move-open
  />
</template>
