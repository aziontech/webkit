<script setup lang="ts">
  import { sampleError, sampleFailedSteps } from '../sample'
  import StateAsyncSubmit from '../state-async-submit.vue'
</script>

<template>
  <StateAsyncSubmit
    :error="sampleError"
    error-summary="The routing rules were refused."
    :steps="sampleFailedSteps"
  />
</template>
