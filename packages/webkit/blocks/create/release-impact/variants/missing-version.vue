<script setup lang="ts">
  import ReleaseImpact from '../release-impact.vue'
  import { sampleResources } from '../sample'

  const resources = sampleResources.map((resource) =>
    resource.name === 'edge-policy' ? { ...resource, versionId: '', versions: [] } : resource
  )
</script>

<template>
  <ReleaseImpact :resources="resources" />
</template>
