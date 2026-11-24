<script setup>
  import Button from '@aziontech/webkit/button'
  import InputGroupInput from '@aziontech/webkit/input-group-input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
</script>

<template>
  <InputGroupRoot class="w-full max-w-(--container-xs)">
    <InputGroupInput
      aria-label="Domain"
      placeholder="domain"
    />
    <Button
      label="Search"
      variant="primary"
    />
  </InputGroupRoot>
</template>
