<script setup>
  import Field from '@aziontech/webkit/field'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  const region = ref()
</script>

<template>
  <form class="max-w-(--container-sm)">
    <Field.Set>
      <Field.Legend>Region</Field.Legend>
      <Field.Description>Where the first copy of your data is stored.</Field.Description>
      <RadioGroup
        v-model="region"
        name="region"
        required
      >
        <RadioGroup.Item value="us-east">US East</RadioGroup.Item>
        <RadioGroup.Item value="eu-west">EU West</RadioGroup.Item>
        <RadioGroup.Item value="ap-south">Asia Pacific South</RadioGroup.Item>
      </RadioGroup>
    </Field.Set>
  </form>
</template>
