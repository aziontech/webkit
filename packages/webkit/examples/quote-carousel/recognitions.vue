<script setup>
  import QuoteCarousel from '@aziontech/webkit/quote-carousel'
</script>

<template>
  <QuoteCarousel
    aria-label="Analyst recognitions"
    :items="[
      {
        text: 'Named a Leader and Fast Mover, and the only vendor whose platform meets every key criterion the report sets for a full-stack edge deployment.',
        jobTitle: 'GigaOm Radar for Full-Stack Edge Deployments v3 — May 2026',
        mark: 'gigaom'
      },
      {
        text: 'Evaluated as a Strong Performer among the edge development platforms that matter most.',
        jobTitle: 'The Forrester Wave™: Edge Development Platforms, Q1 2026 — March 2026',
        mark: 'forrester'
      },
      {
        text: 'Covered as a vendor in the market guide that defines the edge distribution platform category, in two consecutive editions.',
        jobTitle: 'Gartner Market Guide for Edge Distribution Platforms — November 2025',
        mark: 'gartner'
      },
      {
        text: 'Recognized as Latin America Company of the Year in the edge distribution platform industry.',
        jobTitle: 'Frost & Sullivan, 2026 Latin America Company of the Year — June 2026',
        mark: 'frost-and-sullivan'
      }
    ]"
  />
</template>
