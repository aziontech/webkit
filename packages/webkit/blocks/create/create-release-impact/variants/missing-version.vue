<script setup lang="ts">
  import CreateReleaseImpact from '../create-release-impact.vue'
  import { sampleResources } from '../sample'

  const resources = sampleResources.map((resource) =>
    resource.name === 'edge-policy' ? { ...resource, versionId: '', versions: [] } : resource
  )
</script>

<template>
  <CreateReleaseImpact :resources="resources" />
</template>
