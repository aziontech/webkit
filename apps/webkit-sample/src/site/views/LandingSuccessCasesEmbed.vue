<script setup>
  import { useForceDarkTheme } from '../composables/useForceDarkTheme'
  import { SUCCESS_CASES_PAGE } from '../data/pages/success-cases.js'
  import SitePage from '../ui/SitePage.vue'

  useForceDarkTheme()
</script>

<template>
  <div
    class="h-dvh overflow-y-auto scroll-smooth bg-(--bg-canvas) text-(--text-default) motion-reduce:scroll-auto"
  >
    <SitePage :sections="SUCCESS_CASES_PAGE" />
  </div>
</template>
