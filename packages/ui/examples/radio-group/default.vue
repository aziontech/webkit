<script setup>
  import Field from '@aziontech/webkit/field'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref, useId } from 'vue'

  const labelId = useId()

  const cycle = ref('monthly')
</script>

<template>
  <Field.Set>
    <Field.Legend
      :id="labelId"
      type="label"
      >Billing cycle</Field.Legend
    >
    <RadioGroup
      :aria-labelledby="labelId"
      v-model="cycle"
      name="billing-cycle"
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
  </Field.Set>
</template>
