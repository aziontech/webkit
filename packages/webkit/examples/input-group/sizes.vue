<script setup>
  import InputGroup from '@aziontech/webkit/input-group'
  import Button from '@aziontech/webkit/button'
  import Select from '@aziontech/webkit/select'
</script>

<template>
  <div class="flex flex-col gap-4">
    <InputGroup size="small">
      <InputGroup.Addon>https://</InputGroup.Addon>
      <input
        placeholder="domain"
        class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
    <InputGroup size="medium">
      <InputGroup.Addon>https://</InputGroup.Addon>
      <input
        placeholder="domain"
        class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
    <InputGroup size="large">
      <InputGroup.Addon>https://</InputGroup.Addon>
      <input
        placeholder="domain"
        class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
      />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup>
  </div>
</template>
