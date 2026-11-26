<script setup>
  import Field from '@aziontech/webkit/field'
  import NumberInput from '@aziontech/webkit/number-input'
  import { ref } from 'vue'

  const port = ref(null)
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Origin port</Field.Label>
    <NumberInput
      v-model="port"
      nullable
      :min="1"
      :max="65535"
      placeholder="443"
    />
    <Field.Description>Leave empty to use the default port for the protocol.</Field.Description>
  </Field>
</template>
