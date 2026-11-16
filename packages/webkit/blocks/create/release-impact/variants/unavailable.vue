<script setup lang="ts">
  import ReleaseImpact from '../release-impact.vue'
  import { sampleImpact } from '../sample'
</script>

<template>
  <ReleaseImpact
    :impact="sampleImpact"
    error="The projects that deploy with these settings could not be read, so the impact is unknown. Retry, or deploy without the preview."
  />
</template>
