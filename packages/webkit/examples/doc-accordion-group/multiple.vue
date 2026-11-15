<script setup>
  import DocAccordion from '@aziontech/webkit/doc-accordion'
  import DocAccordionGroup from '@aziontech/webkit/doc-accordion-group'
</script>

<template>
  <DocAccordionGroup type="multiple">
    <DocAccordion
      title="Which runtimes are supported?"
      default-open
    >
      <p>JavaScript and TypeScript, plus WebAssembly modules compiled from other languages.</p>
    </DocAccordion>
    <DocAccordion
      title="Is there a cold start?"
      default-open
    >
      <p>Isolates start in under a millisecond, so there is no warm-up to plan for.</p>
    </DocAccordion>
  </DocAccordionGroup>
</template>
