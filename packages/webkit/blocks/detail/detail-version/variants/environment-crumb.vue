<script setup lang="ts">
  import DetailVersion from '../detail-version.vue'
  import { sampleEnvironments } from '../sample'
</script>

<template>
  <DetailVersion :environments="sampleEnvironments" />
</template>
