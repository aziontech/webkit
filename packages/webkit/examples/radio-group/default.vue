<script setup>
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  const cycle = ref('monthly')
</script>

<template>
  <RadioGroup
    v-model="cycle"
    name="billing-cycle"
    aria-label="Billing cycle"
  >
    <RadioGroup.Item value="monthly">Monthly</RadioGroup.Item>
    <RadioGroup.Item value="yearly">Yearly, two months free</RadioGroup.Item>
    <RadioGroup.Item
      value="contract"
      disabled
    >
      Annual contract
    </RadioGroup.Item>
  </RadioGroup>
</template>
