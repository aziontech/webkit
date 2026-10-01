<script setup>
  // The compliance page with no site chrome: the same AzionCompliance content as
  // LandingCompliance, but with NO SiteNav and NO SiteFooter — for embedding the page on its own
  // (e.g. inside another surface that already provides its own navigation/closing), where the
  // full marketing shell would duplicate that chrome.
  //
  // Still dark-only by design (see useForceDarkTheme), and still owns its own scroll region: the
  // global shell locks html/body/#app to `height: 100dvh; overflow: hidden` (SiteLayout does the
  // same), so this view needs the same scrolling column SiteLayout provides — just without the
  // nav/footer that make it a full site shell.
  import AzionCompliance from '../components/AzionCompliance.vue'
  import { useForceDarkTheme } from '../composables/useForceDarkTheme'

  useForceDarkTheme()
</script>

<template>
  <div class="h-dvh overflow-y-auto bg-(--bg-canvas) text-(--text-default)">
    <AzionCompliance />
  </div>
</template>
