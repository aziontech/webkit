<script setup lang="ts">
  import { sampleDeployment } from '../sample'
  import StateAsyncSubmit from '../state-async-submit.vue'
</script>

<template>
  <StateAsyncSubmit :deployment="sampleDeployment" />
</template>
