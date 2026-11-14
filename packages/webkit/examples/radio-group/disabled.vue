<script setup>
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  const plan = ref('pro')
</script>

<template>
  <RadioGroup
    v-model="plan"
    name="plan"
    disabled
    aria-label="Plan"
  >
    <RadioGroup.Item value="free">Free</RadioGroup.Item>
    <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
    <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
  </RadioGroup>
</template>
