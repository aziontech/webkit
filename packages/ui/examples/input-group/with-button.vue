<script setup>
  import Button from '@aziontech/ui/button'
  import InputGroupInput from '@aziontech/ui/input-group-input'
  import InputGroupRoot from '@aziontech/ui/input-group-root'
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
      size="medium"
    />
  </InputGroupRoot>
</template>
