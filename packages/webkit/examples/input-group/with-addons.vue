<script setup>
  import InputGroup from '@aziontech/webkit/input-group'
</script>

<template>
  <InputGroup
    dir="ltr"
    class="w-full max-w-(--container-xs)"
  >
    <InputGroup.Addon>https://</InputGroup.Addon>
    <InputGroup.Input
      aria-label="Domain"
      placeholder="domain"
    />
    <InputGroup.Addon>.com</InputGroup.Addon>
  </InputGroup>
</template>
