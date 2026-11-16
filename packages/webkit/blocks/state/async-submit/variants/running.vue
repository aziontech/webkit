<script setup lang="ts">
  import AsyncSubmit from '../async-submit.vue'
  import { sampleRunningSteps } from '../sample'
</script>

<template>
  <AsyncSubmit
    loading
    :steps="sampleRunningSteps"
  />
</template>
