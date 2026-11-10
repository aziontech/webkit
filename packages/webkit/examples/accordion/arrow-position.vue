<script setup>
  import Accordion from '@aziontech/webkit/accordion'
</script>

<template>
  <div class="flex flex-col gap-8 w-full max-w-[40rem]">
    <Accordion
      type="single"
      collapsible
      default-value="overview"
      arrow-position="right"
    >
      <Accordion.Item value="overview">
        <Accordion.Trigger>What is Azion?</Accordion.Trigger>
        <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="pricing">
        <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
        <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
    <Accordion
      type="single"
      collapsible
      default-value="overview"
      arrow-position="left"
    >
      <Accordion.Item value="overview">
        <Accordion.Trigger>What is Azion?</Accordion.Trigger>
        <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="pricing">
        <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
        <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  </div>
</template>
