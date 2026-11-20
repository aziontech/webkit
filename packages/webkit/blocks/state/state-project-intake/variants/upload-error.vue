<script setup lang="ts">
  import { sampleFailedUploads } from '../sample'
  import StateProjectIntake from '../state-project-intake.vue'
</script>

<template>
  <StateProjectIntake :uploads="sampleFailedUploads" />
</template>
