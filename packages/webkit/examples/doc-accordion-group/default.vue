<script setup>
  import DocAccordion from '@aziontech/webkit/doc-accordion'
  import DocAccordionGroup from '@aziontech/webkit/doc-accordion-group'
</script>

<template>
  <DocAccordionGroup>
    <DocAccordion
      title="Why does my first request miss the cache?"
      default-open
    >
      <p>Each location warms up on its own first request. Warm-up is per location, not global.</p>
    </DocAccordion>
    <DocAccordion title="Can I purge a single path?">
      <p>Yes. Purge by URL for one object, or by wildcard for a folder.</p>
    </DocAccordion>
    <DocAccordion title="How long does a purge take to reach every location?">
      <p>Usually a few seconds. The purge request returns once every location has confirmed it.</p>
    </DocAccordion>
  </DocAccordionGroup>
</template>
