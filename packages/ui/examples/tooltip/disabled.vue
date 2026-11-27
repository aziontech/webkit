<script setup>
  import IconButton from '@aziontech/ui/icon-button'
  import Tooltip from '@aziontech/ui/tooltip'
</script>

<template>
  <Tooltip
    content="Copies the request ID to the clipboard"
    disabled
  >
    <IconButton
      icon="az az-copy"
      aria-label="Copy request ID"
      variant="outline"
      size="medium"
    />
  </Tooltip>
</template>
