<script setup>
  import Field from '@aziontech/ui/field'
  import InputGroup from '@aziontech/ui/input-group'
</script>

<template>
  <Field
    required
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Domain</Field.Label>
    <InputGroup dir="ltr">
      <InputGroup.Addon>https://</InputGroup.Addon>
      <InputGroup.Input placeholder="domain" />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
  </Field>
</template>
