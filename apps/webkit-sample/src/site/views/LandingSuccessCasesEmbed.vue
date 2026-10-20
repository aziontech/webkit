<script setup>
  // The success-case library with no SiteNav and no SiteFooter, for sharing the page on its own.
  // It keeps the scrolling column SiteLayout provides, since the shell locks the document scroll.
  import AzionSuccessCases from '../components/AzionSuccessCases.vue'
  import { useForceDarkTheme } from '../composables/useForceDarkTheme'

  useForceDarkTheme()
</script>

<template>
  <div
    class="h-dvh overflow-y-auto scroll-smooth bg-(--bg-canvas) text-(--text-default) motion-reduce:scroll-auto"
  >
    <AzionSuccessCases />
  </div>
</template>
