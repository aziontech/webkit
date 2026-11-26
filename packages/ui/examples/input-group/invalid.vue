<script setup>
  import Field from '@aziontech/ui/field'
  import InputGroup from '@aziontech/ui/input-group'
  import { ref } from 'vue'

  const value = ref('shop example')
</script>

<template>
  <Field
    invalid
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Domain</Field.Label>
    <InputGroup dir="ltr">
      <InputGroup.Addon>https://</InputGroup.Addon>
      <InputGroup.Input
        v-model="value"
        placeholder="domain"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
    <Field.Error>Use letters, numbers and hyphens only, with no spaces.</Field.Error>
  </Field>
</template>
