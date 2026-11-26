<script setup>
  import Accordion from '@aziontech/webkit/accordion'
</script>

<template>
  <Accordion
    type="multiple"
    :default-value="['overview', 'pricing']"
    class="w-full max-w-[40rem]"
  >
    <Accordion.Item value="overview">
      <Accordion.Trigger>What is Azion?</Accordion.Trigger>
      <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="pricing">
      <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
      <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="support">
      <Accordion.Trigger>Enterprise support</Accordion.Trigger>
      <Accordion.Content>Available on Business and Enterprise plans.</Accordion.Content>
    </Accordion.Item>
  </Accordion>
</template>
