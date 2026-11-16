<script setup lang="ts">
  import ProjectIntake from '../project-intake.vue'
  import { sampleUploads } from '../sample'
</script>

<template>
  <ProjectIntake :uploads="sampleUploads" />
</template>
