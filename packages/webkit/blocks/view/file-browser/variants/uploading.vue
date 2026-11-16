<script setup lang="ts">
  import FileBrowser from '../file-browser.vue'
  import { sampleTransfers } from '../sample'
</script>

<template>
  <FileBrowser :transfers="sampleTransfers" />
</template>
