<script setup lang="ts">
  import DetailVersion from '../detail-version.vue'
  import { sampleEarlierSettings } from '../sample'
</script>

<template>
  <DetailVersion
    version-id="AK7D0ZX4"
    :settings="sampleEarlierSettings"
    history-open
  />
</template>
