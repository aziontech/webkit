<script setup>
  import Button from '@aziontech/webkit/button'
  import InputGroup from '@aziontech/webkit/input-group'
</script>

<template>
  <InputGroup>
    <InputGroup.Addon>$</InputGroup.Addon>
    <InputGroup.Input
      aria-label="Amount"
      placeholder="0.00"
    />
    <Button
      label="Send"
      variant="primary"
    />
  </InputGroup>
</template>
