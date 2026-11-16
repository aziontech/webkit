<script setup>
  import InputGroup from '@aziontech/webkit/input-group'
</script>

<template>
  <InputGroup :required="true">
    <InputGroup.Addon>https://</InputGroup.Addon>
    <InputGroup.Input
      aria-label="Domain"
      placeholder="domain"
      required
    />
    <InputGroup.Addon>.com</InputGroup.Addon>
  </InputGroup>
</template>
