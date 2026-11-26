<script setup>
  import Checkbox from '@aziontech/ui/checkbox'
  import Field from '@aziontech/ui/field'
  import { ref } from 'vue'

  const checked = ref(false)
</script>

<template>
  <Field orientation="horizontal">
    <Checkbox
      v-model="checked"
      indeterminate
    />
    <Field.Label>Select all domains</Field.Label>
  </Field>
</template>
