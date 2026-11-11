<script setup>
  import DocAccordionGroup from '@aziontech/webkit/doc-accordion-group'
  import DocAccordionItem from '@aziontech/webkit/doc-accordion-item'
</script>

<template>
  <DocAccordionGroup>
    <DocAccordionItem
      title="Why does my first request miss the cache?"
      default-open
    >
      <p>Each location warms up on its own first request. Warm-up is per location, not global.</p>
    </DocAccordionItem>
    <DocAccordionItem title="Can I purge a single path?">
      <p>Yes. Purge by URL for one object, or by wildcard for a folder.</p>
    </DocAccordionItem>
    <DocAccordionItem title="How long does a purge take to reach every location?">
      <p>Usually a few seconds. The purge request returns once every location has confirmed it.</p>
    </DocAccordionItem>
  </DocAccordionGroup>
</template>
