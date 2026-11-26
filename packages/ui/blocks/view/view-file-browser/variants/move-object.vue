<script setup lang="ts">
  import ViewFileBrowser from '../view-file-browser.vue'
</script>

<template>
  <ViewFileBrowser
    path="20260622162046/"
    :selected-keys="['index.html', '404.html']"
    movable
    default-move-open
  />
</template>
