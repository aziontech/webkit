<script setup>
  import Field from '@aziontech/webkit/field'
  import RadioGroup from '@aziontech/webkit/radio-group-root'
  import Tag from '@aziontech/webkit/tag'
  import { ref, useId } from 'vue'

  const labelId = useId()

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
  <Field.Set>
    <Field.Legend
      :id="labelId"
      type="label"
      >Plan</Field.Legend
    >
    <RadioGroup
      :aria-labelledby="labelId"
      v-model="plan"
      variant="card"
      orientation="horizontal"
      name="plan"
      :options="plans"
    >
      <template #tag="{ option }">
        <Tag
          :label="prices[option.value]"
          severity="info"
        />
      </template>
    </RadioGroup>
  </Field.Set>
</template>
