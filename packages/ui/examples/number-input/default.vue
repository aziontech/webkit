<script setup>
  import Field from '@aziontech/webkit/field'
  import NumberInput from '@aziontech/webkit/number-input'
  import { ref } from 'vue'

  const value = ref(1)
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Quantity</Field.Label>
    <NumberInput
      v-model="value"
      :min="0"
      :max="100"
      :step="1"
    />
    <Field.Description>From 0 to 100.</Field.Description>
  </Field>
</template>
