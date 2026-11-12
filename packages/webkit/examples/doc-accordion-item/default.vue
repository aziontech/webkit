<script setup>
  import DocAccordionGroup from '@aziontech/webkit/doc-accordion-group'
  import DocAccordionItem from '@aziontech/webkit/doc-accordion-item'
</script>

<template>
  <DocAccordionGroup>
    <DocAccordionItem
      title="Can I keep a stale object while the origin is down?"
      default-open
    >
      <p>
        Yes. Turn on stale cache and the last good copy is served until the origin answers again.
      </p>
    </DocAccordionItem>
  </DocAccordionGroup>
</template>
