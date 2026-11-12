<script setup>
  import InputGroup from '@aziontech/webkit/input-group'
  import Button from '@aziontech/webkit/button'
  import Select from '@aziontech/webkit/select'
</script>

<template>
  <InputGroup>
    <input
      placeholder="domain"
      class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
    />
    <Button
      label="Search"
      kind="primary"
    />
  </InputGroup>
</template>
