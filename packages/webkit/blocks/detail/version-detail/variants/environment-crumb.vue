<script setup lang="ts">
  import { sampleEnvironments } from '../sample'
  import VersionDetail from '../version-detail.vue'
</script>

<template>
  <VersionDetail :environments="sampleEnvironments" />
</template>
