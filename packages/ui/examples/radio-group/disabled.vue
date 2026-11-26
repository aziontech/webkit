<script setup>
  import Field from '@aziontech/webkit/field'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref, useId } from 'vue'

  const labelId = useId()

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
      name="plan"
      disabled
    >
      <RadioGroup.Item value="free">Free</RadioGroup.Item>
      <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
    </RadioGroup>
  </Field.Set>
</template>
