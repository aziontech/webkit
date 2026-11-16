<script setup lang="ts">
  import { sampleEarlierSettings } from '../sample'
  import VersionDetail from '../version-detail.vue'
</script>

<template>
  <VersionDetail
    version-id="AK7D0ZX4"
    :settings="sampleEarlierSettings"
    history-open
  />
</template>
