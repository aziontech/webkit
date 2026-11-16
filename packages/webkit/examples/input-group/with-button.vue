<script setup>
  import Button from '@aziontech/webkit/button'
  import InputGroupInput from '@aziontech/webkit/input-group-input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
</script>

<template>
  <InputGroupRoot>
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
