<script setup lang="ts">
  import { sampleUploads } from '../sample'
  import StateProjectIntake from '../state-project-intake.vue'
</script>

<template>
  <StateProjectIntake :uploads="sampleUploads" />
</template>
