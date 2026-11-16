<script setup lang="ts">
  import AsyncSubmit from '../async-submit.vue'
  import { sampleDeployment } from '../sample'
</script>

<template>
  <AsyncSubmit :deployment="sampleDeployment" />
</template>
