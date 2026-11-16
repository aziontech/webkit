<script setup lang="ts">
  import AsyncSubmit from '../async-submit.vue'
  import { sampleError, sampleFailedSteps } from '../sample'
</script>

<template>
  <AsyncSubmit
    :error="sampleError"
    error-summary="The routing rules were refused."
    :steps="sampleFailedSteps"
  />
</template>
