<script setup lang="ts">
  import { sampleRunningSteps } from '../sample'
  import StateAsyncSubmit from '../state-async-submit.vue'
</script>

<template>
  <StateAsyncSubmit
    loading
    :steps="sampleRunningSteps"
  />
</template>
