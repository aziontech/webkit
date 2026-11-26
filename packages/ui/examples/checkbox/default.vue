<script setup>
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const checked = ref(false)
</script>

<template>
  <Field orientation="horizontal">
    <Checkbox
      v-model="checked"
      name="email-notifications"
    />
    <Field.Label>Email notifications</Field.Label>
  </Field>
</template>
