<script setup>
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import { ref } from 'vue'

  const value = ref('Example value')
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Project name</Field.Label>
    <Input
      v-model="value"
      placeholder="my-project"
    />
  </Field>
</template>
