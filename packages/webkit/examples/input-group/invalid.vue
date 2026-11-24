<script setup>
  import InputGroup from '@aziontech/webkit/input-group'
</script>

<template>
  <InputGroup
    dir="ltr"
    :invalid="true"
  >
    <InputGroup.Addon>https://</InputGroup.Addon>
    <InputGroup.Input
      aria-label="Domain"
      placeholder="domain"
    />
    <InputGroup.Addon>.com</InputGroup.Addon>
  </InputGroup>
</template>
