<script setup>
  import InputGroup from '@aziontech/webkit/input-group'
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col gap-4">
    <InputGroup
      dir="ltr"
      size="small"
    >
      <InputGroup.Addon>https://</InputGroup.Addon>
      <InputGroup.Input
        aria-label="Domain"
        placeholder="domain"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
    <InputGroup
      dir="ltr"
      size="medium"
    >
      <InputGroup.Addon>https://</InputGroup.Addon>
      <InputGroup.Input
        aria-label="Domain"
        placeholder="domain"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
    <InputGroup
      dir="ltr"
      size="large"
    >
      <InputGroup.Addon>https://</InputGroup.Addon>
      <InputGroup.Input
        aria-label="Domain"
        placeholder="domain"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
  </div>
</template>
