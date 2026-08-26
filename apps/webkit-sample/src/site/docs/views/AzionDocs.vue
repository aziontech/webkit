<script setup>
  // Routed docs example: the Azion documentation's home ("Welcome to Azion Docs")
  // rendered inside the docs shell (docs top bar and the real documentation
  // sidebar, no console chrome). A landing page is scanned through its own card
  // grids, not through a heading list, so it passes no `toc` slot — DocsLayout then
  // renders no "On this page" rail and the content takes the full width.
  //
  // THE HOME IS A PAGE, `Getting Started` IS A SECTION. The rail's first segment carries
  // that title and this page is the `Overview` row inside it, so the two are no longer the
  // same word (see docs-nav.js). The component it renders is `DocsHome` for the same
  // reason — it used to be named after the row.
  //
  // AND NO MASTHEAD EITHER. A masthead is the reading chrome: a trail that says where in
  // the documentation you are, the page's name, and a Copy page control for handing that
  // page to an assistant. The home is none of those — its trail could only point at
  // itself, and what a reader would copy is a directory of links, not a page with an
  // answer in it. So `DocsHome` draws none and its column meets the top bar directly,
  // while every reading page opens on one (see DocsMdxPage) — which is what makes the
  // chrome appear exactly where it has a job.
  import DocsHome from '../components/DocsHome.vue'
  import DocsLayout from '../components/DocsLayout.vue'
</script>

<template>
  <DocsLayout>
    <DocsHome />
  </DocsLayout>
</template>
