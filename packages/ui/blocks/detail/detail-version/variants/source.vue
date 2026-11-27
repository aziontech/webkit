<script setup lang="ts">
  import DetailVersion from '../detail-version.vue'
  import SourceFiles from '../parts/source-files.vue'
</script>

<template>
  <DetailVersion tab="source">
    <template #source>
      <SourceFiles />
    </template>
  </DetailVersion>
</template>
