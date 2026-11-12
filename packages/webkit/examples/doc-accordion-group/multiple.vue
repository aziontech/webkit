<script setup>
  import DocAccordionGroup from '@aziontech/webkit/doc-accordion-group'
  import DocAccordionItem from '@aziontech/webkit/doc-accordion-item'
</script>

<template>
  <DocAccordionGroup type="multiple">
    <DocAccordionItem
      title="Which runtimes are supported?"
      default-open
    >
      <p>JavaScript and TypeScript, plus WebAssembly modules compiled from other languages.</p>
    </DocAccordionItem>
    <DocAccordionItem
      title="Is there a cold start?"
      default-open
    >
      <p>Isolates start in under a millisecond, so there is no warm-up to plan for.</p>
    </DocAccordionItem>
  </DocAccordionGroup>
</template>
