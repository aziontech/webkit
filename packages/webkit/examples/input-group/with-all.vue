<script setup>
  import Button from '@aziontech/webkit/button'
  import InputGroup from '@aziontech/webkit/input-group'
</script>

<template>
  <InputGroup>
    <InputGroup.Addon>R$</InputGroup.Addon>
    <input
      placeholder="0.00"
      class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
    />
    <Button
      label="Send"
      kind="primary"
    />
  </InputGroup>
</template>
