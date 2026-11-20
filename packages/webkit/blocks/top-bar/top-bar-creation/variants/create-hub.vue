<script setup lang="ts">
  import TopBarCreation from '../top-bar-creation.vue'
</script>

<template>
  <TopBarCreation
    back-href="/home"
    back-label="Back to Home"
    :breadcrumb="[{ label: 'Creation Center', active: true }]"
  />
</template>
