<script setup>
  import { ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import InputGroup from '@aziontech/webkit/input-group'

  const domain = ref('')
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Domain</Field.Label>
    <InputGroup>
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
