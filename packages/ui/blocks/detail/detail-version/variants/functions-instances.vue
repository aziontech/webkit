<script setup lang="ts">
  import DetailVersion from '../detail-version.vue'
  import FunctionsInstancesTab from '../parts/functions-instances-tab.vue'
</script>

<template>
  <DetailVersion tab="functions-instances">
    <template #functions-instances>
      <FunctionsInstancesTab />
    </template>
  </DetailVersion>
</template>
