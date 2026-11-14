<script setup>
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  const protocol = ref('https')
</script>

<template>
  <RadioGroup
    v-model="protocol"
    name="protocol"
    orientation="horizontal"
    aria-label="Protocol"
  >
    <RadioGroup.Item value="http">HTTP</RadioGroup.Item>
    <RadioGroup.Item value="https">HTTPS</RadioGroup.Item>
    <RadioGroup.Item value="both">Both</RadioGroup.Item>
  </RadioGroup>
</template>
