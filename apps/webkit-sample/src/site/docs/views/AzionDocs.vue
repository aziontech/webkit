<script setup>
  // Routed docs example: the Azion documentation's home ("Welcome to Azion Docs")
  // rendered inside the docs shell (docs top bar and the real documentation
  // sidebar, no console chrome). A landing page is scanned through its own card
  // bands, not through a heading list, so it passes no `toc` slot — DocsLayout then
  // renders no "On this page" rail and the content takes the full width.
  //
  // The shell owns the regions and the page owns its content: pair DocsLayout with a
  // new content component the same way to add further docs pages, passing that
  // page's headings to the `toc` slot when it is a reading page that earns one.
  import DocsGetStarted from '../components/DocsGetStarted.vue'
  import DocsLayout from '../components/DocsLayout.vue'
</script>

<template>
  <DocsLayout>
    <DocsGetStarted />
  </DocsLayout>
</template>
