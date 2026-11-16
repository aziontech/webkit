<script setup lang="ts">
  import ProjectIntake from '../project-intake.vue'
  import { sampleFailedUploads } from '../sample'
</script>

<template>
  <ProjectIntake :uploads="sampleFailedUploads" />
</template>
