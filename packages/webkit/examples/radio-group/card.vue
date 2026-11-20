<script setup>
  import RadioGroup from '@aziontech/webkit/radio-group-root'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const plans = [
    {
      value: 'hobby',
      icon: 'az az-sparkles',
      label: 'Hobby',
      description: 'For learning and small personal projects.'
    },
    {
      value: 'pro',
      icon: 'az az-chart-line',
      label: 'Pro',
      description: 'For professional or commercial applications.'
    },
    {
      value: 'scale',
      icon: 'az az-file-check',
      label: 'Scale',
      description: 'For businesses that need advanced security and compliance.'
    }
  ]
  const prices = { hobby: 'Free', pro: '$20 / month', scale: '$200 / month' }
  const plan = ref('pro')
</script>

<template>
  <RadioGroup
    v-model="plan"
    variant="card"
    orientation="horizontal"
    name="plan"
    :options="plans"
    aria-label="Plan"
  >
    <template #tag="{ option }">
      <Tag
        :label="prices[option.value]"
        severity="info"
      />
    </template>
  </RadioGroup>
</template>
