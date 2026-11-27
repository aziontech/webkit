<script setup>
  import Field from '@aziontech/ui/field'
  import InputGroup from '@aziontech/ui/input-group'
  import { ref } from 'vue'

  const domain = ref('')
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Domain</Field.Label>
    <InputGroup dir="ltr">
      <InputGroup.Addon>https://</InputGroup.Addon>
      <InputGroup.Input
        v-model="domain"
        placeholder="example"
        autocomplete="off"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
    <Field.Description>The apex domain you own.</Field.Description>
  </Field>
</template>
