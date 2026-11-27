<script setup lang="ts">
  import DetailVersion from '../detail-version.vue'
  import DeviceGroupsTab from '../parts/device-groups-tab.vue'
</script>

<template>
  <DetailVersion tab="device-groups">
    <template #device-groups>
      <DeviceGroupsTab />
    </template>
  </DetailVersion>
</template>
