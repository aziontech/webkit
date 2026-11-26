<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const value = ref('My Project')
</script>

<template>
  <Field
    invalid
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Project slug</Field.Label>
    <Input
      v-model="value"
      :spellcheck="false"
      autocomplete="off"
    />
    <Field.Error>Use lowercase letters, numbers and hyphens only.</Field.Error>
  </Field>
</template>
