<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Short name</Field.Label>
    <Input
      v-model="value"
      :max-length="10"
    />
    <Field.Description>Up to 10 characters.</Field.Description>
  </Field>
</template>
