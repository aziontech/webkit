<script setup>
  import { useForceDarkTheme } from '../composables/useForceDarkTheme'
  import { COMPLIANCE_PAGE } from '../data/pages/compliance.js'
  import SitePage from '../ui/SitePage.vue'

  useForceDarkTheme()
</script>

<template>
  <div class="h-dvh overflow-y-auto bg-(--bg-canvas) text-(--text-default)">
    <SitePage :sections="COMPLIANCE_PAGE" />
  </div>
</template>
