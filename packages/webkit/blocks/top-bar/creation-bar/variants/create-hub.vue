<script setup lang="ts">
  import CreationBar from '../creation-bar.vue'
</script>

<template>
  <CreationBar
    back-href="/home"
    back-label="Back to Home"
    :breadcrumb="[{ label: 'Creation Center', active: true }]"
  />
</template>
