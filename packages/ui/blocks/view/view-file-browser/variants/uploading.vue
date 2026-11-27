<script setup lang="ts">
  import { sampleTransfers } from '../sample'
  import ViewFileBrowser from '../view-file-browser.vue'
</script>

<template>
  <ViewFileBrowser :transfers="sampleTransfers" />
</template>
