<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Field
    disabled
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Project name</Field.Label>
    <Input
      v-model="value"
      placeholder="my-project"
      disabled
    />
  </Field>
</template>
