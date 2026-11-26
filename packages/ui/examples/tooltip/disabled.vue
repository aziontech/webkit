<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
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
