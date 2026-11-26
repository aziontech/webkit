<script setup>
  import DocAccordion from '@aziontech/ui/doc-accordion'
  import DocAccordionGroup from '@aziontech/ui/doc-accordion-group'
</script>

<template>
  <DocAccordionGroup>
    <DocAccordion
      title="Can I keep a stale object while the origin is down?"
      default-open
    >
      <p>
        Yes. Turn on stale cache and the last good copy is served until the origin answers again.
      </p>
    </DocAccordion>
  </DocAccordionGroup>
</template>
