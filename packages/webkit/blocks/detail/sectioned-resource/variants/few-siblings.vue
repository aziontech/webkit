<script setup lang="ts">
  import { ref } from 'vue'

  import { sampleNetworkSections } from '../sample'
  import SectionedResource from '../sectioned-resource.vue'

  const page = ref('firewall-rules')
</script>

<template>
  <SectionedResource
    v-model:page="page"
    :sections="sampleNetworkSections"
    current-tab="network-security"
  />
</template>
