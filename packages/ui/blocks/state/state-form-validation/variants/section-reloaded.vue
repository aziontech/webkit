<script setup lang="ts">
  import { sampleReloadedOrigins } from '../sample'
  import SectionRejected from './section-rejected.vue'
</script>

<template>
  <SectionRejected
    :origins="sampleReloadedOrigins"
    origin-error=""
  />
</template>
