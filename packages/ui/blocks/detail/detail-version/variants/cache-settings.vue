<script setup lang="ts">
  import DetailVersion from '../detail-version.vue'
  import CacheSettingsTab from '../parts/cache-settings-tab.vue'
</script>

<template>
  <DetailVersion tab="cache-settings">
    <template #cache-settings>
      <CacheSettingsTab />
    </template>
  </DetailVersion>
</template>
