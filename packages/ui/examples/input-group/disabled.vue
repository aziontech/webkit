<script setup>
  import InputGroup from '@aziontech/ui/input-group'
</script>

<template>
  <InputGroup
    class="w-full max-w-(--container-xs)"
    dir="ltr"
    :disabled="true"
  >
    <InputGroup.Addon>https://</InputGroup.Addon>
    <InputGroup.Input
      aria-label="Domain"
      placeholder="domain"
    />
    <InputGroup.Addon>.com</InputGroup.Addon>
  </InputGroup>
</template>
