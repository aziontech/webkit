<script setup>
  import Button from '@aziontech/ui/button'
  import InputGroup from '@aziontech/ui/input-group'
</script>

<template>
  <InputGroup class="w-full max-w-(--container-xs)">
    <InputGroup.Addon>$</InputGroup.Addon>
    <InputGroup.Input
      aria-label="Amount"
      placeholder="0.00"
    />
    <Button
      label="Send"
      variant="primary"
      size="medium"
    />
  </InputGroup>
</template>
