<script setup>
  import Field from '@aziontech/webkit/field'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref, useId } from 'vue'

  const labelId = useId()

  const protocol = ref('https')
</script>

<template>
  <Field.Set>
    <Field.Legend
      :id="labelId"
      type="label"
      >Protocol</Field.Legend
    >
    <RadioGroup
      :aria-labelledby="labelId"
      v-model="protocol"
      name="protocol"
      orientation="horizontal"
    >
      <RadioGroup.Item value="http">HTTP</RadioGroup.Item>
      <RadioGroup.Item value="https">HTTPS</RadioGroup.Item>
      <RadioGroup.Item value="both">Both</RadioGroup.Item>
    </RadioGroup>
  </Field.Set>
</template>
